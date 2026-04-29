import { pool } from "../db/pool.js";
import { v4 as uuidv4 } from "uuid";

export async function getDashboardSummaryByBar(barId) {
  const query = `
    SELECT 
      t.id as table_id,
      t.table_number,
      t.zone_id,
      CASE 
        WHEN EXISTS (SELECT 1 FROM orders WHERE table_id = t.id AND status = 'pending_approval') THEN 'pending_approval'
        ELSE t.status 
      END as status,
      
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
          'qty', oi.quantity,
          'notes', oi.notes,
          'category_id', p.category_id,
          'status', oi.status
        )) FILTER (WHERE (oi.status = 'pending' OR oi.status = 'served') AND o.status = 'confirmed'),
        '[]'::jsonb
      ) as pending_items,
      
      (SELECT id FROM orders WHERE table_id = t.id AND status = 'pending_approval' LIMIT 1) as last_order_id,
      COALESCE(SUM(oi.quantity * oi.price_at_time) FILTER (WHERE o.status = 'confirmed'), 0) as total_to_pay,

      -- 👇 NOU 1: Adunăm numerele meselor copil ca să apară pe ecusonul albastru (+ Mesele: 5, 6)
      COALESCE((SELECT json_agg(child.table_number) FROM tables child WHERE child.merged_into_id = t.id), '[]'::json) as merged_children,

      GREATEST(
         COALESCE((SELECT MAX(created_at) FROM orders WHERE table_id = t.id), '1970-01-01'::timestamp),
         COALESCE((SELECT MAX(created_at) FROM requests WHERE table_id = t.id), '1970-01-01'::timestamp),
         COALESCE(t.updated_at, '1970-01-01'::timestamp)
      ) as last_activity_time

    FROM tables t
    LEFT JOIN orders o ON (o.table_id = t.id OR o.table_id IN (SELECT id FROM tables WHERE merged_into_id = t.id)) AND o.is_paid = FALSE
    LEFT JOIN order_items oi ON oi.order_id = o.id
    LEFT JOIN products p ON oi.product_id = p.id
    
    -- 👇 NOU 2: ASCUNDEM MESELE COPIL DIN LISTA PRINCIPALĂ
    WHERE t.bar_id = $1 AND t.merged_into_id IS NULL 
    
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
  { name, price, description, image_url }
) {
  const result = await pool.query(
    `UPDATE products 
     SET name = $1, price = $2, description = $3, image_url = $4
     WHERE id = $5 
     RETURNING *`,
    [name, price, description, image_url ?? null, productId]
  );
  return result.rows[0];
}

// 🗑️ Ștergere definitivă produs
export async function deleteProduct(productId) {
  // Aici facem un delete simplu. Dacă ai foreign keys restrictive pe comenzi,
  // putem transforma asta într-un "soft delete" mai târziu.
  await pool.query("DELETE FROM products WHERE id = $1", [productId]);
}

export async function deleteCategory(categoryId) {
  await pool.query("DELETE FROM categories WHERE id = $1", [categoryId]);
}

export async function addProductToCategory(
  categoryId,
  { name, price, description, image_url }
) {
  const result = await pool.query(
    `INSERT INTO products (category_id, name, price, description, image_url, is_available) 
     VALUES ($1, $2, $3, $4, $5, true) RETURNING *`,
    [categoryId, name, price, description, image_url ?? null]
  );
  return result.rows[0];
}

export async function approveTable_db(tableId, fallbackToken) {
  // A. marcam masa ca fiind deschisa si setăm token-ul DAA doar dacă nu a fost deja pre-alocat
  const res = await pool.query(
    "UPDATE tables SET status = 'open', current_session_token = COALESCE(current_session_token, $1), session_started_at = NOW() WHERE id = $2 RETURNING current_session_token",
    [fallbackToken, tableId]
  );
  const actualToken = res.rows[0].current_session_token;

  // B. Toate produsele comandate de client "trec" de la pending la confirmed
  await pool.query(
    "UPDATE orders SET status = 'confirmed' WHERE table_id = $1 AND status = 'pending_approval'",
    [tableId]
  );
  return actualToken;
}

export async function rejectTable_db(tableId) {
  await pool.query(
    "DELETE FROM orders WHERE table_id = $1 AND status = 'pending_approval'",
    [tableId]
  );
}

export async function executeTableMerge(client, { sourceId, targetId, barId }) {
  // 1. Marcăm Masa Sursă (ex: 5) ca fiind absorbită de Masa Destinație (ex: 1)
  await client.query(
    `
    UPDATE tables 
    SET merged_into_id = $1 
    WHERE id = $2 AND bar_id = $3
  `,
    [targetId, sourceId, barId]
  );

  // 2. Mutăm toate COMENZILE active de pe masa veche pe aia nouă
  // *Aici adaptezi dacă statusurile tale din DB sunt altele (ex: 'pending', 'open')
  await client.query(
    `
    UPDATE orders 
    SET table_id = $1 
    WHERE table_id = $2 AND bar_id = $3 AND status != 'closed'
  `,
    [targetId, sourceId, barId]
  );

  // 3. Mutăm și CERERILE (ex: chemare ospătar, cerere notă) ca barmanul să știe unde să se ducă
  await client.query(
    `
    UPDATE requests 
    SET table_id = $1 
    WHERE table_id = $2 AND bar_id = $3 AND status != 'resolved'
  `,
    [targetId, sourceId, barId]
  );
}
