import { formatoPrecio, etiquetaEstadoMesa, etiquetaEstadoPedido, formatearLineaProducto } from "./utils.js";
import { SOCKET_EVENT } from "./constants.js";
import { $, crearToast } from "./dom.js";
import { obtenerLocal } from "./api.js";

const CAMARERO_TOKEN_KEY = "qresto_camarero_token";

let estado = { mesas: [] };
let mesaSeleccionada = null;
let tokenCamarero = localStorage.getItem(CAMARERO_TOKEN_KEY);

const toast = crearToast("#toast-camarero");
const socket = io();

socket.on(SOCKET_EVENT, (data) => {
  estado = data;
  render();
});

async function cargarInicial() {
  const [estadoData, local] = await Promise.all([
    fetch("/api/estado").then((r) => r.json()),
    obtenerLocal().catch(() => ({ nombre: "Mi local" })),
  ]);
  estado = estadoData;
  $("#local-nombre").textContent = local.nombre || "Mi local";
  render();
}

function logoutCamarero() {
  tokenCamarero = null;
  localStorage.removeItem(CAMARERO_TOKEN_KEY);
  $("#usuario-camarero").value = "";
  $("#password-camarero").value = "";
  $("#login-error-camarero").hidden = true;
  $("#app-camarero").hidden = true;
  $("#login-pantalla-camarero").hidden = false;
}

function mostrarPanelCamarero() {
  $("#login-pantalla-camarero").hidden = true;
  $("#app-camarero").hidden = false;
}

async function loginCamarero(usuario, password) {
  const res = await fetch("/api/camarero/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "No se pudo entrar");
  tokenCamarero = data.token;
  localStorage.setItem(CAMARERO_TOKEN_KEY, tokenCamarero);
}

async function apiPostCamarero(url) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenCamarero}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) {
    logoutCamarero();
    throw new Error("Sesión de camarero expirada");
  }
  if (!res.ok) throw new Error(data.error || "Error en la petición");
  return data;
}

function render() {
  renderAlertas();
  renderMesas();
  if (mesaSeleccionada) renderDetalleMesa(mesaSeleccionada);
}

function renderAlertas() {
  const llamadas = estado.mesas.filter((m) => m.llamadaActiva);
  const sec = $("#alertas");
  const lista = $("#alertas-lista");

  if (llamadas.length === 0) {
    sec.hidden = true;
    return;
  }

  sec.hidden = false;
  lista.innerHTML = llamadas
    .map(
      (m) => `
    <div class="alerta-item">
      <span><strong>Mesa ${m.numero}</strong> pide atención</span>
      <button type="button" class="btn-panel btn-panel--primario btn-panel--compact" data-atender="${m.numero}">
        Atender
      </button>
    </div>`
    )
    .join("");

  lista.querySelectorAll("[data-atender]").forEach((btn) => {
    btn.addEventListener("click", () => atenderLlamada(btn.dataset.atender));
  });
}

function renderMesas() {
  const grid = $("#mesas-grid");
  grid.innerHTML = estado.mesas
    .map((m) => {
      const pendientes = m.pedidos.filter((p) => p.estado === "pendiente").length;
      return `
      <button type="button" class="mesa-card ${m.estado}" data-mesa="${m.numero}">
        <div class="mesa-card__num">${m.numero}</div>
        <div class="mesa-card__estado">${etiquetaEstadoMesa(m.estado)}</div>
        ${pendientes > 0 ? `<span class="mesa-card__badge">${pendientes} pedido${pendientes > 1 ? "s" : ""}</span>` : ""}
        ${m.llamadaActiva ? '<span class="mesa-card__badge">🔔</span>' : ""}
      </button>`;
    })
    .join("");

  grid.querySelectorAll(".mesa-card").forEach((card) => {
    card.addEventListener("click", () => abrirMesa(card.dataset.mesa));
  });
}

function abrirMesa(numero) {
  mesaSeleccionada = numero;
  renderDetalleMesa(numero);
  $("#modal-mesa").hidden = false;
  document.body.style.overflow = "hidden";
}

function cerrarMesa() {
  mesaSeleccionada = null;
  $("#modal-mesa").hidden = true;
  document.body.style.overflow = "";
}

function renderDetalleMesa(numero) {
  const mesa = estado.mesas.find((m) => String(m.numero) === String(numero));
  if (!mesa) return;

  $("#mesa-detalle-titulo").textContent = `Mesa ${mesa.numero} — ${etiquetaEstadoMesa(mesa.estado)}`;

  const body = $("#mesa-detalle-body");
  const pedidosActivos = mesa.pedidos.filter((p) => p.estado !== "pagado");

  if (pedidosActivos.length === 0 && !mesa.llamadaActiva) {
    body.innerHTML = `<p class="mesa-vacia-msg">Sin pedidos activos</p>`;
  } else {
    body.innerHTML = pedidosActivos
      .map(
        (p) => `
      <div class="pedido-detalle">
        <div class="pedido-detalle__head">
          <span>Pedido #${p.id}</span>
          <span class="estado-tag ${p.estado}">${etiquetaEstadoPedido(p.estado)}</span>
        </div>
        ${p.lineas
          .map(
            (l) => `
          <div class="pedido-detalle__linea">
            <span>${formatearLineaProducto(l)}</span>
            <span>${formatoPrecio(l.precio * l.cantidad)}</span>
          </div>`
          )
          .join("")}
        <div class="pedido-detalle__linea pedido-detalle__total">
          <span>Total</span>
          <span>${formatoPrecio(p.total)}</span>
        </div>
        ${
          p.estado === "pendiente"
            ? `<button type="button" class="btn-panel btn-panel--exito btn-panel--spaced" data-servido="${p.id}">Marcar servido</button>`
            : ""
        }
      </div>`
      )
      .join("");
  }

  body.querySelectorAll("[data-servido]").forEach((btn) => {
    btn.addEventListener("click", () =>
      marcarServido(numero, btn.dataset.servido)
    );
  });

  const acciones = $("#mesa-acciones");
  let html = "";

  if (mesa.llamadaActiva) {
    html += `<button type="button" class="btn-panel btn-panel--primario" id="btn-atender-llamada">Llamada atendida</button>`;
  }
  if (pedidosActivos.length > 0) {
    html += `<button type="button" class="btn-panel btn-panel--exito" id="btn-pagado">Marcar pagado</button>`;
  }
  if (mesa.estado !== "libre") {
    html += `<button type="button" class="btn-panel btn-panel--peligro" id="btn-liberar">Liberar mesa</button>`;
  }

  acciones.innerHTML = html;

  $("#btn-atender-llamada")?.addEventListener("click", () => atenderLlamada(numero));
  $("#btn-pagado")?.addEventListener("click", () => marcarPagado(numero));
  $("#btn-liberar")?.addEventListener("click", () => liberarMesa(numero));
}

async function atenderLlamada(mesa) {
  try {
    await apiPostCamarero(`/api/mesas/${mesa}/atender-llamada`);
    toast(`Llamada mesa ${mesa} atendida`);
  } catch (err) {
    toast(err.message || "Error al atender llamada");
  }
}

async function marcarServido(mesa, pedidoId) {
  try {
    await apiPostCamarero(`/api/mesas/${mesa}/pedidos/${pedidoId}/servido`);
    toast(`Pedido #${pedidoId} servido`);
  } catch (err) {
    toast(err.message || "Error al marcar servido");
  }
}

async function marcarPagado(mesa) {
  try {
    await apiPostCamarero(`/api/mesas/${mesa}/pagado`);
    toast(`Mesa ${mesa} pagada`);
  } catch (err) {
    toast(err.message || "Error al marcar pagado");
  }
}

async function liberarMesa(mesa) {
  if (!confirm(`¿Liberar mesa ${mesa}? Se borrarán los pedidos de la sesión.`)) return;
  try {
    await apiPostCamarero(`/api/mesas/${mesa}/liberar`);
    cerrarMesa();
    toast(`Mesa ${mesa} libre`);
  } catch (err) {
    toast(err.message || "Error al liberar mesa");
  }
}

document.querySelectorAll("[data-cerrar-mesa]").forEach((el) => {
  el.addEventListener("click", cerrarMesa);
});

$("#btn-logout-camarero").addEventListener("click", () => {
  logoutCamarero();
  toast("Sesión cerrada");
});

$("#login-form-camarero").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = $("#login-error-camarero");
  const btn = $("#btn-login-camarero");
  err.hidden = true;
  btn.disabled = true;
  btn.textContent = "Entrando...";
  try {
    await loginCamarero(
      $("#usuario-camarero").value.trim(),
      $("#password-camarero").value.trim()
    );
    mostrarPanelCamarero();
    await cargarInicial();
  } catch (error) {
    err.textContent = error.message || "No se pudo entrar";
    err.hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
});

if (tokenCamarero) {
  mostrarPanelCamarero();
  cargarInicial().catch(() => {
    logoutCamarero();
  });
}
