/*
    Middleware pentru a verifica dacă un produs aparține barului utilizatorului curent.
    Se folosește în rutele de editare, ștergere sau toggle disponibilitate produs.
    Presupune că în req.user avem bar_id-ul utilizatorului (de obicei setat după autentificare).
    TODO:
    - integrare in repo-uri (dupa crearea user.bar_id in auth)
*/
import { pool } from "../db/pool.js";

// Helper function to resolve responses
const forbidden = (res) => res.status(403).json({ error: "Interzis! Resursa nu îți aparține." });
const serverError = (res) => res.status(500).json({ error: "Eroare la verificarea permisiunilor." });

export async function checkProductOwnership(req, res, next) {
  try {
    const { productId } = req.params;
    const currentBarId = req.user.barId; 

    if (!productId || !currentBarId) return forbidden(res);

    const result = await pool.query(
      `SELECT p.id FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1 AND c.bar_id = $2`,
      [productId, currentBarId]
    );

    if (result.rowCount === 0) return forbidden(res);
    return next();
  } catch (error) {
    return serverError(res);
  }
}

export async function checkCategoryOwnership(req, res, next) {
  try {
    // categoryId can be in params (for DELETE) or body (for POST /products)
    const categoryId = req.params.categoryId || req.body.category_id;
    const currentBarId = req.user.barId;

    if (!categoryId || !currentBarId) return forbidden(res);

    const result = await pool.query(
        "SELECT id FROM categories WHERE id = $1 AND bar_id = $2",
        [categoryId, currentBarId]
    );

    if (result.rowCount === 0) return forbidden(res);
    return next();
  } catch(error) {
     return serverError(res);
  }
}

export async function checkTableOwnership(req, res, next) {
  try {
    // tableId can be in params or body
    const tableId = req.params.tableId || req.body.tableId || req.body.sourceId; 
    const currentBarId = req.user.barId;

    if (!tableId || !currentBarId) return forbidden(res);

    const result = await pool.query(
        "SELECT id FROM tables WHERE id = $1 AND bar_id = $2",
        [tableId, currentBarId]
    );

    if (result.rowCount === 0) return forbidden(res);
    
    // For mergeTables, we also need to check targetId if it exists
    if (req.body.targetId) {
        const targetResult = await pool.query(
            "SELECT id FROM tables WHERE id = $1 AND bar_id = $2",
            [req.body.targetId, currentBarId]
        );
        if (targetResult.rowCount === 0) return forbidden(res);
    }
    
    return next();
  } catch(error) {
     return serverError(res);
  }
}
