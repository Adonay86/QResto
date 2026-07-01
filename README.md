# QResto

**Carta digital con pedido desde la mesa** para bares y restaurantes.  
Proyecto full-stack desarrollado en Las Palmas de Gran Canaria.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)]()
[![MySQL](https://img.shields.io/badge/MySQL-opcional-4479A1?logo=mysql&logoColor=white)]()

## Qué hace

| Rol | Función |
|-----|---------|
| **Cliente** | Escanea QR de mesa → ve carta → pide → llama al camarero |
| **Camarero** | Panel en tiempo real: mesas, pedidos, cobros y avisos |
| **Admin** | Edita carta, configura el local y ve ventas del día por producto |

## Demo local

```bash
cd server
npm install
npm start
```

| Pantalla | URL |
|----------|-----|
| Carta (mesa 3) | http://localhost:3000/?mesa=3 |
| Panel camarero | http://localhost:3000/camarero.html |
| Panel admin | http://localhost:3000/admin.html |

Clave admin demo: `qresto2026`

## Stack técnico

- **Frontend:** HTML, CSS, Tailwind CSS, JavaScript (ES modules)
- **Backend:** Node.js, Express, REST API
- **Tiempo real:** Socket.io
- **Datos:** MySQL (opcional) o JSON en `server/data/`

## Instalación completa

```bash
# Servidor
cd server
npm install

# Estilos Tailwind
cd ../client
npm install
npm run build:css

# Arrancar
cd ../server
npm start
```

### MySQL (opcional)

```bash
cd server
copy .env.example .env   # Windows — edita la contraseña
npm run db:init
npm start
```

## Estructura

```
QResto/
├── client/          # Frontend (carta, camarero, admin)
├── server/          # API, Socket.io, persistencia
└── docs/            # Planificación de producto y negocio
```

## Autor

**Carlos Adonay Gómez González** — Desarrollador web · Las Palmas de Gran Canaria  
Contacto: Adonaygomez27@gmail.com

## Licencia

Proyecto de portfolio / producto en desarrollo. Uso educativo y demostrativo.
