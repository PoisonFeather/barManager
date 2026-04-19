import bcrypt from "bcrypt";
import { pool } from "./src/db/pool.js";

const USERNAME = "AndreiBarManager";
const PASSWORD = "Barmanageraremere1!";

async function seedSuperAdmin() {
  try {
    console.log("⏳ Se verifică dacă contul superadmin există deja...");

    const existing = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [USERNAME]
    );

    if (existing.rowCount > 0) {
      console.log(`⚠️  Userul '${USERNAME}' există deja. Nimic de făcut.`);
      return;
    }

    // Asigurăm că coloana role există (migration guard)
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'user'
    `);

    const passwordHash = await bcrypt.hash(PASSWORD, 12);

    await pool.query(
      `INSERT INTO users (username, password_hash, bar_id, role)
       VALUES ($1, $2, NULL, 'superadmin')`,
      [USERNAME, passwordHash]
    );

    console.log(`✅ Cont superadmin creat cu succes!`);
    console.log(`   Username: ${USERNAME}`);
    console.log(`   Rol:      superadmin`);
    console.log(`   Login la: /superadmin/login`);
  } catch (error) {
    if (error.code === "23505") {
      console.log(`⚠️  Userul '${USERNAME}' există deja (unique constraint).`);
    } else {
      console.error("💥 Eroare la creare cont superadmin:", error.message);
      process.exit(1);
    }
  } finally {
    pool.end();
    process.exit(0);
  }
}

seedSuperAdmin();
