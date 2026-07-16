const path = require("path");
const db = require("./db");
const { leerJson, escribirJson } = require("./fs-utils");

const CARTA_PATH = path.join(__dirname, "data", "carta-demo.json");
const LOCAL_PATH = path.join(__dirname, "data", "local.json");

const DEFAULT_LOCAL = {
  id: 1,
  nombre: "Bar La Terraza",
  subtitulo: "Cocina canaria · Puerto de la Cruz",
};

let cacheCarta = null;
let cacheLocal = null;

async function cargarDesdeMysql() {
  const categorias = await db.query(
    "SELECT id, nombre, icono FROM categorias ORDER BY orden"
  );
  const productosRows = await db.query(
    "SELECT id, categoria_id AS categoria, nombre, descripcion, precio, imagen, agotado, alergenos FROM productos ORDER BY id"
  );
  const productos = productosRows.map((p) => ({
    ...p,
    agotado: Boolean(p.agotado),
    opcionesBebida: false,
    alergenos:
      typeof p.alergenos === "string" ? JSON.parse(p.alergenos) : p.alergenos || [],
  }));

  cacheCarta = { categorias, productos };

  const localRows = await db.query("SELECT id, nombre, subtitulo FROM local WHERE id = 1");
  cacheLocal = localRows[0] || DEFAULT_LOCAL;
}

async function init() {
  if (!db.enabled()) return;
  await cargarDesdeMysql();
}

function getCarta() {
  if (cacheCarta) return cacheCarta;
  return leerJson(CARTA_PATH, { categorias: [], productos: [] });
}

function guardarCarta(carta) {
  cacheCarta = carta;
  if (!db.enabled()) escribirJson(CARTA_PATH, carta);
  return carta;
}

function getLocal() {
  if (cacheLocal) return cacheLocal;
  return leerJson(LOCAL_PATH, DEFAULT_LOCAL);
}

async function guardarLocalMysql(local) {
  await db.query("UPDATE local SET nombre = ?, subtitulo = ? WHERE id = 1", [
    local.nombre,
    local.subtitulo || "",
  ]);
}

function guardarLocal(local) {
  const actualizado = { ...getLocal(), ...local };
  cacheLocal = actualizado;
  if (db.enabled()) {
    guardarLocalMysql(actualizado).catch(console.error);
  } else {
    escribirJson(LOCAL_PATH, actualizado);
  }
  return actualizado;
}

function siguienteIdProducto(productos) {
  return productos.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

async function insertarProductoMysql(producto) {
  await db.query(
    `INSERT INTO productos (id, categoria_id, nombre, descripcion, precio, imagen, agotado, alergenos)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      producto.id,
      producto.categoria,
      producto.nombre,
      producto.descripcion,
      producto.precio,
      producto.imagen,
      producto.agotado ? 1 : 0,
      JSON.stringify(producto.alergenos),
    ]
  );
}

async function actualizarProductoMysql(producto) {
  await db.query(
    `UPDATE productos SET categoria_id=?, nombre=?, descripcion=?, precio=?, imagen=?, agotado=?, alergenos=?
     WHERE id=?`,
    [
      producto.categoria,
      producto.nombre,
      producto.descripcion,
      producto.precio,
      producto.imagen,
      producto.agotado ? 1 : 0,
      JSON.stringify(producto.alergenos),
      producto.id,
    ]
  );
}

async function eliminarProductoMysql(id) {
  await db.query("DELETE FROM productos WHERE id = ?", [id]);
}

function crearProducto(datos) {
  const carta = getCarta();
  const producto = {
    id: siguienteIdProducto(carta.productos),
    categoria: datos.categoria,
    nombre: datos.nombre?.trim(),
    descripcion: datos.descripcion?.trim() || "",
    precio: Number(datos.precio),
    alergenos: datos.alergenos || [],
    agotado: Boolean(datos.agotado),
    opcionesBebida: Boolean(datos.opcionesBebida),
    imagen: datos.imagen?.trim() || "",
  };

  if (!producto.nombre || !producto.categoria) {
    return { error: "Nombre y categoría obligatorios" };
  }
  if (Number.isNaN(producto.precio) || producto.precio < 0) {
    return { error: "Precio no válido" };
  }

  carta.productos.push(producto);
  guardarCarta(carta);
  if (db.enabled()) insertarProductoMysql(producto).catch(console.error);
  return { producto };
}

function actualizarProducto(id, datos) {
  const carta = getCarta();
  const idx = carta.productos.findIndex((p) => p.id === Number(id));
  if (idx === -1) return { error: "Producto no encontrado" };

  const actual = carta.productos[idx];
  const actualizado = {
    ...actual,
    categoria: datos.categoria ?? actual.categoria,
    nombre: datos.nombre?.trim() ?? actual.nombre,
    descripcion: datos.descripcion?.trim() ?? actual.descripcion,
    precio: datos.precio !== undefined ? Number(datos.precio) : actual.precio,
    alergenos: datos.alergenos ?? actual.alergenos,
    agotado: datos.agotado !== undefined ? Boolean(datos.agotado) : actual.agotado,
    opcionesBebida:
      datos.opcionesBebida !== undefined
        ? Boolean(datos.opcionesBebida)
        : Boolean(actual.opcionesBebida),
    imagen: datos.imagen !== undefined ? datos.imagen.trim() : actual.imagen,
  };

  if (!actualizado.nombre) return { error: "Nombre obligatorio" };
  if (Number.isNaN(actualizado.precio) || actualizado.precio < 0) {
    return { error: "Precio no válido" };
  }

  carta.productos[idx] = actualizado;
  guardarCarta(carta);
  if (db.enabled()) actualizarProductoMysql(actualizado).catch(console.error);
  return { producto: actualizado };
}

function eliminarProducto(id) {
  const carta = getCarta();
  const antes = carta.productos.length;
  carta.productos = carta.productos.filter((p) => p.id !== Number(id));
  if (carta.productos.length === antes) return { error: "Producto no encontrado" };
  guardarCarta(carta);
  if (db.enabled()) eliminarProductoMysql(Number(id)).catch(console.error);
  return { ok: true };
}

function toggleAgotado(id) {
  const carta = getCarta();
  const producto = carta.productos.find((p) => p.id === Number(id));
  if (!producto) return { error: "Producto no encontrado" };
  producto.agotado = !producto.agotado;
  guardarCarta(carta);
  if (db.enabled()) actualizarProductoMysql(producto).catch(console.error);
  return { producto };
}

module.exports = {
  init,
  getCarta,
  guardarCarta,
  getLocal,
  guardarLocal,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  toggleAgotado,
};
