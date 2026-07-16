/**
 * Estado en memoria del local (mesas y pedidos activos).
 * Carta, local y ventas del día persisten en JSON o MySQL.
 */

const ventas = require("./ventas");

const MESAS_TOTAL = 10;

function crearEstadoInicial() {
  const mesas = {};
  for (let i = 1; i <= MESAS_TOTAL; i++) {
    mesas[String(i)] = {
      numero: i,
      estado: "libre",
      llamadaActiva: false,
      pedidos: [],
    };
  }
  return { mesas, pedidoSeq: 0 };
}

let state = crearEstadoInicial();

/** Continuar la secuencia desde ventas del día para no reutilizar IDs tras reiniciar. */
function sincronizarSecuenciaPedidos() {
  state.pedidoSeq = Math.max(state.pedidoSeq, ventas.getMaxPedidoId());
}

sincronizarSecuenciaPedidos();

function getEstadoPublico() {
  return {
    mesas: Object.values(state.mesas).map((m) => ({
      numero: m.numero,
      estado: m.estado,
      llamadaActiva: m.llamadaActiva,
      pedidosPendientes: m.pedidos.filter((p) => p.estado === "pendiente").length,
      totalActivo: m.pedidos
        .filter((p) => p.estado !== "pagado")
        .reduce((s, p) => s + p.total, 0),
      pedidos: m.pedidos.map((p) => ({
        id: p.id,
        lineas: p.lineas,
        total: p.total,
        estado: p.estado,
        creadoEn: p.creadoEn,
      })),
    })),
  };
}

function asegurarMesa(numero) {
  const key = String(numero);
  if (!state.mesas[key]) {
    return null;
  }
  return state.mesas[key];
}

function crearPedido(mesaNum, lineas) {
  const mesa = asegurarMesa(mesaNum);
  if (!mesa) return { error: "Mesa no válida" };
  if (!lineas?.length) return { error: "Pedido vacío" };

  state.pedidoSeq += 1;
  const total = lineas.reduce((s, l) => s + l.precio * l.cantidad, 0);
  const pedido = {
    id: state.pedidoSeq,
    lineas,
    total: Math.round(total * 100) / 100,
    estado: "pendiente",
    creadoEn: new Date().toISOString(),
  };

  mesa.pedidos.push(pedido);
  mesa.estado = "ocupada";

  ventas.registrarPedido(pedido, mesa.numero);

  return { pedido, mesa: mesa.numero };
}

function llamarCamarero(mesaNum) {
  const mesa = asegurarMesa(mesaNum);
  if (!mesa) return { error: "Mesa no válida" };

  mesa.llamadaActiva = true;
  mesa.estado = "atencion";
  return { mesa: mesa.numero };
}

function atenderLlamada(mesaNum) {
  const mesa = asegurarMesa(mesaNum);
  if (!mesa) return { error: "Mesa no válida" };

  mesa.llamadaActiva = false;
  mesa.estado = mesa.pedidos.some((p) => p.estado !== "pagado") ? "ocupada" : "libre";
  return { mesa: mesa.numero };
}

function marcarPedidoServido(mesaNum, pedidoId) {
  const mesa = asegurarMesa(mesaNum);
  if (!mesa) return { error: "Mesa no válida" };

  const pedido = mesa.pedidos.find((p) => p.id === pedidoId);
  if (!pedido) return { error: "Pedido no encontrado" };

  pedido.estado = "servido";
  ventas.actualizarEstado(pedidoId, "servido", mesa.numero);
  return { mesa: mesa.numero, pedidoId };
}

function marcarMesaPagada(mesaNum) {
  const mesa = asegurarMesa(mesaNum);
  if (!mesa) return { error: "Mesa no válida" };

  const ids = mesa.pedidos.map((p) => p.id);
  mesa.pedidos.forEach((p) => {
    if (p.estado !== "pagado") p.estado = "pagado";
  });
  ventas.marcarPagadosMesa(mesaNum, ids);
  return { mesa: mesa.numero };
}

function liberarMesa(mesaNum) {
  const mesa = asegurarMesa(mesaNum);
  if (!mesa) return { error: "Mesa no válida" };

  mesa.pedidos = [];
  mesa.llamadaActiva = false;
  mesa.estado = "libre";
  return { mesa: mesa.numero };
}

function resetDemo() {
  state = crearEstadoInicial();
  sincronizarSecuenciaPedidos();
}

function getResumenDia() {
  const v = ventas.getResumen();
  let mesasOcupadas = 0;
  Object.values(state.mesas).forEach((m) => {
    if (m.estado !== "libre") mesasOcupadas += 1;
  });

  return {
    ...v,
    mesasOcupadas,
    mesasTotal: Object.keys(state.mesas).length,
  };
}

function getHistorialVentas() {
  return ventas.getRegistros();
}

module.exports = {
  getEstadoPublico,
  getResumenDia,
  getHistorialVentas,
  crearPedido,
  llamarCamarero,
  atenderLlamada,
  marcarPedidoServido,
  marcarMesaPagada,
  liberarMesa,
  resetDemo,
  sincronizarSecuenciaPedidos,
};
