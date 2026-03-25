import {
  createCategory,
  createProduct,
  getCompleteMenuBySlug,
  getMenuBySlug,
} from "../services/menu.service.js";

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
    // Logica ta pentru statusul mesei...
    res.json({ status: "active" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
