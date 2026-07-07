import { ALERGENOS_LABEL, formatoPrecio, formatearHora, etiquetaEstadoPedido } from "./utils.js";
import { TOKEN_KEY, SOCKET_EVENT, IMAGEN_FALLBACK } from "./constants.js";
import { $, crearToast } from "./dom.js";
import { crearApiAdmin } from "./api.js";

const ALERGENOS_LISTA = Object.keys(ALERGENOS_LABEL);

let token = localStorage.getItem(TOKEN_KEY);
let carta = { categorias: [], productos: [] };
let resumen = null;
let socket = null;

const toast = crearToast("#toast-admin");
const api = crearApiAdmin(() => token, logout);

function conectarTiempoReal() {
  if (socket) return;
  socket = io();
  socket.on(SOCKET_EVENT, () => {
    actualizarResumen();
    actualizarVentas();
  });
}

const etiquetaEstadoVenta = etiquetaEstadoPedido;

function logout() {
  token = null;
  localStorage.removeItem(TOKEN_KEY);
  $("#admin-app").hidden = true;
  $("#login-pantalla").hidden = false;
}

function mostrarPanel() {
  $("#login-pantalla").hidden = true;
  $("#admin-app").hidden = false;
}

// ── Login ──
async function verificarServidor() {
  const offline = $("#login-offline");
  try {
    const res = await fetch("/api/carta", { method: "GET" });
    offline.hidden = res.ok;
  } catch {
    offline.hidden = false;
  }
}

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const err = $("#login-error");
  const btn = $("#btn-login");
  err.hidden = true;
  btn.disabled = true;
  btn.textContent = "Entrando...";

  const password = $("#password").value.trim();

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 401) {
        err.textContent = "Contraseña incorrecta";
      } else {
        err.textContent = data.error || "No se pudo entrar";
      }
      err.hidden = false;
      return;
    }

    token = data.token;
    localStorage.setItem(TOKEN_KEY, token);
    mostrarPanel();
    conectarTiempoReal();
    try {
      await cargarTodo();
    } catch (loadErr) {
      logout();
      err.textContent = "Entraste pero falló la carga. Recarga la página (F5).";
      err.hidden = false;
      throw loadErr;
    }
  } catch {
    err.textContent = "No hay conexión con el servidor. ¿Está npm start activo?";
    err.hidden = false;
    $("#login-offline").hidden = false;
  } finally {
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
});

$("#btn-logout").addEventListener("click", logout);

// ── Tabs ──
document.querySelectorAll(".admin-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("activa"));
    tab.classList.add("activa");
    document.querySelectorAll(".admin-seccion").forEach((s) => (s.hidden = true));
    $(`#tab-${tab.dataset.tab}`).hidden = false;
    if (tab.dataset.tab === "resumen") actualizarResumen();
    if (tab.dataset.tab === "ventas") actualizarVentas();
  });
});

// ── Cargar datos ──
async function cargarTodo() {
  const [cartaData, resumenData] = await Promise.all([
    api("/api/admin/carta"),
    api("/api/admin/resumen"),
  ]);
  carta = cartaData;
  resumen = resumenData;
  renderResumen();
  renderFiltros();
  renderProductosAdmin();
  renderFormLocal();
  renderAlergenosChecks();
  poblarSelectCategorias();
  await actualizarVentas();
}

function renderResumen() {
  if (!resumen) return;
  const v = resumen.ventas;
  $("#stats-grid").innerHTML = `
    <div class="stat-card">
      <div class="stat-card__valor">${v.numPedidos}</div>
      <div class="stat-card__label">Pedidos hoy</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__valor">${formatoPrecio(v.totalEnSala)}</div>
      <div class="stat-card__label">En sala (sin cobrar)</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__valor">${formatoPrecio(v.totalCobrado)}</div>
      <div class="stat-card__label">Cobrado</div>
    </div>
    <div class="stat-card stat-card--destacada">
      <div class="stat-card__valor">${formatoPrecio(v.totalVentas)}</div>
      <div class="stat-card__label">Total ventas hoy</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__valor">${v.mesasOcupadas}/${v.mesasTotal}</div>
      <div class="stat-card__label">Mesas activas</div>
    </div>
    <div class="stat-card">
      <div class="stat-card__valor">${carta.productos.length}</div>
      <div class="stat-card__label">Productos en carta</div>
    </div>
  `;
}

async function actualizarResumen() {
  try {
    resumen = await api("/api/admin/resumen");
    renderResumen();
  } catch {
    /* ignorar si no hay sesión */
  }
}

async function actualizarVentas() {
  try {
    const data = await api("/api/admin/ventas-hoy");
    renderVentas(data);
    if (resumen) {
      resumen.ventas = data.resumen;
      renderResumen();
    }
  } catch {
    /* ignorar */
  }
}

function renderVentas(data) {
  const lista = $("#ventas-lista");
  const productos = $("#ventas-productos");
  const fecha = new Date(data.resumen.fecha + "T12:00:00");
  $("#ventas-fecha").textContent =
    "Registro del " +
    fecha.toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

  const items = data.productos || [];

  if (items.length === 0) {
    productos.innerHTML = `
      <p class="ventas-vacio" style="padding:24px;">
        Aún no se ha vendido ningún producto hoy.
      </p>`;
  } else {
    productos.innerHTML = items
      .map(
        (p) => `
      <div class="venta-producto-fila">
        <span class="venta-producto-fila__nombre">${p.nombre}</span>
        <span class="venta-producto-fila__cantidad">
          ${p.cantidad}
          <small>uds.</small>
        </span>
        <span class="venta-producto-fila__total">${formatoPrecio(p.total)}</span>
      </div>`
      )
      .join("");
  }

  if (!data.registros.length) {
    lista.innerHTML = `
      <p class="ventas-vacio">
        No hay pedidos individuales registrados todavía.
      </p>`;
    return;
  }

  lista.innerHTML = data.registros
    .map((r) => {
      const lineas = r.lineas
        .map(
          (l) => `
        <div class="venta-registro__linea">
          <span>${l.cantidad}× ${l.nombre}</span>
          <span>${formatoPrecio(l.precio * l.cantidad)}</span>
        </div>`
        )
        .join("");

      return `
      <article class="venta-registro">
        <div class="venta-registro__top">
          <div>
            <div class="venta-registro__mesa">Mesa ${r.mesa} · Pedido #${r.id}</div>
            <div class="venta-registro__hora">${formatearHora(r.creadoEn)}</div>
            <span class="venta-estado ${r.estado}">${etiquetaEstadoVenta(r.estado)}</span>
          </div>
          <div class="venta-registro__total">${formatoPrecio(r.total)}</div>
        </div>
        ${lineas}
      </article>`;
    })
    .join("");
}

$("#btn-refrescar-ventas").addEventListener("click", actualizarVentas);

function renderFormLocal() {
  $("#local-nombre").value = resumen.local.nombre || "";
  $("#local-subtitulo").value = resumen.local.subtitulo || "";
}

$("#form-local").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await api("/api/admin/local", {
      method: "PUT",
      body: JSON.stringify({
        nombre: $("#local-nombre").value,
        subtitulo: $("#local-subtitulo").value,
      }),
    });
    toast("✓ Datos del local guardados");
    resumen = await api("/api/admin/resumen");
  } catch (err) {
    toast(err.message);
  }
});

// ── Carta ──
function renderFiltros() {
  const sel = $("#filtro-categoria");
  sel.innerHTML = `
    <option value="">Todas las categorías</option>
    ${carta.categorias.map((c) => `<option value="${c.id}">${c.icono} ${c.nombre}</option>`).join("")}
  `;
  sel.onchange = renderProductosAdmin;
}

function renderProductosAdmin() {
  const filtro = $("#filtro-categoria").value;
  let lista = carta.productos;
  if (filtro) lista = lista.filter((p) => p.categoria === filtro);

  const cont = $("#productos-admin");
  if (lista.length === 0) {
    cont.innerHTML = `<p style="text-align:center;color:#6b6b6b;padding:32px;">No hay productos</p>`;
    return;
  }

  cont.innerHTML = lista
    .map((p) => {
      const cat = carta.categorias.find((c) => c.id === p.categoria);
      return `
      <article class="prod-admin-card ${p.agotado ? "agotado" : ""}">
        <img class="prod-admin-card__img" src="${p.imagen || ""}" alt=""
          onerror="this.src='${IMAGEN_FALLBACK}'">
        <div class="prod-admin-card__info">
          <div class="prod-admin-card__nombre">${p.nombre}</div>
          <div class="prod-admin-card__meta">${cat?.nombre || p.categoria} ${p.agotado ? "· Agotado" : ""}</div>
          <div class="prod-admin-card__precio">${formatoPrecio(p.precio)}</div>
        </div>
        <div class="prod-admin-card__acciones">
          <button type="button" class="btn-mini btn-mini--editar" data-editar="${p.id}">Editar</button>
          <button type="button" class="btn-mini btn-mini--agotado" data-agotado="${p.id}">
            ${p.agotado ? "Disponible" : "Agotado"}
          </button>
          <button type="button" class="btn-mini btn-mini--borrar" data-borrar="${p.id}">Borrar</button>
        </div>
      </article>`;
    })
    .join("");

  cont.querySelectorAll("[data-editar]").forEach((btn) => {
    btn.addEventListener("click", () => abrirEditar(Number(btn.dataset.editar)));
  });
  cont.querySelectorAll("[data-agotado]").forEach((btn) => {
    btn.addEventListener("click", () => toggleAgotado(Number(btn.dataset.agotado)));
  });
  cont.querySelectorAll("[data-borrar]").forEach((btn) => {
    btn.addEventListener("click", () => borrarProducto(Number(btn.dataset.borrar)));
  });
}

function poblarSelectCategorias() {
  $("#prod-categoria").innerHTML = carta.categorias
    .map((c) => `<option value="${c.id}">${c.nombre}</option>`)
    .join("");
}

function renderAlergenosChecks() {
  $("#alergenos-checks").innerHTML = ALERGENOS_LISTA.map(
    (a) => `
    <label><input type="checkbox" name="alergeno" value="${a}"> ${ALERGENOS_LABEL[a]}</label>`
  ).join("");
}

function getAlergenosSeleccionados() {
  return [...document.querySelectorAll('input[name="alergeno"]:checked')].map(
    (el) => el.value
  );
}

function setAlergenosSeleccionados(lista) {
  document.querySelectorAll('input[name="alergeno"]').forEach((el) => {
    el.checked = lista.includes(el.value);
  });
}

// ── Modal producto ──
function abrirNuevo() {
  $("#modal-producto-titulo").textContent = "Nuevo producto";
  $("#prod-id").value = "";
  $("#form-producto").reset();
  setAlergenosSeleccionados([]);
  $("#modal-producto").hidden = false;
  document.body.style.overflow = "hidden";
}

function abrirEditar(id) {
  const p = carta.productos.find((x) => x.id === id);
  if (!p) return;
  $("#modal-producto-titulo").textContent = "Editar producto";
  $("#prod-id").value = p.id;
  $("#prod-nombre").value = p.nombre;
  $("#prod-categoria").value = p.categoria;
  $("#prod-descripcion").value = p.descripcion;
  $("#prod-precio").value = p.precio;
  $("#prod-imagen").value = p.imagen || "";
  $("#prod-agotado").checked = p.agotado;
  setAlergenosSeleccionados(p.alergenos);
  $("#modal-producto").hidden = false;
  document.body.style.overflow = "hidden";
}

function cerrarModal() {
  $("#modal-producto").hidden = true;
  document.body.style.overflow = "";
}

$("#btn-nuevo-producto").addEventListener("click", abrirNuevo);

document.querySelectorAll("[data-cerrar-modal]").forEach((el) => {
  el.addEventListener("click", cerrarModal);
});

$("#form-producto").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = $("#prod-id").value;
  const body = {
    nombre: $("#prod-nombre").value,
    categoria: $("#prod-categoria").value,
    descripcion: $("#prod-descripcion").value,
    precio: $("#prod-precio").value,
    imagen: $("#prod-imagen").value,
    agotado: $("#prod-agotado").checked,
    alergenos: getAlergenosSeleccionados(),
  };

  try {
    if (id) {
      await api(`/api/admin/productos/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      toast("✓ Producto actualizado");
    } else {
      await api("/api/admin/productos", {
        method: "POST",
        body: JSON.stringify(body),
      });
      toast("✓ Producto creado");
    }
    carta = await api("/api/admin/carta");
    cerrarModal();
    renderProductosAdmin();
    resumen = await api("/api/admin/resumen");
    renderResumen();
  } catch (err) {
    toast(err.message);
  }
});

async function toggleAgotado(id) {
  try {
    await api(`/api/admin/productos/${id}/agotado`, { method: "PATCH" });
    carta = await api("/api/admin/carta");
    renderProductosAdmin();
    toast("✓ Estado actualizado");
  } catch (err) {
    toast(err.message);
  }
}

async function borrarProducto(id) {
  const p = carta.productos.find((x) => x.id === id);
  if (!confirm(`¿Borrar "${p?.nombre}"?`)) return;
  try {
    await api(`/api/admin/productos/${id}`, { method: "DELETE" });
    carta = await api("/api/admin/carta");
    renderProductosAdmin();
    toast("✓ Producto eliminado");
  } catch (err) {
    toast(err.message);
  }
}

// ── Init ──
verificarServidor();

if (token) {
  mostrarPanel();
  conectarTiempoReal();
  cargarTodo().catch(() => {
    logout();
    verificarServidor();
  });
}
