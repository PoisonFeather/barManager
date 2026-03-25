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

    // 1. Căutăm masa
    const result = await db.query(
      "SELECT current_session_token FROM tables WHERE id = $1",
      [tableId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Masa nu există" });
    }

    let token = result.rows[0].current_session_token;

    // 2. Dacă masa e "închisă" (token NULL), generăm unul nou
    if (!token) {
      token = uuidv4();
      await db.query(
        "UPDATE tables SET current_session_token = $1 WHERE id = $2",
        [token, tableId]
      );
      console.log(`✅ Sesiune nouă generată pentru masa ${tableId}`);
    }

    res.json({ sessionToken: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
