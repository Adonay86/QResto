# QResto — Roles de usuario

Documento de planificación · Versión 1.0 · 22 de junio de 2026

---

## Resumen

QResto tiene **6 roles** en total. En el **MVP** solo necesitas activar **4**; los otros 2 quedan preparados para cuando escales.

| Rol | ¿Login? | MVP | Descripción breve |
|-----|---------|-----|-------------------|
| Cliente | No | ✅ | Comensal que escanea el QR de la mesa |
| Camarero | Sí | ✅ | Atiende mesas, pedidos y llamadas |
| Encargado | Sí | ✅ | Supervisa sala, mesas y cierre de turno |
| Admin local | Sí | ✅ | Dueño o gestor del local; configura todo |
| Admin cadena | Sí | 🔜 Fase 4 | Gestiona varios locales desde un panel central |
| Soporte QResto | Sí | 🔜 Interno | Equipo QResto; no lo ve el cliente del bar |

---

## 1. Cliente (comensal)

**Quién es:** Persona sentada en una mesa (o en la barra, si tiene QR) que escanea el código con su móvil.

**Acceso:** Sin registro ni contraseña. Entra por URL/QR único de la mesa.

### Puede hacer
- Ver la carta (entrantes, comidas, bebidas)
- Cambiar idioma de la carta (fase turismo)
- Ver alérgenos e información del plato
- Añadir productos al carrito
- Revisar y confirmar su pedido
- Ver el estado de su pedido (pendiente, en cocina, servido)
- Llamar al camarero (botón dedicado)
- Pedir la cuenta (fase 2; al inicio puede ser “llamar camarero”)

### No puede hacer
- Ver otras mesas ni pedidos ajenos
- Cambiar precios ni la carta
- Acceder al panel de empresa o admin
- Pagar desde el móvil (hasta fase pagos)

### Notas de diseño
- Una sesión = una mesa. Si se levantan y viene otro grupo, el encargado/camarero **libera la mesa** y empieza sesión nueva.
- El QR debe identificar: `local` + `mesa` (y opcionalmente `zona`).

---

## 2. Camarero

**Quién es:** Personal de sala que lleva comida, cobra y atiende llamadas.

**Acceso:** Login con usuario y contraseña. App/panel optimizado para **móvil o tablet**.

### Puede hacer
- Ver mapa o lista de mesas de su zona asignada
- Ver pedidos nuevos y actualizados en tiempo real
- Ver llamadas de camarero (mesa X necesita atención)
- Marcar llamada como atendida
- Ver detalle del pedido de una mesa
- Marcar productos como servidos
- Marcar mesa como “cuenta pedida”
- Marcar pagos parciales o totales (efectivo/tarjeta en caja)
- Abrir mesa / indicar que está ocupada
- Añadir notas al pedido (ej. “sin hielo”)

### No puede hacer
- Editar la carta ni precios
- Ver contabilidad global del negocio
- Borrar historial de ventas
- Gestionar otros usuarios
- Cambiar configuración del local

### Notas de diseño
- Interfaz **rápida y con pocos clics**; lo usará con el local lleno.
- Notificaciones visuales y sonido cuando llaman o llega pedido nuevo.
- Puede estar limitado a una **zona** (terraza, salón) en locales grandes.

---

## 3. Encargado

**Quién es:** Responsable de turno: jefe de sala, encargado del bar o persona de confianza del dueño.

**Acceso:** Login propio. Panel en tablet o PC; más completo que el del camarero.

### Puede hacer
**Todo lo del camarero, más:**
- Ver **todas** las mesas del local (no solo una zona)
- Liberar o cerrar mesas
- Mover pedido entre mesas (si el cliente cambia de sitio)
- Anular líneas de pedido o pedido completo (con motivo)
- Aplicar descuentos simples (ej. % o cortesía) — configurable por admin
- Ver resumen del turno (ventas, mesas atendidas, ticket medio)
- Gestionar incidencias (producto agotado, queja)
- Reasignar llamadas de camarero entre personal
- Ver qué camareros están activos en el turno

### No puede hacer
- Cambiar la carta, precios base ni alérgenos
- Crear o eliminar usuarios
- Ver informes financieros completos (beneficios, gastos fijos)
- Configurar impuestos, horarios del local o datos fiscales
- Acceder a otros locales (salvo que también sea admin)

### Notas de diseño
- Es el rol **puente** entre sala y dueño.
- En un bar pequeño, **dueño = encargado** (mismo usuario con ambos permisos o un solo rol “Admin local”).

---

## 4. Admin local

**Quién es:** Dueño del bar, gerente o persona que configura y mira la economía del local.

**Acceso:** Login con máximos permisos **dentro de su local**.

### Puede hacer
**Todo lo del encargado, más:**
- Gestionar la **carta**: categorías, platos, bebidas, precios, fotos, alérgenos
- Activar/desactivar productos (ej. “agotado hoy”)
- Configurar **mesas**: número, nombre, zona, generar/regenerar QR
- Gestionar **usuarios**: crear camareros y encargados, resetear contraseñas
- Definir **zonas** del local (barra, terraza, salón)
- Ver **contabilidad básica**:
  - Ingresos por día/semana/mes
  - Ventas por producto o categoría
  - Coste estimado de personal (si se registran turnos)
  - Gastos manuales (proveedores, luz, etc.) — fase 3
- Exportar informes (PDF/Excel) — fase 3
- Configurar horarios, idiomas disponibles, datos del local
- Ver historial de pedidos y pagos
- Configurar métodos de pago aceptados (caja; móvil cuando exista)

### No puede hacer
- Ver datos de otros locales (salvo admin cadena)
- Acceder a facturación de la suscripción QResto (eso es cuenta de billing aparte)
- Modificar la plataforma QResto a nivel técnico

### Notas de diseño
- En el **MVP para bar pequeño**, este rol es el más importante tras el cliente.
- Panel en **PC** para configurar; puede usar el mismo panel en móvil para consultas rápidas.

---

## 5. Admin cadena (fase 4 — multi-local)

**Quién es:** Dueño de varios locales o director de operaciones de un grupo.

**Acceso:** Login con vista de **todos los locales** de su organización.

### Puede hacer
- Ver dashboard global: ventas de todos los locales
- Comparar rendimiento entre locales
- Gestionar carta **maestra** y sincronizarla a varios locales (con precios locales opcionales)
- Crear y gestionar locales nuevos
- Asignar admin local a cada establecimiento
- Ver contabilidad consolidada del grupo
- Definir políticas comunes (descuentos máximos, idiomas, branding)

### No puede hacer
- Acceder a locales que no pertenezcan a su organización
- Soporte técnico de la plataforma (rol Soporte QResto)

### Notas de diseño
- No hace falta en el MVP. La base de datos debe contemplar `organizacion_id` y `local_id` desde el diseño.

---

## 6. Soporte QResto (interno)

**Quién es:** Tu equipo o tú, para dar soporte a clientes que pagan QResto.

**Acceso:** Panel interno de la plataforma (no visible para bares).

### Puede hacer
- Ver listado de clientes (locales registrados)
- Activar/suspender cuentas
- Ayudar a resetear accesos
- Ver logs de errores
- Gestionar planes y facturación QResto

### No puede hacer
- Ver datos sensibles de pagos de comensales sin necesidad
- Modificar pedidos de un local en nombre del negocio (salvo soporte excepcional y auditado)

---

## Matriz de permisos (resumen)

| Acción | Cliente | Camarero | Encargado | Admin local | Admin cadena |
|--------|:-------:|:--------:|:---------:|:-----------:|:------------:|
| Ver carta | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hacer pedido | ✅ | — | — | — | — |
| Llamar camarero | ✅ | — | — | — | — |
| Ver mesas asignadas | — | ✅ | ✅ | ✅ | ✅ |
| Ver todas las mesas | — | — | ✅ | ✅ | ✅ |
| Atender llamadas | — | ✅ | ✅ | ✅ | — |
| Marcar servido / pagado | — | ✅ | ✅ | ✅ | — |
| Anular pedido | — | — | ✅ | ✅ | — |
| Descuentos | — | — | ✅* | ✅ | ✅ |
| Editar carta | — | — | — | ✅ | ✅** |
| Gestionar mesas/QR | — | — | — | ✅ | ✅ |
| Gestionar usuarios | — | — | — | ✅ | ✅ |
| Contabilidad local | — | — | 🔶 turno | ✅ | — |
| Contabilidad global | — | — | — | — | ✅ |
| Multi-local | — | — | — | — | ✅ |

\* Según límites que defina el admin local  
\** Carta maestra para varios locales

🔶 = resumen parcial del turno, no contabilidad completa

---

## Casos reales por tamaño de local

### Bar pequeño (5–10 mesas)
| Persona | Rol recomendado |
|---------|-----------------|
| Dueño | Admin local |
| 1–2 camareros | Camarero (el dueño puede tener también este rol) |
| Encargado | Opcional; a menudo el dueño hace de encargado |

**MVP mínimo:** Cliente + Camarero + Admin local (3 roles activos).

### Restaurante mediano (20–40 mesas)
| Persona | Rol |
|---------|-----|
| Dueño / gerente | Admin local |
| Jefe de sala | Encargado |
| 3–6 camareros | Camarero (por zona) |
| Clientes | Cliente |

### Grupo con varios locales
| Persona | Rol |
|---------|-----|
| Dueño del grupo | Admin cadena |
| Gerente de cada local | Admin local |
| Sala de cada local | Encargado + camareros |

---

## Flujo entre roles (ejemplo)

```
1. Cliente escanea QR mesa 5
2. Cliente pide 2 cervezas + papas arrugadas → confirma
3. Camarero ve pedido nuevo en panel → cocina/barra lo prepara
4. Camarero marca "servido"
5. Cliente pulsa "Llamar camarero" → camarero atiende
6. Encargado ve que mesa 5 pide cuenta → camarero cobra en caja
7. Camarero marca mesa 5 como "pagada"
8. Encargado libera mesa 5
9. Admin local al cierre ve ventas del día en contabilidad
```

---

## Decisiones para cerrar en el MVP

| Pregunta | Recomendación |
|----------|---------------|
| ¿Encargado como rol separado en v1? | **Opcional.** En MVP puedes fusionar Encargado + Admin local si el bar es pequeño; en código conviene tener permisos separados aunque un usuario tenga ambos. |
| ¿Cliente necesita identificarse? | **No** en v1. Solo mesa + sesión. |
| ¿Un camarero varias zonas? | Sí, configurable por admin. |
| ¿Varios admins por local? | Sí (ej. dueño + pareja). |
| ¿Admin cadena en MVP? | **No**; solo diseñar `organizacion_id` en datos. |

---

## Próximo paso

Con los roles cerrados, el siguiente documento lógico es el **MVP v1**: lista exacta de pantallas y funciones por rol.
