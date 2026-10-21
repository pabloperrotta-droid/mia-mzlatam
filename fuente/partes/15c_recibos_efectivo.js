// Sección 133: recibos para los pagos en EFECTIVO (pedido del usuario, 21/10/2026).
// Botón "Recibos efectivo" en Pagos: un recibo por cada línea con Se Paga = SI, sin Fecha Pagado y con
// Efectivo. Cada recibo: MZ LATAM, número (lo pone MIA), fecha, Obra, Proveedor, importe en letras y en
// números, y lugar para la firma. Dos recibos por hoja A4.
// Numeración propia de MIA (serie 0003-), guardada en la base: si se vuelve a descargar, cada línea
// conserva su número y su fecha.
const RECIBO_PREFIJO = "0003";
const LETRAS_UNIDADES = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE", "DIEZ", "ONCE", "DOCE", "TRECE", "CATORCE", "QUINCE", "DIECISÉIS", "DIECISIETE", "DIECIOCHO", "DIECINUEVE", "VEINTE", "VEINTIUNO", "VEINTIDÓS", "VEINTITRÉS", "VEINTICUATRO", "VEINTICINCO", "VEINTISÉIS", "VEINTISIETE", "VEINTIOCHO", "VEINTINUEVE"];
const LETRAS_DECENAS = ["", "", "", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const LETRAS_CENTENAS = ["", "CIENTO", "DOSCIENTOS", "TRESCIENTOS", "CUATROCIENTOS", "QUINIENTOS", "SEISCIENTOS", "SETECIENTOS", "OCHOCIENTOS", "NOVECIENTOS"];
// 0 a 999. `apocope`: "UN" en lugar de "UNO" (delante de MIL, MILLONES o PESOS).
function letrasHasta999(n, apocope) {
  if (n === 0) return "";
  if (n === 100) return "CIEN";
  const c = Math.floor(n / 100),
    r = n % 100,
    partes = [];
  c && partes.push(LETRAS_CENTENAS[c]);
  if (r) {
    let t;
    if (r < 30) t = LETRAS_UNIDADES[r];
    else t = LETRAS_DECENAS[Math.floor(r / 10)] + (r % 10 ? " Y " + LETRAS_UNIDADES[r % 10] : "");
    if (apocope) t = t.replace(/VEINTIUNO$/, "VEINTIÚN").replace(/UNO$/, "UN");
    partes.push(t);
  }
  return partes.join(" ");
}
// Entero a letras (hasta 999.999.999.999), en mayúsculas: 1543000 → "UN MILLÓN QUINIENTOS CUARENTA Y TRES MIL".
function enteroEnLetras(n) {
  n = Math.floor(Math.abs(Number(n) || 0));
  if (n === 0) return "CERO";
  const millones = Math.floor(n / 1e6),
    miles = Math.floor((n % 1e6) / 1e3),
    resto = n % 1e3,
    partes = [];
  if (millones) {
    if (millones === 1) partes.push("UN MILLÓN");
    else {
      const mm = Math.floor(millones / 1e3),
        mr = millones % 1e3;
      partes.push(
        [mm ? (mm === 1 ? "MIL" : letrasHasta999(mm, true) + " MIL") : "", letrasHasta999(mr, true)].filter(Boolean).join(" ") + " MILLONES",
      );
    }
  }
  if (miles) partes.push(miles === 1 ? "MIL" : letrasHasta999(miles, true) + " MIL");
  if (resto) partes.push(letrasHasta999(resto, true));
  return partes.join(" ");
}
// Importe en pesos a letras: 1543000 → "UN MILLÓN QUINIENTOS CUARENTA Y TRES MIL PESOS";
// con centavos: 1250.5 → "MIL DOSCIENTOS CINCUENTA PESOS CON 50/100".
function importeEnLetras(v) {
  const cent = Math.round(Math.abs(Number(v) || 0) * 100),
    ent = Math.floor(cent / 100),
    c = cent % 100,
    m = ent % 1e6 === 0 && ent >= 1e6 ? " DE PESOS" : " PESOS";
  return enteroEnLetras(ent) + (ent === 1 ? " PESO" : m) + (c ? " CON " + String(c).padStart(2, "0") + "/100" : "");
}
// Qué va en "Obra": en WU la Sub Obra; en gastos internos el rubro; si no, Cliente + Centro de Costo
// (sin repetir el cliente si el centro ya empieza con él): NATURA + SANTA FE → "NATURA SANTA FE".
function obraDeRecibo(l) {
  const t = (s) => String(s || "").trim().toUpperCase(),
    cli = t(l.cliente),
    cc = t(l.centroCosto);
  if (cli === "WU" && t(l.subObra)) return t(l.subObra);
  if (cli === CLIENTE_GASTOS_INTERNOS) return cc ? "GASTOS INTERNOS - " + cc : "GASTOS INTERNOS";
  if (!cc) return cli;
  return cc.startsWith(cli) ? cc : (cli + " " + cc).trim();
}
// Líneas que llevan recibo: Se Paga = SI, sin Fecha Pagado y con Efectivo.
function lineasParaRecibo(lineas) {
  return (lineas || []).filter((l) => l && l.id && l.sePaga === "SI" && !l.fechaPagado && (Number(l.efectivo) || 0) > 0);
}
function numeroDeRecibo(n) {
  return RECIBO_PREFIJO + "-" + String(n).padStart(8, "0");
}
function fechaDeReciboEnTexto(ms) {
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    d = new Date(ms);
  return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear();
}
// Le da número a cada línea (las que ya tenían recibo conservan número y fecha). Usa una transacción, así dos
// personas descargando a la vez nunca reciben el mismo número.
async function asignarNumerosDeRecibo(ids) {
  const fs = firebase.firestore(),
    ref = fs.doc(COL_PREFIX + "app/recibos");
  return fs.runTransaction(async (tx) => {
    const s = await tx.get(ref),
      d = (s.exists && s.data()) || {},
      porLinea = { ...(d.porLinea || {}) };
    let ultimo = Number(d.ultimo) || 0;
    const nuevos = {},
      ahora = Date.now();
    for (const id of ids)
      if (!porLinea[id]) {
        ultimo++;
        porLinea[id] = nuevos[id] = { numero: ultimo, fecha: ahora };
      }
    // merge: agrega los nuevos sin tocar los números que ya tenían las demás líneas.
    Object.keys(nuevos).length && tx.set(ref, { ultimo, porLinea: nuevos }, { merge: true });
    return ids.map((id) => porLinea[id]);
  });
}
async function descargarRecibosEfectivo(lineas) {
  if (!(window.jspdf && window.jspdf.jsPDF)) throw new Error("No se cargó la librería de PDF. Recargá la página.");
  const ls = lineasParaRecibo(lineas).sort(
    (a, b) => (a.proveedorPago || a.proveedor || "").localeCompare(b.proveedorPago || b.proveedor || "", "es") || obraDeRecibo(a).localeCompare(obraDeRecibo(b), "es"),
  );
  if (!ls.length) return 0;
  const nums = await asignarNumerosDeRecibo(ls.map((l) => String(l.id))),
    doc = new window.jspdf.jsPDF({ orientation: "portrait", unit: "mm", format: "a4" }),
    X = 18,
    W = 174,
    ALTO = 128;
  ls.forEach((l, i) => {
    if (i > 0 && i % 2 === 0) doc.addPage();
    const y0 = 12 + (i % 2) * (ALTO + 16),
      { numero, fecha } = nums[i],
      importe = Number(l.efectivo) || 0,
      fila = (y, et, val, extra) => {
        doc.setFont("helvetica", "normal").setFontSize(11).text(et, X + 6, y);
        doc.setFont("helvetica", "bold").setFontSize(11);
        const lineasVal = doc.splitTextToSize(String(val || ""), W - 62);
        doc.text(lineasVal, X + 56, y, extra);
        return lineasVal.length;
      };
    doc.setLineWidth(0.5).rect(X, y0, W, ALTO);
    doc.setFont("helvetica", "bold").setFontSize(14).text("MZ LATAM", X + W / 2, y0 + 9, { align: "center" });
    doc.setLineWidth(0.3).line(X, y0 + 13, X + W, y0 + 13);
    doc.setFont("helvetica", "bold").setFontSize(12).text("RECIBO", X + 6, y0 + 21);
    doc.text("N° " + numeroDeRecibo(numero), X + W - 6, y0 + 21, { align: "right" });
    doc.setFont("helvetica", "normal").setFontSize(12).text(fechaDeReciboEnTexto(fecha), X + W - 6, y0 + 31, { align: "right" });
    fila(y0 + 45, "OBRA:", obraDeRecibo(l));
    fila(y0 + 56, "PROVEEDOR:", String(l.proveedorPago || l.proveedor || "").trim().toUpperCase());
    const n = fila(y0 + 70, "MONTO PAGADO:", importeEnLetras(importe));
    fila(y0 + 70 + n * 5 + 6, "SON:", "$ " + importe.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    doc.setFont("helvetica", "normal").setFontSize(10).text("Pago en efectivo", X + 6, y0 + 99);
    doc.setLineWidth(0.3).line(X + W - 86, y0 + 112, X + W - 8, y0 + 112);
    doc.setFontSize(10).text("Firma y aclaración (Recibí conforme)", X + W - 47, y0 + 118, { align: "center" });
    if (i % 2 === 0 && i + 1 < ls.length) {
      doc.setLineDashPattern([2, 2], 0).setLineWidth(0.2).line(8, y0 + ALTO + 8, 202, y0 + ALTO + 8).setLineDashPattern([], 0);
    }
  });
  const hoy = new Date();
  doc.save("Recibos efectivo " + String(hoy.getDate()).padStart(2, "0") + "-" + String(hoy.getMonth() + 1).padStart(2, "0") + "-" + hoy.getFullYear() + ".pdf");
  return ls.length;
}
