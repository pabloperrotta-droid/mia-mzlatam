# Servidor intermedio MIA ↔ Xubio

Función de Firebase `xubio` (región southamerica-east1). Se publica sola desde GitHub Actions
("Publicar servidor Xubio") cuando cambia algo en esta carpeta, usando los secretos del repo
`FIREBASE_SERVICE_ACCOUNT`, `XUBIO_CLIENT_ID` y `XUBIO_SECRET_ID`.

Acciones: `diagnostico` (solo lectura) y `asignarCentroCosto` (con `simular: true` no modifica nada).
Cada llamada queda registrada en Firestore (`xubioLog` / `qa_xubioLog`).


<!-- publicación tras activar plan Blaze -->
<!-- reintento 15:02 -->
