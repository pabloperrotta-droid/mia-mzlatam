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
  // Con __retener, las novedades quedan guardadas en la página y se entregan todas juntas con __soltar()
  // (sirve para que lleguen en el mismo instante en que el usuario hace un cambio).
  const retenidas = [];
  window.__entregar = (id, existe, data) => {
    if (window.__retener) return void retenidas.push([id, existe, data]);
    const f = avisar[id]; f && f(snap(existe, data));
  };
  window.__soltar = () => { window.__retener = false; retenidas.splice(0).forEach(([id, e, d]) => window.__entregar(id, e, d)); };
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
      // Para probar choques que no se resuelven (la base rechaza siempre la operación que lee y escribe).
      if (window.__txSiempreFalla) { const e = new Error("failed-precondition simulado"); e.code = "failed-precondition"; throw e; }
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
// Con MIA_AMBIENTE=prd la prueba corre la app como Producción (sin el prefijo qa_ en la base).
const PRD = process.env.MIA_AMBIENTE === "prd",
  P = PRD ? "" : "qa" + "_";
const i = head.lastIndexOf("<script>window.__APP_ENV__");
let html = head.slice(0, i) + "<script>" + simulada + "</script>\n" + head.slice(i) + app + "\n" + tail;
if (PRD) {
  if (html.split('<script>window.__APP_ENV__ = "qa";</script>').length !== 2) throw new Error("No se encontró el ambiente en la página");
  html = html.replace('<script>window.__APP_ENV__ = "qa";</script>', '<script>window.__APP_ENV__ = "prd";</script>');
}
const archivo = path.join(os.tmpdir(), "mia_prueba_dos_pantallas.html");
fs.writeFileSync(archivo, html);

// ---------- Lado de Node: la base compartida ----------
const base = new Map(); // ruta → { data, ver }
const agregados = []; // documentos agregados a colecciones (ej. erroresGuardado)
const oyentes = []; // { pagina, id, ruta, cadena, pausada }
const pausadas = new Set();
const pendientesDePausa = new Map(); // pagina → Set(oyente)
const copia = (x) => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));
// Como la base real: devuelve los campos de cada objeto ordenados por nombre (no en el orden en que se guardaron).
const ordenada = (x) =>
  x === undefined ? undefined : JSON.parse(JSON.stringify(x, (k, v) => (v && typeof v == "object" && !Array.isArray(v) ? Object.keys(v).sort().reduce((o, c) => ((o[c] = v[c]), o), {}) : v)));
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
    await o.pagina.evaluate(([id, e, x]) => window.__entregar(id, e, x), [o.id, !!(d && d.data !== undefined), d ? ordenada(d.data) : undefined]).catch(() => {});
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
    return { existe: !!(d && d.data !== undefined), data: d ? ordenada(d.data) : undefined, ver: d ? d.ver : 0 };
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
  base.set(P + "app/state", { data: {}, ver: 1 });
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
      // En GitHub Actions, la falla también queda como anotación (se ve sin abrir el registro completo).
      process.env.GITHUB_ACTIONS && console.log("::error::" + nombre + ": " + String(e.message).slice(0, 900).replace(/\n/g, " "));
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
    const s = (base.get(P + "app/state") || {}).data || {};
    const ext = base.get(P + "app/st_pagosSemanales");
    return { ...s, pagosSemanales: ext && ext.data ? ext.data.v : s.pagosSemanales };
  };
  const avisosRojos = (p) =>
    p.evaluate(() => {
      const t = document.body.innerText;
      return ["Otra pantalla cambió", "No se guardó tu cambio", "Sin conexión", "Fallas de guardado"]
        .filter((x) => t.includes(x))
        .map((x) => t.slice(t.indexOf(x), t.indexOf(x) + 300).replace(/\s+/g, " "));
    });
  let A, B;
  const sinAvisos = async (...ps) => {
    for (const p of ps) {
      const a = await avisosRojos(p);
      if (a.length) throw new Error("Apareció un aviso en " + (p === A ? "A" : "B") + ": " + a.join(" || "));
    }
    const fallasGuardado = agregados.filter((x) => /erroresGuardado/.test(x.col));
    if (fallasGuardado.length) throw new Error("Se registraron fallas de guardado: " + fallasGuardado.map((x) => x.data.motivo).join(" | "));
  };
  const esperarGuardado = async (p) => {
    await espera(1500);
    await p.waitForFunction(() => !document.body.innerText.includes("Guardando"), null, { timeout: 15000 }).catch(() => {});
    await espera(1500);
  };

  A = await abrir("Pantalla A");
  for (let k = 0; k < 50 && !(estado().obras || []).length; k++) await espera(200);
  B = await abrir("Pantalla B");
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

  const cerrarAvisos = async () => {
    for (const p of [A, B]) await p.evaluate(() => [...document.querySelectorAll("button")].filter((b) => b.textContent.trim() === "Entendido").forEach((b) => b.click()));
    agregados.length = 0;
    await espera(300);
  };
  await cerrarAvisos();
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

  await cerrarAvisos();
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

  await cerrarAvisos();
  await control("Si la base rechaza siempre el guardado con choque, el cambio se guarda igual (sin perderse)", async () => {
    const antes = (estado().pagosSemanales || []).length;
    await A.evaluate(() => (window.__txSiempreFalla = true));
    await clic(A, "Agregar línea", true);
    await espera(6000);
    await esperarGuardado(A);
    await A.evaluate(() => (window.__txSiempreFalla = false));
    const total = (estado().pagosSemanales || []).length;
    if (total !== antes + 1) throw new Error("En la base quedaron " + total + " líneas; se esperaban " + (antes + 1));
    const avisos = await avisosRojos(A);
    if (avisos.length) throw new Error("Apareció un aviso: " + avisos.join(" || "));
    const fallas = agregados.filter((x) => /erroresGuardado/.test(x.col) && !/Aviso interno/.test(x.data.motivo));
    if (fallas.length) throw new Error("Fallas: " + fallas.map((x) => x.data.motivo).join(" | "));
  });
  await cerrarAvisos();
  await control("Llegan datos de la base justo cuando el usuario hace un cambio: el cambio se guarda igual", async () => {
    for (let vuelta = 0; vuelta < 3; vuelta++) {
      const antes = (estado().pagosSemanales || []).length;
      await B.evaluate(() => (window.__retener = true));
      await clic(A, "Agregar línea", true);
      await esperarGuardado(A);
      // En el mismo instante: llega la novedad de A y B agrega una línea.
      await B.evaluate(() => {
        window.__soltar();
        [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Agregar línea")).click();
      });
      // Se mira a los 5 segundos (antes de que el control de cambios sin guardar, a los 15 s, lo arregle solo).
      await espera(5000);
      const total = (estado().pagosSemanales || []).length;
      if (total !== antes + 2) throw new Error("Vuelta " + (vuelta + 1) + ": en la base quedaron " + total + " líneas; se esperaban " + (antes + 2));
      const r = await B.evaluate(() => window.__miaPendientes());
      if (r.guardando || r.claves.length) throw new Error("B quedó con cambios sin guardar: " + JSON.stringify(r));
    }
    await sinAvisos(A, B);
  });
  await cerrarAvisos();
  await control("Recargar MIA en todas las pantallas (3 toques seguidos): la otra pantalla se recarga y no hay fallas", async () => {
    let recargas = 0;
    B.on("load", () => recargas++);
    await clic(A, "Herramientas", true);
    await espera(300);
    const botones = await A.evaluate(() => [...document.querySelectorAll("button")].map((b) => b.textContent.trim()).filter((t) => /Recargar|Herramientas|backup|Registros/i.test(t)));
    if (!botones.includes("Recargar MIA en todas las pantallas")) throw new Error("Botones visibles: " + botones.join(" | "));
    for (let k = 0; k < 3; k++) {
      const abierto = await A.evaluate(() => [...document.querySelectorAll("button")].some((b) => b.textContent.trim() === "Recargar MIA en todas las pantallas"));
      abierto || (await clic(A, "Herramientas", true), await espera(200));
      await clic(A, "Recargar MIA en todas las pantallas");
    }
    await esperarGuardado(A);
    await espera(2000);
    if (!recargas) throw new Error("La pantalla B no se recargó");
    const reg = (estado().registros || []).filter((r) => /Pidió recargar/.test(r.descripcion));
    if (reg.length !== 3) throw new Error("Registros de recarga: " + reg.length + " (se esperaban 3)");
    await B.waitForFunction(() => document.body.innerText.includes("VENTA TOTAL"), null, { timeout: 30000 });
    await sinAvisos(A);
  });

  await control("Al final no queda nada sin guardar en ninguna pantalla (no saldría el aviso al cerrar)", async () => {
    await espera(3000);
    for (const [n, p] of [["A", A], ["B", B]]) {
      const r = await p.evaluate(() => (window.__miaPendientes ? window.__miaPendientes() : null));
      if (!r) throw new Error("No está __miaPendientes en " + n);
      if (r.guardando || r.claves.length) throw new Error("Pantalla " + n + " con cambios sin guardar: " + JSON.stringify(r));
    }
    const internas = agregados.filter((x) => /erroresGuardado/.test(x.col) && /cambios sin guardar/.test(x.data.motivo));
    if (internas.length) throw new Error(internas.map((x) => x.data.motivo).join(" | "));
  });
  await navegador.close();
  console.log((PRD ? "[Producción] " : "[QA] ") + (fallas ? fallas + " prueba(s) de dos pantallas fallaron" : "Pruebas de dos pantallas OK"));
  process.exit(fallas ? 1 : 0);
})().catch((e) => {
  process.env.GITHUB_ACTIONS && console.log("::error::" + String((e && e.stack) || e).slice(0, 900).replace(/\n/g, " "));
  console.error(e);
  process.exit(1);
});
