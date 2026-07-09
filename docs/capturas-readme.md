# Capturas para el README

Las imágenes están en `docs/screenshots/`:

| Archivo | Pantalla |
|---------|----------|
| `carta-cliente.png` | Carta móvil `/?mesa=3` |
| `panel-camarero.png` | Panel de sala |
| `panel-admin.png` | Admin — resumen |
| `mesas-qr.png` | Admin — pestaña Mesas QR |

## Actualizar capturas

1. Arranca el servidor: `cd server && npm start`
2. Abre cada URL en Chrome
3. **F12** → modo dispositivo (390px) para la carta cliente
4. Captura con Win+Shift+S o Ctrl+Shift+P → "Capture screenshot"
5. Guarda en `docs/screenshots/` con el mismo nombre

## Subir a GitHub

```bash
git add docs/screenshots README.md
git commit -m "docs: capturas y README con imágenes"
git push
```
