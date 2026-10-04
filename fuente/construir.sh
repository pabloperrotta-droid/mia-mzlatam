#!/usr/bin/env bash
# Arma MIAQA.html y MIA.prd.html a partir del código fuente (fuente/partes/*.js, en orden).
#   bash fuente/construir.sh        → solo QA (MIAQA.html)
#   bash fuente/construir.sh prd    → QA y además Producción (MIA.prd.html), solo con OK del usuario
#   bash fuente/construir.sh revisar → no escribe nada: falla si MIAQA.html no coincide con el código fuente
set -euo pipefail
cd "$(dirname "$0")/.."
cat fuente/partes/*.js > fuente/.app.js
${ESBUILD:-npx --yes esbuild@0.27.7} fuente/.app.js --minify --charset=utf8 --target=es2020 --log-level=warning --outfile=fuente/.app.min.js
python3 - "${1:-}" <<'PY'
import sys
modo = sys.argv[1]
h = open("fuente/head.html", encoding="utf-8").read()
t = open("fuente/tail.html", encoding="utf-8").read()
m = open("fuente/.app.min.js", encoding="utf-8").read()
qa = h + m + "\n" + t
assert qa.count('<script>window.__APP_ENV__ = "qa";</script>') == 1
if modo == "revisar":
    actual = open("MIAQA.html", encoding="utf-8").read()
    if actual != qa:
        sys.exit("MIAQA.html NO coincide con el código fuente (fuente/partes). ¿Se editó a mano?")
    print("MIAQA.html coincide con el código fuente")
    sys.exit(0)
open("MIAQA.html", "w", encoding="utf-8").write(qa)
print("MIAQA.html listo")
if modo == "prd":
    open("MIA.prd.html", "w", encoding="utf-8").write(qa.replace('<script>window.__APP_ENV__ = "qa";</script>', '<script>window.__APP_ENV__ = "prd";</script>'))
    print("MIA.prd.html listo")
PY
rm -f fuente/.app.js fuente/.app.min.js
