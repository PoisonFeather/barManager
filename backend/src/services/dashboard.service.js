// backend/src/services/dashboard.service.js
import { pool as db } from "../db/pool.js";
import { v4 as uuidv4 } from "uuid";
import {
  getDashboardSummaryByBar,
  updateProductAvailability,
  updateProductDetails,
  deleteProduct,
} from "../repositories/dashboard.repository.js";

// 1. SUMAR (Datele pentru mesele colorate)
export async function getDashboardSummary(barId) {
  return getDashboardSummaryByBar(barId);
}

// 2. APROBARE (Deschide masa și confirmă comanda)
export async function approveTable(tableId) {
  const newToken = uuidv4();

  // A. Marcăm masa ca fiind deschisă și îi dăm token-ul de sesiune
  await db.query(
    "UPDATE tables SET status = 'open', current_session_token = $1 WHERE id = $2",
    [newToken, tableId]
  );

  // B. Toate produsele comandate de client "trec" de la pending la confirmed
  await db.query(
    "UPDATE orders SET status = 'confirmed' WHERE table_id = $1 AND status = 'pending_approval'",
    [tableId]
  );

  return { success: true, token: newToken };
}

// 3. RESPINGERE (Șterge comenzile "fake")
export async function rejectTable(tableId) {
  await db.query(
    "DELETE FROM orders WHERE table_id = $1 AND status = 'pending_approval'",
    [tableId]
  );
  return { success: true };
}

// 4. STOC (Toggle disponibil/indisponibil)
export async function toggleProductAvailability(productId, is_available) {
  await updateProductAvailability(productId, is_available);
  return { success: true };
}
//5. EDITARE DETALII PRODUS (Nume, preț, descriere)
export async function editProductDetails(productId, payload) {
  // pass la  obiectul { name, price, description } mai departe spre baza de date
  const updatedProduct = await updateProductDetails(productId, payload);
  return { success: true, product: updatedProduct };
}

// 👇 6. ȘTERGERE PRODUS
export async function removeProduct(productId) {
  await deleteProduct(productId);
  return { success: true };
}
