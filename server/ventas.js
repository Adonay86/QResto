const fs = require("fs");
const path = require("path");
const db = require("./db");

const VENTAS_PATH = path.join(__dirname, "data", "ventas-hoy.json");

function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

function horaLocal(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function leerJson() {
  const hoy = fechaHoy();
  try {
    const data = JSON.parse(fs.readFileSync(VENTAS_PATH, "utf8"));
    if (data.fecha !== hoy) return { fecha: hoy, registros: [] };
    return data;
  } catch {
    return { fecha: hoy, registros: [] };
  }
}

function guardarJson(data) {
  fs.writeFileSync(VENTAS_PATH, JSON.stringify(data, null, 2), "utf8");
}

let data = leerJson();

async function cargarDesdeMysql() {
  const hoy = fechaHoy();
  const registrosRows = await db.query(
    `SELECT id, mesa, total, estado, creado_en AS creadoEn, pagado_en AS pagadoEn
     FROM ventas_registros
     WHERE DATE(creado_en) = ?
     ORDER BY creado_en`,
    [hoy]
  );

  const registros = [];
  for (const r of registrosRows) {
    const lineas = await db.query(
      `SELECT producto_id AS id, nombre, cantidad, precio
       FROM ventas_lineas WHERE registro_id = ?`,
      [r.id]
    );
    registros.push({
      id: r.id,
      mesa: r.mesa,
      lineas: lineas.map((l) => ({
        id: l.id,
        nombre: l.nombre,
        cantidad: l.cantidad,
        precio: Number(l.precio),
      })),
      total: Number(r.total),
      estado: r.estado,
      creadoEn: new Date(r.creadoEn).toISOString(),
      pagadoEn: r.pagadoEn ? new Date(r.pagadoEn).toISOString() : null,
    });
  }

  data = { fecha: hoy, registros };
}

async function init() {
  if (!db.enabled()) return;
  await cargarDesdeMysql();
}

function refrescarSiNuevoDia() {
  const hoy = fechaHoy();
  if (data.fecha !== hoy) {
    data = { fecha: hoy, registros: [] };
    if (!db.enabled()) guardarJson(data);
  }
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
    guardarJson(data);
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

function actualizarEstado(pedidoId, estado) {
  refrescarSiNuevoDia();
  const reg = data.registros.find((r) => r.id === pedidoId);
  if (!reg) return null;
  reg.estado = estado;
  if (db.enabled()) {
    actualizarEstadoMysql(pedidoId, estado, reg.pagadoEn).catch(console.error);
  } else {
    guardarJson(data);
  }
  return reg;
}

function marcarPagadosMesa(mesaNum, pedidoIds) {
  refrescarSiNuevoDia();
  const ahora = new Date().toISOString();
  pedidoIds.forEach((id) => {
    const reg = data.registros.find((r) => r.id === id);
    if (reg) {
      reg.estado = "pagado";
      reg.pagadoEn = ahora;
      if (db.enabled()) {
        actualizarEstadoMysql(id, "pagado", ahora).catch(console.error);
      }
    }
  });
  if (!db.enabled()) guardarJson(data);
}

function getRegistros() {
  refrescarSiNuevoDia();
  return [...data.registros].sort(
    (a, b) => new Date(b.creadoEn) - new Date(a.creadoEn)
  );
}

function getResumen() {
  refrescarSiNuevoDia();
  let totalCobrado = 0;
  let totalEnSala = 0;

  data.registros.forEach((r) => {
    if (r.estado === "pagado") totalCobrado += r.total;
    else totalEnSala += r.total;
  });

  return {
    fecha: data.fecha,
    numPedidos: data.registros.length,
    totalVentas: Math.round((totalCobrado + totalEnSala) * 100) / 100,
    totalCobrado: Math.round(totalCobrado * 100) / 100,
    totalEnSala: Math.round(totalEnSala * 100) / 100,
  };
}

function getResumenProductos() {
  refrescarSiNuevoDia();
  const map = new Map();

  data.registros.forEach((r) => {
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

function limpiarHoy() {
  data = { fecha: fechaHoy(), registros: [] };
  if (!db.enabled()) guardarJson(data);
}

module.exports = {
  init,
  registrarPedido,
  actualizarEstado,
  marcarPagadosMesa,
  getRegistros,
  getResumen,
  getResumenProductos,
  limpiarHoy,
  horaLocal,
};
