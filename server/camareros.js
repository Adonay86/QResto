const path = require("path");
const crypto = require("crypto");
const { leerJson, escribirJson } = require("./fs-utils");

const CAMAREROS_PATH = path.join(__dirname, "data", "camareros.json");

function normalizarUsuario(usuario) {
  return String(usuario || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(String(password || ""))
    .digest("hex");
}

function cargar() {
  return leerJson(CAMAREROS_PATH, {
    seq: 1,
    usuarios: [],
  });
}

function guardar(data) {
  escribirJson(CAMAREROS_PATH, data);
}

function listarPublico() {
  return cargar().usuarios.map((u) => ({
    id: u.id,
    usuario: u.usuario,
    nombre: u.nombre,
    activo: u.activo !== false,
    creadoEn: u.creadoEn,
  }));
}

function crear({ usuario, nombre, password }) {
  const user = normalizarUsuario(usuario);
  const nom = String(nombre || "").trim();
  const pass = String(password || "");

  if (!user) return { error: "Usuario obligatorio" };
  if (user.length < 3) return { error: "Usuario demasiado corto (mínimo 3)" };
  if (pass.length < 4) return { error: "Contraseña demasiado corta (mínimo 4)" };

  const data = cargar();
  if (data.usuarios.some((u) => u.usuario === user)) {
    return { error: "Ese usuario ya existe" };
  }

  const camarero = {
    id: data.seq++,
    usuario: user,
    nombre: nom || user,
    passwordHash: hashPassword(pass),
    activo: true,
    creadoEn: new Date().toISOString(),
  };
  data.usuarios.push(camarero);
  guardar(data);
  return {
    camarero: {
      id: camarero.id,
      usuario: camarero.usuario,
      nombre: camarero.nombre,
      activo: camarero.activo,
      creadoEn: camarero.creadoEn,
    },
  };
}

function eliminar(id) {
  const data = cargar();
  const antes = data.usuarios.length;
  data.usuarios = data.usuarios.filter((u) => u.id !== Number(id));
  if (data.usuarios.length === antes) return { error: "Camarero no encontrado" };
  guardar(data);
  return { ok: true };
}

function actualizar(id, { usuario, nombre, password, activo }) {
  const data = cargar();
  const idx = data.usuarios.findIndex((u) => u.id === Number(id));
  if (idx === -1) return { error: "Camarero no encontrado" };

  const actual = data.usuarios[idx];
  const nuevoUsuario = usuario !== undefined ? normalizarUsuario(usuario) : actual.usuario;
  const nuevoNombre = nombre !== undefined ? String(nombre || "").trim() : actual.nombre;
  const nuevaPassword = String(password || "");

  if (!nuevoUsuario) return { error: "Usuario obligatorio" };
  if (nuevoUsuario.length < 3) return { error: "Usuario demasiado corto (mínimo 3)" };
  const duplicado = data.usuarios.some(
    (u) => u.id !== actual.id && u.usuario === nuevoUsuario
  );
  if (duplicado) return { error: "Ese usuario ya existe" };
  if (password !== undefined && nuevaPassword && nuevaPassword.length < 4) {
    return { error: "Contraseña demasiado corta (mínimo 4)" };
  }

  actual.usuario = nuevoUsuario;
  actual.nombre = nuevoNombre || nuevoUsuario;
  if (password !== undefined && nuevaPassword) {
    actual.passwordHash = hashPassword(nuevaPassword);
  }
  if (activo !== undefined) {
    actual.activo = Boolean(activo);
  }

  data.usuarios[idx] = actual;
  guardar(data);
  return {
    camarero: {
      id: actual.id,
      usuario: actual.usuario,
      nombre: actual.nombre,
      activo: actual.activo !== false,
      creadoEn: actual.creadoEn,
    },
  };
}

function verificarCredenciales({ usuario, password }) {
  const user = normalizarUsuario(usuario);
  const passHash = hashPassword(password);
  const data = cargar();
  const encontrado = data.usuarios.find(
    (u) => u.usuario === user && u.passwordHash === passHash && u.activo !== false
  );
  if (!encontrado) return null;
  return {
    id: encontrado.id,
    usuario: encontrado.usuario,
    nombre: encontrado.nombre,
  };
}

module.exports = {
  listarPublico,
  crear,
  actualizar,
  eliminar,
  verificarCredenciales,
};
