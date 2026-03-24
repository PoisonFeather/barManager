import {
  findBarBySlug,
  findCategoriesByBarId,
  findCompleteMenuBySlug,
  insertCategory,
  insertProduct,
} from "../repositories/menu.repository.js";

export async function getMenuBySlug(slug) {
  const bar = await findBarBySlug(slug);
  if (!bar) {
    const error = new Error("Barul nu există");
    error.status = 404;
    throw error;
  }

  const menu = await findCategoriesByBarId(bar.id);
  return { bar, menu };
}

export async function createCategory(payload) {
  return insertCategory(payload);
}

export async function createProduct(payload) {
  return insertProduct(payload);
}

export async function getCompleteMenuBySlug(slug) {
  const menu = await findCompleteMenuBySlug(slug);
  if (!menu) {
    const error = new Error("Barul nu există");
    error.status = 404;
    throw error;
  }
  return menu;
}
