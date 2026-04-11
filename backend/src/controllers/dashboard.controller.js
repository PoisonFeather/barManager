import * as dashboardService from "../services/dashboard.service.js";
import { mergeTablesService } from "../services/dashboard.service.js";
import { pool as db } from "../db/pool.js";
/**
 * Funcție helper pentru gestionarea codurilor de eroare
 */
function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

// 1. SUMAR DASHBOARD (Mesele colorate)
export async function dashboardSummaryHandler(req, res) {
  try {
    const { barId } = req.params;
    const result = await dashboardService.getDashboardSummary(barId);
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

// 2. APROBARE MASĂ (Când apeși pe butonul verde/galben)
export const approveTableHandler = async (req, res) => {
  try {
    const { tableId } = req.body;

    // Delegăm logica de DB către Service
    const { token } = await dashboardService.approveTable(tableId);

    console.log(`✅ Masa ${tableId} a fost aprobată via Service.`);

    // 📢 NOTIFICĂRI SOCKET.IO
    const io = req.app.get("io");
    if (io) {
      // Determinam toate mesele combinata
      const tableResult = await db.query("SELECT merged_into_id FROM tables WHERE id = $1", [tableId]);
      const rootTableId = tableResult.rows[0]?.merged_into_id || tableId;
      const groupResult = await db.query("SELECT id FROM tables WHERE id = $1 OR merged_into_id = $1", [rootTableId]);
      
      // Notificăm dashboard-ul (tableta) să actualizeze culorile
      io.emit("new-data", { type: "TABLE_APPROVED", tableId: rootTableId });
      
      // Trimitem token-ul fiecărui client, indiferent de pre-table (ex: Masa 5 unita in Masa 1)
      groupResult.rows.forEach(({ id }) => {
        io.emit(`table-approved-${id}`, { token });
      });
    }

    return res.json({ success: true, message: "Masa a fost aprobată!", token });
  } catch (error) {
    console.error("💥 Eroare approveTableHandler:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. RESPINGERE MASĂ (Când dai X la o comandă pending)
export const rejectTableHandler = async (req, res) => {
  try {
    const { tableId } = req.body;

    await dashboardService.rejectTable(tableId);

    const io = req.app.get("io");
    if (io) {
      io.emit("new-data", { type: "ORDER_REJECTED", tableId });
    }

    return res.json({ success: true, message: "Cererea a fost respinsă." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. ÎNCHIDERE MASĂ (Final de ședere / Checkout)
export const closeTableHandler = async (req, res) => {
  try {
    const { tableId } = req.params;

    // Delegăm resetarea token-ului și statusului către Service
    await dashboardService.closeTable(tableId);

    const io = req.app.get("io");
    if (io) {
      io.emit("new-data", { type: "TABLE_CLOSED", tableId });
    }

    res.json({ success: true, message: "Masa a fost închisă." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. TOGGLE DISPONIBILITATE PRODUS (Stoc)
export async function toggleProductAvailabilityHandler(req, res) {
  try {
    const { productId } = req.params;
    const { is_available } = req.body;

    const result = await dashboardService.toggleProductAvailability(
      productId,
      is_available
    );
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

// 6. DESCHIDERE MANUALĂ (Dacă barmanul deschide masa fără comandă prealabilă)
export const openTableHandler = async (req, res) => {
  try {
    const { tableId } = req.params;
    const { token } = await dashboardService.openTable(tableId);

    req.app.get("io")?.emit("table-opened", { tableId, token });

    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. EDITARE PRODUS (Nume, Preț, Descriere)
export const editProductHandler = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, description, image_url } = req.body;

    if (!name || price === undefined) {
      return res
        .status(400)
        .json({ error: "Numele și prețul sunt obligatorii!" });
    }

    const result = await dashboardService.editProductDetails(productId, {
      name,
      price,
      description,
      image_url,
    });

    // 📢 Anunțăm toate telefoanele și tabletele că s-a modificat meniul
    const io = req.app.get("io");
    if (io) {
      io.emit("menu-updated");
    }

    return res.json(result);
  } catch (error) {
    console.error("💥 Eroare editProductHandler:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
};

// 8. ȘTERGERE PRODUS (Delete)
export const deleteProductHandler = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await dashboardService.removeProduct(productId);

    // 📢 Anunțăm clienții că a dispărut un produs
    const io = req.app.get("io");
    if (io) {
      io.emit("menu-updated");
    }

    return res.json(result);
  } catch (error) {
    console.error("💥 Eroare deleteProductHandler:", error);

    // Eroare de Foreign Key (produsul e deja pe o notă veche)
    if (error.code === "23503") {
      return res.status(400).json({
        error:
          "Nu poți șterge un produs care a fost deja comandat. Folosește dezactivarea stocului!",
      });
    }

    return res.status(resolveStatus(error)).json({ error: error.message });
  }
};

export const deleteCategoryHandler = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const result = await dashboardService.removeCategory(categoryId);

    const io = req.app.get("io");
    if (io) {
      io.emit("menu-updated");
    }

    return res.json(result);
  } catch (error) {
    console.error("💥 Eroare deleteCategoryHandler:", error);
    
    // Check for foreign key violation (e.g. products still exist in it)
    if (error.code === "23503") {
      return res.status(400).json({
        error: "Nu poți șterge o categorie care conține produse! Șterge produsele mai întâi.",
      });
    }
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
};
export const addProductHandler = async (req, res) => {
  try {
    const { category_id, name, price, description, image_url } = req.body;

    if (!category_id || !name || price === undefined) {
      return res
        .status(400)
        .json({ error: "Categoria, numele și prețul sunt obligatorii!" });
    }

    const result = await dashboardService.addNewProduct(category_id, {
      name,
      price,
      description,
      image_url,
    });

    const io = req.app.get("io");
    if (io) io.emit("menu-updated");

    return res.json(result);
  } catch (error) {
    console.error("💥 Eroare addProductHandler:", error);
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
};

// 9. UNIRE MESE (Masa 1 + Masa 5 => Masa 1, iar Masa 5 dispare din peisaj)

export const mergeTablesHandler = async (req, res, next) => {
  try {
    const { sourceId, targetId } = req.body;

    // Luăm barId din token-ul de autorizare (presupunând că ai middleware-ul pus)
    // Dacă nu l-ai pus încă, îl poți trimite momentan din req.body pentru teste
    const barId = req.user?.barId || req.body.bar_id;

    if (!sourceId || !targetId || !barId) {
      return res.status(400).json({ error: "Date incomplete pentru unire." });
    }

    const result = await mergeTablesService({ sourceId, targetId, barId });
    const io = req.app.get("io");
    if (io) {
      io.emit("new-data", { type: "TABLES_MERGED", sourceId, targetId });
      // Notificăm ambele mese să își actualizeze istoricul (ca membrii să vadă produsele celorlalți)
      io.emit(`table-updated-${sourceId}`, { type: "HISTORY_UPDATE", message: "Mesele au fost unite!" });
      io.emit(`table-updated-${targetId}`, { type: "HISTORY_UPDATE", message: "Mesele au fost unite!" });
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("💥 Eroare la unirea meselor:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message });
  }
};
