# Seguimiento de Obras MZ LATAM — Cash

Este repo tiene dos versiones de la app, publicadas como archivos HTML estaticos:

- `MIAQA.html` — version QA (de prueba).
- `MIA.prd.html` — version de Produccion.

## Como pedirle a Claude que actualice o publique una version

Una vez instalada la GitHub App de Claude y cargado el secret `ANTHROPIC_API_KEY`
(ver instrucciones que te paso aparte), comenta en un Issue o Pull Request de este
repo, por ejemplo:

- `@claude actualiza MIAQA.html con el contenido que te paso y commiteá a main`
- `@claude copia el contenido de MIAQA.html a MIA.prd.html y commiteá a main` (esto es "promover a produccion")

## GitHub Pages

Para que ambos archivos queden accesibles como link:
Settings → Pages → Source: "Deploy from a branch" → Branch: `main` → carpeta `/ (root)`.

Van a quedar en:
- `https://<tu-usuario>.github.io/<este-repo>/MIAQA.html`
- `https://<tu-usuario>.github.io/<este-repo>/MIA.prd.html`
