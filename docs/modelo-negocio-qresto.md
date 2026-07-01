# QResto — Modelo de negocio

Documento de planificación · Versión 1.0 · 22 de junio de 2026

---

## Resumen ejecutivo

**QResto** se vende como **software en la nube (SaaS)** con **cuota mensual fija por local**, sin comisiones por pedido en la fase inicial. El objetivo es ser más accesible que un TPV completo (~80–150 €/mes) y más útil que una carta digital básica (~15–30 €/mes).

| Concepto | Decisión |
|----------|----------|
| Modelo de ingresos | Suscripción mensual (SaaS) |
| Unidad de venta | Por local / establecimiento |
| Comisión por pedido | **No** en fase 1–3 (diferenciador frente a Last.app) |
| Pago móvil | Fase posterior; comisión opcional entonces |
| Mercado inicial | Canarias → bares y restaurantes pequeños |
| Prueba gratuita | 14 días sin tarjeta o 30 días primeros clientes piloto |

---

## 1. Propuesta de valor (qué vendes)

No vendes "una app con QR". Vendes **resultados**:

| Para el dueño | Mensaje |
|---------------|---------|
| Menos presión al personal | El cliente pide solo; el camarero solo sirve y cobra |
| Menos errores | El pedido llega tal cual al panel |
| Control en tiempo real | Mesas, pedidos, pagos y llamadas en una pantalla |
| Saber cómo va el negocio | Contabilidad básica sin Excel |
| Turismo | Carta en varios idiomas + asistente (planes superiores) |
| Precio predecible | Cuota fija; sin sorpresas por pedido |

---

## 2. Segmentos de cliente

### Segmento principal (año 1–2)
**Bar o restaurante pequeño en Canarias**
- 5–20 mesas
- 1–4 empleados en sala
- Sin TPV moderno o con uno antiguo
- Turismo moderado o alto
- Dueño presente en el día a día

### Segmento secundario (año 2–3)
**Restaurante mediano**
- 20–50 mesas
- Varios camareros, encargado de sala
- Necesita zonas (terraza, salón)

### Segmento futuro (fase 4)
**Grupo o cadena**
- 2–10+ locales
- Admin central, carta maestra, informes consolidados

---

## 3. Planes y precios

### Estructura de 3 planes

| | **Básico** | **Pro** ⭐ | **Premium** |
|---|:---:|:---:|:---:|
| **Precio** | **29 €/mes** | **49 €/mes** | **79 €/mes** |
| **Pago anual** | 290 €/año (2 meses gratis) | 490 €/año | 790 €/año |
| **Mesas incluidas** | Hasta 10 | Hasta 25 | Ilimitadas |
| **Usuarios (camareros/admin)** | 2 | 5 | Ilimitados |
| **Carta QR + pedidos** | ✅ | ✅ | ✅ |
| **Llamar camarero** | ✅ | ✅ | ✅ |
| **Panel mesas en vivo** | ✅ | ✅ | ✅ |
| **Marcar pagado (caja)** | ✅ | ✅ | ✅ |
| **Contabilidad básica** | Resumen diario | Completa | Completa + exportar |
| **Multiidioma carta** | ES + EN | ES + EN + DE | + FR, IT (5 idiomas) |
| **Chatbot turista** | — | Básico | Avanzado |
| **Zonas (terraza/salón)** | — | ✅ | ✅ |
| **Informes PDF/Excel** | — | ✅ | ✅ |
| **Multi-local** | — | — | Hasta 3 locales |
| **Soporte** | Email | Email + chat | Prioritario + teléfono |
| **Pago desde móvil** | — | — | 🔜 Cuando exista |

⭐ **Pro** = plan recomendado para la mayoría de bares turísticos en Canarias.

### ¿Por qué estos precios?

| Referencia mercado | Precio | QResto |
|--------------------|--------|--------|
| Solo carta digital (Qrusty, AppCarta) | 15–30 €/mes | Básico 29 € con pedidos y mesas |
| TPV completo (Last.app, SmartBar) | 59–150 €/mes | Pro 49 € sin TPV ni comisiones |
| Comisión QR (Last.app) | ~1,5 % por pedido | **0 %** en fase inicial |

**Posicionamiento:** *"Más que una carta, menos que un TPV."*

---

## 4. Modelo de ingresos

### Fase 1–3: solo suscripción

```
Ingreso mensual = Nº locales × cuota del plan
```

**Ejemplo año 1 (conservador):**
- 10 locales × 40 € medio = **400 €/mes** → 4.800 €/año
- 30 locales × 45 € medio = **1.350 €/mes** → 16.200 €/año

### Fase 4+: ingresos adicionales (opcionales)

| Fuente extra | Cuándo | Modelo |
|--------------|--------|--------|
| Pago móvil integrado | Fase 5 | Comisión 0,8–1,2 % por transacción (opcional para el local) |
| Locales extra (cadena) | Fase 4 | +25 €/mes por local adicional |
| Onboarding presencial | Siempre | 99–199 € pago único (configurar carta + QR + formación) |
| Personalización / branding | Premium | +20 €/mes (logo, colores, dominio propio) |
| SMS / notificaciones | Futuro | Paquetes de mensajes |

### Lo que NO hacemos al inicio
- ❌ Comisión por pedido (aleja a dueños que ya sufren márgenes bajos)
- ❌ Permanencia de 12 meses
- ❌ Cobrar por usuario o por mesa suelta
- ❌ Hardware obligatorio

---

## 5. ¿Freemium o no?

### Recomendación: **NO freemium permanente**

| Opción | Veredicto |
|--------|-----------|
| Plan gratis forever | ❌ Atrae curiosos, no clientes; coste de soporte |
| 14 días prueba gratis | ✅ Estándar del sector; baja fricción |
| 3 meses gratis primeros 5 piloto | ✅ A cambio de feedback y testimonio |
| Plan "solo carta" gratis limitado | ⚠️ Solo si necesitas volumen; compite con Qrusty a 0 € |

**Estrategia piloto Canarias:**
- Primeros **5 bares**: 3 meses gratis → luego Pro a **39 €/mes** de por vida (precio fundador)
- A cambio: permiso para usar su nombre, foto y reseña; feedback semanal las primeras 4 semanas

---

## 6. Costes (para saber si ganas dinero)

### Costes fijos mensuales estimados (MVP / inicio)

| Concepto | Coste orientativo |
|----------|-------------------|
| Servidor (Render, Railway, VPS) | 20–50 €/mes |
| Base de datos | 0–25 €/mes |
| Dominio + email | 5–15 €/mes |
| Chatbot IA (cuando exista) | 10–50 €/mes según uso |
| Contabilidad / autónomo | Variable |
| **Total mínimo** | **~50–100 €/mes** |

### Punto de equilibrio

| Escenario | Locales necesarios (plan ~45 €) |
|-----------|--------------------------------|
| Costes 80 €/mes | **2 locales** cubren infraestructura |
| Costes 150 €/mes (con algo de marketing) | **4 locales** |
| Quieres 1.000 €/mes netos aprox. | **~25 locales** |

Con **5–10 clientes de pago** en Canarias ya es un proyecto viable como complemento. Con **30+** puede ser un negocio serio.

---

## 7. Go-to-market (cómo vender en Canarias)

### Canal principal: venta directa local

| Paso | Acción |
|------|--------|
| 1 | Lista de 30 bares en tu zona (terraza, turismo, sin QR visible) |
| 2 | Entrar con demo en el móvil: "Mira, esto es lo que vería tu cliente" |
| 3 | Oferta piloto: 3 meses gratis o precio fundador |
| 4 | Instalar: carta + QR impresos en 1 visita |
| 5 | Seguimiento a la semana: "¿Cómo fue el finde?" |

### Canales secundarios

| Canal | Prioridad |
|-------|-----------|
| Boca a boca entre dueños | Alta |
| Instagram / Google negocio local | Media |
| Ferias hostelería Canarias | Media (cuando tengas producto) |
| Distribuidores TPV (Evo7, etc.) | Baja al inicio (comisión/partnership fase 2) |
| Publicidad pagada | Baja al inicio (caro, sector local) |

### Argumentos de venta (elevator pitch)

> "Con QResto tu cliente escanea el QR, pide solo y tú ves todo en la tablet: mesas, pedidos y quién te llama. Sin comisiones por pedido. Desde 29 euros al mes. Pensado para bares en Canarias, con carta en inglés y alemán para turistas."

---

## 8. Comparativa con competencia (precio + propuesta)

| Competidor | Precio aprox. | QResto gana en… | QResto pierde en… |
|------------|---------------|-----------------|-------------------|
| Qrusty / solo carta | 15–25 € | Pedidos, mesas, operativa | Precio más bajo suyo |
| Last.app | 59 €+ + 1,5 % QR | Precio, sin comisión, simplicidad | TPV, delivery, integraciones |
| SmartBar (Canarias) | 60–150 € | Precio, enfoque turismo/chatbot | VeriFactu, KDS, marca local |
| Wingloud (Gran Canaria) | Consultar | Contabilidad, multi-rol, chatbot | Ya están en tu isla |
| Glop / Ágora | Licencia + módulos | Cuota clara, cloud, moderno | Instaladores locales, TPV físico |

**Tu ángulo:** No compites en "el TPV más completo". Compites en **"lo justo para digitalizar la sala sin liarte"**.

---

## 9. Política comercial

### Contrato y facturación
- Facturación **mensual** por adelantado (tarjeta o domiciliación)
- **Sin permanencia** — baja cuando quieran (retención por producto, no por contrato)
- Factura con IVA (21 % España)
- Datos del local: NIF, razón social para facturar la suscripción QResto

### Política de precio fundador (lanzamiento)
- Primeros 20 clientes en Canarias: **Pro a 39 €/mes de por vida** (en lugar de 49 €)
- Requisito: feedback + permiso testimonio
- Comunicar urgencia: "Plazas limitadas"

### Upsell natural (ruta de crecimiento del cliente)

```
Básico (empieza) → Pro (quiere idiomas + informes) → Premium (varios locales o chatbot)
```

---

## 10. Proyección financiera simplificada (3 años)

Cifras orientativas, escenario **moderado** en Canarias:

| Año | Locales activos | Cuota media | MRR | ARR |
|-----|-----------------|-------------|-----|-----|
| Año 1 | 12 | 38 € | 456 € | ~5.500 € |
| Año 2 | 45 | 44 € | 1.980 € | ~23.800 € |
| Año 3 | 100 | 48 € | 4.800 € | ~57.600 € |

+ onboarding puntual: ~100 € × nuevos clientes  
+ año 3: primeros ingresos por pago móvil (si se activa)

**Lectura:** Año 1 = validar y aprender. Año 2 = vivible como complemento serio. Año 3 = negocio con potencial de contratar ayuda.

---

## 11. Riesgos del modelo y mitigación

| Riesgo | Mitigación |
|--------|------------|
| "Es caro para mi bar" | Plan Básico 29 €; precio fundador; ROI: "1 servicio menos mal cobrado al día" |
| Churn (se dan de baja) | Onboarding fuerte, soporte el primer mes, revisión a los 30 días |
| Competidor baja precios | Diferenciarte por turismo, chatbot y soporte local |
| Costes IA del chatbot | Solo en plan Pro+; límite mensajes/mes |
| No quieren otro pago mensual | Comparar con 1 hora de camarero mal optimizada; trial 14 días |

---

## 12. Decisiones cerradas vs pendientes

### Cerradas en este documento
- ✅ SaaS por suscripción mensual
- ✅ 3 planes: 29 / 49 / 79 €
- ✅ Sin comisión por pedido en fase inicial
- ✅ Trial 14 días; pilotos con precio fundador
- ✅ Venta directa en Canarias primero
- ✅ Upsell Básico → Pro → Premium

### Pendientes (decidir al lanzar)
- [ ] ¿Onboarding de pago único (99 €) obligatorio u opcional?
- [ ] ¿Dominio propio (cartas.restaurante.com) en Premium o aparte?
- [ ] ¿Comisión exacta cuando exista pago móvil?
- [ ] ¿Partnership con imprenta local para QR en pack de bienvenida?

---

## 13. Resumen en una frase

**QResto gana dinero cobrando una cuota mensual clara y baja a bares canarios que quieren digitalizar pedidos y mesas sin comprar un TPV de 100 €/mes ni pagar comisión por cada cerveza.**

---

## Próximo paso

Documento pendiente: **MVP v1** — pantallas y funciones exactas por plan y por rol.
