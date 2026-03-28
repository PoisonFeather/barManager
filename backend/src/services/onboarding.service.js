import bcrypt from "bcrypt";
import {
  insertBar,
  insertCategory,
  insertProduct,
  insertTable,
  insertUser,
  withTransaction,
} from "../repositories/onboarding.repository.js";

export async function fullSetup(payload) {
  const {
    bar_name,
    slug,
    primary_color,
    bar_number_tables,
    menu,
    username,
    password,
  } = payload;

  if (!bar_name || !slug) {
    const error = new Error("bar_name și slug sunt obligatorii");
    error.status = 400;
    throw error;
  }
  // todo : mutat in validation si cu check pentru username unic
  if (!username || !password) {
    const error = new Error(
      "Username-ul și parola sunt obligatorii pentru crearea contului!"
    );
    error.status = 400;
    throw error;
  }

  if (!Array.isArray(menu)) {
    const error = new Error("menu trebuie să fie listă");
    error.status = 400;
    throw error;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const barId = await withTransaction(async (client) => {
    // 1. Creăm Barul
    const createdBarId = await insertBar(client, {
      bar_name,
      slug,
      primary_color,
    });

    // 2. Creăm User-ul și îl legăm de Barul proaspăt creat
    try {
      await insertUser(client, {
        barId: createdBarId,
        username,
        passwordHash,
      });
    } catch (err) {
      // Prindem eroarea de username duplicat (23505 în Postgres)
      if (err.code === "23505") {
        const error = new Error(
          "Acest nume de utilizator este deja luat. Alege altul!"
        );
        error.status = 409; // Conflict
        throw error;
      }
      throw err; // Aruncăm mai departe orice altă eroare ca să facă ROLLBACK
    }

    // 3. Creăm Meniul
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

    // 4. Creăm Mesele
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
    message: "Cont creat cu succes, meniul și mesele au fost generate!",
  };
}
