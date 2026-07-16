# QResto — Historial de cambios (desarrollo)

Registro de lo implementado en el producto, para que cualquiera que abra el repo sepa qué hay y cuándo se añadió.

---

## 16 de julio de 2026

### Opciones de bebida al pedir
- El admin puede activar en cada producto el check **«Tiene opciones de bebida»**.
- En la carta, al añadir ese producto, el cliente elige (multi-selección): Fría, Natural, Con hielo, Con limón.
- Las opciones viajan en el carrito, el pedido, el panel camarero y el historial de ventas.
- Misma bebida con distintas opciones = líneas distintas en el carrito.

**Archivos clave:** `client/js/carrito.js`, `client/js/app.js`, `client/index.html`, `client/js/admin.js`, `server/carta.js`, `server/ventas.js`

### Historial de ventas con calendario
- Las ventas ya no se borran al cambiar de día.
- Se guardan por jornada en `server/data/ventas/YYYY-MM-DD.json`.
- En admin, pestaña **Ventas**: selector de fecha, botones día anterior / hoy / siguiente, chips de días con datos y botón Actualizar.
- APIs: `GET /api/admin/ventas?fecha=YYYY-MM-DD`, `GET /api/admin/ventas/dias` (se mantiene `ventas-hoy` como alias del día actual).
- Fecha de jornada en hora local (no UTC).

**Archivos clave:** `server/ventas.js`, `server/server.js`, `client/admin.html`, `client/js/admin.js`, `client/css/admin.css`

### Corrección IDs de pedido
- Tras reiniciar el servidor, la secuencia de IDs continúa desde el máximo del día (evita choques con ventas ya guardadas).
- Al servir/cobrar se actualiza el registro correcto (misma mesa + no pagado + más reciente).

**Archivos clave:** `server/store.js`, `server/ventas.js`

---

## 9 de julio de 2026 (y sesión previa en main)

### Gestión de personal y QR
- Login de camarero con usuario + contraseña.
- CRUD de camareros en admin (modal de edición).
- Pestaña **Mesas QR**: descargar / imprimir QR por mesa.
- README con capturas y enlace al repositorio.

**Commit de referencia:** `b03d21f` — *Add professional staff management and QR admin workflows.*

---

## Estado actual del MVP (resumen)

| Área | Estado |
|------|--------|
| Carta cliente + carrito + pedido | Hecho |
| Llamar camarero | Hecho |
| Panel camarero tiempo real | Hecho |
| Admin carta / alérgenos / agotado | Hecho |
| Mesas QR | Hecho |
| Camareros con login | Hecho |
| Opciones de bebida | Hecho |
| Ventas del día + historial por calendario | Hecho |
| MySQL opcional | Preparado (JSON por defecto en local) |
| Despliegue en producción | Pendiente |
| Pago desde el móvil del cliente | Fuera de MVP |

---

## Cómo arrancar y probar

Ver [README.md](../README.md).

| URL | Uso |
|-----|-----|
| http://localhost:3000/?mesa=3 | Carta cliente |
| http://localhost:3000/camarero.html | Panel sala |
| http://localhost:3000/admin.html | Admin (clave en `.env`) |
