export const isLoggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.status(401).json({ error: "No autorizado" });
};

export const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Acceso denegado: Se requiere rol de Admin" });
};
