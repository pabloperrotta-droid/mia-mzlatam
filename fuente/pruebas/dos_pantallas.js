// Prueba de guardado con DOS pantallas abiertas a la vez sobre una base simulada compartida (en memoria,
// no toca nada real). La base simulada se comporta como la real en lo que importa acá: confirma el guardado
// antes de mandar la versión nueva a las pantallas (con demoras al azar), y las operaciones que leen y
// escriben (transacciones) fallan si otro guardado cambió el documento en el medio.
// Casos: pantalla "dormida" que guarda con datos viejos, guardados seguidos de una misma pantalla (ecos
// atrasados), varios toques seguidos del botón "Recargar MIA en todas las pantallas".
// Uso: node fuente/pruebas/dos_pantallas.js   (en GitHub Actions corre solo, ver .github/workflows/controles.yml)
const fs = require("fs");
const os = require("os");
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT || "playwright");

const raiz = path.join(__dirname, "..");
const head = fs.readFileSync(path.join(raiz, "head.html"), "utf8").replace(/<script src="[^"]*firebase[^"]*"><\/script>\n?/g, "");
const tail = fs.readFileSync(path.join(raiz, "tail.html"), "utf8");
const app = fs
  .readdirSync(path.join(raiz, "partes"))
  .filter((f) => f.endsWith(".js"))
  .sort()
  .map((f) => fs.readFileSync(path.join(raiz, "partes", f), "utf8"))
  .join("");

// ---------- Lado de la página: imita la API de Firebase y le pasa todo a la base (en Node) ----------
const simulada = `(function () {
  const avisar = {};
  let n = 0;
  const snap = (existe, data) => ({ exists: existe, data: () => (data === undefined ? undefined : JSON.parse(JSON.stringify(data))), get: (k) => (data || {})[k] });
  window.__entregar = (id, existe, data) => { const f = avisar[id]; f && f(snap(existe, data)); };
  function FieldPath(...a) { this.partes = a; }
  const BORRAR = { __borrar__: true };
  const pares = (a) => {
    if (a.length === 1 && a[0] && typeof a[0] === "object" && !(a[0] instanceof FieldPath)) return Object.entries(a[0]).map(([k, v]) => [[k], v]);
    const out = [];
    for (let i = 0; i < a.length; i += 2) out.push([a[i] instanceof FieldPath ? a[i].partes : String(a[i]).split("."), a[i + 1]]);
    return out;
  };
  const fallar = (r) => { if (r && r.err) { const e = new Error(r.err); e.code = r.err; throw e; } return r; };
  const docRef = (p) => ({
    id: p.split("/").pop(),
    __path: p,
    onSnapshot(ok) { const id = ++n; avisar[id] = ok; window.__fs("escuchar", p, id); return () => { delete avisar[id]; }; },
    get: async () => { const r = await window.__fs("leer", p); return snap(r.existe, r.data); },
    set: async (d, opt) => fallar(await window.__fs("guardar", { escrituras: [{ op: "set", path: p, data: d, merge: !!(opt && opt.merge) }] })),
    update: async (...a) => fallar(await window.__fs("guardar", { escrituras: [{ op: "update", path: p, pares: pares(a) }] })),
    delete: async () => fallar(await window.__fs("guardar", { escrituras: [{ op: "delete", path: p }] })),
    collection: (c) => colRef(p + "/" + c),
  });
  const vacia = { docs: [], empty: true, size: 0, forEach() {} };
  const consulta = (p) => ({ orderBy: () => consulta(p), where: () => consulta(p), limit: () => consulta(p), onSnapshot(ok) { setTimeout(() => ok(vacia), 0); return () => {}; }, get: async () => vacia });
  const colRef = (p) => ({ ...consulta(p), doc: (id) => docRef(p + "/" + (id || "nuevo" + Math.random())), add: async (d) => { await window.__fs("agregar", p, d); return docRef(p + "/x"); } });
  const db = {
    doc: docRef,
    collection: colRef,
    batch: () => {
      const esc = [];
      return {
        set: (ref, d, opt) => esc.push({ op: "set", path: ref.__path, data: d, merge: !!(opt && opt.merge) }),
        update: (ref, ...a) => esc.push({ op: "update", path: ref.__path, pares: pares(a) }),
        delete: (ref) => esc.push({ op: "delete", path: ref.__path }),
        commit: async () => fallar(await window.__fs("guardar", { escrituras: esc })),
      };
    },
    runTransaction: async (fn) => {
      for (let intento = 0; intento < 5; intento++) {
        const lecturas = {}, esc = [];
        const tx = {
          get: async (ref) => { const r = await window.__fs("leer", ref.__path); lecturas[ref.__path] = r.ver; return snap(r.existe, r.data); },
          set: (ref, d, opt) => esc.push({ op: "set", path: ref.__path, data: d, merge: !!(opt && opt.merge) }),
          update: (ref, ...a) => esc.push({ op: "update", path: ref.__path, pares: pares(a) }),
          delete: (ref) => esc.push({ op: "delete", path: ref.__path }),
        };
        const res = await fn(tx);
        const r = await window.__fs("guardar", { lecturas, escrituras: esc });
        if (!r.err) return res;
        await new Promise((ok) => setTimeout(ok, 20 + Math.random() * 60));
      }
      const e = new Error("failed-precondition"); e.code = "failed-precondition"; throw e;
    },
  };
  const firestore = () => db;
  firestore.FieldPath = FieldPath;
  firestore.FieldValue = { delete: () => BORRAR };
  window.firebase = { apps: [], initializeApp() { this.apps.push({}); return {}; }, auth: () => ({ currentUser: { uid: "prueba" }, signInAnonymously: async () => ({}) }), firestore };
  try { localStorage.setItem("obras-role", "admin"); } catch {}
})();`;
const i = head.lastIndexOf("<script>window.__APP_ENV__");
const html = head.slice(0, i) + "<script>" + simulada + "</script>\n" + head.slice(i) + app + "\n" + tail;
const archivo = path.join(os.tmpdir(), "mia_prueba_dos_pantallas.html");
fs.writeFileSync(archivo, html);

// ---------- Lado de Node: la base compartida ----------
const base = new Map(); // ruta → { data, ver }
const agregados = []; // documentos agregados a colecciones (ej. erroresGuardado)
const oyentes = []; // { pagina, id, ruta, cadena, pausada }
const pausadas = new Set();
const pendientesDePausa = new Map(); // pagina → Set(oyente)
const copia = (x) => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));
const esBorrar = (v) => v && v.__borrar__ === true;
function aplicarEscritura(w) {
  const actual = base.get(w.path);
  let data = actual ? copia(actual.data) : undefined;
  if (w.op === "delete") data = undefined;
  else if (w.op === "set") data = w.merge ? { ...(data || {}), ...copia(w.data) } : copia(w.data);
  else {
    if (data === undefined) return "not-found";
    for (const [ruta, v] of w.pares) {
      let o = data;
      for (let k = 0; k < ruta.length - 1; k++) o = o[ruta[k]] && typeof o[ruta[k]] === "object" && !Array.isArray(o[ruta[k]]) ? o[ruta[k]] : (o[ruta[k]] = {});
      esBorrar(v) ? delete o[ruta[ruta.length - 1]] : (o[ruta[ruta.length - 1]] = copia(v));
    }
  }
  base.set(w.path, { data, ver: (actual ? actual.ver : 0) + 1 });
  return null;
}
const espera = (ms) => new Promise((ok) => setTimeout(ok, ms));
function entregar(o) {
  if (pausadas.has(o.pagina)) {
    (pendientesDePausa.get(o.pagina) || pendientesDePausa.set(o.pagina, new Set()).get(o.pagina)).add(o);
    return;
  }
  // En orden para cada oyente, con demora al azar (la confirmación del guardado llega antes que la versión nueva).
  o.cadena = o.cadena.then(async () => {
    await espera(5 + Math.random() * 120);
    const d = base.get(o.ruta);
    await o.pagina.evaluate(([id, e, x]) => window.__entregar(id, e, x), [o.id, !!(d && d.data !== undefined), d ? d.data : undefined]).catch(() => {});
  });
}
async function fs_(fuente, op, a, b) {
  const pagina = fuente.page;
  if (op === "escuchar") {
    const o = { pagina, id: b, ruta: a, cadena: Promise.resolve() };
    oyentes.push(o);
    entregar(o);
    return null;
  }
  if (op === "leer") {
    const d = base.get(a);
    return { existe: !!(d && d.data !== undefined), data: d ? d.data : undefined, ver: d ? d.ver : 0 };
  }
  if (op === "agregar") return agregados.push({ col: a, data: b }), null;
  if (op === "guardar") {
    for (const [ruta, ver] of Object.entries(a.lecturas || {})) if (((base.get(ruta) || {}).ver || 0) !== ver) return { err: "aborted" };
    const tocados = new Set();
    for (const w of a.escrituras) {
      const err = aplicarEscritura(w);
      if (err) return { err };
      tocados.add(w.path);
    }
    for (const o of oyentes) tocados.has(o.ruta) && !o.pagina.isClosed() && entregar(o);
    return {};
  }
  return null;
}

(async () => {
  const navegador = await chromium.launch();
  const ctx = await navegador.newContext({ viewport: { width: 1600, height: 1000 } });
  await ctx.exposeBinding("__fs", (fuente, op, a, b) => fs_(fuente, op, a, b));
  base.set("qa_app/state", { data: {}, ver: 1 });
  const errores = [];
  let fallas = 0;
  const abrir = async (nombre) => {
    const p = await ctx.newPage();
    p.on("pageerror", (e) => errores.push(nombre + ": " + e.message));
    p.on("console", (m) => m.type() === "error" && !/favicon|ERR_|net::/.test(m.text()) && errores.push(nombre + " consola: " + m.text()));
    p.on("dialog", (d) => d.accept());
    // Al recargar, los oyentes viejos de esa pantalla ya no existen.
    p.on("framenavigated", (f) => {
      if (f !== p.mainFrame()) return;
      for (let k = oyentes.length - 1; k >= 0; k--) oyentes[k].pagina === p && oyentes.splice(k, 1);
    });
    await p.goto("file://" + archivo);
    await p.waitForFunction(() => document.body.innerText.includes("VENTA TOTAL"), null, { timeout: 30000 });
    return p;
  };
  const control = async (nombre, fn) => {
    const antes = errores.length;
    try {
      await fn();
      const nuevos = errores.slice(antes);
      if (nuevos.length) throw new Error(nuevos.join(" | "));
      console.log("  ✓ " + nombre);
    } catch (e) {
      fallas++;
      console.log("  ✗ " + nombre + ": " + String(e.message).slice(0, 600));
    }
  };
  const clic = (p, texto, contiene) =>
    p.evaluate(
      ([t, c]) => {
        const el = c
          ? [...document.querySelectorAll("button")].find((e) => e.textContent.includes(t))
          : [...document.querySelectorAll("button,a,div,span")].find((e) => e.children.length < 3 && e.textContent.trim() === t);
        if (!el) throw new Error("No se encontró el botón " + t);
        el.click();
      },
      [texto, contiene],
    );
  const estado = () => {
    const s = (base.get("qa_app/state") || {}).data || {};
    const ext = base.get("qa_app/st_pagosSemanales");
    return { ...s, pagosSemanales: ext && ext.data ? ext.data.v : s.pagosSemanales };
  };
  const avisosRojos = (p) =>
    p.evaluate(() => {
      const t = document.body.innerText;
      return ["Otra pantalla cambió", "No se guardó tu cambio", "Sin conexión", "Fallas de guardado"].filter((x) => t.includes(x));
    });
  const sinAvisos = async (...ps) => {
    for (const p of ps) {
      const a = await avisosRojos(p);
      if (a.length) throw new Error("Apareció un aviso: " + a.join(", "));
    }
    const fallasGuardado = agregados.filter((x) => /erroresGuardado/.test(x.col));
    if (fallasGuardado.length) throw new Error("Se registraron fallas de guardado: " + fallasGuardado.map((x) => x.data.motivo).join(" | "));
  };
  const esperarGuardado = async (p) => {
    await espera(1500);
    await p.waitForFunction(() => !document.body.innerText.includes("Guardando"), null, { timeout: 15000 }).catch(() => {});
    await espera(1500);
  };

  const A = await abrir("Pantalla A");
  for (let k = 0; k < 50 && !(estado().obras || []).length; k++) await espera(200);
  const B = await abrir("Pantalla B");
  await clic(A, "Pagos");
  await clic(B, "Pagos");
  await esperarGuardado(A);
  const inicial = (estado().pagosSemanales || []).length;

  await control("Pantalla dormida (con datos viejos) agrega líneas mientras la otra también: quedan todas", async () => {
    pausadas.add(B); // B deja de recibir novedades (compu dormida / conexión cortada), pero sus guardados entran
    await clic(A, "Agregar línea", true);
    await clic(A, "Agregar línea", true);
    await clic(A, "Agregar línea", true);
    await esperarGuardado(A);
    await clic(B, "Agregar línea", true);
    await clic(B, "Agregar línea", true);
    await esperarGuardado(B);
    pausadas.delete(B);
    for (const o of pendientesDePausa.get(B) || []) entregar(o);
    pendientesDePausa.delete(B);
    await esperarGuardado(B);
    const total = (estado().pagosSemanales || []).length;
    if (total !== inicial + 5) throw new Error("En la base quedaron " + total + " líneas; se esperaban " + (inicial + 5));
    const ids = new Set(estado().pagosSemanales.map((x) => x.id));
    if (ids.size !== total) throw new Error("Hay líneas repetidas");
    await sinAvisos(A, B);
  });

  await control("Guardados seguidos de una misma pantalla: sin falsa alarma ni choques", async () => {
    const antes = (estado().pagosSemanales || []).length;
    for (let k = 0; k < 6; k++) {
      await clic(A, "Agregar línea", true);
      await espera(150 + Math.random() * 500);
    }
    await esperarGuardado(A);
    await esperarGuardado(B);
    const total = (estado().pagosSemanales || []).length;
    if (total !== antes + 6) throw new Error("En la base quedaron " + total + " líneas; se esperaban " + (antes + 6));
    await sinAvisos(A, B);
  });

  await control("Las dos pantallas guardan al mismo tiempo: no se pierde nada ni sale error", async () => {
    const antes = (estado().pagosSemanales || []).length;
    await Promise.all([clic(A, "Agregar línea", true), clic(B, "Agregar línea", true)]);
    await Promise.all([clic(A, "Agregar línea", true), clic(B, "Agregar línea", true)]);
    await esperarGuardado(A);
    await esperarGuardado(B);
    const total = (estado().pagosSemanales || []).length;
    if (total !== antes + 4) throw new Error("En la base quedaron " + total + " líneas; se esperaban " + (antes + 4));
    await sinAvisos(A, B);
  });

  await control("Recargar MIA en todas las pantallas (3 toques seguidos): la otra pantalla se recarga y no hay fallas", async () => {
    let recargas = 0;
    B.on("load", () => recargas++);
    await clic(A, "Herramientas", true);
    await espera(300);
    for (let k = 0; k < 3; k++) await clic(A, "Recargar MIA en todas las pantallas");
    await esperarGuardado(A);
    await espera(2000);
    if (!recargas) throw new Error("La pantalla B no se recargó");
    const reg = (estado().registros || []).filter((r) => /Pidió recargar/.test(r.descripcion));
    if (reg.length !== 3) throw new Error("Registros de recarga: " + reg.length + " (se esperaban 3)");
    await B.waitForFunction(() => document.body.innerText.includes("VENTA TOTAL"), null, { timeout: 30000 });
    await sinAvisos(A);
  });

  await navegador.close();
  console.log(fallas ? "\n" + fallas + " prueba(s) de dos pantallas fallaron" : "\nPruebas de dos pantallas OK");
  process.exit(fallas ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
