#!/usr/bin/env bash
# Arma MIAQA.html y MIA.prd.html a partir del código fuente legible (fuente/app.js).
#   bash fuente/construir.sh        → solo QA (MIAQA.html)
#   bash fuente/construir.sh prd    → QA y además Producción (MIA.prd.html), solo con OK del usuario
set -euo pipefail
cd "$(dirname "$0")/.."
${ESBUILD:-npx --yes esbuild@0.24.0} fuente/app.js --minify --charset=utf8 --target=es2020 --log-level=warning --outfile=fuente/.app.min.js
python3 - "$@" <<'PY'
import sys
h = open("fuente/head.html", encoding="utf-8").read()
t = open("fuente/tail.html", encoding="utf-8").read()
m = open("fuente/.app.min.js", encoding="utf-8").read()
qa = h + m + "\n" + t
assert qa.count('<script>window.__APP_ENV__ = "qa";</script>') == 1
open("MIAQA.html", "w", encoding="utf-8").write(qa)
print("MIAQA.html listo")
if len(sys.argv) > 1 and sys.argv[1] == "prd":
    open("MIA.prd.html", "w", encoding="utf-8").write(qa.replace('<script>window.__APP_ENV__ = "qa";</script>', '<script>window.__APP_ENV__ = "prd";</script>'))
    print("MIA.prd.html listo")
PY
rm -f fuente/.app.min.js
