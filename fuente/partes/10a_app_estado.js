function App() {
  const [vista, setVista] = useState("obras"),
    [obras, setObras] = useState(SEED_OBRAS),
    [g, C] = useState(() => SEED_FACTURAS.map((e, t) => ({ ...e, id: t }))),
    [proveedoresMap, setProveedoresMap] = useState(SEED_PROVEEDORES),
    [pagosMap, setPagosMap] = useState(SEED_PAGOS),
    [pagosSemanales, setPagosSemanales] = useState([]),
    [proveedoresInfoMap, setProveedoresInfoMap] = useState({}),
    [adicionalesMap, setAdicionalesMap] = useState(SEED_ADICIONALES),
    [ordenesCompraMap, setOrdenesCompraMap] = useState({}),
    [costoSubobrasMap, setCostoSubobrasMap] = useState({}),
    [subCostoProveedoresMap, setSubCostoProveedoresMap] = useState({}),
    [subCostoPagosMap, setSubCostoPagosMap] = useState({}),
    [eerrMensual, setEerrMensual] = useState(SEED_EERR),
    [cfIngresosValores, setCfIngresosValores] = useState({}),
    [cfIngresosComentarios, setCfIngresosComentarios] = useState({}),
    [cfIngresosCategorias, setCfIngresosCategorias] = useState(["AFORO"]),
    [cfIngresosCategoriasValores, setCfIngresosCategoriasValores] = useState({}),
    [cfIngresosCategoriasComentarios, setCfIngresosCategoriasComentarios] = useState({}),
    [cfEgresosCategorias, setCfEgresosCategorias] = useState([
      "CHEQUES Y ARRASTRE",
      "SUELDOS",
      "ALQUILER",
      "EXPENSAS",
      "IMPUESTOS",
      "CARGAS SOCIALES",
      "PRESTAMOS",
      "TARJETAS DE CREDITO",
      "MARKETING",
      "VARIOS",
    ]),
    [cfEgresosValores, setCfEgresosValores] = useState({}),
    [cfEgresosComentarios, setCfEgresosComentarios] = useState({}),
    [mzLatamOcultoMap, setMzLatamOcultoMap] = useState({}),
    [cfSalidasValores, setCfSalidasValores] = useState({}),
    [cfSaldoInicial, setCfSaldoInicial] = useState(0),
    [cfBancos, setCfBancos] = useState([]),
    [cfSimulacionLineas, setCfSimulacionLineas] = useState([]),
    ht = useRef(null),
    [St, zt] = useState(107);
  (useEffect(() => {
    const e = ht.current;
    if (!e) return;
    const t = () => {
      const r = e.getBoundingClientRect().height;
      zt((i) => (Math.abs(i - r) > 0.5 ? r : i));
    };
    t();
    const o = new ResizeObserver(t);
    (o.observe(e),
      window.addEventListener("resize", t),
      document.addEventListener("visibilitychange", t),
      window.addEventListener("scroll", t, true));
    const a = [100, 300, 800, 1500, 3e3].map((r) => setTimeout(t, r));
    return () => {
      (o.disconnect(),
        window.removeEventListener("resize", t),
        document.removeEventListener("visibilitychange", t),
        window.removeEventListener("scroll", t, true),
        a.forEach(clearTimeout));
    };
  }, []),
    useLayoutEffect(() => {
      const e = ht.current;
      if (!e) return;
      const t = e.getBoundingClientRect().height;
      Math.abs(St - t) > 0.5 && zt(t);
    }));
  const [gn, bn] = useState(() => dateAFechaStr(viernesDeLaSemana(/* @__PURE__ */ new Date()))),
    [cfDiasPagoCliente, setCfDiasPagoCliente] = useState({}),
    [cfRegPag, setCfRegPag] = useState({}),
    [proveedoresCatalogo, setProveedoresCatalogo] = useState(SEED_CATALOGO_PROVEEDORES),
    [pmCatalogo, setPmCatalogo] = useState([]),
    [ddoCatalogo, setDdoCatalogo] = useState([]),
    [reglasProveedoresPago, setReglasProveedoresPago] = useState([]),
    [correccionesAprendidas, setCorreccionesAprendidas] = useState({ cliente: {}, centroCosto: {}, subObra: {}, imputacion: {}, proveedor: {} }),
    [tipoCambio, setTipoCambio] = useState(0),
    [moneda, setMoneda] = useState("ARS"),
    [Ve, bo] = useState(false),
    [l, I] = useState(""),
    [tcFecha, setTcFecha] = useState(""),
    [me, ge] = useState(false),
    [Ke, Y] = useState(""),
    [se, be] = useState(null),
    [Ue, it] = useState(null),
    [pt, Io] = useState(() => {
      const e = /* @__PURE__ */ new Date().getFullYear(),
        t = Array.from(new Set(SEED_OBRAS.map((a) => a.anio || e))),
        o = {};
      return (
        t.forEach((a) => {
          o[a] = a === e;
        }),
        o
      );
    }),
    [Ot, no] = useState(null),
    [Kt, ae] = useState("facturas"),
    [Qt, lo] = useState(false),
    [Wt, tn] = useState(false),
    [Lo, B] = useState(null),
    [re, ot] = useState(false),
    [Ht, $t] = useState(null),
    [eo, vo] = useState(false),
    [qo, ao] = useState(null),
    [Fo, zo] = useState(null),
    [Ho, nn] = useState(null),
    [Zt, Uo] = useState({}),
    [pn, yn] = useState({}),
    [_e, xt] = useState({}),
    [we, Mo] = useState({}),
    [Yo, yo] = useState({}),
    [Do, dn] = useState({}),
    [Fn, Yn] = useState({}),
    [vn, Wn] = useState({}),
    [Zo, s] = useState(null),
    [b, R] = useState({}),
    [j, Q] = useState(""),
    [J, fe] = useState(2025),
    [ke, We] = useState(false),
    [wt, It] = useState(null),
    [et, gt] = useState(null),
    [Ut, Yt] = useState(false),
    Tt = useRef(Array.from({ length: 8 }, () => React.createRef())).current;
  function ue(e, t) {
    Mo((o) => {
      const a = o[e],
        r = a && a.key === t && a.dir === "asc" ? "desc" : "asc";
      return { ...o, [e]: { key: t, dir: r } };
    });
  }
  function So(e, t) {
    const o = we[e];
    return o
      ? [...t].sort((a, r) => {
          let i = a[o.key],
            u = r[o.key];
          return (
            typeof i == "string" && (i = i.toLowerCase()),
            typeof u == "string" && (u = u.toLowerCase()),
            i == null ? 1 : u == null ? -1 : i < u ? (o.dir === "asc" ? -1 : 1) : i > u ? (o.dir === "asc" ? 1 : -1) : 0
          );
        })
      : t;
  }
  const [Wo, ln] = useState(false),
    [Jo, xo] = useState({}),
    [Vt, st] = useState({}),
    [datosCargados, setDatosCargados] = useState(false),
    [Dt, ho] = useState(null),
    [ct, ko] = useState("operaciones"),
    [Go, $o] = useState(null),
    [cn, on] = useState(""),
    [En, kn] = useState(false),
    [roles, setRoles] = useState([]),
    [ga, Kn] = useState(null),
    [Qa, fa] = useState(false),
    [$a, ma] = useState(false),
    [er, tr] = useState({}),
    [registros, setRegistros] = useState([]),
    [or, va] = useState(false),
    [cambiosFinancieros, setCambiosFinancieros] = useState([]),
    [nr, ya] = useState(false),
    fn = ct === "admin",
    so = (ct === "custom" && roles.find((e) => e.id === ga)) || null;
  function Zn(e) {
    return ct === "admin" || ct === "comercial"
      ? "editar"
      : (ct === "custom" && so && ((so.permisosPorSeccion || {})[e] || so.permiso)) || "lectura";
  }
  // Sección 108: solo guardan en la base las pantallas con algún permiso de edición. Una pantalla de solo
  // lectura (Operaciones, roles con todo en "lectura", o la que todavía no ingresó el PIN) nunca escribe:
  // antes podía guardar los datos que tenía (aunque fueran viejos) y pisar cambios de otros.
  const puedeGuardar =
    ct === "admin" ||
    ct === "comercial" ||
    (ct === "custom" && !!so && (so.permiso === "editar" || Object.values(so.permisosPorSeccion || {}).includes("editar")));
  const Rt = Zn(vista) === "editar",
    Sn = ct === "admin" || ct === "comercial" || (ct === "custom" && !!so && !!so.puedeFijarTipoCambio),
    verRegaliasPresentacion =
      ct === "admin" || ct === "comercial" || (ct === "custom" && !!so && !!so.puedeRegaliasPresentacion);
  function In(e) {
    return fn ? true : ct === "custom" && !!so && !!(so.herramientasAdmin && so.herramientasAdmin[e]);
  }
  const Jn0 =
    ct === "custom" && so && so.secciones
      ? so.secciones
      : {
          obras: true,
          facturacion: true,
          proveedores: true,
          cashflow: true,
          pagos: true,
          eerr: true,
          operaciones: true,
          // Sección "Verónica": solo Admin (de los roles fijos); en los roles creados, si se la habilita.
          veronica: fn,
        },
    // En Producción la sección Verónica está apagada (ver VERONICA_EN_PRODUCCION en 20_veronica.js).
    Jn = VERONICA_HABILITADA ? Jn0 : { ...Jn0, veronica: false };
  (useEffect(() => {
    if (!Jn[vista]) {
      const e = ["obras", "facturacion", "proveedores", "cashflow", "pagos", "eerr", "operaciones", "veronica"].find((t) => Jn[t]);
      e && setVista(e);
    }
  }, [ct, so && so.id]),
    (monedaState.moneda = moneda),
    (monedaState.tipoCambio = Number(tipoCambio) || 0));
  const dbRef = useRef(null),
    ignorarProximoGuardadoRef = useRef(false),
    $n = useRef(false),
    Sa = useRef(null),
    guardandoRef = useRef(false),
    semillaFacturasRef = useRef(false),
    [estadoConexion, setEstadoConexion] = useState("connecting"),
    [avisoGuardado, setAvisoGuardado] = useState(null),
    [errorGuardado, setErrorGuardado] = useState(null),
    [reintentoGuardado, setReintentoGuardado] = useState(0),
    [fallasGuardado, setFallasGuardado] = useState([]),
    baseGuardadaRef = useRef(null),
    misGuardadosRef = useRef([]),
    reintentandoRef = useRef(false),
    contadorSellosRef = useRef(0),
    guardadoEnCursoRef = useRef(null),
    choquesRef = useRef(0),
    detalleChoqueRef = useRef(false),
    puedeGuardarRef = useRef(false),
    clavesSinGuardarRef = useRef(() => []),
    miPantallaRef = useRef(Math.random().toString(36).slice(2)),
    sellosConfirmadosRef = useRef({}),
    [avisoPisado, setAvisoPisado] = useState(null),
    [otraPestana, setOtraPestana] = useState(false),
    [versionNueva, setVersionNueva] = useState(false),
    [avisoDescartado, setAvisoDescartado] = useState(null),
    estadoLocalRef = useRef(null),
    partesEstadoRef = useRef({ main: null, ext: {}, listos: new Set(), mudando: false, desuscribir: [] }),
    deshaciendoRef = useRef(false),
    [historialDeshacer, setHistorialDeshacer] = useState([]),
    // Sección 96: lo deshecho se puede rehacer (hasta que se haga un cambio nuevo).
    [historialRehacer, setHistorialRehacer] = useState([]),
    rehaciendoRef = useRef(false),
    [avisoDeshacer, setAvisoDeshacer] = useState(null);
  puedeGuardarRef.current = puedeGuardar;
  function deshacerUltimoCambio() {
    if (historialDeshacer.length === 0) return;
    const e = historialDeshacer[historialDeshacer.length - 1],
      actual = estadoLocalRef.current ? JSON.parse(JSON.stringify(estadoLocalRef.current)) : null;
    ((deshaciendoRef.current = true),
      actual &&
        setHistorialRehacer((t) => {
          const u = [...t, { payload: actual, ts: Date.now(), tsDeshecho: e.ts }];
          return u.length > 15 ? u.slice(u.length - 15) : u;
        }),
      aplicarEstadoGuardado(e.payload),
      setHistorialDeshacer((t) => t.slice(0, -1)),
      setAvisoDeshacer(
        "Se deshizo el cambio guardado el " +
          new Date(e.ts).toLocaleString("es-AR") +
          ". Podés seguir deshaciendo con más clics.",
      ));
  }
  function rehacerUltimoCambio() {
    if (historialRehacer.length === 0) return;
    const e = historialRehacer[historialRehacer.length - 1];
    // Al rehacer, el guardado normal vuelve a anotar en "Deshacer" el estado anterior (se puede volver a deshacer).
    ((rehaciendoRef.current = true),
      aplicarEstadoGuardado(e.payload),
      setHistorialRehacer((t) => t.slice(0, -1)),
      setAvisoDeshacer("Se rehizo el cambio que se había deshecho." + (historialRehacer.length > 1 ? " Podés seguir rehaciendo con más clics." : "")));
  }
  // Sección 89: las órdenes de compra que empiezan con "MZ" (ej. MZ01) no tienen venta propia: es la
  // suma de lo que aportan a esa OC las sub obras que la tienen cargada. Se mantiene sola al agregar o
  // quitar sub obras o cambiar sus importes.
  useEffect(() => {
    const cambios = {};
    Object.entries(ordenesCompraMap || {}).forEach(([k, ocs]) => {
      (ocs || []).forEach((oc, i) => {
        const nombre = String((oc && oc.ordenCompra) || "").trim();
        if (!/^MZ/.test(normOC(nombre))) return;
        const suma =
          Math.round(
            (costoSubobrasMap[k] || [])
              .filter((sc) => ordenCompraIncluye(sc.ordenCompra, nombre))
              .reduce((a, sc) => a + (Number(montoDeSubCostoParaOC(sc, nombre)) || 0), 0) * 100,
          ) / 100;
        Math.abs((Number(oc.venta) || 0) - suma) > 0.004 && ((cambios[k] = cambios[k] || {})[i] = suma);
      });
    });
    Object.keys(cambios).length &&
      setOrdenesCompraMap((a) => {
        const b = { ...a };
        Object.entries(cambios).forEach(([k, m]) => {
          b[k] = (b[k] || []).map((oc, i) => (i in m ? { ...oc, venta: m[i] } : oc));
        });
        return b;
      });
  }, [ordenesCompraMap, costoSubobrasMap]);
  useEffect(() => {
    try {
      const e = window.localStorage.getItem("obras-role");
      if (e === "admin" || e === "comercial") ko(e);
      else if (e === "custom") {
        const t = window.localStorage.getItem("obras-role-custom-id");
        t && (ko("custom"), Kn(t));
      }
    } catch {}
  }, []);
  // Sección 101: si se cierra la página con cambios sin guardar (o con un guardado fallado), el navegador
  // pregunta antes de cerrar.
  useEffect(() => {
    const alCerrar = (ev) => {
      let pendiente = false;
      try {
        // Sección 107: solo avisa si hay un guardado en curso o cambios que de verdad no están en la base.
        pendiente = !!guardadoEnCursoRef.current || clavesSinGuardarRef.current().length > 0;
      } catch {}
      if (pendiente) {
        ev.preventDefault();
        ev.returnValue = "Hay cambios que todavía no se guardaron.";
        return ev.returnValue;
      }
    };
    window.addEventListener("beforeunload", alCerrar);
    return () => window.removeEventListener("beforeunload", alCerrar);
  }, []);
  // Sección 101: aviso si MIA está abierta en otra pestaña de este mismo navegador.
  useEffect(() => {
    if (typeof BroadcastChannel !== "function") return;
    const yo = Math.random().toString(36).slice(2),
      canal = new BroadcastChannel("mia-" + (window.__APP_ENV__ || "qa"));
    canal.onmessage = (m) => {
      const d = m.data || {};
      if (d.de === yo) return;
      d.tipo === "hola" && canal.postMessage({ tipo: "aca", de: yo });
      (d.tipo === "hola" || d.tipo === "aca") && setOtraPestana(true);
      d.tipo === "chau" && setOtraPestana(false);
    };
    canal.postMessage({ tipo: "hola", de: yo });
    const chau = () => canal.postMessage({ tipo: "chau", de: yo });
    window.addEventListener("pagehide", chau);
    return () => (chau(), window.removeEventListener("pagehide", chau), canal.close());
  }, []);
  // Sección 102: cada versión de MIA anota su número en la base; una pantalla con una versión anterior
  // (que no se recargó) muestra un aviso para recargar.
  useEffect(() => {
    if (!datosCargados || !dbRef.current || estadoConexion === "unavailable") return;
    const ref = dbRef.current.doc("app/versionMia");
    return ref.onSnapshot(
      (s) => {
        const v = Number(((s.exists && s.data()) || {}).v) || 0;
        v > VERSION_MIA ? setVersionNueva(true) : v < VERSION_MIA && ref.set({ v: VERSION_MIA, desde: Date.now() }).catch(() => {});
      },
      () => {},
    );
  }, [datosCargados, estadoConexion]);
  // Sección 102: "Recargar MIA en todas las pantallas" (Herramientas, Admin). Cada pantalla abierta se
  // recarga sola cuando no tiene cambios pendientes de guardar (si tiene, espera a que se guarden).
  const abiertaDesdeRef = useRef(Date.now());
  function clavesSinGuardar() {
    if (!puedeGuardarRef.current) return [];
    try {
      const loc = estadoLocalRef.current,
        base = baseGuardadaRef.current;
      return !!loc && !!base ? [...new Set(cambiosParaGuardar(JSON.parse(JSON.stringify(loc)), base).map(([r]) => r.join(" › ")))] : [];
    } catch {
      return [];
    }
  }
  clavesSinGuardarRef.current = clavesSinGuardar;
  function pendienteDeGuardar() {
    return guardandoRef.current || clavesSinGuardar().length > 0;
  }
  // Sección 107: control de cambios que quedan sin guardar. Si hay diferencias con la base durante más de
  // 15 segundos sin ningún guardado en curso, se anota (una vez) qué claves son en Fallas de guardado como
  // "Aviso interno" y se vuelve a intentar guardar. También queda window.__miaPendientes() para revisar.
  useEffect(() => {
    if (!datosCargados || !dbRef.current || estadoConexion === "unavailable") return;
    let desde = 0,
      anotado = "";
    typeof window < "u" && (window.__miaPendientes = () => ({ guardando: !!guardadoEnCursoRef.current, claves: clavesSinGuardar() }));
    const h = setInterval(() => {
      const claves = guardadoEnCursoRef.current || reintentandoRef.current ? [] : clavesSinGuardar();
      if (!claves.length) return void (desde = 0);
      desde || (desde = Date.now());
      if (Date.now() - desde < 15e3) return;
      const txt = claves.slice(0, 8).join(", ");
      txt !== anotado && ((anotado = txt), registrarInterno("cambios sin guardar hace 15 s: " + txt));
      desde = Date.now();
      setReintentoGuardado((n) => n + 1);
    }, 5e3);
    return () => clearInterval(h);
  }, [datosCargados, estadoConexion]);
  function recargarTodasLasPantallas() {
    if (!dbRef.current) return;
    window.confirm("¿Recargar MIA en todas las pantallas abiertas (de todos los usuarios)? Cada una se recarga cuando termina de guardar sus cambios.") &&
      dbRef.current
        .doc("app/recargarTodas")
        .set({ ts: Date.now(), de: miPantallaRef.current, por: lr() })
        .then(() => _t("Pidió recargar MIA en todas las pantallas"))
        .catch(() => alert("No se pudo enviar el pedido. Verificá la conexión."));
  }
  useEffect(() => {
    if (!datosCargados || !dbRef.current || estadoConexion === "unavailable") return;
    let espera = null;
    const quitar = dbRef.current.doc("app/recargarTodas").onSnapshot(
      (s) => {
        const d = (s.exists && s.data()) || {};
        if (!(Number(d.ts) > abiertaDesdeRef.current) || d.de === miPantallaRef.current || espera) return;
        const intentar = () => (pendienteDeGuardar() ? (espera = setTimeout(intentar, 2e3)) : window.location.reload());
        intentar();
      },
      () => {},
    );
    return () => (quitar(), espera && clearTimeout(espera));
  }, [datosCargados, estadoConexion]);
  function rr() {
    if (cn === ADMIN_PIN) {
      (ko("admin"), on(""), kn(false));
      try {
        (window.localStorage.setItem("obras-role", "admin"), window.localStorage.removeItem("obras-role-custom-id"));
      } catch {}
    } else if (cn === COMERCIAL_PIN) {
      (ko("comercial"), on(""), kn(false));
      try {
        (window.localStorage.setItem("obras-role", "comercial"),
          window.localStorage.removeItem("obras-role-custom-id"));
      } catch {}
    } else {
      // Sin distinguir mayúsculas ni espacios de más (en el celular el teclado suele poner la primera
      // letra en mayúscula: "Vero" tiene que entrar igual que "vero").
      const pinEscrito = String(cn || "").trim().toLowerCase(),
        e = roles.find((t) => String(t.pin || "").trim().toLowerCase() === pinEscrito);
      if (e) {
        (ko("custom"), Kn(e.id), on(""), kn(false));
        try {
          (window.localStorage.setItem("obras-role", "custom"),
            window.localStorage.setItem("obras-role-custom-id", e.id));
        } catch {}
      } else kn(true);
    }
  }
  function Ia() {
    (ko("operaciones"), Kn(null));
    try {
      (window.localStorage.setItem("obras-role", "operaciones"),
        window.localStorage.removeItem("obras-role-custom-id"));
    } catch {}
  }
  async function ir(e) {
    if (!dbRef.current) return;
    const t = e.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      { id: o, ...a } = e;
    (await dbRef.current
      .collection("roles")
      .doc(t)
      .set({ ...a, id: t }),
      _t((e.id ? "Editó" : "Creó") + ' rol "' + (a.nombre || "") + '"'));
  }
  async function sr(e) {
    if (!dbRef.current) return;
    const t = roles.find((o) => o.id === e);
    (await dbRef.current.collection("roles").doc(e).delete(),
      _t('Borró rol "' + (t ? t.nombre : e) + '"'),
      ct === "custom" && ga === e && Ia());
  }
  function aplicarEstadoGuardado(e) {
    (setObras(e.obras || SEED_OBRAS),
      setProveedoresMap(e.proveedoresMap || SEED_PROVEEDORES),
      setPagosMap(e.pagosMap || SEED_PAGOS),
      setPagosSemanales(
        (e.pagosSemanales || []).map((t) =>
          t.fechaPagado ? { ...t, fechaPagado: normalizarFecha(t.fechaPagado) } : t,
        ),
      ),
      setProveedoresInfoMap(e.proveedoresInfoMap || {}),
      setAdicionalesMap(e.adicionalesMap || SEED_ADICIONALES),
      setOrdenesCompraMap(e.subobrasMap || {}),
      setCostoSubobrasMap(e.costoSubobrasMap || {}),
      setSubCostoProveedoresMap(e.subCostoProveedoresMap || {}),
      setSubCostoPagosMap(e.subCostoPagosMap || {}),
      setProveedoresCatalogo(e.proveedoresCatalogo || SEED_CATALOGO_PROVEEDORES),
      setPmCatalogo(e.pmCatalogo || []),
      setDdoCatalogo(e.ddoCatalogo || []),
      setReglasProveedoresPago(e.reglasProveedoresPago || []),
      setCorreccionesAprendidas(e.correccionesAprendidas || { cliente: {}, centroCosto: {}, subObra: {}, imputacion: {}, proveedor: {} }),
      setEerrMensual(e.eerrMensual || SEED_EERR),
      setCfIngresosValores(e.cfIngresosValores || {}),
      setCfIngresosComentarios(e.cfIngresosComentarios || {}),
      setCfIngresosCategorias(e.cfIngresosCategorias || ["AFORO"]),
      setCfIngresosCategoriasValores(e.cfIngresosCategoriasValores || {}),
      setCfIngresosCategoriasComentarios(e.cfIngresosCategoriasComentarios || {}),
      setCfEgresosCategorias(
        e.cfEgresosCategorias || [
          "CHEQUES Y ARRASTRE",
          "SUELDOS",
          "ALQUILER",
          "EXPENSAS",
          "IMPUESTOS",
          "CARGAS SOCIALES",
          "PRESTAMOS",
          "TARJETAS DE CREDITO",
          "MARKETING",
          "VARIOS",
        ],
      ),
      setCfEgresosValores(e.cfEgresosValores || {}),
      setCfEgresosComentarios(e.cfEgresosComentarios || {}),
      setMzLatamOcultoMap(e.mzLatamOcultoMap || {}),
      setCfSalidasValores(e.cfSalidasValores || {}),
      setCfSaldoInicial(e.cfSaldoInicial || 0),
      setCfBancos(e.cfBancos || []),
      setCfSimulacionLineas(e.cfSimulacionLineas || []),
      setCfDiasPagoCliente(e.cfDiasPagoCliente || {}),
      setCfRegPag(e.cfRegaliasPagadas || {}),
      setTipoCambio(e.tipoCambio || 0),
      setTcFecha(e.tcFecha || ""),
      setRegistros(e.registros || []),
      setCambiosFinancieros(e.cambiosFinancieros || []));
  }
  function lr() {
    return ct === "admin"
      ? "Admin"
      : ct === "comercial"
        ? "Comercial"
        : ct === "custom" && so
          ? so.nombre
          : "Operaciones";
  }
  function _t(e) {
    const t = Date.now(),
      o = t - 4320 * 60 * 1e3;
    setRegistros((a) => {
      const i = [...a.filter((u) => u.fecha >= o), { fecha: t, rol: lr(), descripcion: e }];
      return i.length > 300 ? i.slice(i.length - 300) : i;
    });
  }
  (useEffect(() => {
    let e = null,
      t = null,
      o = null,
      a = false;
    return (
      (async () => {
        let r = null;
        try {
          if (typeof firebase < "u") {
            const i =
              firebase.apps && firebase.apps.length ? firebase.apps[0] : firebase.initializeApp(FIREBASE_CONFIG);
            (firebase.auth().currentUser || (await firebase.auth().signInAnonymously()),
              (r = scopedDb(firebase.firestore(i))));
          }
        } catch {
          r = null;
        }
        if (!a) {
          if (!r) {
            (setEstadoConexion("unavailable"), setDatosCargados(true));
            return;
          }
          dbRef.current = r;
          const partes = partesEstadoRef.current,
            aplicarRemoto = () => {
              if (!partes.main || partes.listos.size < ESTADO_EXTERNO.length + 1) return;
              const u = { ...partes.main };
              ESTADO_EXTERNO.forEach((k) => {
                partes.ext[k] !== void 0 && (u[k] = partes.ext[k]);
              });
              // Sección 101: ¿otra pantalla pisó algo que esta guardó hace poco?
              if (misGuardadosRef.current.length) {
                const rev = cambiosPisados(misGuardadosRef.current, u);
                misGuardadosRef.current = rev.quedan;
                rev.pisados.length &&
                  (setAvisoPisado((x) => [...new Set([...(x || []), ...rev.pisados])]),
                  registrarInterno("se mostró 'Otra pantalla cambió': " + rev.pisados.slice(0, 6).join(" · ") + " — " + rev.detalle.slice(0, 2).join(" | ")));
              }
              const loc = estadoLocalRef.current,
                base = baseGuardadaRef.current,
                pendientes = loc && base ? cambiosParaGuardar(JSON.parse(JSON.stringify(loc)), base) : [];
              (pendientes.length === 0
                ? ((ignorarProximoGuardadoRef.current = true), ($n.current = true), aplicarEstadoGuardado(u), (baseGuardadaRef.current = u))
                : (($n.current = true), (baseGuardadaRef.current = u), aplicarEstadoGuardado(combinarEstado(JSON.parse(JSON.stringify(loc)), base, u))),
                setEstadoConexion("ok"),
                setDatosCargados(true));
              // Mudanza (una sola vez): lo que todavía esté en app/state pasa a su documento propio.
              const aMudar = ESTADO_EXTERNO.filter((k) => partes.main[k] !== void 0);
              aMudar.length &&
                !partes.mudando &&
                ((partes.mudando = true),
                firebase
                  .firestore()
                  .runTransaction(async (tx) => {
                    const refMain = r.doc("app/state"),
                      snapMain = await tx.get(refMain),
                      refs = aMudar.map((k) => r.doc(docEstadoExterno(k))),
                      snaps = [];
                    for (const ref of refs) snaps.push(await tx.get(ref));
                    const datos = snapMain.exists ? snapMain.data() : {},
                      borrar = [];
                    aMudar.forEach((k, i) => {
                      if (datos[k] === void 0) return;
                      snaps[i].exists || tx.set(refs[i], { v: datos[k] });
                      borrar.push(new firebase.firestore.FieldPath(k), firebase.firestore.FieldValue.delete());
                    });
                    borrar.length && tx.update(refMain, ...borrar);
                  })
                  .catch(() => {})
                  .finally(() => {
                    partes.mudando = false;
                  }));
            };
          ((e = r.doc("app/state").onSnapshot(
            (i) => {
              if (!i.exists) return;
              const datos = JSON.parse(JSON.stringify(i.data()));
              if (selloAtrasado(datos.__sello, miPantallaRef.current, sellosConfirmadosRef.current["app/state"])) return;
              delete datos.__sello;
              ((partes.main = datos), partes.listos.add("__main__"), aplicarRemoto());
            },
            () => {
              (setEstadoConexion("error"), setDatosCargados(true));
            },
          )),
            (partes.desuscribir = ESTADO_EXTERNO.map((k) =>
              r.doc(docEstadoExterno(k)).onSnapshot(
                (i) => {
                  if (i.exists && selloAtrasado((i.data() || {}).__sello, miPantallaRef.current, sellosConfirmadosRef.current[docEstadoExterno(k)])) return;
                  ((partes.ext[k] = i.exists ? JSON.parse(JSON.stringify((i.data() || {}).v ?? null)) : void 0),
                    partes.listos.add(k),
                    aplicarRemoto());
                },
                () => {
                  (setEstadoConexion("error"), setDatosCargados(true));
                },
              ),
            )),
            (t = r
              .collection("facturas")
              .orderBy("creadoEn")
              .onSnapshot(
                async (i) => {
                  if ((C(i.docs.map((u) => ({ ...u.data(), id: u.id }))), i.empty && !semillaFacturasRef.current)) {
                    semillaFacturasRef.current = true;
                    try {
                      if (!(await r.doc("app/facturasSeed").get()).exists) {
                        await r.doc("app/facturasSeed").set({ done: true });
                        for (let m = 0; m < SEED_FACTURAS.length; m++)
                          await r
                            .collection("facturas")
                            .doc(String(m))
                            .set({ ...SEED_FACTURAS[m], creadoEn: m });
                      }
                    } catch {}
                  }
                },
                () => {},
              )),
            (o = r.collection("roles").onSnapshot(
              (i) => {
                setRoles(i.docs.map((u) => ({ ...u.data(), id: u.id })));
              },
              () => {},
            )));
        }
      })(),
      () => {
        ((a = true), e && e(), t && t(), o && o(), (partesEstadoRef.current.desuscribir || []).forEach((f) => f()));
      }
    );
  }, []),
    useEffect(() => {
      if (!datosCargados || estadoConexion === "unavailable" || !dbRef.current) return;
      const e = {
          obras: obras,
          proveedoresMap: proveedoresMap,
          pagosMap: pagosMap,
          adicionalesMap: adicionalesMap,
          subobrasMap: ordenesCompraMap,
          costoSubobrasMap: costoSubobrasMap,
          subCostoProveedoresMap: subCostoProveedoresMap,
          subCostoPagosMap: subCostoPagosMap,
          proveedoresCatalogo: proveedoresCatalogo,
          pmCatalogo: pmCatalogo,
          ddoCatalogo: ddoCatalogo,
          cfIngresosValores: cfIngresosValores,
          cfIngresosComentarios: cfIngresosComentarios,
          cfIngresosCategorias: cfIngresosCategorias,
          cfIngresosCategoriasValores: cfIngresosCategoriasValores,
          cfIngresosCategoriasComentarios: cfIngresosCategoriasComentarios,
          cfEgresosCategorias: cfEgresosCategorias,
          cfEgresosValores: cfEgresosValores,
          cfEgresosComentarios: cfEgresosComentarios,
          mzLatamOcultoMap: mzLatamOcultoMap,
          cfSalidasValores: cfSalidasValores,
          cfSaldoInicial: cfSaldoInicial,
          cfBancos: cfBancos,
          cfSimulacionLineas: cfSimulacionLineas,
          cfDiasPagoCliente: cfDiasPagoCliente,
          cfRegaliasPagadas: cfRegPag,
          tipoCambio: tipoCambio,
          tcFecha: tcFecha,
          pagosSemanales: pagosSemanales,
          proveedoresInfoMap: proveedoresInfoMap,
          eerrMensual: eerrMensual,
          reglasProveedoresPago: reglasProveedoresPago,
          correccionesAprendidas: correccionesAprendidas,
          registros: registros,
          cambiosFinancieros: cambiosFinancieros,
        };
      // Sección 108: antes, al recibir datos de la base se salteaba el próximo guardado; si justo en ese
      // momento el usuario hacía un cambio (se dibujan juntos), su cambio no se guardaba. Ahora siempre se
      // compara contra la base: si no hay diferencias no se guarda nada, y si las hay se guardan.
      ((estadoLocalRef.current = e), (ignorarProximoGuardadoRef.current = false));
      if (!puedeGuardar) {
        guardandoRef.current = false;
        return;
      }
      guardandoRef.current = true;
      const t = dbRef.current,
        o = setTimeout(() => {
          // Sección 105: los guardados de esta pantalla van de a uno (si hay uno en curso, se espera y se
          // vuelve a calcular contra lo ya guardado), así no chocan entre sí.
          if (guardadoEnCursoRef.current) {
            guardadoEnCursoRef.current.finally(() => setReintentoGuardado((n) => n + 1));
            return;
          }
          const baseAntes = baseGuardadaRef.current,
            cambios = baseAntes ? cambiosParaGuardar(JSON.parse(JSON.stringify(e)), baseAntes) : null;
          if (cambios && cambios.length === 0) {
            guardandoRef.current = false;
            return;
          }
          const a = deshaciendoRef.current,
            rehecho = rehaciendoRef.current;
          // Un cambio nuevo (que no sea deshacer ni rehacer) borra lo que había para rehacer.
          ((rehaciendoRef.current = false), !a && !rehecho && setHistorialRehacer((t) => (t.length ? [] : t)));
          if (((deshaciendoRef.current = false), !a && baseGuardadaRef.current)) {
            const r = baseGuardadaRef.current;
            setHistorialDeshacer((i) => {
              if (i.length && i[i.length - 1].payload === r) return i; // reintento del mismo guardado
              const u = [...i, { payload: r, ts: Date.now() }];
              return u.length > 15 ? u.slice(u.length - 15) : u;
            });
          }
          // Se reparten los cambios entre app/state y los documentos propios de las claves pesadas
          // (todo en un solo lote: se guarda todo o nada).
          const partes = partesEstadoRef.current,
            esExterno = (k) => ESTADO_EXTERNO.includes(k) && partes.ext[k] !== void 0,
            docDe = (ruta) => (esExterno(ruta[0]) ? docEstadoExterno(ruta[0]) : "app/state"),
            rutaEnDoc = (ruta) => (esExterno(ruta[0]) ? ["v", ...ruta.slice(1)] : ruta);
          const idGuardado = Date.now() + Math.random(),
            descartados = [],
            numSello = ++contadorSellosRef.current,
            sello = miPantallaRef.current + ":" + numSello;
          let promesa;
          const armarGrupos = (remotoEn) => {
            descartados.length = 0;
            const finales = combinarCambiosConRemoto(cambios, baseAntes, remotoEn, descartados),
              grupos = {};
            finales.forEach(([ruta, v]) => {
              (grupos[docDe(ruta)] = grupos[docDe(ruta)] || []).push(
                new firebase.firestore.FieldPath(...rutaEnDoc(ruta)),
                v === BORRAR_CAMPO ? firebase.firestore.FieldValue.delete() : v,
              );
            });
            return grupos;
          };
          // Sección 106: si la operación que lee y escribe choca varias veces seguidas, se guarda igual
          // combinando contra la última versión que llegó de la base (como antes), para no perder el cambio.
          const usarLote = cambios && choquesRef.current >= 3;
          try {
            if (cambios && !usarLote)
              // Sección 102: se lee lo que hay ahora en la base y, en las listas, se aplican solo los
              // elementos que cambió esta pantalla (todo en una misma operación: se guarda todo o nada).
              promesa = firebase.firestore().runTransaction(async (tx) => {
                const docs = [...new Set(cambios.map(([ruta]) => docDe(ruta)))],
                  actuales = {};
                for (const d of docs) {
                  const s = await tx.get(t.doc(d));
                  actuales[d] = s.exists ? s.data() || {} : {};
                }
                const grupos = armarGrupos((ruta) => valorEnRuta(actuales[docDe(ruta)], rutaEnDoc(ruta)));
                Object.entries(grupos).forEach(([d, args]) => tx.update(t.doc(d), ...args, "__sello", sello));
              });
            else if (usarLote) {
              const ultimo = { ...(partes.main || {}) };
              ESTADO_EXTERNO.forEach((k) => partes.ext[k] !== void 0 && (ultimo[k] = partes.ext[k]));
              const grupos = armarGrupos((ruta) => valorEnRuta(ultimo, ruta)),
                lote = firebase.firestore().batch();
              Object.entries(grupos).forEach(([d, args]) => lote.update(t.doc(d), ...args, "__sello", sello));
              promesa = lote.commit();
            } else {
              const lote = firebase.firestore().batch();
              const principal = { ...e };
              ESTADO_EXTERNO.forEach((k) => {
                esExterno(k) && (lote.set(t.doc(docEstadoExterno(k)), { v: e[k] === void 0 ? null : e[k] }), delete principal[k]);
              });
              lote.set(t.doc("app/state"), principal);
              promesa = lote.commit();
            }
          } catch (err) {
            ((guardandoRef.current = false),
              mostrarErrorGuardado(idGuardado, "La base de datos rechazó los datos (" + ((err && err.message) || "error") + ")."));
            return;
          }
          guardadoEnCursoRef.current = promesa.catch(() => {}).finally(() => (guardadoEnCursoRef.current = null));
          const avisoLento = setTimeout(
            () =>
              mostrarErrorGuardado(idGuardado, "La base de datos no confirmó el guardado en 20 segundos (conexión lenta o cortada)."),
            2e4,
          );
          promesa
            .finally(() => clearTimeout(avisoLento))
            .then(() => {
              setErrorGuardado((x) => (x && x.id === idGuardado ? null : x));
            })
            .then(() => {
              ((guardandoRef.current = false),
                cambios
                  ? ((misGuardadosRef.current = anotarGuardado(misGuardadosRef.current, cambios, baseAntes, Date.now())),
                    baseGuardadaRef.current === baseAntes && (baseGuardadaRef.current = aplicarCambios(baseAntes, cambios)))
                  : (baseGuardadaRef.current = JSON.parse(JSON.stringify(e))),
                (reintentandoRef.current = false),
                (choquesRef.current = 0),
                cambios &&
                  [...new Set(cambios.map(([ruta]) => docDe(ruta)))].forEach((d) => {
                    sellosConfirmadosRef.current[d] = Math.max(sellosConfirmadosRef.current[d] || 0, numSello);
                  }),
                descartados.length &&
                  (setAvisoDescartado((x) => [...new Set([...(x || []), ...descartados])]),
                  registrarInterno("se mostró 'No se guardó tu cambio': " + descartados.slice(0, 6).join(" · "))),
                setAvisoGuardado(null));
            })
            .catch((r) => {
              // Sección 105: si la base estaba ocupada con otro guardado (choque), se reintenta enseguida sin avisar.
              // Se anota el detalle (una vez por pantalla) para poder ver la causa en Fallas de guardado.
              r &&
                (r.code === "failed-precondition" || r.code === "aborted") &&
                !detalleChoqueRef.current &&
                ((detalleChoqueRef.current = true),
                mostrarErrorGuardado(idGuardado, "Aviso interno (se reintenta solo): " + String(r.code) + " — " + String(r.message || "").slice(0, 300)));
              if (r && (r.code === "failed-precondition" || r.code === "aborted") && (choquesRef.current = choquesRef.current + 1) <= 5) {
                (setErrorGuardado((x) => (x && x.id === idGuardado ? null : x)), setTimeout(() => setReintentoGuardado((n) => n + 1), 300 + Math.random() * 700));
                return;
              }
              choquesRef.current = 0;
              ((guardandoRef.current = false),
                r && r.code === "invalid_argument"
                  ? setAvisoGuardado(
                      "Los datos superaron el límite de tamaño permitido para guardarse. Si esto persiste, avisá para dividir el almacenamiento.",
                    )
                  : r && r.code === "quota_exceeded"
                    ? setAvisoGuardado("Se alcanzó el límite de almacenamiento de la app.")
                    : setAvisoGuardado("Sin conexión: los últimos cambios todavía no se guardaron. MIA reintenta sola; no cierres la página."),
                // Sección 102: el aviso se registra una vez y se reintenta solo (contra lo último de la base).
                reintentandoRef.current ||
                  mostrarErrorGuardado(idGuardado, "La base de datos rechazó el guardado (" + ((r && [r.code, r.message].filter(Boolean).join(" — ").slice(0, 300)) || "error desconocido") + ")."),
                r && (r.code === "invalid_argument" || r.code === "invalid-argument" || r.code === "quota_exceeded" || r.code === "resource-exhausted")
                  ? void 0
                  : ((reintentandoRef.current = true), setTimeout(() => setReintentoGuardado((n) => n + 1), 1e4)));
            });
        }, 500);
      return () => clearTimeout(o);
    }, [
      obras,
      proveedoresMap,
      pagosMap,
      adicionalesMap,
      ordenesCompraMap,
      costoSubobrasMap,
      subCostoProveedoresMap,
      subCostoPagosMap,
      proveedoresCatalogo,
      pmCatalogo,
      ddoCatalogo,
      cfIngresosValores,
      cfIngresosComentarios,
      cfIngresosCategorias,
      cfIngresosCategoriasValores,
      cfIngresosCategoriasComentarios,
      cfEgresosCategorias,
      cfEgresosValores,
      cfEgresosComentarios,
      cfSalidasValores,
      cfSaldoInicial,
      cfBancos,
      cfSimulacionLineas,
      cfDiasPagoCliente,
      cfRegPag,
      tipoCambio,
      tcFecha,
      pagosSemanales,
      proveedoresInfoMap,
      eerrMensual,
      reglasProveedoresPago,
      correccionesAprendidas,
      registros,
      cambiosFinancieros,
      datosCargados,
      estadoConexion,
      reintentoGuardado,
      puedeGuardar,
    ]));
  const Da = useRef(false);
