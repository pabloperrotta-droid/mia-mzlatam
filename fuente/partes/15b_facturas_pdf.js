// ---------- Facturas de proveedores en PDF (Sección 97) ----------
// En Pagos se pueden cargar las facturas en PDF (botón "Facturas PDF" o arrastrándolas sobre la tabla).
// De cada PDF se lee el QR de ARCA y/o el texto: CUIT del emisor, número, tipo (A/B/C, nota de crédito),
// total y fecha. Con el CUIT se busca el proveedor en la tabla de Proveedores (con el nombre que usa MIA,
// no la razón social). El centro de costo / sub obra se toma del nombre del archivo.
// No es excluyente con la carga a mano: una línea tipeada antes sin factura se completa con el PDF.
// El PDF queda guardado aparte (colección `pdfsFacturasPago`, `qa_` en QA), uno por línea, en pedazos.
const NUESTRO_CUIT = "30718082311";
const FC_PDF_COLECCION = "pdfsFacturasPago";
const FC_PDF_ST = { metas: {}, subs: new Set(), iniciado: false, limpiado: false };

function fcSoloDigitos(s) {
  return String(s == null ? "" : s).replace(/\D/g, "");
}
function cuitValido(s) {
  const c = fcSoloDigitos(s);
  if (c.length !== 11) return false;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  for (let i = 0; i < 10; i++) suma += Number(c[i]) * pesos[i];
  let v = 11 - (suma % 11);
  v === 11 && (v = 0);
  v === 10 && (v = 9);
  return v === Number(c[10]);
}
// Importe escrito a la argentina ("1.234.567,89") o con punto decimal ("1234567.89").
function fcLeerImporte(s) {
  let t = String(s == null ? "" : s).replace(/[^\d.,-]/g, "");
  if (!t) return 0;
  if (t.includes(",")) t = t.replace(/\./g, "").replace(",", ".");
  else if ((t.match(/\./g) || []).length > 1 || /\.\d{3}$/.test(t)) t = t.replace(/\./g, "");
  const n = Number(t);
  return isFinite(n) ? n : 0;
}
// Códigos de comprobante de ARCA → letra y si es nota de crédito.
const FC_TIPOS = {
  1: "A", 2: "A", 3: "A", 4: "A", 5: "A", 39: "A", 60: "A", 63: "A", 201: "A", 202: "A", 203: "A",
  6: "B", 7: "B", 8: "B", 9: "B", 10: "B", 40: "B", 61: "B", 64: "B", 206: "B", 207: "B", 208: "B",
  11: "C", 12: "C", 13: "C", 15: "C", 211: "C", 212: "C", 213: "C",
  51: "M", 52: "M", 53: "M",
};
const FC_NOTAS_CREDITO = new Set([3, 8, 13, 53, 203, 208, 213]);
function fcNumero(pv, nro) {
  return pv && nro ? String(Number(pv)).padStart(5, "0") + "-" + String(Number(nro)).padStart(8, "0") : "";
}
function fcBase64(s) {
  const t = String(s).replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
  const b = atob(t + "===".slice((t.length + 3) % 4));
  try {
    return decodeURIComponent(escape(b));
  } catch {
    return b;
  }
}
// Texto del QR de ARCA (https://www.afip.gob.ar/fe/qr/?p=<base64 de un JSON>) → datos de la factura.
function facturaDesdeQr(texto) {
  const m = String(texto || "").match(/[?&]p=([^&#\s]+)/);
  if (!m) return null;
  let d;
  try {
    d = JSON.parse(fcBase64(decodeURIComponent(m[1])));
  } catch {
    return null;
  }
  if (!d || !d.cuit || !d.nroCmp) return null;
  const tipo = Number(d.tipoCmp) || 0;
  return {
    cuit: fcSoloDigitos(d.cuit),
    pv: Number(d.ptoVta) || 0,
    nro: Number(d.nroCmp) || 0,
    tipo,
    total: Number(d.importe) || 0,
    moneda: d.moneda || "PES",
    fecha: /^\d{4}-\d{2}-\d{2}/.test(d.fecha || "") ? d.fecha.slice(8, 10) + "/" + d.fecha.slice(5, 7) + "/" + d.fecha.slice(0, 4) : "",
  };
}
// Textos de la primera página (como los da pdf.js) → lo que se pueda reconocer.
function facturaDesdeTexto(items) {
  const plano = (items || []).join(" ").replace(/\s+/g, " "),
    r = {};
  let m =
    plano.match(/punto\s+de\s+venta:?\s*(\d{1,5})\s*comp\.?\s*nro\.?:?\s*(\d{1,8})/i) ||
    plano.match(/n(?:ro|[°º])?\.?:?\s*(\d{4,5})\s*-\s*(\d{8})\b/i) ||
    plano.match(/\b(\d{4,5})\s*-\s*(\d{8})\b/);
  m && ((r.pv = Number(m[1])), (r.nro = Number(m[2])));
  m = plano.match(/c[oó]d(?:igo)?\.?\s*(?:n[°º]\.?\s*)?(\d{1,3})\b/i);
  m && FC_TIPOS[Number(m[1])] && (r.tipo = Number(m[1]));
  if (!r.tipo) {
    const letra = (plano.match(/\b(?:factura|nota\s+de\s+cr[eé]dito|nota\s+de\s+d[eé]bito)\s+(?:electr[oó]nica\s+)?([ABCM])\b/i) || [])[1];
    letra && (r.letra = letra.toUpperCase());
  }
  /nota\s+de\s+cr[eé]dito/i.test(plano) && (r.notaCredito = true);
  m = plano.match(/importe\s+total:?\s*(?:\$|ars)?\s*(-?[\d.,]+\d)/i);
  if (m) r.total = fcLeerImporte(m[1]);
  else {
    const todos = [...plano.matchAll(/\btotal:?\s*(?:\$|ars)?\s*([\d.]*\d,\d{2}|\d+\.\d{2})\b/gi)];
    todos.length && (r.total = fcLeerImporte(todos[todos.length - 1][1]));
  }
  // Importe de los productos, sin IVA ni percepciones (va al Importe Bruto).
  const imp = (re) => {
      const x = plano.match(re);
      return x ? fcLeerImporte(x[1]) : 0;
    },
    N = "\\s*:?\\s*(?:\\$|ars)?\\s*(-?[\\d.,]*\\d)";
  const gravado = imp(new RegExp("(?:importe\\s+)?neto\\s+gravado" + N, "i")),
    noGravado = imp(new RegExp("(?:importe\\s+)?neto\\s+no\\s+gravado" + N, "i")),
    exento = imp(new RegExp("(?:importe\\s+)?exento" + N, "i")),
    subtotal = imp(new RegExp("\\bsub\\s*-?\\s*total" + N, "i"));
  gravado || noGravado || exento ? (r.neto = gravado + noGravado + exento) : subtotal && (r.neto = subtotal);
  r.conImpuestos = /\biva\s+\d{1,2}(?:[.,]5)?\s*%|otros\s+tributos|percepci[oó]n/i.test(plano);
  m = plano.match(/fecha\s+de\s+emisi[oó]n:?\s*(\d{2}\/\d{2}\/\d{4})/i) || plano.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
  m && (r.fecha = m[1]);
  const cuits = [...plano.matchAll(/\b(\d{2})-?(\d{8})-?(\d)\b/g)].map((x) => x[1] + x[2] + x[3]).filter((c) => cuitValido(c) && c !== NUESTRO_CUIT);
  cuits.length && (r.cuit = cuits[0]);
  m = plano.match(/raz[oó]n\s+social:?\s*(.+?)\s+(?:fecha|domicilio|cuit|condici[oó]n|ingresos|punto)/i);
  m && fcSoloDigitos(m[1]).length < 6 && (r.razonSocial = m[1].trim().slice(0, 80));
  return r;
}
// Junta lo del QR (manda) con lo del texto.
function armarFactura(qr, txt) {
  const q = qr || {},
    t = txt || {},
    tipo = q.tipo || t.tipo || 0,
    pv = q.pv || t.pv || 0,
    nro = q.nro || t.nro || 0,
    letra = FC_TIPOS[tipo] || t.letra || "";
  return {
    cuit: q.cuit || t.cuit || "",
    pv,
    nro,
    factura: fcNumero(pv, nro),
    tipo,
    letra,
    notaCredito: FC_NOTAS_CREDITO.has(tipo) || (!q.tipo && !!t.notaCredito),
    total: q.total || t.total || 0,
    neto: t.neto || (letra === "C" && !t.conImpuestos ? q.total || t.total || 0 : 0),
    fecha: q.fecha || t.fecha || "",
    razonSocial: t.razonSocial || "",
    moneda: q.moneda || "PES",
    conQr: !!qr,
  };
}
// Centro de costo / sub obra que aparezca en el nombre del archivo (sin formato fijo).
function centroDesdeNombreArchivo(nombre, obras, subObrasMap) {
  const limpiar = (s) => normalizarTexto(String(s || "").replace(/\.pdf$/i, "").replace(/[_\-.,;:()\[\]+]+/g, " ")),
    archivo = " " + limpiar(nombre) + " ",
    esta = (x) => {
      const k = limpiar(x);
      return k.length >= 3 && archivo.includes(" " + k + " ");
    },
    vistos = new Set(),
    lista = (obras || []).filter((o) => {
      const k = obraKey(o.cliente, o.obra);
      return o.obra && !vistos.has(k) && vistos.add(k);
    }),
    unico = (xs, clave) => {
      if (!xs.length) return null;
      const largo = Math.max(...xs.map((x) => x.largo)),
        mejores = xs.filter((x) => x.largo === largo),
        distintos = new Set(mejores.map(clave));
      if (distintos.size === 1) return mejores[0];
      const conCliente = mejores.filter((x) => esta(x.cliente));
      return new Set(conCliente.map(clave)).size === 1 ? conCliente[0] : "ambiguo";
    },
    subs = [];
  lista.forEach((o) =>
    ((subObrasMap || {})[obraKey(o.cliente, o.obra)] || []).forEach(
      (s) => s.nombre && esta(s.nombre) && subs.push({ cliente: o.cliente, centroCosto: o.obra, subObra: s.nombre, largo: limpiar(s.nombre).length }),
    ),
  );
  const sub = unico(subs, (x) => x.cliente + "|" + x.centroCosto + "|" + x.subObra);
  if (sub && sub !== "ambiguo") return { cliente: sub.cliente, centroCosto: sub.centroCosto, subObra: sub.subObra };
  const obra = unico(
    lista.filter((o) => esta(o.obra)).map((o) => ({ cliente: o.cliente, centroCosto: o.obra, largo: limpiar(o.obra).length })),
    (x) => x.cliente + "|" + x.centroCosto,
  );
  if (obra && obra !== "ambiguo") return { cliente: obra.cliente, centroCosto: obra.centroCosto, subObra: "" };
  return { cliente: "", centroCosto: "", subObra: "", ambiguo: sub === "ambiguo" || obra === "ambiguo" };
}
// Nombre del proveedor en MIA (el "amigable") a partir del CUIT: tabla de Proveedores, después la info
// de proveedores y por último líneas de Pagos anteriores con ese CUIT.
function proveedorPorCuit(cuit, tabla, info, lineas) {
  const c = fcSoloDigitos(cuit);
  if (!c) return "";
  const t = (tabla || []).find((r) => r && r.proveedor && fcSoloDigitos(r.cuit) === c);
  if (t) return t.proveedor.trim().toUpperCase();
  const i = Object.keys(info || {}).find((k) => info[k] && fcSoloDigitos(info[k].cuit) === c);
  if (i) return i.trim().toUpperCase();
  const l = (lineas || []).filter((x) => fcSoloDigitos(x.cuit) === c && (x.proveedorPago || "").trim()).pop();
  return l ? l.proveedorPago.trim().toUpperCase() : "";
}
// Imputación para una factura nueva: la imputación no siempre es el mismo proveedor (ej. SAN ANDRES se
// imputa a PINTURA). 1) la última usada con ese proveedor en ese mismo centro de costo / sub obra;
// 2) la más usada con ese proveedor que exista en ese centro; 3) el mismo proveedor si está en el centro.
function imputacionSugerida(prov, cc, lineas, disponibles) {
  const P = (prov || "").trim().toUpperCase();
  if (!P || !cc || !cc.centroCosto) return "";
  const N = (s) => normalizarTexto(s),
    deEse = (lineas || []).filter((l) => (l.proveedorPago || "").trim().toUpperCase() === P && (l.proveedor || "").trim()),
    enCentro = deEse.filter(
      (l) => N(l.cliente) === N(cc.cliente) && N(l.centroCosto) === N(cc.centroCosto) && N(l.subObra) === N(cc.subObra),
    );
  if (enCentro.length) return enCentro[enCentro.length - 1].proveedor.trim().toUpperCase();
  const lista = (disponibles || []).filter(Boolean),
    enLista = (x) => lista.find((d) => N(d) === N(x)),
    cuenta = {};
  deEse.forEach((l) => {
    const k = enLista(l.proveedor);
    k && (cuenta[k] = (cuenta[k] || 0) + 1);
  });
  const mas = Object.keys(cuenta).sort((a, b) => cuenta[b] - cuenta[a])[0];
  return mas || enLista(P) || "";
}
// Número de factura comparable (sin ceros a la izquierda): "14-2" === "00014-00000002".
function fcClaveNumero(s) {
  const g = String(s || "").match(/\d+/g) || [];
  return g.length ? g.slice(-2).map((x) => String(Number(x))).join("-") : "";
}
// ¿A qué línea ya cargada corresponde esta factura? 1) misma factura (CUIT + número); 2) una línea sin
// número de factura, sin pagar y sin PDF, del mismo proveedor, con el mismo importe (o sin importe).
function lineaParaFactura(fc, lineas, proveedor, conPdf) {
  const c = fcSoloDigitos(fc.cuit),
    num = fcClaveNumero(fc.factura),
    tiene = conPdf || (() => false);
  if (c && num) {
    const igual = (lineas || []).find((l) => fcSoloDigitos(l.cuit) === c && fcClaveNumero(l.factura) === num);
    if (igual) return { linea: igual, como: "misma" };
  }
  const prov = (proveedor || "").trim().toUpperCase(),
    candidatas = (lineas || []).filter(
      (l) =>
        !String(l.factura || "").trim() &&
        !l.fechaPagado &&
        !tiene(l.id) &&
        ((c && fcSoloDigitos(l.cuit) === c) || (prov && (l.proveedorPago || "").trim().toUpperCase() === prov)),
    ),
    mismoImporte = candidatas.filter((l) => fc.total && Math.abs((Number(l.importe) || 0) - fc.total) < 1),
    sinImporte = candidatas.filter((l) => !(Number(l.importe) || 0) && !(Number(l.importeBruto) || 0));
  if (mismoImporte.length) return { linea: mismoImporte[0], como: "completa" };
  if (sinImporte.length) return { linea: sinImporte[0], como: "completa" };
  return null;
}
// Lo que el PDF le agrega a una línea existente: solo campos vacíos; nunca pisa lo que ya está.
function completarLineaConFactura(l, fc, razonSocialProveedor) {
  const p = {},
    vacio = (k) => !String(l[k] == null ? "" : l[k]).trim() || l[k] === 0;
  fc.factura && vacio("factura") && (p.factura = fc.factura);
  fc.cuit && vacio("cuit") && (p.cuit = fc.cuit);
  const rs = razonSocialProveedor || fc.razonSocial;
  rs && vacio("razonSocial") && (p.razonSocial = rs);
  const total = fc.notaCredito ? -Math.abs(fc.total) : fc.total;
  total && !(Number(l.importe) || 0) && (p.importe = total);
  const neto = fc.notaCredito ? -Math.abs(fc.neto || 0) : fc.neto || 0;
  neto && !(Number(l.importeBruto) || 0) && (p.importeBruto = neto);
  fc.letra === "A" && !l.facturaA && (p.facturaA = true);
  const avisos = [];
  fc.total && (Number(l.importe) || 0) && Math.abs(Math.abs(Number(l.importe)) - Math.abs(fc.total)) >= 1 &&
    avisos.push("el importe de la línea (" + fmt(l.importe) + ") no coincide con el de la factura (" + fmt(fc.total) + ")");
  fc.cuit && fcSoloDigitos(l.cuit) && fcSoloDigitos(l.cuit) !== fc.cuit && avisos.push("el CUIT de la línea no coincide con el de la factura (" + fc.cuit + ")");
  fc.factura && String(l.factura || "").trim() && fcClaveNumero(l.factura) !== fcClaveNumero(fc.factura) &&
    avisos.push("el número de factura de la línea no coincide con el del PDF (" + fc.factura + ")");
  return { cambios: p, avisos };
}

// ---------- Guardado del PDF (uno por línea de Pagos) ----------
function fcPdfIniciar() {
  if (FC_PDF_ST.iniciado) return;
  const db = ocPdfDb();
  if (!db) {
    setTimeout(fcPdfIniciar, 2000);
    return;
  }
  FC_PDF_ST.iniciado = true;
  db.collection(FC_PDF_COLECCION).onSnapshot(
    (s) => {
      const m = {};
      s.docs.forEach((d) => (m[d.id] = d.data()));
      FC_PDF_ST.metas = m;
      FC_PDF_ST.cargado = true;
      FC_PDF_ST.subs.forEach((f) => f());
    },
    () => {},
  );
}
function useFcPdfs() {
  const [, f] = React.useState(0);
  React.useEffect(() => {
    fcPdfIniciar();
    const g = () => f((x) => x + 1);
    return FC_PDF_ST.subs.add(g), () => FC_PDF_ST.subs.delete(g);
  }, []);
  return FC_PDF_ST;
}
async function fcPdfGuardar(lineaId, file, datos) {
  if (!file || !lineaId) return;
  if (file.size > OC_PDF_MAX) throw new Error("El PDF pesa más de 8 MB.");
  const db = ocPdfDb();
  if (!db) throw new Error("Sin conexión con la base de datos");
  const b64 = await ocPdfLeerBase64(file),
    ref = db.collection(FC_PDF_COLECCION).doc(String(lineaId)),
    partes = Math.max(1, Math.ceil(b64.length / OC_PDF_PARTE));
  for (let i = 0; i < partes; i++)
    await ref.collection("partes").doc(String(i)).set({ datos: b64.slice(i * OC_PDF_PARTE, (i + 1) * OC_PDF_PARTE) });
  let rol = "";
  try {
    rol = localStorage.getItem("obras-role") || "";
  } catch {}
  await ref.set({
    nombre: file.name || "factura.pdf",
    tamano: file.size,
    partes,
    subido: Date.now(),
    rol,
    cuit: (datos && datos.cuit) || "",
    factura: (datos && datos.factura) || "",
    total: (datos && datos.total) || 0,
  });
}
async function fcPdfBlob(lineaId) {
  const db = ocPdfDb(),
    meta = FC_PDF_ST.metas[lineaId];
  if (!db || !meta) throw new Error("No se encontró el PDF");
  const ref = db.collection(FC_PDF_COLECCION).doc(String(lineaId));
  let b64 = "";
  for (let i = 0; i < meta.partes; i++) {
    const p = await ref.collection("partes").doc(String(i)).get();
    b64 += (p.exists && p.data().datos) || "";
  }
  const bin = atob(b64),
    bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: "application/pdf" });
}
async function fcPdfBorrar(lineaId) {
  const db = ocPdfDb();
  if (!db) return;
  const ref = db.collection(FC_PDF_COLECCION).doc(String(lineaId));
  for (const p of (await ref.collection("partes").get()).docs) await p.ref.delete();
  await ref.delete();
}
// Los PDF de líneas borradas se eliminan pasada una semana (así "Deshacer" los recupera mientras tanto).
function fcPdfLimpiarHuerfanos(lineas) {
  if (FC_PDF_ST.limpiado || !FC_PDF_ST.cargado || !lineas || !lineas.length) return;
  FC_PDF_ST.limpiado = true;
  const ids = new Set(lineas.map((l) => String(l.id))),
    limite = Date.now() - 7 * 24 * 3600 * 1000;
  Object.keys(FC_PDF_ST.metas)
    .filter((id) => !ids.has(id) && (FC_PDF_ST.metas[id].subido || 0) < limite)
    .forEach((id) => fcPdfBorrar(id).catch(() => {}));
}

// ---------- Lectura del PDF en el navegador ----------
let FC_JSQR = null;
function fcCargarJsQr() {
  if (window.jsQR) return Promise.resolve(window.jsQR);
  if (FC_JSQR) return FC_JSQR;
  const urls = [
    "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.min.js",
    "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js",
    "https://unpkg.com/jsqr@1.4.0/dist/jsQR.js",
  ];
  FC_JSQR = urls.reduce(
    (p, u) =>
      p.catch(
        () =>
          new Promise((ok, mal) => {
            const s = document.createElement("script");
            s.src = u;
            s.async = true;
            s.onload = () => (window.jsQR ? ok(window.jsQR) : mal(new Error("sin jsQR")));
            s.onerror = () => (s.remove(), mal(new Error("no cargó " + u)));
            document.head.appendChild(s);
          }),
      ),
    Promise.reject(new Error("inicio")),
  );
  FC_JSQR.catch(() => (FC_JSQR = null));
  return FC_JSQR;
}
async function fcLeerQrDePagina(page) {
  const vp = page.getViewport({ scale: 2.5 }),
    canvas = document.createElement("canvas");
  canvas.width = Math.ceil(vp.width);
  canvas.height = Math.ceil(vp.height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  if (typeof window.BarcodeDetector === "function") {
    try {
      const det = new window.BarcodeDetector({ formats: ["qr_code"] }),
        cods = await det.detect(canvas),
        c = cods.find((x) => /[?&]p=/.test(x.rawValue || ""));
      if (c) return c.rawValue;
    } catch {}
  }
  const jsQR = await fcCargarJsQr(),
    zonas = [
      [0, 0, canvas.width, canvas.height],
      [0, Math.floor(canvas.height / 2), canvas.width, Math.ceil(canvas.height / 2)],
    ];
  for (const [x, y, w, h] of zonas) {
    const img = ctx.getImageData(x, y, w, h),
      r = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
    if (r && /[?&]p=/.test(r.data || "")) return r.data;
  }
  return null;
}
async function leerFacturaPdf(file) {
  if (!window.pdfjsLib) throw new Error("No se pudo cargar el lector de PDF (pdf.js).");
  const doc = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise,
    page = await doc.getPage(1),
    items = (await page.getTextContent()).items.map((i) => (i.str || "").trim()).filter(Boolean);
  let qr = null;
  try {
    qr = facturaDesdeQr(await fcLeerQrDePagina(page));
  } catch {}
  return armarFactura(qr, facturaDesdeTexto(items));
}

// ---------- Celda "PDF" al lado del número de factura ----------
function FacturaPdfCelda({ linea: l, puedeEditar, onAdjuntar }) {
  const st = useFcPdfs(),
    ref = React.useRef(null),
    [ocupado, setOcupado] = React.useState(""),
    meta = st.metas[l.id],
    abrir = async (descargar) => {
      const w = descargar ? null : window.open("", "_blank");
      setOcupado(descargar ? "…" : "…");
      try {
        const url = URL.createObjectURL(await fcPdfBlob(l.id));
        if (descargar) {
          const a = document.createElement("a");
          a.href = url;
          a.download = meta.nombre || "factura_" + (l.factura || l.id) + ".pdf";
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else if (w) w.location.href = url;
        else window.open(url, "_blank");
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } catch (e) {
        w && w.close();
        window.alert("No se pudo abrir el PDF: " + ((e && e.message) || e));
      }
      setOcupado("");
    },
    elegir = async (ev) => {
      const f = ev.target.files && ev.target.files[0];
      ev.target.value = "";
      if (!f) return;
      setOcupado("…");
      try {
        await onAdjuntar(l, f);
      } catch (e) {
        window.alert("No se pudo adjuntar el PDF: " + ((e && e.message) || e));
      }
      setOcupado("");
    },
    btn = { border: "none", background: "none", cursor: "pointer", color: NAVY, fontSize: 12, padding: "0 2px", lineHeight: 1 };
  if (ocupado) return React.createElement("span", { style: { fontSize: 11, color: MUTED } }, "⏳");
  return React.createElement(
    "span",
    { style: { display: "inline-flex", gap: 2, alignItems: "center", whiteSpace: "nowrap" } },
    meta && React.createElement("button", { onClick: () => abrir(false), style: btn, title: "Ver la factura (" + meta.nombre + ")" }, "👁"),
    meta && React.createElement("button", { onClick: () => abrir(true), style: btn, title: "Descargar " + meta.nombre }, "⬇"),
    puedeEditar &&
      React.createElement("input", { ref, type: "file", accept: "application/pdf", style: { display: "none" }, onChange: elegir }),
    puedeEditar &&
      !meta &&
      React.createElement(
        "button",
        {
          onClick: () => ref.current && ref.current.click(),
          style: { ...btn, color: MUTED, fontSize: 10.5, fontWeight: 700 },
          title: "Adjuntar el PDF de la factura. Completa solo lo que esté vacío en la línea y avisa si algo no coincide.",
        },
        "+PDF",
      ),
  );
}
