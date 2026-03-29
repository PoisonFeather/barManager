import * as authService from "../services/auth.service.js";

export const loginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username și parola sunt obligatorii!" });
    }

    const result = await authService.loginUser(username, password);

    return res.json(result);
  } catch (error) {
    console.error("💥 Eroare la login:", error.message);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message });
  }
};
