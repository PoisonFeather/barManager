import {
  insertBar,
  insertCategory,
  insertProduct,
  insertTable,
  withTransaction,
} from "../repositories/onboarding.repository.js";

export async function fullSetup(payload) {
  const { bar_name, slug, primary_color, bar_number_tables, menu } = payload;

  if (!bar_name || !slug) {
    const error = new Error("bar_name și slug sunt obligatorii");
    error.status = 400;
    throw error;
  }

  if (!Array.isArray(menu)) {
    const error = new Error("menu trebuie să fie listă");
    error.status = 400;
    throw error;
  }

  const barId = await withTransaction(async (client) => {
    const createdBarId = await insertBar(client, { bar_name, slug, primary_color });

    for (const item of menu) {
      const catId = await insertCategory(client, {
        barId: createdBarId,
        category: item.category,
      });

      if (Array.isArray(item.products)) {
        for (const product of item.products) {
          await insertProduct(client, { categoryId: catId, product });
        }
      }
    }

    const tableCount =
      bar_number_tables && bar_number_tables > 0 ? bar_number_tables : 10;

    for (let i = 1; i <= tableCount; i += 1) {
      await insertTable(client, { barId: createdBarId, tableNumber: i });
    }

    return createdBarId;
  });

  return {
    success: true,
    barId,
    message: "Cont creat cu succes, mesele 1-10 generate!",
  };
}
