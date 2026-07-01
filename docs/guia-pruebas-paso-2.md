# QResto — Guía de pruebas (Paso 2)

## Qué puedes probar ahora

### Carta cliente (`/?mesa=3`)
- ✅ Añadir productos al carrito y confirmar pedido
- ✅ El pedido **llega al servidor** (ya no es simulado)
- ✅ Llamar al camarero **llega al panel**
- ✅ Ver tu pedido activo arriba de la carta

### Panel camarero (`/camarero.html`)
- ✅ Ver las 10 mesas en tiempo real (verde / rojo / naranja)
- ✅ Alertas cuando un cliente llama
- ✅ Ver pedidos de cada mesa
- ✅ Marcar pedido como **servido**
- ✅ Marcar mesa como **pagada**
- ✅ **Liberar mesa** (nueva sesión)

---

## Prueba completa (2 ventanas)

1. Arranca el servidor:
   ```powershell
   cd C:\Users\adona\Projects\QResto\server
   npm start
   ```

2. **Ventana 1 — Cliente:** http://localhost:3000/?mesa=3  
   - Añade 2 cervezas y confirma pedido

3. **Ventana 2 — Camarero:** http://localhost:3000/camarero.html  
   - Verás la mesa 3 en rojo con "1 pedido"
   - Haz clic en la mesa → ver detalle → "Marcar servido"

4. **Ventana 1 — Cliente:**  
   - Pulsa "Llamar camarero"

5. **Ventana 2 — Camarero:**  
   - Aparece alerta amarilla arriba → "Atender"

---

## Qué viene en el Paso 3

- Panel **admin** para editar carta y precios sin tocar código
