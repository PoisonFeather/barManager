// backend/src/services/dashboard.service.js
import { v4 as uuidv4 } from "uuid";
import {
  getDashboardSummaryByBar,
  updateProductAvailability,
  updateProductDetails,
  deleteProduct,
  addProductToCategory,
  approveTable_db,
  rejectTable_db,
} from "../repositories/dashboard.repository.js";

// 1. SUMAR (Datele pentru mesele colorate)
export async function getDashboardSummary(barId) {
  return getDashboardSummaryByBar(barId);
}

// 2. APROBARE (Deschide masa și confirmă comanda)
export async function approveTable(tableId) {
  const newToken = uuidv4();
  console.log("Generated new session token for table approval:", newToken);
  //Marcam masa ca fiind deschisa si ii asociem tokenul generat
  try {
    approveTable_db(tableId, newToken);
  } catch (error) {
    console.log("Error approving table Service:", error);
  }
  return { success: true, token: newToken };
}

// 3. RESPINGERE (Șterge comenzile "fake")
export async function rejectTable(tableId) {
  try {
    rejectTable_db(tableId);
  } catch (error) {
    console.log("Error rejecting table Service:", error);
  }
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
// 7. ADAUGARE PRODUS NOU ÎNTR-O CATEGORIE (Dacă vrem să adăugăm un produs nou, trebuie să știm în ce categorie să-l băgăm, deci primim categoryId separat)
export async function addNewProduct(categoryId, payload) {
  const newProduct = await addProductToCategory(categoryId, payload);
  return { success: true, product: newProduct };
}
