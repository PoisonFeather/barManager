import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_de_test_pentru_dezvoltare_123";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acces interzis. Token lipsă sau invalid." });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Atașează { userId, barId, role, allowedCategories } la request, sau doar { barId } pentru demo
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid sau expirat." });
  }
}

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Utilizator neautentificat." });
    }
    // superadmin can access anything
    if (req.user.role === "superadmin" || roles.includes(req.user.role)) {
      return next();
    }
    return res.status(403).json({ error: "Acces interzis pentru acest rol." });
  };
}
