# QResto — Guía de pruebas (Paso 1)

## Qué puedes probar ahora

- ✅ Ver la carta por categorías (entrantes, comidas, bebidas)
- ✅ Ver precios, descripciones y alérgenos
- ✅ **Fotos en cada plato** (más apetecible)
- ✅ Diseño profesional: hero, tipografía, tarjetas con imagen
- ✅ Producto agotado (paella) no se puede añadir
- ✅ Añadir al carrito y cambiar cantidades
- ✅ Confirmar pedido (simulado)
- ✅ Llamar al camarero (mensaje de prueba)
- ✅ Simular mesa con `?mesa=3` en la URL

## Cómo arrancar

```powershell
cd C:\Users\adona\Projects\QResto\server
npm start
```

Abre: **http://localhost:3000/?mesa=3**

## Probar en el móvil

1. El PC y el móvil en la misma WiFi
2. En PowerShell: `ipconfig` → busca tu IPv4 (ej. 192.168.1.25)
3. En el móvil: `http://TU-IP:3000/?mesa=3`

## Qué viene en el Paso 2

- Panel del camarero
- Pedidos y llamadas en tiempo real
- El pedido llegará de verdad al panel (no solo simulado)

## Cosas a valorar cuando pruebes

- ¿Se lee bien en el móvil?
- ¿Los colores y tamaños te gustan?
- ¿Falta foto en los platos?
- ¿El botón "Llamar camarero" está bien ubicado?
- ¿Algo confuso para un turista o un cliente mayor?

Anota lo que quieras cambiar y lo ajustamos en la siguiente iteración.
