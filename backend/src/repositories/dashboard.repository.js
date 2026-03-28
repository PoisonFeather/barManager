import { pool } from "../db/pool.js";
import { v4 as uuidv4 } from "uuid";

export async function getDashboardSummaryByBar(barId) {
  const query = `
    SELECT 
      t.id as table_id,
      t.table_number,
      -- 🛡️ LOGICA DE STATUS: Dacă există o comandă 'pending_approval', masa devine GALBENĂ
      CASE 
        WHEN EXISTS (SELECT 1 FROM orders WHERE table_id = t.id AND status = 'pending_approval') THEN 'pending_approval'
        ELSE t.status 
      END as status,
      
      -- 🚨 CORECTAT AICI: cheia payment_method și COALESCE
      COALESCE(
        (
          SELECT jsonb_agg(jsonb_build_object(
            'id', r.id,
            'type', r.type,
            'payment_method', r.payment_method, 
            'time', r.created_at
          ))
          FROM requests r
          WHERE r.table_id = t.id AND r.status = 'pending'
        ),
        '[]'::jsonb
      ) as active_requests,

      COALESCE(
        jsonb_agg(jsonb_build_object(
          'item_id', oi.id,
          'name', p.name,
          'qty', oi.quantity
        )) FILTER (WHERE oi.status = 'pending' AND o.status = 'confirmed'),
        '[]'::jsonb
      ) as pending_items,
      
      -- Luăm ID-ul ultimei comenzi neaprobate (ne trebuie pentru butonul de Approve)
      (SELECT id FROM orders WHERE table_id = t.id AND status = 'pending_approval' LIMIT 1) as last_order_id,
      COALESCE(SUM(oi.quantity * oi.price_at_time) FILTER (WHERE o.status = 'confirmed'), 0) as total_to_pay
    FROM tables t
    LEFT JOIN orders o ON o.table_id = t.id AND o.is_paid = FALSE
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE t.bar_id = $1
    GROUP BY t.id, t.table_number, t.status
    ORDER BY t.table_number ASC;
  `;
  const result = await pool.query(query, [barId]);
  return result.rows;
}

export async function updateProductAvailability(productId, isAvailable) {
  await pool.query("UPDATE products SET is_available = $1 WHERE id = $2", [
    isAvailable,
    productId,
  ]);
}

export async function updateProductDetails(
  productId,
  { name, price, description }
) {
  const result = await pool.query(
    `UPDATE products 
     SET name = $1, price = $2, description = $3 
     WHERE id = $4 
     RETURNING *`,
    [name, price, description, productId]
  );
  return result.rows[0];
}

// 🗑️ Ștergere definitivă produs
export async function deleteProduct(productId) {
  // Aici facem un delete simplu. Dacă ai foreign keys restrictive pe comenzi,
  // putem transforma asta într-un "soft delete" mai târziu.
  await pool.query("DELETE FROM products WHERE id = $1", [productId]);
}

export async function addProductToCategory(
  categoryId,
  { name, price, description }
) {
  const result = await pool.query(
    `INSERT INTO products (category_id, name, price, description, is_available) 
     VALUES ($1, $2, $3, $4, true) RETURNING *`,
    [categoryId, name, price, description]
  );
  return result.rows[0];
}

export async function approveTable_db(tableId, token) {
  //A. marcam masa ca fiind deschisa si ii dam token-ul de sesiune primit ca si parametru din service
  await pool.query(
    "UPDATE tables SET status = 'open', current_session_token = $1 WHERE id = $2",
    [token, tableId]
  );
  // B. Toate produsele comandate de client "trec" de la pending la confirmed
  await pool.query(
    "UPDATE orders SET status = 'confirmed' WHERE table_id = $1 AND status = 'pending_approval'",
    [tableId]
  );
}

export async function rejectTable_db(tableId) {
  await pool.query(
    "DELETE FROM orders WHERE table_id = $1 AND status = 'pending_approval'",
    [tableId]
  );
}
