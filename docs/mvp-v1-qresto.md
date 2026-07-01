# QResto — MVP v1 (primera versión)

Documento de planificación · Versión 1.0 · 22 de junio de 2026

---

## Resumen

El **MVP v1** es la versión mínima que puedes **vender y usar en un bar real** un sábado noche. No es un prototipo de laboratorio: tiene que funcionar en producción con 1 local, hasta 10 mesas y 2 usuarios de sala.

| Concepto | Decisión MVP |
|----------|--------------|
| Objetivo | Validar con 3–5 bares piloto en Canarias |
| Plan equivalente | **Básico** (29 €/mes) — núcleo del producto |
| Locales | 1 solo local por cuenta |
| Mesas | Hasta 10 |
| Usuarios con login | Admin local + hasta 2 camareros |
| Pago cliente | Solo en caja (camarero marca pagado) |
| Idiomas | Solo español |
| Chatbot | No |
| Multi-local | No |

**Regla de oro:** Si una función no es imprescindible para que un bar use QResto un fin de semana completo, **no entra en v1**.

---

## 1. Qué SÍ entra en MVP v1

### Cliente (QR, sin login)

| # | Función | Prioridad |
|---|---------|-----------|
| 1 | Escanear QR de mesa → abrir carta del local | P0 |
| 2 | Ver carta por categorías: entrantes, comidas, bebidas | P0 |
| 3 | Ver nombre, descripción y precio de cada producto | P0 |
| 4 | Ver alérgenos por producto (obligatorio legal) | P0 |
| 5 | Añadir / quitar productos del carrito | P0 |
| 6 | Ver resumen del carrito con total | P0 |
| 7 | Confirmar pedido → enviar a cocina/barra | P0 |
| 8 | Ver lista de lo pedido en la sesión | P0 |
| 9 | Botón **Llamar al camarero** | P0 |
| 10 | Diseño responsive (móvil) | P0 |
| 11 | Indicar si producto está agotado (no se puede pedir) | P1 |

### Camarero (panel móvil/tablet)

| # | Función | Prioridad |
|---|---------|-----------|
| 1 | Login con email + contraseña | P0 |
| 2 | Vista de mesas: libre / ocupada / pide atención | P0 |
| 3 | Ver pedidos nuevos en tiempo real | P0 |
| 4 | Ver detalle del pedido por mesa | P0 |
| 5 | Notificación de **llamada de camarero** | P0 |
| 6 | Marcar llamada como atendida | P0 |
| 7 | Marcar producto o pedido como **servido** | P0 |
| 8 | Marcar mesa como **pagada** | P0 |
| 9 | Abrir mesa (nueva sesión) | P0 |
| 10 | Liberar mesa (cerrar sesión) | P0 |
| 11 | Añadir nota a un pedido (ej. "sin hielo") | P1 |

### Admin local (panel PC/tablet)

| # | Función | Prioridad |
|---|---------|-----------|
| 1 | Login con email + contraseña | P0 |
| 2 | **CRUD carta**: categorías y productos | P0 |
| 3 | Precio, descripción, alérgenos por producto | P0 |
| 4 | Activar / desactivar producto (agotado) | P0 |
| 5 | **Gestión de mesas**: crear, numerar, asignar QR | P0 |
| 6 | Descargar / imprimir QR por mesa | P0 |
| 7 | Crear usuarios camarero | P0 |
| 8 | Datos del local: nombre, dirección, logo | P1 |
| 9 | Resumen del día: total ventas, nº pedidos, ticket medio | P0 |
| 10 | Historial de pedidos del día | P1 |
| 11 | Ver estado de mesas (misma vista que camarero) | P0 |

### Sistema (backend / infraestructura)

| # | Función | Prioridad |
|---|---------|-----------|
| 1 | Tiempo real: pedidos y llamadas (WebSockets o similar) | P0 |
| 2 | QR único por mesa (local + mesa) | P0 |
| 3 | Sesión por mesa (se resetea al liberar) | P0 |
| 4 | Roles: cliente (sin auth), camarero, admin | P0 |
| 5 | Base de datos persistente | P0 |
| 6 | HTTPS y despliegue en producción | P0 |
| 7 | Diseño multi-local en BD (`local_id`) sin UI multi-local | P1 |

**P0** = imprescindible para lanzar · **P1** = importante pero puede entrar en v1.1 (primeras 2 semanas post-lanzamiento)

---

## 2. Qué NO entra en MVP v1

| Función | Fase | Motivo |
|---------|------|--------|
| Pago desde móvil | Fase 5 | Complejidad legal y técnica |
| Chatbot turista | Fase 2 | No bloquea validación |
| Multiidioma (EN, DE…) | Fase 2 | Canarias piloto puede empezar solo ES |
| Rol encargado separado | v1.1 | Admin + camarero cubren bar pequeño |
| Contabilidad avanzada (gastos, PDF) | Fase 3 | Resumen diario basta al inicio |
| Zonas (terraza/salón) | Fase 2 | Un solo listado de mesas en v1 |
| Anular pedido | v1.1 | Admin puede hacerlo manualmente al inicio |
| Descuentos | v1.2 | No crítico para piloto |
| Informes PDF/Excel | Fase 3 | — |
| Multi-local / admin cadena | Fase 4 | — |
| App nativa iOS/Android | Nunca prioritario | Web responsive es suficiente |
| Impresión automática cocina | v1.1 | Panel en tablet en cocina como workaround |
| Integración TPV externo | Fase 4+ | — |
| Notificaciones push | v1.1 | Tiempo real en pantalla abierta basta |
| Fotos en carta | v1.1 | Texto + precio primero |
| Registro público de locales | Post-MVP | Tú das de alta al piloto manualmente |

---

## 3. Pantallas por rol (mapa MVP)

### Cliente — 4 pantallas

```
[Carta]  →  [Detalle producto]  →  [Carrito]  →  [Mi pedido]
   ↑              ↑                    ↑              ↑
Categorías    Alérgenos           Confirmar      Llamar camarero
              Añadir carrito      pedido         Estado pedido
```

| Pantalla | Contenido |
|----------|-----------|
| **Carta** | Header local, tabs categorías, lista productos |
| **Detalle** | Nombre, descripción, precio, alérgenos, botón añadir |
| **Carrito** | Líneas, cantidades, total, botón confirmar |
| **Mi pedido** | Pedido activo, botón llamar camarero fijo abajo |

### Camarero — 3 pantallas principales

```
[Mesas]  →  [Detalle mesa]  →  [Pedido]
   ↑              ↑
Estado color    Llamadas + pedidos
Filtro libre/   Marcar servido/pagado
ocupada
```

| Pantalla | Contenido |
|----------|-----------|
| **Mesas** | Grid o lista con color: verde libre, rojo ocupada, naranja llama |
| **Detalle mesa** | Pedidos activos, historial sesión, acciones |
| **Alertas** | Banner o lista de llamadas pendientes (puede ser overlay) |

### Admin — 5 secciones

```
[Dashboard]  [Carta]  [Mesas/QR]  [Usuarios]  [Ventas hoy]
```

| Sección | Contenido |
|---------|-----------|
| **Dashboard** | Ventas hoy, mesas ocupadas, pedidos pendientes |
| **Carta** | Lista categorías → productos → editar |
| **Mesas** | Tabla mesas, generar QR, descargar PNG |
| **Usuarios** | Crear/editar camareros |
| **Ventas** | Listado pedidos del día con totales |

---

## 4. Flujos críticos (deben funcionar perfecto)

### Flujo 1: Pedido completo

```
Cliente escanea QR mesa 3
  → Ve carta
  → Añade 2 tapas + 2 cervezas
  → Confirma pedido
  → Panel camarero: notificación + mesa 3 ocupada
  → Camarero prepara / cocina ve pedido
  → Camarero marca servido
  → Cliente ve estado actualizado
```

### Flujo 2: Llamar camarero

```
Cliente pulsa "Llamar camarero"
  → Mesa 3 cambia a estado "atención"
  → Camarero ve alerta sonido + visual
  → Camarero atiende → marca atendido
  → Mesa vuelve a ocupada normal
```

### Flujo 3: Cierre de mesa

```
Cliente termina
  → Camarero cobra en caja
  → Marca mesa como pagada
  → Libera mesa
  → Sesión cliente se cierra
  → QR mesa 3 lista para nuevo cliente
```

### Flujo 4: Admin configura local nuevo

```
Admin crea categorías y productos
  → Crea 8 mesas
  → Descarga 8 QR
  → Crea usuario camarero
  → Local listo para abrir
```

---

## 5. Requisitos no funcionales (MVP)

| Requisito | Objetivo |
|-----------|----------|
| Tiempo de carga carta | < 3 segundos en 4G |
| Latencia pedido → panel | < 2 segundos |
| Uptime | 99 % (fines de semana críticos) |
| Dispositivos | Chrome/Safari móvil últimas 2 versiones |
| Tablet camarero | iPad o Android 10"+ |
| Sin app instalable | 100 % web (PWA opcional v1.1) |
| Datos | RGPD: política privacidad + no pedir datos personales al cliente |

---

## 6. Stack técnico recomendado (MVP)

| Capa | Tecnología sugerida | Motivo |
|------|---------------------|--------|
| Frontend cliente + paneles | HTML, CSS, JavaScript (o React) | Lo que dominas del bootcamp |
| Backend API | Node.js + Express | Mismo lenguaje, rápido de iterar |
| Tiempo real | Socket.io | Pedidos y llamadas en vivo |
| Base de datos | PostgreSQL o SQLite → Postgres | SQLite para dev; Postgres en producción |
| Auth | JWT o sesiones | Login camarero y admin |
| Hosting frontend | Netlify o Vercel | Gratis, HTTPS |
| Hosting backend | Render o Railway | Gratis/barato al inicio |
| QR | Librería qrcode.js + URL por mesa | Simple |

**No sobre-ingenierizar:** Un monolito Node con API REST + WebSockets es suficiente para MVP.

---

## 7. Estructura de datos mínima

```
Organización (1 por ahora, preparado para futuro)
 └── Local
      ├── Mesas (id, número, qr_token, estado)
      ├── Categorías (entrantes, comidas, bebidas…)
      ├── Productos (nombre, precio, alérgenos, activo)
      ├── Usuarios (rol: admin | camarero)
      ├── Sesiones_mesa (mesa, inicio, fin)
      ├── Pedidos (mesa, líneas, estado, total)
      └── Llamadas_camarero (mesa, atendida, timestamp)
```

---

## 8. Criterios de éxito del MVP

El MVP es un **éxito** si:

| Criterio | Meta |
|----------|------|
| Bares piloto activos | 3–5 en Canarias |
| Uso real fin de semana | Al menos 1 bar un sábado completo sin caídas |
| Pedidos procesados | 50+ pedidos reales en total |
| Feedback dueños | "Lo seguiría usando" de 3/5 |
| Tiempo onboarding | < 2 horas configurar un local |
| Bugs críticos post-lanzamiento | 0 que impidan pedir o ver mesas |

**No es éxito aún:** 100 clientes, chatbot, pago móvil, beneficio alto.

---

## 9. Roadmap post-MVP (v1.1 → v1.3)

| Versión | Plazo orientativo | Añade |
|---------|-------------------|-------|
| **v1.1** | +2–4 semanas | Fotos carta, anular pedido, notificaciones sonido, rol encargado |
| **v1.2** | +1–2 meses | Multiidioma EN+DE, zonas mesas, descuentos |
| **v1.3** | +2–3 meses | Chatbot básico, contabilidad gastos, informes PDF |
| **v2.0** | +4–6 meses | Plan Pro completo, pago móvil beta |

---

## 10. Plan de lanzamiento piloto

| Semana | Acción |
|--------|--------|
| 1–2 | Setup proyecto, BD, auth, admin carta |
| 3–4 | Carta cliente + carrito + pedidos |
| 5 | Panel camarero + tiempo real |
| 6 | QR mesas + flujo completo |
| 7 | Pruebas internas + arreglos |
| 8 | **Piloto bar 1** (conocido, permiso para fallar) |
| 9–10 | Piloto bares 2–3 + iteración |
| 11–12 | Piloto bares 4–5 + preparar venta |

---

## 11. Checklist "listo para producción"

Antes de llevar QResto a un bar real:

- [ ] QR de cada mesa abre la carta correcta
- [ ] Pedido llega al panel en < 2 s
- [ ] Llamar camarero genera alerta visible y audible
- [ ] Marcar pagado + liberar mesa resetea sesión
- [ ] Admin puede cambiar carta sin tocar código
- [ ] Alérgenos visibles en cada producto
- [ ] Funciona en iPhone y Android
- [ ] HTTPS en producción
- [ ] Backup de base de datos configurado
- [ ] Política de privacidad enlazada en carta cliente
- [ ] Plan B si cae WiFi: carta física de respaldo (responsabilidad del bar, avisar en onboarding)

---

## 12. Resumen visual: MVP vs producto completo

```
MVP v1 (ahora)          Producto completo (12–18 meses)
─────────────────       ──────────────────────────────
✅ Carta QR              ✅ Multiidioma + chatbot
✅ Pedidos                ✅ Pago móvil
✅ Carrito                ✅ Contabilidad avanzada
✅ Llamar camarero        ✅ Multi-local
✅ Panel mesas            ✅ Integración TPV
✅ Marcar pagado          ✅ App nativa (opcional)
✅ Admin carta
✅ Resumen ventas día
✅ 1 local, 10 mesas
```

---

## 13. Documentación QResto — estado completo

| Documento | Estado |
|-----------|--------|
| Valoración de mercado | ✅ |
| Roles de usuario | ✅ |
| Modelo de negocio | ✅ |
| MVP v1 | ✅ |

**Siguiente paso natural:** empezar a **construir** el proyecto (estructura código, repositorio, primera pantalla).
