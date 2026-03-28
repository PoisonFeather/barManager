/*
    Middleware pentru a verifica dacă un produs aparține barului utilizatorului curent.
    Se folosește în rutele de editare, ștergere sau toggle disponibilitate produs.
    Presupune că în req.user avem bar_id-ul utilizatorului (de obicei setat după autentificare).
    TODO:
    - integrare in repo-uri (dupa crearea user.bar_id in auth)
*/
import { pool } from "../db/pool.js";

export async function checkProductOwnership(req, res, next) {
  try {
    const { productId } = req.params;
    const currentBarId = req.user.bar_id; // Presupunând că ai un sistem de login

    // Verificăm în baza de date
    const result = await pool.query(
      `SELECT p.id FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1 AND c.bar_id = $2`,
      [productId, currentBarId]
    );

    if (result.rowCount === 0) {
      return res
        .status(403)
        .json({ error: "Interzis! Produsul nu îți aparține." });
    }

    return next(); // Totul e ok, dăm drumul mai departe
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Eroare la verificarea permisiunilor" });
  }
}
