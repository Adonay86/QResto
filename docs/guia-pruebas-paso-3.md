# QResto — Guía de pruebas (Paso 3)

## Panel admin

**URL:** http://localhost:3000/admin.html  
**Contraseña demo:** `qresto2026`

## Qué puedes hacer

### Resumen
- Ventas del día
- Número de pedidos
- Mesas activas
- Total de productos

### Carta
- Ver todos los productos con foto
- **Crear** producto nuevo
- **Editar** nombre, precio, descripción, imagen, alérgenos
- Marcar **agotado** / disponible
- **Borrar** producto
- Filtrar por categoría

### Local
- Cambiar nombre del bar
- Cambiar subtítulo (aparece en la carta del cliente)

## Prueba rápida

1. Entra en admin con `qresto2026`
2. Ve a **Carta** → edita el precio de las papas arrugadas
3. Abre la carta cliente en otra pestaña → recarga → verás el precio nuevo
4. Ve a **Local** → cambia el nombre del bar → recarga la carta cliente

Los cambios se guardan en `server/data/` y persisten al reiniciar el servidor.
