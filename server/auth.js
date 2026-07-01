const crypto = require("crypto");

const ADMIN_PASSWORD = process.env.QRESTO_ADMIN_PASSWORD || "qresto2026";
const tokens = new Map();

function login(password) {
  const clave = String(password).trim();
  if (clave.toLowerCase() !== ADMIN_PASSWORD.toLowerCase()) {
    return { error: "Contraseña incorrecta" };
  }
  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, { creado: Date.now() });
  return { token };
}

function verificarToken(token) {
  if (!token) return false;
  return tokens.has(token);
}

function middleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!verificarToken(token)) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
}

module.exports = { login, middleware };
