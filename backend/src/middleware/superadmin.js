/**
 * Middleware: requireSuperAdmin
 * Verifică că request-ul vine de la un user cu role = 'superadmin'.
 * Trebuie folosit DUPĂ verifyToken (care populează req.user).
 */
export function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({
      error: "Acces interzis. Numai administratorii SaaS pot accesa această resursă.",
    });
  }
  return next();
}
