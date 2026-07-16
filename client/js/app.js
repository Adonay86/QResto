import { ALERGENOS_LABEL, formatoPrecio, formatearLineaProducto } from "./utils.js";
import { IMAGEN_FALLBACK, OPCIONES_BEBIDA, OPCIONES_BEBIDA_LABEL } from "./constants.js";
import { $, crearToast } from "./dom.js";
import { enviarPedido, llamarCamarero, obtenerPedidosMesa } from "./api.js";
import {
  anadirProducto,
  cambiarCantidad,
  etiquetaOpciones,
  getCantidadTotal,
  getCarrito,
  getTotal,
  vaciarCarrito,
} from "./carrito.js";

const params = new URLSearchParams(window.location.search);
const mesa = params.get("mesa") || "1";

let carta = { categorias: [], productos: [] };
let categoriaActiva = null;
let pedidosActivos = [];
let productoOpcionesPendiente = null;

const toast = crearToast("#toast", 2200);

async function cargarDatos() {
  const [localRes, cartaRes] = await Promise.all([
    fetch(`/api/local?mesa=${mesa}`),
    fetch("/api/carta"),
  ]);

  const local = await localRes.json();
  carta = await cartaRes.json();
  categoriaActiva = carta.categorias[0]?.id;

  $("#local-nombre").textContent = local.nombre;
  $("#local-subtitulo").textContent = local.subtitulo || "";
  $("#mesa-info").textContent = `Mesa ${mesa}`;

  renderCategorias();
  await cargarPedidosMesa();
  renderProductos();
  actualizarCarritoUI();
}

async function cargarPedidosMesa() {
  try {
    pedidosActivos = await obtenerPedidosMesa(mesa);
  } catch {
    pedidosActivos = [];
  }
}

function renderCategorias() {
  const nav = $("#categorias");
  nav.innerHTML = carta.categorias
    .map(
      (cat) => `
    <button type="button" class="categoria-btn ${cat.id === categoriaActiva ? "activa" : ""}"
      data-cat="${cat.id}">
      ${cat.icono} ${cat.nombre}
    </button>`
    )
    .join("");

  nav.querySelectorAll(".categoria-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      categoriaActiva = btn.dataset.cat;
      renderCategorias();
      renderProductos();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

function imagenProducto(p) {
  const src = p.imagen || IMAGEN_FALLBACK;
  const alt = `Foto de ${p.nombre}`;
  return `
    <div class="producto__imagen-wrap">
      <img class="producto__imagen" src="${src}" alt="${alt}" loading="lazy"
        onerror="this.src='${IMAGEN_FALLBACK}'">
      ${p.agotado ? '<div class="producto__agotado-overlay"><span>Agotado</span></div>' : ""}
    </div>`;
}

function renderProductos() {
  const lista = carta.productos.filter((p) => p.categoria === categoriaActiva);
  const cont = $("#productos");

  if (lista.length === 0) {
    cont.innerHTML = `<p style="text-align:center;color:#6b6b6b;padding:32px;">No hay productos en esta categoría.</p>`;
    return;
  }

  cont.innerHTML = lista
    .map((p) => {
      const alergenos =
        p.alergenos.length > 0
          ? p.alergenos
              .map(
                (a) =>
                  `<span class="alergeno-tag">${ALERGENOS_LABEL[a] || a}</span>`
              )
              .join("")
          : "";

      return `
      <article class="producto ${p.agotado ? "agotado" : ""}" data-id="${p.id}">
        ${imagenProducto(p)}
        <div class="producto__cuerpo">
          <div class="producto__top">
            <h3 class="producto__nombre">${p.nombre}</h3>
            <span class="producto__precio">${formatoPrecio(p.precio)}</span>
          </div>
          <p class="producto__desc">${p.descripcion}</p>
          ${alergenos ? `<div class="producto__alergenos">${alergenos}</div>` : ""}
          <div class="producto__acciones">
            <button type="button" class="btn-anadir" data-id="${p.id}" ${p.agotado ? "disabled" : ""}>
              + Añadir al pedido
            </button>
          </div>
        </div>
      </article>`;
    })
    .join("");

  cont.querySelectorAll(".btn-anadir").forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = carta.productos.find(
        (p) => p.id === Number(btn.dataset.id)
      );
      if (!producto || producto.agotado) return;
      if (producto.opcionesBebida) {
        abrirModalOpciones(producto);
      } else {
        anadirProducto(producto);
        actualizarCarritoUI();
        toast(`✓ ${producto.nombre} añadido`);
      }
    });
  });

  renderPedidoActivo();
}

function abrirModalOpciones(producto) {
  productoOpcionesPendiente = producto;
  $("#opciones-titulo").textContent = producto.nombre;
  $("#opciones-checks").innerHTML = OPCIONES_BEBIDA.map(
    (o) => `
    <label class="opcion-check">
      <input type="checkbox" name="opcion-bebida" value="${o.id}">
      <span>${o.label}</span>
    </label>`
  ).join("");
  abrirModal("modal-opciones");
}

function getOpcionesSeleccionadas() {
  return [...document.querySelectorAll('input[name="opcion-bebida"]:checked')].map(
    (el) => el.value
  );
}

function cerrarModalOpciones() {
  productoOpcionesPendiente = null;
  cerrarModal("modal-opciones");
}

function confirmarOpciones() {
  const producto = productoOpcionesPendiente;
  if (!producto) return;
  const opciones = getOpcionesSeleccionadas();
  anadirProducto(producto, opciones);
  actualizarCarritoUI();
  const extra = etiquetaOpciones(opciones, OPCIONES_BEBIDA_LABEL);
  toast(extra ? `✓ ${producto.nombre} · ${extra}` : `✓ ${producto.nombre} añadido`);
  cerrarModalOpciones();
}

function renderPedidoActivo() {
  const existente = document.getElementById("pedido-activo-bloque");
  if (existente) existente.remove();

  const lineas = pedidosActivos.flatMap((p) =>
    p.lineas.map((l) => ({ ...l, estado: p.estado }))
  );

  if (lineas.length === 0) return;

  const bloque = document.createElement("section");
  bloque.id = "pedido-activo-bloque";
  bloque.className = "pedido-activo";
  bloque.innerHTML = `
    <h3>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Tu pedido
    </h3>
    ${lineas
      .map(
        (l) => `
      <div class="pedido-activo__linea">
        <span>${formatearLineaProducto(l)} ${l.estado === "servido" ? "✓" : ""}</span>
        <span>${formatoPrecio(l.precio * l.cantidad)}</span>
      </div>`
      )
      .join("")}
  `;

  $("#productos").prepend(bloque);
}

function miniaturaCarrito(item) {
  if (item.imagen) {
    return `<img class="carrito-linea__img" src="${item.imagen}" alt="" loading="lazy"
      onerror="this.style.display='none'">`;
  }
  return `<div class="carrito-linea__img carrito-linea__img--placeholder">🍽️</div>`;
}

function nombreCarrito(item) {
  const extra = etiquetaOpciones(item.opciones, OPCIONES_BEBIDA_LABEL);
  if (!extra) return item.nombre;
  return `${item.nombre} · ${extra}`;
}

function actualizarCarritoUI() {
  const count = getCantidadTotal();
  const badge = $("#carrito-count");
  badge.textContent = count;
  badge.hidden = count === 0;

  const items = getCarrito();
  const lista = $("#carrito-lista");

  if (items.length === 0) {
    lista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.<br>Explora la carta y añade algo rico.</p>`;
    $("#carrito-total").textContent = formatoPrecio(0);
    $("#btn-confirmar").disabled = true;
    return;
  }

  lista.innerHTML = items
    .map(
      (item) => `
    <div class="carrito-linea">
      ${miniaturaCarrito(item)}
      <div class="carrito-linea__info">
        <div class="carrito-linea__nombre">${nombreCarrito(item)}</div>
        <div class="carrito-linea__precio">${formatoPrecio(item.precio)} / ud.</div>
      </div>
      <div class="carrito-linea__cantidad">
        <button type="button" data-clave="${item.clave}" data-delta="-1" aria-label="Quitar">−</button>
        <span>${item.cantidad}</span>
        <button type="button" data-clave="${item.clave}" data-delta="1" aria-label="Añadir">+</button>
      </div>
    </div>`
    )
    .join("");

  lista.querySelectorAll("button[data-delta]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cambiarCantidad(btn.dataset.clave, Number(btn.dataset.delta));
      actualizarCarritoUI();
    });
  });

  $("#carrito-total").textContent = formatoPrecio(getTotal());
  $("#btn-confirmar").disabled = false;
}

function abrirModal(id) {
  $(`#${id}`).hidden = false;
  document.body.style.overflow = "hidden";
}

function cerrarModal(id) {
  $(`#${id}`).hidden = true;
  document.body.style.overflow = "";
}

function mostrarToast(msg) {
  toast(msg);
}

$("#btn-carrito").addEventListener("click", () => {
  actualizarCarritoUI();
  abrirModal("modal-carrito");
});

$("#btn-llamar").addEventListener("click", async () => {
  $("#btn-llamar").disabled = true;
  try {
    await llamarCamarero(mesa);
    mostrarToast("🔔 Camarero avisado — Mesa " + mesa);
  } catch {
    mostrarToast("No se pudo avisar al camarero");
  } finally {
    $("#btn-llamar").disabled = false;
  }
});

$("#btn-confirmar").addEventListener("click", async () => {
  const lineas = getCarrito();
  const btn = $("#btn-confirmar");
  btn.disabled = true;
  btn.textContent = "Enviando...";

  try {
    await enviarPedido(mesa, lineas);
    const resumen = lineas
      .map((i) => formatearLineaProducto(i))
      .join(", ");
    $("#pedido-resumen").textContent = resumen || "Tu pedido ha llegado a cocina.";
    vaciarCarrito();
    actualizarCarritoUI();
    await cargarPedidosMesa();
    cerrarModal("modal-carrito");
    abrirModal("modal-pedido");
    renderProductos();
  } catch {
    mostrarToast("Error al enviar el pedido. Inténtalo de nuevo.");
  } finally {
    btn.textContent = "Confirmar pedido";
    btn.disabled = getCarrito().length === 0;
  }
});

$("#btn-opciones-anadir").addEventListener("click", confirmarOpciones);

document.querySelectorAll("[data-cerrar]").forEach((el) => {
  el.addEventListener("click", () => cerrarModal("modal-carrito"));
});

document.querySelectorAll("[data-cerrar-pedido]").forEach((el) => {
  el.addEventListener("click", () => cerrarModal("modal-pedido"));
});

document.querySelectorAll("[data-cerrar-opciones]").forEach((el) => {
  el.addEventListener("click", cerrarModalOpciones);
});

cargarDatos().catch(() => {
  $("#local-nombre").textContent = "Error al cargar";
  $("#productos").innerHTML = `<p style="text-align:center;padding:40px;color:#b91c1c;">No se pudo cargar la carta.<br>¿Está el servidor activo?</p>`;
});
