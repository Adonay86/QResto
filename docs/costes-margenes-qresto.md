# QResto — Costes, márgenes y beneficio por cliente

Documento financiero · Versión 1.0 · 22 de junio de 2026

---

## Resumen rápido

| Concepto | Cifra orientativa |
|----------|-------------------|
| Coste fijo mensual (inicio, 0–15 clientes) | **~15–45 €/mes** |
| Coste fijo mensual (crecimiento, 15–80 clientes) | **~45–120 €/mes** |
| Coste variable por cliente (infraestructura) | **~0,50–2 €/mes** |
| **Beneficio neto por cliente (plan Básico 29 €)** | **~25–28 €/mes** |
| **Beneficio neto por cliente (plan Pro 49 €)** | **~45–48 €/mes** |
| **Beneficio neto por cliente (plan Premium 79 €)** | **~74–77 €/mes** |
| Clientes para cubrir solo infraestructura | **1–2 clientes** |

*Sin contar tu tiempo, autónomo ni marketing. Cifras para fase inicial en España.*

---

## 1. Qué tienes que pagar sí o sí

### A. Dominio

| Concepto | Coste | Frecuencia |
|----------|-------|------------|
| Dominio `.es` (ej. qresto.es) | 10–15 € | /año |
| Dominio `.com` (ej. qresto.com) | 12–18 € | /año |
| Subdominios por local (bar1.qresto.es) | 0 € extra | Incluido |

**Coste mensual equivalente:** ~**1–1,50 €/mes**

---

### B. Base de datos

| Opción | Coste | Cuándo usarla |
|--------|-------|---------------|
| **Supabase** free | 0 € | MVP, hasta ~5–10 locales activos |
| **Supabase Pro** | ~25 €/mes | 10–50 locales, backups automáticos |
| **Render PostgreSQL** | 7–20 €/mes | Alternativa simple |
| **Railway** | ~5–15 €/mes uso | Flexible al inicio |

Incluye normalmente: almacenamiento, backups básicos, conexiones SSL.

**Coste mensual MVP:** **0 €** (free tier)  
**Coste mensual crecimiento:** **~20–30 €/mes**

---

### C. Servidor / backend (API + tiempo real)

| Opción | Coste | Notas |
|--------|-------|-------|
| **Render** free / starter | 0–7 €/mes | Se duerme sin tráfico (mal para sábado noche) |
| **Render** standard | ~25 €/mes | Siempre activo, recomendado con clientes reales |
| **Railway** | ~5–20 €/mes | Pago por uso |
| **VPS** (Hetzner, DigitalOcean) | 5–12 €/mes | Más control, más trabajo tuyo |

**Coste mensual MVP serio:** **~7–25 €/mes**

---

### D. Frontend (web cliente + paneles)

| Opción | Coste |
|--------|-------|
| **Vercel** / **Netlify** free | 0 € |
| Plan Pro (si creces) | ~20 €/mes |

**Coste mensual inicio:** **0 €**

---

### E. Seguridad (HTTPS, certificados, protección)

| Concepto | Coste | Notas |
|----------|-------|-------|
| **HTTPS / SSL** | **0 €** | Let's Encrypt incluido en Vercel, Netlify, Render |
| **Firewall / DDoS básico** | 0 € | Incluido en hosting cloud |
| **Auth seguro** (bcrypt, JWT) | 0 € | Código tuyo, sin coste extra |
| **Backups BD** | 0–5 €/mes | Incluido en planes de pago BD |
| **WAF avanzado** (Cloudflare) | 0 € free | Opcional al inicio |
| **Auditoría seguridad externa** | 500–3000 € | Solo si creces mucho; no MVP |

**Coste mensual seguridad básica:** **0 €** (incluido en stack moderno)

> La seguridad en MVP = HTTPS + contraseñas hasheadas + validación datos + backups BD. No necesitas pagar un servicio de seguridad aparte al inicio.

---

### F. Otros costes fijos habituales

| Concepto | Coste | Frecuencia |
|----------|-------|------------|
| Email profesional (Google Workspace) | 6–12 €/usuario | /mes |
| GitHub (repositorio) | 0 € | free |
| Monitorización (UptimeRobot) | 0 € | free |
| Facturación clientes (Stripe) | 1,4 % + 0,25 € por cobro | por transacción |
| Contabilidad / autónomo | 50–150 € | /mes (variable) |
| Seguros / legal | 0 al inicio | — |

---

## 2. Escenarios de coste total mensual

### Escenario A — MVP / primeros 5 clientes (mínimo)

| Concepto | €/mes |
|----------|-------|
| Dominio | 1,50 |
| Base de datos (free) | 0 |
| Backend (Render starter) | 7 |
| Frontend (Vercel free) | 0 |
| SSL / seguridad básica | 0 |
| Email (opcional) | 0 |
| **TOTAL infraestructura** | **~8–10 €/mes** |

### Escenario B — 5–30 clientes (recomendado producción)

| Concepto | €/mes |
|----------|-------|
| Dominio | 1,50 |
| PostgreSQL (Supabase Pro o similar) | 25 |
| Backend siempre activo | 25 |
| Frontend | 0 |
| Backups + monitorización | 5 |
| Email profesional | 7 |
| **TOTAL infraestructura** | **~63–65 €/mes** |

### Escenario C — 30–100 clientes

| Concepto | €/mes |
|----------|-------|
| Dominio | 1,50 |
| Base de datos escalada | 50–80 |
| Backend (2 instancias o más RAM) | 50–80 |
| Frontend CDN | 20 |
| Soporte herramientas | 15 |
| **TOTAL infraestructura** | **~140–200 €/mes** |

---

## 3. Coste por cliente (unit economics)

La infraestructura es **compartida**: no pagas un servidor por cada bar.

### Coste variable real por local/mes

| Concepto | Coste/cliente |
|----------|---------------|
| Almacenamiento BD (pedidos, carta) | ~0,10 € |
| Ancho de banda (QR, carta, pedidos) | ~0,20–0,50 € |
| Tiempo real (WebSockets) | ~0,20 € |
| Soporte (si dedicas 30 min/mes) | 5–15 €* |
| Stripe (cobrar suscripción 29 €) | ~0,66 € |

\* El soporte es tu tiempo, no un coste de infraestructura.

**Coste infraestructura pura por cliente:** **~0,50–1,50 €/mes**  
**Coste con fee Stripe:** **~1,20–2,20 €/mes** por cobro de suscripción

---

## 4. Cuánto ganas con cada cliente

### Plan Básico — 29 €/mes

| Concepto | Importe |
|----------|---------|
| Cliente paga | 29,00 € |
| IVA (21 %) — lo ingresas y declaras | incluido en factura al cliente |
| Comisión Stripe (~1,4 % + 0,25 €) | −0,66 € |
| Coste infra proporcional | −1,00 € |
| **Margen bruto aprox.** | **~27,34 €/mes** |
| **Margen anual por cliente** | **~328 €/año** |

### Plan Pro — 49 €/mes ⭐

| Concepto | Importe |
|----------|---------|
| Cliente paga | 49,00 € |
| Stripe | −0,94 € |
| Coste infra proporcional | −1,50 € |
| **Margen bruto aprox.** | **~46,56 €/mes** |
| **Margen anual por cliente** | **~559 €/año** |

### Plan Premium — 79 €/mes

| Concepto | Importe |
|----------|---------|
| Cliente paga | 79,00 € |
| Stripe | −1,36 € |
| Coste infra proporcional | −2,00 € |
| Chatbot IA (cuando exista) | −3–8 € |
| **Margen bruto aprox.** | **~68–75 €/mes** |
| **Margen anual por cliente** | **~820–900 €/año** |

---

## 5. Beneficio real según número de clientes

*Escenario B: costes fijos ~65 €/mes*

| Clientes | Mix típico | Ingresos/mes | Costes/mes | **Beneficio bruto/mes** |
|----------|------------|--------------|------------|-------------------------|
| 1 | 1× Básico | 29 € | 65 € | **−36 €** (pierdes al inicio) |
| 3 | 2 Básico + 1 Pro | 107 € | 68 € | **~39 €** |
| 5 | 3 Básico + 2 Pro | 185 € | 70 € | **~115 €** |
| 10 | 5 Básico + 4 Pro + 1 Premium | 456 € | 75 € | **~381 €** |
| 20 | mix | ~880 € | 85 € | **~795 €** |
| 50 | mix | ~2.200 € | 120 € | **~2.080 €** |
| 100 | mix | ~4.500 € | 180 € | **~4.320 €** |

**Punto de equilibrio (cubrir solo infra):** con costes de ~65 €/mes necesitas **2 clientes Pro** o **3 clientes Básico**.

---

## 6. Lo que NO está en el margen (tú debes valorarlo)

| Concepto | Coste estimado |
|----------|----------------|
| **Tu tiempo** desarrollo | Inversión inicial (no mensual) |
| **Tu tiempo** soporte a bares | 2–5 h/mes por cliente activo al inicio |
| **Autónomo / SL** | 50–300 €/mes según facturación |
| **Marketing** (folletos, desplazamientos) | Variable |
| **Impresión QR para clientes** | 0 € (lo paga el bar) o ~20 € si lo incluyes |
| **Impuestos** sobre beneficio | IRPF o IS según forma jurídica |

### Ejemplo realista: 10 clientes, ~380 € beneficio bruto

```
Beneficio bruto infra          381 €
− Autónomo mínimo              −80 €
− Gasolina / visitas locales   −40 €
− Imprevistos                  −30 €
─────────────────────────────────────
Beneficio neto aproximado      ~230 €/mes
```

Todavía modesto, pero **validado como negocio**. Con 30+ clientes empieza a ser un ingreso serio.

---

## 7. Inversión inicial (una sola vez)

| Concepto | Coste |
|----------|-------|
| Dominio año 1 | 15 € |
| Desarrollo (tu tiempo) | 0 € monetizado si lo haces tú |
| Logo / diseño (opcional) | 0–100 € |
| Pruebas en local piloto | 0 € |
| Alta autónomo (si no lo eres) | Variable |
| **TOTAL mínimo en euros** | **~15–115 €** |

No necesitas comprar servidores caros ni licencias de software para empezar.

---

## 8. Comparativa: ¿merece la pena por cliente?

| Plan | Ganas/mes (bruto) | Horas soporte/mes | €/hora si dedicas 3 h |
|------|-------------------|-------------------|------------------------|
| Básico 29 € | ~27 € | 2–3 h | ~9–13 €/h |
| Pro 49 € | ~47 € | 3–4 h | ~12–16 €/h |
| Premium 79 € | ~70 € | 4–5 h | ~14–18 €/h |

Al inicio el soporte come margen. Cuando el producto es estable, el soporte baja y **el margen por hora sube mucho**.

---

## 9. Recomendaciones para maximizar beneficio

1. **Empieza en free tiers** — no pagues Supabase Pro hasta tener 8–10 clientes.
2. **Cobra anual** — 2 meses gratis pero cobras 10 meses adelantados (mejor flujo de caja).
3. **Onboarding de pago único** — 99 € configuración = cubre 3 meses de servidores.
4. **Precio fundador 39 €** en lugar de 49 € sigue dejando ~37 € de margen.
5. **No incluyas chatbot en MVP** — la IA es el mayor coste variable futuro.
6. **Stripe Billing** — automatiza cobros; menos morosos.
7. **Un solo servidor bien configurado** aguanta 50+ locales si la arquitectura es eficiente.

---

## 10. Resumen en tabla (para que lo tengas claro)

| Pregunta | Respuesta |
|----------|-----------|
| ¿Cuánto me cuesta al mes al principio? | **~10–65 €** según fase |
| ¿Cuánto me cuesta cada cliente en infra? | **~1–2 €/mes** |
| ¿Cuánto gano con un cliente Básico (29 €)? | **~27 €/mes** |
| ¿Cuánto gano con un cliente Pro (49 €)? | **~47 €/mes** |
| ¿Cuánto gano con un cliente Premium (79 €)? | **~70 €/mes** |
| ¿Cuántos clientes para no perder dinero? | **2–3** |
| ¿Cuántos para ~500 €/mes limpios? | **~12–15** |
| ¿Cuántos para ~2.000 €/mes bruto? | **~45–50** |
| ¿Dominio + BD + seguridad son caros? | **No al inicio** — ~15 € dominio + 0–25 € BD + SSL gratis |

---

## 11. Conclusión

**QResto es barato de mantener** si usas cloud moderno (Vercel + Render + Supabase). El dominio y la seguridad básica (HTTPS) casi no cuestan. La base de datos es el primer salto de coste real (~25 €/mes) cuando superas el free tier.

**Cada cliente te deja ~27–47 €/mes** en planes Básico y Pro, que es un **margen del 85–95 %** sobre infraestructura — típico de SaaS bien hecho.

El límite no es el coste del servidor: es **conseguir y retener clientes** y no pasar demasiadas horas en soporte por bar.
