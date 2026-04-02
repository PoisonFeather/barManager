import {
  createCategory,
  createProduct,
  getCompleteMenuBySlug,
  getMenuBySlug,
} from "../services/menu.service.js";
import { v4 as uuidv4 } from "uuid";
import { pool as db } from "../db/pool.js";

function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function getMenuHandler(req, res) {
  try {
    const { slug } = req.params;
    const data = await getMenuBySlug(slug);
    return res.json(data);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function createCategoryHandler(req, res) {
  try {
    // 🔒 Security: Forțăm ca bar_id-ul din payload să fie fix bar-ul user-ului logat (previne IDOR)
    req.body.bar_id = req.user.barId;
    
    if (!req.body.name || !req.body.bar_id) {
        return res.status(400).json({ error: "Numele categoriei și bar_id sunt obligatorii." });
    }

    const created = await createCategory(req.body);
    return res.json(created);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function createProductHandler(req, res) {
  try {
    const created = await createProduct(req.body);
    return res.json(created);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function getCompleteMenuHandler(req, res) {
  try {
    const { slug } = req.params;
    const data = await getCompleteMenuBySlug(slug);
    return res.json(data);
  } catch (error) {
    if (resolveStatus(error) === 500) {
      console.error(error);
      return res.status(500).json({ error: "Eroare de server" });
    }
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export const getTableStatusHandler = async (req, res) => {
  try {
    const { tableId } = req.params;

    // 1. Căutăm masa și statusul ei
    const result = await db.query(
      "SELECT status, current_session_token FROM tables WHERE id = $1",
      [tableId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Masa nu există" });
    }

    const { status, current_session_token } = result.rows[0];

    // 2. Logică de răspuns bazată pe status
    // Dacă e 'open', îi dăm token-ul (pentru refresh sau al doilea om la masă)
    if (status === "open") {
      return res.json({
        status: "open",
        sessionToken: current_session_token,
      });
    }

    // Dacă e 'closed' sau 'pending', NU îi dăm token-ul
    return res.json({
      status: status, // îi spunem clientului că e închisă
      sessionToken: null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
