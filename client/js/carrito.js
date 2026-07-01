let items = [];

export function getCarrito() {
  return [...items];
}

export function getTotal() {
  return items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
}

export function getCantidadTotal() {
  return items.reduce((sum, i) => sum + i.cantidad, 0);
}

export function anadirProducto(producto) {
  const existente = items.find((i) => i.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    items.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen || "",
      cantidad: 1,
    });
  }
}

export function cambiarCantidad(id, delta) {
  const item = items.find((i) => i.id === id);
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad <= 0) {
    items = items.filter((i) => i.id !== id);
  }
}

export function vaciarCarrito() {
  items = [];
}
