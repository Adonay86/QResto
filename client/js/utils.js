import { ESTADO_MESA, ESTADO_PEDIDO, OPCIONES_BEBIDA_LABEL } from "./constants.js";

const ALERGENOS_LABEL = {
  gluten: "Gluten",
  lacteos: "Lácteos",
  huevo: "Huevo",
  pescado: "Pescado",
  crustaceos: "Crustáceos",
  moluscos: "Moluscos",
  sulfitos: "Sulfitos",
};

const formatoPrecio = (n) =>
  n.toLocaleString("es-ES", { style: "currency", currency: "EUR" });

function formatearHora(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function etiquetaEstadoPedido(estado) {
  return ESTADO_PEDIDO[estado] || estado;
}

function etiquetaEstadoMesa(estado) {
  return ESTADO_MESA[estado] || estado;
}

function formatearLineaProducto(linea) {
  const base = `${linea.cantidad}× ${linea.nombre}`;
  if (!linea.opciones?.length) return base;
  const ops = linea.opciones
    .map((o) => OPCIONES_BEBIDA_LABEL[o] || o)
    .join(" · ");
  return `${base} · ${ops}`;
}

export {
  ALERGENOS_LABEL,
  OPCIONES_BEBIDA_LABEL,
  formatoPrecio,
  formatearHora,
  etiquetaEstadoPedido,
  etiquetaEstadoMesa,
  formatearLineaProducto,
};
