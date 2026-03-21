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
      const { bar_name, slug, primary_color, menu } = req.body;
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
  
      // 3. Generăm automat 10 mese pentru barul ăsta
      for (let i = 1; i <= 10; i++) {
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
  
      // Query SQL complex care aggrega produsele în categorii folosind JSONB
      const query = `
        SELECT 
          b.*,
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
                ) ORDER BY p.name) -- Ordonam produsele alfabetic
                FROM products p
                WHERE p.category_id = c.id AND p.is_available = true -- Aducem doar produsele in stoc
              )
            ) ORDER BY c.display_order) -- Ordonam categoriile cum vrea patronul
            FROM categories c
            WHERE c.bar_id = b.id
          ) as categories
        FROM bars b
        WHERE b.slug = $1;
      `;
  
      const result = await pool.query(query, [slug]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Barul nu există, boss" });
      }
  
      // Structura JSON-ului de ieșire este: { ...bar_data, categories: [ {..., products: []} ] }
      res.json(result.rows[0]);
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Eroare internă de server. Verifică logurile." });
    }
  });
app.listen(3001, () => console.log('🚀 Server pornit pe portul 3001'));
