/** Constantes compartidas entre pantallas QResto */

export const SOCKET_EVENT = "estado:actualizado";

export const TOKEN_KEY = "qresto_admin_token";

export const IMAGEN_FALLBACK =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=450&fit=crop&q=80";

export const ESTADO_PEDIDO = {
  pendiente: "Pendiente",
  servido: "Servido",
  pagado: "Cobrado",
};

export const ESTADO_MESA = {
  libre: "Libre",
  ocupada: "Ocupada",
  atencion: "Llama",
};

/** Opciones fijas de bebida (multi-selección en carta) */
export const OPCIONES_BEBIDA = [
  { id: "fria", label: "Fría" },
  { id: "natural", label: "Natural" },
  { id: "hielo", label: "Con hielo" },
  { id: "limon", label: "Con limón" },
];

export const OPCIONES_BEBIDA_LABEL = Object.fromEntries(
  OPCIONES_BEBIDA.map((o) => [o.id, o.label])
);
