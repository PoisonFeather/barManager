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
    const { token } = req.query; // Preluăm tokenul vechi al clientului din query string, dacă există

    // 1. Căutăm masa și statusul ei
    const result = await db.query(
      "SELECT status, current_session_token, session_started_at FROM tables WHERE id = $1",
      [tableId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Masa nu există" });
    }

    const { status, current_session_token, session_started_at } = result.rows[0];

    // 2. Logică de răspuns bazată pe status
    if (status === "open") {
      // Regula A: Dacă clientul are DEJA token-ul corect la el, e clar că s-a alăturat legit, așa că îi acordăm acces.
      if (token && token === current_session_token) {
        return res.json({ status: "open", sessionToken: current_session_token });
      }

      // Regula B: Este un client NOU (sau cu token greșit). Verificăm fereastra de Auto-Join (15 minute).
      if (session_started_at) {
        const startedAt = new Date(session_started_at).getTime();
        const now = Date.now();
        const diffMinutes = (now - startedAt) / (1000 * 60);

        if (diffMinutes <= 15) {
           // Încă e în fereastra de 15 minute, îi dăm token-ul fără probleme
           return res.json({ status: "open", sessionToken: current_session_token });
        } else {
           // A depășit fereastra! Nu îi returnăm token, îi returnăm status "locked" (403)
           return res.status(403).json({ error: "Masa e blocată. Chemați un prieten conectat să o deblocheze.", status: "locked" });
        }
      } else {
        // Fallback-siguranță dacă din vreun motiv a rămas session_started_at null la o masă open
        return res.json({ status: "open", sessionToken: current_session_token });
      }
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
