function limpiarNumero(n) {
  const d = String(n ?? ""),
    c = d.trim().startsWith("-"),
    p = d.replace(/-/g, ""),
    g = p.lastIndexOf(",");
  let C;
  if (g === -1) C = p.replace(/[^0-9]/g, "");
  else {
    const S = p.slice(0, g).replace(/[^0-9]/g, ""),
      f = p
        .slice(g + 1)
        .replace(/[^0-9]/g, "")
        .slice(0, 2);
    C = S + "." + f;
  }
  return (c ? "-" : "") + C;
}
function conSeparadorMiles(n) {
  const d = String(n ?? ""),
    c = d.trim().startsWith("-"),
    p = d.replace(/-/g, ""),
    g = p.indexOf(".");
  let C = (g === -1 ? p : p.slice(0, g)).replace(/[^0-9]/g, ""),
    S = g === -1 ? "" : p.slice(g + 1).replace(/[^0-9]/g, "");
  if (S.length > 2) {
    const F = Math.round(+((C || "0") + "." + S) * 100) / 100,
      [A, k] = F.toFixed(2).split(".");
    ((C = A), (S = k));
  } else S = S.slice(0, 2);
  if (!C && !S) return c ? "-" : "";
  const f = (C || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (c ? "-" : "") + f + (S ? "," + S : g !== -1 ? "," : "");
}
function MilesInput({
  value: n,
  onChange: d,
  onFocus: c,
  onBlur: p,
  onPaste: g,
  style: C,
  className: S,
  placeholder: f,
  disabled: F,
  title: A,
  hint: k,
}) {
  const L = useRef(null),
    [oe, ve] = useState(false);
  function P(ye) {
    const Z = ye.target,
      Ye = Z.selectionStart ?? Z.value.length,
      ee = (Z.value.slice(0, Ye).match(/-|[0-9]/g) || []).length,
      lt = Z.value[Ye - 1] === ",";
    (d(limpiarNumero(Z.value)),
      requestAnimationFrame(() => {
        const ne = L.current;
        if (!ne) return;
        const Be = ne.value;
        if (lt) {
          const nt = Be.indexOf(",");
          if (nt !== -1) {
            const H = nt + 1;
            ne.setSelectionRange(H, H);
            return;
          }
        }
        let Le = 0,
          Lt = Be.length;
        for (let nt = 0; nt < Be.length; nt++)
          if ((/-|[0-9]/.test(Be[nt]) && Le++, Le === ee)) {
            Lt = nt + 1;
            break;
          }
        (ee === 0 && (Lt = 0), ne.setSelectionRange(Lt, Lt));
      }));
  }
  const { width: M, ...Pe } = C || {};
  return React.createElement(
    "span",
    { style: { position: "relative", display: "inline-block", width: M ?? "auto", verticalAlign: "top" } },
    React.createElement("input", {
      ref: L,
      type: "text",
      inputMode: "decimal",
      className: S,
      style: { ...Pe, width: "100%" },
      placeholder: f,
      title: A,
      value: conSeparadorMiles(n),
      onChange: P,
      onFocus: (ye) => {
        (ve(true), ye.target.select(), c && c(ye));
      },
      onBlur: (ye) => {
        (ve(false), p && p(ye));
      },
      onPaste: g,
      disabled: F,
    }),
    k &&
      oe &&
      React.createElement(
        "span",
        {
          style: {
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 4,
            background: NAVY,
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 8px",
            borderRadius: 5,
            whiteSpace: "nowrap",
            zIndex: 30,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          },
        },
        k,
      ),
  );
}
const aUsd = (n, d) => {
    const c = Number(d) > 0 ? Number(d) : monedaState.tipoCambio || 0;
    return c ? (Number(n) || 0) / c : 0;
  },
  fmtUsdRaw = (n) => {
    if (n == null || isNaN(n)) return "—";
    const d = n < 0,
      c = Math.round(Math.abs(n)).toLocaleString("en-US");
    return (d ? "-US$" : "US$") + c;
  },
  fmtSmart = (n, d) => (monedaState.moneda === "USD" ? fmtUsdRaw(d) : fmt(n)),
  pctSmart = (n, d) => pct(monedaState.moneda === "USD" ? d : n),
  pctMkSmart = (n, d) => pctMk(monedaState.moneda === "USD" ? d : n),
  valSmart = (n, d) => (monedaState.moneda === "USD" ? d : n),
  SEED_CATALOGO_PROVEEDORES = [
    "ALL INK",
    "BARUGEL",
    "CAPOMASI VIDRIO ROTO",
    "CASAS",
    "CHECK CLIMATIZACION",
    "CMD MUDANZAS GUARADADO",
    "DESMONTE",
    "DONATO + ESTIMACIÓN+ ZOCALO ACERO",
    "EJECUCIÓN DE PLANOS Y PRESENTACIÓN A SHOPPING",
    "ELECTRICA MAIPU",
    "EUROLAMP",
    "FLETES",
    "FUMAGALLI",
    "IMAK",
    "LIMPIEZA DE OBRA EN EJECUCIÓN",
    "MATAFUEGO",
    "MATERIALES",
    "MUEBLES VARIOS",
    "PABLO MORH",
    "PALAVECINO",
    "PROVISION Y ARMADO DE ESCRITORIO + SILLA",
    "PROVISIÓN DE 4 PARLANTES DE EMBUTIR",
    "PROVISIÓN DE HELADERA / FRIGOBAR",
    "PROVISIÓN DE MICROONDAS",
    "PROVISIÓN Y ARMADO DE ESTANTERIAS TIPO RACK DE 90*42*200, RE",
    "RUBEN",
    "SEGUROS - ACCIDENTES PERSONALES",
    "SEGUROS - RESP CIVIL",
    "SUPERVISIÓN DE OBRA",
    "TEODORU",
    "UNAMA",
    "VOLQUETES",
  ],
  ADMIN_PIN = "4237",
  COMERCIAL_PIN = "1234",
  obraKey = (n, d) => n + "|" + d,
  subCostoKey = (n, d) => n + "::subCosto::" + d;
function nuevoSubCostoId() {
  return "sc" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
const CLIENTE_GASTOS_INTERNOS = "INTERNO",
  RUBROS_GASTOS_INTERNOS = [
    "ALQUILER",
    "SUELDOS",
    "HONORARIOS",
    "MKT",
    "EXPENSAS",
    "CONTADORES",
    "FINANCIERO",
    "DANIEL",
    "VARIOS",
  ];
function parseFechaMesAnio(n) {
  if (!n) return null;
  const d = n.split("/");
  if (d.length !== 3) return null;
  const c = parseInt(d[1], 10),
    p = parseInt(d[2], 10);
  return isNaN(c) || isNaN(p) || c < 1 || c > 12 ? null : { mesIdx: c - 1, anio: p };
}
const tcParaAnioHistorico = (n) => (n === 2025 ? 1264 : 1450),
  pagadoDeProveedor = (n, d) => (n || []).filter((c) => c.proveedor === d).reduce((c, p) => c + (p.monto || 0), 0),
  pagadoUSDDeProveedor = (n, d) =>
    (n || []).filter((c) => c.proveedor === d).reduce((c, p) => c + aUsd(p.monto, p.tc), 0),
  presupuestoEfectivo = (n, d) => Math.max(n || 0, d || 0);
function consolidarProveedores(n) {
  const d = [];
  return (
    n.forEach((c) => {
      const p = d.find((g) => g.proveedor === c.proveedor);
      p
        ? ((p.presupuestoOriginal = (p.presupuestoOriginal || 0) + (c.presupuestoOriginal || 0)),
          (p.presupuesto = (p.presupuesto || 0) + (c.presupuesto || 0)),
          c.tc && (p.tc = c.tc))
        : d.push({ ...c });
    }),
    d
  );
}
function normalizarFecha(n) {
  if (!n) return n;
  const d = String(n).trim(),
    c = (g) => String(g).padStart(2, "0");
  let p = d.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (p) return c(p[3]) + "/" + c(p[2]) + "/" + p[1];
  if (((p = d.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/)), p)) {
    let g = p[3];
    return (g.length === 2 && (g = (Number(g) < 50 ? "20" : "19") + g), c(p[1]) + "/" + c(p[2]) + "/" + g);
  }
  if (((p = d.match(/^(\d{2})(\d{2})(\d{2})$/)), p)) {
    const g = (Number(p[3]) < 50 ? "20" : "19") + p[3];
    return p[1] + "/" + p[2] + "/" + g;
  }
  return ((p = d.match(/^(\d{2})(\d{2})(\d{4})$/)), p ? p[1] + "/" + p[2] + "/" + p[3] : d);
}
function normalizeNombreSubobra(n) {
  return (n || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\b(WU|LOS|LAS|LA|EL|DE|DEL|Y)\b/g, " ")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();
}
function nombresSubobraCoinciden(n, d) {
  const c = normalizeNombreSubobra(n),
    p = normalizeNombreSubobra(d);
  return !c || !p ? false : c === p || c.includes(p) || p.includes(c);
}
function ordenCompraIncluye(n, d) {
  const c = (d || "").trim().toUpperCase();
  return c
    ? (n || "")
        .split(",")
        .map((p) => p.trim().toUpperCase())
        .filter(Boolean)
        .includes(c)
    : false;
}
function montosPorOCDe(n) {
  return n.montosPorOC ? n.montosPorOC : n.venta ? { __heredado__: n.venta } : {};
}
function conMontoDeOC(n, d, c) {
  const p = { ...montosPorOCDe(n) };
  p[d] = c;
  const g = Object.values(p).reduce((f, F) => f + (Number(F) || 0), 0),
    C = (n.ordenCompra || "")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean),
    S = C.some((f) => f.toUpperCase() === d.toUpperCase()) ? C : [...C, d];
  return { ...n, montosPorOC: p, venta: g, ordenCompra: S.join(", ") };
}
function sinMontoDeOC(n, d) {
  const c = { ...montosPorOCDe(n) },
    p = (d || "").trim().toUpperCase();
  let g = false;
  Object.keys(c).forEach((f) => {
    f.toUpperCase() === p && (delete c[f], (g = true));
  });
  const C = (n.ordenCompra || "")
    .split(",")
    .map((f) => f.trim())
    .filter((f) => f && f.toUpperCase() !== p);
  if (!g) return { ...n, ordenCompra: C.join(", ") };
  const S = Object.values(c).reduce((f, F) => f + (Number(F) || 0), 0);
  return { ...n, montosPorOC: c, venta: S, ordenCompra: C.join(", ") };
}
function normOC(n) {
  return String(n || "")
    .replace(/\s+/g, "")
    .toUpperCase();
}
function adicionalesPorOC(subObras, ocsExistentes) {
  const existentes = new Set((ocsExistentes || []).map(normOC).filter(Boolean)),
    r = {};
  return (
    (subObras || []).forEach((sc) =>
      (sc.adicionales || []).forEach((a) => {
        const k = normOC(a.concepto);
        if (!k || (!existentes.has(k) && !/^\d{6,}$/.test(k))) return;
        const g = r[k] || (r[k] = { oc: k, monto: 0, montoUSD: 0, subObras: [], existente: existentes.has(k) });
        ((g.monto += Number(a.monto) || 0),
          (g.montoUSD += aUsd(a.monto, a.tc)),
          g.subObras.includes(sc.nombre) || g.subObras.push(sc.nombre));
      }),
    ),
    r
  );
}
function montoDeSubCostoParaOC(n, d) {
  if (!n.montosPorOC) return n.venta || 0;
  const c = (d || "").trim().toUpperCase();
  return Object.entries(n.montosPorOC).reduce((p, [g, C]) => (g.toUpperCase() === c ? p + (Number(C) || 0) : p), 0);
}
async function extraerOrdenDeCompraDePdf(n) {
  if (!window.pdfjsLib) throw new Error("No se pudo cargar el lector de PDF (pdf.js).");
  const d = await n.arrayBuffer(),
    c = await window.pdfjsLib.getDocument({ data: d }).promise;
  let p = [];
  for (let g = 1; g <= c.numPages; g++) {
    const f = (await (await c.getPage(g)).getTextContent()).items
      .map((F) => (F.str || "").trim())
      .filter((F) => F.length > 0);
    if (((p = p.concat(f)), f.some((F) => /^total\b/i.test(F)))) break;
  }
  return parseOrdenDeCompraItems(p);
}
const MESES_EN_ABREV = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};
function fechaPedidoWuADdMmAaaa(n) {
  const d = String(n || "")
    .trim()
    .match(/^(\d{2})-([A-Z]{3})-(\d{2})$/i);
  if (!d) return "";
  const c = MESES_EN_ABREV[d[2].toUpperCase()];
  return c ? d[1] + "/" + c + "/20" + d[3] : "";
}
function parseOrdenDeCompraItems(n) {
  let d = "";
  const c = n.findIndex((P) => /pedido de compra/i.test(P));
  if (c >= 0) {
    for (let P = c + 1; P < Math.min(n.length, c + 6); P++)
      if (/^\d{6,}$/.test(n[P])) {
        d = n[P];
        break;
      }
  }
  let p = "";
  const g = n.findIndex((P) => /FECHA DEL PEDIDO/i.test(P));
  if (g >= 0) {
    for (let P = g + 1; P < Math.min(n.length, g + 10); P++)
      if (/^\d{2}-[A-Z]{3}-\d{2}$/i.test(n[P])) {
        p = fechaPedidoWuADdMmAaaa(n[P]);
        break;
      }
  }
  let C = null;
  const S = n.findIndex((P) => /^total\b/i.test(P));
  if (S >= 0)
    for (let P = S; P < Math.min(n.length, S + 6); P++) {
      const M = n[P].match(/([\d]{1,3}(?:,\d{3})+\.\d{2})/);
      if (M) {
        C = parseFloat(M[1].replace(/,/g, ""));
        break;
      }
    }
  const f = n.findIndex((P) => /SOLICITANTE/i.test(P)),
    F = n.findIndex((P) => /no incluye impuestos/i.test(P)),
    A = F >= 0 ? F : n.length,
    k = [];
  let L = 1;
  for (let P = f >= 0 ? f + 1 : 0; P < A; P++) n[P] === String(L) && (k.push(P), L++);
  const oe = [];
  for (let P = 0; P < k.length; P++) {
    const M = k[P] + 1,
      Pe = P + 1 < k.length ? k[P + 1] : A,
      ye = n.slice(M, Pe),
      Z = ye
        .filter((ne) => !/^[\d.,]+$/.test(ne) && !/^\d{2}-[A-Z]{3}-\d{2}$/i.test(ne))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    let Ye = 0;
    for (const ne of ye) {
      const Be = ne.match(/^([\d]{1,3}(?:,\d{3})+\.\d{2})$/);
      if (Be) {
        Ye = parseFloat(Be[1].replace(/,/g, ""));
        break;
      }
    }
    const ee = Z.match(/C\.?\s?S\.?\s+(.+?)\s*(?:\||-\s*(?:CAPEX|OPEX)\b|\bCOA\b)/i),
      lt = ee ? ee[1].replace(/\s+/g, " ").trim() : "";
    oe.push({ descripcion: Z, monto: Ye, nombreExtraido: lt });
  }
  const ve = oe.reduce((P, M) => P + M.monto, 0);
  return { ocNumero: d, total: C, fechaPedido: p, lineas: oe, sumaLineas: ve };
}
function fechaConGuiones(n) {
  return n && String(n).replace(/\//g, "-");
}
function fechaEsValida(n) {
  if (!n) return false;
  const d = String(n).split("/");
  if (d.length !== 3) return false;
  const c = parseInt(d[1], 10),
    p = parseInt(d[2], 10);
  return !isNaN(c) && !isNaN(p) && c >= 1 && c <= 12;
}
function anioDeFecha(n) {
  const d = String(n || "").split("/");
  if (d.length !== 3) return null;
  const c = parseInt(d[2], 10);
  return isNaN(c) ? null : c;
}
function mesIdxDeFecha(n) {
  const d = String(n || "").split("/");
  if (d.length !== 3) return null;
  const c = parseInt(d[1], 10);
  return isNaN(c) ? null : c - 1;
}
function capitalizar(n) {
  return n && n.charAt(0) + n.slice(1).toLowerCase();
}
const MESES_FISCAL_CORTO = ["JUL", "AGO", "SEP", "OCT", "NOV", "DIC", "ENE", "FEB", "MAR", "ABR", "MAY", "JUN"];
function clavesEjercicioFiscal(n) {
  const d = [];
  for (let c = 0; c < 12; c++) {
    const p = (6 + c) % 12,
      g = p >= 6 ? n : n + 1;
    d.push(g + "-" + String(p + 1).padStart(2, "0"));
  }
  return d;
}
function etiquetaEjercicioFiscal(n) {
  return n + "/" + (n + 1);
}
function anioInicioEjercicioDeFecha(n) {
  const d = n.getFullYear();
  return n.getMonth() >= 6 ? d : d - 1;
}
const SEED_EERR = {
  "2025-07": 6142692,
  "2025-08": 128730507,
  "2025-09": 141112325,
  "2025-10": -62868765,
  "2025-11": 64029230,
  "2025-12": 78194730,
  "2026-01": -125793681,
  "2026-02": -136723600,
  "2026-03": -126633337,
  "2026-04": 111594220,
  "2026-05": -216477146,
  "2026-06": 10572077,
  "2026-07": -127913134,
};
function fechaAObjetoDate(n) {
  if (!n) return null;
  const d = n.split("/");
  if (d.length !== 3) return null;
  const c = parseInt(d[0], 10),
    p = parseInt(d[1], 10),
    g = parseInt(d[2], 10);
  return isNaN(c) || isNaN(p) || isNaN(g) ? null : new Date(g, p - 1, c);
}
function dateAFechaStr(n) {
  return String(n.getDate()).padStart(2, "0") + "/" + String(n.getMonth() + 1).padStart(2, "0") + "/" + n.getFullYear();
}
function fechaHoyArgentinaDDMMAAAA() {
  const n = /* @__PURE__ */ new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  return normalizarFecha(n);
}
function numeroSemanaISO(n) {
  const d = new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate())),
    c = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - c);
  const p = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - p) / 864e5 + 1) / 7);
}
function valorOrdenPago(l, key) {
  if (key === "fechaPagado") {
    const d = fechaAObjetoDate(String(l.fechaPagado || "").replace(/-/g, "/"));
    return d ? d.getTime() : null;
  }
  if (key === "proveedorPago") return (l.proveedorPago || l.proveedor || "").trim().toUpperCase() || null;
  if (key === "mo" || key === "mat" || key === "facturaA") return l[key] ? 1 : 0;
  if (["importe", "importeBruto", "diegoLevy", "efectivo", "transferencia", "echeq"].includes(key)) {
    const v = l[key];
    if (v === "" || v == null) return null;
    const n = Number(v);
    return isNaN(n) ? null : n;
  }
  return (l[key] ?? "").toString().trim().toUpperCase() || null;
}
function compararOrdenPago(a, b, ord) {
  const x = valorOrdenPago(a, ord.key),
    y = valorOrdenPago(b, ord.key);
  if (x == null && y == null) return 0;
  if (x == null) return 1;
  if (y == null) return -1;
  const c = typeof x == "number" && typeof y == "number" ? x - y : String(x).localeCompare(String(y), "es", { numeric: true });
  return ord.dir === "asc" ? c : -c;
}
