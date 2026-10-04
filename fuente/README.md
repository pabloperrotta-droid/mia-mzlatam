# Código fuente de MIA

- `app.js`: código legible de toda la app (React). Es la fuente real: `MIAQA.html` y `MIA.prd.html` se arman a partir de acá.
- `head.html` / `tail.html`: el principio y el final de la página (librerías, estilos, ambiente QA).
- `construir.sh`: arma las páginas. `bash fuente/construir.sh` arma QA; `bash fuente/construir.sh prd` arma también Producción (solo con OK del usuario, ver `checklist_mz_latam.md`).

`index.jsx` (en la raíz) es una versión vieja que ya no se usa.
