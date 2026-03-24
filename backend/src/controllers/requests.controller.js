import { completeRequest, createRequest } from "../services/requests.service.js";

function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function createRequestHandler(req, res) {
  try {
    const result = await createRequest(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}

export async function completeRequestHandler(req, res) {
  try {
    const { id } = req.params;
    const result = await completeRequest(id);
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
