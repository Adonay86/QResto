# QResto

SaaS para **bares y restaurantes**: carta digital por QR, pedidos en tiempo real y panel de administración.

**Repositorio:** https://github.com/Adonay86/QResto

---

## Vista general

| Pantalla | Quién la usa | Qué hace |
|----------|--------------|----------|
| **Carta** (`/?mesa=N`) | Cliente | Ve menú, pide, llama al camarero |
| **Camarero** | Sala | Mesas en vivo, pedidos, cobros |
| **Admin** | Dueño | Edita carta, local y ventas del día |

## Stack

- **Frontend:** HTML, CSS, JavaScript (ES modules), Tailwind CSS
- **Backend:** Node.js, Express, REST API
- **Tiempo real:** Socket.io
- **Datos:** MySQL (opcional) o JSON local

## Arranque rápido

```bash
cd server && npm install
cd ../client && npm install && npm run build:css
cd ../server && npm start
```

| URL | Descripción |
|-----|-------------|
| http://localhost:3000/?mesa=3 | Carta cliente |
| http://localhost:3000/camarero.html | Panel camarero |
| http://localhost:3000/admin.html | Panel admin |

## Variables de entorno

Copia `server/.env.example` → `server/.env`:

| Variable | Descripción | Por defecto |
|----------|-------------|-------------|
| `PORT` | Puerto del servidor | `3000` |
| `QRESTO_ADMIN_PASSWORD` | Clave panel admin | `qresto2026` |
| `MYSQL_*` | Conexión MySQL | ver `.env.example` |
| `MYSQL_DISABLED` | `1` = solo JSON | — |

> **Demo / portfolio:** cambia `QRESTO_ADMIN_PASSWORD` antes de exponer el servidor a internet.

## MySQL (opcional)

```bash
cd server
npm run db:init
npm start
```

Si MySQL no está disponible, la app usa `server/data/*.json` automáticamente.

## Estructura del proyecto

```
QResto/
├── client/           # Frontend (3 pantallas)
│   ├── js/
│   │   ├── api.js        # Cliente HTTP unificado
│   │   ├── constants.js  # Constantes compartidas
│   │   ├── dom.js        # Utilidades DOM
│   │   └── utils.js      # Formato, etiquetas de estado
│   └── css/
├── server/           # API + Socket.io
│   ├── server.js
│   ├── store.js      # Mesas y pedidos activos (memoria)
│   ├── carta.js      # Carta y local (JSON/MySQL)
│   └── ventas.js     # Historial de ventas del día
└── docs/             # Planificación de producto
```

## API principal

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/api/carta` | — |
| GET | `/api/local` | — |
| POST | `/api/pedidos` | — |
| POST | `/api/llamar` | — |
| GET | `/api/estado` | — |
| POST | `/api/admin/login` | — |
| GET | `/api/admin/carta` | Admin |
| GET | `/api/admin/ventas-hoy` | Admin |

Evento Socket.io: `estado:actualizado`

## Autor

**Carlos Adonay Gómez González** — Desarrollador web · Las Palmas de Gran Canaria  
📧 Adonaygomez27@gmail.com · [GitHub](https://github.com/Adonay86)

## Licencia

Proyecto de portfolio / producto en desarrollo.
