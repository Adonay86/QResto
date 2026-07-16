const fs = require("fs");
const path = require("path");
const db = require("./db");
const { leerJson: leerJsonFile, escribirJson } = require("./fs-utils");

const VENTAS_DIR = path.join(__dirname, "data", "ventas");
const VENTAS_HOY_LEGACY = path.join(__dirname, "data", "ventas-hoy.json");

function fechaLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fechaHoy() {
  return fechaLocal();
}

function rutaDia(fecha) {
  return path.join(VENTAS_DIR, `${fecha}.json`);
}

function asegurarDirVentas() {
  if (!fs.existsSync(VENTAS_DIR)) {
    fs.mkdirSync(VENTAS_DIR, { recursive: true });
  }
}

function vacio(fecha) {
  return { fecha, registros: [] };
}

function leerDiaArchivo(fecha) {
  return leerJsonFile(rutaDia(fecha), vacio(fecha));
}

function guardarDiaArchivo(diaData) {
  asegurarDirVentas();
  escribirJson(rutaDia(diaData.fecha), diaData);
}

/** Migra ventas-hoy.json a data/ventas/YYYY-MM-DD.json una sola vez. */
function migrarLegacySiHaceFalta() {
  asegurarDirVentas();
  if (!fs.existsSync(VENTAS_HOY_LEGACY)) return;

  const legacy = leerJsonFile(VENTAS_HOY_LEGACY, null);
  if (!legacy?.fecha) return;

  const destino = rutaDia(legacy.fecha);
  if (!fs.existsSync(destino)) {
    escribirJson(destino, {
      fecha: legacy.fecha,
      registros: Array.isArray(legacy.registros) ? legacy.registros : [],
    });
  }

  try {
    fs.renameSync(VENTAS_HOY_LEGACY, `${VENTAS_HOY_LEGACY}.migrado`);
  } catch {
    /* si no se puede renombrar, se deja; ya hay copia en ventas/ */
  }
}

function cargarDiaEnMemoria(fecha) {
  return leerDiaArchivo(fecha);
}

migrarLegacySiHaceFalta();

let data = cargarDiaEnMemoria(fechaHoy());

function mapRegistroMysql(r, lineas) {
  return {
    id: r.id,
    mesa: r.mesa,
    lineas: lineas.map((l) => ({
      id: l.id,
      nombre: l.nombre,
      cantidad: l.cantidad,
      precio: Number(l.precio),
      opciones: Array.isArray(l.opciones) ? l.opciones : [],
    })),
    total: Number(r.total),
    estado: r.estado,
    creadoEn: new Date(r.creadoEn).toISOString(),
    pagadoEn: r.pagadoEn ? new Date(r.pagadoEn).toISOString() : null,
  };
}

async function cargarRegistrosMysql(fecha) {
  const registrosRows = await db.query(
    `SELECT id, mesa, total, estado, creado_en AS creadoEn, pagado_en AS pagadoEn
     FROM ventas_registros
     WHERE DATE(creado_en) = ?
     ORDER BY creado_en`,
    [fecha]
  );

  const registros = [];
  for (const r of registrosRows) {
    const lineas = await db.query(
      `SELECT producto_id AS id, nombre, cantidad, precio
       FROM ventas_lineas WHERE registro_id = ?`,
      [r.id]
    );
    registros.push(mapRegistroMysql(r, lineas));
  }
  return registros;
}

async function cargarDesdeMysql() {
  const hoy = fechaHoy();
  const registros = await cargarRegistrosMysql(hoy);
  data = { fecha: hoy, registros };
}

async function init() {
  if (!db.enabled()) return;
  await cargarDesdeMysql();
}

function guardarHoy() {
  if (db.enabled()) return;
  guardarDiaArchivo(data);
}

function refrescarSiNuevoDia() {
  const hoy = fechaHoy();
  if (data.fecha === hoy) return;

  // El día anterior ya está en su archivo (se guardó en cada escritura).
  // Si quedó algo en memoria sin persistir, asegúralo.
  if (!db.enabled() && data.registros.length) {
    guardarDiaArchivo(data);
  }

  data = db.enabled() ? { fecha: hoy, registros: [] } : cargarDiaEnMemoria(hoy);
  if (!db.enabled()) guardarHoy();
}

async function guardarRegistroMysql(registro) {
  await db.query(
    `INSERT INTO ventas_registros (id, mesa, total, estado, creado_en, pagado_en)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      registro.id,
      registro.mesa,
      registro.total,
      registro.estado,
      registro.creadoEn.slice(0, 19).replace("T", " "),
      registro.pagadoEn ? registro.pagadoEn.slice(0, 19).replace("T", " ") : null,
    ]
  );
  for (const l of registro.lineas) {
    await db.query(
      `INSERT INTO ventas_lineas (registro_id, producto_id, nombre, cantidad, precio)
       VALUES (?, ?, ?, ?, ?)`,
      [registro.id, l.id ?? null, l.nombre, l.cantidad, l.precio]
    );
  }
}

function registrarPedido(pedido, mesa) {
  refrescarSiNuevoDia();
  const registro = {
    id: pedido.id,
    mesa: Number(mesa),
    lineas: pedido.lineas.map((l) => ({
      id: l.id ?? null,
      nombre: l.nombre,
      cantidad: l.cantidad,
      precio: l.precio,
      opciones: Array.isArray(l.opciones) ? l.opciones : [],
    })),
    total: pedido.total,
    estado: pedido.estado,
    creadoEn: pedido.creadoEn,
    pagadoEn: null,
  };
  data.registros.push(registro);
  if (db.enabled()) {
    guardarRegistroMysql(registro).catch(console.error);
  } else {
    guardarHoy();
  }
  return registro;
}

async function actualizarEstadoMysql(pedidoId, estado, pagadoEn) {
  await db.query(
    "UPDATE ventas_registros SET estado = ?, pagado_en = ? WHERE id = ?",
    [
      estado,
      pagadoEn ? pagadoEn.slice(0, 19).replace("T", " ") : null,
      pedidoId,
    ]
  );
}

/**
 * Localiza el registro correcto cuando hay IDs repetidos tras reiniciar el servidor.
 * Prioriza: misma mesa → no pagado → el más reciente.
 */
function encontrarRegistro(pedidoId, mesaNum) {
  const id = Number(pedidoId);
  let candidatos = data.registros.filter((r) => Number(r.id) === id);
  if (mesaNum != null) {
    const mesa = Number(mesaNum);
    const deMesa = candidatos.filter((r) => Number(r.mesa) === mesa);
    if (deMesa.length) candidatos = deMesa;
  }
  const pendientes = candidatos.filter((r) => r.estado !== "pagado");
  const lista = pendientes.length ? pendientes : candidatos;
  if (!lista.length) return null;
  return lista.reduce((mejor, r) =>
    new Date(r.creadoEn) > new Date(mejor.creadoEn) ? r : mejor
  );
}

function getMaxPedidoId() {
  refrescarSiNuevoDia();
  return data.registros.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0);
}

function actualizarEstado(pedidoId, estado, mesaNum) {
  refrescarSiNuevoDia();
  const reg = encontrarRegistro(pedidoId, mesaNum);
  if (!reg) return null;
  reg.estado = estado;
  if (db.enabled()) {
    actualizarEstadoMysql(reg.id, estado, reg.pagadoEn).catch(console.error);
  } else {
    guardarHoy();
  }
  return reg;
}

function marcarPagadosMesa(mesaNum, pedidoIds) {
  refrescarSiNuevoDia();
  const ahora = new Date().toISOString();
  pedidoIds.forEach((id) => {
    const reg = encontrarRegistro(id, mesaNum);
    if (reg && reg.estado !== "pagado") {
      reg.estado = "pagado";
      reg.pagadoEn = ahora;
      if (db.enabled()) {
        actualizarEstadoMysql(reg.id, "pagado", ahora).catch(console.error);
      }
    }
  });
  if (!db.enabled()) guardarHoy();
}

function resumenDeRegistros(fecha, registros) {
  let totalCobrado = 0;
  let totalEnSala = 0;

  registros.forEach((r) => {
    if (r.estado === "pagado") totalCobrado += r.total;
    else totalEnSala += r.total;
  });

  return {
    fecha,
    numPedidos: registros.length,
    totalVentas: Math.round((totalCobrado + totalEnSala) * 100) / 100,
    totalCobrado: Math.round(totalCobrado * 100) / 100,
    totalEnSala: Math.round(totalEnSala * 100) / 100,
  };
}

function productosDeRegistros(registros) {
  const map = new Map();

  registros.forEach((r) => {
    r.lineas.forEach((l) => {
      const key = l.id != null ? `id:${l.id}` : `n:${l.nombre}`;
      if (!map.has(key)) {
        map.set(key, {
          id: l.id,
          nombre: l.nombre,
          cantidad: 0,
          total: 0,
        });
      }
      const p = map.get(key);
      p.cantidad += l.cantidad;
      p.total += l.precio * l.cantidad;
    });
  });

  return [...map.values()]
    .map((p) => ({
      ...p,
      total: Math.round(p.total * 100) / 100,
    }))
    .sort((a, b) => b.cantidad - a.cantidad);
}

function ordenarRegistros(registros) {
  return [...registros].sort(
    (a, b) => new Date(b.creadoEn) - new Date(a.creadoEn)
  );
}

function getRegistros() {
  refrescarSiNuevoDia();
  return ordenarRegistros(data.registros);
}

function getResumen() {
  refrescarSiNuevoDia();
  return resumenDeRegistros(data.fecha, data.registros);
}

function getResumenProductos() {
  refrescarSiNuevoDia();
  return productosDeRegistros(data.registros);
}

function esFechaValida(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha);
}

async function getRegistrosFecha(fecha) {
  if (!esFechaValida(fecha)) return [];

  const hoy = fechaHoy();
  if (fecha === hoy) {
    refrescarSiNuevoDia();
    return ordenarRegistros(data.registros);
  }

  if (db.enabled()) {
    return ordenarRegistros(await cargarRegistrosMysql(fecha));
  }

  const dia = leerDiaArchivo(fecha);
  return ordenarRegistros(dia.registros || []);
}

async function getVentasFecha(fecha) {
  const fechaOk = esFechaValida(fecha) ? fecha : fechaHoy();
  const registros = await getRegistrosFecha(fechaOk);
  return {
    resumen: resumenDeRegistros(fechaOk, registros),
    productos: productosDeRegistros(registros),
    registros,
  };
}

async function getDiasConVentas() {
  const dias = new Set();

  if (db.enabled()) {
    const rows = await db.query(
      `SELECT DISTINCT DATE(creado_en) AS fecha FROM ventas_registros ORDER BY fecha DESC`
    );
    rows.forEach((r) => {
      const f =
        r.fecha instanceof Date
          ? fechaLocal(r.fecha)
          : String(r.fecha).slice(0, 10);
      if (esFechaValida(f)) dias.add(f);
    });
  } else {
    asegurarDirVentas();
    for (const nombre of fs.readdirSync(VENTAS_DIR)) {
      const m = nombre.match(/^(\d{4}-\d{2}-\d{2})\.json$/);
      if (!m) continue;
      const dia = leerDiaArchivo(m[1]);
      if (dia.registros?.length) dias.add(m[1]);
    }
  }

  refrescarSiNuevoDia();
  if (data.registros.length) dias.add(data.fecha);

  return [...dias].sort((a, b) => (a < b ? 1 : -1));
}

module.exports = {
  init,
  fechaHoy,
  registrarPedido,
  actualizarEstado,
  marcarPagadosMesa,
  getMaxPedidoId,
  getRegistros,
  getResumen,
  getResumenProductos,
  getVentasFecha,
  getDiasConVentas,
};
