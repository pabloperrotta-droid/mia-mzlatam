// Sección 162: comparar Pagos con un respaldo y restaurar (pedido del usuario, 05/11/2026: "en Pagos no me coincide
// hoy tal cual lo dejé ayer… ¿cómo hacemos para restaurar? ¿y cómo me aseguro de que no hay ningún otro cambio?").
// Fuentes: el respaldo diario de la base (respaldosDiarios, 18:05 hs desde el 05/11/2026, antes 03:13; solo Producción) y la foto diaria del Historial.
// Muestra línea por línea qué se agregó, qué se borró y qué cambió (campo: antes → ahora), con botones para volver
// atrás cada línea o todo. Además, un resumen de qué otras partes de la base cambiaron desde ese respaldo.

// Campos de una línea de Pagos que se muestran con nombre (el resto se muestra con su nombre interno).
const CAMPOS_PAGO = {
  fechaPagado: "Fecha Pagado",
  sePaga: "Se Paga",
  cliente: "Cliente",
  centroCosto: "Centro de Costo",
  subObra: "Sub Obra",
  proveedor: "Imputación",
  proveedorPago: "Proveedor",
  cuit: "CUIT",
  razonSocial: "Razón Social",
  mo: "MO",
  mat: "MAT",
  factura: "Factura",
  facturaA: "Factura A",
  importe: "Importe Final",
  importeBruto: "Importe Bruto",
  diegoLevy: "Diego Levy",
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  echeq: "E-Cheq",
  observaciones: "Observaciones",
  cbu: "CBU",
  centroCostoXubio: "Centro Xubio",
  parteFactura: "Parte de factura",
};
// Campos internos que cambian solos y no interesan para comparar.
const CAMPOS_PAGO_IGNORAR = new Set(["tc", "restanteAntesPago", "alertaPresupuesto", "motivoError", "pdfFactura", "pdfId", "_sello", "modificado", "modificadoEn"]);

function valorComparable(v) {
  if (v === undefined || v === null || v === "") return "";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "sí" : "";
  if (typeof v === "string") return /^-?\d+(\.\d+)?$/.test(v.trim()) ? String(Number(v)) : v.trim();
  return textoEstable(v);
}
// Diferencias entre dos listas de líneas de Pagos (por id): { agregadas, borradas, cambiadas: [{ antes, ahora, campos: [{campo, antes, ahora}] }] }.
function compararLineasPagos(antes, ahora) {
  const A = new Map((antes || []).filter((l) => l && l.id).map((l) => [String(l.id), l])),
    B = new Map((ahora || []).filter((l) => l && l.id).map((l) => [String(l.id), l])),
    r = { agregadas: [], borradas: [], cambiadas: [] };
  for (const [id, a] of A) {
    const b = B.get(id);
    if (!b) {
      r.borradas.push(a);
      continue;
    }
    const campos = [];
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      if (k === "id" || CAMPOS_PAGO_IGNORAR.has(k)) continue;
      const va = valorComparable(a[k]),
        vb = valorComparable(b[k]);
      va !== vb && campos.push({ campo: k, antes: a[k], ahora: b[k] });
    }
    campos.length && r.cambiadas.push({ antes: a, ahora: b, campos });
  }
  for (const [id, b] of B) A.has(id) || r.agregadas.push(b);
  return r;
}
// Resumen de otras partes de la base: { clave: cantidad de elementos distintos } entre dos objetos de estado.
function resumenCambiosEstado(antes, ahora, ignorar) {
  const r = [],
    claves = new Set([...Object.keys(antes || {}), ...Object.keys(ahora || {})]);
  for (const k of claves) {
    if ((ignorar || []).includes(k)) continue;
    const a = (antes || {})[k],
      b = (ahora || {})[k];
    if (textoEstable(a ?? null) === textoEstable(b ?? null)) continue;
    let detalle = "";
    if (Array.isArray(a) || Array.isArray(b)) {
      const ia = new Map((a || []).map((x, i) => [x && x.id != null ? String(x.id) : "#" + i, textoEstable(x)])),
        ib = new Map((b || []).map((x, i) => [x && x.id != null ? String(x.id) : "#" + i, textoEstable(x)]));
      let ag = 0, bo = 0, ca = 0;
      for (const [id, v] of ia) ib.has(id) ? ib.get(id) !== v && ca++ : bo++;
      for (const id of ib.keys()) ia.has(id) || ag++;
      detalle = [ag && ag + " agregados", bo && bo + " borrados", ca && ca + " cambiados"].filter(Boolean).join(", ");
    } else if (a && b && typeof a === "object" && typeof b === "object") {
      let n = 0;
      for (const kk of new Set([...Object.keys(a), ...Object.keys(b)])) textoEstable(a[kk] ?? null) !== textoEstable(b[kk] ?? null) && n++;
      detalle = n + " valores distintos";
    }
    r.push({ clave: k, detalle: detalle || "cambió" });
  }
  return r.sort((x, y) => x.clave.localeCompare(y.clave));
}
// Lee un respaldo diario (gzip en base64 partido en partes) y devuelve el JSON.
async function leerRespaldoDiario(db, fecha) {
  const ref = db.collection("respaldosDiarios").doc(fecha),
    meta = await ref.get();
  if (!meta.exists) throw new Error("No está el respaldo del " + fecha);
  const n = Number(meta.data().partes) || 1;
  let b64 = "";
  for (let i = 0; i < n; i++) {
    const p = await ref.collection("partes").doc(String(i)).get();
    b64 += (p.exists && p.data().datos) || "";
  }
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)),
    txt = await new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
  return JSON.parse(txt);
}
// Del respaldo: el estado de la app (app/state + app/st_<clave>) y las facturas.
function estadoDeRespaldo(j) {
  const app = ((j && j.colecciones) || {}).app || {},
    st = { ...(((app.state || {}).datos) || {}) };
  for (const [id, d] of Object.entries(app)) id.startsWith("st_") && (st[id.slice(3)] = ((d || {}).datos || {}).v);
  const facturas = Object.entries(((j && j.colecciones) || {}).facturas || {}).map(([id, d]) => ({ id, ...((d || {}).datos || {}) }));
  return { estado: st, facturas };
}

function CompararRespaldoPanel({ onClose, db, pagos, setPagos }) {
  const [fuentes, setFuentes] = useState(null),
    [elegida, setElegida] = useState(""),
    [cargando, setCargando] = useState(false),
    [error, setError] = useState(""),
    [base, setBase] = useState(null);
  useEffect(() => {
    let fin = false;
    (async () => {
      const l = [];
      try {
        const r = await db.collection("respaldosDiarios").get();
        r.docs.forEach((d) => l.push({ id: "r:" + d.id, tipo: "respaldo", fecha: d.id, creado: d.data().creado, texto: "Respaldo diario del " + d.id.split("-").reverse().join("/") + " (" + (d.data().creado ? new Date(d.data().creado).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Argentina/Buenos_Aires" }) : "") + " hs)" }));
      } catch {}
      try {
        const h = await db.collection("historial").get();
        h.docs.forEach((d) => l.push({ id: "h:" + d.id, tipo: "historial", fecha: d.id, creado: Date.parse((d.data() || {}).exportadoEl || "") || 0, texto: "Foto del Historial del " + d.id.split("-").reverse().join("/") + " (primera apertura del día)" }));
      } catch {}
      l.sort((a, b) => (b.fecha + b.tipo).localeCompare(a.fecha + a.tipo));
      fin || setFuentes(l);
    })();
    return () => {
      fin = true;
    };
  }, [db]);
  async function cargar(id) {
    setElegida(id);
    setBase(null);
    setError("");
    if (!id) return;
    setCargando(true);
    try {
      const f = fuentes.find((x) => x.id === id);
      if (f.tipo === "respaldo") {
        const j = await leerRespaldoDiario(db, f.fecha),
          { estado, facturas } = estadoDeRespaldo(j);
        // Lo actual, leído de la base con el mismo formato que el respaldo (para comparar todo lo demás).
        const appAhora = {};
        (await db.collection("app").get()).docs.forEach((d) => (appAhora[d.id] = { datos: d.data() }));
        const factAhora = {};
        (await db.collection("facturas").get()).docs.forEach((d) => (factAhora[d.id] = { datos: d.data() }));
        const ahora = estadoDeRespaldo({ colecciones: { app: appAhora, facturas: factAhora } });
        setBase({ fuente: f, pagos: estado.pagosSemanales || [], estado, facturas, estadoAhora: ahora.estado, facturasAhora: ahora.facturas });
      } else {
        const d = (await db.collection("historial").doc(f.fecha).get()).data() || {};
        setBase({ fuente: f, pagos: d.pagosSemanales || [], estado: null, facturas: d.facturas || null });
      }
    } catch (e) {
      setError("No se pudo leer: " + ((e && e.message) || e));
    }
    setCargando(false);
  }
  const dif = useMemo(() => (base ? compararLineasPagos(base.pagos, pagos) : null), [base, pagos]),
    otros = useMemo(() => {
      if (!base || !base.estado || !base.estadoAhora) return null;
      const r = resumenCambiosEstado(base.estado, base.estadoAhora, ["pagosSemanales", "registros", "presencia", "version", "actualizado", "sello"]);
      if (base.facturas && base.facturasAhora) {
        const d = compararLineasPagos(base.facturas, base.facturasAhora),
          n = d.agregadas.length + d.borradas.length + d.cambiadas.length;
        n && r.push({ clave: "facturas (Facturación)", detalle: [d.agregadas.length && d.agregadas.length + " agregadas", d.borradas.length && d.borradas.length + " borradas", d.cambiadas.length && d.cambiadas.length + " cambiadas"].filter(Boolean).join(", ") });
      }
      return r;
    }, [base]);
  const conf = (txt) => window.confirm(txt);
  const quien = (l) => [l.proveedorPago || l.proveedor || "(sin proveedor)", l.factura ? "FC " + l.factura : "", l.subObra || l.centroCosto || ""].filter(Boolean).join(" · ");
  const mostrar = (k, v) => {
    if (v === undefined || v === null || v === "") return "—";
    if (typeof v === "boolean") return v ? "Sí" : "No";
    if (["importe", "importeBruto", "diegoLevy", "efectivo", "transferencia", "echeq"].includes(k) && !isNaN(Number(v))) return fmt(Number(v));
    return typeof v === "object" ? textoEstable(v) : String(v);
  };
  const restaurarLinea = (antes) => setPagos((ls) => (ls.some((x) => String(x.id) === String(antes.id)) ? ls.map((x) => (String(x.id) === String(antes.id) ? { ...antes } : x)) : [...ls, { ...antes }]));
  const quitarLinea = (l) => setPagos((ls) => ls.filter((x) => String(x.id) !== String(l.id)));
  const restaurarTodo = () => {
    if (!base) return;
    if (!conf("¿Dejar TODOS los Pagos exactamente como estaban en " + base.fuente.texto + "?\n\nSe deshacen también los cambios buenos hechos después de esa hora.")) return;
    setPagos(base.pagos.map((x) => ({ ...x })));
  };
  const caja = { border: "1px solid " + BORDER, borderRadius: 10, marginTop: 12, overflow: "hidden" },
    tit = { padding: "8px 12px", background: "#EFEDE7", fontWeight: 700, fontSize: 12.5, color: NAVY, display: "flex", justifyContent: "space-between", alignItems: "center" },
    fila = { padding: "7px 12px", borderTop: "1px solid " + BORDER, fontSize: 12, display: "flex", gap: 10, alignItems: "flex-start" },
    btn = { ...smallBtnGhost, padding: "3px 9px", fontSize: 11.5, whiteSpace: "nowrap" };
  const nTotal = dif ? dif.agregadas.length + dif.borradas.length + dif.cambiadas.length : 0;
  return React.createElement(
    "div",
    { style: { position: "fixed", inset: 0, background: "rgba(20,20,20,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70 } },
    React.createElement(
      "div",
      { style: { background: "#fff", borderRadius: 14, width: "min(1100px, 96vw)", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: CARD_SHADOW } },
      React.createElement(
        "div",
        { style: { padding: "14px 18px", borderBottom: "1px solid " + BORDER, display: "flex", justifyContent: "space-between", alignItems: "center" } },
        React.createElement("div", { style: { fontWeight: 700, color: NAVY, fontSize: 15 } }, "Comparar Pagos con un respaldo"),
        React.createElement("button", { onClick: onClose, style: { border: "none", background: "none", cursor: "pointer", color: MUTED } }, React.createElement(X, { size: 18 })),
      ),
      React.createElement(
        "div",
        { style: { padding: "12px 18px", overflowY: "auto" } },
        React.createElement(
          "div",
          { style: { fontSize: 12, color: MUTED, marginBottom: 8 } },
          "Elegí un respaldo: MIA muestra qué líneas de Pagos se agregaron, se borraron o cambiaron desde ese momento hasta ahora, y deja volver atrás cada una (o todo). Debajo, qué otras partes de la base cambiaron.",
        ),
        fuentes == null
          ? React.createElement("div", { style: { fontSize: 12.5 } }, "Buscando respaldos…")
          : React.createElement(
              "select",
              { value: elegida, onChange: (e) => cargar(e.target.value), style: { ...selectStyle, minWidth: 380 } },
              React.createElement("option", { value: "" }, fuentes.length ? "Elegí un respaldo…" : "No hay respaldos disponibles"),
              fuentes.map((f) => React.createElement("option", { key: f.id, value: f.id }, f.texto)),
            ),
        cargando && React.createElement("div", { style: { fontSize: 12.5, marginTop: 10 } }, "Leyendo el respaldo…"),
        error && React.createElement("div", { style: { fontSize: 12.5, marginTop: 10, color: RED } }, error),
        dif &&
          React.createElement(
            React.Fragment,
            null,
            React.createElement(
              "div",
              { style: { marginTop: 12, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", fontSize: 12.5 } },
              nTotal === 0
                ? React.createElement("b", { style: { color: GREEN } }, "✓ Pagos está igual que en ese respaldo.")
                : React.createElement(
                    "span",
                    null,
                    React.createElement("b", null, "Desde ese respaldo: "),
                    dif.cambiadas.length + " líneas cambiadas · " + dif.borradas.length + " borradas · " + dif.agregadas.length + " agregadas",
                  ),
              nTotal > 0 && React.createElement("button", { onClick: restaurarTodo, style: { ...smallBtnGhost, color: RED, borderColor: RED } }, "Volver TODO Pagos a ese respaldo"),
            ),
            dif.cambiadas.length > 0 &&
              React.createElement(
                "div",
                { style: caja },
                React.createElement("div", { style: tit }, "Líneas cambiadas (" + dif.cambiadas.length + ")"),
                dif.cambiadas.map((c) =>
                  React.createElement(
                    "div",
                    { key: c.antes.id, style: fila },
                    React.createElement(
                      "div",
                      { style: { flex: 1 } },
                      React.createElement("div", { style: { fontWeight: 700 } }, quien(c.ahora)),
                      c.campos.map((x) =>
                        React.createElement(
                          "div",
                          { key: x.campo, style: { color: MUTED } },
                          (CAMPOS_PAGO[x.campo] || x.campo) + ": ",
                          React.createElement("span", { style: { color: GREEN } }, mostrar(x.campo, x.antes)),
                          " → ",
                          React.createElement("span", { style: { color: RED } }, mostrar(x.campo, x.ahora)),
                        ),
                      ),
                    ),
                    React.createElement("button", { onClick: () => conf("¿Volver esta línea a como estaba en el respaldo?") && restaurarLinea(c.antes), style: btn }, "↶ Volver a como estaba"),
                  ),
                ),
              ),
            dif.borradas.length > 0 &&
              React.createElement(
                "div",
                { style: caja },
                React.createElement("div", { style: tit }, "Líneas que estaban y ya no están (" + dif.borradas.length + ")"),
                dif.borradas.map((l) =>
                  React.createElement(
                    "div",
                    { key: l.id, style: fila },
                    React.createElement(
                      "div",
                      { style: { flex: 1 } },
                      React.createElement("b", null, quien(l)),
                      React.createElement("span", { style: { color: MUTED } }, " · " + fmt(Number(l.importe) || 0) + (l.fechaPagado ? " · pagada " + l.fechaPagado : "")),
                    ),
                    React.createElement("button", { onClick: () => restaurarLinea(l), style: btn }, "↶ Volver a agregarla"),
                  ),
                ),
              ),
            dif.agregadas.length > 0 &&
              React.createElement(
                "div",
                { style: caja },
                React.createElement("div", { style: tit }, "Líneas nuevas desde ese respaldo (" + dif.agregadas.length + ")"),
                dif.agregadas.map((l) =>
                  React.createElement(
                    "div",
                    { key: l.id, style: fila },
                    React.createElement(
                      "div",
                      { style: { flex: 1 } },
                      React.createElement("b", null, quien(l)),
                      React.createElement("span", { style: { color: MUTED } }, " · " + fmt(Number(l.importe) || 0)),
                    ),
                    React.createElement("button", { onClick: () => conf("¿Borrar esta línea nueva?") && quitarLinea(l), style: btn }, "Borrar"),
                  ),
                ),
              ),
            otros &&
              React.createElement(
                "div",
                { style: caja },
                React.createElement("div", { style: tit }, "Otras partes de la base que cambiaron desde ese respaldo"),
                otros.length === 0
                  ? React.createElement("div", { style: fila }, React.createElement("b", { style: { color: GREEN } }, "✓ Nada más cambió."))
                  : otros.map((o) => React.createElement("div", { key: o.clave, style: fila }, React.createElement("b", { style: { minWidth: 220 } }, o.clave), React.createElement("span", { style: { color: MUTED } }, o.detalle))),
              ),
            base && !base.estado && React.createElement("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 10 } }, "La foto del Historial guarda solo Obras, Facturación, Pagos y Cashflow: para ver el resto de la base, elegí un respaldo diario."),
          ),
      ),
    ),
  );
}
