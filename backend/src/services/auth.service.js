import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByUsername } from "../repositories/auth.repository.js";

// În producție, asta TREBUIE să fie în fișierul .env (ex: JWT_SECRET=parola_mea_super_secreta)
const JWT_SECRET =
  process.env.JWT_SECRET || "secret_de_test_pentru_dezvoltare_123";

export async function loginUser(username, password) {
  // 1. Căutăm userul
  const user = await getUserByUsername(username);
  if (!user) {
    const error = new Error("Numele de utilizator nu există!");
    error.status = 404;
    throw error;
  }

  // 2. Verificăm parola (bcrypt face magia de a compara textul clar cu hash-ul din DB)
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error("Parolă incorectă!");
    error.status = 401; // Unauthorized
    throw error;
  }

  // 3. Generăm token-ul JWT (aici ascundem ID-urile ca să le știe backend-ul la viitoarele request-uri)
  const token = jwt.sign(
    {
      userId: user.user_id,
      barId: user.bar_id,
    },
    JWT_SECRET,
    { expiresIn: "24h" } // Token-ul expiră după o zi (patronul trebuie să se relogheze mâine)
  );

  console.log(
    `✅ User '${username}' s-a logat cu succes. Token generat: ${token}. JWT_SECRET folosit: ${JWT_SECRET}`
  );

  // 4. Returnăm token-ul și slug-ul către Controller
  return {
    success: true,
    token,
    barSlug: user.bar_slug,
  };
}
