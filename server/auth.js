const crypto = require("crypto");
const camareros = require("./camareros");

const ADMIN_PASSWORD = process.env.QRESTO_ADMIN_PASSWORD || "qresto2026";
const tokens = new Map();

function crearToken(rol) {
  const token = crypto.randomBytes(32).toString("hex");
  tokens.set(token, { creado: Date.now(), rol });
  return { token };
}

function loginAdmin(password) {
  const clave = String(password).trim();
  if (clave.toLowerCase() !== ADMIN_PASSWORD.toLowerCase()) {
    return { error: "Contraseña incorrecta" };
  }
  return crearToken("admin");
}

function loginCamarero({ usuario, password }) {
  const user = String(usuario || "").trim();
  const clave = String(password || "").trim();
  if (!user) return { error: "Usuario obligatorio" };

  const valido = camareros.verificarCredenciales({ usuario: user, password: clave });
  if (!valido) return { error: "Usuario o contraseña incorrectos" };
  return crearToken("camarero");
}

function verificarToken(token) {
  if (!token) return false;
  return tokens.has(token);
}

function extraerToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

function middlewarePorRol(rol) {
  return function middleware(req, res, next) {
    const token = extraerToken(req);
    if (!verificarToken(token)) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const sesion = tokens.get(token);
    if (!sesion || sesion.rol !== rol) {
      return res.status(403).json({ error: "Permisos insuficientes" });
    }
    next();
  };
}

function middlewareComun(req, res, next) {
  const token = extraerToken(req);
  if (!verificarToken(token)) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
}

module.exports = {
  login: loginAdmin,
  loginAdmin,
  loginCamarero,
  middleware: middlewarePorRol("admin"),
  adminMiddleware: middlewarePorRol("admin"),
  camareroMiddleware: middlewarePorRol("camarero"),
  middlewareComun,
};
