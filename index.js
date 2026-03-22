/**
 * 🍹 BarManager API - Core Engine
 * ---------------------------------------------------------
 * Proiect: QR-Order SaaS (MVP)
 * Descriere: Backend API pentru gestionarea barurilor, meniurilor și comenzilor prin QR.
 * Tehnologii: Node.js, Express, PostgreSQL (Tranzacțional)
 * * FLUXURI PRINCIPALE:
 * 1. [ONBOARDING] /onboarding/full-setup -> Creare completă Bar + Meniu + Mese.
 * 2. [MENU] /menu-complete/:slug       -> Fetch ultra-rapid (JSON Aggregation) pentru Client View.
 * 3. [ORDERS] /orders                  -> Procesare comenzi cu integritate SQL (Transaction safe).
 * * SECURITATE: CORS activat, Tranzacții SQL pentru date critice.
 * PORT: 3001 (Default)
 * ---------------------------------------------------------
 * Autor: Andrei
 * Data: 2026
 */


import express from 'express';
import pkg from 'pg';
import cors from 'cors';
const { Pool } = pkg;
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Conexiunea la baza de date din Docker
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Endpoint de test: Vedem dacă barul există
app.get('/menu/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const bar = await pool.query('SELECT * FROM bars WHERE slug = $1', [slug]);
    
    if (bar.rows.length === 0) return res.status(404).json({ error: "Barul nu există" });

    const categories = await pool.query('SELECT * FROM categories WHERE bar_id = $1', [bar.rows[0].id]);
    
    res.json({
      bar: bar.rows[0],
      menu: categories.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adaugă o categorie nouă
app.post('/categories', async (req, res) => {
    try {
      const { bar_id, name, display_order } = req.body;
      const newCategory = await pool.query(
        'INSERT INTO categories (bar_id, name, display_order) VALUES ($1, $2, $3) RETURNING *',
        [bar_id, name, display_order || 0]
      );
      res.json(newCategory.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // Adaugă un produs nou
  app.post('/products', async (req, res) => {
    try {
      const { category_id, name, price, description, image_url } = req.body;
      const newProduct = await pool.query(
        'INSERT INTO products (category_id, name, price, description, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [category_id, name, price, description, image_url]
      );
      res.json(newProduct.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post('/onboarding/full-setup', async (req, res) => {
    const client = await pool.connect(); // Deschidem conexiunea pentru tranzacție
    
    try {
      const { bar_name, slug, primary_color,bar_number_tables, menu} = req.body;
      await client.query('BEGIN'); // Start tranzacție
  
      // 1. Creăm Barul
      const barRes = await client.query(
        'INSERT INTO bars (name, slug, primary_color) VALUES ($1, $2, $3) RETURNING id',
        [bar_name, slug, primary_color]
      );
      const barId = barRes.rows[0].id;
  
      // 2. Parcurgem meniul și inserăm Categoriile și Produsele
      for (const item of menu) {
        const catRes = await client.query(
          'INSERT INTO categories (bar_id, name) VALUES ($1, $2) RETURNING id',
          [barId, item.category]
        );
        const catId = catRes.rows[0].id;
  
        for (const prod of item.products) {
          await client.query(
            'INSERT INTO products (category_id, name, price, description) VALUES ($1, $2, $3, $4)',
            [catId, prod.name, prod.price, prod.description]
          );
        }
      }
  
      // 3. Generam mesele cu numarul din onboarding / 10 if no number provided
      const tableCount = (bar_number_tables && bar_number_tables > 0) ? bar_number_tables : 10; //checking if not empty

      for (let i = 1; i <= table_count ; i++) {
        await client.query(
          'INSERT INTO tables (bar_id, table_number) VALUES ($1, $2)',
          [barId, i]
        );
      }
  
      await client.query('COMMIT'); // Salvăm totul definitiv
      res.json({ success: true, barId, message: "Cont creat cu succes, mesele 1-10 generate!" });
  
    } catch (err) {
      await client.query('ROLLBACK'); // Dacă apare o eroare, anulăm tot ce s-a scris până atunci
      res.status(500).json({ error: err.message });
    } finally {
      client.release();
    }
  });

  app.get('/menu-complete/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
  
      const query = `
        SELECT 
          b.*,
          -- 1. Aducem mesele barului (Adăugat acum!)
          (
            SELECT jsonb_agg(jsonb_build_object(
              'id', t.id,
              'table_number', t.table_number
            )) FROM tables t WHERE t.bar_id = b.id
          ) as tables,
          -- 2. Aducem categoriile și produsele
          (
            SELECT jsonb_agg(jsonb_build_object(
              'id', c.id,
              'name', c.name,
              'display_order', c.display_order,
              'products', (
                SELECT jsonb_agg(jsonb_build_object(
                  'id', p.id,
                  'name', p.name,
                  'price', p.price,
                  'description', p.description,
                  'is_available', p.is_available,
                  'image_url', p.image_url
                ) ORDER BY p.name)
                FROM products p
                WHERE p.category_id = c.id
              )
            ) ORDER BY c.display_order)
            FROM categories c
            WHERE c.bar_id = b.id
          ) as categories
        FROM bars b
        WHERE b.slug = $1;
      `;
  
      const result = await pool.query(query, [slug]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Barul nu există" });
      }
  
      res.json(result.rows[0]);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Eroare de server" });
    }
  });
  

app.post('/orders', async (req, res) => {
    const client = await pool.connect();
    
    try {
      const { bar_id, table_id, items, total_amount } = req.body;
  
      if (!items || items.length === 0) {
        return res.status(400).json({ error: "Coșul e gol!" });
      }
  
      await client.query('BEGIN'); // Start Tranzacție
  
      // 1. Inserăm Comanda principală
      const orderRes = await client.query(
        'INSERT INTO orders (bar_id, table_id, total_amount, status) VALUES ($1, $2, $3, $4) RETURNING id',
        [bar_id, table_id, total_amount, 'pending']
      );
      const orderId = orderRes.rows[0].id;
  
      // 2. Inserăm fiecare produs din coș în order_items
      const itemQueries = items.map(item => {
        return client.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price_at_time) VALUES ($1, $2, $3, $4)',
          [orderId, item.id, item.quantity, item.price]
        );
      });
      
      await Promise.all(itemQueries);
  
      await client.query('COMMIT'); // Salvăm totul
  
      res.json({ 
        success: true, 
        orderId, 
        message: "Comanda a ajuns la barman! 🍻" 
      });
  
    } catch (err) {
      await client.query('ROLLBACK'); // Anulăm tot în caz de eroare
      console.error(err);
      res.status(500).json({ error: "Eroare la procesarea comenzii." });
    } finally {
      client.release();
    }
  });


  // 1. Vezi toate comenzile active ale unui bar
app.get('/orders/:barId', async (req, res) => {
    try {
      const { barId } = req.params;
      const query = `
        SELECT o.*, t.table_number,
        (SELECT jsonb_agg(jsonb_build_object(
          'name', p.name,
          'qty', oi.quantity
        )) FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items
        FROM orders o
        JOIN tables t ON o.table_id = t.id
        WHERE o.bar_id = $1 AND o.status != 'completed'
        ORDER BY o.created_at DESC;
      `;
      const result = await pool.query(query, [barId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // 2. Schimbă statusul unei comenzi (ex: din pending in completed)
  app.patch('/orders/:orderId/status', async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // 3. Toggle Stoc (Epuizat / Disponibil)
  app.patch('/products/:productId/toggle', async (req, res) => {
    try {
      const { productId } = req.params;
      const { is_available } = req.body;
      await pool.query('UPDATE products SET is_available = $1 WHERE id = $2', [is_available, productId]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  app.get('/table-history/:tableId', async (req, res) => {
    try {
      const { tableId } = req.params;
      const query = `
        SELECT oi.quantity, p.name, oi.price_at_time as price
        FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.table_id = $1 AND o.is_paid = FALSE
        ORDER BY oi.id ASC;
      `;
      const result = await pool.query(query, [tableId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //dashboard barman - grupare pe mese / produse ne-servite
// Aducem TOATE produsele ne-servite, grupate pe mese
app.get('/dashboard/summary/:barId', async (req, res) => {
    try {
      const { barId } = req.params;
      const query = `
        SELECT 
          t.id as table_id,
          t.table_number,
          -- Luăm doar produsele care sunt încă 'pending'
          COALESCE(
            jsonb_agg(jsonb_build_object(
              'item_id', oi.id,
              'name', p.name,
              'qty', oi.quantity
            )) FILTER (WHERE oi.status = 'pending'), 
            '[]'
          ) as pending_items,
          -- Calculăm TOTALUL general (servite + pending) pentru nota de plată
          SUM(oi.quantity * oi.price_at_time) as total_to_pay
        FROM tables t
        JOIN orders o ON o.table_id = t.id
        JOIN order_items oi ON oi.order_id = o.id
        JOIN products p ON oi.product_id = p.id
        WHERE o.bar_id = $1 AND o.is_paid = FALSE
        GROUP BY t.id, t.table_number
        ORDER BY t.table_number ASC;
      `;
      const result = await pool.query(query, [barId]);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Marchează un produs ca fiind servit (dispare de la barman, rămâne la client pe notă)
app.patch('/order-items/:itemId/serve', async (req, res) => {
  try {
    const { itemId } = req.params;
    await pool.query("UPDATE order_items SET status = 'served' WHERE id = $1", [itemId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});

// Închide Masa (toate comenzile devin plătite)
app.patch('/tables/:tableId/close', async (req, res) => {
  try {
    const { tableId } = req.params;
    await pool.query("UPDATE orders SET is_paid = TRUE WHERE table_id = $1 AND is_paid = FALSE", [tableId]);
    res.json({ success: true });
  } catch (err) { res.status(500).json(err); }
});
  
  // Endpoint nou: Marchează un singur produs ca fiind servit
  app.patch('/order-items/:itemId/serve', async (req, res) => {
    try {
      const { itemId } = req.params;
      await pool.query("UPDATE order_items SET status = 'served' WHERE id = $1", [itemId]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // toggle pentru stoc la produse 
  app.patch('/products/:id/toggle', async (req, res) => {
    try {
      const { id } = req.params;
      const { is_available } = req.body;
      
      await pool.query(
        "UPDATE products SET is_available = $1 WHERE id = $2",
        [is_available, id]
      );
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
app.listen(3001, () => console.log('🚀 Server pornit pe portul 3001'));
