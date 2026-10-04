function ProveedoresComparacion({ nombres: n, rows: d, buscar: c, onQuitar: p, onLimpiar: g }) {
  const C = c.trim().toLowerCase();
  return React.createElement(
    "div",
    { style: { marginBottom: 16 } },
    React.createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" } },
      React.createElement(
        "div",
        { style: { fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: NAVY } },
        "Comparando ",
        n.length,
        " proveedores",
      ),
      React.createElement("button", { onClick: g, style: smallBtnGhost }, "Ver todos los proveedores"),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6, alignItems: "flex-start" } },
      n.map((S) => {
        const f = d.filter(
            (k) => k.proveedor === S && (!C || k.cliente.toLowerCase().includes(C) || k.obra.toLowerCase().includes(C)),
          ),
          F = f.reduce((k, L) => k + L.presupuesto, 0),
          A = f.reduce((k, L) => k + L.presupuestoUSD, 0);
        return React.createElement(
          "div",
          {
            key: S,
            style: {
              minWidth: 260,
              maxWidth: 300,
              flex: "1 0 260px",
              background: "#fff",
              borderRadius: 12,
              border: "1px solid " + BORDER,
              boxShadow: CARD_SHADOW,
              overflow: "hidden",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                background: "#F1E9D2",
                borderBottom: "1px solid " + BORDER,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  fontWeight: 700,
                  color: NAVY,
                  fontSize: 13,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              },
              S,
            ),
            React.createElement(
              "button",
              {
                onClick: () => p(S),
                title: "Quitar de la comparación",
                style: {
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: MUTED,
                  fontSize: 14,
                  flexShrink: 0,
                  marginLeft: 8,
                },
              },
              "✕",
            ),
          ),
          React.createElement(
            "div",
            { style: { maxHeight: 420, overflowY: "auto" } },
            f.map((k, L) =>
              React.createElement(
                "div",
                {
                  key: L,
                  style: {
                    padding: "8px 14px",
                    fontSize: 12,
                    borderBottom: "1px solid " + BORDER,
                    background: L % 2 === 0 ? "#fff" : "#F5F4F0",
                  },
                },
                React.createElement("div", { style: { fontWeight: 600 } }, k.cliente),
                React.createElement("div", { style: { color: MUTED, marginTop: 1 } }, k.obra),
                React.createElement(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 } },
                  React.createElement(StatusBadge, { status: k.status }),
                  React.createElement(
                    "span",
                    { style: { fontWeight: 600 } },
                    fmtSmart(k.presupuesto, k.presupuestoUSD),
                  ),
                ),
              ),
            ),
            f.length === 0 &&
              React.createElement(
                "div",
                { style: { padding: 14, fontSize: 12, color: MUTED } },
                "Sin obras que coincidan.",
              ),
          ),
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "9px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                color: NAVY,
                background: "#F1E9D2",
                borderTop: "1px solid " + BORDER,
              },
            },
            React.createElement("span", null, "TOTAL"),
            React.createElement("span", null, fmtSmart(F, A)),
          ),
        );
      }),
    ),
  );
}
function ProveedoresView({
  proveedoresMap: n,
  pagosMap: d,
  obras: c,
  costoSubobrasMap: p,
  subCostoProveedoresMap: g,
  subCostoPagosMap: C,
  onRename: S,
  onImportPagos: f,
  onReintentarPago: F,
  canEdit: A,
}) {
  const [k, L] = useState([]),
    oe = k.length === 1 ? k[0] : null;
  function ve(v) {
    L((E) => (E.includes(v) ? E.filter((K) => K !== v) : [...E, v]));
  }
  const [P, M] = useState(null),
    [Pe, ye] = useState(null),
    [Z, Ye] = useState(null),
    [ee, lt] = useState(""),
    [ne, Be] = useState(""),
    [Le, Lt] = useState(false),
    [nt, H] = useState(null),
    [Ee, Nt] = useState([]),
    [qt, po] = useState(false),
    [oo, Eo] = useState(false),
    Oo = useMemo(() => {
      const v = new Set((c || []).map((E) => E.anio || /* @__PURE__ */ new Date().getFullYear()));
      return Array.from(v).sort((E, K) => K - E);
    }, [c]),
    [Bo, w] = useState(() => Oo[0] || /* @__PURE__ */ new Date().getFullYear()),
    [Ne, Re] = useState("TODO");
  function at(v, E, K) {
    Nt((de) => de.map((Bt, Ft) => (Ft !== v ? Bt : { ...Bt, [E]: K })));
  }
  function dt(v) {
    Nt((E) => {
      const K = E[v];
      if (!K) return E;
      const de = {
          ...K,
          cliente: (K.cliente || "").toUpperCase().trim(),
          obra: (K.obra || "").toUpperCase().trim(),
          proveedor: (K.proveedor || "").toUpperCase().trim(),
          subObra: (K.subObra || "").toUpperCase().trim(),
          importe: Number(K.importe) || 0,
        },
        Bt = F(de);
      return Bt.ok ? E.filter((Ft, Xe) => Xe !== v) : E.map((Ft, Xe) => (Xe !== v ? Ft : { ...de, motivo: Bt.motivo }));
    });
  }
  function Gt(v) {
    Nt((E) => E.filter((K, de) => de !== v));
  }
  const vt = useMemo(() => {
      const v = {},
        E = {},
        K = {},
        de = {};
      (c || []).forEach((Xe) => {
        const rt = obraKey(Xe.cliente, Xe.obra);
        ((v[rt] = Xe.status),
          (E[rt] = Xe.costoFinal),
          (K[rt] = Xe.costoFinalUSD),
          (de[rt] = (Xe.cliente !== "WU" && Number(Xe.m2)) || 0));
      });
      const Bt = [];
      Object.entries(n).forEach(([Xe, rt]) => {
        const [Ct, kt] = Xe.split("|"),
          Oe = d[Xe] || [],
          jt = E[Xe] || 0,
          q = K[Xe] || 0,
          Ae = de[Xe] || 0;
        rt.forEach((Ve) => {
          if ((Ve.proveedor || "").trim().toUpperCase() === "MZ LATAM") return;
          const bo = Oe.filter((it) => it.proveedor === Ve.proveedor),
            l = bo.reduce((it, pt) => it + pt.monto, 0),
            I = bo.reduce((it, pt) => it + aUsd(pt.monto, pt.tc), 0),
            U = presupuestoEfectivo(Ve.presupuesto, l),
            ce = Math.max(aUsd(Ve.presupuesto, Ve.tc), I),
            me = aUsd(Ve.presupuestoOriginal, Ve.tc),
            ge = (U || 0) - (Ve.presupuestoOriginal || 0),
            Ke = ce - me,
            Y = Ve.presupuestoOriginal ? (ge / Ve.presupuestoOriginal) * 100 : 0,
            se = me ? (Ke / me) * 100 : 0,
            be = jt ? (U / jt) * 100 : 0,
            Ue = q ? (ce / q) * 100 : 0;
          Bt.push({
            proveedor: Ve.proveedor,
            cliente: Ct,
            obra: kt,
            k: Xe,
            presupuestoOriginal: Ve.presupuestoOriginal,
            presupuestoOriginalUSD: me,
            presupuesto: U,
            presupuestoUSD: ce,
            pagado: l,
            pagadoUSD: I,
            resta: U - l,
            restaUSD: ce - I,
            desvio: ge,
            desvioUSD: Ke,
            desvioPct: Y,
            desvioPctUSD: se,
            share: be,
            shareUSD: Ue,
            status: v[Xe] || null,
            m2: Ae || null,
            precioM2: Ae > 0 ? U / Ae : null,
          });
        });
      });
      const Ft = "::subCosto::";
      return (
        Object.entries(g || {}).forEach(([Xe, rt]) => {
          const Ct = Xe.indexOf(Ft);
          if (Ct < 0) return;
          const kt = Xe.slice(0, Ct),
            Oe = Number(Xe.slice(Ct + Ft.length)),
            [jt, q] = kt.split("|"),
            Ae = ((p[kt] || [])[Oe] || {}).nombre || "SUB OBRA",
            Ve = ((p[kt] || [])[Oe] || {}).status || "EN PROCESO",
            bo = q + " · " + Ae,
            l = (C || {})[Xe] || [],
            I = E[kt] || 0,
            U = K[kt] || 0;
          rt.forEach((ce) => {
            if ((ce.proveedor || "").trim().toUpperCase() === "MZ LATAM") return;
            const me = l.filter((Kt) => Kt.proveedor === ce.proveedor),
              ge = me.reduce((Kt, ae) => Kt + ae.monto, 0),
              Ke = me.reduce((Kt, ae) => Kt + aUsd(ae.monto, ae.tc), 0),
              Y = presupuestoEfectivo(ce.presupuesto, ge),
              se = Math.max(aUsd(ce.presupuesto, ce.tc), Ke),
              be = aUsd(ce.presupuestoOriginal, ce.tc),
              Ue = (Y || 0) - (ce.presupuestoOriginal || 0),
              it = se - be,
              pt = ce.presupuestoOriginal ? (Ue / ce.presupuestoOriginal) * 100 : 0,
              Io = be ? (it / be) * 100 : 0,
              Ot = I ? (Y / I) * 100 : 0,
              no = U ? (se / U) * 100 : 0;
            Bt.push({
              proveedor: ce.proveedor,
              cliente: jt,
              obra: bo,
              k: Xe,
              presupuestoOriginal: ce.presupuestoOriginal,
              presupuestoOriginalUSD: be,
              presupuesto: Y,
              presupuestoUSD: se,
              pagado: ge,
              pagadoUSD: Ke,
              resta: Y - ge,
              restaUSD: se - Ke,
              desvio: Ue,
              desvioUSD: it,
              desvioPct: pt,
              desvioPctUSD: Io,
              share: Ot,
              shareUSD: no,
              status: Ve,
              m2: null,
              precioM2: null,
            });
          });
        }),
        Bt
      );
    }, [n, d, c, p, g, C]),
    y = useMemo(() => {
      const v = {};
      return (
        vt.forEach((E) => {
          (v[E.proveedor] ||
            (v[E.proveedor] = {
              presupuesto: 0,
              presupuestoUSD: 0,
              presupuestoOriginal: 0,
              presupuestoOriginalUSD: 0,
              shareSum: 0,
              shareSumUSD: 0,
              shareCount: 0,
            }),
            (v[E.proveedor].presupuesto += E.presupuesto),
            (v[E.proveedor].presupuestoUSD += E.presupuestoUSD),
            (v[E.proveedor].presupuestoOriginal += E.presupuestoOriginal || 0),
            (v[E.proveedor].presupuestoOriginalUSD += E.presupuestoOriginalUSD || 0),
            (v[E.proveedor].shareSum += E.share || 0),
            (v[E.proveedor].shareSumUSD += E.shareUSD || 0),
            (v[E.proveedor].shareCount += 1));
        }),
        Object.entries(v)
          .map(([E, K]) => ({
            name: E,
            value: K.presupuesto,
            valueUSD: K.presupuestoUSD,
            desvioPct: K.presupuestoOriginal
              ? ((K.presupuesto - K.presupuestoOriginal) / K.presupuestoOriginal) * 100
              : 0,
            desvioPctUSD: K.presupuestoOriginalUSD
              ? ((K.presupuestoUSD - K.presupuestoOriginalUSD) / K.presupuestoOriginalUSD) * 100
              : 0,
            shareProm: K.shareCount ? K.shareSum / K.shareCount : 0,
            sharePromUSD: K.shareCount ? K.shareSumUSD / K.shareCount : 0,
          }))
          .sort((E, K) => K.value - E.value)
      );
    }, [vt]),
    G = y.reduce((v, E) => v + E.value, 0),
    te = y.reduce((v, E) => v + E.valueUSD, 0),
    V = y.map((v, E) => ({ ...v, colorIndex: E })),
    ut = Math.ceil(V.length / 2),
    At = V.slice(0, ut),
    go = V.slice(ut),
    No = useMemo(() => {
      const v = ne.trim().toLowerCase();
      if (!v) return [];
      const E = /* @__PURE__ */ new Set(),
        K = [];
      return (
        y.forEach((de) => {
          de.name.toLowerCase().includes(v) &&
            !E.has(de.name) &&
            (E.add(de.name), K.push({ proveedor: de.name, contexto: null }));
        }),
        vt.forEach((de) => {
          E.has(de.proveedor) ||
            ((de.cliente.toLowerCase().includes(v) || de.obra.toLowerCase().includes(v)) &&
              (E.add(de.proveedor), K.push({ proveedor: de.proveedor, contexto: de.cliente + " · " + de.obra })));
        }),
        K.slice(0, 8)
      );
    }, [ne, y, vt]),
    Jt = (oe ? vt.filter((v) => v.proveedor === oe) : vt).filter((v) => {
      const E = ne.trim().toLowerCase();
      return E ? v.proveedor.toLowerCase().includes(E) || v.cliente.toLowerCase().includes(E) : true;
    }),
    ht = useMemo(
      () =>
        Pe
          ? [...Jt].sort((v, E) => {
              let K = v[Pe.key],
                de = E[Pe.key];
              return (
                typeof K == "string" && (K = K.toLowerCase()),
                typeof de == "string" && (de = de.toLowerCase()),
                K < de ? (Pe.dir === "asc" ? -1 : 1) : K > de ? (Pe.dir === "asc" ? 1 : -1) : 0
              );
            })
          : Jt,
      [Jt, Pe],
    );
  function St(v) {
    ye((E) => ({ key: v, dir: E && E.key === v && E.dir === "asc" ? "desc" : "asc" }));
  }
  const zt = { table: Pe };
  function gn() {
    const v = ht.map((de) => ({
        Proveedor: de.proveedor,
        Cliente: de.cliente,
        "Centro de Costo": de.obra,
        Estado: de.status === "FINALIZADA" ? "Finalizada" : de.status === "EN PROCESO" ? "En proceso" : "",
        "Presupuesto Original": de.presupuestoOriginal,
        "Presupuesto Real": de.presupuesto,
        Pagado: de.pagado,
        Saldo: de.resta,
        "$/M2": de.precioM2 != null ? Number(de.precioM2.toFixed(2)) : "",
        "Desvío %": Number(de.desvioPct.toFixed(1)),
        "Share Obra %": Number(de.share.toFixed(1)),
      })),
      E = XLSX.utils.json_to_sheet(v),
      K = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(K, E, "Proveedores"), descargarLibroXlsx(K, "proveedores.xlsx"));
  }
  function bn(v, E) {
    const K = [];
    Object.entries(d).forEach(([rt, Ct]) => {
      const [kt, Oe] = rt.split("|");
      (Ct || []).forEach((jt) => {
        const q = parseFechaMesAnio(jt.fecha);
        !q ||
          q.anio !== v ||
          (E !== null && q.mesIdx !== E) ||
          K.push({
            Cliente: kt,
            "Centro de Costo": Oe,
            "Sub Obra": "",
            Proveedor: jt.proveedor,
            Importe: jt.monto,
            Factura: jt.fc,
            Fecha: jt.fecha,
            Observaciones: jt.observaciones || "",
          });
      });
    });
    const de = "::subCosto::";
    (Object.entries(C || {}).forEach(([rt, Ct]) => {
      const kt = rt.indexOf(de);
      if (kt < 0) return;
      const Oe = rt.slice(0, kt),
        jt = Number(rt.slice(kt + de.length)),
        [q, Ae] = Oe.split("|"),
        Ve = ((p[Oe] || [])[jt] || {}).nombre || "";
      (Ct || []).forEach((bo) => {
        const l = parseFechaMesAnio(bo.fecha);
        !l ||
          l.anio !== v ||
          (E !== null && l.mesIdx !== E) ||
          K.push({
            Cliente: q,
            "Centro de Costo": Ae,
            "Sub Obra": Ve,
            Proveedor: bo.proveedor,
            Importe: bo.monto,
            Factura: bo.fc,
            Fecha: bo.fecha,
            Observaciones: bo.observaciones || "",
          });
      });
    }),
      K.sort(
        (rt, Ct) => rt.Cliente.localeCompare(Ct.Cliente) || rt["Centro de Costo"].localeCompare(Ct["Centro de Costo"]),
      ));
    const Bt = XLSX.utils.json_to_sheet(K),
      Ft = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(Ft, Bt, "Pagos");
    const Xe = E === null ? "todo_el_anio" : MESES[E].toLowerCase();
    descargarLibroXlsx(Ft, "pagos_proveedores_" + v + "_" + Xe + ".xlsx");
  }
  const sn = A
      ? React.createElement(
          "div",
          {
            style: {
              background: "#fff",
              borderRadius: 12,
              border: "1px solid " + BORDER,
              boxShadow: CARD_SHADOW,
              padding: "16px 20px",
              marginBottom: 16,
            },
          },
          React.createElement(
            "div",
            { style: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 } },
            "Carga masiva de pagos",
          ),
          React.createElement(
            "div",
            { style: { fontSize: 12, color: MUTED, marginBottom: 10 } },
            "Subí un Excel con columnas Fecha, Cliente, Centro de Costo, Sub Obra, Proveedor, Factura, Importe, Observaciones. Cada fila se suma a lo pagado del proveedor en la obra que corresponda (solo si ese proveedor ya está cargado ahí) y resta del saldo. La columna Sub Obra es opcional: solo aplica para WU (para cargar el pago dentro de esa sub obra de Costos); para el resto de los clientes dejala vacía y no afecta su carga.",
          ),
          React.createElement(
            "div",
            { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },
            React.createElement(
              "label",
              { style: smallBtnPrimary },
              React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
              " Importar pagos (Excel)",
              React.createElement("input", {
                type: "file",
                accept: ".xlsx,.xls,.csv",
                style: { display: "none" },
                onChange: async (v) => {
                  const E = v.target.files[0];
                  if (E) {
                    try {
                      const K = await E.arrayBuffer(),
                        de = XLSX.read(K, { type: "array" }),
                        Bt = de.Sheets[de.SheetNames[0]],
                        Ft = XLSX.utils.sheet_to_json(Bt, { defval: null }),
                        Xe = (q, Ae) => {
                          for (const Ve of Object.keys(q))
                            if (Ae.includes(Ve.toString().trim().toLowerCase())) return q[Ve];
                          return null;
                        },
                        rt = Ft.map((q) => {
                          const Ae = String(Xe(q, ["cliente"]) || "")
                              .toUpperCase()
                              .trim(),
                            Ve = String(Xe(q, ["centro de costo", "obra"]) || "")
                              .toUpperCase()
                              .trim(),
                            bo = String(Xe(q, ["proveedor"]) || "")
                              .toUpperCase()
                              .trim(),
                            l = Number(Xe(q, ["importe", "monto"])) || 0;
                          let I = Xe(q, ["fecha"]);
                          if (typeof I == "number" && XLSX.SSF) {
                            const ge = XLSX.SSF.parse_date_code(I);
                            I = ge
                              ? String(ge.d).padStart(2, "0") + "/" + String(ge.m).padStart(2, "0") + "/" + ge.y
                              : String(I);
                          }
                          const U = String(Xe(q, ["factura", "n° factura", "nro factura", "fc"]) ?? "—"),
                            ce = String(Xe(q, ["sub obra", "sub-obra", "subobra"]) || "")
                              .toUpperCase()
                              .trim(),
                            me = String(Xe(q, ["observaciones"]) || "");
                          return {
                            cliente: Ae,
                            obra: Ve,
                            proveedor: bo,
                            importe: l,
                            fecha: I ? String(I) : "—",
                            factura: U,
                            subObra: ce,
                            observaciones: me,
                          };
                        }),
                        Ct = rt
                          .filter((q) => !(q.cliente && q.obra && q.proveedor && q.importe))
                          .map((q) => ({
                            ...q,
                            motivo: "Faltan datos obligatorios (Cliente, Centro de Costo, Proveedor o Importe)",
                          })),
                        kt = rt.filter((q) => q.cliente && q.obra && q.proveedor && q.importe),
                        Oe = f(kt),
                        jt = [...Ct, ...Oe.fallidos];
                      (H(
                        Oe.aplicadosCount +
                          " pago(s) aplicados" +
                          (jt.length > 0 ? ", " + jt.length + " para revisar" : ""),
                      ),
                        jt.length > 0 && (Nt(jt), po(true)));
                    } catch {
                      H("No se pudo leer el archivo.");
                    }
                    v.target.value = "";
                  }
                },
              }),
            ),
            React.createElement(
              "button",
              {
                onClick: () => {
                  const v = XLSX.utils.aoa_to_sheet([
                      [
                        "Fecha",
                        "Cliente",
                        "Centro de Costo",
                        "Sub Obra",
                        "Proveedor",
                        "Factura",
                        "Importe",
                        "Observaciones",
                      ],
                      ["07/09/2026", "PANDORA", "UNICENTER", "", "CASAS", "1234", 1e5, ""],
                      ["07/09/2026", "WU", "WU CIVIL WORK", "PLAZA ITALIAS", "CASAS", "1234", 1e5, ""],
                    ]),
                    E = XLSX.utils.book_new();
                  (XLSX.utils.book_append_sheet(E, v, "Pagos"), descargarLibroXlsx(E, "plantilla_pagos.xlsx"));
                },
                style: { ...smallBtnGhost, color: MUTED },
              },
              "Plantilla de ejemplo",
            ),
            React.createElement(
              "button",
              { onClick: () => Eo((v) => !v), style: { ...smallBtnGhost, color: MUTED } },
              React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
              " Descargar pagos a proveedores",
            ),
          ),
          oo &&
            React.createElement(
              "div",
              {
                style: {
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                  marginTop: 10,
                  padding: 10,
                  background: BG,
                  borderRadius: 8,
                },
              },
              React.createElement(
                "div",
                null,
                React.createElement("label", { style: labelStyle }, "Año"),
                React.createElement(
                  "select",
                  { style: selectStyle, value: Bo, onChange: (v) => w(Number(v.target.value)) },
                  Oo.map((v) => React.createElement("option", { key: v, value: v }, v)),
                ),
              ),
              React.createElement(
                "div",
                null,
                React.createElement("label", { style: labelStyle }, "Período"),
                React.createElement(
                  "select",
                  { style: selectStyle, value: Ne, onChange: (v) => Re(v.target.value) },
                  React.createElement("option", { value: "TODO" }, "Total año"),
                  MESES.map((v, E) =>
                    React.createElement("option", { key: v, value: E }, v.charAt(0) + v.slice(1).toLowerCase()),
                  ),
                ),
              ),
              React.createElement(
                "button",
                {
                  onClick: () => {
                    (bn(Bo, Ne === "TODO" ? null : Number(Ne)), Eo(false));
                  },
                  style: smallBtnPrimary,
                },
                React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
                " Descargar",
              ),
            ),
          nt &&
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 10, marginTop: 8 } },
              React.createElement("div", { style: { fontSize: 11.5, color: MUTED } }, nt),
              Ee.length > 0 &&
                React.createElement(
                  "button",
                  {
                    onClick: () => po(true),
                    style: { ...smallBtnGhost, color: RED, padding: "4px 10px", fontSize: 11 },
                  },
                  "Revisar ",
                  Ee.length,
                  " pendiente",
                  Ee.length === 1 ? "" : "s",
                ),
            ),
        )
      : null,
    fo =
      qt &&
      React.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            background: "rgba(20,20,20,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 70,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              background: "#fff",
              borderRadius: 12,
              width: "82%",
              maxWidth: 980,
              height: "82%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            },
          },
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 18px",
                borderBottom: "1px solid " + BORDER,
              },
            },
            React.createElement(
              "div",
              { style: { fontWeight: 700, color: NAVY, fontSize: 14 } },
              "Pagos para revisar ",
              Ee.length > 0 ? "(" + Ee.length + ")" : "",
            ),
            React.createElement(
              "button",
              {
                onClick: () => po(false),
                style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
              },
              React.createElement(X, { size: 18 }),
            ),
          ),
          React.createElement(
            "div",
            { style: { padding: "10px 18px", fontSize: 12, color: MUTED, borderBottom: "1px solid " + BORDER } },
            'Estas filas no se pudieron cargar. Corregí los datos y apretá "Reintentar" para cada una, o "Descartar" si no la vas a cargar.',
          ),
          React.createElement(
            "div",
            { style: { flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 } },
            Ee.length === 0 &&
              React.createElement(
                "div",
                { style: { fontSize: 13, color: MUTED, textAlign: "center", marginTop: 20 } },
                "No quedan pagos pendientes de revisión.",
              ),
            Ee.map((v, E) => {
              const K = (v.cliente || "").trim().toUpperCase(),
                de = K ? c.filter((q) => (q.cliente || "").trim().toUpperCase() === K) : [],
                Bt = de.some((q) => q.obra === v.obra),
                Ft = obraKey(v.cliente, v.obra),
                Xe = (v.subObra || "").trim().toUpperCase();
              let rt = false,
                Ct = [];
              if (Bt)
                if (Xe) {
                  const q = p[Ft] || [],
                    Ae = q.findIndex((Ve) => (Ve.nombre || "").trim().toUpperCase() === Xe);
                  Ae >= 0 && ((rt = true), (Ct = g[subCostoKey(Ft, q[Ae].id)] || []));
                } else ((rt = true), (Ct = n[Ft] || []));
              const kt = (v.proveedor || "").trim().toUpperCase(),
                Oe = kt && Ct.some((q) => q.proveedor === kt),
                jt = rt && kt && !Oe;
              return React.createElement(
                "div",
                {
                  key: E,
                  style: { border: "1px solid " + BORDER, borderRadius: 10, padding: 14, background: "#F9F8F5" },
                },
                React.createElement(
                  "div",
                  { style: { fontSize: 11.5, color: RED, fontWeight: 600, marginBottom: 10 } },
                  v.motivo,
                ),
                React.createElement(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "1.2fr 1.2fr 1.2fr 0.9fr 0.8fr 0.8fr 1fr",
                      columnGap: 8,
                      rowGap: 4,
                      fontSize: 11.5,
                    },
                  },
                  React.createElement("div", { style: { color: MUTED } }, "Cliente"),
                  React.createElement("div", { style: { color: MUTED } }, "Centro de Costo"),
                  React.createElement("div", { style: { color: MUTED } }, "Proveedor"),
                  React.createElement("div", { style: { color: MUTED } }, "Importe"),
                  React.createElement("div", { style: { color: MUTED } }, "Factura"),
                  React.createElement("div", { style: { color: MUTED } }, "Fecha"),
                  React.createElement("div", { style: { color: MUTED } }, "Sub Obra"),
                  React.createElement("input", {
                    value: v.cliente,
                    onChange: (q) => at(E, "cliente", q.target.value),
                    style: { ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" },
                  }),
                  React.createElement(
                    "select",
                    {
                      value: Bt ? v.obra : "",
                      onChange: (q) => at(E, "obra", q.target.value),
                      style: {
                        ...inputStyle,
                        fontSize: 12,
                        padding: "5px 7px",
                        width: "100%",
                        boxSizing: "border-box",
                      },
                    },
                    React.createElement("option", { value: "" }, v.obra ? v.obra + " (no encontrada)" : "-- Elegir --"),
                    de.map((q) => React.createElement("option", { key: q.obra, value: q.obra }, q.obra)),
                  ),
                  React.createElement("input", {
                    value: v.proveedor,
                    onChange: (q) => at(E, "proveedor", q.target.value),
                    style: { ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" },
                  }),
                  React.createElement("input", {
                    type: "number",
                    value: v.importe,
                    onChange: (q) => at(E, "importe", q.target.value),
                    style: { ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" },
                  }),
                  React.createElement("input", {
                    value: v.factura,
                    onChange: (q) => at(E, "factura", q.target.value),
                    style: { ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" },
                  }),
                  React.createElement("input", {
                    value: v.fecha,
                    onChange: (q) => at(E, "fecha", q.target.value),
                    style: { ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" },
                  }),
                  React.createElement("input", {
                    value: v.subObra,
                    onChange: (q) => at(E, "subObra", q.target.value),
                    placeholder: "(opcional)",
                    style: { ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" },
                  }),
                ),
                jt &&
                  React.createElement(
                    "div",
                    {
                      style: {
                        marginTop: 8,
                        padding: 8,
                        background: "#FBF3DC",
                        border: "1px solid " + GOLD,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      },
                    },
                    React.createElement(
                      "div",
                      { style: { fontSize: 11, color: NAVY, fontWeight: 600 } },
                      '"',
                      v.proveedor,
                      '" no está cargado ahí — se creará al reintentar:',
                    ),
                    React.createElement(
                      "div",
                      { style: { display: "flex", gap: 6, alignItems: "center" } },
                      React.createElement("label", { style: { fontSize: 10.5, color: MUTED } }, "Presup. original"),
                      React.createElement("input", {
                        type: "number",
                        value: v.presupuestoOriginal || "",
                        onChange: (q) => at(E, "presupuestoOriginal", q.target.value),
                        style: { ...inputStyle, fontSize: 12, padding: "5px 7px", width: 110 },
                      }),
                    ),
                    React.createElement(
                      "div",
                      { style: { display: "flex", gap: 6, alignItems: "center" } },
                      React.createElement("label", { style: { fontSize: 10.5, color: MUTED } }, "Presup. real"),
                      React.createElement("input", {
                        type: "number",
                        value: v.presupuestoReal || "",
                        onChange: (q) => at(E, "presupuestoReal", q.target.value),
                        style: { ...inputStyle, fontSize: 12, padding: "5px 7px", width: 110 },
                      }),
                    ),
                  ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 } },
                  React.createElement(
                    "button",
                    { onClick: () => Gt(E), style: { ...smallBtnGhost, color: MUTED } },
                    "Descartar",
                  ),
                  React.createElement("button", { onClick: () => dt(E), style: smallBtnPrimary }, "Reintentar"),
                ),
              );
            }),
          ),
        ),
      );
  return vt.length === 0
    ? React.createElement(
        "div",
        { style: { padding: "22px 28px" } },
        sn,
        fo,
        React.createElement(
          "div",
          {
            style: {
              background: "#fff",
              borderRadius: 12,
              border: "1px solid " + BORDER,
              boxShadow: CARD_SHADOW,
              padding: 24,
              fontSize: 13,
              color: MUTED,
            },
          },
          "Todavía no cargaste proveedores en ninguna obra.",
        ),
      )
    : React.createElement(
        "div",
        { style: { padding: "22px 28px" } },
        sn,
        fo,
        React.createElement(
          "div",
          {
            style: {
              background: "#fff",
              borderRadius: 12,
              border: "1px solid " + BORDER,
              boxShadow: CARD_SHADOW,
              padding: "18px 20px",
              marginBottom: 16,
              display: "flex",
              gap: 24,
              alignItems: "center",
            },
          },
          React.createElement(
            "div",
            { style: { width: 260, height: 240, flexShrink: 0 } },
            React.createElement(
              ResponsiveContainer,
              null,
              React.createElement(
                PieChart,
                null,
                React.createElement(
                  Pie,
                  {
                    data: y,
                    dataKey: monedaState.moneda === "USD" ? "valueUSD" : "value",
                    nameKey: "name",
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 90,
                    onClick: (v) => ve(v.name),
                    style: { cursor: "pointer" },
                  },
                  y.map((v, E) =>
                    React.createElement(Cell, {
                      key: E,
                      fill: PIE_COLORS[E % PIE_COLORS.length],
                      opacity: !P || P === v.name ? 1 : 0.3,
                    }),
                  ),
                ),
                React.createElement(Tooltip, {
                  formatter: (v) => (monedaState.moneda === "USD" ? fmtUsdRaw(v) : fmt(v)),
                }),
              ),
            ),
          ),
          React.createElement(
            "div",
            { style: { flex: 1 } },
            React.createElement(
              "div",
              { style: { fontSize: 11.5, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: 0.3 } },
              "PARTICIPACIÓN COSTOS ACUMULADO TOTAL OBRAS MZ / SHARE ACUMULADO EN SUS OBRAS",
            ),
            React.createElement(
              "div",
              { style: { display: "flex", gap: 18, fontSize: 12.5, maxHeight: 160, overflowY: "auto" } },
              [At, go].map((v, E) =>
                React.createElement(
                  "div",
                  { key: E, style: { display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 } },
                  v.map((K) => {
                    const de = k.includes(K.name),
                      Bt = valSmart(K.value, K.valueUSD),
                      Ft = valSmart(G, te),
                      Xe = valSmart(K.shareProm, K.sharePromUSD),
                      rt = valSmart(K.desvioPct, K.desvioPctUSD);
                    return React.createElement(
                      "div",
                      {
                        key: K.name,
                        onClick: () => ve(K.name),
                        onMouseEnter: () => M(K.name),
                        onMouseLeave: () => M(null),
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          cursor: "pointer",
                          padding: "3px 6px",
                          borderRadius: 6,
                          background: de ? "#F1E9D2" : "transparent",
                        },
                      },
                      React.createElement("span", {
                        style: {
                          width: 10,
                          height: 10,
                          borderRadius: 3,
                          background: PIE_COLORS[K.colorIndex % PIE_COLORS.length],
                          flexShrink: 0,
                        },
                      }),
                      React.createElement(
                        "span",
                        {
                          style: {
                            fontWeight: de ? 700 : 600,
                            color: de ? NAVY : TEXT,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          },
                        },
                        K.name,
                      ),
                      React.createElement(
                        "span",
                        { style: { color: MUTED } },
                        (Ft ? (Bt / Ft) * 100 : 0).toFixed(0),
                        "%",
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { color: MUTED, fontSize: 11 },
                          title:
                            "Promedio de la participación de este proveedor en el costo de cada obra/sub obra en la que trabajó",
                        },
                        "· share prom. ",
                        Xe.toFixed(1),
                        "%",
                      ),
                      React.createElement(
                        "span",
                        { style: { color: rt > 0 ? RED : rt < 0 ? GREEN : MUTED, fontWeight: 600, fontSize: 11 } },
                        "· desvío ",
                        rt >= 0 ? "+" : "",
                        rt.toFixed(1),
                        "%",
                      ),
                    );
                  }),
                ),
              ),
            ),
            React.createElement(
              "div",
              { style: { fontSize: 11, color: MUTED, marginTop: 10 } },
              "Click en un proveedor para ver en qué obras trabajó. Podés seleccionar más de uno para compararlos.",
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              background: "#fff",
              borderRadius: 12,
              border: "1px solid " + BORDER,
              boxShadow: CARD_SHADOW,
              padding: "16px 20px",
              marginBottom: 16,
            },
          },
          React.createElement(
            "div",
            { style: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 } },
            "Corregir nombre de un proveedor",
          ),
          React.createElement(
            "div",
            { style: { fontSize: 12, color: MUTED, marginBottom: 10 } },
            'Si un proveedor quedó cargado con un nombre distinto por error (ej. "Victoriata" en vez de "Victoria"), corregilo acá: se va a consolidar automáticamente con el nombre correcto en todas las obras.',
          ),
          React.createElement(
            "div",
            { style: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" } },
            React.createElement(ProveedorPicker, {
              value: Z || "",
              options: y.map((v) => v.name),
              placeholder: "Proveedor a corregir...",
              style: { width: 220 },
              onChange: (v) => {
                (Ye(v), lt(""));
              },
            }),
            React.createElement("span", { style: { color: MUTED } }, "→"),
            React.createElement("input", {
              placeholder: "Nombre correcto",
              style: inputStyle,
              value: ee,
              onChange: (v) => lt(v.target.value),
            }),
            React.createElement(
              "button",
              {
                onClick: () => {
                  Z && ee && (S(Z, ee), Ye(null), lt(""), L((v) => v.filter((E) => E !== Z)));
                },
                style: smallBtnPrimary,
              },
              "Consolidar",
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            },
          },
          React.createElement(
            "div",
            { style: { position: "relative", width: 320 } },
            React.createElement("input", {
              placeholder: "Buscar proveedor o cliente para seleccionar...",
              value: ne,
              onChange: (v) => Be(v.target.value),
              onFocus: () => Lt(true),
              onBlur: () => Lt(false),
              style: { ...inputStyle, width: "100%" },
            }),
            Le &&
              No.length > 0 &&
              React.createElement(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    background: "#fff",
                    border: "1px solid " + BORDER,
                    borderRadius: 8,
                    boxShadow: CARD_SHADOW,
                    maxHeight: 260,
                    overflowY: "auto",
                  },
                },
                No.map((v) =>
                  React.createElement(
                    "div",
                    {
                      key: v.proveedor,
                      onMouseDown: (E) => {
                        (E.preventDefault(), ve(v.proveedor), Be(""));
                      },
                      style: {
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontSize: 12.5,
                        borderBottom: "1px solid " + BORDER,
                        background: k.includes(v.proveedor) ? "#F1E9D2" : "#fff",
                      },
                      onMouseEnter: (E) => {
                        k.includes(v.proveedor) || (E.currentTarget.style.background = "#F5F4F0");
                      },
                      onMouseLeave: (E) => {
                        k.includes(v.proveedor) || (E.currentTarget.style.background = "#fff");
                      },
                    },
                    React.createElement(
                      "div",
                      { style: { fontWeight: 600, color: NAVY } },
                      v.proveedor,
                      k.includes(v.proveedor) ? " ✓" : "",
                    ),
                    v.contexto && React.createElement("div", { style: { color: MUTED, fontSize: 11 } }, v.contexto),
                  ),
                ),
              ),
          ),
          React.createElement(
            "button",
            { onClick: gn, style: smallBtnGhost },
            React.createElement(Download, { size: 13 }),
            " Descargar proveedores",
          ),
        ),
        k.length > 1
          ? React.createElement(ProveedoresComparacion, {
              nombres: k,
              rows: vt,
              buscar: ne,
              onQuitar: ve,
              onLimpiar: () => L([]),
            })
          : React.createElement(
              React.Fragment,
              null,
              oe &&
                React.createElement(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } },
                  React.createElement(
                    "div",
                    { style: { fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: NAVY } },
                    oe,
                  ),
                  React.createElement(
                    "button",
                    { onClick: () => L([]), style: smallBtnGhost },
                    "Ver todos los proveedores",
                  ),
                ),
              oe
                ? React.createElement(
                    "div",
                    {
                      style: {
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid " + BORDER,
                        boxShadow: CARD_SHADOW,
                        overflow: "hidden",
                      },
                    },
                    React.createElement(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "1.5fr 1.1fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1fr 1.1fr 0.9fr",
                          columnGap: 10,
                          padding: "10px 16px",
                          fontSize: 11,
                          fontWeight: 700,
                          background: "#EFEDE7",
                          borderBottom: "1px solid " + BORDER,
                        },
                      },
                      React.createElement(SortHeader, {
                        label: "PROVEEDOR",
                        tableId: "table",
                        sortKey: "proveedor",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                      }),
                      React.createElement(SortHeader, {
                        label: "CLIENTE",
                        tableId: "table",
                        sortKey: "cliente",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                      }),
                      React.createElement(SortHeader, {
                        label: "OBRA",
                        tableId: "table",
                        sortKey: "obra",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                      }),
                      React.createElement(SortHeader, {
                        label: "ESTADO",
                        tableId: "table",
                        sortKey: "status",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                      }),
                      React.createElement(SortHeader, {
                        label: "PRESUPUESTO ORIGINAL",
                        tableId: "table",
                        sortKey: "presupuestoOriginal",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                        align: "right",
                      }),
                      React.createElement(SortHeader, {
                        label: "PRESUPUESTO REAL",
                        tableId: "table",
                        sortKey: "presupuesto",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                        align: "right",
                      }),
                      React.createElement(SortHeader, {
                        label: "PAGADO",
                        tableId: "table",
                        sortKey: "pagado",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                        align: "right",
                      }),
                      React.createElement(SortHeader, {
                        label: "SALDO",
                        tableId: "table",
                        sortKey: "resta",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                        align: "right",
                      }),
                      React.createElement(SortHeader, {
                        label: "$/M2",
                        tableId: "table",
                        sortKey: "precioM2",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                        align: "right",
                      }),
                      React.createElement(SortHeader, {
                        label: "DESVÍO",
                        tableId: "table",
                        sortKey: "desvioPct",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                        align: "right",
                      }),
                      React.createElement(SortHeader, {
                        label: "SHARE OBRA",
                        tableId: "table",
                        sortKey: "share",
                        sortState: zt,
                        onSort: (v, E) => St(E),
                        align: "right",
                      }),
                    ),
                    React.createElement(
                      "div",
                      { style: { maxHeight: 520, overflowY: "auto" } },
                      ht.map((v, E) => {
                        const K = valSmart(v.desvioPct, v.desvioPctUSD),
                          de = valSmart(v.share, v.shareUSD);
                        return React.createElement(
                          "div",
                          {
                            key: E,
                            style: {
                              display: "grid",
                              gridTemplateColumns: "1.5fr 1.1fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1fr 1.1fr 0.9fr",
                              columnGap: 10,
                              padding: "9px 16px",
                              fontSize: 12.5,
                              alignItems: "center",
                              background: E % 2 === 0 ? "#fff" : "#F5F4F0",
                              borderBottom: "1px solid " + BORDER,
                            },
                          },
                          React.createElement("div", { style: { fontWeight: 600 } }, v.proveedor),
                          React.createElement("div", null, v.cliente),
                          React.createElement("div", null, v.obra),
                          React.createElement("div", null, React.createElement(StatusBadge, { status: v.status })),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right", color: MUTED } },
                            fmtSmart(v.presupuestoOriginal, v.presupuestoOriginalUSD),
                          ),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right" } },
                            fmtSmart(v.presupuesto, v.presupuestoUSD),
                          ),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right", color: GREEN } },
                            fmtSmart(v.pagado, v.pagadoUSD),
                          ),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right", color: v.resta > 0 ? RED : MUTED, fontWeight: 600 } },
                            fmtSmart(v.resta, v.restaUSD),
                          ),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right", color: MUTED } },
                            v.precioM2 != null ? fmt(v.precioM2) : "—",
                          ),
                          React.createElement(
                            "div",
                            {
                              style: {
                                textAlign: "right",
                                color: v.desvio > 0 ? RED : v.desvio < 0 ? GREEN : MUTED,
                                fontWeight: 600,
                              },
                            },
                            K >= 0 ? "+" : "",
                            K.toFixed(1),
                            "%",
                          ),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right", color: MUTED } },
                            de.toFixed(1),
                            "%",
                          ),
                        );
                      }),
                    ),
                    React.createElement(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "1.5fr 1.1fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1fr 1.1fr 0.9fr",
                          columnGap: 10,
                          padding: "10px 16px",
                          fontSize: 12.5,
                          fontWeight: 700,
                          background: "#F1E9D2",
                          borderTop: "1px solid " + BORDER,
                        },
                      },
                      React.createElement("div", { style: { color: NAVY } }, "TOTAL " + oe),
                      React.createElement("div", null),
                      React.createElement("div", null),
                      React.createElement("div", null),
                      React.createElement(
                        "div",
                        { style: { textAlign: "right", color: MUTED } },
                        fmtSmart(
                          ht.reduce((v, E) => v + E.presupuestoOriginal, 0),
                          ht.reduce((v, E) => v + E.presupuestoOriginalUSD, 0),
                        ),
                      ),
                      React.createElement(
                        "div",
                        { style: { textAlign: "right" } },
                        fmtSmart(
                          ht.reduce((v, E) => v + E.presupuesto, 0),
                          ht.reduce((v, E) => v + E.presupuestoUSD, 0),
                        ),
                      ),
                      React.createElement(
                        "div",
                        { style: { textAlign: "right", color: GREEN } },
                        fmtSmart(
                          ht.reduce((v, E) => v + E.pagado, 0),
                          ht.reduce((v, E) => v + E.pagadoUSD, 0),
                        ),
                      ),
                      React.createElement(
                        "div",
                        { style: { textAlign: "right", color: RED } },
                        fmtSmart(
                          ht.reduce((v, E) => v + E.resta, 0),
                          ht.reduce((v, E) => v + E.restaUSD, 0),
                        ),
                      ),
                      React.createElement(
                        "div",
                        { style: { textAlign: "right", color: NAVY } },
                        (() => {
                          const v = ht.reduce((K, de) => K + (de.m2 || 0), 0),
                            E = ht.reduce((K, de) => K + (de.m2 ? de.presupuesto : 0), 0);
                          return v > 0 ? fmt(E / v) : "—";
                        })(),
                      ),
                      React.createElement(
                        "div",
                        { style: { textAlign: "right", color: NAVY } },
                        (() => {
                          const v = ht.reduce((rt, Ct) => rt + Ct.presupuestoOriginal, 0),
                            E = ht.reduce((rt, Ct) => rt + Ct.desvio, 0),
                            K = ht.reduce((rt, Ct) => rt + Ct.presupuestoOriginalUSD, 0),
                            de = ht.reduce((rt, Ct) => rt + Ct.desvioUSD, 0),
                            Bt = v ? (E / v) * 100 : 0,
                            Ft = K ? (de / K) * 100 : 0,
                            Xe = valSmart(Bt, Ft);
                          return (Xe >= 0 ? "+" : "") + Xe.toFixed(1) + "%";
                        })(),
                      ),
                      React.createElement(
                        "div",
                        { style: { textAlign: "right", color: NAVY } },
                        (() => {
                          const v = ht.length ? ht.reduce((K, de) => K + de.share, 0) / ht.length : 0,
                            E = ht.length ? ht.reduce((K, de) => K + de.shareUSD, 0) / ht.length : 0;
                          return valSmart(v, E).toFixed(1);
                        })(),
                        "% prom.",
                      ),
                    ),
                  )
                : React.createElement(
                    "div",
                    {
                      style: {
                        background: "#fff",
                        borderRadius: 12,
                        border: "1px solid " + BORDER,
                        boxShadow: CARD_SHADOW,
                        padding: 24,
                        fontSize: 13,
                        color: MUTED,
                        textAlign: "center",
                      },
                    },
                    "Seleccioná un proveedor en el gráfico para ver el detalle de sus obras, o más de uno para compararlos.",
                  ),
            ),
      );
}
function ProveedorPicker({ value: n, options: d, onChange: c, placeholder: p, style: g }) {
  const [C, S] = useState(false),
    [f, F] = useState(""),
    A = useRef(null);
  useEffect(() => {
    if (!C) return;
    function oe(ve) {
      A.current && !A.current.contains(ve.target) && S(false);
    }
    return (document.addEventListener("mousedown", oe), () => document.removeEventListener("mousedown", oe));
  }, [C]);
  const k = f.trim().toLowerCase(),
    L = k ? d.filter((oe) => oe.toLowerCase().includes(k)) : d;
  return React.createElement(
    "div",
    { ref: A, style: { position: "relative", ...g } },
    React.createElement("input", {
      style: { ...inputStyle, width: "100%", boxSizing: "border-box" },
      placeholder: p || "Buscar proveedor...",
      value: C ? f : n || "",
      onFocus: () => {
        (S(true), F(""));
      },
      onChange: (oe) => {
        (F(oe.target.value), C || S(true));
      },
    }),
    C &&
      React.createElement(
        "div",
        {
          style: {
            position: "absolute",
            zIndex: 30,
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid " + BORDER,
            borderRadius: 8,
            boxShadow: CARD_SHADOW,
            maxHeight: 220,
            overflowY: "auto",
            marginTop: 2,
          },
        },
        n &&
          React.createElement(
            "div",
            {
              onClick: () => {
                (c(""), S(false));
              },
              style: { padding: "6px 10px", fontSize: 12, color: MUTED, cursor: "pointer" },
            },
            "— Ninguno —",
          ),
        L.length === 0
          ? React.createElement(
              "div",
              { style: { padding: "6px 10px", fontSize: 12, color: MUTED } },
              "Sin resultados.",
            )
          : L.map((oe) =>
              React.createElement(
                "div",
                {
                  key: oe,
                  onClick: () => {
                    (c(oe), S(false));
                  },
                  style: {
                    padding: "6px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                    background: oe === n ? "#F5F4F0" : "transparent",
                  },
                },
                oe,
              ),
            ),
      ),
  );
}
function CascadingSelect({
  value: n,
  options: d,
  onCommit: c,
  disabled: p,
  newLabel: g,
  emptyLabel: C,
  style: S,
  camposExtra: f,
}) {
  const [F, A] = useState(false),
    [k, L] = useState(""),
    [oe, ve] = useState({});
  if (p) return React.createElement("input", { style: S, value: n || "", disabled: true, readOnly: true });
  if (F)
    return !f || f.length === 0
      ? React.createElement("input", {
          style: S,
          autoFocus: true,
          placeholder: "Escribí el valor nuevo",
          defaultValue: n && !d.includes(n) ? n : "",
          onBlur: (M) => {
            const Pe = M.target.value.trim().toUpperCase();
            (A(false), Pe && c(Pe, {}, true));
          },
          onKeyDown: (M) => {
            M.key === "Enter" && M.target.blur();
          },
        })
      : React.createElement(
          "div",
          { style: { position: "relative" } },
          React.createElement(
            "div",
            {
              style: {
                position: "absolute",
                zIndex: 20,
                top: 0,
                left: 0,
                background: "#fff",
                border: "1px solid " + BORDER,
                borderRadius: 8,
                boxShadow: CARD_SHADOW,
                padding: 10,
                width: 210,
              },
            },
            React.createElement("input", {
              style: { ...S, width: "100%", marginBottom: 6, boxSizing: "border-box" },
              autoFocus: true,
              placeholder: "Nombre",
              value: k,
              onChange: (M) => L(M.target.value),
            }),
            f.map((M) =>
              React.createElement(
                "div",
                { key: M.key, style: { marginBottom: 6 } },
                React.createElement(
                  "label",
                  { style: { fontSize: 10, color: MUTED, display: "block", marginBottom: 2 } },
                  M.label,
                ),
                React.createElement(MilesInput, {
                  style: { ...S, width: "100%", boxSizing: "border-box" },
                  value: oe[M.key] || "",
                  onChange: (Pe) => ve((ye) => ({ ...ye, [M.key]: Pe })),
                }),
              ),
            ),
            React.createElement(
              "div",
              { style: { display: "flex", gap: 6, marginTop: 4 } },
              React.createElement(
                "button",
                {
                  onClick: () => {
                    const M = k.trim().toUpperCase();
                    if (!M) {
                      A(false);
                      return;
                    }
                    (c(M, oe, true), A(false), L(""), ve({}));
                  },
                  style: { ...smallBtnPrimary, padding: "4px 10px", fontSize: 11 },
                },
                "Crear",
              ),
              React.createElement(
                "button",
                {
                  onClick: () => {
                    (A(false), L(""), ve({}));
                  },
                  style: { ...smallBtnGhost, padding: "4px 10px", fontSize: 11 },
                },
                "Cancelar",
              ),
            ),
          ),
        );
  const P = n && !d.includes(n) ? [n, ...d] : d;
  return React.createElement(
    "select",
    {
      style: S,
      value: n || "",
      onChange: (M) => {
        if (M.target.value === "__nuevo__") {
          A(true);
          return;
        }
        c(M.target.value, {}, false);
      },
    },
    C !== void 0 && React.createElement("option", { value: "" }, C),
    P.map((M) => React.createElement("option", { key: M, value: M }, M)),
    React.createElement("option", { value: "__nuevo__" }, g),
  );
}
