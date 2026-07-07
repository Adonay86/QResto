/** Cliente HTTP unificado */

async function parseJson(res) {
  return res.json().catch(() => ({}));
}

export async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Error en la petición");
  return data;
}

export async function apiPost(url) {
  return fetchJson(url, { method: "POST" });
}

export function crearApiAdmin(getToken, onUnauthorized) {
  return async function api(url, options = {}) {
    const token = getToken();
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    const res = await fetch(url, { ...options, headers });
    const data = await parseJson(res);
    if (res.status === 401 && !url.includes("/admin/login")) {
      onUnauthorized?.();
      throw new Error("Sesión expirada");
    }
    if (!res.ok) throw new Error(data.error || "Error en la petición");
    return data;
  };
}

export async function enviarPedido(mesa, lineas) {
  return fetchJson("/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mesa, lineas }),
  });
}

export async function llamarCamarero(mesa) {
  return fetchJson("/api/llamar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mesa }),
  });
}

export async function obtenerPedidosMesa(mesa) {
  const data = await fetchJson("/api/estado");
  const m = data.mesas.find((x) => String(x.numero) === String(mesa));
  return m?.pedidos?.filter((p) => p.estado !== "pagado") || [];
}

export async function obtenerLocal() {
  return fetchJson("/api/local");
}
