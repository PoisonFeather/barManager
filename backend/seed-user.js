import bcrypt from "bcrypt";
import { pool } from "./src/db/pool.js"; // 👈 Asigură-te că calea către pool.js e corectă

async function createTestUser() {
  try {
    console.log("⏳ Căutăm barul 'test-bar'...");

    // 1. Luăm ID-ul barului de test
    const barResult = await pool.query(
      "SELECT id FROM bars WHERE slug = 'test-bar'"
    );

    if (barResult.rowCount === 0) {
      console.log("❌ Nu am găsit niciun bar cu slug-ul 'test-bar'.");
      process.exit(1);
    }

    const barId = barResult.rows[0].id;

    // 2. Setăm datele de test
    const username = "patron_test";
    const password = "parola123";

    // 3. Criptăm parola exact cum o face aplicația reală
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Inserăm userul în baza de date
    await pool.query(
      "INSERT INTO users (username, password_hash, bar_id) VALUES ($1, $2, $3)",
      [username, passwordHash, barId]
    );

    console.log(`✅ Succes! Userul '${username}' a fost creat.`);
    console.log(`🔑 Parola pentru login este: '${password}'`);
  } catch (error) {
    // Dacă dă eroare de unique constraint, înseamnă că l-ai rulat de 2 ori
    if (error.code === "23505") {
      console.log("⚠️ Userul 'patron_test' există deja în baza de date!");
    } else {
      console.error("💥 Eroare:", error);
    }
  } finally {
    // Închidem conexiunea ca să nu rămână scriptul agățat
    pool.end();
    process.exit(0);
  }
}

createTestUser();
