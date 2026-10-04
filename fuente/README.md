# Código fuente de MIA

- `partes/*.js`: el código de la app, dividido por tema y en orden (se juntan tal cual, en orden alfabético):
  - `00` base e íconos · `01` constantes y datos iniciales · `02` números, fechas y órdenes de compra ·
    `03` guardado del estado · `04` textos, semanas, regalías y descargas · `05` componentes básicos ·
    `06` presentaciones · `07` pantalla del PIN
  - `10a`–`10d` la app principal (función App), en cuatro archivos seguidos: `10a` estado, `10b` carga de datos y guardado,
    `10c` acciones (obras, sub obras, órdenes de compra, proveedores, pagos), `10d` lo que se dibuja en pantalla
  - `11` filas de obra y PDF de OC · `12` formularios de obra · `13` roles e historial · `14` proveedores ·
    `15` pagos y Xubio · `16` cashflow · `17` facturación · `18` EERR · `19` operaciones
- `head.html` / `tail.html`: el principio y el final de la página (librerías, estilos, ambiente QA).
- `construir.sh`: arma las páginas.
  - `bash fuente/construir.sh` → `MIAQA.html`
  - `bash fuente/construir.sh prd` → también `MIA.prd.html` (solo con OK del usuario, ver `checklist_mz_latam.md`)
  - `bash fuente/construir.sh revisar` → controla que `MIAQA.html` coincida con el código fuente
- `pruebas/`: pruebas automáticas de los cálculos (`node fuente/pruebas/pruebas.js`).
  - Casos reales verificados (retención EUROLAMP, markup, negativos, OC MZ, guardado).
  - "Foto" del resultado actual de 40 funciones con datos de ejemplo: si un cambio altera un resultado, la prueba lo marca. Si el cambio es a propósito: `node fuente/pruebas/pruebas.js --foto`.
  - Prueba de pantalla (`node fuente/pruebas/pantalla.js`): abre la app en un navegador con una base simulada
    (`base_simulada.js`, no toca datos reales) y recorre todas las pestañas buscando errores. Necesita internet.
- `herramientas/`:
  - `renombrar.js`: cambia nombres de variables de forma segura (entiende el alcance de cada una, no es buscar y reemplazar).
  - `comparar_equivalente.js`: controla que dos versiones del código sean el mismo programa salvo los nombres cambiados.
  - `renombres_hechos_*.json`: lista de nombres que se cambiaron (viejo → nuevo).
- GitHub corre las pruebas, el control y la prueba de pantalla en cada cambio (`.github/workflows/controles.yml`, "Controles").

`index.jsx` (en la raíz) es una versión vieja que ya no se usa.
