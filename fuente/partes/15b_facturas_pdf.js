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
// Importe escrito a la argentina ("1.234.567,89"), a la inglesa ("18,166,291" / "3,814,921.11") o
// con punto decimal ("376000.00"). Si hay coma y punto, el último es el decimal; si hay uno solo, es
// decimal salvo que aparezca varias veces o tenga justo 3 cifras después (separador de miles).
function fcLeerImporte(s) {
  return leerNumeroFlexible(s);
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
// Importe que acompaña a una etiqueta ("Subtotal", "Total", ...) según la posición en la hoja: en el
// mismo texto, a la derecha en el mismo renglón, o debajo (facturas con los totales en tabla). Los
// textos vienen de pdf.js con su posición ({ s, x, y, w, h }; y crece hacia arriba).
function fcEsImporte(s) {
  const t = String(s || "").trim();
  return /\d/.test(t) && /^(?:\$|ars)?\s*-?\s*\$?\s*[\d.,]*\d\s*-?$/i.test(t) && fcSoloDigitos(t).length < 16;
}
function fcValorJunto(items, re, abajoDeTodo) {
  let etiquetas = items.filter((i) => re.test(i.s));
  if (!etiquetas.length) return null;
  if (abajoDeTodo) {
    const ymin = Math.min(...etiquetas.map((i) => i.y));
    etiquetas = etiquetas.filter((i) => Math.abs(i.y - ymin) < 3);
  }
  etiquetas.sort((a, b) => b.y - a.y || a.x - b.x);
  for (const L of etiquetas) {
    const resto = L.s.replace(re, "").replace(/^[\s:]+/, "");
    if (fcEsImporte(resto)) return fcLeerImporte(resto);
    if (L.w == null) continue;
    const alto = Math.max(L.h || 0, 6),
      derecha = items
        .filter((i) => i !== L && Math.abs(i.y - L.y) <= alto * 0.6 && i.x >= L.x + L.w - 2 && String(i.s).trim() !== "$")
        .sort((a, b) => a.x - b.x);
    if (derecha.length && fcEsImporte(derecha[0].s)) return fcLeerImporte(derecha[0].s);
    const abajo = items
      .filter((i) => i.y < L.y - 1 && i.y > L.y - alto * 3.5 && i.x < L.x + L.w + 6 && i.x + (i.w || 0) > L.x - 6 && fcEsImporte(i.s))
      .sort((a, b) => b.y - a.y);
    if (abajo.length) return fcLeerImporte(abajo[0].s);
  }
  return null;
}
// Textos de la primera página → lo que se pueda reconocer. Acepta textos sueltos (sin posición) o
// los objetos de pdf.js con posición.
function facturaDesdeTexto(items) {
  const lista = (items || []).map((i) => (typeof i === "string" ? { s: i, x: 0, y: 0 } : i)).filter((i) => String(i.s || "").trim()),
    conPos = lista.some((i) => i.w != null),
    plano = lista.map((i) => i.s).join(" ").replace(/\s+/g, " "),
    r = {};
  let m =
    plano.match(/punto\s+de\s+venta:?\s*(\d{1,5})\s*comp\.?\s*nro\.?:?\s*(\d{1,8})/i) ||
    plano.match(/(?:^|[^\d])[ABCM]?\s?(\d{4,5})\s*-\s*(\d{8})(?!\d)/);
  m && ((r.pv = Number(m[1])), (r.nro = Number(m[2])));
  m = plano.match(/c[oó]d(?:igo)?\.?\s*(?:n[°º]\.?\s*)?(\d{1,3})\b/i);
  m && FC_TIPOS[Number(m[1])] && (r.tipo = Number(m[1]));
  if (!r.tipo) {
    const letra =
      (plano.match(/\b(?:factura|nota\s+de\s+cr[eé]dito|nota\s+de\s+d[eé]bito)\s+(?:electr[oó]nica\s+)?([ABCM])\b/i) || [])[1] ||
      (plano.match(/(?:^|[^\w])([ABCM])\s?\d{4,5}\s*-\s*\d{8}(?!\d)/) || [])[1];
    letra && (r.letra = letra.toUpperCase());
  }
  /nota\s+de\s+cr[eé]dito/i.test(plano) && (r.notaCredito = true);
  // Importes: primero por posición (sirve para cualquier diseño), si no, por el texto corrido.
  const pos = (re, abajo) => (conPos ? fcValorJunto(lista, re, abajo) : null),
    N = "\\s*:?\\s*(?:\\$|ars)?\\s*(-?[\\d.,]*\\d)",
    plan = (re) => {
      const x = plano.match(new RegExp(re + N, "i"));
      return x ? fcLeerImporte(x[1]) : null;
    },
    importe = (rePos, reTexto, abajo) => {
      const a = pos(rePos, abajo);
      return a != null ? a : plan(reTexto);
    };
  const total = importe(/^\s*(?:importe\s+)?total\b(?!\s+(?:gravado|neto))/i, "(?:importe\\s+)?\\btotal\\b", true);
  total && (r.total = Math.abs(total));
  const gravado = importe(/^\s*(?:importe\s+)?(?:neto|sub\s*-?\s*total)\s+gravado\b/i, "(?:importe\\s+)?(?:neto|sub\\s*-?\\s*total)\\s+gravado") || 0,
    noGravado = importe(/^\s*(?:importe\s+)?(?:neto|sub\s*-?\s*total)\s+no\s+gravado\b/i, "(?:importe\\s+)?(?:neto|sub\\s*-?\\s*total)\\s+no\\s+gravado") || 0,
    exento = importe(/^\s*(?:importe\s+|neto\s+)?exento\b/i, "(?:importe\\s+|neto\\s+)?exento") || 0,
    subtotal = importe(/^\s*sub\s*-?\s*total\s*:?\s*$|^\s*sub\s*-?\s*total\s*:?\s*\$?\s*[\d.,]+\s*$/i, "\\bsub\\s*-?\\s*total", true) || 0;
  gravado || noGravado || exento ? (r.neto = Math.abs(gravado + noGravado + exento)) : subtotal && (r.neto = Math.abs(subtotal));
  // Totales sin títulos legibles (ej. títulos dibujados como imagen): un renglón de importes donde el
  // mayor es la suma de los demás → ese es el total y el primero (a la izquierda) el subtotal.
  if (conPos && (!r.total || !r.neto)) {
    const nums = lista.filter((i) => fcEsImporte(i.s)).map((i) => ({ ...i, v: Math.abs(fcLeerImporte(i.s)) })).filter((i) => i.v > 100);
    const filas = [];
    nums.forEach((i) => {
      const f = filas.find((x) => Math.abs(x[0].y - i.y) < 3);
      f ? f.push(i) : filas.push([i]);
    });
    for (const f of filas.filter((x) => x.length >= 3).sort((a, b) => a[0].y - b[0].y)) {
      const mayor = f.reduce((a, b) => (b.v > a.v ? b : a)),
        otros = f.filter((i) => i !== mayor).sort((a, b) => a.x - b.x),
        suma = otros.reduce((a, b) => a + b.v, 0);
      if (Math.abs(suma - mayor.v) < 1 && (!r.total || Math.abs(r.total - mayor.v) < 1)) {
        r.total || (r.total = mayor.v);
        r.neto || (r.neto = otros[0].v);
        break;
      }
    }
  }
  r.neto && r.total && r.neto > r.total + 1 && delete r.neto;
  r.conImpuestos = /\biva\b|otros\s+tributos|percep|impuestos/i.test(plano);
  m = plano.match(/fecha\s+de\s+emisi[oó]n:?\s*(\d{2}[\/-]\d{2}[\/-]\d{4})/i) || plano.match(/\b(\d{2}[\/-]\d{2}[\/-]\d{4})\b/);
  m && (r.fecha = m[1].replace(/-/g, "/"));
  const cuits = [...plano.matchAll(/\b(\d{2})-?(\d{8})-?(\d)\b/g)].map((x) => x[1] + x[2] + x[3]).filter((c) => cuitValido(c) && c !== NUESTRO_CUIT);
  cuits.length && (r.cuit = cuits[0]);
  // Código de barras viejo de AFIP: CUIT(11) tipo(3) punto de venta(4-5) CAE(14) vencimiento(8) dígito.
  const barras = plano.match(/\b(\d{11})(\d{3})(\d{4,5})(\d{14})(20\d{6})\d\b/);
  if (barras && cuitValido(barras[1]) && barras[1] !== NUESTRO_CUIT) {
    r.cuit || (r.cuit = barras[1]);
    r.tipo || (FC_TIPOS[Number(barras[2])] && (r.tipo = Number(barras[2])));
    r.pv || (r.pv = Number(barras[3]));
  }
  m = plano.match(/raz[oó]n\s+social:?\s*(.+?)\s+(?:fecha|domicilio|cuit|condici[oó]n|ingresos|punto)/i);
  m && fcSoloDigitos(m[1]).length < 6 && !/mz\s*latam/i.test(m[1]) && (r.razonSocial = m[1].trim().slice(0, 80));
  // Si no está rotulada: el primer nombre de empresa (SRL, SA, SAS…) que no sea MZ LATAM.
  if (!r.razonSocial) {
    const emp = lista.map((i) => String(i.s).replace(/[\/|]+\s*$/, "").trim()).find(
      (t) => /\b(?:S\.?\s?R\.?\s?L|S\.?\s?A\.?\s?S?|S\.?\s?H|S\.?\s?C\.?\s?A)\.?$/i.test(t) && !/mz\s*latam/i.test(t) && t.length <= 60 && fcSoloDigitos(t).length < 4 && /[a-z]{3}/i.test(t),
    );
    emp && (r.razonSocial = emp);
  }
  return r;
}
// Nombre con el que ARCA descarga los comprobantes: CUIT-emisor_tipo_puntoDeVenta_número (ej.
// "20238459045_001_00001_00000540 victor nunez wu moron.pdf"). Sirve si el PDF no se puede leer.
function facturaDesdeNombreArchivo(nombre) {
  const m = String(nombre || "").match(/(?:^|\D)(\d{11})_(\d{1,3})_(\d{1,5})_(\d{1,8})(?!\d)/);
  if (!m || !cuitValido(m[1])) return null;
  return { cuit: m[1], tipo: Number(m[2]) || 0, pv: Number(m[3]) || 0, nro: Number(m[4]) || 0 };
}
// Junta lo del QR (manda), lo del nombre del archivo de ARCA y lo del texto.
function armarFactura(qr, txt, arch) {
  const a = arch || {},
    q = { ...a, ...(qr || {}) },
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
// Palabras del nombre de archivo, normalizadas (sin tildes, en mayúsculas, sin ".pdf" ni signos).
function fcPalabrasArchivo(nombre) {
  return normalizarTexto(String(nombre || "").replace(/\.pdf$/i, "").replace(/[_\-.,;:()\[\]+]+/g, " "))
    .split(" ")
    .filter(Boolean);
}
// Rubro de gastos internos escrito a mano ("marketing" → MKT, "finanzas" → FINANCIERO, "horarios" →
// HONORARIOS…): igual, sinónimo, o casi igual (hasta 2 letras de diferencia en palabras largas).
const FC_SINONIMOS_RUBROS = {
  MARKETING: "MKT", PUBLICIDAD: "MKT", FINANZAS: "FINANCIERO", FINANCIERA: "FINANCIERO", FINANCIEROS: "FINANCIERO", BANCO: "FINANCIERO",
  SUELDO: "SUELDOS", HONORARIO: "HONORARIOS", CONTADOR: "CONTADORES", CONTABLE: "CONTADORES", EXPENSA: "EXPENSAS", ALQUILERES: "ALQUILER",
};
function fcRubroInterno(palabra) {
  const w = normalizarTexto(palabra);
  if (w.length < 3) return "";
  const rubros = RUBROS_GASTOS_INTERNOS.map((r) => normalizarTexto(r)),
    exacto = rubros.find((r) => r === w);
  if (exacto) return exacto;
  if (FC_SINONIMOS_RUBROS[w]) return FC_SINONIMOS_RUBROS[w];
  if (w.length < 5) return "";
  const cerca = rubros.filter((r) => r.length >= 5 && distanciaLevenshtein(r, w) <= (w.length >= 8 ? 2 : 1));
  return cerca.length === 1 ? cerca[0] : "";
}
// Centro de costo / sub obra que aparezca en el nombre del archivo (sin formato fijo). Se acepta el nombre
// completo o sin las palabras del cliente ("w moron" o "moron" → sub obra WU MORON de WU). Si dice
// "interno", el cliente es INTERNO y el centro de costo es el rubro escrito (ej. "interno sueldos").
function centroDesdeNombreArchivo(nombre, obras, subObrasMap) {
  const limpiar = (s) => normalizarTexto(String(s || "").replace(/\.pdf$/i, "").replace(/[_\-.,;:()\[\]+]+/g, " ")),
    palabras = fcPalabrasArchivo(nombre),
    archivo = " " + palabras.join(" ") + " ";
  if (palabras.includes("INTERNO") || palabras.includes("INTERNOS")) {
    const k = Math.max(palabras.indexOf("INTERNO"), palabras.indexOf("INTERNOS")),
      orden = [...palabras.slice(k + 1), ...palabras.slice(0, k).reverse()],
      rubro = orden.map(fcRubroInterno).find(Boolean) || "";
    return { cliente: CLIENTE_GASTOS_INTERNOS, centroCosto: rubro, subObra: "" };
  }
  const variantes = (x, cliente) => {
      const k = limpiar(x),
        cl = limpiar(cliente).split(" ").filter(Boolean),
        sin = k
          .split(" ")
          .filter((w) => !cl.includes(w))
          .join(" ");
      return [k, sin].filter((v, i, a) => v && v.length >= (i === 0 ? 3 : 4) && a.indexOf(v) === i);
    },
    largoEn = (x, cliente) => {
      const v = variantes(x, cliente).find((v) => archivo.includes(" " + v + " "));
      return v ? v.length : 0;
    },
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
      const conCliente = mejores.filter((x) => esta(x.cliente) || (limpiar(x.cliente).length <= 3 && palabras.some((w) => limpiar(x.cliente).startsWith(w))));
      return new Set(conCliente.map(clave)).size === 1 ? conCliente[0] : "ambiguo";
    },
    subs = [];
  lista.forEach((o) =>
    ((subObrasMap || {})[obraKey(o.cliente, o.obra)] || []).forEach((sc) => {
      const largo = sc.nombre ? largoEn(sc.nombre, o.cliente) : 0;
      largo && subs.push({ cliente: o.cliente, centroCosto: o.obra, subObra: sc.nombre, largo });
    }),
  );
  const sub = unico(subs, (x) => x.cliente + "|" + x.centroCosto + "|" + x.subObra);
  if (sub && sub !== "ambiguo") return { cliente: sub.cliente, centroCosto: sub.centroCosto, subObra: sub.subObra };
  const obra = unico(
    lista.map((o) => ({ cliente: o.cliente, centroCosto: o.obra, largo: largoEn(o.obra, o.cliente) })).filter((x) => x.largo),
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
// Si el CUIT no está cargado: razón social del PDF igual a la de la tabla, o al nombre del proveedor
// (sin importar el orden de las palabras ni "SRL", "SA", etc.: "CASA ARIEL" = "ARIEL CASA").
function proveedorPorRazonSocial(razon, tabla) {
  const palabras = (x) =>
    normalizarTexto(String(x || "").replace(/[.,]/g, " "))
      .split(" ")
      .filter((w) => w.length > 1 && !/^(SA|SRL|SAS|SH|SC|DE|LA|EL|LOS|LAS)$/.test(w))
      .sort()
      .join(" "),
    r = palabras(razon);
  if (r.length < 4) return "";
  const t = (tabla || []).find((x) => x && x.proveedor && (palabras(x.razonSocial) === r || palabras(x.proveedor) === r));
  return t ? t.proveedor.trim().toUpperCase() : "";
}
// Imputación escrita en el nombre del archivo (ej. "... victor nunez wu moron.pdf" → VICTOR NUÑEZ).
// Primero entre los proveedores de ese centro / sub obra, después entre todos los conocidos. No cuenta
// si el nombre encontrado es el mismo proveedor al que se le paga.
function imputacionDesdeNombreArchivo(nombre, prov, disponibles, todos, cc) {
  const limpiar = (x) => normalizarTexto(String(x || "").replace(/\.pdf$/i, "").replace(/[_\-.,;:()\[\]+]+/g, " ")),
    palabras = fcPalabrasArchivo(nombre),
    archivo = " " + palabras.join(" ") + " ",
    P = limpiar(prov),
    buscar = (lista) =>
      (lista || [])
        .filter((x) => {
          const k = limpiar(x);
          return k.length >= 4 && k !== P && archivo.includes(" " + k + " ");
        })
        .sort((x, y) => limpiar(y).length - limpiar(x).length)[0] || "",
    completo = buscar(disponibles) || buscar(todos);
  if (completo) return completo;
  // Una sola palabra del nombre ("casas" → ARIEL CASAS), sin contar las del cliente / centro / sub obra,
  // las del proveedor al que se paga, números ni "interno". Solo si coincide con un único proveedor.
  const usadas = new Set(
      [cc && cc.cliente, cc && cc.centroCosto, cc && cc.subObra, prov, "INTERNO NO SI FC FACTURA FAC MZ LATAM"]
        .map(limpiar)
        .join(" ")
        .split(" "),
    ),
    libres = palabras.filter((w) => w.length >= 4 && !/\d/.test(w) && !usadas.has(w)),
    porPalabra = (lista) => {
      const c = (lista || []).filter((x) => limpiar(x) !== P && limpiar(x).split(" ").some((w) => w.length >= 4 && libres.includes(w)));
      return c.length === 1 ? c[0] : "";
    };
  return porPalabra(disponibles) || porPalabra(todos);
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
    .filter((id) => !ids.has(id.split("__nc")[0]) && (FC_PDF_ST.metas[id].subido || 0) < limite)
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
  // jsQR encuentra mejor el QR cuando ocupa más lugar en la imagen: primero la hoja entera y después
  // pedazos superpuestos (mitad de ancho × un tercio de alto), que cubren cualquier ubicación del QR.
  const jsQR = await fcCargarJsQr(),
    W = canvas.width,
    H = canvas.height,
    tw = Math.floor(W / 2),
    th = Math.floor(H / 3),
    zonas = [[0, 0, W, H]];
  for (let y = H - th; y >= 0; y -= Math.floor(th / 2)) for (let x = 0; x + tw <= W; x += Math.floor(tw / 2)) zonas.push([x, y, tw, th]);
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
    items = (await page.getTextContent()).items
      .filter((i) => (i.str || "").trim())
      .map((i) => ({ s: i.str.trim(), x: i.transform[4], y: i.transform[5], w: i.width || 0, h: i.height || Math.abs(i.transform[3]) || 8 }));
  let qr = null;
  try {
    qr = facturaDesdeQr(await fcLeerQrDePagina(page));
  } catch {}
  return armarFactura(qr, facturaDesdeTexto(items), facturaDesdeNombreArchivo(file.name));
}

// ---------- Celda "PDF" al lado del número de factura ----------
function FacturaPdfCelda({ linea: l, puedeEditar, onAdjuntar }) {
  const st = useFcPdfs(),
    ref = React.useRef(null),
    [ocupado, setOcupado] = React.useState(""),
    meta = st.metas[l.id],
    notas = Object.keys(st.metas).filter((k) => k.startsWith(String(l.id) + "__nc")),
    abrir = async (descargar, id) => {
      id = id || l.id;
      const w = descargar ? null : window.open("", "_blank");
      setOcupado(descargar ? "…" : "…");
      try {
        const url = URL.createObjectURL(await fcPdfBlob(id));
        if (descargar) {
          const a = document.createElement("a");
          a.href = url;
          a.download = (st.metas[id] && st.metas[id].nombre) || "factura_" + (l.factura || l.id) + ".pdf";
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
    notas.map((k) =>
      React.createElement(
        "button",
        { key: k, onClick: () => abrir(false, k), style: { ...btn, fontSize: 10, fontWeight: 700, color: "#0969DA" }, title: "Ver la nota de crédito (" + st.metas[k].nombre + ")" },
        "NC",
      ),
    ),
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

// ---------- Alta de proveedor (tabla de Proveedores) desde Pagos o desde la revisión de facturas ----------
function NuevoProveedorForm({ inicial, imputaciones, onCrear, onCancelar }) {
  const [v, setV] = React.useState({ actividad: "", facturaA: false, cuit: "", razonSocial: "", cbu: "", imputacion: "", ...(inicial || {}) }),
    campo = { width: "100%", boxSizing: "border-box", fontSize: 11.5, padding: "4px 6px", border: "1px solid #D0D0D0", borderRadius: 4, marginBottom: 6, color: TEXT, background: "#fff" },
    etiqueta = (t) => React.createElement("label", { style: { fontSize: 10, color: MUTED, display: "block", marginBottom: 2 } }, t),
    texto = (k, ph, extra) =>
      React.createElement("input", { style: campo, value: v[k] || "", placeholder: ph, onChange: (e) => setV((x) => ({ ...x, [k]: e.target.value })), ...(extra || {}) }),
    cuitMal = fcSoloDigitos(v.cuit) && !cuitValido(v.cuit),
    listaId = "np-imp-" + React.useMemo(() => Math.random().toString(36).slice(2, 8), []);
  return React.createElement(
    "div",
    { style: { width: 260 } },
    React.createElement("div", { style: { fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 6 } }, "Nuevo proveedor: ", v.nombre),
    etiqueta("Nombre en MIA"),
    texto("nombre", "Ej. SAN ANDRES", { onChange: (e) => setV((x) => ({ ...x, nombre: e.target.value.toUpperCase() })) }),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 8 } },
      React.createElement(
        "div",
        { style: { flex: 1 } },
        etiqueta("Actividad"),
        React.createElement(
          "select",
          { style: campo, value: v.actividad, onChange: (e) => setV((x) => ({ ...x, actividad: e.target.value })) },
          React.createElement("option", { value: "" }, "(ninguna)"),
          React.createElement("option", { value: "MAT" }, "MAT"),
          React.createElement("option", { value: "MO" }, "MO"),
        ),
      ),
      React.createElement(
        "label",
        { style: { fontSize: 11, color: NAVY, display: "flex", alignItems: "center", gap: 5, marginTop: 10 } },
        React.createElement("input", { type: "checkbox", checked: !!v.facturaA, onChange: (e) => setV((x) => ({ ...x, facturaA: e.target.checked })) }),
        "Factura A",
      ),
    ),
    etiqueta("CUIT"),
    texto("cuit", "20-12345678-9", cuitMal ? { style: { ...campo, borderColor: RED, background: "#FBEAE7" }, title: "El CUIT no es válido" } : null),
    etiqueta("Razón social"),
    texto("razonSocial", "Como figura en la factura"),
    etiqueta("CBU"),
    texto("cbu", "CBU o alias"),
    etiqueta("Imputación habitual (opcional)"),
    texto("imputacion", "Ej. PINTURA", { list: listaId, onChange: (e) => setV((x) => ({ ...x, imputacion: e.target.value.toUpperCase() })) }),
    React.createElement("datalist", { id: listaId }, (imputaciones || []).map((x) => React.createElement("option", { key: x, value: x }))),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 6, marginTop: 2 } },
      React.createElement(
        "button",
        {
          disabled: !String(v.nombre || "").trim(),
          onClick: () => onCrear({ ...v, nombre: String(v.nombre || "").trim().toUpperCase(), cuit: String(v.cuit || "").trim() }),
          style: { ...smallBtnPrimary, padding: "4px 10px", fontSize: 11 },
        },
        "Crear",
      ),
      React.createElement("button", { onClick: onCancelar, style: { ...smallBtnGhost, padding: "4px 10px", fontSize: 11 } }, "Cancelar"),
    ),
  );
}

// ---------- La tabla de Proveedores aprende de Pagos (Sección 97) ----------
// Completa SOLO lo vacío de cada proveedor con lo cargado en sus líneas de Pagos: CUIT (válido), razón
// social, CBU (el último cargado), MAT/MO e imputación habitual (lo más usado; sin contar gastos
// internos) y Factura A si alguna línea la tiene. Devuelve la tabla nueva, o null si no cambia nada.
function aprenderProveedores(tabla, lineas) {
  if (!tabla || !tabla.length) return null;
  const por = {};
  (lineas || []).forEach((l) => {
    const pr = (l.proveedorPago || "").trim().toUpperCase();
    pr && (por[pr] = por[pr] || []).push(l);
  });
  let cambio = false;
  const nueva = tabla.map((r) => {
    const ls = por[(r.proveedor || "").trim().toUpperCase()];
    if (!ls) return r;
    const vacio = (k) => !String(r[k] == null ? "" : r[k]).trim(),
      ultimo = (fn) => {
        for (let i = ls.length - 1; i >= 0; i--) {
          const v = fn(ls[i]);
          if (v) return v;
        }
        return "";
      },
      masUsado = (fn) => {
        const c = {};
        ls.forEach((l) => {
          const v = fn(l);
          v && (c[v] = (c[v] || 0) + 1);
        });
        return Object.keys(c).sort((a, b) => c[b] - c[a])[0] || "";
      },
      p = {};
    vacio("cuit") && (p.cuit = ultimo((l) => (cuitValido(l.cuit) ? String(l.cuit).trim() : "")));
    vacio("razonSocial") && (p.razonSocial = ultimo((l) => String(l.razonSocial || "").trim()));
    vacio("cbu") && (p.cbu = ultimo((l) => String(l.cbu || "").trim()));
    vacio("actividad") && (p.actividad = masUsado((l) => (l.mat && !l.mo ? "MAT" : l.mo && !l.mat ? "MO" : "")));
    vacio("factura") && ls.some((l) => l.facturaA) && (p.factura = "A");
    vacio("imputacion") &&
      (p.imputacion = masUsado((l) => ((l.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS ? "" : (l.proveedor || "").trim().toUpperCase())));
    Object.keys(p).forEach((k) => p[k] || delete p[k]);
    if (!Object.keys(p).length) return r;
    cambio = true;
    return { ...r, ...p };
  });
  return cambio ? nueva : null;
}
// La factura en PDF manda en el tipo: si es B o C, el proveedor no es "Factura A" (y al revés).
function corregirTipoFacturaProveedores(tabla, tipos) {
  let cambio = false;
  const nueva = (tabla || []).map((r) => {
    const letra = tipos[(r.proveedor || "").trim().toUpperCase()];
    if (!letra || !/^[ABC]$/.test(letra) || (r.factura || "").trim().toUpperCase() === letra) return r;
    cambio = true;
    return { ...r, factura: letra };
  });
  return cambio ? nueva : null;
}
