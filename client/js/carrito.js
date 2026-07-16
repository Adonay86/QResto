let items = [];

/** Clave estable para agrupar mismo producto + mismas opciones */
export function claveLinea(id, opciones = []) {
  const ops = [...(opciones || [])].sort().join(",");
  return `${id}::${ops}`;
}

export function etiquetaOpciones(opciones, labels) {
  if (!opciones?.length) return "";
  return opciones.map((o) => labels[o] || o).join(" · ");
}

export function getCarrito() {
  return [...items];
}

export function getTotal() {
  return items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
}

export function getCantidadTotal() {
  return items.reduce((sum, i) => sum + i.cantidad, 0);
}

export function anadirProducto(producto, opciones = []) {
  const ops = [...(opciones || [])].sort();
  const clave = claveLinea(producto.id, ops);
  const existente = items.find((i) => i.clave === clave);
  if (existente) {
    existente.cantidad += 1;
  } else {
    items.push({
      id: producto.id,
      clave,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen || "",
      cantidad: 1,
      opciones: ops,
    });
  }
}

export function cambiarCantidad(clave, delta) {
  const item = items.find((i) => i.clave === clave);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    items = items.filter((i) => i.clave !== clave);
  }
}

export function vaciarCarrito() {
  items = [];
}
