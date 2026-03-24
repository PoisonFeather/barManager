import { fullSetup } from "../services/onboarding.service.js";

function resolveStatus(error, fallback = 500) {
  return Number.isInteger(error?.status) ? error.status : fallback;
}

export async function fullSetupHandler(req, res) {
  try {
    const result = await fullSetup(req.body);
    return res.json(result);
  } catch (error) {
    return res.status(resolveStatus(error)).json({ error: error.message });
  }
}
