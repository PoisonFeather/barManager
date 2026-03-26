import {
  completeTableRequest,
  createTableRequest,
} from "../repositories/requests.repository.js";

export async function createRequest(payload) {
  //console.log("Creating request with payload:", payload);
  return createTableRequest(payload);
}

export async function completeRequest(id) {
  await completeTableRequest(id);
  return { success: true };
}
