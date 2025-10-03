// server/src/middlewares/authMiddleware.js
export function authMiddleware(req, res, next) {
  // Placeholder auth check
  if (req.headers["x-auth-token"]) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}
