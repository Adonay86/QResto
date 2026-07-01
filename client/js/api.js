export async function enviarPedido(mesa, lineas) {
  const res = await fetch("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mesa, lineas }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al enviar pedido");
  return data;
}

export async function llamarCamarero(mesa) {
  const res = await fetch("/api/llamar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mesa }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al llamar");
  return data;
}

export async function obtenerPedidosMesa(mesa) {
  const res = await fetch("/api/estado");
  const data = await res.json();
  const m = data.mesas.find((x) => String(x.numero) === String(mesa));
  return m?.pedidos?.filter((p) => p.estado !== "pagado") || [];
}
