function useFloatingCfHeader(n) {
  const d = useRef(null),
    c = useRef(null),
    [p, g] = useState({ floating: false, left: 0, width: 0 });
  return (
    useEffect(() => {
      function C() {
        const f = d.current;
        if (!f) return;
        const F = f.getBoundingClientRect(),
          A = F.top < n && F.bottom > n;
        (g((k) => {
          const L = { floating: A, left: F.left, width: f.clientWidth };
          return k.floating === L.floating && k.left === L.left && k.width === L.width ? k : L;
        }),
          c.current && (c.current.scrollLeft = f.scrollLeft));
      }
      (C(), window.addEventListener("scroll", C, true), window.addEventListener("resize", C));
      const S = d.current;
      return (
        S && S.addEventListener("scroll", C),
        () => {
          (window.removeEventListener("scroll", C, true),
            window.removeEventListener("resize", C),
            S && S.removeEventListener("scroll", C));
        }
      );
    }, [n]),
    { scrollRef: d, innerRef: c, floating: p.floating, left: p.left, width: p.width }
  );
}
function esObjetivoInteractivo(n) {
  return !!(n && n.closest && n.closest("input, textarea, select, button, a"));
}
function attachDragScroll(n) {
  if (!n || n.__dragScrollAttached) return;
  n.__dragScrollAttached = true;
  let d = false,
    c = false,
    p = 0,
    g = 0;
  function C(f) {
    if (!d) return;
    const F = f.clientX - p;
    (!c && Math.abs(F) > 4 && ((c = true), (n.style.cursor = "grabbing"), (n.style.userSelect = "none")),
      c && ((n.scrollLeft = g - F), f.preventDefault()));
  }
  function S() {
    ((d = false),
      (c = false),
      (n.style.cursor = ""),
      (n.style.userSelect = ""),
      document.removeEventListener("mousemove", C),
      document.removeEventListener("mouseup", S));
  }
  n.addEventListener("mousedown", (f) => {
    f.button !== 0 ||
      esObjetivoInteractivo(f.target) ||
      ((d = true),
      (c = false),
      (p = f.clientX),
      (g = n.scrollLeft),
      document.addEventListener("mousemove", C),
      document.addEventListener("mouseup", S));
  });
}
const SCROLL_GROUPS = {};
function syncScrollGroup(name, el) {
  if (!el) return;
  const g = SCROLL_GROUPS[name] || (SCROLL_GROUPS[name] = new Set());
  for (const o of [...g]) o.isConnected || g.delete(o);
  if (el.__syncGroup === name && g.has(el)) return;
  const ref = [...g].find((o) => o !== el);
  (g.add(el),
    (el.__syncGroup = name),
    ref && (el.scrollLeft = ref.scrollLeft),
    el.addEventListener("scroll", () => {
      if (el.__esperado != null && Math.abs(el.scrollLeft - el.__esperado) < 1) {
        el.__esperado = null;
        return;
      }
      el.__esperado = null;
      for (const o of g)
        o !== el &&
          o.isConnected &&
          Math.abs(o.scrollLeft - el.scrollLeft) >= 1 &&
          ((o.scrollLeft = el.scrollLeft), (o.__esperado = o.scrollLeft));
    }));
}
function attachDragScrollProxy(n, d) {
  if (!n || n.__dragScrollAttached) return;
  n.__dragScrollAttached = true;
  let c = false,
    p = false,
    g = 0,
    C = 0;
  function S(F) {
    if (!c) return;
    const A = d(),
      k = F.clientX - g;
    (!p && Math.abs(k) > 4 && ((p = true), (n.style.cursor = "grabbing")),
      p && A && ((A.scrollLeft = C - k), F.preventDefault()));
  }
  function f() {
    ((c = false),
      (p = false),
      (n.style.cursor = ""),
      document.removeEventListener("mousemove", S),
      document.removeEventListener("mouseup", f));
  }
  n.addEventListener("mousedown", (F) => {
    if (F.button !== 0) return;
    const A = d();
    A &&
      ((c = true),
      (p = false),
      (g = F.clientX),
      (C = A.scrollLeft),
      document.addEventListener("mousemove", S),
      document.addEventListener("mouseup", f));
  });
}
function EgresoNombreEditable({ nombre, editable, onRename, onDelete }) {
  const [editando, setEditando] = useState(false),
    [valor, setValor] = useState(nombre),
    [error, setError] = useState("");
  const abrir = () => {
      (setValor(nombre), setError(""), setEditando(true));
    },
    cancelar = () => {
      (setEditando(false), setError(""));
    },
    guardar = () => {
      const nuevo = (valor || "").trim().toUpperCase();
      if (!nuevo || nuevo === nombre) return cancelar();
      const err = onRename(nuevo);
      err ? setError(err) : setEditando(false);
    };
  return editando
    ? React.createElement(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: 2, width: "100%" } },
        React.createElement(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 4 } },
          React.createElement("input", {
            autoFocus: true,
            value: valor,
            onChange: (e) => {
              (setValor(e.target.value), setError(""));
            },
            onKeyDown: (e) => {
              e.key === "Enter" ? guardar() : e.key === "Escape" && cancelar();
            },
            style: { ...inputStyle, padding: "3px 6px", fontSize: 12, flex: 1, minWidth: 0, textTransform: "uppercase" },
          }),
          React.createElement(
            "button",
            {
              onClick: guardar,
              title: "Guardar nombre",
              style: { border: "none", background: "none", cursor: "pointer", color: GREEN, fontWeight: 700, fontSize: 13 },
            },
            "✓",
          ),
          React.createElement(
            "button",
            {
              onClick: cancelar,
              title: "Cancelar",
              style: { border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 },
            },
            "✕",
          ),
        ),
        error && React.createElement("div", { style: { fontSize: 10.5, color: RED } }, error),
      )
    : React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "span",
          { title: nombre, style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 } },
          nombre,
        ),
        editable &&
          React.createElement(
            "span",
            { style: { display: "flex", alignItems: "center", gap: 2, flexShrink: 0 } },
            React.createElement(
              "button",
              {
                onClick: abrir,
                title: "Cambiar nombre",
                style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
              },
              React.createElement(Pencil, { size: 11 }),
            ),
            React.createElement(
              "button",
              {
                onClick: onDelete,
                title: "Eliminar categoría",
                style: { border: "none", background: "none", cursor: "pointer", color: RED },
              },
              React.createElement(Trash2, { size: 11 }),
            ),
          ),
      );
}
function CashflowView({
  obras: n,
  facturas: d,
  proveedoresMap: c,
  pagosMap: p,
  canEdit: g,
  costoSubobrasMap: C,
  subCostoProveedoresMap: S,
  subCostoPagosMap: f,
  cfIngresosValores: F,
  setCfIngresosValores: A,
  cfIngresosComentarios: k,
  setCfIngresosComentarios: L,
  cfIngresosCategorias: oe,
  setCfIngresosCategorias: ve,
  cfIngresosCategoriasValores: P,
  setCfIngresosCategoriasValores: M,
  cfIngresosCategoriasComentarios: Pe,
  setCfIngresosCategoriasComentarios: ye,
  cfEgresosCategorias: Z,
  setCfEgresosCategorias: Ye,
  cfEgresosValores: ee,
  setCfEgresosValores: lt,
  cfEgresosComentarios: ne,
  setCfEgresosComentarios: Be,
  cfSalidasValores: Le,
  setCfSalidasValores: Lt,
  cfSaldoInicial: nt,
  setCfSaldoInicial: H,
  cfBancos: Ee,
  setCfBancos: Nt,
  cfSimulacionLineas: qt,
  setCfSimulacionLineas: po,
  cfSemanaInicio: oo,
  setCfSemanaInicio: Eo,
  cfDiasPagoCliente: Oo,
  setCfDiasPagoCliente: Bo,
  cfRegaliasPagadas: regPag = {},
  setCfRegaliasPagadas: setRegPag,
  navBarHeight: w,
  onGoToObra: Ne,
}) {
  const at = { position: "sticky", top: w, zIndex: 2, background: "#fff" },
    dt = { position: "sticky", left: 0, zIndex: 1 },
    Gt = { ...at, left: 0, zIndex: 3 },
    vt = { position: "sticky", left: 260, zIndex: 1 },
    y = { ...vt, background: "#fff", zIndex: 3 },
    G = { background: "#fff", zIndex: 2 },
    te = { ...dt, background: "#fff", zIndex: 3 },
    V = useFloatingCfHeader(w),
    ut = useFloatingCfHeader(w),
    At = useFloatingCfHeader(w),
    go = {
      border: "none",
      outline: "none",
      background: "transparent",
      width: "100%",
      padding: "9px 2px",
      fontFamily: "inherit",
      color: TEXT,
    },
    [No, Jt] = useState(""),
    [ht, St] = useState(""),
    [zt, gn] = useState(null),
    [bn, sn] = useState(null),
    [fo, v] = useState("ingresos"),
    [E, K] = useState({}),
    [de, Bt] = useState(""),
    [Ft, Xe] = useState(""),
    [rt, Ct] = useState(""),
    [kt, Oe] = useState(null),
    [jt, q] = useState("");
  function Ae(s, b) {
    const R = s.id + "|" + b;
    (Oe({ clave: R, titulo: s.cliente + " · " + s.obra + " · Sem. " + semanaLabelCorta(b) }), q(k[R] || ""));
  }
  function Ve() {
    if (!kt) return;
    const s = jt.trim();
    (L((b) => {
      const R = { ...b };
      return (s ? (R[kt.clave] = s) : delete R[kt.clave], R);
    }),
      Oe(null));
  }
  function bo() {
    kt &&
      (L((s) => {
        const b = { ...s };
        return (delete b[kt.clave], b);
      }),
      Oe(null));
  }
  const [l, I] = useState(null),
    [U, ce] = useState("");
  function me(s, b) {
    const R = s + "|" + b;
    (I({ clave: R, titulo: s + " · Sem. " + semanaLabelCorta(b) }), ce(ne[R] || ""));
  }
  function ge() {
    if (!l) return;
    const s = U.trim();
    (Be((b) => {
      const R = { ...b };
      return (s ? (R[l.clave] = s) : delete R[l.clave], R);
    }),
      I(null));
  }
  function Ke() {
    l &&
      (Be((s) => {
        const b = { ...s };
        return (delete b[l.clave], b);
      }),
      I(null));
  }
  const [Y, se] = useState(null),
    [be, Ue] = useState("");
  function it(s, b) {
    const R = s + "|" + b;
    (se({ clave: R, titulo: s + " · Sem. " + semanaLabelCorta(b) }), Ue(Pe[R] || ""));
  }
  function pt() {
    if (!Y) return;
    const s = be.trim();
    (ye((b) => {
      const R = { ...b };
      return (s ? (R[Y.clave] = s) : delete R[Y.clave], R);
    }),
      se(null));
  }
  function Io() {
    Y &&
      (ye((s) => {
        const b = { ...s };
        return (delete b[Y.clave], b);
      }),
      se(null));
  }
  const [Ot, no] = useState(false),
    Kt = useRef(Array.from({ length: 5 }, () => React.createRef())).current,
    ae = useMemo(() => generarSemanas(oo, 26), [oo]),
    regMap = useMemo(() => regaliasPorSemana(d, ae), [d, ae]),
    Qt = useMemo(() => {
      const s = fechaAObjetoDate(fechaHoyArgentinaDDMMAAAA());
      return d
        .filter((b) => b.status === "ADEUDA")
        .map((b) => {
          const R = normalizarFecha(b.fecha),
            j = fechaAObjetoDate(R),
            Q = j && s ? Math.round((s - j) / 864e5) : null;
          return {
            id: "f" + b.id,
            tipo: "Facturado (adeuda)",
            cliente: b.cliente,
            obra: b.obra,
            concepto: b.concepto || "FACTURA",
            nro: b.nro,
            fecha: R,
            importe: b.importe || 0,
            diasDesdeEmision: Q,
          };
        });
    }, [d]),
    lo = useMemo(
      () =>
        n
          .map((s) => {
            const b = d
                .filter((j) => j.cliente === s.cliente && j.obra === s.obra)
                .reduce((j, Q) => j + (Q.importe || 0), 0),
              R = s.ventaFinal - b;
            return { o: s, pendiente: R };
          })
          .filter((s) => s.pendiente > 1)
          .map(({ o: s, pendiente: b }) => ({
            id: "pf|" + s.cliente + "|" + s.obra,
            tipo: "Pendiente de facturar",
            cliente: s.cliente,
            obra: s.obra,
            obraFinalizada: s.status === "FINALIZADA",
            concepto: "PENDIENTE DE FACTURAR",
            nro: null,
            fecha: null,
            importe: b,
          })),
      [n, d],
    ),
    Wt = useMemo(() => [...Qt, ...lo], [Qt, lo]),
    tn = useMemo(() => Array.from(new Set(Wt.map((s) => s.cliente))).sort(), [Wt]);
  function Lo() {
    const s = { ...F };
    let b = 0;
    const R = viernesDeLaSemana(/* @__PURE__ */ new Date());
    (Qt.forEach((j) => {
      if (Object.keys(F).some((It) => It.indexOf(j.id + "|") === 0 && Number(F[It]) > 0)) return;
      const J = fechaAObjetoDate(j.fecha);
      if (!J) return;
      const fe = Number(Oo[j.cliente]) || 30,
        ke = new Date(J);
      ke.setDate(ke.getDate() + fe);
      let We = viernesDeLaSemana(ke);
      We < R && (We = R);
      const wt = dateAFechaStr(We);
      ((s[j.id + "|" + wt] = j.importe), b++);
    }),
      lo.forEach((j) => {
        if (Object.keys(F).some((fe) => fe.indexOf(j.id + "|") === 0 && Number(F[fe]) > 0)) return;
        const J = j.importe / 3;
        ([30, 40, 50].forEach((fe) => {
          const ke = /* @__PURE__ */ new Date();
          ke.setDate(ke.getDate() + fe);
          let We = viernesDeLaSemana(ke);
          We < R && (We = R);
          const wt = dateAFechaStr(We);
          s[j.id + "|" + wt] = (Number(s[j.id + "|" + wt]) || 0) + J;
        }),
          b++);
      }),
      A(s),
      gn(b + " ítem(s) completado(s) automáticamente (los que ya tenían algo cargado a mano no se tocaron)."));
  }
  const B = useMemo(() => {
      const s = [];
      Object.entries(c).forEach(([R, j]) => {
        const [Q, J] = R.split("|"),
          fe = p[R] || [];
        j.forEach((ke) => {
          const We = fe.filter((It) => It.proveedor === ke.proveedor).reduce((It, et) => It + et.monto, 0),
            wt = (ke.presupuesto || 0) - We;
          wt > 1 &&
            s.push({
              id: R + "|" + ke.proveedor,
              ccId: "cc|" + R,
              cliente: Q,
              obra: J,
              proveedor: ke.proveedor,
              saldo: wt,
            });
        });
      });
      const b = "::subCosto::";
      return (
        Object.entries(S || {}).forEach(([R, j]) => {
          const Q = R.indexOf(b);
          if (Q < 0) return;
          const J = R.slice(0, Q),
            fe = Number(R.slice(Q + b.length)),
            [ke, We] = J.split("|"),
            wt = ((C[J] || [])[fe] || {}).nombre || "SUB OBRA",
            It = We + " · " + wt,
            et = (f || {})[R] || [];
          j.forEach((gt) => {
            const Ut = et.filter((Tt) => Tt.proveedor === gt.proveedor).reduce((Tt, ue) => Tt + ue.monto, 0),
              Yt = (gt.presupuesto || 0) - Ut;
            Yt > 1 &&
              s.push({
                id: R + "|" + gt.proveedor,
                ccId: "cc|" + R,
                cliente: ke,
                obra: It,
                proveedor: gt.proveedor,
                saldo: Yt,
              });
          });
        }),
        n.forEach((R) => {
          if (R.cliente !== "WU" || !(R.mzLatamVirtualSaldo > 1)) return;
          const j = obraKey(R.cliente, R.obra);
          s.push({
            id: j + "|MZ LATAM (estimado)",
            ccId: "cc|" + j,
            cliente: R.cliente,
            obra: R.obra,
            proveedor: "MZ LATAM (estimado)",
            saldo: R.mzLatamVirtualSaldo,
            esVirtualMzLatam: true,
          });
        }),
        s
      );
    }, [c, p, S, f, C, n]),
    re = useMemo(() => {
      const s = {};
      return (
        B.forEach((b) => {
          (s[b.ccId] || (s[b.ccId] = { ccId: b.ccId, cliente: b.cliente, obra: b.obra, saldo: 0, proveedores: [] }),
            (s[b.ccId].saldo += b.saldo),
            s[b.ccId].proveedores.push(b));
        }),
        Object.values(s).sort((b, R) => R.saldo - b.saldo)
      );
    }, [B]),
    ot = useMemo(() => {
      const s = de.trim().toLowerCase();
      return s
        ? Wt.filter(
            (b) =>
              (b.cliente || "").toLowerCase().includes(s) ||
              (b.obra || "").toLowerCase().includes(s) ||
              (b.tipo || "").toLowerCase().includes(s),
          )
        : Wt;
    }, [Wt, de]),
    Ht = useMemo(() => {
      const s = Ft.trim().toLowerCase();
      return s ? Z.filter((b) => b.toLowerCase().includes(s)) : Z;
    }, [Z, Ft]),
    $t = useMemo(() => {
      const s = rt.trim().toLowerCase();
      return s
        ? re.filter(
            (b) =>
              (b.cliente || "").toLowerCase().includes(s) ||
              (b.obra || "").toLowerCase().includes(s) ||
              b.proveedores.some((R) => (R.proveedor || "").toLowerCase().includes(s)),
          )
        : re;
    }, [re, rt]),
    eo = useMemo(
      () =>
        ae.map((s) => {
          const b = Wt.reduce((ke, We) => ke + (Number(F[We.id + "|" + s]) || 0), 0),
            R = oe.reduce((ke, We) => ke + (Number(P[We + "|" + s]) || 0), 0),
            j = b + R,
            Q = Z.reduce((ke, We) => ke + (Number(ee[We + "|" + s]) || 0), 0),
            J = re.reduce((ke, We) => ke + Do(We, s), 0),
            fe = Q + J + regaliaPendiente(regMap, regPag, s);
          return { semana: s, ingresos: j, egresos: fe, neto: j - fe };
        }),
      [ae, Wt, F, oe, P, Z, ee, re, Le, regMap, regPag],
    ),
    vo = useMemo(() => {
      let s = Number(nt) || 0;
      return eo.map((b) => ((s += b.neto), s));
    }, [eo, nt]),
    qo = useMemo(() => Ee.reduce((s, b) => s + (Number(b.acuerdo) || 0), 0), [Ee]),
    ao = useMemo(() => Ee.reduce((s, b) => s + (Number(b.utilizado) || 0), 0), [Ee]),
    Fo = useMemo(() => qo - ao, [qo, ao]);
  function zo() {
    Nt((s) => [
      ...s,
      {
        id: "banco_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        nombre: "",
        acuerdo: "",
        utilizado: "",
      },
    ]);
  }
  function Ho(s, b, R) {
    Nt((j) => j.map((Q) => (Q.id === s ? { ...Q, [b]: R } : Q)));
  }
  function nn(s) {
    Nt((b) => b.filter((R) => R.id !== s));
  }
  const [Zt, Uo] = useState(false);
  function pn() {
    (po((s) => [
      ...s,
      { id: "sim_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7), nombre: "", valores: {} },
    ]),
      Uo(true));
  }
  function yn(s, b) {
    po((R) => R.map((j) => (j.id === s ? { ...j, nombre: b } : j)));
  }
  function _e(s, b, R) {
    po((j) => j.map((Q) => (Q.id === s ? { ...Q, valores: { ...Q.valores, [b]: R } } : Q)));
  }
  function xt(s) {
    po((b) => b.filter((R) => R.id !== s));
  }
  function we(s, b, R) {
    const j = (s.clipboardData || window.clipboardData).getData("text");
    if (!j) return;
    s.preventDefault();
    const J = j
      .replace(/\r/g, "")
      .split(
        `
`,
      )
      .filter((fe, ke, We) => !(ke === We.length - 1 && fe === ""))
      .map((fe) => fe.split("	"));
    po((fe) => {
      const ke = fe.map((We) => ({ ...We, valores: { ...We.valores } }));
      return (
        J.forEach((We, wt) => {
          const It = ke[R + wt];
          It &&
            We.forEach((et, gt) => {
              const Ut = ae[b + gt];
              if (!Ut) return;
              const Yt = et
                .trim()
                .replace(/\./g, "")
                .replace(",", ".")
                .replace(/[^0-9.\-]/g, "");
              Yt !== "" && (It.valores[Ut] = Yt);
            });
        }),
        ke
      );
    });
  }
  const Mo = useMemo(() => {
      const s = {};
      return (
        ae.forEach((b) => {
          s[b] = qt.reduce((R, j) => R + (Number(j.valores[b]) || 0), 0);
        }),
        s
      );
    }, [ae, qt]),
    Yo = useMemo(() => {
      let s = Number(nt) || 0;
      return eo.map((b) => ((s += b.neto + (Mo[b.semana] || 0)), s));
    }, [eo, nt, Mo]);
  function yo(s, b) {
    let R = 0;
    return (
      Object.keys(s).forEach((j) => {
        j.indexOf(b + "|") === 0 && (R += Number(s[j]) || 0);
      }),
      R
    );
  }
  function Do(s, b) {
    const R = Number(Le[s.ccId + "|" + b]) || 0,
      j = s.proveedores.reduce((Q, J) => Q + (Number(Le[J.id + "|" + b]) || 0), 0),
      hayProv = s.proveedores.some((J) => (Number(Le[J.id + "|" + b]) || 0) !== 0);
    // Con importes positivos se toma el mayor entre la fila de la obra y la suma de sus proveedores
    // (son dos formas de cargar lo mismo). Si hay un negativo, antes se perdía en ese "mayor" y no
    // restaba (Sección 88): ahora manda la suma de proveedores si hay alguno cargado, si no la obra.
    return R >= 0 && j >= 0 ? Math.max(R, j) : hayProv ? j : R;
  }
  function dn(s) {
    const b = /* @__PURE__ */ new Set(),
      R = s.ccId + "|";
    Object.keys(Le).forEach((Q) => {
      (Q.indexOf(R) === 0 && b.add(Q.slice(R.length)),
        s.proveedores.forEach((J) => {
          const fe = J.id + "|";
          Q.indexOf(fe) === 0 && b.add(Q.slice(fe.length));
        }));
    });
    let j = 0;
    return (
      b.forEach((Q) => {
        j += Do(s, Q);
      }),
      j
    );
  }
  function Fn() {
    const s = XLSX.utils.book_new(),
      b = ["ID", "Cliente", "Centro de Costo", "Tipo", "N° Factura", "Importe Total", ...ae],
      R = b.length - ae.length,
      j = Wt.map((et) => [
        et.id,
        et.cliente,
        et.obra,
        et.tipo,
        et.nro || "",
        et.importe,
        ...ae.map((gt) => Number(F[et.id + "|" + gt]) || 0 || ""),
      ]),
      Q = XLSX.utils.aoa_to_sheet([b, ...j]);
    (Wt.forEach((et, gt) => {
      ae.forEach((Ut, Yt) => {
        const Tt = k[et.id + "|" + Ut];
        if (!Tt) return;
        const ue = XLSX.utils.encode_cell({ r: gt + 1, c: R + Yt });
        (Q[ue] || (Q[ue] = { t: "s", v: "" }), (Q[ue].c = [{ a: "MIA", t: Tt }]), (Q[ue].c.hidden = true));
      });
    }),
      XLSX.utils.book_append_sheet(s, Q, "Ingresos"));
    const J = ["Categoría", ...ae],
      fe = J.length - ae.length,
      ke = Z.map((et) => [et, ...ae.map((gt) => Number(ee[et + "|" + gt]) || 0 || "")]),
      We = XLSX.utils.aoa_to_sheet([J, ...ke]);
    (Z.forEach((et, gt) => {
      ae.forEach((Ut, Yt) => {
        const Tt = ne[et + "|" + Ut];
        if (!Tt) return;
        const ue = XLSX.utils.encode_cell({ r: gt + 1, c: fe + Yt });
        (We[ue] || (We[ue] = { t: "s", v: "" }), (We[ue].c = [{ a: "MIA", t: Tt }]), (We[ue].c.hidden = true));
      });
    }),
      XLSX.utils.book_append_sheet(s, We, "Egresos"));
    const wt = ["ID", "Cliente", "Centro de Costo", "Proveedor", "Saldo", ...ae],
      It = [];
    (re.forEach((et) => {
      (It.push([
        et.ccId,
        et.cliente,
        et.obra,
        "",
        et.saldo,
        ...ae.map((gt) => Number(Le[et.ccId + "|" + gt]) || 0 || ""),
      ]),
        et.proveedores.forEach((gt) => {
          It.push([
            gt.id,
            gt.cliente,
            gt.obra,
            gt.proveedor,
            gt.saldo,
            ...ae.map((Ut) => Number(Le[gt.id + "|" + Ut]) || 0 || ""),
          ]);
        }));
    }),
      XLSX.utils.book_append_sheet(s, XLSX.utils.aoa_to_sheet([wt, ...It]), "Salidas Semanales"),
      descargarLibroXlsx(s, "cashflow_" + fechaConGuiones(dateAFechaStr(/* @__PURE__ */ new Date())) + ".xlsx"));
  }
  async function Yn(s) {
    try {
      const b = await s.arrayBuffer(),
        R = XLSX.read(b, { type: "array" }),
        j = (Ut) => {
          if (Ut == null || Ut === "") return null;
          if (typeof Ut == "number") return Ut;
          const Yt = String(Ut)
            .trim()
            .replace(/\./g, "")
            .replace(",", ".")
            .replace(/[^0-9.\-]/g, "");
          if (Yt === "" || Yt === "-") return null;
          const Tt = Number(Yt);
          return isNaN(Tt) ? null : Tt;
        },
        Q = (Ut) => /^\d{2}\/\d{2}\/\d{4}$/.test(String(Ut || "").trim()),
        J = new Set(ae);
      let fe = 0,
        ke = 0,
        We = 0,
        wt = 0,
        It = 0,
        et = 0,
        gt = 0;
      if (R.SheetNames.includes("Ingresos")) {
        const Ut = XLSX.utils.sheet_to_json(R.Sheets.Ingresos, { defval: null }),
          Yt = { ...F };
        (Ut.forEach((Dt) => {
          const ho = Dt.ID != null ? String(Dt.ID).trim() : "";
          let ct = ho ? Wt.find((Go) => Go.id === ho) : null;
          if (!ct) {
            const Go = String(Dt.Cliente || "")
                .trim()
                .toUpperCase(),
              $o = String(Dt["Centro de Costo"] || "")
                .trim()
                .toUpperCase(),
              cn = String(Dt.Tipo || "").trim(),
              on = Dt["N° Factura"] != null ? String(Dt["N° Factura"]).trim() : "";
            ct = Wt.find(
              (En) =>
                En.cliente.trim().toUpperCase() === Go &&
                En.obra.trim().toUpperCase() === $o &&
                En.tipo === cn &&
                String(En.nro || "").trim() === on,
            );
          }
          if (!ct) {
            It++;
            return;
          }
          let ko = false;
          (Object.keys(Dt).forEach((Go) => {
            if (!Q(Go) || !J.has(Go)) return;
            const $o = j(Dt[Go]);
            ((Yt[ct.id + "|" + Go] = $o === null ? "" : $o), (ko = true));
          }),
            ko && fe++);
        }),
          A(Yt));
        const Tt = R.Sheets.Ingresos,
          ue = XLSX.utils.decode_range(Tt["!ref"] || "A1"),
          So = ue.s.r,
          Wo = {};
        for (let Dt = ue.s.c; Dt <= ue.e.c; Dt++) {
          const ho = Tt[XLSX.utils.encode_cell({ r: So, c: Dt })];
          ho && ho.v != null && (Wo[String(ho.v).trim()] = Dt);
        }
        const ln = Wo.ID,
          Jo = Wo.Cliente,
          xo = Wo["Centro de Costo"],
          Vt = Wo.Tipo,
          st = Wo["N° Factura"],
          Xt = (Dt, ho) => {
            if (ho == null) return null;
            const ct = Tt[XLSX.utils.encode_cell({ r: Dt, c: ho })];
            return ct ? ct.v : null;
          },
          Qo = { ...k };
        for (let Dt = So + 1; Dt <= ue.e.r; Dt++) {
          const ho = Xt(Dt, ln) != null ? String(Xt(Dt, ln)).trim() : "";
          let ct = ho ? Wt.find((ko) => ko.id === ho) : null;
          if (!ct) {
            const ko = String(Xt(Dt, Jo) || "")
                .trim()
                .toUpperCase(),
              Go = String(Xt(Dt, xo) || "")
                .trim()
                .toUpperCase(),
              $o = String(Xt(Dt, Vt) || "").trim(),
              cn = Xt(Dt, st) != null ? String(Xt(Dt, st)).trim() : "";
            ct = Wt.find(
              (on) =>
                on.cliente.trim().toUpperCase() === ko &&
                on.obra.trim().toUpperCase() === Go &&
                on.tipo === $o &&
                String(on.nro || "").trim() === cn,
            );
          }
          ct &&
            ae.forEach((ko) => {
              const Go = Wo[ko];
              if (Go == null) return;
              const $o = Tt[XLSX.utils.encode_cell({ r: Dt, c: Go })],
                cn = $o && $o.c && $o.c.length > 0 ? String($o.c[$o.c.length - 1].t || "").trim() : "",
                on = ct.id + "|" + ko;
              cn ? ((Qo[on] = cn), et++) : delete Qo[on];
            });
        }
        L(Qo);
      }
      if (R.SheetNames.includes("Egresos")) {
        const Ut = XLSX.utils.sheet_to_json(R.Sheets.Egresos, { defval: null }),
          Yt = [],
          Tt = { ...ee };
        (Ut.forEach((Vt) => {
          const st = String(Vt.Categoría || "")
            .trim()
            .toUpperCase();
          if (!st) return;
          !Z.includes(st) && !Yt.includes(st) && Yt.push(st);
          let Xt = false;
          (Object.keys(Vt).forEach((Qo) => {
            if (!Q(Qo) || !J.has(Qo)) return;
            const Dt = j(Vt[Qo]);
            ((Tt[st + "|" + Qo] = Dt === null ? "" : Dt), (Xt = true));
          }),
            Xt && ke++);
        }),
          lt(Tt),
          Yt.length > 0 && (Ye([...Z, ...Yt]), (We = Yt.length)));
        const ue = R.Sheets.Egresos,
          So = XLSX.utils.decode_range(ue["!ref"] || "A1"),
          Wo = So.s.r,
          ln = {};
        for (let Vt = So.s.c; Vt <= So.e.c; Vt++) {
          const st = ue[XLSX.utils.encode_cell({ r: Wo, c: Vt })];
          st && st.v != null && (ln[String(st.v).trim()] = Vt);
        }
        const Jo = ln.Categoría,
          xo = { ...ne };
        for (let Vt = Wo + 1; Vt <= So.e.r; Vt++) {
          const st = Jo != null ? ue[XLSX.utils.encode_cell({ r: Vt, c: Jo })] : null,
            Xt = st && st.v != null ? String(st.v).trim().toUpperCase() : "";
          Xt &&
            ae.forEach((Qo) => {
              const Dt = ln[Qo];
              if (Dt == null) return;
              const ho = ue[XLSX.utils.encode_cell({ r: Vt, c: Dt })],
                ct = ho && ho.c && ho.c.length > 0 ? String(ho.c[ho.c.length - 1].t || "").trim() : "",
                ko = Xt + "|" + Qo;
              ct ? ((xo[ko] = ct), gt++) : delete xo[ko];
            });
        }
        Be(xo);
      }
      if (R.SheetNames.includes("Salidas Semanales")) {
        const Ut = XLSX.utils.sheet_to_json(R.Sheets["Salidas Semanales"], { defval: null }),
          Yt = { ...Le };
        (Ut.forEach((Tt) => {
          const ue = Tt.ID != null ? String(Tt.ID).trim() : "",
            So = String(Tt.Proveedor || "").trim(),
            Wo = String(Tt.Cliente || "")
              .trim()
              .toUpperCase(),
            ln = String(Tt["Centro de Costo"] || "")
              .trim()
              .toUpperCase();
          let Jo = null;
          if (ue) {
            if (re.some((Vt) => Vt.ccId === ue)) Jo = ue;
            else
              for (const Vt of re)
                if (Vt.proveedores.some((st) => st.id === ue)) {
                  Jo = ue;
                  break;
                }
          }
          if (!Jo) {
            const Vt = re.find((st) => st.cliente.trim().toUpperCase() === Wo && st.obra.trim().toUpperCase() === ln);
            if (Vt)
              if (!So) Jo = Vt.ccId;
              else {
                const st = Vt.proveedores.find((Xt) => Xt.proveedor.trim().toUpperCase() === So.toUpperCase());
                st && (Jo = st.id);
              }
          }
          if (!Jo) {
            It++;
            return;
          }
          let xo = false;
          (Object.keys(Tt).forEach((Vt) => {
            if (!Q(Vt) || !J.has(Vt)) return;
            const st = j(Tt[Vt]);
            ((Yt[Jo + "|" + Vt] = st === null ? "" : st), (xo = true));
          }),
            xo && wt++);
        }),
          Lt(Yt));
      }
      sn(
        "Importado: " +
          fe +
          " ingreso(s), " +
          ke +
          " categoría(s) de egresos" +
          (We > 0 ? " (" + We + " nueva(s))" : "") +
          ", " +
          wt +
          " salida(s) semanal(es) actualizadas" +
          (et > 0 ? ", " + et + " comentario(s) de Ingresos" : "") +
          (gt > 0 ? ", " + gt + " comentario(s) de Egresos" : "") +
          "." +
          (It > 0
            ? " " +
              It +
              " fila(s) del Excel no se pudieron ubicar (revisá que el Cliente/Centro de Costo/Proveedor sigan existiendo tal cual)."
            : ""),
      );
    } catch {
      sn("No se pudo leer el archivo.");
    }
  }
  function vn(s, b, R, j, Q, J) {
    const fe = (s.clipboardData || window.clipboardData).getData("text");
    if (!fe) return;
    s.preventDefault();
    const We = fe
      .replace(/\r/g, "")
      .split(
        `
`,
      )
      .filter((wt, It, et) => !(It === et.length - 1 && wt === ""))
      .map((wt) => wt.split("	"));
    J((wt) => {
      const It = { ...wt };
      return (
        We.forEach((et, gt) => {
          const Ut = b[Q + gt];
          if (!Ut) return;
          const Yt = R(Ut);
          et.forEach((Tt, ue) => {
            const So = ae[j + ue];
            if (!So) return;
            const Wo = Tt.trim()
              .replace(/\./g, "")
              .replace(",", ".")
              .replace(/[^0-9.\-]/g, "");
            Wo !== "" && (It[Yt + "|" + So] = Wo);
          });
        }),
        It
      );
    });
  }
  const Wn = useMemo(() => {
    const s = ae.map((J, fe) => ({
        semana: semanaLabelCorta(J),
        ingresos: eo[fe].ingresos,
        egresos: eo[fe].egresos,
        neto: eo[fe].neto,
        saldoAcum: vo[fe],
      })),
      b = s.map((J) => ({ semana: J.semana, saldo: J.saldoAcum })),
      R = Ee.map((J) => ({
        nombre: J.nombre,
        acuerdo: Number(J.acuerdo) || 0,
        utilizado: Number(J.utilizado) || 0,
        disponible: (Number(J.acuerdo) || 0) - (Number(J.utilizado) || 0),
      })),
      j = Wt.map((J) => ({ ...J, resta: J.importe - yo(F, J.id) }))
        .filter((J) => J.resta > 0.5)
        .sort((J, fe) => fe.resta - J.resta)
        .slice(0, 10),
      Q = re
        .map((J) => ({ ...J, resta: J.saldo - dn(J) }))
        .filter((J) => J.resta > 0.5)
        .sort((J, fe) => fe.resta - J.resta)
        .slice(0, 10);
    return {
      fechaGeneracion: dateAFechaStr(/* @__PURE__ */ new Date()),
      semanas: ae,
      filasSemanales: s,
      chartSemanas: b,
      saldoInicial: Number(nt) || 0,
      totalIngresos: eo.reduce((J, fe) => J + fe.ingresos, 0),
      totalEgresos: eo.reduce((J, fe) => J + fe.egresos, 0),
      saldoFinal: vo.length > 0 ? vo[vo.length - 1] : Number(nt) || 0,
      pendienteAsignarIngresos: Wt.reduce((J, fe) => J + (fe.importe - yo(F, fe.id)), 0),
      pendienteAsignarSalidas: re.reduce((J, fe) => J + (fe.saldo - dn(fe)), 0),
      totalAcuerdoBancos: qo,
      totalUtilizadoBancos: ao,
      totalDisponibleBancos: Fo,
      bancos: R,
      topIngresosPendientes: j,
      topSalidasPendientes: Q,
    };
  }, [ae, eo, vo, nt, Ee, qo, ao, Fo, Wt, F, re, Le]);
  async function Zo() {
    if (!(window.html2canvas && window.jspdf)) {
      alert("No se pudo cargar el generador de PDF. Probá recargar la página.");
      return;
    }
    no(true);
    try {
      await new Promise((J) => setTimeout(J, 50));
      const { jsPDF: s } = window.jspdf,
        b = 1280,
        R = 720,
        j = new s({ orientation: "landscape", unit: "px", format: [b, R] });
      for (let J = 0; J < Kt.length; J++) {
        const fe = Kt[J].current;
        if (!fe) continue;
        const We = (await window.html2canvas(fe, { scale: 2, backgroundColor: "#ffffff", logging: false })).toDataURL(
          "image/png",
        );
        (J > 0 && j.addPage([b, R], "landscape"), j.addImage(We, "PNG", 0, 0, b, R));
      }
      const Q = j.output("blob");
      await ofrecerDescarga("cash_" + Wn.fechaGeneracion.replace(/\//g, "-") + ".pdf", Q);
    } catch {
      alert("No se pudo generar la presentación. Probá de nuevo.");
    } finally {
      no(false);
    }
  }
  return React.createElement(
    "div",
    { style: { padding: "22px 28px" } },
    React.createElement(
      "style",
      null,
      ".cf-cell-input:focus { background: #FFF4D6 !important; box-shadow: inset 0 0 0 2px " +
        GOLD +
        "; border-radius: 4px; } .cf-hscroll::-webkit-scrollbar { height: 14px; } .cf-hscroll::-webkit-scrollbar-track { background: #F0EFE9; } .cf-hscroll::-webkit-scrollbar-thumb { background: #B9B3A0; border-radius: 7px; border: 3px solid #F0EFE9; } .cf-hscroll::-webkit-scrollbar-thumb:hover { background: #a49d88; } .cf-hscroll { scrollbar-width: auto; scrollbar-color: #B9B3A0 #F0EFE9; } .cf-hscroll.cf-nobar { scrollbar-width: none; } .cf-hscroll > div > div, .cf-hscroll-floating > div > div { min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .cf-hscroll > div > div > div, .cf-hscroll > div > div > span { overflow: hidden; text-overflow: ellipsis; } .cf-hscroll.cf-nobar::-webkit-scrollbar { height: 0; display: none; }",
    ),
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } },
      React.createElement(
        "div",
        { style: { fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: NAVY } },
        "Cashflow semanal",
      ),
      React.createElement(
        "div",
        { style: { display: "flex", gap: 8, alignItems: "center" } },
        // Sección 100: de a una semana (pedido del usuario: "que pueda ir por semana"); los saltos de
        // 26 semanas quedan en los extremos.
        React.createElement(
          "button",
          { onClick: () => Eo(moverSemanas(oo, -26)), style: smallBtnGhost, title: "26 semanas para atrás" },
          "«",
        ),
        React.createElement(
          "button",
          { onClick: () => Eo(moverSemanas(oo, -1)), style: smallBtnGhost, title: "Una semana para atrás" },
          "‹ Semana anterior",
        ),
        React.createElement(
          "button",
          { onClick: () => Eo(dateAFechaStr(viernesDeLaSemana(/* @__PURE__ */ new Date()))), style: smallBtnGhost },
          "Hoy",
        ),
        React.createElement(
          "button",
          { onClick: () => Eo(moverSemanas(oo, 1)), style: smallBtnGhost, title: "Una semana para adelante" },
          "Semana siguiente ›",
        ),
        React.createElement(
          "button",
          { onClick: () => Eo(moverSemanas(oo, 26)), style: smallBtnGhost, title: "26 semanas para adelante" },
          "»",
        ),
      ),
    ),
    g &&
      React.createElement(
        "div",
        {
          style: {
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            padding: "12px 18px",
            marginBottom: 20,
          },
        },
        React.createElement(
          "div",
          { style: { fontSize: 12.5, fontWeight: 700, color: NAVY, marginBottom: 6 } },
          "Exportar / Importar Excel",
        ),
        React.createElement(
          "div",
          { style: { fontSize: 11.5, color: MUTED, marginBottom: 8 } },
          '"Exportar Excel" baja todo lo que está cargado ahora en Ingresos, Egresos y Salidas Semanales (una hoja por sección, con una columna por semana). Los comentarios de Ingresos y de Egresos se incluyen como comentario nativo de Excel sobre la celda de esa semana, igual que si lo agregaras a mano en Excel. Lo podés modificar en Excel y volver a subirlo con "Importar Excel": la celda del Excel manda siempre — si trae un número lo reemplaza y si la dejás vacía borra lo que hubiera antes en esa semana puntual, así el resultado queda igual al archivo que subís (lo mismo con los comentarios: si le sacás la nota a una celda en Excel, se borra el comentario en la aplicación). No crea filas nuevas en Ingresos ni en Salidas Semanales (esas se calculan solas a partir de las facturas y los pagos pendientes); en Egresos sí puede agregar categorías nuevas si el Excel trae alguna que todavía no existe.',
        ),
        React.createElement(
          "div",
          { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },
          React.createElement(
            "button",
            { onClick: Fn, style: smallBtnGhost },
            React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
            " Exportar Excel",
          ),
          React.createElement(
            "label",
            { style: smallBtnPrimary },
            React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
            " Importar Excel",
            React.createElement("input", {
              type: "file",
              accept: ".xlsx,.xls,.csv",
              style: { display: "none" },
              onChange: async (s) => {
                const b = s.target.files[0];
                b && (await Yn(b), (s.target.value = ""));
              },
            }),
          ),
        ),
        bn && React.createElement("div", { style: { fontSize: 11.5, color: MUTED, marginTop: 8 } }, bn),
      ),
    React.createElement(
      "div",
      { style: { display: "flex", gap: 6, marginBottom: 16 } },
      [
        { id: "ingresos", label: "Ingresos" },
        { id: "egresos", label: "Egresos" },
        { id: "salidas", label: "Salidas Semanales" },
      ].map((s) =>
        React.createElement(
          "button",
          {
            key: s.id,
            onClick: () => v(s.id),
            style: {
              padding: "9px 20px",
              borderRadius: 8,
              border: "1px solid " + BORDER,
              cursor: "pointer",
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: 0.3,
              fontFamily: "inherit",
              background: fo === s.id ? NAVY : "#fff",
              color: fo === s.id ? "#fff" : NAVY,
            },
          },
          s.label,
        ),
      ),
    ),
    fo === "ingresos" &&
      React.createElement(
        "div",
        {
          style: {
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            overflow: "hidden",
            marginBottom: 20,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              padding: "12px 18px",
              fontWeight: 700,
              color: NAVY,
              background: "#EFEDE7",
              fontSize: 13,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              letterSpacing: 0.3,
              flexWrap: "wrap",
              gap: 10,
            },
          },
          React.createElement("span", null, "INGRESOS"),
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 400 } },
            React.createElement(
              "span",
              { style: { color: MUTED } },
              "Pendiente de asignar (total ingresos − asignado por semana):",
            ),
            React.createElement(
              "b",
              { style: { color: GOLD } },
              fmt(Wt.reduce((s, b) => s + (b.importe - yo(F, b.id)), 0)),
            ),
          ),
        ),
        Wt.length > 0 &&
          React.createElement(
            "div",
            { style: { padding: "10px 18px", borderBottom: "1px solid " + BORDER } },
            React.createElement("input", {
              placeholder: "Buscar por cliente...",
              value: de,
              onChange: (s) => Bt(s.target.value),
              style: { ...inputStyle, width: "100%" },
            }),
          ),
        Wt.length === 0 && oe.length === 0
          ? React.createElement(
              "div",
              { style: { padding: 16, fontSize: 12.5, color: MUTED } },
              "No hay facturas adeudadas ni venta pendiente de facturar.",
            )
          : ot.length === 0 && oe.length === 0
            ? React.createElement(
                "div",
                { style: { padding: 16, fontSize: 12.5, color: MUTED } },
                "No hay ingresos que coincidan con la búsqueda.",
              )
            : React.createElement(
                "div",
                {
                  className: "cf-hscroll",
                  ref: (s) => {
                    ((V.scrollRef.current = s), attachDragScroll(s));
                  },
                  style: { overflowX: "scroll" },
                },
                React.createElement(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "260px 120px 120px repeat(" + ae.length + ", 110px)",
                      minWidth: 500 + ae.length * 110,
                    },
                  },
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...te,
                        padding: "8px 18px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: MUTED,
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    "CLIENTE / CENTRO DE COSTO / ORIGEN",
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...y,
                        padding: "8px 6px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: MUTED,
                        textAlign: "right",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    "RESTA",
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...G,
                        padding: "8px 6px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: MUTED,
                        textAlign: "right",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    "TOTAL",
                  ),
                  ae.map((s) =>
                    React.createElement(
                      "div",
                      {
                        key: s,
                        style: {
                          ...G,
                          padding: "8px 6px",
                          fontSize: 11,
                          fontWeight: 700,
                          color: MUTED,
                          textAlign: "center",
                          borderBottom: "1px solid " + BORDER,
                          borderRight: "1px solid " + BORDER,
                        },
                      },
                      semanaLabelCorta(s),
                    ),
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...dt,
                        padding: "7px 18px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: NAVY,
                        background: "#F1E9D2",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    "TOTAL INGRESOS",
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...vt,
                        padding: "7px 6px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        textAlign: "right",
                        background: "#F1E9D2",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                        color: GOLD,
                      },
                    },
                    fmt(Wt.reduce((s, b) => s + (b.importe - yo(F, b.id)), 0)),
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        padding: "7px 6px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        textAlign: "right",
                        background: "#F1E9D2",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                        fontVariantNumeric: "tabular-nums",
                      },
                    },
                    fmt(Wt.reduce((s, b) => s + b.importe, 0) + oe.reduce((s, b) => s + yo(P, b), 0)),
                  ),
                  ae.map((s) =>
                    React.createElement(
                      "div",
                      {
                        key: s,
                        style: {
                          padding: "7px 6px",
                          fontSize: 12,
                          fontWeight: 700,
                          textAlign: "right",
                          background: "#F1E9D2",
                          borderBottom: "1px solid " + BORDER,
                          borderRight: "1px solid " + BORDER,
                          color: GREEN,
                        },
                      },
                      fmt(
                        Wt.reduce((b, R) => b + (Number(F[R.id + "|" + s]) || 0), 0) +
                          oe.reduce((b, R) => b + (Number(P[R + "|" + s]) || 0), 0),
                      ),
                    ),
                  ),
                  oe.map((s, b) => {
                    const R = b % 2 === 1 ? ZEBRA : "#fff";
                    return React.createElement(
                      React.Fragment,
                      { key: "cat-ingreso|" + s },
                      React.createElement(
                        "div",
                        {
                          style: {
                            ...dt,
                            padding: "6px 18px",
                            fontSize: 12,
                            fontStyle: "italic",
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: R,
                          },
                        },
                        React.createElement("span", null, s),
                        g &&
                          React.createElement(
                            "button",
                            {
                              onClick: () => ve((j) => j.filter((Q) => Q !== s)),
                              style: { border: "none", background: "none", cursor: "pointer", color: RED },
                            },
                            React.createElement(Trash2, { size: 11 }),
                          ),
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            ...vt,
                            padding: "6px 6px",
                            fontSize: 12,
                            textAlign: "right",
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            color: MUTED,
                            background: R,
                          },
                        },
                        "—",
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            padding: "6px 6px",
                            fontSize: 12,
                            textAlign: "right",
                            fontStyle: "italic",
                            fontWeight: 600,
                            color: MUTED,
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            background: R,
                          },
                        },
                        fmt(yo(P, s)),
                      ),
                      ae.map((j, Q) => {
                        const J = s + "|" + j,
                          fe = Pe[J];
                        return React.createElement(
                          "div",
                          {
                            key: j,
                            style: {
                              padding: "5px 6px 2px",
                              borderBottom: "1px solid " + BORDER,
                              borderRight: "1px solid " + BORDER,
                              background: R,
                            },
                          },
                          g
                            ? React.createElement(MilesInput, {
                                className: "cf-cell-input",
                                style: { ...go, textAlign: "right", fontSize: 11.5 },
                                value: P[J] ?? "",
                                onChange: (ke) => M((We) => ({ ...We, [J]: ke })),
                                onPaste: (ke) => vn(ke, oe, (We) => We, Q, b, M),
                              })
                            : React.createElement(
                                "div",
                                { style: { textAlign: "right", fontSize: 12 } },
                                fmt(Number(P[J]) || 0),
                              ),
                          (fe || g) &&
                            React.createElement(
                              "div",
                              { style: { textAlign: "center", lineHeight: 1, marginTop: 1 } },
                              React.createElement(
                                "button",
                                {
                                  onClick: () => it(s, j),
                                  title: fe ? "Comentario: " + fe : "Agregar comentario",
                                  style: {
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    padding: 1,
                                    color: fe ? GOLD : "#D8D3C4",
                                    lineHeight: 0,
                                  },
                                },
                                React.createElement(MessageSquare, { size: 10, fill: fe ? GOLD : "none" }),
                              ),
                            ),
                        );
                      }),
                    );
                  }),
                  ot.map((s, b) => {
                    const R = yo(F, s.id),
                      j = s.importe - R,
                      Q = s.obraFinalizada,
                      J = Q ? "#F7D9D4" : b % 2 === 1 ? ZEBRA : "#fff",
                      fe = "Resta: " + fmt(j);
                    return React.createElement(
                      React.Fragment,
                      { key: s.id },
                      React.createElement(
                        "div",
                        {
                          onClick: Ne ? () => Ne(s.cliente, s.obra) : void 0,
                          title: Ne ? "Ir al centro de costo " + s.cliente + " · " + s.obra : void 0,
                          style: {
                            ...dt,
                            padding: "6px 18px",
                            fontSize: 12,
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            background: J,
                            cursor: Ne ? "pointer" : "default",
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { fontWeight: 600, color: Q ? RED : "inherit" } },
                          s.cliente,
                          " · ",
                          s.obra,
                          Q && " ⚠ OBRA FINALIZADA",
                        ),
                        React.createElement(
                          "div",
                          { style: { color: Q ? RED : MUTED, fontSize: 11 } },
                          s.tipo,
                          s.nro ? " · N° " + s.nro : "",
                        ),
                        s.fecha &&
                          React.createElement(
                            "div",
                            { style: { color: Q ? RED : MUTED, fontSize: 10.5 } },
                            "Fecha: ",
                            s.fecha,
                            s.diasDesdeEmision != null ? " · Días: " + s.diasDesdeEmision : "",
                          ),
                      ),
                      React.createElement(
                        "div",
                        {
                          title: fe,
                          style: {
                            ...vt,
                            padding: "6px 6px",
                            fontSize: 12,
                            textAlign: "right",
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            color: j > 0.5 ? GOLD : MUTED,
                            fontWeight: 600,
                            background: J,
                          },
                        },
                        fmt(j),
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            padding: "6px 6px",
                            fontSize: 12,
                            textAlign: "right",
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            fontVariantNumeric: "tabular-nums",
                            background: J,
                          },
                        },
                        fmt(s.importe),
                      ),
                      ae.map((ke, We) => {
                        const wt = s.id + "|" + ke,
                          It = k[wt];
                        return React.createElement(
                          "div",
                          {
                            key: ke,
                            style: {
                              padding: "5px 6px 2px",
                              borderBottom: "1px solid " + BORDER,
                              borderRight: "1px solid " + BORDER,
                              background: J,
                            },
                          },
                          g
                            ? React.createElement(MilesInput, {
                                className: "cf-cell-input",
                                style: { ...go, textAlign: "right", fontSize: 11.5 },
                                value: F[wt] ?? "",
                                onChange: (et) => A((gt) => ({ ...gt, [wt]: et })),
                                onPaste: (et) => vn(et, ot, (gt) => gt.id, We, b, A),
                                title: fe,
                                hint: fe,
                              })
                            : React.createElement(
                                "div",
                                { title: fe, style: { textAlign: "right", fontSize: 12 } },
                                fmt(Number(F[wt]) || 0),
                              ),
                          (It || g) &&
                            React.createElement(
                              "div",
                              { style: { textAlign: "center", lineHeight: 1, marginTop: 1 } },
                              React.createElement(
                                "button",
                                {
                                  onClick: () => Ae(s, ke),
                                  title: It ? "Comentario: " + It : "Agregar comentario",
                                  style: {
                                    border: "none",
                                    background: "none",
                                    cursor: "pointer",
                                    padding: 1,
                                    color: It ? GOLD : "#D8D3C4",
                                    lineHeight: 0,
                                  },
                                },
                                React.createElement(MessageSquare, { size: 10, fill: It ? GOLD : "none" }),
                              ),
                            ),
                        );
                      }),
                    );
                  }),
                ),
              ),
        V.floating &&
          React.createElement(
            "div",
            {
              className: "cf-hscroll-floating",
              ref: (s) => {
                ((V.innerRef.current = s),
                  s && V.scrollRef.current && (s.scrollLeft = V.scrollRef.current.scrollLeft),
                  attachDragScrollProxy(s, () => V.scrollRef.current));
              },
              style: {
                position: "fixed",
                top: w,
                left: V.left,
                width: V.width,
                overflow: "hidden",
                zIndex: 30,
                boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "260px 120px 120px repeat(" + ae.length + ", 110px)",
                  minWidth: 500 + ae.length * 110,
                },
              },
              React.createElement(
                "div",
                {
                  style: {
                    ...te,
                    padding: "8px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "CLIENTE / CENTRO DE COSTO / ORIGEN",
              ),
              React.createElement(
                "div",
                {
                  style: {
                    ...y,
                    padding: "8px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    textAlign: "right",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "RESTA",
              ),
              React.createElement(
                "div",
                {
                  style: {
                    ...G,
                    padding: "8px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    textAlign: "right",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "TOTAL",
              ),
              ae.map((s) =>
                React.createElement(
                  "div",
                  {
                    key: s,
                    style: {
                      ...G,
                      padding: "8px 6px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: MUTED,
                      textAlign: "center",
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                    },
                  },
                  semanaLabelCorta(s),
                ),
              ),
            ),
          ),
        g &&
          React.createElement(
            "div",
            {
              style: {
                display: "flex",
                gap: 8,
                padding: "10px 18px",
                alignItems: "center",
                borderTop: "1px solid " + BORDER,
              },
            },
            React.createElement("input", {
              placeholder: "Nueva fila manual (ej. AFORO)",
              style: inputStyle,
              value: ht,
              onChange: (s) => St(s.target.value),
            }),
            React.createElement(
              "button",
              {
                onClick: () => {
                  ht.trim() && (ve((s) => [...s, ht.trim().toUpperCase()]), St(""));
                },
                style: smallBtnGhost,
              },
              React.createElement(Plus, { size: 13 }),
              " Agregar fila manual",
            ),
          ),
      ),
    fo === "egresos" &&
      React.createElement(
        "div",
        {
          style: {
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            overflow: "hidden",
            marginBottom: 20,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              padding: "12px 18px",
              fontWeight: 700,
              color: NAVY,
              background: "#EFEDE7",
              fontSize: 13,
              letterSpacing: 0.3,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            },
          },
          React.createElement("span", null, "EGRESOS"),
          React.createElement(
            "span",
            { style: { fontSize: 11.5, fontWeight: 400, color: MUTED } },
            "Importe total: ",
            React.createElement(
              "b",
              { style: { color: RED, fontWeight: 700 } },
              fmt(Z.reduce((s, b) => s + yo(ee, b), 0) + re.reduce((s, b) => s + dn(b), 0) + ae.reduce((s, b) => s + regaliaPendiente(regMap, regPag, b), 0)),
            ),
          ),
        ),
        React.createElement(
          "div",
          { style: { padding: "10px 18px", borderBottom: "1px solid " + BORDER } },
          React.createElement("input", {
            placeholder: "Buscar por categoría...",
            value: Ft,
            onChange: (s) => Xe(s.target.value),
            style: { ...inputStyle, width: "100%" },
          }),
        ),
        Ht.length === 0
          ? React.createElement(
              "div",
              { style: { padding: 16, fontSize: 12.5, color: MUTED } },
              "No hay categorías que coincidan con la búsqueda.",
            )
          : React.createElement(
              "div",
              {
                className: "cf-hscroll",
                ref: (s) => {
                  ((ut.scrollRef.current = s), attachDragScroll(s));
                },
                style: { overflowX: "scroll" },
              },
              React.createElement(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "260px repeat(" + ae.length + ", 110px) 130px",
                    minWidth: 390 + ae.length * 110,
                  },
                },
                React.createElement(
                  "div",
                  {
                    style: {
                      ...te,
                      padding: "8px 18px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: MUTED,
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                    },
                  },
                  "CATEGORÍA",
                ),
                ae.map((s) =>
                  React.createElement(
                    "div",
                    {
                      key: s,
                      style: {
                        ...G,
                        padding: "8px 6px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: MUTED,
                        textAlign: "center",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    semanaLabelCorta(s),
                  ),
                ),
                React.createElement(
                  "div",
                  {
                    style: {
                      ...G,
                      padding: "8px 6px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: MUTED,
                      textAlign: "right",
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                    },
                  },
                  "TOTAL",
                ),
                React.createElement(
                  "div",
                  {
                    style: {
                      ...dt,
                      padding: "7px 18px",
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: NAVY,
                      background: "#F1E9D2",
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                    },
                  },
                  "TOTAL EGRESOS",
                ),
                ae.map((s) =>
                  React.createElement(
                    "div",
                    {
                      key: s,
                      style: {
                        padding: "7px 6px",
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: "right",
                        background: "#F1E9D2",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                        color: RED,
                      },
                    },
                    fmt(
                      Z.reduce((b, R) => b + (Number(ee[R + "|" + s]) || 0), 0) + re.reduce((b, R) => b + Do(R, s), 0) + regaliaPendiente(regMap, regPag, s),
                    ),
                  ),
                ),
                React.createElement(
                  "div",
                  {
                    style: {
                      padding: "7px 6px",
                      fontSize: 12.5,
                      fontWeight: 700,
                      textAlign: "right",
                      background: "#F1E9D2",
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                    },
                  },
                  fmt(Z.reduce((s, b) => s + yo(ee, b), 0) + re.reduce((s, b) => s + dn(b), 0) + ae.reduce((s, b) => s + regaliaPendiente(regMap, regPag, b), 0)),
                ),
                React.createElement(
                  "div",
                  {
                    style: {
                      ...dt,
                      padding: "6px 18px",
                      fontSize: 12.5,
                      fontStyle: "italic",
                      color: MUTED,
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                      background: "#fff",
                    },
                    title: "Se completa solo, con el total de la pestaña Salidas Semanales",
                  },
                  "SALIDAS SEMANALES",
                ),
                ae.map((s) =>
                  React.createElement(
                    "div",
                    {
                      key: s,
                      style: {
                        padding: "7px 6px",
                        fontSize: 12,
                        textAlign: "right",
                        fontStyle: "italic",
                        color: MUTED,
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                        background: "#fff",
                      },
                    },
                    fmt(re.reduce((b, R) => b + Do(R, s), 0)),
                  ),
                ),
                React.createElement(
                  "div",
                  {
                    style: {
                      padding: "6px 6px",
                      fontSize: 12,
                      textAlign: "right",
                      fontWeight: 600,
                      fontStyle: "italic",
                      color: MUTED,
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                      background: "#fff",
                    },
                  },
                  fmt(re.reduce((s, b) => s + dn(b), 0)),
                ),
                React.createElement(
                  "div",
                  {
                    style: {
                      ...dt,
                      padding: "6px 18px",
                      fontSize: 12.5,
                      fontStyle: "italic",
                      color: MUTED,
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                      background: "#fff",
                    },
                    title:
                      "Se calcula sola en la primera semana de cada mes: facturación del mes anterior × 1% (hasta jun 2027), 1,5% (jul 2027 – jun 2028), 2% (jul 2028 – jun 2029), 2,5% (desde jul 2029). Tildá \"Pagada\" cuando la pagues y deja de sumar.",
                  },
                  "REGALÍAS",
                ),
                ae.map((s) => {
                  const x = regMap[s],
                    pagada = !!(x && regPag[x.clave]),
                    tasaTxt = x ? String(x.tasa).replace(".", ",") : "";
                  return React.createElement(
                    "div",
                    {
                      key: s,
                      title: x
                        ? "Facturación " +
                          x.mesNombre +
                          ": " +
                          fmt(x.base) +
                          " × " +
                          tasaTxt +
                          " = " +
                          fmt(x.monto) +
                          (pagada ? " · PAGADA (no suma en Egresos ni en CASH)" : "")
                        : "",
                      style: {
                        padding: "5px 6px 2px",
                        fontSize: 12,
                        textAlign: "right",
                        fontStyle: "italic",
                        color: pagada ? "#A8A395" : MUTED,
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                        background: "#fff",
                      },
                    },
                    x &&
                      React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(
                          "div",
                          { style: { textDecoration: pagada ? "line-through" : "none" } },
                          fmt(x.monto),
                        ),
                        React.createElement(
                          "label",
                          {
                            style: {
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 3,
                              fontSize: 10,
                              fontStyle: "normal",
                              color: pagada ? GREEN : MUTED,
                              cursor: g && setRegPag ? "pointer" : "default",
                            },
                          },
                          React.createElement("input", {
                            type: "checkbox",
                            checked: pagada,
                            disabled: !g || !setRegPag,
                            onChange: () =>
                              setRegPag((j) => {
                                const Q = { ...(j || {}) };
                                return (Q[x.clave] ? delete Q[x.clave] : (Q[x.clave] = true), Q);
                              }),
                            style: { margin: 0, width: 11, height: 11 },
                          }),
                          "Pagada",
                        ),
                      ),
                  );
                }),
                React.createElement(
                  "div",
                  {
                    style: {
                      padding: "6px 6px",
                      fontSize: 12,
                      textAlign: "right",
                      fontWeight: 600,
                      fontStyle: "italic",
                      color: MUTED,
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                      background: "#fff",
                    },
                    title: "Regalías pendientes (sin las tildadas como pagadas)",
                  },
                  fmt(ae.reduce((s, b) => s + regaliaPendiente(regMap, regPag, b), 0)),
                ),
                Ht.map((s, b) => {
                  const R = b % 2 === 1 ? ZEBRA : "#fff";
                  return React.createElement(
                    React.Fragment,
                    { key: s },
                    React.createElement(
                      "div",
                      {
                        style: {
                          ...dt,
                          padding: "6px 18px",
                          fontSize: 12.5,
                          borderBottom: "1px solid " + BORDER,
                          borderRight: "1px solid " + BORDER,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: R,
                        },
                      },
                      React.createElement(EgresoNombreEditable, {
                        nombre: s,
                        editable: g,
                        onDelete: () => Ye((j) => j.filter((Q) => Q !== s)),
                        onRename: (nuevo) => {
                          if (Z.some((j) => j !== s && j.trim().toUpperCase() === nuevo))
                            return "Ya existe una categoría con ese nombre.";
                          if (nuevo.includes("|")) return 'El nombre no puede tener el carácter "|".';
                          const mover = (j) => {
                            const Q = {};
                            return (
                              Object.entries(j || {}).forEach(([J, fe]) => {
                                Q[J.startsWith(s + "|") ? nuevo + J.slice(s.length) : J] = fe;
                              }),
                              Q
                            );
                          };
                          return (
                            Ye((j) => j.map((Q) => (Q === s ? nuevo : Q))),
                            lt((j) => mover(j)),
                            Be((j) => mover(j)),
                            null
                          );
                        },
                      }),
                    ),
                    ae.map((j, Q) => {
                      const J = s + "|" + j,
                        fe = ne[J];
                      return React.createElement(
                        "div",
                        {
                          key: j,
                          style: {
                            padding: "7px 6px 2px",
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            background: R,
                          },
                        },
                        g
                          ? React.createElement(MilesInput, {
                              className: "cf-cell-input",
                              style: { ...go, textAlign: "right", fontSize: 11.5 },
                              value: ee[J] ?? "",
                              onChange: (ke) => lt((We) => ({ ...We, [J]: ke })),
                              onPaste: (ke) => vn(ke, Ht, (We) => We, Q, b, lt),
                            })
                          : React.createElement(
                              "div",
                              { style: { textAlign: "right", fontSize: 12 } },
                              fmt(Number(ee[J]) || 0),
                            ),
                        (fe || g) &&
                          React.createElement(
                            "div",
                            { style: { textAlign: "center", lineHeight: 1, marginTop: 1 } },
                            React.createElement(
                              "button",
                              {
                                onClick: () => me(s, j),
                                title: fe ? "Comentario: " + fe : "Agregar comentario",
                                style: {
                                  border: "none",
                                  background: "none",
                                  cursor: "pointer",
                                  padding: 1,
                                  color: fe ? GOLD : "#D8D3C4",
                                  lineHeight: 0,
                                },
                              },
                              React.createElement(MessageSquare, { size: 10, fill: fe ? GOLD : "none" }),
                            ),
                          ),
                      );
                    }),
                    React.createElement(
                      "div",
                      {
                        style: {
                          padding: "6px 6px",
                          fontSize: 12,
                          textAlign: "right",
                          borderBottom: "1px solid " + BORDER,
                          borderRight: "1px solid " + BORDER,
                          fontWeight: 600,
                          color: MUTED,
                          background: R,
                        },
                      },
                      fmt(yo(ee, s)),
                    ),
                  );
                }),
              ),
            ),
        ut.floating &&
          React.createElement(
            "div",
            {
              className: "cf-hscroll-floating",
              ref: (s) => {
                ((ut.innerRef.current = s),
                  s && ut.scrollRef.current && (s.scrollLeft = ut.scrollRef.current.scrollLeft),
                  attachDragScrollProxy(s, () => ut.scrollRef.current));
              },
              style: {
                position: "fixed",
                top: w,
                left: ut.left,
                width: ut.width,
                overflow: "hidden",
                zIndex: 30,
                boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "260px repeat(" + ae.length + ", 110px) 130px",
                  minWidth: 390 + ae.length * 110,
                },
              },
              React.createElement(
                "div",
                {
                  style: {
                    ...te,
                    padding: "8px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "CATEGORÍA",
              ),
              ae.map((s) =>
                React.createElement(
                  "div",
                  {
                    key: s,
                    style: {
                      ...G,
                      padding: "8px 6px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: MUTED,
                      textAlign: "center",
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                    },
                  },
                  semanaLabelCorta(s),
                ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    ...G,
                    padding: "8px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    textAlign: "right",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "TOTAL",
              ),
            ),
          ),
        g &&
          React.createElement(
            "div",
            { style: { display: "flex", gap: 8, padding: "10px 18px", alignItems: "center" } },
            React.createElement("input", {
              placeholder: "Nueva categoría",
              style: inputStyle,
              value: No,
              onChange: (s) => Jt(s.target.value),
            }),
            React.createElement(
              "button",
              {
                onClick: () => {
                  No.trim() && (Ye((s) => [...s, No.trim().toUpperCase()]), Jt(""));
                },
                style: smallBtnGhost,
              },
              React.createElement(Plus, { size: 13 }),
              " Agregar categoría",
            ),
          ),
      ),
    fo === "salidas" &&
      React.createElement(
        "div",
        {
          style: {
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            overflow: "hidden",
            marginBottom: 20,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              padding: "12px 18px",
              fontWeight: 700,
              color: NAVY,
              fontSize: 13,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              letterSpacing: 0.3,
              flexWrap: "wrap",
              gap: 10,
              background: "#EFEDE7",
            },
          },
          React.createElement("span", null, "SALIDAS SEMANALES (pagos a proveedores pendientes)"),
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 400 } },
            React.createElement(
              "span",
              { style: { color: MUTED } },
              "Pendiente de asignar (total salidas semanales − asignado por semana):",
            ),
            React.createElement("b", { style: { color: GOLD } }, fmt(re.reduce((s, b) => s + (b.saldo - dn(b)), 0))),
          ),
        ),
        B.length > 0 &&
          React.createElement(
            "div",
            { style: { padding: "10px 18px", borderBottom: "1px solid " + BORDER } },
            React.createElement("input", {
              placeholder: "Buscar por cliente...",
              value: rt,
              onChange: (s) => Ct(s.target.value),
              style: { ...inputStyle, width: "100%" },
            }),
          ),
        B.length === 0
          ? React.createElement(
              "div",
              { style: { padding: 16, fontSize: 12.5, color: MUTED } },
              "No hay pagos a proveedores pendientes.",
            )
          : $t.length === 0
            ? React.createElement(
                "div",
                { style: { padding: 16, fontSize: 12.5, color: MUTED } },
                "No hay salidas semanales que coincidan con la búsqueda.",
              )
            : React.createElement(
                "div",
                {
                  className: "cf-hscroll",
                  ref: (s) => {
                    ((At.scrollRef.current = s), attachDragScroll(s));
                  },
                  style: { overflowX: "scroll" },
                },
                React.createElement(
                  "div",
                  {
                    style: {
                      display: "grid",
                      gridTemplateColumns: "260px 130px repeat(" + ae.length + ", 110px) 130px",
                      minWidth: 520 + ae.length * 110,
                    },
                  },
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...te,
                        padding: "8px 18px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: MUTED,
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    "CENTRO DE COSTO / PROVEEDOR",
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...G,
                        padding: "8px 6px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: MUTED,
                        textAlign: "right",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    "SALDO",
                  ),
                  ae.map((s) =>
                    React.createElement(
                      "div",
                      {
                        key: s,
                        style: {
                          ...G,
                          padding: "8px 6px",
                          fontSize: 11,
                          fontWeight: 700,
                          color: MUTED,
                          textAlign: "center",
                          borderBottom: "1px solid " + BORDER,
                          borderRight: "1px solid " + BORDER,
                        },
                      },
                      semanaLabelCorta(s),
                    ),
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...G,
                        padding: "8px 6px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: MUTED,
                        textAlign: "right",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    "RESTA",
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        ...dt,
                        padding: "7px 18px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        color: NAVY,
                        background: "#F1E9D2",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                      },
                    },
                    "TOTAL SALIDAS SEMANALES",
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        padding: "7px 6px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        textAlign: "right",
                        background: "#F1E9D2",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                        color: RED,
                        fontVariantNumeric: "tabular-nums",
                      },
                    },
                    fmt(B.reduce((s, b) => s + b.saldo, 0)),
                  ),
                  ae.map((s) =>
                    React.createElement(
                      "div",
                      {
                        key: s,
                        style: {
                          padding: "7px 6px",
                          fontSize: 12,
                          fontWeight: 700,
                          textAlign: "right",
                          background: "#F1E9D2",
                          borderBottom: "1px solid " + BORDER,
                          borderRight: "1px solid " + BORDER,
                          color: RED,
                        },
                      },
                      fmt(re.reduce((b, R) => b + Do(R, s), 0)),
                    ),
                  ),
                  React.createElement(
                    "div",
                    {
                      style: {
                        padding: "7px 6px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        textAlign: "right",
                        background: "#F1E9D2",
                        borderBottom: "1px solid " + BORDER,
                        borderRight: "1px solid " + BORDER,
                        color: GOLD,
                      },
                    },
                    fmt(re.reduce((s, b) => s + (b.saldo - dn(b)), 0)),
                  ),
                  $t.map((s, b) => {
                    const R = s.saldo - dn(s),
                      j = !!E[s.ccId] || !!rt.trim();
                    return React.createElement(
                      React.Fragment,
                      { key: s.ccId },
                      React.createElement(
                        "div",
                        {
                          onClick: () => K((Q) => ({ ...Q, [s.ccId]: !Q[s.ccId] })),
                          style: {
                            ...dt,
                            padding: "7px 18px",
                            fontSize: 12.5,
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            fontWeight: 700,
                            color: NAVY,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            background: "#FAFAF7",
                          },
                        },
                        React.createElement(
                          "span",
                          {
                            style: {
                              display: "inline-block",
                              transform: j ? "rotate(90deg)" : "rotate(0deg)",
                              transition: "transform 0.15s",
                              fontSize: 10,
                            },
                          },
                          "▶",
                        ),
                        React.createElement(
                          "span",
                          {
                            title: s.cliente + " · " + s.obra,
                            style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 },
                          },
                          s.cliente,
                          " · ",
                          s.obra,
                        ),
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            padding: "7px 6px",
                            fontSize: 12.5,
                            textAlign: "right",
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            color: RED,
                            fontWeight: 700,
                            background: "#FAFAF7",
                            fontVariantNumeric: "tabular-nums",
                          },
                        },
                        fmt(s.saldo),
                      ),
                      ae.map((Q, J) =>
                        React.createElement(
                          "div",
                          {
                            key: Q,
                            style: {
                              padding: "7px 6px",
                              borderBottom: "1px solid " + BORDER,
                              borderRight: "1px solid " + BORDER,
                              background: "#FAFAF7",
                            },
                          },
                          g
                            ? React.createElement(MilesInput, {
                                className: "cf-cell-input",
                                style: { ...go, textAlign: "right", fontSize: 11.5, fontWeight: 700 },
                                value: Le[s.ccId + "|" + Q] ?? "",
                                onChange: (fe) => Lt((ke) => ({ ...ke, [s.ccId + "|" + Q]: fe })),
                                onPaste: (fe) => vn(fe, $t, (ke) => ke.ccId, J, b, Lt),
                                title: "Resta: " + fmt(R),
                                hint: "Resta: " + fmt(R),
                              })
                            : React.createElement(
                                "div",
                                {
                                  title: "Resta: " + fmt(R),
                                  style: { textAlign: "right", fontSize: 12, fontWeight: 700 },
                                },
                                fmt(Number(Le[s.ccId + "|" + Q]) || 0),
                              ),
                        ),
                      ),
                      React.createElement(
                        "div",
                        {
                          style: {
                            padding: "7px 6px",
                            fontSize: 12.5,
                            textAlign: "right",
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            fontWeight: 700,
                            background: "#FAFAF7",
                            color: R > 0.5 ? GOLD : MUTED,
                          },
                        },
                        fmt(R),
                      ),
                      j &&
                        s.proveedores.map((Q, J) => {
                          const fe = yo(Le, Q.id),
                            ke = Q.saldo - fe,
                            We = J % 2 === 1 ? ZEBRA : "#fff";
                          return React.createElement(
                            React.Fragment,
                            { key: Q.id },
                            React.createElement(
                              "div",
                              {
                                style: {
                                  ...dt,
                                  padding: "6px 18px 6px 34px",
                                  fontSize: 12,
                                  fontStyle: Q.esVirtualMzLatam ? "italic" : "normal",
                                  borderBottom: "1px solid " + BORDER,
                                  borderRight: "1px solid " + BORDER,
                                  color: MUTED,
                                  background: We,
                                },
                              },
                              Q.proveedor,
                            ),
                            React.createElement(
                              "div",
                              {
                                style: {
                                  padding: "6px 6px",
                                  fontSize: 12,
                                  textAlign: "right",
                                  borderBottom: "1px solid " + BORDER,
                                  borderRight: "1px solid " + BORDER,
                                  color: RED,
                                  fontVariantNumeric: "tabular-nums",
                                  background: We,
                                },
                              },
                              fmt(Q.saldo),
                            ),
                            ae.map((wt, It) =>
                              React.createElement(
                                "div",
                                {
                                  key: wt,
                                  style: {
                                    padding: "7px 6px",
                                    borderBottom: "1px solid " + BORDER,
                                    borderRight: "1px solid " + BORDER,
                                    background: We,
                                  },
                                },
                                g
                                  ? React.createElement(MilesInput, {
                                      className: "cf-cell-input",
                                      style: { ...go, textAlign: "right", fontSize: 11.5 },
                                      value: Le[Q.id + "|" + wt] ?? "",
                                      onChange: (et) => Lt((gt) => ({ ...gt, [Q.id + "|" + wt]: et })),
                                      onPaste: (et) => vn(et, s.proveedores, (gt) => gt.id, It, J, Lt),
                                      title: "Resta: " + fmt(ke),
                                      hint: "Resta: " + fmt(ke),
                                    })
                                  : React.createElement(
                                      "div",
                                      { title: "Resta: " + fmt(ke), style: { textAlign: "right", fontSize: 12 } },
                                      fmt(Number(Le[Q.id + "|" + wt]) || 0),
                                    ),
                              ),
                            ),
                            React.createElement(
                              "div",
                              {
                                style: {
                                  padding: "6px 6px",
                                  fontSize: 12,
                                  textAlign: "right",
                                  borderBottom: "1px solid " + BORDER,
                                  borderRight: "1px solid " + BORDER,
                                  color: ke > 0.5 ? GOLD : MUTED,
                                  fontWeight: 600,
                                  background: We,
                                },
                              },
                              fmt(ke),
                            ),
                          );
                        }),
                    );
                  }),
                ),
              ),
        At.floating &&
          React.createElement(
            "div",
            {
              className: "cf-hscroll-floating",
              ref: (s) => {
                ((At.innerRef.current = s),
                  s && At.scrollRef.current && (s.scrollLeft = At.scrollRef.current.scrollLeft),
                  attachDragScrollProxy(s, () => At.scrollRef.current));
              },
              style: {
                position: "fixed",
                top: w,
                left: At.left,
                width: At.width,
                overflow: "hidden",
                zIndex: 30,
                boxShadow: "0 2px 6px rgba(0,0,0,0.10)",
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  display: "grid",
                  gridTemplateColumns: "260px 130px repeat(" + ae.length + ", 110px) 130px",
                  minWidth: 520 + ae.length * 110,
                },
              },
              React.createElement(
                "div",
                {
                  style: {
                    ...te,
                    padding: "8px 18px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "CENTRO DE COSTO / PROVEEDOR",
              ),
              React.createElement(
                "div",
                {
                  style: {
                    ...G,
                    padding: "8px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    textAlign: "right",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "SALDO",
              ),
              ae.map((s) =>
                React.createElement(
                  "div",
                  {
                    key: s,
                    style: {
                      ...G,
                      padding: "8px 6px",
                      fontSize: 11,
                      fontWeight: 700,
                      color: MUTED,
                      textAlign: "center",
                      borderBottom: "1px solid " + BORDER,
                      borderRight: "1px solid " + BORDER,
                    },
                  },
                  semanaLabelCorta(s),
                ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    ...G,
                    padding: "8px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    textAlign: "right",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "RESTA",
              ),
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
          overflow: "hidden",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            padding: "12px 18px",
            fontWeight: 700,
            color: NAVY,
            background: "#EFEDE7",
            fontSize: 13,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            letterSpacing: 0.3,
            flexWrap: "wrap",
            gap: 10,
          },
        },
        React.createElement("span", null, "CASH"),
        React.createElement(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" } },
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 400 } },
            React.createElement(
              "span",
              { style: { color: MUTED } },
              "Saldo inicial (antes de la primera semana visible, puede ser negativo):",
            ),
            g
              ? React.createElement(MilesInput, {
                  style: { ...inputStyle, width: 140 },
                  value: nt,
                  onChange: (s) => H(s),
                  onFocus: (s) => s.target.select(),
                })
              : React.createElement("b", null, fmt(Number(nt) || 0)),
          ),
          React.createElement(
            "div",
            { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 400 } },
            React.createElement(
              "span",
              { style: { color: MUTED } },
              "Acuerdo total disponible (suma del disponible de todos los bancos):",
            ),
            React.createElement("b", null, fmt(Fo)),
          ),
        ),
      ),
      React.createElement(
        "div",
        { className: "cf-hscroll", ref: (s) => {
          (attachDragScroll(s), syncScrollGroup("cash", s));
        }, style: { overflowX: "scroll" } },
        React.createElement(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "260px repeat(" + ae.length + ", 110px)",
              minWidth: 260 + ae.length * 110,
            },
          },
          React.createElement("div", {
            style: {
              ...G,
              padding: "8px 18px",
              borderBottom: "1px solid " + BORDER,
              borderRight: "1px solid " + BORDER,
            },
          }),
          ae.map((s) =>
            React.createElement(
              "div",
              {
                key: s,
                style: {
                  ...G,
                  padding: "8px 6px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: MUTED,
                  textAlign: "center",
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                },
              },
              "Sem. ",
              semanaLabelCorta(s),
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 18px",
                fontSize: 12.5,
                fontWeight: 600,
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            },
            "Ingresos",
          ),
          eo.map((s) =>
            React.createElement(
              "div",
              {
                key: s.semana,
                style: {
                  padding: "6px 6px",
                  fontSize: 12,
                  textAlign: "right",
                  color: GREEN,
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                },
              },
              fmt(s.ingresos),
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 18px",
                fontSize: 12.5,
                fontWeight: 600,
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
                background: ZEBRA,
              },
            },
            "Egresos",
          ),
          eo.map((s) =>
            React.createElement(
              "div",
              {
                key: s.semana,
                style: {
                  padding: "6px 6px",
                  fontSize: 12,
                  textAlign: "right",
                  color: RED,
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                  background: ZEBRA,
                },
              },
              fmt(s.egresos),
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 18px",
                fontSize: 12.5,
                fontWeight: 700,
                color: NAVY,
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            },
            "Neto semanal",
          ),
          eo.map((s) =>
            React.createElement(
              "div",
              {
                key: s.semana,
                style: {
                  padding: "6px 6px",
                  fontSize: 12,
                  textAlign: "right",
                  fontWeight: 700,
                  color: s.neto >= 0 ? GREEN : RED,
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                },
              },
              fmt(s.neto),
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 18px",
                fontSize: 12.5,
                fontWeight: 700,
                background: "#F1E9D2",
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            },
            "Saldo acumulado",
          ),
          vo.map((s, b) =>
            React.createElement(
              "div",
              {
                key: b,
                style: {
                  padding: "6px 6px",
                  fontSize: 12,
                  textAlign: "right",
                  fontWeight: 700,
                  background: "#F1E9D2",
                  color: s >= 0 ? NAVY : RED,
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                },
              },
              fmt(s),
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 18px",
                fontSize: 12.5,
                fontWeight: 600,
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            },
            "Caja",
          ),
          vo.map((s, b) =>
            React.createElement(
              "div",
              {
                key: b,
                style: {
                  padding: "6px 6px",
                  fontSize: 12,
                  textAlign: "right",
                  color: GREEN,
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                },
              },
              fmt(Math.max(s, 0)),
            ),
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 18px",
                fontSize: 12.5,
                fontWeight: 600,
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
                background: ZEBRA,
              },
            },
            "Utilizar acuerdo",
          ),
          vo.map((s, b) => {
            const R = Math.max(-s, 0),
              j = R > Fo;
            return React.createElement(
              "div",
              {
                key: b,
                style: {
                  padding: "6px 6px",
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                  background: ZEBRA,
                },
              },
              React.createElement(
                "div",
                { style: { fontSize: 12, textAlign: "right", fontWeight: j ? 700 : 400, color: j ? RED : GREEN } },
                fmt(R),
              ),
              React.createElement(
                "div",
                { style: { fontSize: 10, textAlign: "right", color: RED, visibility: j ? "visible" : "hidden" } },
                j ? "Faltan " + fmt(R - Fo) : " ",
              ),
            );
          }),
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
          overflow: "hidden",
          marginTop: 20,
          maxWidth: 480,
        },
      },
      React.createElement(
        "div",
        {
          style: {
            padding: "10px 16px",
            fontWeight: 700,
            color: NAVY,
            background: "#EFEDE7",
            fontSize: 12.5,
            letterSpacing: 0.3,
          },
        },
        "BANCOS",
      ),
      React.createElement(
        "div",
        { className: "cf-hscroll", ref: attachDragScroll, style: { overflowX: "scroll" } },
        React.createElement(
          "div",
          { style: { display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 26px" } },
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 14px",
                fontSize: 10,
                fontWeight: 700,
                color: MUTED,
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            },
            "BANCO",
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 5px",
                fontSize: 10,
                fontWeight: 700,
                color: MUTED,
                textAlign: "right",
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            },
            "ACUERDO",
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 5px",
                fontSize: 10,
                fontWeight: 700,
                color: MUTED,
                textAlign: "right",
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            },
            "USADO",
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 5px",
                fontSize: 10,
                fontWeight: 700,
                color: MUTED,
                textAlign: "right",
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            },
            "DISP.",
          ),
          React.createElement("div", { style: { borderBottom: "1px solid " + BORDER } }),
          Ee.map((s, b) => {
            const R = (Number(s.acuerdo) || 0) - (Number(s.utilizado) || 0),
              j = b % 2 === 1 ? ZEBRA : "#fff";
            return React.createElement(
              React.Fragment,
              { key: s.id },
              React.createElement(
                "div",
                {
                  style: {
                    padding: "3px 5px 3px 14px",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                    background: j,
                  },
                },
                g
                  ? React.createElement("input", {
                      placeholder: "Banco",
                      className: "cf-cell-input",
                      style: { ...go, fontSize: 11.5 },
                      value: s.nombre,
                      onChange: (Q) => Ho(s.id, "nombre", Q.target.value),
                    })
                  : React.createElement("span", { style: { fontSize: 11.5 } }, s.nombre),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    padding: "3px 5px",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                    background: j,
                  },
                },
                g
                  ? React.createElement(MilesInput, {
                      className: "cf-cell-input",
                      style: { ...go, textAlign: "right", fontSize: 11.5 },
                      value: s.acuerdo,
                      onChange: (Q) => Ho(s.id, "acuerdo", Q),
                      onFocus: (Q) => Q.target.select(),
                    })
                  : React.createElement(
                      "div",
                      { style: { textAlign: "right", fontSize: 11.5 } },
                      fmt(Number(s.acuerdo) || 0),
                    ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    padding: "3px 5px",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                    background: j,
                  },
                },
                g
                  ? React.createElement(MilesInput, {
                      className: "cf-cell-input",
                      style: { ...go, textAlign: "right", fontSize: 11.5 },
                      value: s.utilizado,
                      onChange: (Q) => Ho(s.id, "utilizado", Q),
                      onFocus: (Q) => Q.target.select(),
                    })
                  : React.createElement(
                      "div",
                      { style: { textAlign: "right", fontSize: 11.5 } },
                      fmt(Number(s.utilizado) || 0),
                    ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    padding: "3px 5px",
                    textAlign: "right",
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: R >= 0 ? NAVY : RED,
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                    background: j,
                  },
                },
                fmt(R),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    padding: "3px 2px",
                    borderBottom: "1px solid " + BORDER,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: j,
                  },
                },
                g &&
                  React.createElement(
                    "button",
                    {
                      onClick: () => nn(s.id),
                      style: { border: "none", background: "none", cursor: "pointer", color: RED, display: "flex" },
                    },
                    React.createElement(Trash2, { size: 12 }),
                  ),
              ),
            );
          }),
          React.createElement(
            "div",
            { style: { padding: "6px 14px", fontSize: 11.5, fontWeight: 700, color: NAVY, background: "#F1E9D2" } },
            "TOTAL",
          ),
          React.createElement(
            "div",
            {
              style: { padding: "6px 5px", fontSize: 11.5, fontWeight: 700, textAlign: "right", background: "#F1E9D2" },
            },
            fmt(qo),
          ),
          React.createElement(
            "div",
            {
              style: { padding: "6px 5px", fontSize: 11.5, fontWeight: 700, textAlign: "right", background: "#F1E9D2" },
            },
            fmt(ao),
          ),
          React.createElement(
            "div",
            {
              style: {
                padding: "6px 5px",
                fontSize: 11.5,
                fontWeight: 700,
                textAlign: "right",
                background: "#F1E9D2",
                color: Fo >= 0 ? NAVY : RED,
              },
            },
            fmt(Fo),
          ),
          React.createElement("div", { style: { background: "#F1E9D2" } }),
        ),
      ),
      g &&
        React.createElement(
          "div",
          { style: { padding: "8px 14px" } },
          React.createElement(
            "button",
            { onClick: zo, style: smallBtnGhost },
            React.createElement(Plus, { size: 13 }),
            " Agregar banco",
          ),
        ),
    ),
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "center", marginTop: 20 } },
      React.createElement(
        "button",
        {
          onClick: () => Uo((s) => !s),
          style: {
            background: Zt ? NAVY : "#fff",
            color: Zt ? "#fff" : NAVY,
            border: "1px solid " + NAVY,
            padding: "10px 26px",
            borderRadius: 30,
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          },
        },
        Zt ? "Cerrar simulación" : "Simular",
      ),
    ),
    Zt &&
      React.createElement(
        "div",
        {
          style: {
            background: "#fff",
            borderRadius: 12,
            border: "1px solid " + BORDER,
            boxShadow: CARD_SHADOW,
            overflow: "hidden",
            marginTop: 16,
          },
        },
        React.createElement(
          "div",
          {
            style: {
              padding: "12px 18px",
              fontWeight: 700,
              color: NAVY,
              background: "#EFEDE7",
              fontSize: 13,
              letterSpacing: 0.3,
            },
          },
          "SIMULACIÓN DE CASH",
        ),
        React.createElement(
          "div",
          { style: { padding: "12px 18px", fontSize: 11.5, color: MUTED, borderBottom: "1px solid " + BORDER } },
          "Agregá líneas de ingresos hipotéticos en las semanas que quieras, para ver cómo quedaría el Saldo Acumulado y el uso del Acuerdo Bancario si se concretan. No modifica los Ingresos ni Egresos reales de arriba.",
        ),
        React.createElement(
          "div",
          {
            className: "cf-hscroll cf-nobar",
            ref: (s) => {
              (attachDragScroll(s), syncScrollGroup("cash", s));
            },
            style: { overflowX: "scroll" },
          },
          React.createElement(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "260px repeat(" + ae.length + ", 110px) 40px",
                minWidth: 300 + ae.length * 110,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  ...G,
                  padding: "8px 18px",
                  fontSize: 11,
                  fontWeight: 700,
                  color: MUTED,
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                },
              },
              "LÍNEA DE INGRESO SIMULADO",
            ),
            ae.map((s) =>
              React.createElement(
                "div",
                {
                  key: s,
                  style: {
                    ...G,
                    padding: "8px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    textAlign: "center",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                semanaLabelCorta(s),
              ),
            ),
            React.createElement("div", { style: { ...G, borderBottom: "1px solid " + BORDER } }),
            qt.length === 0
              ? React.createElement(
                  "div",
                  { style: { gridColumn: "1 / -1", padding: 16, fontSize: 12.5, color: MUTED } },
                  "Todavía no agregaste ninguna línea de ingreso a simular.",
                )
              : qt.map((s, b) => {
                  const R = b % 2 === 1 ? ZEBRA : "#fff";
                  return React.createElement(
                    React.Fragment,
                    { key: s.id },
                    React.createElement(
                      "div",
                      {
                        style: {
                          padding: "4px 18px",
                          borderBottom: "1px solid " + BORDER,
                          borderRight: "1px solid " + BORDER,
                          background: R,
                        },
                      },
                      React.createElement("input", {
                        placeholder: "Ej: Nuevo cliente / adelanto",
                        className: "cf-cell-input",
                        style: { ...go, fontSize: 12 },
                        value: s.nombre,
                        onChange: (j) => yn(s.id, j.target.value),
                      }),
                    ),
                    ae.map((j, Q) =>
                      React.createElement(
                        "div",
                        {
                          key: j,
                          style: {
                            padding: "7px 6px",
                            borderBottom: "1px solid " + BORDER,
                            borderRight: "1px solid " + BORDER,
                            background: R,
                          },
                        },
                        React.createElement(MilesInput, {
                          className: "cf-cell-input",
                          style: { ...go, textAlign: "right", fontSize: 11.5, color: GREEN },
                          value: s.valores[j] ?? "",
                          onChange: (J) => _e(s.id, j, J),
                          onPaste: (J) => we(J, Q, b),
                        }),
                      ),
                    ),
                    React.createElement(
                      "div",
                      {
                        style: {
                          padding: "4px 6px",
                          borderBottom: "1px solid " + BORDER,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: R,
                        },
                      },
                      React.createElement(
                        "button",
                        {
                          onClick: () => xt(s.id),
                          style: { border: "none", background: "none", cursor: "pointer", color: RED, display: "flex" },
                        },
                        React.createElement(Trash2, { size: 13 }),
                      ),
                    ),
                  );
                }),
            qt.length > 0 &&
              React.createElement(
                React.Fragment,
                null,
                React.createElement(
                  "div",
                  {
                    style: {
                      padding: "7px 18px",
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: NAVY,
                      background: "#F1E9D2",
                      borderRight: "1px solid " + BORDER,
                    },
                  },
                  "TOTAL INGRESOS SIMULADOS",
                ),
                ae.map((s) =>
                  React.createElement(
                    "div",
                    {
                      key: s,
                      style: {
                        padding: "7px 6px",
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: "right",
                        background: "#F1E9D2",
                        borderRight: "1px solid " + BORDER,
                        color: GREEN,
                      },
                    },
                    fmt(Mo[s] || 0),
                  ),
                ),
                React.createElement("div", { style: { background: "#F1E9D2" } }),
              ),
          ),
        ),
        React.createElement(
          "div",
          { style: { padding: "10px 18px" } },
          React.createElement(
            "button",
            { onClick: pn, style: smallBtnPrimary },
            React.createElement(Plus, { size: 13 }),
            " Agregar línea de ingreso",
          ),
        ),
        React.createElement(
          "div",
          {
            className: "cf-hscroll",
            ref: (s) => {
              (attachDragScroll(s), syncScrollGroup("cash", s));
            },
            style: { overflowX: "scroll", borderTop: "1px solid " + BORDER },
          },
          React.createElement(
            "div",
            {
              style: {
                display: "grid",
                gridTemplateColumns: "260px repeat(" + ae.length + ", 110px)",
                minWidth: 260 + ae.length * 110,
              },
            },
            React.createElement("div", {
              style: {
                ...G,
                padding: "8px 18px",
                borderBottom: "1px solid " + BORDER,
                borderRight: "1px solid " + BORDER,
              },
            }),
            ae.map((s) =>
              React.createElement(
                "div",
                {
                  key: s,
                  style: {
                    ...G,
                    padding: "8px 6px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: MUTED,
                    textAlign: "center",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                "Sem. ",
                semanaLabelCorta(s),
              ),
            ),
            React.createElement(
              "div",
              {
                style: {
                  padding: "6px 18px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                },
              },
              "Saldo acumulado (real)",
            ),
            vo.map((s, b) =>
              React.createElement(
                "div",
                {
                  key: b,
                  style: {
                    padding: "6px 6px",
                    fontSize: 12,
                    textAlign: "right",
                    color: s >= 0 ? MUTED : RED,
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                fmt(s),
              ),
            ),
            React.createElement(
              "div",
              {
                style: {
                  padding: "6px 18px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: NAVY,
                  background: "#F1E9D2",
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                },
              },
              "Saldo acumulado (con simulación)",
            ),
            Yo.map((s, b) =>
              React.createElement(
                "div",
                {
                  key: b,
                  style: {
                    padding: "6px 6px",
                    fontSize: 12,
                    textAlign: "right",
                    fontWeight: 700,
                    background: "#F1E9D2",
                    color: s >= 0 ? NAVY : RED,
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                  },
                },
                fmt(s),
              ),
            ),
            React.createElement(
              "div",
              {
                style: {
                  padding: "6px 18px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  borderBottom: "1px solid " + BORDER,
                  borderRight: "1px solid " + BORDER,
                  background: ZEBRA,
                },
              },
              "Utilizar acuerdo (con simulación)",
            ),
            Yo.map((s, b) => {
              const R = Math.max(-s, 0),
                j = R > Fo;
              return React.createElement(
                "div",
                {
                  key: b,
                  style: {
                    padding: "6px 6px",
                    borderBottom: "1px solid " + BORDER,
                    borderRight: "1px solid " + BORDER,
                    background: ZEBRA,
                  },
                },
                React.createElement(
                  "div",
                  { style: { fontSize: 12, textAlign: "right", fontWeight: j ? 700 : 400, color: j ? RED : GREEN } },
                  fmt(R),
                ),
                React.createElement(
                  "div",
                  { style: { fontSize: 10, textAlign: "right", color: RED, visibility: j ? "visible" : "hidden" } },
                  j ? "Faltan " + fmt(R - Fo) : " ",
                ),
              );
            }),
          ),
        ),
      ),
    React.createElement(CashSlides, { data: Wn, refs: Kt }),
    React.createElement(
      "div",
      { style: { display: "flex", justifyContent: "flex-end", marginTop: 24 } },
      React.createElement(
        "button",
        {
          onClick: Zo,
          disabled: Ot,
          style: {
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: NAVY,
            color: "#fff",
            border: "1px solid " + GOLD,
            padding: "12px 20px",
            borderRadius: 30,
            fontWeight: 700,
            fontSize: 13,
            cursor: Ot ? "default" : "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            opacity: Ot ? 0.7 : 1,
          },
        },
        React.createElement(Download, { size: 15 }),
        " ",
        Ot ? "Generando presentación..." : "Descargar presentación del Cash (PDF)",
      ),
    ),
    kt &&
      React.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            background: "rgba(20,20,20,0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          onClick: () => Oe(null),
        },
        React.createElement(
          "div",
          {
            style: { background: "#fff", borderRadius: 12, width: "90%", maxWidth: 420, padding: 20 },
            onClick: (s) => s.stopPropagation(),
          },
          React.createElement(
            "div",
            { style: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 } },
            "Comentario",
          ),
          React.createElement("div", { style: { fontSize: 11.5, color: MUTED, marginBottom: 10 } }, kt.titulo),
          React.createElement("textarea", {
            autoFocus: true,
            value: jt,
            onChange: (s) => q(s.target.value),
            disabled: !g,
            placeholder: "Escribí una aclaración para esta celda...",
            style: {
              ...inputStyle,
              width: "100%",
              minHeight: 90,
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "inherit",
            },
          }),
          React.createElement(
            "div",
            { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 } },
            React.createElement("button", { onClick: () => Oe(null), style: smallBtnGhost }, "Cerrar"),
            g &&
              k[kt.clave] &&
              React.createElement(
                "button",
                { onClick: bo, style: { ...smallBtnGhost, color: RED, borderColor: RED } },
                "Borrar comentario",
              ),
            g && React.createElement("button", { onClick: Ve, style: smallBtnPrimary }, "Guardar"),
          ),
        ),
      ),
    l &&
      React.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            background: "rgba(20,20,20,0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          onClick: () => I(null),
        },
        React.createElement(
          "div",
          {
            style: { background: "#fff", borderRadius: 12, width: "90%", maxWidth: 420, padding: 20 },
            onClick: (s) => s.stopPropagation(),
          },
          React.createElement(
            "div",
            { style: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 } },
            "Comentario",
          ),
          React.createElement("div", { style: { fontSize: 11.5, color: MUTED, marginBottom: 10 } }, l.titulo),
          React.createElement("textarea", {
            autoFocus: true,
            value: U,
            onChange: (s) => ce(s.target.value),
            disabled: !g,
            placeholder: "Escribí una aclaración para esta celda...",
            style: {
              ...inputStyle,
              width: "100%",
              minHeight: 90,
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "inherit",
            },
          }),
          React.createElement(
            "div",
            { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 } },
            React.createElement("button", { onClick: () => I(null), style: smallBtnGhost }, "Cerrar"),
            g &&
              ne[l.clave] &&
              React.createElement(
                "button",
                { onClick: Ke, style: { ...smallBtnGhost, color: RED, borderColor: RED } },
                "Borrar comentario",
              ),
            g && React.createElement("button", { onClick: ge, style: smallBtnPrimary }, "Guardar"),
          ),
        ),
      ),
    Y &&
      React.createElement(
        "div",
        {
          style: {
            position: "fixed",
            inset: 0,
            background: "rgba(20,20,20,0.6)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          onClick: () => se(null),
        },
        React.createElement(
          "div",
          {
            style: { background: "#fff", borderRadius: 12, width: "90%", maxWidth: 420, padding: 20 },
            onClick: (s) => s.stopPropagation(),
          },
          React.createElement(
            "div",
            { style: { fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 } },
            "Comentario",
          ),
          React.createElement("div", { style: { fontSize: 11.5, color: MUTED, marginBottom: 10 } }, Y.titulo),
          React.createElement("textarea", {
            autoFocus: true,
            value: be,
            onChange: (s) => Ue(s.target.value),
            disabled: !g,
            placeholder: "Escribí una aclaración para esta celda...",
            style: {
              ...inputStyle,
              width: "100%",
              minHeight: 90,
              resize: "vertical",
              boxSizing: "border-box",
              fontFamily: "inherit",
            },
          }),
          React.createElement(
            "div",
            { style: { display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 } },
            React.createElement("button", { onClick: () => se(null), style: smallBtnGhost }, "Cerrar"),
            g &&
              Pe[Y.clave] &&
              React.createElement(
                "button",
                { onClick: Io, style: { ...smallBtnGhost, color: RED, borderColor: RED } },
                "Borrar comentario",
              ),
            g && React.createElement("button", { onClick: pt, style: smallBtnPrimary }, "Guardar"),
          ),
        ),
      ),
  );
}
