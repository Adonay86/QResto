require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const store = require("./store");
const carta = require("./carta");
const auth = require("./auth");
const ventas = require("./ventas");
const db = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

app.use(express.json());

function emitirEstado() {
  io.emit("estado:actualizado", store.getEstadoPublico());
}

// ── API pública ──
app.get("/api/local", (req, res) => {
  res.json({ ...carta.getLocal(), mesa: req.query.mesa || "1" });
});

app.get("/api/carta", (req, res) => {
  res.json(carta.getCarta());
});

app.get("/api/estado", (req, res) => {
  res.json(store.getEstadoPublico());
});

app.post("/api/pedidos", (req, res) => {
  const { mesa, lineas } = req.body;
  const resultado = store.crearPedido(mesa, lineas);
  if (resultado.error) return res.status(400).json({ error: resultado.error });
  emitirEstado();
  res.status(201).json(resultado);
});

app.post("/api/llamar", (req, res) => {
  const { mesa } = req.body;
  const resultado = store.llamarCamarero(mesa);
  if (resultado.error) return res.status(400).json({ error: resultado.error });
  emitirEstado();
  res.json(resultado);
});

app.post("/api/mesas/:mesa/atender-llamada", (req, res) => {
  const resultado = store.atenderLlamada(req.params.mesa);
  if (resultado.error) return res.status(400).json({ error: resultado.error });
  emitirEstado();
  res.json(resultado);
});

app.post("/api/mesas/:mesa/pedidos/:id/servido", (req, res) => {
  const resultado = store.marcarPedidoServido(
    req.params.mesa,
    Number(req.params.id)
  );
  if (resultado.error) return res.status(400).json({ error: resultado.error });
  emitirEstado();
  res.json(resultado);
});

app.post("/api/mesas/:mesa/pagado", (req, res) => {
  const resultado = store.marcarMesaPagada(req.params.mesa);
  if (resultado.error) return res.status(400).json({ error: resultado.error });
  emitirEstado();
  res.json(resultado);
});

app.post("/api/mesas/:mesa/liberar", (req, res) => {
  const resultado = store.liberarMesa(req.params.mesa);
  if (resultado.error) return res.status(400).json({ error: resultado.error });
  emitirEstado();
  res.json(resultado);
});

app.post("/api/demo/reset", (req, res) => {
  store.resetDemo();
  emitirEstado();
  res.json({ ok: true });
});

// ── API admin ──
app.post("/api/admin/login", (req, res) => {
  const resultado = auth.login(req.body.password);
  if (resultado.error) return res.status(401).json(resultado);
  res.json(resultado);
});

app.get("/api/admin/resumen", auth.middleware, (req, res) => {
  res.json({
    local: carta.getLocal(),
    ventas: store.getResumenDia(),
  });
});

app.get("/api/admin/ventas-hoy", auth.middleware, (req, res) => {
  res.json({
    resumen: store.getResumenDia(),
    productos: ventas.getResumenProductos(),
    registros: store.getHistorialVentas(),
  });
});

app.put("/api/admin/local", auth.middleware, (req, res) => {
  const { nombre, subtitulo } = req.body;
  const local = carta.guardarLocal({ nombre, subtitulo });
  res.json(local);
});

app.get("/api/admin/carta", auth.middleware, (req, res) => {
  res.json(carta.getCarta());
});

app.post("/api/admin/productos", auth.middleware, (req, res) => {
  const resultado = carta.crearProducto(req.body);
  if (resultado.error) return res.status(400).json(resultado);
  res.status(201).json(resultado);
});

app.put("/api/admin/productos/:id", auth.middleware, (req, res) => {
  const resultado = carta.actualizarProducto(req.params.id, req.body);
  if (resultado.error) return res.status(400).json(resultado);
  res.json(resultado);
});

app.patch("/api/admin/productos/:id/agotado", auth.middleware, (req, res) => {
  const resultado = carta.toggleAgotado(req.params.id);
  if (resultado.error) return res.status(400).json(resultado);
  res.json(resultado);
});

app.delete("/api/admin/productos/:id", auth.middleware, (req, res) => {
  const resultado = carta.eliminarProducto(req.params.id);
  if (resultado.error) return res.status(400).json(resultado);
  res.json(resultado);
});

io.on("connection", (socket) => {
  socket.emit("estado:actualizado", store.getEstadoPublico());
});

app.use(express.static(path.join(__dirname, "../client")));

async function arrancar() {
  await db.init();
  await carta.init();
  await ventas.init();

  server.listen(PORT, () => {
    console.log(`\n  QResto corriendo en http://localhost:${PORT}`);
    console.log(`  Carta cliente:  http://localhost:${PORT}/?mesa=3`);
    console.log(`  Panel camarero: http://localhost:${PORT}/camarero.html`);
    console.log(`  Panel admin:    http://localhost:${PORT}/admin.html`);
    console.log(`  Admin clave:    qresto2026`);
    console.log(`  Datos:          ${db.enabled() ? "MySQL" : "JSON (archivos locales)"}\n`);
  });
}

arrancar().catch((err) => {
  console.error("Error al arrancar:", err);
  process.exit(1);
});
