function App() {
  const [n, d] = useState("obras"),
    [c, p] = useState(SEED_OBRAS),
    [g, C] = useState(() => SEED_FACTURAS.map((e, t) => ({ ...e, id: t }))),
    [S, f] = useState(SEED_PROVEEDORES),
    [F, A] = useState(SEED_PAGOS),
    [k, L] = useState([]),
    [oe, ve] = useState({}),
    [P, M] = useState(SEED_ADICIONALES),
    [Pe, ye] = useState({}),
    [Z, Ye] = useState({}),
    [ee, lt] = useState({}),
    [ne, Be] = useState({}),
    [Le, Lt] = useState(SEED_EERR),
    [nt, H] = useState({}),
    [Ee, Nt] = useState({}),
    [qt, po] = useState(["AFORO"]),
    [oo, Eo] = useState({}),
    [Oo, Bo] = useState({}),
    [w, Ne] = useState([
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
    [Re, at] = useState({}),
    [dt, Gt] = useState({}),
    [vt, y] = useState({}),
    [G, te] = useState({}),
    [V, ut] = useState(0),
    [At, go] = useState([]),
    [No, Jt] = useState([]),
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
    [sn, fo] = useState({}),
    [cfRegPag, setCfRegPag] = useState({}),
    [v, E] = useState(SEED_CATALOGO_PROVEEDORES),
    [K, de] = useState([]),
    [Bt, Ft] = useState([]),
    [Xe, rt] = useState([]),
    [Ct, kt] = useState({ cliente: {}, centroCosto: {}, subObra: {}, imputacion: {}, proveedor: {} }),
    [Oe, jt] = useState(0),
    [q, Ae] = useState("ARS"),
    [Ve, bo] = useState(false),
    [l, I] = useState(""),
    [U, ce] = useState(""),
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
    [Xt, Qo] = useState(false),
    [Dt, ho] = useState(null),
    [ct, ko] = useState("operaciones"),
    [Go, $o] = useState(null),
    [cn, on] = useState(""),
    [En, kn] = useState(false),
    [Gn, Ja] = useState([]),
    [ga, Kn] = useState(null),
    [Qa, fa] = useState(false),
    [$a, ma] = useState(false),
    [er, tr] = useState({}),
    [jn, ba] = useState([]),
    [or, va] = useState(false),
    [On, ha] = useState([]),
    [nr, ya] = useState(false),
    fn = ct === "admin",
    so = (ct === "custom" && Gn.find((e) => e.id === ga)) || null;
  function Zn(e) {
    return ct === "admin" || ct === "comercial"
      ? "editar"
      : (ct === "custom" && so && ((so.permisosPorSeccion || {})[e] || so.permiso)) || "lectura";
  }
  const Rt = Zn(n) === "editar",
    Sn = ct === "admin" || ct === "comercial" || (ct === "custom" && !!so && !!so.puedeFijarTipoCambio),
    verRegaliasPresentacion =
      ct === "admin" || ct === "comercial" || (ct === "custom" && !!so && !!so.puedeRegaliasPresentacion);
  function In(e) {
    return fn ? true : ct === "custom" && !!so && !!(so.herramientasAdmin && so.herramientasAdmin[e]);
  }
  const Jn =
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
        };
  (useEffect(() => {
    if (!Jn[n]) {
      const e = ["obras", "facturacion", "proveedores", "cashflow", "pagos", "eerr", "operaciones"].find((t) => Jn[t]);
      e && d(e);
    }
  }, [ct, so && so.id]),
    (monedaState.moneda = q),
    (monedaState.tipoCambio = Number(Oe) || 0));
  const Me = useRef(null),
    Qn = useRef(false),
    $n = useRef(false),
    Sa = useRef(null),
    Vn = useRef(false),
    xa = useRef(false),
    [en, ea] = useState("connecting"),
    [Aa, an] = useState(null),
    [errorGuardado, setErrorGuardado] = useState(null),
    [reintentoGuardado, setReintentoGuardado] = useState(0),
    [fallasGuardado, setFallasGuardado] = useState([]),
    Xn = useRef(null),
    estadoLocalRef = useRef(null),
    partesEstadoRef = useRef({ main: null, ext: {}, listos: new Set(), mudando: false, desuscribir: [] }),
    ta = useRef(false),
    [mn, Ca] = useState([]),
    [Ea, Oa] = useState(null);
  function ar() {
    if (mn.length === 0) return;
    const e = mn[mn.length - 1];
    ((ta.current = true),
      oa(e.payload),
      Ca((t) => t.slice(0, -1)),
      Oa(
        "Se deshizo el cambio guardado el " +
          new Date(e.ts).toLocaleString("es-AR") +
          ". Podés seguir deshaciendo con más clics.",
      ));
  }
  // Sección 89: las órdenes de compra que empiezan con "MZ" (ej. MZ01) no tienen venta propia: es la
  // suma de lo que aportan a esa OC las sub obras que la tienen cargada. Se mantiene sola al agregar o
  // quitar sub obras o cambiar sus importes.
  useEffect(() => {
    const cambios = {};
    Object.entries(Pe || {}).forEach(([k, ocs]) => {
      (ocs || []).forEach((oc, i) => {
        const nombre = String((oc && oc.ordenCompra) || "").trim();
        if (!/^MZ/.test(normOC(nombre))) return;
        const suma =
          Math.round(
            (Z[k] || [])
              .filter((sc) => ordenCompraIncluye(sc.ordenCompra, nombre))
              .reduce((a, sc) => a + (Number(montoDeSubCostoParaOC(sc, nombre)) || 0), 0) * 100,
          ) / 100;
        Math.abs((Number(oc.venta) || 0) - suma) > 0.004 && ((cambios[k] = cambios[k] || {})[i] = suma);
      });
    });
    Object.keys(cambios).length &&
      ye((a) => {
        const b = { ...a };
        Object.entries(cambios).forEach(([k, m]) => {
          b[k] = (b[k] || []).map((oc, i) => (i in m ? { ...oc, venta: m[i] } : oc));
        });
        return b;
      });
  }, [Pe, Z]);
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
      const e = Gn.find((t) => t.pin === cn);
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
    if (!Me.current) return;
    const t = e.id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      { id: o, ...a } = e;
    (await Me.current
      .collection("roles")
      .doc(t)
      .set({ ...a, id: t }),
      _t((e.id ? "Editó" : "Creó") + ' rol "' + (a.nombre || "") + '"'));
  }
  async function sr(e) {
    if (!Me.current) return;
    const t = Gn.find((o) => o.id === e);
    (await Me.current.collection("roles").doc(e).delete(),
      _t('Borró rol "' + (t ? t.nombre : e) + '"'),
      ct === "custom" && ga === e && Ia());
  }
  function oa(e) {
    (p(e.obras || SEED_OBRAS),
      f(e.proveedoresMap || SEED_PROVEEDORES),
      A(e.pagosMap || SEED_PAGOS),
      L(
        (e.pagosSemanales || []).map((t) =>
          t.fechaPagado ? { ...t, fechaPagado: normalizarFecha(t.fechaPagado) } : t,
        ),
      ),
      ve(e.proveedoresInfoMap || {}),
      M(e.adicionalesMap || SEED_ADICIONALES),
      ye(e.subobrasMap || {}),
      Ye(e.costoSubobrasMap || {}),
      lt(e.subCostoProveedoresMap || {}),
      Be(e.subCostoPagosMap || {}),
      E(e.proveedoresCatalogo || SEED_CATALOGO_PROVEEDORES),
      de(e.pmCatalogo || []),
      Ft(e.ddoCatalogo || []),
      rt(e.reglasProveedoresPago || []),
      kt(e.correccionesAprendidas || { cliente: {}, centroCosto: {}, subObra: {}, imputacion: {}, proveedor: {} }),
      Lt(e.eerrMensual || SEED_EERR),
      H(e.cfIngresosValores || {}),
      Nt(e.cfIngresosComentarios || {}),
      po(e.cfIngresosCategorias || ["AFORO"]),
      Eo(e.cfIngresosCategoriasValores || {}),
      Bo(e.cfIngresosCategoriasComentarios || {}),
      Ne(
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
      at(e.cfEgresosValores || {}),
      Gt(e.cfEgresosComentarios || {}),
      y(e.mzLatamOcultoMap || {}),
      te(e.cfSalidasValores || {}),
      ut(e.cfSaldoInicial || 0),
      go(e.cfBancos || []),
      Jt(e.cfSimulacionLineas || []),
      fo(e.cfDiasPagoCliente || {}),
      setCfRegPag(e.cfRegaliasPagadas || {}),
      jt(e.tipoCambio || 0),
      ce(e.tcFecha || ""),
      ba(e.registros || []),
      ha(e.cambiosFinancieros || []));
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
    ba((a) => {
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
            (ea("unavailable"), Qo(true));
            return;
          }
          Me.current = r;
          const partes = partesEstadoRef.current,
            aplicarRemoto = () => {
              if (!partes.main || partes.listos.size < ESTADO_EXTERNO.length + 1) return;
              const u = { ...partes.main };
              ESTADO_EXTERNO.forEach((k) => {
                partes.ext[k] !== void 0 && (u[k] = partes.ext[k]);
              });
              const loc = estadoLocalRef.current,
                base = Xn.current,
                pendientes = loc && base ? cambiosParaGuardar(JSON.parse(JSON.stringify(loc)), base) : [];
              (pendientes.length === 0
                ? ((Qn.current = true), ($n.current = true), oa(u), (Xn.current = u))
                : (($n.current = true), (Xn.current = u), oa(combinarEstado(JSON.parse(JSON.stringify(loc)), base, u))),
                ea("ok"),
                Qo(true));
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
              i.exists && ((partes.main = JSON.parse(JSON.stringify(i.data()))), partes.listos.add("__main__"), aplicarRemoto());
            },
            () => {
              (ea("error"), Qo(true));
            },
          )),
            (partes.desuscribir = ESTADO_EXTERNO.map((k) =>
              r.doc(docEstadoExterno(k)).onSnapshot(
                (i) => {
                  ((partes.ext[k] = i.exists ? JSON.parse(JSON.stringify((i.data() || {}).v ?? null)) : void 0),
                    partes.listos.add(k),
                    aplicarRemoto());
                },
                () => {
                  (ea("error"), Qo(true));
                },
              ),
            )),
            (t = r
              .collection("facturas")
              .orderBy("creadoEn")
              .onSnapshot(
                async (i) => {
                  if ((C(i.docs.map((u) => ({ ...u.data(), id: u.id }))), i.empty && !xa.current)) {
                    xa.current = true;
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
                Ja(i.docs.map((u) => ({ ...u.data(), id: u.id })));
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
      if (!Xt || en === "unavailable" || !Me.current) return;
      const e = {
          obras: c,
          proveedoresMap: S,
          pagosMap: F,
          adicionalesMap: P,
          subobrasMap: Pe,
          costoSubobrasMap: Z,
          subCostoProveedoresMap: ee,
          subCostoPagosMap: ne,
          proveedoresCatalogo: v,
          pmCatalogo: K,
          ddoCatalogo: Bt,
          cfIngresosValores: nt,
          cfIngresosComentarios: Ee,
          cfIngresosCategorias: qt,
          cfIngresosCategoriasValores: oo,
          cfIngresosCategoriasComentarios: Oo,
          cfEgresosCategorias: w,
          cfEgresosValores: Re,
          cfEgresosComentarios: dt,
          mzLatamOcultoMap: vt,
          cfSalidasValores: G,
          cfSaldoInicial: V,
          cfBancos: At,
          cfSimulacionLineas: No,
          cfDiasPagoCliente: sn,
          cfRegaliasPagadas: cfRegPag,
          tipoCambio: Oe,
          tcFecha: U,
          pagosSemanales: k,
          proveedoresInfoMap: oe,
          eerrMensual: Le,
          reglasProveedoresPago: Xe,
          correccionesAprendidas: Ct,
          registros: jn,
          cambiosFinancieros: On,
        };
      if (((estadoLocalRef.current = e), Qn.current)) {
        Qn.current = false;
        return;
      }
      Vn.current = true;
      const t = Me.current,
        o = setTimeout(() => {
          const a = ta.current;
          if (((ta.current = false), !a && Xn.current)) {
            const r = Xn.current;
            Ca((i) => {
              const u = [...i, { payload: r, ts: Date.now() }];
              return u.length > 15 ? u.slice(u.length - 15) : u;
            });
          }
          const baseAntes = Xn.current,
            cambios = baseAntes ? cambiosParaGuardar(JSON.parse(JSON.stringify(e)), baseAntes) : null;
          if (cambios && cambios.length === 0) {
            Vn.current = false;
            return;
          }
          // Se reparten los cambios entre app/state y los documentos propios de las claves pesadas
          // (todo en un solo lote: se guarda todo o nada).
          const partes = partesEstadoRef.current,
            esExterno = (k) => ESTADO_EXTERNO.includes(k) && partes.ext[k] !== void 0,
            grupos = {};
          (cambios || []).forEach(([ruta, v]) => {
            const ext = esExterno(ruta[0]),
              d = ext ? docEstadoExterno(ruta[0]) : "app/state",
              r2 = ext ? ["v", ...ruta.slice(1)] : ruta;
            (grupos[d] = grupos[d] || []).push(
              new firebase.firestore.FieldPath(...r2),
              v === BORRAR_CAMPO ? firebase.firestore.FieldValue.delete() : v,
            );
          });
          const idGuardado = Date.now() + Math.random();
          let promesa;
          try {
            const lote = firebase.firestore().batch();
            if (cambios) Object.entries(grupos).forEach(([d, args]) => lote.update(t.doc(d), ...args));
            else {
              const principal = { ...e };
              ESTADO_EXTERNO.forEach((k) => {
                esExterno(k) && (lote.set(t.doc(docEstadoExterno(k)), { v: e[k] === void 0 ? null : e[k] }), delete principal[k]);
              });
              lote.set(t.doc("app/state"), principal);
            }
            promesa = lote.commit();
          } catch (err) {
            ((Vn.current = false),
              mostrarErrorGuardado(idGuardado, "La base de datos rechazó los datos (" + ((err && err.message) || "error") + ")."));
            return;
          }
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
              ((Vn.current = false),
                cambios
                  ? Xn.current === baseAntes && (Xn.current = aplicarCambios(baseAntes, cambios))
                  : (Xn.current = JSON.parse(JSON.stringify(e))),
                an(null));
            })
            .catch((r) => {
              ((Vn.current = false),
                r && r.code === "invalid_argument"
                  ? an(
                      "Los datos superaron el límite de tamaño permitido para guardarse. Si esto persiste, avisá para dividir el almacenamiento.",
                    )
                  : r && r.code === "quota_exceeded"
                    ? an("Se alcanzó el límite de almacenamiento de la app.")
                    : an("No se pudieron guardar los últimos cambios. Verificá tu conexión."),
                mostrarErrorGuardado(idGuardado, "La base de datos rechazó el guardado (" + ((r && (r.code || r.message)) || "error desconocido") + ")."));
            });
        }, 500);
      return () => clearTimeout(o);
    }, [
      c,
      S,
      F,
      P,
      Pe,
      Z,
      ee,
      ne,
      v,
      K,
      Bt,
      nt,
      Ee,
      qt,
      oo,
      Oo,
      w,
      Re,
      dt,
      G,
      V,
      At,
      No,
      sn,
      cfRegPag,
      Oe,
      U,
      k,
      oe,
      Le,
      Xe,
      Ct,
      jn,
      On,
      Xt,
      en,
      reintentoGuardado,
    ]));
  const Da = useRef(false);
  useEffect(() => {
    !Xt ||
      en === "unavailable" ||
      !Me.current ||
      Da.current ||
      (c.length === 0 && g.length === 0) ||
      ((Da.current = true),
      (async () => {
        try {
          if ((await Me.current.doc("app/tcHistoricoAplicado").get()).exists) return;
          await Me.current.doc("app/tcHistoricoAplicado").set({ done: true, aplicadoEn: Date.now() });
          const t = {};
          (c.forEach((i) => {
            t[obraKey(i.cliente, i.obra)] = i.anio;
          }),
            p((i) => i.map((u) => ({ ...u, tc: tcParaAnioHistorico(u.anio) }))));
          const o = (i) => {
            const u = {};
            return (
              Object.entries(i).forEach(([m, x]) => {
                const D = tcParaAnioHistorico(t[m]);
                u[m] = (x || []).map((T) => ({ ...T, tc: D }));
              }),
              u
            );
          };
          (f((i) => o(i)), A((i) => o(i)), M((i) => o(i)), ye((i) => o(i)));
          const a = (i) => {
            const u = { ...i };
            return (
              Object.entries(Z).forEach(([m, x]) => {
                const D = tcParaAnioHistorico(t[m]);
                (x || []).forEach((T, O) => {
                  const _ = subCostoKey(m, O);
                  u[_] && (u[_] = u[_].map((xe) => ({ ...xe, tc: D })));
                });
              }),
              u
            );
          };
          (lt((i) => a(i)), Be((i) => a(i)));
          const r = Me.current.collection("facturas");
          (await Promise.all(
            g.map((i) => {
              const u = tcParaAnioHistorico(t[obraKey(i.cliente, i.obra)]);
              return r
                .doc(i.id)
                .update({ tc: u })
                .catch(() => {});
            }),
          ),
            jt((i) => i || 1450));
        } catch {}
      })());
  }, [Xt, en, c.length, g.length]);
  const Ra = useRef(false);
  (useEffect(() => {
    !Xt ||
      en === "unavailable" ||
      !Me.current ||
      Ra.current ||
      !Object.values(Z).some((t) => (t || []).some((o) => !o.id)) ||
      ((Ra.current = true),
      (async () => {
        try {
          if ((await Me.current.doc("app/subCostoIdsAplicado").get()).exists) return;
          await Me.current.doc("app/subCostoIdsAplicado").set({ done: true, aplicadoEn: Date.now() });
          const o = {},
            a = {};
          if (
            (Object.entries(Z).forEach(([i, u]) => {
              a[i] = (u || []).map((m, x) => {
                if (m.id) return m;
                const D = nuevoSubCostoId();
                return ((o[subCostoKey(i, x)] = subCostoKey(i, D)), { ...m, id: D });
              });
            }),
            Object.keys(o).length === 0)
          )
            return;
          const r = (i) => {
            const u = {};
            return (
              Object.entries(i).forEach(([m, x]) => {
                u[o[m] || m] = x;
              }),
              u
            );
          };
          (Ye(a), lt((i) => r(i)), Be((i) => r(i)));
        } catch {}
      })());
  }, [Xt, en, Z]),
    useEffect(() => {
      if (!Xt) return;
      if (!Sn) {
        ge(false);
        return;
      }
      let e = false;
      function t() {
        const a = fechaComercialHoy(),
          r = U !== a;
        (r && !e && Y(Oe ? String(Oe) : ""), (e = r), ge(r));
      }
      t();
      const o = setInterval(t, 6e4);
      return () => clearInterval(o);
    }, [Xt, ct, Sn, U]));
  function mostrarErrorGuardado(id, motivo) {
    setErrorGuardado({ id, motivo });
    try {
      Me.current &&
        Me.current
          .collection("erroresGuardado")
          .add({
            fecha: Date.now(),
            rol: ct === "admin" ? "Admin" : ct === "comercial" ? "Comercial" : so ? so.nombre : ct || "—",
            motivo: String(motivo || ""),
            ambiente: APP_ENV,
            navegador: String((typeof navigator < "u" && navigator.userAgent) || "").slice(0, 160),
          })
          .catch(() => {});
    } catch {}
  }
  useEffect(() => {
    !or ||
      !Me.current ||
      Me.current
        .collection("erroresGuardado")
        .get()
        .then((q) =>
          setFallasGuardado(
            q.docs
              .map((d) => d.data())
              .sort((a, b) => b.fecha - a.fecha)
              .slice(0, 100),
          ),
        )
        .catch(() => {});
  }, [or]);
  function Pa() {
    const e = Number(Ke);
    !e || e <= 0 || (jt(e), ce(fechaComercialHoy()), ge(false));
  }
  (useEffect(() => {
    if (!Xt || !Me.current) return;
    const e =
      ct === "admin"
        ? { key: "admin", nombre: "Admin" }
        : ct === "comercial"
          ? { key: "comercial", nombre: "Comercial" }
          : ct === "custom" && so
            ? { key: "custom_" + so.id, nombre: so.nombre }
            : null;
    if (!e) return;
    const t = () => {
      Me.current
        .collection("presencia")
        .doc(e.key)
        .set({ nombre: e.nombre, ultimaVez: Date.now() })
        .catch(() => {});
    };
    t();
    const o = setInterval(t, 3e4);
    return () => clearInterval(o);
  }, [Xt, ct, so]),
    useEffect(() => {
      if (!Xt || !fn || !Me.current) return;
      const e = Me.current.collection("presencia").onSnapshot(
        (t) => {
          const o = {};
          (t.forEach((a) => {
            o[a.id] = a.data();
          }),
            tr(o));
        },
        () => {},
      );
      return () => e();
    }, [Xt, fn]));
  function na() {
    const e = {
      obras: c,
      proveedoresMap: S,
      pagosMap: F,
      adicionalesMap: P,
      subobrasMap: Pe,
      costoSubobrasMap: Z,
      subCostoProveedoresMap: ee,
      subCostoPagosMap: ne,
      proveedoresCatalogo: v,
      pmCatalogo: K,
      ddoCatalogo: Bt,
      facturas: g,
      cfIngresosValores: nt,
      cfIngresosComentarios: Ee,
      cfIngresosCategorias: qt,
      cfIngresosCategoriasValores: oo,
      cfIngresosCategoriasComentarios: Oo,
      cfEgresosCategorias: w,
      cfEgresosValores: Re,
      cfEgresosComentarios: dt,
      mzLatamOcultoMap: vt,
      cfSalidasValores: G,
      cfSaldoInicial: V,
      cfBancos: At,
      cfSimulacionLineas: No,
      cfDiasPagoCliente: sn,
      cfRegaliasPagadas: cfRegPag,
      tipoCambio: Oe,
      tcFecha: U,
      eerrMensual: Le,
      pagosSemanales: k,
      proveedoresInfoMap: oe,
      reglasProveedoresPago: Xe,
      correccionesAprendidas: Ct,
      exportadoEl: /* @__PURE__ */ new Date().toISOString(),
    };
    return JSON.stringify(e, null, 2);
  }
  function dr() {
    const e = na();
    ofrecerDescarga("backup_seguimiento_obras_" + /* @__PURE__ */ new Date().toISOString().slice(0, 10) + ".json", e);
  }
  const wa = useRef(null),
    aa = useRef(false);
  function cr() {
    return /* @__PURE__ */ new Date().toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" });
  }
  async function Na() {
    if (!Xt || en === "unavailable" || !Me.current || (c.length === 0 && g.length === 0)) return;
    const e = cr();
    if (wa.current === e || aa.current) return;
    aa.current = true;
    const t = Me.current;
    try {
      const o = JSON.parse(na());
      ((o.fecha = e), await t.collection("historial").doc(e).set(o), (wa.current = e));
      try {
        const a = /* @__PURE__ */ new Date();
        a.setDate(a.getDate() - 90);
        const r = a.toLocaleDateString("en-CA", { timeZone: "America/Argentina/Buenos_Aires" }),
          i = await t.collection("historial").get();
        for (const u of i.docs) u.id < r && (await u.ref.delete().catch(() => {}));
      } catch {}
    } catch {}
    aa.current = false;
  }
  (useEffect(() => {
    const e = setTimeout(Na, 3e3);
    return () => clearTimeout(e);
  }, [Xt, en, c, g, k, nt, oo, Re, G]),
    useEffect(() => {
      const e = setInterval(Na, 6e4);
      return () => clearInterval(e);
    }, [Xt, en]));
  async function ur() {
    if (!(window.html2canvas && window.jspdf)) {
      alert("No se pudo cargar el generador de PDF. Probá recargar la página.");
      return;
    }
    Yt(true);
    try {
      await new Promise((u) => setTimeout(u, 50));
      const { jsPDF: e } = window.jspdf,
        t = 1280,
        o = 720,
        a = new e({ orientation: "landscape", unit: "px", format: [t, o] });
      for (let u = 0; u < Tt.length; u++) {
        const m = Tt[u].current;
        if (!m) continue;
        const D = (await window.html2canvas(m, { scale: 2, backgroundColor: "#ffffff", logging: false })).toDataURL(
          "image/png",
        );
        (u > 0 && a.addPage([t, o], "landscape"), a.addImage(D, "PNG", 0, 0, t, o));
      }
      const r = a.output("blob"),
        i = MESES[ia.mesActualIdx].toLowerCase();
      await ofrecerDescarga("informe_financiero_" + i + "_" + ia.anioActual + ".pdf", r);
    } catch {
      alert("No se pudo generar la presentación. Probá de nuevo.");
    } finally {
      Yt(false);
    }
  }
  async function pr(e) {
    if (!Me.current) return;
    const t = Me.current.collection("facturas"),
      o = await t.get();
    for (const a of o.docs)
      await t
        .doc(a.id)
        .delete()
        .catch(() => {});
    for (const a of e || []) {
      const { id: r, ...i } = a;
      await t.add(i).catch(() => {});
    }
  }
  function gr(e) {
    return new Promise((t, o) => {
      const a = new FileReader();
      ((a.onload = (r) => {
        try {
          const i = JSON.parse(r.target.result);
          (oa(i), pr(i.facturas).catch(() => {}), t(true));
        } catch (i) {
          o(i);
        }
      }),
        (a.onerror = o),
        a.readAsText(e));
    });
  }
  function Fa(e, t, o, a, r) {
    if (t !== "WU" || vt[e] || r === "FINALIZADA") return null;
    const i = F[e] || [],
      u = Z[e] || [],
      m = i.reduce((z, he) => z + (he.monto || 0), 0),
      x = i.reduce((z, he) => z + aUsd(he.monto, he.tc), 0),
      D = u.filter((z) => (z.venta || 0) > 0),
      T = u.filter((z) => !((z.venta || 0) > 0)),
      O = T.reduce((z, he) => {
        const Se = subCostoKey(e, he.id),
          je = ee[Se] || [],
          mt = ne[Se] || [];
        return (
          z + je.reduce(($e, tt) => $e + presupuestoEfectivo(tt.presupuesto, pagadoDeProveedor(mt, tt.proveedor)), 0)
        );
      }, 0),
      _ = T.reduce((z, he) => {
        const Se = subCostoKey(e, he.id),
          je = ee[Se] || [],
          mt = ne[Se] || [];
        return (
          z +
          je.reduce(($e, tt) => $e + Math.max(aUsd(tt.presupuesto, tt.tc), pagadoUSDDeProveedor(mt, tt.proveedor)), 0)
        );
      }, 0),
      xe = D.reduce((z, he) => z + (he.venta || 0), 0),
      Ie = D.reduce((z, he) => z + aUsd(he.venta, he.tc), 0),
      Te = Math.max((o || 0) - xe, 0),
      Ge = Math.max((a || 0) - Ie, 0),
      Ze = D.filter((z) => (z.status || "EN PROCESO") !== "FINALIZADA"),
      le = Ze.reduce((z, he) => {
        const Se = subCostoKey(e, he.id),
          je = ee[Se] || [],
          mt = ne[Se] || [];
        return (
          z + je.reduce(($e, tt) => $e + presupuestoEfectivo(tt.presupuesto, pagadoDeProveedor(mt, tt.proveedor)), 0)
        );
      }, 0),
      ft = Ze.reduce((z, he) => {
        const Se = subCostoKey(e, he.id),
          je = ee[Se] || [],
          mt = ne[Se] || [];
        return (
          z +
          je.reduce(($e, tt) => $e + Math.max(aUsd(tt.presupuesto, tt.tc), pagadoUSDDeProveedor(mt, tt.proveedor)), 0)
        );
      }, 0),
      to = Ze.reduce((z, he) => z + (he.venta || 0), 0),
      h = Ze.reduce((z, he) => z + aUsd(he.venta, he.tc), 0),
      N = (Te + to) / 1.4,
      De = (Ge + h) / 1.4,
      Ce = m + O + le,
      ie = x + _ + ft,
      Fe = Math.max(N - Ce, 0),
      qe = Math.max(De - ie, 0),
      Qe = qe > 0 ? Fe / qe : Oe || 0;
    return { proveedor: "MZ LATAM", presupuestoOriginal: Fe, presupuesto: Fe, tc: Qe, esVirtualMzLatam: true };
  }
  const co = useMemo(
    () =>
      c.map((e) => {
        const t = obraKey(e.cliente, e.obra),
          o = Z[t] || [],
          a = o.reduce((He, Je) => He + (Je.adicionales || []).reduce((bt, Et) => bt + (Et.monto || 0), 0), 0),
          r = o.reduce((He, Je) => He + (Je.adicionales || []).reduce((bt, Et) => bt + aUsd(Et.monto, Et.tc), 0), 0),
          i = P[t] || [],
          u = i.reduce((He, Je) => He + (Je.monto || 0), 0) + a,
          m = i.reduce((He, Je) => He + aUsd(Je.monto, Je.tc), 0) + r,
          x = Pe[t] || [],
          D = (He) => {
            const Je = (He || "").trim();
            return Je ? o.filter((bt) => ordenCompraIncluye(bt.ordenCompra, Je)) : [];
          },
          T = (He) => {
            const Je = (He.ordenCompra || "").trim(),
              bt = D(Je);
            return bt.length > 0 ? bt.reduce((Et, Po) => Et + montoDeSubCostoParaOC(Po, Je), 0) : He.venta || 0;
          },
          O = (He) => {
            const Je = (He.ordenCompra || "").trim(),
              bt = D(Je);
            return bt.length > 0
              ? bt.reduce((Et, Po) => Et + aUsd(montoDeSubCostoParaOC(Po, Je), Po.tc), 0)
              : aUsd(He.venta, He.tc);
          },
          _ = x.reduce((He, Je) => He + T(Je), 0),
          xe = x.reduce((He, Je) => He + O(Je), 0),
          Ie = x.length > 0,
          Te = Ie ? _ + u : e.ventaOriginal || 0,
          Ge = Ie ? xe + m : aUsd(e.ventaOriginal, e.tc),
          Ze = Ie ? Te : (e.ventaOriginal || 0) + u + _,
          le = Ie ? Ge : aUsd(e.ventaOriginal, e.tc) + m + xe,
          ft = Ie ? Math.round(_ / 1.4) : e.costoInicial || 0,
          to = Ie ? Math.round(xe / 1.4) : aUsd(e.costoInicial, e.tc),
          h = S[t],
          N = F[t] || [],
          De = o.reduce((He, Je) => {
            const bt = subCostoKey(t, Je.id),
              Et = ee[bt] || [],
              Po = ne[bt] || [];
            return (
              He + Et.reduce((Co, $) => Co + presupuestoEfectivo($.presupuesto, pagadoDeProveedor(Po, $.proveedor)), 0)
            );
          }, 0),
          Ce = o.reduce((He, Je) => {
            const bt = subCostoKey(t, Je.id),
              Et = ee[bt] || [],
              Po = ne[bt] || [];
            return (
              He +
              Et.reduce((Co, $) => Co + Math.max(aUsd($.presupuesto, $.tc), pagadoUSDDeProveedor(Po, $.proveedor)), 0)
            );
          }, 0),
          ie = Fa(t, e.cliente, Ze, le, e.status),
          Fe = ie ? [...(h || []), ie] : h || [],
          qe = Fe.reduce((He, Je) => {
            const bt = pagadoDeProveedor(N, Je.proveedor);
            return He + (presupuestoEfectivo(Je.presupuesto, bt) - bt);
          }, 0),
          Qe = Fe.reduce((He, Je) => {
            const bt = pagadoUSDDeProveedor(N, Je.proveedor);
            return He + (Math.max(aUsd(Je.presupuesto, Je.tc), bt) - bt);
          }, 0),
          z = o.reduce((He, Je) => {
            const bt = subCostoKey(t, Je.id),
              Et = ee[bt] || [],
              Po = ne[bt] || [];
            return (
              He +
              Et.reduce((Co, $) => {
                const ze = pagadoDeProveedor(Po, $.proveedor);
                return Co + (presupuestoEfectivo($.presupuesto, ze) - ze);
              }, 0)
            );
          }, 0),
          he = o.reduce((He, Je) => {
            const bt = subCostoKey(t, Je.id),
              Et = ee[bt] || [],
              Po = ne[bt] || [];
            return (
              He +
              Et.reduce((Co, $) => {
                const ze = pagadoUSDDeProveedor(Po, $.proveedor);
                return Co + (Math.max(aUsd($.presupuesto, $.tc), ze) - ze);
              }, 0)
            );
          }, 0),
          Se = qe + z,
          je = Qe + he;
        let mt, $e;
        if (e.cliente === "WU") {
          const He =
              Fe.length > 0
                ? Fe.reduce((bt, Et) => bt + presupuestoEfectivo(Et.presupuesto, pagadoDeProveedor(N, Et.proveedor)), 0)
                : 0,
            Je =
              Fe.length > 0
                ? Fe.reduce(
                    (bt, Et) => bt + Math.max(aUsd(Et.presupuesto, Et.tc), pagadoUSDDeProveedor(N, Et.proveedor)),
                    0,
                  )
                : 0;
          ((mt = He + De), ($e = Je + Ce));
        } else
          ((mt =
            h && h.length > 0
              ? h.reduce((He, Je) => He + presupuestoEfectivo(Je.presupuesto, pagadoDeProveedor(N, Je.proveedor)), 0)
              : e.costoFinal),
            ($e =
              h && h.length > 0
                ? h.reduce(
                    (He, Je) => He + Math.max(aUsd(Je.presupuesto, Je.tc), pagadoUSDDeProveedor(N, Je.proveedor)),
                    0,
                  )
                : aUsd(e.costoFinal, e.tc)));
        const tt = Te ? ((Te - ft) / Te) * 100 : 0,
          yt = Ze ? ((Ze - mt) / Ze) * 100 : 0,
          uo = Ge ? ((Ge - to) / Ge) * 100 : 0,
          Xo = le ? ((le - $e) / le) * 100 : 0;
        return {
          ...e,
          ventaOriginal: Te,
          ventaOriginalUSD: Ge,
          ventaOriginalManual: e.ventaOriginal,
          costoInicial: ft,
          costoInicialUSD: to,
          costoInicialManual: e.costoInicial,
          totalAdicionales: u,
          totalAdicionalesUSD: m,
          totalSubobras: _,
          totalSubobrasUSD: xe,
          ventaFinal: Ze,
          ventaFinalUSD: le,
          costoFinal: mt,
          costoFinalUSD: $e,
          mbInicial: tt,
          mbFinal: yt,
          mbInicialUSD: uo,
          mbFinalUSD: Xo,
          saldoProveedores: Se,
          saldoProveedoresUSD: je,
          mzLatamVirtualSaldo: ie ? ie.presupuesto : 0,
        };
      }),
    [c, S, F, P, Pe, Z, ee, ne, vt, Oe],
  );
  useEffect(() => {
    const e = Sa.current,
      t = {};
    (co.forEach((u) => {
      const m = obraKey(u.cliente, u.obra),
        x = {};
      (S[m] || []).forEach((T) => {
        const O = (T.proveedor || "").trim();
        if (!O) return;
        const _ = pagadoDeProveedor(F[m] || [], T.proveedor);
        x[O] = (x[O] || 0) + presupuestoEfectivo(T.presupuesto, _);
      });
      const D = {};
      ((P[m] || []).forEach((T) => {
        const O = (T.concepto || "").trim() || "ADICIONAL";
        D[O] = (D[O] || 0) + (T.monto || 0);
      }),
        (t[m] = {
          cliente: u.cliente,
          obra: u.obra,
          venta: u.ventaFinal || 0,
          costo: u.costoFinal || 0,
          mb: u.mbFinal || 0,
          proveedores: x,
          adicionales: D,
        }));
    }),
      (Sa.current = t));
    const o = $n.current;
    if ((($n.current = false), !e || o)) return;
    const a = Date.now(),
      r = [];
    function i(u, m, x, D, T) {
      /* @__PURE__ */ new Set([...Object.keys(m || {}), ...Object.keys(x || {})]).forEach((_) => {
        const xe = Object.prototype.hasOwnProperty.call(m || {}, _),
          Ie = Object.prototype.hasOwnProperty.call(x || {}, _),
          Te = (m || {})[_] || 0,
          Ge = (x || {})[_] || 0;
        !xe && Ie
          ? r.push({ fecha: a, cliente: D, centroCosto: T, descripcion: u + " nuevo: " + _ + " (" + fmt(Ge) + ")" })
          : xe && !Ie
            ? r.push({
                fecha: a,
                cliente: D,
                centroCosto: T,
                descripcion: u + " eliminado: " + _ + " (tenía " + fmt(Te) + ")",
              })
            : Math.round(Te) !== Math.round(Ge) &&
              r.push({
                fecha: a,
                cliente: D,
                centroCosto: T,
                descripcion: u + " " + _ + ": " + fmt(Te) + " → " + fmt(Ge),
              });
      });
    }
    (Object.keys(t).forEach((u) => {
      const m = e[u];
      if (!m) return;
      const x = t[u];
      (Math.round(m.venta) !== Math.round(x.venta) &&
        r.push({
          fecha: a,
          cliente: x.cliente,
          centroCosto: x.obra,
          descripcion: "Venta Total: " + fmt(m.venta) + " → " + fmt(x.venta),
        }),
        i("Adicional", m.adicionales, x.adicionales, x.cliente, x.obra),
        Math.round(m.costo) !== Math.round(x.costo) &&
          r.push({
            fecha: a,
            cliente: x.cliente,
            centroCosto: x.obra,
            descripcion: "Costo Real: " + fmt(m.costo) + " → " + fmt(x.costo),
          }),
        i("Proveedor", m.proveedores, x.proveedores, x.cliente, x.obra),
        Math.round(m.mb * 10) !== Math.round(x.mb * 10) &&
          r.push({
            fecha: a,
            cliente: x.cliente,
            centroCosto: x.obra,
            descripcion: "MB Final: " + pct(m.mb) + " → " + pct(x.mb),
          }));
    }),
      r.length !== 0 &&
        ha((u) => {
          const m = a - 1728e5;
          return [...u.filter((D) => D.fecha >= m), ...r];
        }));
  }, [co, S, F, P]);
  function fr() {
    if (On.length === 0) {
      alert("No hay cambios registrados en las últimas 48hs para exportar.");
      return;
    }
    const e = [...On].sort((i, u) => i.fecha - u.fecha),
      t = ["Fecha", "Cliente", "Centro de Costo", "Qué se modificó"],
      o = e.map((i) => [
        new Date(i.fecha).toLocaleDateString("es-AR") +
          " " +
          new Date(i.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        i.cliente,
        i.centroCosto,
        i.descripcion,
      ]),
      a = XLSX.utils.aoa_to_sheet([t, ...o]),
      r = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(r, a, "Auditoria Venta-Costo-MB"),
      descargarLibroXlsx(
        r,
        "auditoria_venta_costo_mb_" + /* @__PURE__ */ new Date().toISOString().slice(0, 10) + ".xlsx",
      ));
  }
  const jo = useMemo(() => {
      if (ct !== "custom" || !so || !so.secciones || !so.secciones.obras) return co;
      const e = so.obrasScope;
      if (!e || e.modo !== "filtrado") return co;
      const t = new Set((e.items || []).map((o) => obraKey(o.cliente, o.obra)));
      return co.filter((o) => t.has(obraKey(o.cliente, o.obra)));
    }, [co, ct, so]),
    Tn = useMemo(() => {
      const e = {};
      return (
        jo.forEach((t) => {
          (e[t.cliente] || (e[t.cliente] = []), e[t.cliente].push(t));
        }),
        e
      );
    }, [jo]),
    Dn = (e) => {
      const t = MESES[e].slice(0, 3);
      return t.charAt(0) + t.slice(1).toLowerCase();
    },
    xn = useMemo(
      () => Array.from(new Set(jo.map((e) => e.anio || /* @__PURE__ */ new Date().getFullYear()))).sort(),
      [jo],
    );
  useEffect(() => {
    Io((e) => {
      const t = { ...e },
        o = /* @__PURE__ */ new Date().getFullYear();
      let a = false;
      return (
        xn.forEach((r) => {
          r in t || ((t[r] = r === o), (a = true));
        }),
        a ? t : e
      );
    });
  }, [xn]);
  const Ro = xn.filter((e) => pt[e] === true),
    Pi = useMemo(() => {
      const e = jo.reduce((u, m) => u + (m.ventaFinal || 0), 0),
        t = jo.reduce((u, m) => u + (m.costoFinal || 0), 0),
        o = jo.reduce((u, m) => u + (m.ventaFinalUSD || 0), 0),
        a = jo.reduce((u, m) => u + (m.costoFinalUSD || 0), 0),
        r = e ? ((e - t) / e) * 100 : 0,
        i = o ? ((o - a) / o) * 100 : 0;
      return {
        venta: e,
        costo: t,
        mb: r,
        ventaUSD: o,
        costoUSD: a,
        mbUSD: i,
        count: jo.length,
        clientCount: Object.keys(Tn).length,
      };
    }, [jo, Tn]),
    Vo = useMemo(() => jo.filter((e) => Ro.includes(e.anio || /* @__PURE__ */ new Date().getFullYear())), [jo, Ro]),
    Ln = (e) => (e.cliente !== "WU" && Number(e.m2)) || 0,
    ro = useMemo(() => {
      const e = Vo.reduce((O, _) => O + (_.ventaFinal || 0), 0),
        t = Vo.reduce((O, _) => O + (_.costoFinal || 0), 0),
        o = Vo.reduce((O, _) => O + (_.ventaFinalUSD || 0), 0),
        a = Vo.reduce((O, _) => O + (_.costoFinalUSD || 0), 0),
        r = Vo.reduce((O, _) => O + (_.saldoProveedores || 0), 0),
        i = Vo.reduce((O, _) => O + (_.saldoProveedoresUSD || 0), 0),
        u = e ? ((e - t) / e) * 100 : 0,
        m = o ? ((o - a) / o) * 100 : 0,
        x = new Set(Vo.map((O) => O.cliente)).size,
        D = Vo.reduce((O, _) => O + Ln(_), 0),
        T = D > 0 ? e / D : null;
      return {
        venta: e,
        costo: t,
        saldo: r,
        saldoUSD: i,
        mb: u,
        ventaUSD: o,
        costoUSD: a,
        mbUSD: m,
        count: Vo.length,
        clientCount: x,
        m2: D,
        precioM2: T,
      };
    }, [Vo]),
    un = useMemo(
      () =>
        Ro.map((e) => {
          const t = jo.filter((O) => (O.anio || /* @__PURE__ */ new Date().getFullYear()) === e),
            o = t.reduce((O, _) => O + _.ventaFinal, 0),
            a = t.reduce((O, _) => O + _.costoFinal, 0),
            r = t.reduce((O, _) => O + (_.ventaFinalUSD || 0), 0),
            i = t.reduce((O, _) => O + (_.costoFinalUSD || 0), 0),
            u = o ? ((o - a) / o) * 100 : 0,
            m = r ? ((r - i) / r) * 100 : 0,
            x = new Set(t.map((O) => O.cliente)).size,
            D = t.reduce((O, _) => O + Ln(_), 0),
            T = D > 0 ? o / D : null;
          return {
            anio: e,
            clientCount: x,
            count: t.length,
            venta: o,
            costo: a,
            mb: u,
            ventaUSD: r,
            costoUSD: i,
            mbUSD: m,
            m2: D,
            precioM2: T,
          };
        }),
      [jo, Ro],
    ),
    ka = useMemo(() => {
      const e = {};
      return (
        Vo.forEach((t) => {
          (e[t.cliente] || (e[t.cliente] = []), e[t.cliente].push(t));
        }),
        e
      );
    }, [Vo]),
    ra = useMemo(() => {
      const e = {};
      return (
        Vo.forEach((t) => {
          e[t.cliente] = (e[t.cliente] || 0) + t.ventaFinal;
        }),
        Object.entries(e)
          .map(([t, o]) => ({ name: t, value: o }))
          .sort((t, o) => o.value - t.value)
      );
    }, [Vo]),
    Rn = useMemo(
      () =>
        Array.from(new Set(Vo.map((t) => t.cliente)))
          .map((t) => {
            const o = { cliente: t };
            let a = 0;
            return (
              Ro.forEach((r) => {
                const i = Vo.filter(
                  (u) => u.cliente === t && (u.anio || /* @__PURE__ */ new Date().getFullYear()) === r,
                ).reduce((u, m) => u + m.ventaFinal, 0);
                ((o[r] = i), (a += i));
              }),
              (o.total = a),
              o
            );
          })
          .sort((t, o) => o.total - t.total),
      [Vo, Ro],
    ),
    Ta = useMemo(() => {
      if (Rn.length <= 8) return Rn;
      const e = Rn.slice(0, 8),
        t = Rn.slice(8),
        o = { cliente: "OTROS (" + t.length + ")", total: 0 };
      return (
        Ro.forEach((a) => {
          o[a] = 0;
        }),
        t.forEach((a) => {
          (Ro.forEach((r) => {
            o[r] += a[r] || 0;
          }),
            (o.total += a.total));
        }),
        [...e, o]
      );
    }, [Rn, Ro]),
    An = useMemo(() => {
      const e = [];
      return (
        co.forEach((t) => {
          const o = obraKey(t.cliente, t.obra),
            a = Pe[o] || [],
            r = a.length > 0,
            adicOC = r ? adicionalesPorOC(Z[o], a.map((m) => m.ordenCompra)) : {},
            adicUsados = new Set();
          let adicMovido = 0,
            adicMovidoUSD = 0;
          const adicDeOC = (m) => {
            const k = normOC(m.ordenCompra),
              g = adicOC[k];
            return !g || adicUsados.has(k)
              ? null
              : (adicUsados.add(k), (adicMovido += g.monto), (adicMovidoUSD += g.montoUSD), g);
          };
          a.forEach((m) => adicDeOC(m));
          adicUsados.clear();
          const i = r
              ? (t.totalAdicionales || 0) - adicMovido
              : (t.ventaOriginal || 0) + (t.totalAdicionales || 0),
            u = r
              ? (t.totalAdicionalesUSD || 0) - adicMovidoUSD
              : aUsd(t.ventaOriginal, t.tc) + (t.totalAdicionalesUSD || 0);
          (e.push({
            anio: t.anio || /* @__PURE__ */ new Date().getFullYear(),
            mesIdx: MESES.indexOf(t.mes || "ENERO"),
            monto: i,
            montoUSD: u,
            cliente: t.cliente,
            key: o,
          }),
            a.forEach((m) => {
              const x = parseFechaMesAnio(m.fecha) || {
                anio: t.anio || /* @__PURE__ */ new Date().getFullYear(),
                mesIdx: MESES.indexOf(t.mes || "ENERO"),
              };
              const g = adicDeOC(m);
              e.push({
                anio: x.anio,
                mesIdx: x.mesIdx,
                monto: (m.venta || 0) + (g ? g.monto : 0),
                montoUSD: aUsd(m.venta, m.tc) + (g ? g.montoUSD : 0),
                cliente: t.cliente,
                key: o,
              });
            }));
        }),
        e
      );
    }, [co, Pe, Z]),
    mr = useMemo(
      () =>
        MESES.map((e, t) => {
          const o = { label: Dn(t), mesIdx: t };
          return (
            Ro.forEach((a) => {
              o[a] = An.filter((r) => r.anio === a && r.mesIdx === t).reduce((r, i) => r + i.monto, 0);
            }),
            o
          );
        }),
      [An, Ro],
    ),
    Ao = useMemo(() => {
      const e = /* @__PURE__ */ new Date().getFullYear(),
        t = e - 1,
        o = /* @__PURE__ */ new Date().getMonth(),
        a = (xe) => An.filter((Ie) => Ie.anio === xe && Ie.mesIdx <= o).reduce((Ie, Te) => Ie + Te.monto, 0),
        r = (xe) => An.filter((Ie) => Ie.anio === xe && Ie.mesIdx <= o).reduce((Ie, Te) => Ie + (Te.montoUSD || 0), 0),
        i = a(e),
        u = a(t),
        m = i - u,
        x = u ? (m / u) * 100 : null,
        D = r(e),
        T = r(t),
        O = D - T,
        _ = T ? (O / T) * 100 : null;
      return {
        currentYear: e,
        previousYear: t,
        currentMonthIdx: o,
        actual: i,
        anterior: u,
        delta: m,
        deltaPct: x,
        actualUSD: D,
        anteriorUSD: T,
        deltaUSD: O,
        deltaPctUSD: _,
      };
    }, [An]),
    ia = useMemo(() => {
      const e = /* @__PURE__ */ new Date(),
        t = e.getFullYear(),
        o = t - 1,
        a = e.getMonth(),
        r = {};
      co.forEach((W) => {
        r[obraKey(W.cliente, W.obra)] = W.anio || t;
      });
      const i = (W) => W.reduce((pe, Mt) => pe + (Mt.importe || 0), 0),
        u = (W, pe) => An.filter((Mt) => Mt.anio === W && Mt.mesIdx === pe).reduce((Mt, io) => Mt + io.monto, 0),
        m = MESES.map((W, pe) => ({ label: Dn(pe), [o]: u(o, pe), [t]: pe <= a ? u(t, pe) : 0 })),
        x = m.reduce((W, pe) => W + pe[o], 0),
        D = m.reduce((W, pe) => W + pe[t], 0),
        T = (W) => co.filter((pe) => (pe.anio || t) === W).reduce((pe, Mt) => pe + Mt.ventaFinal, 0),
        O = (W) => g.filter((pe) => r[obraKey(pe.cliente, pe.obra)] === W),
        _ = T(o),
        xe = T(t),
        Ie = i(O(o)),
        Te = O(t),
        Ge = i(Te),
        Ze = _ - Ie,
        le = xe - Ge,
        ft = co.reduce((W, pe) => W + pe.ventaFinal, 0),
        to = g.reduce((W, pe) => W + (pe.importe || 0), 0),
        h = ft - to,
        N = g.filter((W) => W.status === "ADEUDA").reduce((W, pe) => W + (pe.importe || 0), 0),
        De = h + N,
        Ce = MESES.slice(0, a + 1).map((W, pe) => ({
          mes: Dn(pe),
          importe: i(Te.filter((Mt) => mesIdxDeFecha(Mt.fecha) === pe)),
        })),
        ie = /* @__PURE__ */ new Set([...co.map((W) => W.cliente), ...g.map((W) => W.cliente)]),
        Fe = Array.from(ie)
          .map((W) => ({
            cliente: W,
            monto: g
              .filter((pe) => pe.cliente === W && pe.status === "ADEUDA")
              .reduce((pe, Mt) => pe + (Mt.importe || 0), 0),
          }))
          .filter((W) => W.monto >= 1)
          .sort((W, pe) => pe.monto - W.monto),
        qe = Array.from(new Set(co.map((W) => W.cliente)))
          .map((W) => {
            const pe = co.filter((wo) => wo.cliente === W),
              Mt = pe.reduce((wo, To) => wo + To.ventaFinal, 0),
              io = pe.reduce(
                (wo, To) =>
                  wo +
                  g
                    .filter((Pt) => Pt.cliente === To.cliente && Pt.obra === To.obra)
                    .reduce((Pt, mo) => Pt + (mo.importe || 0), 0),
                0,
              );
            return { cliente: W, monto: Mt - io };
          })
          .filter((W) => W.monto >= 1)
          .sort((W, pe) => pe.monto - W.monto),
        Qe = co.filter((W) => (W.anio || t) === t),
        z = Array.from(new Set(Qe.map((W) => W.cliente))),
        he = z
          .map((W) => ({
            cliente: W,
            venta: Qe.filter((pe) => pe.cliente === W).reduce((pe, Mt) => pe + Mt.ventaFinal, 0),
          }))
          .sort((W, pe) => pe.venta - W.venta),
        Se = he.reduce((W, pe) => W + pe.venta, 0),
        je = z
          .map((W) => {
            const pe = Qe.filter((_o) => _o.cliente === W),
              Mt = pe.reduce((_o, Cn) => _o + Cn.ventaFinal, 0),
              io = pe.reduce((_o, Cn) => _o + (Cn.ventaOriginal || 0), 0),
              wo = pe.reduce((_o, Cn) => _o + (Cn.costoInicial || 0), 0),
              To = pe.reduce((_o, Cn) => _o + (Cn.costoFinal || 0), 0),
              Pt = io ? ((io - wo) / io) * 100 : 0,
              mo = Mt ? ((Mt - To) / Mt) * 100 : 0;
            return { cliente: W, venta: Mt, mbInicial: Pt, mbFinal: mo, variacion: mo - Pt };
          })
          .sort((W, pe) => pe.venta - W.venta),
        mt = (() => {
          const W = Qe.reduce((Pt, mo) => Pt + mo.ventaFinal, 0),
            pe = Qe.reduce((Pt, mo) => Pt + (mo.ventaOriginal || 0), 0),
            Mt = Qe.reduce((Pt, mo) => Pt + (mo.costoInicial || 0), 0),
            io = Qe.reduce((Pt, mo) => Pt + (mo.costoFinal || 0), 0),
            wo = pe ? ((pe - Mt) / pe) * 100 : 0,
            To = W ? ((W - io) / W) * 100 : 0;
          return { venta: W, mbInicial: wo, mbFinal: To, variacion: To - wo };
        })(),
        tt = generarSemanas(gn, 12),
        yt = g.filter((W) => W.status === "ADEUDA").map((W) => ({ id: "f" + W.id, importe: W.importe || 0 })),
        uo = co
          .map((W) => {
            const pe = g
                .filter((io) => io.cliente === W.cliente && io.obra === W.obra)
                .reduce((io, wo) => io + (wo.importe || 0), 0),
              Mt = W.ventaFinal - pe;
            return { o: W, pendiente: Mt };
          })
          .filter((W) => W.pendiente > 1)
          .map(({ o: W, pendiente: pe }) => ({ id: "pf|" + W.cliente + "|" + W.obra, importe: pe })),
        Xo = [...yt, ...uo],
        He = {};
      (Object.entries(S).forEach(([W, pe]) => {
        const Mt = F[W] || [];
        pe.forEach((io) => {
          const wo = Mt.filter((Pt) => Pt.proveedor === io.proveedor).reduce((Pt, mo) => Pt + mo.monto, 0),
            To = (io.presupuesto || 0) - wo;
          if (To > 1) {
            const Pt = "cc|" + W;
            (He[Pt] || (He[Pt] = { ccId: Pt, proveedores: [] }),
              He[Pt].proveedores.push({ id: W + "|" + io.proveedor, saldo: To }));
          }
        });
      }),
        Object.entries(ee || {}).forEach(([W, pe]) => {
          const Mt = (ne || {})[W] || [];
          pe.forEach((io) => {
            const wo = Mt.filter((Pt) => Pt.proveedor === io.proveedor).reduce((Pt, mo) => Pt + mo.monto, 0),
              To = (io.presupuesto || 0) - wo;
            if (To > 1) {
              const Pt = "cc|" + W;
              (He[Pt] || (He[Pt] = { ccId: Pt, proveedores: [] }),
                He[Pt].proveedores.push({ id: W + "|" + io.proveedor, saldo: To }));
            }
          });
        }));
      const Je = Object.values(He),
        bt = (W, pe) => {
          const Mt = Number(G[W.ccId + "|" + pe]) || 0,
            io = W.proveedores.reduce((wo, To) => wo + (Number(G[To.id + "|" + pe]) || 0), 0);
          return Math.max(Mt, io);
        },
        regMapApp = regaliasPorSemana(g, tt),
        Et = tt.map((W) => {
          const pe = Xo.reduce((mo, _o) => mo + (Number(nt[_o.id + "|" + W]) || 0), 0),
            Mt = qt.reduce((mo, _o) => mo + (Number(oo[_o + "|" + W]) || 0), 0),
            io = pe + Mt,
            wo = w.reduce((mo, _o) => mo + (Number(Re[_o + "|" + W]) || 0), 0),
            To = Je.reduce((mo, _o) => mo + bt(_o, W), 0),
            Pt = wo + To + regaliaPendiente(regMapApp, cfRegPag, W);
          return { semana: W, ingresos: io, egresos: Pt, neto: io - Pt };
        });
      let Po = Number(V) || 0;
      const Co = Et.map((W) => ((Po += W.neto), Po)),
        $ = Et.map((W, pe) => [semanaLabelCorta(W.semana), fmt(W.ingresos), fmt(W.egresos), fmt(W.neto), fmt(Co[pe])]),
        ze = Et.map((W, pe) => ({ semana: semanaLabelCorta(W.semana), saldo: Co[pe] })),
        pa = Et.reduce((W, pe) => W + pe.ingresos, 0),
        Di = Et.reduce((W, pe) => W + pe.egresos, 0),
        Ri = Co.length ? Co[Co.length - 1] : Number(V) || 0;
      return {
        anioActual: t,
        anioAnterior: o,
        mesActualIdx: a,
        chartVentaMes: m,
        totalVentaAnterior: x,
        totalVentaActual: D,
        ventaAnioAnterior: _,
        ventaAnioActual: xe,
        facturadoAnioAnterior: Ie,
        facturadoAnioActual: Ge,
        restaAnioAnterior: Ze,
        restaAnioActual: le,
        totalPorFacturar: h,
        facturadoPendCobro: N,
        totalPendienteIngresos: De,
        facturacionMensualActual: Ce,
        pendCobroPorCliente: Fe,
        deudaSinFacturarPorCliente: qe,
        ventaPorClienteActual: he,
        totalVentaClienteActual: Se,
        margenPorCliente: je,
        margenTotal: mt,
        cashRows: $,
        cashChart: ze,
        saldoInicialCash: Number(V) || 0,
        saldoProyectadoCash: Ri,
        totalIngresosCash: pa,
        totalEgresosCash: Di,
      };
    }, [co, g, S, F, ee, ne, gn, V, nt, qt, oo, w, Re, G, cfRegPag]);
  function La(e) {
    const t = Number(e.venta) || 0,
      o = Number(e.costoInicial) || 0;
    (p((a) => [
      ...a,
      {
        cliente: e.cliente.toUpperCase(),
        obra: e.obra.toUpperCase(),
        status: "EN PROCESO",
        costoInicial: o,
        costoFinal: o,
        ventaOriginal: t,
        tc: Oe,
        mes: e.mes || "ENERO",
        anio: Number(e.anio) || /* @__PURE__ */ new Date().getFullYear(),
      },
    ]),
      _t("Nueva obra: " + e.cliente.toUpperCase() + " - " + e.obra.toUpperCase()),
      ln(false));
  }
  function sa(e, t) {
    const o = Number(t.presupuestoOriginal) || 0,
      a = Number(t.presupuesto) || o,
      r = t.proveedor.toUpperCase();
    (_t("Nuevo proveedor " + r + " en " + e),
      f((i) => ({
        ...i,
        [e]: consolidarProveedores([...(i[e] || []), { proveedor: r, presupuestoOriginal: o, presupuesto: a, tc: Oe }]),
      })),
      qn(r),
      xo((i) => ({ ...i, [e]: null })));
  }
  function br(e, t) {
    const o = Number(t.monto) || 0;
    (A((a) => ({
      ...a,
      [e]: [
        ...(a[e] || []),
        {
          proveedor: t.proveedor.toUpperCase(),
          monto: o,
          fecha: t.fecha || "—",
          fc: t.fc || "—",
          observaciones: t.observaciones || "",
          tc: Oe,
        },
      ],
    })),
      _t("Pago a " + t.proveedor.toUpperCase() + " en " + e + ": " + fmt(o)),
      st((a) => ({ ...a, [e]: null })));
  }
  function _n(e) {
    const t = obraKey(e.cliente, e.obra);
    if (e.subObra) {
      const o = Z[t] || [],
        a = o.findIndex((r) => (r.nombre || "").trim().toUpperCase() === e.subObra.trim().toUpperCase());
      return a < 0
        ? { ok: false, motivo: 'No se encontró la sub obra "' + e.subObra + '" en ' + e.cliente + " / " + e.obra }
        : { ok: true, target: "sub", subK: subCostoKey(t, o[a].id) };
    }
    return c.some((o) => obraKey(o.cliente, o.obra) === t)
      ? { ok: true, target: "main", key: t }
      : { ok: false, motivo: 'No se encontró la obra "' + e.obra + '" para el cliente "' + e.cliente + '"' };
  }
  function vr(e) {
    const t = _n(e);
    if (!t.ok) return t;
    const o = {
      proveedor: e.proveedor,
      monto: e.importe,
      fecha: e.fecha,
      fc: e.factura,
      observaciones: e.observaciones || "",
      tc: Oe,
    };
    return t.target === "sub"
      ? (ee[t.subK] || []).some((i) => i.proveedor === e.proveedor)
        ? { ok: true, target: "sub", subK: t.subK, pago: o }
        : { ok: false, motivo: 'El proveedor "' + e.proveedor + '" no está cargado en esa sub obra' }
      : (S[t.key] || []).some((r) => r.proveedor === e.proveedor)
        ? { ok: true, target: "main", key: t.key, pago: o }
        : { ok: false, motivo: 'El proveedor "' + e.proveedor + '" no está cargado en esa obra' };
  }
  function za(e) {
    const t = e.filter((a) => a.target === "main"),
      o = e.filter((a) => a.target === "sub");
    (t.length &&
      A((a) => {
        const r = { ...a };
        return (
          t.forEach(({ key: i, pago: u }) => {
            r[i] = [...(r[i] || []), u];
          }),
          r
        );
      }),
      o.length &&
        Be((a) => {
          const r = { ...a };
          return (
            o.forEach(({ subK: i, pago: u }) => {
              r[i] = [...(r[i] || []), u];
            }),
            r
          );
        }));
  }
  function hr(e) {
    const t = [],
      o = [];
    return (
      e.forEach((a) => {
        const r = vr(a);
        r.ok ? o.push(r) : t.push({ ...a, motivo: r.motivo });
      }),
      za(o),
      { aplicadosCount: o.length, fallidos: t }
    );
  }
  function Ba(e) {
    const t = _n(e);
    if (!t.ok) return t;
    const o = (e.proveedor || "").trim().toUpperCase();
    if (!o) return { ok: false, motivo: "Falta el nombre del proveedor" };
    if (!(t.target === "sub" ? ee[t.subK] || [] : S[t.key] || []).some((u) => u.proveedor === o)) {
      const u = Number(e.presupuestoOriginal) || 0,
        m = Number(e.presupuestoReal) || u;
      t.target === "sub"
        ? da(t.subK, { proveedor: o, presupuestoOriginal: u, presupuesto: m })
        : sa(t.key, { proveedor: o, presupuestoOriginal: u, presupuesto: m });
    }
    const i = {
      proveedor: o,
      monto: Number(e.importe) || 0,
      fecha: e.fecha,
      fc: e.factura,
      observaciones: e.observaciones || "",
      tc: Oe,
      ...(e.origenSemanalId ? { _origenSemanalId: e.origenSemanalId } : {}),
    };
    return (
      za([{ target: t.target, key: t.key, subK: t.subK, pago: i }]),
      { ok: true, target: t.target, key: t.key, subK: t.subK }
    );
  }
  function yr(e, t, o) {
    (f((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              proveedor: (o.proveedor || r.proveedor).toUpperCase(),
              presupuestoOriginal: Number(o.presupuestoOriginal) || 0,
              presupuesto: Number(o.presupuesto) || 0,
              tc: r.tc || Oe,
            },
      ),
    })),
      _t("Editó proveedor en " + e + ": " + (o.proveedor || "").toUpperCase()));
  }
  function Sr(e, t) {
    const o = (S[e] || [])[t]?.proveedor || "";
    (f((a) => ({ ...a, [e]: a[e].filter((r, i) => i !== t) })), _t("Borró proveedor " + o + " de " + e));
  }
  function xr(e) {
    (y((t) => ({ ...t, [e]: true })), _t("Ocultó el proveedor MZ LATAM de " + e));
  }
  function Ar(e, t, o) {
    (A((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              proveedor: (o.proveedor || r.proveedor).toUpperCase(),
              monto: Number(o.monto) || 0,
              fecha: o.fecha || r.fecha,
              fc: o.fc || r.fc,
              observaciones: o.observaciones !== void 0 ? o.observaciones : r.observaciones || "",
              tc: r.tc || Oe,
            },
      ),
    })),
      _t("Editó pago en " + e + ": " + (o.proveedor || "").toUpperCase()));
  }
  function Cr(e, t) {
    const o = (F[e] || [])[t];
    (A((a) => ({ ...a, [e]: a[e].filter((r, i) => i !== t) })),
      _t("Borró pago" + (o ? " de " + o.proveedor + " (" + fmt(o.monto) + ")" : "") + " en " + e));
  }
  function Er() {
    const e = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      fechaPagado: "",
      sePaga: "SI",
      cliente: "",
      centroCosto: "",
      subObra: "",
      proveedor: "",
      proveedorPago: "",
      cuit: "",
      razonSocial: "",
      mo: false,
      mat: false,
      factura: "",
      facturaA: false,
      importe: 0,
      importeBruto: 0,
      observaciones: "",
      diegoLevy: 0,
      efectivo: 0,
      transferencia: 0,
      echeq: 0,
      cbu: "",
      tc: Oe,
      registradoEnCostos: false,
      motivoError: "",
      alertaPresupuesto: false,
      restanteAntesPago: 0,
    };
    L((t) => [...t, e]);
  }
  function Or(e) {
    const t = Date.now().toString(36),
      o = e.map((a, r) => ({
        fechaPagado: "",
        sePaga: "SI",
        cliente: "",
        centroCosto: "",
        subObra: "",
        proveedor: "",
        proveedorPago: "",
        cuit: "",
        razonSocial: "",
        mo: false,
        mat: false,
        factura: "",
        facturaA: false,
        importe: 0,
        importeBruto: 0,
        observaciones: "",
        diegoLevy: 0,
        efectivo: 0,
        transferencia: 0,
        echeq: 0,
        cbu: "",
        tc: Oe,
        registradoEnCostos: false,
        motivoError: "",
        alertaPresupuesto: false,
        restanteAntesPago: 0,
        ...a,
        id: t + "-" + r + "-" + Math.random().toString(36).slice(2, 8),
      }));
    L((a) => [...a, ...o]);
  }
  function zn(e, t) {
    L((o) => o.map((a) => (a.id !== e ? a : { ...a, ...t })));
  }
  function Ir(e, t) {
    e && ve((o) => ({ ...o, [e]: { ...(o[e] || {}), ...t } }));
  }
  function Dr(e, t, o) {
    const a = (e || "").trim().toUpperCase(),
      r = (t || "").trim().toUpperCase();
    !a ||
      !r ||
      c.some((i) => obraKey(i.cliente, i.obra) === obraKey(a, r)) ||
      La({
        cliente: a,
        obra: r,
        venta: (o || {}).venta,
        costoInicial: (o || {}).costoInicial,
        mes: "ENERO",
        anio: /* @__PURE__ */ new Date().getFullYear(),
      });
  }
  function Rr(e, t, o) {
    const a = obraKey((e || "").trim().toUpperCase(), (t || "").trim().toUpperCase()),
      r = (o || "").trim().toUpperCase();
    r && ((Z[a] || []).some((i) => (i.nombre || "").trim().toUpperCase() === r) || Wa(a, r));
  }
  function Pr(e, t, o, a, r) {
    const i = (a || "").trim().toUpperCase();
    if (!i) return;
    const u = _n({ cliente: e, obra: t, subObra: o });
    if (!u.ok || (u.target === "sub" ? ee[u.subK] || [] : S[u.key] || []).some((T) => T.proveedor === i)) return;
    const x = Number((r || {}).presupuestoOriginal) || 0,
      D = Number((r || {}).presupuestoReal) || x;
    u.target === "sub"
      ? da(u.subK, { proveedor: i, presupuestoOriginal: x, presupuesto: D })
      : sa(u.key, { proveedor: i, presupuestoOriginal: x, presupuesto: D });
  }
  function Ua(e) {
    (A((t) => {
      let o = false;
      const a = {};
      return (
        Object.keys(t).forEach((r) => {
          const i = (t[r] || []).filter((u) => u._origenSemanalId !== e);
          (i.length !== (t[r] || []).length && (o = true), (a[r] = i));
        }),
        o ? a : t
      );
    }),
      Be((t) => {
        let o = false;
        const a = {};
        return (
          Object.keys(t).forEach((r) => {
            const i = (t[r] || []).filter((u) => u._origenSemanalId !== e);
            (i.length !== (t[r] || []).length && (o = true), (a[r] = i));
          }),
          o ? a : t
        );
      }));
  }
  function Ma(e, t) {
    const o = k.find((_) => _.id === e);
    if (!o) return;
    if ((o.cliente || "").trim().toUpperCase() === CLIENTE_GASTOS_INTERNOS) {
      zn(e, { registradoEnCostos: true, motivoError: "", alertaPresupuesto: false, restanteAntesPago: 0 });
      return;
    }
    const a = (o.proveedor || "").trim().toUpperCase(),
      r = Number(o.importeBruto) || 0,
      i = r,
      u = [o.observaciones, o.proveedorPago || o.proveedor, o.factura]
        .map((_) => (_ || "").toString().trim())
        .filter(Boolean)
        .join(" / "),
      m = {
        cliente: o.cliente,
        obra: o.centroCosto,
        subObra: o.subObra,
        proveedor: a,
        importe: r,
        fecha: t,
        factura: o.factura,
        observaciones: u,
        origenSemanalId: e,
      },
      x = _n(m);
    let D = false,
      T = 0;
    if (x.ok) {
      const xe = (x.target === "sub" ? ee[x.subK] || [] : S[x.key] || []).find((Ze) => Ze.proveedor === a),
        Ie = (xe && Number(xe.presupuesto)) || 0,
        Ge = (x.target === "sub" ? ne[x.subK] || [] : F[x.key] || [])
          .filter((Ze) => Ze.proveedor === a)
          .reduce((Ze, le) => Ze + (Number(le.monto) || 0), 0);
      ((T = Ie - Ge), (D = Ge + i > Ie));
    }
    const O = Ba(m);
    if (!O.ok) {
      zn(e, { registradoEnCostos: false, motivoError: O.motivo, alertaPresupuesto: false, restanteAntesPago: 0 });
      return;
    }
    zn(e, { registradoEnCostos: true, motivoError: "", alertaPresupuesto: D, restanteAntesPago: T });
  }
  function wr(e, t) {
    const o = k.find((a) => a.id === e);
    !o ||
      t === o.fechaPagado ||
      (o.registradoEnCostos && Ua(e),
      zn(e, {
        fechaPagado: t,
        registradoEnCostos: false,
        motivoError: "",
        alertaPresupuesto: false,
        restanteAntesPago: 0,
      }),
      t && Ma(e, t),
      _t(
        t
          ? "Marcó Fecha Pagado (" +
              t +
              ") en Pagos: " +
              (o.proveedor || "—") +
              " / " +
              (o.cliente || "—") +
              " " +
              (o.centroCosto || "")
          : "Quitó Fecha Pagado en Pagos: " +
              (o.proveedor || "—") +
              " / " +
              (o.cliente || "—") +
              " " +
              (o.centroCosto || ""),
      ));
  }
  function Nr(e) {
    const t = k.find((o) => o.id === e);
    !t || !t.fechaPagado || t.registradoEnCostos || Ma(e, t.fechaPagado);
  }
  function Fr(e) {
    const t = k.find((o) => o.id === e);
    (Ua(e),
      L((o) => o.filter((a) => a.id !== e)),
      _t("Borró línea de Pagos" + (t ? ": " + (t.proveedor || "—") + " / " + (t.cliente || "—") : "")));
  }
  function Wa(e, t) {
    (Ye((o) => ({
      ...o,
      [e]: [
        ...(o[e] || []),
        {
          id: nuevoSubCostoId(),
          nombre: t || "SUB OBRA",
          status: "EN PROCESO",
          venta: 0,
          ordenCompra: "",
          adicionales: [],
        },
      ],
    })),
      nn(null));
  }
  function la(e, t, o) {
    const [a, r] = e.split("|"),
      i = (t || "").trim().toUpperCase();
    !i ||
      i === (o || "").trim().toUpperCase() ||
      L((u) => {
        let m = false;
        const x = u.map((D) =>
          (D.cliente || "").trim().toUpperCase() === a &&
          (D.centroCosto || "").trim().toUpperCase() === r &&
          (D.subObra || "").trim().toUpperCase() === i
            ? ((m = true), { ...D, subObra: o })
            : D,
        );
        return m ? x : u;
      });
  }
  function kr(e, t, o) {
    const a = (o || "").trim();
    if (!a) return;
    const r = Z[e] || [],
      i = r[t];
    if (!i) return;
    const u = r.findIndex((m, x) => x !== t && (m.nombre || "").trim().toUpperCase() === a.toUpperCase());
    if (u >= 0) {
      const m = r[u];
      if (
        !window.confirm(
          'Ya existe otra sub obra llamada "' +
            m.nombre +
            `" en esta obra.

¿Unificar "` +
            i.nombre +
            `" con esa, manteniendo los datos de las dos (proveedores, pagos, venta y Orden de Compra)?

Esta acción no se puede deshacer con el botón "Deshacer".`,
        )
      )
        return;
      Tr(e, t, u, a);
      return;
    }
    (Ye((m) => ({ ...m, [e]: m[e].map((x, D) => (D !== t ? x : { ...x, nombre: a || x.nombre })) })),
      la(e, i.nombre, a));
  }
  function Tr(e, t, o, a) {
    const r = Z[e] || [],
      i = r[t],
      u = r[o];
    if (!i || !u) return;
    const m = subCostoKey(e, i.id),
      x = subCostoKey(e, u.id),
      D = montosPorOCDe(i),
      T = montosPorOCDe(u),
      O = { ...D };
    Object.entries(T).forEach(([Ge, Ze]) => {
      O[Ge] = (O[Ge] || 0) + (Number(Ze) || 0);
    });
    const _ = Object.values(O).reduce((Ge, Ze) => Ge + (Number(Ze) || 0), 0),
      xe = Array.from(
        /* @__PURE__ */ new Set([
          ...(i.ordenCompra || "")
            .split(",")
            .map((Ge) => Ge.trim())
            .filter(Boolean),
          ...(u.ordenCompra || "")
            .split(",")
            .map((Ge) => Ge.trim())
            .filter(Boolean),
        ]),
      ),
      Ie = {
        ...u,
        nombre: a || u.nombre,
        status: i.status === "EN PROCESO" || u.status === "EN PROCESO" ? "EN PROCESO" : u.status || i.status,
        venta: _,
        montosPorOC: O,
        ordenCompra: xe.join(", "),
        adicionales: [...(u.adicionales || []), ...(i.adicionales || [])],
        tc: u.tc || i.tc,
      };
    (Ye((Ge) => ({ ...Ge, [e]: (Ge[e] || []).filter((Ze, le) => le !== t).map((Ze) => (Ze.id === u.id ? Ie : Ze)) })),
      lt((Ge) => {
        const Ze = { ...Ge };
        return ((Ze[x] = consolidarProveedores([...(Ge[x] || []), ...(Ge[m] || [])])), delete Ze[m], Ze);
      }),
      Be((Ge) => {
        const Ze = { ...Ge };
        return ((Ze[x] = [...(Ge[x] || []), ...(Ge[m] || [])]), delete Ze[m], Ze);
      }));
    const Te = a || u.nombre;
    (la(e, i.nombre, Te),
      la(e, u.nombre, Te),
      _t(
        'Unificó la sub obra "' +
          i.nombre +
          '" con "' +
          u.nombre +
          '" en ' +
          e.replace("|", " - ") +
          ' (nombre final: "' +
          Te +
          '")',
      ));
  }
  function Lr(e, t, o) {
    Ye((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              ...r,
              venta: Number(o.venta) || 0,
              ordenCompra: o.ordenCompra !== void 0 ? o.ordenCompra : r.ordenCompra || "",
              tc: r.tc || Oe,
            },
      ),
    }));
  }
  function zr(e, t) {
    const o = String(e || "").trim(),
      a = String(t || "").trim();
    !o ||
      !a ||
      o.length < 5 ||
      normalizarTexto(o) === normalizarTexto(a) ||
      kt((r) => {
        const i = r || { cliente: {}, centroCosto: {}, subObra: {}, imputacion: {}, proveedor: {} },
          u = { ...(i.subObra || {}) };
        return ((u[normalizarTexto(o)] = a), { ...i, subObra: u });
      });
  }
  function Br(e, t, o, a, r) {
    (Ye((i) => {
      const u = [...(i[e] || [])],
        m = /* @__PURE__ */ new Map(),
        x = /* @__PURE__ */ new Map();
      return (
        a.forEach((D) => {
          if (D.targetIdx !== null && D.targetIdx !== void 0 && u[D.targetIdx])
            m.set(D.targetIdx, (m.get(D.targetIdx) || 0) + (D.monto || 0));
          else {
            const T = (D.nombreNueva || "VARIOS").trim() || "VARIOS";
            x.set(T, (x.get(T) || 0) + (D.monto || 0));
          }
        }),
        m.forEach((D, T) => {
          const O = u[T];
          u[T] = { ...conMontoDeOC(O, t, D), tc: O.tc || Oe };
        }),
        x.forEach((D, T) => {
          u.push(
            conMontoDeOC(
              {
                id: nuevoSubCostoId(),
                nombre: T,
                status: "EN PROCESO",
                venta: 0,
                ordenCompra: "",
                adicionales: [],
                tc: Oe,
              },
              t,
              D,
            ),
          );
        }),
        { ...i, [e]: u }
      );
    }),
      ye((i) => {
        const u = i[e] || [];
        if (u.some((D) => (D.ordenCompra || "").trim().toUpperCase() === t.trim().toUpperCase())) return i;
        const x = normalizarFecha(r) || normalizarFecha(/* @__PURE__ */ new Date().toLocaleDateString("es-AR")) || "—";
        return {
          ...i,
          [e]: [...u, { ordenCompra: t, venta: o || 0, fecha: x, observaciones: "Importado de PDF", tc: Oe }],
        };
      }),
      _t("Importó PDF de orden de compra " + t + " en " + e + " (" + a.length + " sub obra(s))"));
  }
  function Ur(e, t, o) {
    const a = Number(o.monto) || 0,
      r = (Z[e] || [])[t] || {},
      i = r.nombre || "SUB OBRA";
    (Ye((u) => ({
      ...u,
      [e]: u[e].map((m, x) =>
        x !== t
          ? m
          : {
              ...m,
              adicionales: [...(m.adicionales || []), { concepto: o.concepto || "ADICIONAL", monto: a, tc: Oe }],
            },
      ),
    })),
      _t("Adicional en sub obra " + i + " (" + e + "): " + (o.concepto || "ADICIONAL") + " " + fmt(a)),
      xt((u) => ({ ...u, [subCostoKey(e, r.id)]: null })));
  }
  function Mr(e, t, o, a) {
    Ye((r) => ({
      ...r,
      [e]: r[e].map((i, u) =>
        u !== t
          ? i
          : {
              ...i,
              adicionales: (i.adicionales || []).map((m, x) =>
                x !== o ? m : { concepto: a.concepto || m.concepto, monto: Number(a.monto) || 0, tc: m.tc || Oe },
              ),
            },
      ),
    }));
  }
  function Wr(e, t, o) {
    Ye((a) => ({
      ...a,
      [e]: a[e].map((r, i) => (i !== t ? r : { ...r, adicionales: (r.adicionales || []).filter((u, m) => m !== o) })),
    }));
  }
  function Ga(e, t) {
    Ye((o) => ({
      ...o,
      [e]: o[e].map((a, r) =>
        r !== t ? a : { ...a, status: a.status === "FINALIZADA" ? "EN PROCESO" : "FINALIZADA" },
      ),
    }));
  }
  function Gr(e) {
    Zo &&
      (Ga(Zo.k, e),
      s(
        (t) =>
          t && {
            ...t,
            subObras: t.subObras.map((o) =>
              o.idx !== e ? o : { ...o, status: o.status === "FINALIZADA" ? "EN PROCESO" : "FINALIZADA" },
            ),
          },
      ));
  }
  function jr(e, t) {
    const o = (Z[e] || [])[t] || {},
      a = subCostoKey(e, o.id);
    (Ye((r) => ({ ...r, [e]: r[e].filter((i, u) => u !== t) })),
      lt((r) => {
        const i = { ...r };
        return (delete i[a], i);
      }),
      Be((r) => {
        const i = { ...r };
        return (delete i[a], i);
      }));
  }
  function da(e, t) {
    const o = Number(t.presupuestoOriginal) || 0,
      a = Number(t.presupuesto) || o,
      r = t.proveedor.toUpperCase();
    (lt((i) => ({
      ...i,
      [e]: consolidarProveedores([...(i[e] || []), { proveedor: r, presupuestoOriginal: o, presupuesto: a, tc: Oe }]),
    })),
      qn(r),
      xo((i) => ({ ...i, [e]: null })));
  }
  function Vr(e, t, o) {
    lt((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              proveedor: (o.proveedor || r.proveedor).toUpperCase(),
              presupuestoOriginal: Number(o.presupuestoOriginal) || 0,
              presupuesto: Number(o.presupuesto) || 0,
              tc: r.tc || Oe,
            },
      ),
    }));
  }
  function Xr(e, t) {
    lt((o) => ({ ...o, [e]: o[e].filter((a, r) => r !== t) }));
  }
  function _r(e, t) {
    const o = Number(t.monto) || 0;
    (Be((a) => ({
      ...a,
      [e]: [
        ...(a[e] || []),
        {
          proveedor: t.proveedor.toUpperCase(),
          monto: o,
          fecha: t.fecha || "—",
          fc: t.fc || "—",
          observaciones: t.observaciones || "",
          tc: Oe,
        },
      ],
    })),
      st((a) => ({ ...a, [e]: null })));
  }
  function qr(e, t, o) {
    Be((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              proveedor: (o.proveedor || r.proveedor).toUpperCase(),
              monto: Number(o.monto) || 0,
              fecha: o.fecha || r.fecha,
              fc: o.fc || r.fc,
              observaciones: o.observaciones !== void 0 ? o.observaciones : r.observaciones || "",
              tc: r.tc || Oe,
            },
      ),
    }));
  }
  function Hr(e, t) {
    Be((o) => ({ ...o, [e]: o[e].filter((a, r) => r !== t) }));
  }
  function ja(e) {
    e && e.code === "invalid_argument"
      ? an(
          "No se pudo guardar la factura: es muy pesada (probablemente por el PDF adjunto). Probá con un PDF de menos de 180 KB.",
        )
      : an("No se pudo guardar la factura. Verificá tu conexión."),
      mostrarErrorGuardado(
        Date.now(),
        "No se pudo guardar la factura (" + ((e && (e.code || e.message)) || "error desconocido") + ").",
      );
  }
  function Yr(e, t, o) {
    Me.current &&
      (Me.current
        .collection("facturas")
        .add({
          cliente: e,
          obra: t,
          concepto: o.concepto || null,
          tipo: o.tipo || null,
          nro: o.nro || null,
          ordenCompra: o.ordenCompra || null,
          fecha: normalizarFecha(o.fecha) || "—",
          status: o.status || "ADEUDA",
          importe: Number(o.importe) || 0,
          fechaPago: o.fechaPago ? normalizarFecha(o.fechaPago) : null,
          forma: o.forma || null,
          pdfData: o.pdfData || null,
          pdfName: o.pdfName || null,
          creadoEn: Date.now(),
          tc: Oe,
        })
        .then(() => an(null))
        .catch(ja),
      _t("Nueva factura en " + e + " / " + t + (o.nro ? " N°" + o.nro : "") + ": " + fmt(Number(o.importe) || 0)));
  }
  async function ca(e, t) {
    try {
      const o = await e.get();
      if (o.docs.length > t) {
        const a = o.docs
            .map((i) => ({ id: i.id, ts: i.data().eliminadaEn || i.data().modificadaEn || 0 }))
            .sort((i, u) => i.ts - u.ts),
          r = a.slice(0, a.length - t);
        for (const i of r)
          await e
            .doc(i.id)
            .delete()
            .catch(() => {});
      }
    } catch {}
  }
  const Bn = 50;
  function Kr(e, t) {
    if (!Me.current) return;
    const o = g.find((u) => u.id === e);
    if (!o) return;
    const { id: a, ...r } = o,
      i = Me.current.collection("facturasEdiciones");
    (i
      .add({ ...r, facturaIdOriginal: e, modificadaEn: Date.now() })
      .then(() => ca(i, Bn))
      .catch(() => {}),
      Me.current
        .collection("facturas")
        .doc(e)
        .set({
          cliente: o.cliente,
          obra: o.obra,
          creadoEn: o.creadoEn,
          concepto: t.concepto || null,
          tipo: t.tipo || null,
          nro: t.nro || null,
          ordenCompra: t.ordenCompra !== void 0 ? t.ordenCompra || null : o.ordenCompra || null,
          fecha: t.fecha ? normalizarFecha(t.fecha) : o.fecha,
          status: t.status || o.status,
          importe: Number(t.importe) || 0,
          fechaPago: t.fechaPago ? normalizarFecha(t.fechaPago) : null,
          forma: t.forma || null,
          pdfData: (t.pdfData !== void 0 ? t.pdfData : o.pdfData) || null,
          pdfName: (t.pdfName !== void 0 ? t.pdfName : o.pdfName) || null,
          tc: o.tc || Oe,
        })
        .then(() => an(null))
        .catch(ja),
      _t(
        "Editó factura en " +
          o.cliente +
          " / " +
          o.obra +
          (o.nro ? " N°" + o.nro : "") +
          (t.status ? " (estado: " + t.status + ")" : ""),
      ));
  }
  function Zr(e) {
    if (!Me.current) return;
    const t = g.find((u) => u.id === e),
      o = Me.current.collection("facturas");
    if (!t) {
      o.doc(e)
        .delete()
        .catch(() => {});
      return;
    }
    _t("Borró factura en " + t.cliente + " / " + t.obra + (t.nro ? " N°" + t.nro : "") + ": " + fmt(t.importe));
    const { id: a, ...r } = t,
      i = Me.current.collection("facturasPapelera");
    i.add({ ...r, facturaIdOriginal: e, eliminadaEn: Date.now() })
      .then(() => {
        (o
          .doc(e)
          .delete()
          .catch(() => {}),
          ca(i, Bn));
      })
      .catch(() => {
        (o
          .doc(e)
          .delete()
          .catch(() => {}),
          an("Se eliminó la factura pero no se pudo guardar una copia de seguridad en la papelera."));
      });
  }
  const [Jr, Va] = useState(false),
    [hn, Xa] = useState("borradas"),
    [Pn, Un] = useState([]),
    [wn, Mn] = useState([]),
    [Qr, _a] = useState(false);
  async function $r() {
    (Va(true), _a(true));
    try {
      const [e, t] = await Promise.all([
        Me.current.collection("facturasPapelera").get(),
        Me.current.collection("facturasEdiciones").get(),
      ]);
      (Un(e.docs.map((o) => ({ ...o.data(), id: o.id })).sort((o, a) => (a.eliminadaEn || 0) - (o.eliminadaEn || 0))),
        Mn(
          t.docs.map((o) => ({ ...o.data(), id: o.id })).sort((o, a) => (a.modificadaEn || 0) - (o.modificadaEn || 0)),
        ));
    } catch {
      (Un([]), Mn([]));
    }
    _a(false);
  }
  async function ei(e) {
    if (!Me.current) return;
    const { id: t, facturaIdOriginal: o, eliminadaEn: a, ...r } = e;
    try {
      const i = Me.current.collection("facturas");
      (o ? await i.doc(o).set(r) : await i.add(r),
        await Me.current
          .collection("facturasPapelera")
          .doc(t)
          .delete()
          .catch(() => {}),
        Un((u) => u.filter((m) => m.id !== t)));
    } catch {
      an("No se pudo restaurar la factura.");
    }
  }
  async function ti(e) {
    if (!Me.current) return;
    const { id: t, facturaIdOriginal: o, modificadaEn: a, ...r } = e;
    try {
      const i = Me.current.collection("facturas");
      (o ? await i.doc(o).set(r) : await i.add(r),
        await Me.current
          .collection("facturasEdiciones")
          .doc(t)
          .delete()
          .catch(() => {}),
        Mn((u) => u.filter((m) => m.id !== t)));
    } catch {
      an("No se pudo restaurar la factura.");
    }
  }
  const [ua, rn] = useState(null);
  async function oi(e) {
    if (Me.current) {
      try {
        (await Me.current.collection("facturasPapelera").doc(e).delete(), Un((t) => t.filter((o) => o.id !== e)));
      } catch {
        an("No se pudo eliminar de la papelera.");
      }
      rn(null);
    }
  }
  async function ni(e) {
    if (Me.current) {
      try {
        (await Me.current.collection("facturasEdiciones").doc(e).delete(), Mn((t) => t.filter((o) => o.id !== e)));
      } catch {
        an("No se pudo eliminar del historial.");
      }
      rn(null);
    }
  }
  async function ai() {
    !Me.current ||
      Pn.length === 0 ||
      (await Promise.all(
        Pn.map((e) =>
          Me.current
            .collection("facturasPapelera")
            .doc(e.id)
            .delete()
            .catch(() => {}),
        ),
      ),
      Un([]),
      rn(null));
  }
  async function ri() {
    !Me.current ||
      wn.length === 0 ||
      (await Promise.all(
        wn.map((e) =>
          Me.current
            .collection("facturasEdiciones")
            .doc(e.id)
            .delete()
            .catch(() => {}),
        ),
      ),
      Mn([]),
      rn(null));
  }
  function ii(e, t) {
    const [o, a] = e.split("|"),
      r = (t.cliente || o).toUpperCase().trim(),
      i = (t.obra || a).toUpperCase().trim(),
      u = r !== o || i !== a,
      m = obraKey(r, i);
    if (
      u &&
      c.some((x) => {
        const D = obraKey(x.cliente, x.obra);
        return D === m && D !== e;
      })
    ) {
      alert('Ya existe una obra "' + i + '" para el cliente "' + r + '". Elegí otro nombre.');
      return;
    }
    if (
      (p((x) =>
        x.map((D) => {
          if (obraKey(D.cliente, D.obra) !== e) return D;
          const T = Number(t.venta) || 0,
            O = Number(t.costoInicial) || 0;
          return {
            ...D,
            cliente: r,
            obra: i,
            ventaOriginal: T,
            costoInicial: O,
            costoFinal: O,
            status: t.status,
            mes: t.mes || D.mes,
            anio: Number(t.anio) || D.anio,
            tc: D.tc || Oe,
          };
        }),
      ),
      _t("Editó obra " + r + " - " + i + (t.status ? " (estado: " + t.status + ")" : "")),
      u)
    ) {
      const x = (T) =>
        T((O) => {
          if (!(e in O)) return O;
          const _ = { ...O };
          return ((_[m] = _[e]), delete _[e], _);
        });
      (x(f), x(A), x(M), x(ye), x(Ye));
      const D = (T) =>
        T((O) => {
          const _ = e + "::subCosto::",
            xe = Object.keys(O).filter((Te) => Te.startsWith(_));
          if (xe.length === 0) return O;
          const Ie = { ...O };
          return (
            xe.forEach((Te) => {
              const Ge = Te.slice(_.length);
              ((Ie[m + "::subCosto::" + Ge] = Ie[Te]), delete Ie[Te]);
            }),
            Ie
          );
        });
      if (
        (D(lt),
        D(Be),
        H((T) => {
          const O = "pf|" + o + "|" + a + "|",
            _ = Object.keys(T).filter((Te) => Te.startsWith(O));
          if (_.length === 0) return T;
          const xe = "pf|" + r + "|" + i + "|",
            Ie = { ...T };
          return (
            _.forEach((Te) => {
              ((Ie[xe + Te.slice(O.length)] = Ie[Te]), delete Ie[Te]);
            }),
            Ie
          );
        }),
        te((T) => {
          let O = T,
            _ = false;
          const xe = (Ie, Te) => {
            const Ge = Object.keys(O).filter((Ze) => Ze.startsWith(Ie));
            Ge.length !== 0 &&
              (_ || ((O = { ...O }), (_ = true)),
              Ge.forEach((Ze) => {
                ((O[Te + Ze.slice(Ie.length)] = O[Ze]), delete O[Ze]);
              }));
          };
          return (
            xe("cc|" + e + "::subCosto::", "cc|" + m + "::subCosto::"),
            xe(e + "::subCosto::", m + "::subCosto::"),
            xe("cc|" + e + "|", "cc|" + m + "|"),
            xe(e + "|", m + "|"),
            O
          );
        }),
        C((T) => T.map((O) => (O.cliente === o && O.obra === a ? { ...O, cliente: r, obra: i } : O))),
        L((T) => {
          let O = false;
          const _ = T.map((xe) =>
            (xe.cliente || "").trim().toUpperCase() === o && (xe.centroCosto || "").trim().toUpperCase() === a
              ? ((O = true), { ...xe, cliente: r, centroCosto: i })
              : xe,
          );
          return O ? _ : T;
        }),
        Me.current)
      ) {
        const T = Me.current.collection("facturas");
        T.where("cliente", "==", o)
          .where("obra", "==", a)
          .get()
          .then((O) => {
            O.docs.forEach((_) =>
              T.doc(_.id)
                .update({ cliente: r, obra: i })
                .catch(() => {}),
            );
          })
          .catch(() => {
            g.filter((O) => O.cliente === o && O.obra === a).forEach((O) =>
              T.doc(O.id)
                .update({ cliente: r, obra: i })
                .catch(() => {}),
            );
          });
      }
      (be(r), no(m));
    }
    tn(false);
  }
  function si(e, t) {
    const o = obraKey(e, t),
      a = g.filter((x) => x.cliente === e && x.obra === t);
    p((x) => x.filter((D) => obraKey(D.cliente, D.obra) !== o));
    const r = (x) =>
      x((D) => {
        if (!(o in D)) return D;
        const T = { ...D };
        return (delete T[o], T);
      });
    (r(f), r(A), r(M), r(ye), r(Ye), r(y));
    const i = (x) =>
      x((D) => {
        const T = o + "::subCosto::",
          O = Object.keys(D).filter((xe) => xe.startsWith(T));
        if (O.length === 0) return D;
        const _ = { ...D };
        return (O.forEach((xe) => delete _[xe]), _);
      });
    (i(lt), i(Be));
    const u = "pf|" + e + "|" + t + "|",
      m = (x, D) =>
        x((T) => {
          const O = Object.keys(T).filter((xe) => xe.startsWith(D));
          if (O.length === 0) return T;
          const _ = { ...T };
          return (O.forEach((xe) => delete _[xe]), _);
        });
    if (
      (m(H, u),
      m(Nt, u),
      te((x) => {
        let D = x,
          T = false;
        const O = (_) => {
          const xe = Object.keys(D).filter((Ie) => Ie.startsWith(_));
          xe.length !== 0 && (T || ((D = { ...D }), (T = true)), xe.forEach((Ie) => delete D[Ie]));
        };
        return (O("cc|" + o + "::subCosto::"), O(o + "::subCosto::"), O("cc|" + o + "|"), O(o + "|"), D);
      }),
      _t(
        "Borró la obra " +
          e +
          " - " +
          t +
          (a.length > 0
            ? " (con " +
              a.length +
              " factura" +
              (a.length === 1 ? "" : "s") +
              " movida" +
              (a.length === 1 ? "" : "s") +
              " a la papelera)"
            : ""),
      ),
      C((x) => x.filter((D) => !(D.cliente === e && D.obra === t))),
      Me.current && a.length > 0)
    ) {
      const x = Me.current.collection("facturas"),
        D = Me.current.collection("facturasPapelera");
      Promise.all(
        a.map((T) => {
          const { id: O, ..._ } = T;
          return D.add({ ..._, facturaIdOriginal: T.id, eliminadaEn: Date.now() })
            .then(() => {
              x.doc(T.id)
                .delete()
                .catch(() => {});
            })
            .catch(() => {
              x.doc(T.id)
                .delete()
                .catch(() => {});
            });
        }),
      ).then(() => ca(D, Bn));
    }
  }
  function Nn(e, t, o) {
    p((a) => a.map((r) => (obraKey(r.cliente, r.obra) === e ? { ...r, [t]: o } : r)));
  }
  function qa(e, t, o, a, r) {
    const i = obraKey(e, t);
    Nn(i, o, a);
    const u = o === "pm" ? "PM" : "DDO",
      m = r || "arrastrando en Operaciones";
    _t(
      a
        ? "Reasignó " + u + " de " + e + " - " + t + " a " + a + " (" + m + ")"
        : "Quitó el " + u + " de " + e + " - " + t + " (" + m + ")",
    );
  }
  function li(e, t, o, a, r) {
    const i = obraKey(e, t);
    (Nn(i, o, a),
      r &&
        (o === "pm"
          ? de((m) => (m.includes(a) ? m : [...m, a].sort()))
          : Ft((m) => (m.includes(a) ? m : [...m, a].sort()))),
      _t("Asignó " + (o === "pm" ? "PM" : "DDO") + " " + a + " a " + e + " - " + t + " (desde Operaciones)"));
  }
  function di(e, t) {
    const o = e.trim().toUpperCase(),
      a = t.trim().toUpperCase();
    !o ||
      !a ||
      o === a ||
      (f((r) => {
        const i = {};
        return (
          Object.entries(r).forEach(([u, m]) => {
            const x = m.map((T) => (T.proveedor === o ? { ...T, proveedor: a } : T)),
              D = [];
            (x.forEach((T) => {
              const O = D.find((_) => _.proveedor === T.proveedor);
              O
                ? ((O.presupuestoOriginal += T.presupuestoOriginal || 0), (O.presupuesto += T.presupuesto || 0))
                : D.push({ ...T });
            }),
              (i[u] = D));
          }),
          i
        );
      }),
      A((r) => {
        const i = {};
        return (
          Object.entries(r).forEach(([u, m]) => {
            i[u] = m.map((x) => (x.proveedor === o ? { ...x, proveedor: a } : x));
          }),
          i
        );
      }),
      lt((r) => {
        const i = {};
        return (
          Object.entries(r).forEach(([u, m]) => {
            const x = m.map((T) => (T.proveedor === o ? { ...T, proveedor: a } : T)),
              D = [];
            (x.forEach((T) => {
              const O = D.find((_) => _.proveedor === T.proveedor);
              O
                ? ((O.presupuestoOriginal += T.presupuestoOriginal || 0), (O.presupuesto += T.presupuesto || 0))
                : D.push({ ...T });
            }),
              (i[u] = D));
          }),
          i
        );
      }),
      Be((r) => {
        const i = {};
        return (
          Object.entries(r).forEach(([u, m]) => {
            i[u] = m.map((x) => (x.proveedor === o ? { ...x, proveedor: a } : x));
          }),
          i
        );
      }),
      E((r) => {
        const i = r.filter((u) => u !== o);
        return i.includes(a) ? i.sort() : [...i, a].sort();
      }),
      te((r) => {
        let i = false;
        const u = { ...r };
        return (
          Object.keys(r).forEach((m) => {
            if (m.startsWith("cc|")) return;
            const x = m.split("|");
            if (x.length !== 4 || x[2] !== o) return;
            const D = x[0] + "|" + x[1] + "|" + a + "|" + x[3];
            ((u[D] = u[m]), delete u[m], (i = true));
          }),
          i ? u : r
        );
      }));
  }
  function qn(e) {
    const t = e.trim().toUpperCase();
    t && E((o) => (o.includes(t) ? o : [...o, t].sort()));
  }
  function ci(e, t) {
    const o = Number(t.monto) || 0;
    (M((a) => ({ ...a, [e]: [...(a[e] || []), { concepto: t.concepto || "ADICIONAL", monto: o, tc: Oe }] })),
      _t("Adicional en " + e + ": " + (t.concepto || "ADICIONAL") + " " + fmt(o)),
      $t(null));
  }
  function ui(e, t, o) {
    M((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t ? r : { concepto: o.concepto || r.concepto, monto: Number(o.monto) || 0, tc: r.tc || Oe },
      ),
    }));
  }
  function pi(e, t) {
    (M((o) => ({ ...o, [e]: o[e].filter((a, r) => r !== t) })), _t("Borró adicional en " + e));
  }
  function gi(e, t) {
    const o = Number(t.venta) || 0;
    (ye((a) => ({
      ...a,
      [e]: [
        ...(a[e] || []),
        {
          ordenCompra: t.ordenCompra || "",
          venta: o,
          fecha: normalizarFecha(t.fecha) || "—",
          observaciones: t.observaciones || "",
          tc: Oe,
        },
      ],
    })),
      _t("Nueva orden de compra en " + e + ": " + fmt(o)),
      ao(null));
  }
  function fi(e, t, o) {
    ye((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              ordenCompra: o.ordenCompra !== void 0 ? o.ordenCompra : r.ordenCompra,
              venta: Number(o.venta) || 0,
              fecha: o.fecha ? normalizarFecha(o.fecha) : r.fecha,
              observaciones: o.observaciones !== void 0 ? o.observaciones : r.observaciones,
              tc: r.tc || Oe,
            },
      ),
    }));
  }
  function mi(e, t) {
    const o = (((Pe[e] || [])[t] || {}).ordenCompra || "").trim();
    (ye((a) => ({ ...a, [e]: a[e].filter((r, i) => i !== t) })),
      o &&
        Ye((a) => {
          const r = a[e] || [];
          return r.some((i) => ordenCompraIncluye(i.ordenCompra, o))
            ? { ...a, [e]: r.map((i) => (ordenCompraIncluye(i.ordenCompra, o) ? sinMontoDeOC(i, o) : i)) }
            : a;
        }),
      _t(
        "Borró orden de compra en " +
          e +
          (o ? " (" + o + "), incluyendo lo que le había aportado a sus sub obras de Costos ligadas" : ""),
      ));
  }
  function bi(e, t) {
    const o = t
      .filter((a) => a.ordenCompra || a.venta)
      .map((a) => ({
        ordenCompra: a.ordenCompra || "",
        venta: a.venta || 0,
        fecha: normalizarFecha(a.fecha) || "—",
        observaciones: a.observaciones || "",
      }));
    return (o.length && ye((a) => ({ ...a, [e]: [...(a[e] || []), ...o] })), o.length);
  }
  function Ha(e) {
    const t = e.status === "FINALIZADA" ? "EN PROCESO" : "FINALIZADA";
    (p((o) => o.map((a) => (obraKey(a.cliente, a.obra) !== obraKey(e.cliente, e.obra) ? a : { ...a, status: t }))),
      _t("Cambió estado de " + e.cliente + " - " + e.obra + " a " + t));
  }
  function Hn(e) {
    return new Promise((t, o) => {
      const a = new FileReader();
      ((a.onload = (r) => {
        try {
          const i = XLSX.read(r.target.result, { type: "array" }),
            u = i.Sheets[i.SheetNames[0]];
          t(XLSX.utils.sheet_to_json(u, { defval: null }));
        } catch (i) {
          o(i);
        }
      }),
        (a.onerror = o),
        a.readAsArrayBuffer(e));
    });
  }
  function vi(e) {
    return new Promise((t, o) => {
      const a = new FileReader();
      ((a.onload = (r) => t(r.target.result)), (a.onerror = o), a.readAsDataURL(e));
    });
  }
  function Ko(e, t) {
    for (const o of Object.keys(e)) if (t.includes(o.toString().trim().toLowerCase())) return e[o];
    return null;
  }
  async function hi(e, t) {
    if (t)
      try {
        const a = (await Hn(t))
          .map((r) => {
            const i = String(Ko(r, ["proveedor"]) || "")
                .toUpperCase()
                .trim(),
              u = Number(Ko(r, ["presupuesto original", "presupuesto", "original"])) || 0,
              m = Number(Ko(r, ["presupuesto real", "real"])) || u;
            return { proveedor: i, presupuestoOriginal: u, presupuesto: m, tc: Oe };
          })
          .filter((r) => r.proveedor);
        a.length &&
          (f((r) => ({ ...r, [e]: consolidarProveedores([...(r[e] || []), ...a]) })),
          a.forEach((r) => qn(r.proveedor)));
      } catch {}
  }
  async function yi(e, t) {
    if (t)
      try {
        const a = (await Hn(t))
          .map((r) => {
            const i = String(Ko(r, ["proveedor"]) || "")
                .toUpperCase()
                .trim(),
              u = Number(Ko(r, ["monto", "importe", "pago"])) || 0;
            let m = Ko(r, ["fecha"]);
            if (typeof m == "number" && XLSX.SSF) {
              const T = XLSX.SSF.parse_date_code(m);
              m = T ? String(T.d).padStart(2, "0") + "/" + String(T.m).padStart(2, "0") + "/" + T.y : String(m);
            }
            const x = String(Ko(r, ["n° fc", "nro fc", "n fc", "fc", "nro factura", "numero factura"]) ?? "—"),
              D = String(Ko(r, ["observaciones"]) || "");
            return { proveedor: i, monto: u, fecha: m ? String(m) : "—", fc: x, observaciones: D, tc: Oe };
          })
          .filter((r) => r.proveedor && r.monto);
        a.length && A((r) => ({ ...r, [e]: [...(r[e] || []), ...a] }));
      } catch {}
  }
  function Ya(e, t) {
    const o = e === "costos",
      a = o
        ? ["Proveedor", "Presupuesto Original", "Presupuesto Real"]
        : ["Proveedor", "Monto", "Fecha", "N° FC", "Observaciones"],
      r = S[t] || [];
    let i;
    o
      ? (i = [["EJEMPLO PROVEEDOR SRL", 1e6, 1e6]])
      : r.length > 0
        ? (i = r.map((x) => [x.proveedor, "", "", "", ""]))
        : (i = [["EJEMPLO PROVEEDOR SRL", 1e5, "07/09/2026", "1234", ""]]);
    const u = XLSX.utils.aoa_to_sheet([a, ...i]),
      m = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(m, u, o ? "Costos" : "Pagos"),
      descargarLibroXlsx(m, o ? "plantilla_costos.xlsx" : "plantilla_pagos.xlsx"));
  }
  async function Si(e, t) {
    if (t)
      try {
        const a = (await Hn(t))
          .map((r) => {
            const i = String(Ko(r, ["proveedor"]) || "")
                .toUpperCase()
                .trim(),
              u = Number(Ko(r, ["presupuesto original", "presupuesto", "original"])) || 0,
              m = Number(Ko(r, ["presupuesto real", "real"])) || u;
            return { proveedor: i, presupuestoOriginal: u, presupuesto: m, tc: Oe };
          })
          .filter((r) => r.proveedor);
        a.length &&
          (lt((r) => ({ ...r, [e]: consolidarProveedores([...(r[e] || []), ...a]) })),
          a.forEach((r) => qn(r.proveedor)));
      } catch {}
  }
  async function xi(e, t) {
    if (t)
      try {
        const a = (await Hn(t))
          .map((r) => {
            const i = String(Ko(r, ["proveedor"]) || "")
                .toUpperCase()
                .trim(),
              u = Number(Ko(r, ["monto", "importe", "pago"])) || 0;
            let m = Ko(r, ["fecha"]);
            if (typeof m == "number" && XLSX.SSF) {
              const T = XLSX.SSF.parse_date_code(m);
              m = T ? String(T.d).padStart(2, "0") + "/" + String(T.m).padStart(2, "0") + "/" + T.y : String(m);
            }
            const x = String(Ko(r, ["n° fc", "nro fc", "n fc", "fc", "nro factura", "numero factura"]) ?? "—"),
              D = String(Ko(r, ["observaciones"]) || "");
            return { proveedor: i, monto: u, fecha: m ? String(m) : "—", fc: x, observaciones: D, tc: Oe };
          })
          .filter((r) => r.proveedor && r.monto);
        a.length && Be((r) => ({ ...r, [e]: [...(r[e] || []), ...a] }));
      } catch {}
  }
  function Ka(e, t) {
    const o = e === "costos",
      a = o
        ? ["Proveedor", "Presupuesto Original", "Presupuesto Real"]
        : ["Proveedor", "Monto", "Fecha", "N° FC", "Observaciones"],
      r = ee[t] || [];
    let i;
    o
      ? (i = [["EJEMPLO PROVEEDOR SRL", 1e6, 1e6]])
      : r.length > 0
        ? (i = r.map((x) => [x.proveedor, "", "", "", ""]))
        : (i = [["EJEMPLO PROVEEDOR SRL", 1e5, "07/09/2026", "1234", ""]]);
    const u = XLSX.utils.aoa_to_sheet([a, ...i]),
      m = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(m, u, o ? "Costos" : "Pagos"),
      descargarLibroXlsx(m, o ? "plantilla_costos.xlsx" : "plantilla_pagos.xlsx"));
  }
  function Ai() {
    const e = jo.map((a) => ({
        Cliente: a.cliente,
        "Centro de Costo": a.obra,
        Estado: a.status,
        Mes: a.mes ? a.mes.charAt(0) + a.mes.slice(1).toLowerCase() : "",
        Año: a.anio || "",
        Venta: a.ventaFinal,
        "Costo Inicial": a.costoInicial,
        "Costo Real": a.costoFinal,
        "MB Inicial %": Number(a.mbInicial.toFixed(1)),
        "Markup Inicial %": markupDeMb(a.mbInicial) == null ? "" : Number(markupDeMb(a.mbInicial).toFixed(1)),
        "MB Final %": Number(a.mbFinal.toFixed(1)),
        "Markup Final %": markupDeMb(a.mbFinal) == null ? "" : Number(markupDeMb(a.mbFinal).toFixed(1)),
        "Días de obra": a.diasObra || "",
        M2: (a.cliente !== "WU" && a.m2) || "",
        PM: a.pm || "",
        DDO: a.ddo || "",
      })),
      t = XLSX.utils.json_to_sheet(e),
      o = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(o, t, "Resumen"), descargarLibroXlsx(o, "resumen_obras.xlsx"));
  }
  function Za(e, t) {
    const o = e.map((i) => ({
        Proveedor: i.proveedor,
        Pago: i.monto,
        Fecha: i.fecha,
        "N° FC": i.fc,
        Observaciones: i.observaciones || "",
      })),
      a = XLSX.utils.json_to_sheet(o),
      r = XLSX.utils.book_new();
    (XLSX.utils.book_append_sheet(r, a, "Pagos"), descargarLibroXlsx(r, t));
  }
  function Ci(e, t, o) {
    const a = new Set(c.map((u) => obraKey(u.cliente, u.obra))),
      r = [];
    let i = 0;
    if (
      (e.forEach((u) => {
        const m = obraKey(u.cliente, u.obra);
        if (a.has(m)) {
          i++;
          return;
        }
        (a.add(m),
          r.push({
            cliente: u.cliente,
            obra: u.obra,
            status: "FINALIZADA",
            costoInicial: u.costoReal,
            costoFinal: u.costoReal,
            ventaOriginal: u.ventaTotal,
            mes: u.mes && MESES.includes(u.mes) ? u.mes : "ENERO",
            anio: u.anio || t,
          }));
      }),
      r.length && p((u) => [...u, ...r]),
      o && r.length && Me.current)
    ) {
      const u = Me.current.collection("facturas");
      r.forEach((m, x) => {
        u.add({
          cliente: m.cliente,
          obra: m.obra,
          concepto: "SALDO TOTAL DE OBRA",
          tipo: "S/F",
          nro: null,
          fecha: "01/" + String(MESES.indexOf(m.mes) + 1).padStart(2, "0") + "/" + m.anio,
          status: "PAGADA",
          importe: m.ventaOriginal,
          fechaPago: "01/" + String(MESES.indexOf(m.mes) + 1).padStart(2, "0") + "/" + m.anio,
          forma: null,
          pdfData: null,
          pdfName: null,
          creadoEn: Date.now() + x,
        }).catch(() => {});
      });
    }
    return { agregadasCount: r.length, omitidasCount: i };
  }
  async function Ei(e) {
    const t = co.filter((r) => (r.anio || /* @__PURE__ */ new Date().getFullYear()) === e),
      o = Me.current ? Me.current.collection("facturas") : null;
    if (!o) return 0;
    let a = 0;
    for (const r of t)
      try {
        const i = await o.where("cliente", "==", r.cliente).where("obra", "==", r.obra).get();
        if (i.docs.some((D) => (D.data().concepto || "") === "SALDO TOTAL DE OBRA")) continue;
        const m = i.docs.reduce((D, T) => D + (T.data().importe || 0), 0),
          x = r.ventaFinal - m;
        if (x > 1) {
          const D = MESES.indexOf(r.mes || "ENERO"),
            T = "01/" + String(D + 1).padStart(2, "0") + "/" + (r.anio || e);
          (await o.add({
            cliente: r.cliente,
            obra: r.obra,
            concepto: "SALDO TOTAL DE OBRA",
            tipo: "S/F",
            nro: null,
            fecha: T,
            status: "PAGADA",
            importe: x,
            fechaPago: T,
            forma: null,
            pdfData: null,
            pdfName: null,
            creadoEn: Date.now() + a,
          }),
            a++);
        }
      } catch {}
    return a;
  }
  async function Oi(e) {
    if (!Me.current) return false;
    const t = Me.current.collection("facturas");
    try {
      const o = await t.where("cliente", "==", e.cliente).where("obra", "==", e.obra).get();
      if (o.docs.some((x) => (x.data().concepto || "") === "SALDO TOTAL DE OBRA")) return false;
      const r = o.docs.reduce((x, D) => x + (D.data().importe || 0), 0),
        i = e.ventaFinal - r;
      if (i <= 1) return false;
      const u = MESES.indexOf(e.mes || "ENERO"),
        m = "01/" + String(u + 1).padStart(2, "0") + "/" + (e.anio || /* @__PURE__ */ new Date().getFullYear());
      return (
        await t.add({
          cliente: e.cliente,
          obra: e.obra,
          concepto: "SALDO TOTAL DE OBRA",
          tipo: "S/F",
          nro: null,
          fecha: m,
          status: "PAGADA",
          importe: i,
          fechaPago: m,
          forma: null,
          pdfData: null,
          pdfName: null,
          creadoEn: Date.now(),
        }),
        true
      );
    } catch {
      return false;
    }
  }
  function Ii(e) {
    const t = obraKey(e.cliente, e.obra),
      o = S[t] || [],
      a = F[t] || [],
      r = g.filter((O) => O.cliente === e.cliente && O.obra === e.obra),
      i = Z[t] || [],
      u = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      u,
      XLSX.utils.json_to_sheet(
        r.map((O) => ({
          Concepto: O.concepto,
          Tipo: O.tipo,
          "N°": O.nro,
          "Fecha emisión": O.fecha,
          Estado: O.status,
          Importe: O.importe,
          "Fecha de pago": O.fechaPago,
          "Forma de pago": O.forma,
        })),
      ),
      "Facturas",
    );
    const m = e.cliente !== "WU",
      x = (m && Number(e.m2)) || 0,
      D = o.map((O) => {
        const _ = a.filter((Te) => Te.proveedor === O.proveedor).reduce((Te, Ge) => Te + Ge.monto, 0),
          xe = presupuestoEfectivo(O.presupuesto, _),
          Ie = {
            "Sub Obra": "",
            Proveedor: O.proveedor,
            "Presupuesto Original": O.presupuestoOriginal,
            "Presupuesto Real": O.presupuesto,
            Pagado: _,
            Saldo: O.presupuesto - _,
          };
        return (m && (Ie["$/M2"] = x > 0 ? Number((xe / x).toFixed(2)) : ""), Ie);
      }),
      T = a.map((O) => ({ "Sub Obra": "", Proveedor: O.proveedor, Monto: O.monto, Fecha: O.fecha, "N° FC": O.fc }));
    (i.forEach((O) => {
      const _ = subCostoKey(t, O.id),
        xe = ee[_] || [],
        Ie = ne[_] || [];
      (xe.forEach((Te) => {
        const Ge = Ie.filter((Ze) => Ze.proveedor === Te.proveedor).reduce((Ze, le) => Ze + le.monto, 0);
        D.push({
          "Sub Obra": O.nombre || "SUB OBRA",
          Proveedor: Te.proveedor,
          "Presupuesto Original": Te.presupuestoOriginal,
          "Presupuesto Real": Te.presupuesto,
          Pagado: Ge,
          Saldo: Te.presupuesto - Ge,
        });
      }),
        Ie.forEach((Te) => {
          T.push({
            "Sub Obra": O.nombre || "SUB OBRA",
            Proveedor: Te.proveedor,
            Monto: Te.monto,
            Fecha: Te.fecha,
            "N° FC": Te.fc,
          });
        }));
    }),
      XLSX.utils.book_append_sheet(u, XLSX.utils.json_to_sheet(D), "Costos"),
      XLSX.utils.book_append_sheet(u, XLSX.utils.json_to_sheet(T), "Pagos"),
      descargarLibroXlsx(u, (e.cliente + "_" + e.obra).replace(/[^a-z0-9]+/gi, "_") + ".xlsx"));
  }
  return ct === "operaciones"
    ? React.createElement(PinGateScreen, {
        pinInput: cn,
        onChangePin: (e) => {
          (on(e), kn(false));
        },
        onSubmit: rr,
        error: En,
      })
    : React.createElement(
        "div",
        {
          style: {
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
            background: BG,
            minHeight: "100vh",
            color: TEXT,
          },
        },
        errorGuardado &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.55)",
                zIndex: 500,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              },
            },
            React.createElement(
              "div",
              {
                role: "alertdialog",
                style: {
                  background: "#fff",
                  borderRadius: 14,
                  padding: "22px 26px",
                  maxWidth: 470,
                  width: "100%",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  borderTop: "5px solid " + RED,
                },
              },
              React.createElement(
                "div",
                { style: { fontSize: 17, fontWeight: 700, color: RED, marginBottom: 10 } },
                "⚠ No se guardaron los cambios",
              ),
              React.createElement(
                "div",
                { style: { fontSize: 13.5, color: TEXT, lineHeight: 1.5, marginBottom: 8 } },
                "Los últimos cambios que hiciste NO se guardaron en la base de datos. No cierres ni recargues la página y contactá al administrador.",
              ),
              React.createElement(
                "div",
                { style: { fontSize: 11.5, color: MUTED, marginBottom: 18 } },
                "Detalle: ",
                errorGuardado.motivo,
              ),
              React.createElement(
                "div",
                { style: { display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" } },
                React.createElement(
                  "button",
                  { onClick: () => setErrorGuardado(null), style: smallBtnGhost },
                  "Cerrar",
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (setErrorGuardado(null), setReintentoGuardado((n) => n + 1));
                    },
                    style: smallBtnPrimary,
                  },
                  "Reintentar guardar",
                ),
              ),
            ),
          ),
        (en === "unavailable" || en === "error" || Aa) &&
          React.createElement(
            "div",
            {
              style: {
                background: en === "unavailable" || en === "error" ? "#3A2323" : "#4A3B12",
                color: "#F5E9C8",
                fontSize: 12.5,
                padding: "8px 20px",
                textAlign: "center",
              },
            },
            en === "unavailable"
              ? "No se pudo conectar al almacenamiento compartido. Los cambios que hagas ahora no se van a guardar."
              : en === "error"
                ? "Hubo un problema al conectar con el almacenamiento compartido. Probá recargar la página."
                : Aa,
          ),
        q === "USD" &&
          !Oe &&
          React.createElement(
            "div",
            {
              style: {
                background: "#4A3B12",
                color: "#F5E9C8",
                fontSize: 12.5,
                padding: "8px 20px",
                textAlign: "center",
              },
            },
            Sn
              ? 'Todavía no fijaste un tipo de cambio, así que no se pueden mostrar los montos en dólares. Hacé clic en "Dólar: sin fijar" arriba a la derecha para cargarlo.'
              : "Todavía no hay un tipo de cambio cargado, así que no se pueden mostrar los montos en dólares.",
          ),
        React.createElement(
          "div",
          {
            ref: ht,
            style: {
              background: HEADER_BG,
              padding: "18px 28px",
              display: "flex",
              justifyContent: "flex-start",
              columnGap: 40,
              alignItems: "flex-start",
              flexWrap: "wrap",
              rowGap: 14,
              borderBottom: "3px solid " + GOLD,
              position: "sticky",
              top: 0,
              zIndex: 40,
            },
          },
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 12 } },
              React.createElement(
                "div",
                {
                  style: {
                    fontFamily: "Calibri, 'Trebuchet MS', sans-serif",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fff",
                    letterSpacing: 0.2,
                  },
                },
                "MZ LATAM",
              ),
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 7,
                    padding: 2,
                    border: "1px solid rgba(255,255,255,0.15)",
                  },
                },
                ["ARS", "USD"].map((e) =>
                  React.createElement(
                    "button",
                    {
                      key: e,
                      onClick: () => Ae(e),
                      title:
                        e === "USD"
                          ? "Ver todos los montos convertidos a dólares (al tipo de cambio vigente de cada registro)"
                          : "Ver todos los montos en pesos",
                      style: {
                        border: "none",
                        padding: "4px 10px",
                        borderRadius: 5,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        background: q === e ? GOLD : "transparent",
                        color: q === e ? NAVY : "rgba(255,255,255,0.7)",
                        letterSpacing: 0.2,
                      },
                    },
                    e === "ARS" ? "$ Pesos" : "US$ Dólares",
                  ),
                ),
              ),
              Ve
                ? React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: 4 } },
                    React.createElement("input", {
                      type: "number",
                      autoFocus: true,
                      placeholder: "Ej: 1450",
                      value: l,
                      onChange: (e) => I(e.target.value),
                      onKeyDown: (e) => {
                        (e.key === "Enter" && (jt(Number(l) || 0), bo(false)), e.key === "Escape" && bo(false));
                      },
                      style: { ...inputStyle, width: 80 },
                    }),
                    React.createElement(
                      "button",
                      {
                        onClick: () => {
                          (jt(Number(l) || 0), bo(false));
                        },
                        style: {
                          border: "none",
                          background: GOLD,
                          color: NAVY,
                          borderRadius: 6,
                          padding: "5px 8px",
                          cursor: "pointer",
                          fontWeight: 700,
                        },
                      },
                      "✓",
                    ),
                    React.createElement(
                      "button",
                      {
                        onClick: () => bo(false),
                        style: {
                          border: "1px solid rgba(255,255,255,0.25)",
                          background: "transparent",
                          color: "rgba(255,255,255,0.7)",
                          borderRadius: 6,
                          padding: "5px 8px",
                          cursor: "pointer",
                        },
                      },
                      "✕",
                    ),
                  )
                : React.createElement(
                    "button",
                    {
                      onClick: Sn
                        ? () => {
                            (I(Oe ? String(Oe) : ""), bo(true));
                          }
                        : void 0,
                      title: Sn
                        ? "Tipo de cambio vigente: se graba en cada monto nuevo que se cargue de acá en adelante, y no se borra hasta que lo modifiques."
                        : "Tipo de cambio vigente (usado para mostrar los montos en dólares)",
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        border: "1px solid rgba(255,255,255,0.25)",
                        background: "transparent",
                        color: "rgba(255,255,255,0.85)",
                        padding: "5px 9px",
                        borderRadius: 8,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        cursor: Sn ? "pointer" : "default",
                      },
                    },
                    "Dólar: ",
                    Oe ? "$" + Number(Oe).toLocaleString("de-DE") : "sin fijar",
                    Sn && React.createElement(Pencil, { size: 11 }),
                  ),
            ),
            React.createElement(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 10 } },
              un.length > 1
                ? React.createElement(
                    React.Fragment,
                    null,
                    un.map((e) =>
                      React.createElement(
                        "div",
                        {
                          key: e.anio,
                          style: {
                            display: "grid",
                            gridTemplateColumns: "48px 119px 106px 212px 99px",
                            alignItems: "center",
                            columnGap: 14,
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: 0.4 } },
                          e.anio,
                        ),
                        React.createElement(
                          "div",
                          { style: { whiteSpace: "nowrap" } },
                          React.createElement(
                            "span",
                            { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" } },
                            e.clientCount,
                          ),
                          React.createElement(
                            "span",
                            { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                            "CLIENTES",
                          ),
                        ),
                        React.createElement(
                          "div",
                          { style: { whiteSpace: "nowrap" } },
                          React.createElement(
                            "span",
                            { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" } },
                            e.count,
                          ),
                          React.createElement(
                            "span",
                            { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                            "OBRAS",
                          ),
                        ),
                        React.createElement(
                          "div",
                          {
                            style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
                            title: fmtSmart(e.venta, e.ventaUSD),
                          },
                          React.createElement(
                            "span",
                            { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" } },
                            fmtSmart(e.venta, e.ventaUSD),
                          ),
                          React.createElement(
                            "span",
                            { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                            "VENTA",
                          ),
                        ),
                        React.createElement(
                          "div",
                          { style: { whiteSpace: "nowrap" } },
                          React.createElement(
                            "span",
                            { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" } },
                            pctMkSmart(e.mb, e.mbUSD),
                          ),
                          React.createElement(
                            "span",
                            { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                            "MB / MARKUP",
                          ),
                        ),
                      ),
                    ),
                    React.createElement("div", {
                      style: { height: 1, background: "rgba(255,255,255,0.25)", margin: "2px 0" },
                    }),
                    React.createElement(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "48px 119px 106px 212px 99px 1fr",
                          alignItems: "center",
                          columnGap: 14,
                        },
                      },
                      React.createElement(
                        "div",
                        { style: { fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 0.4 } },
                        "TOTAL",
                      ),
                      React.createElement(
                        "div",
                        { style: { whiteSpace: "nowrap" } },
                        React.createElement(
                          "span",
                          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD } },
                          ro.clientCount,
                        ),
                        React.createElement(
                          "span",
                          { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                          "CLIENTES",
                        ),
                      ),
                      React.createElement(
                        "div",
                        { style: { whiteSpace: "nowrap" } },
                        React.createElement(
                          "span",
                          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD } },
                          ro.count,
                        ),
                        React.createElement(
                          "span",
                          { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                          "OBRAS",
                        ),
                      ),
                      React.createElement(
                        "div",
                        {
                          style: { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
                          title: fmtSmart(ro.venta, ro.ventaUSD),
                        },
                        React.createElement(
                          "span",
                          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD } },
                          fmtSmart(ro.venta, ro.ventaUSD),
                        ),
                        React.createElement(
                          "span",
                          { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                          "VENTA",
                        ),
                      ),
                      React.createElement(
                        "div",
                        { style: { whiteSpace: "nowrap" } },
                        React.createElement(
                          "span",
                          { style: { fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD } },
                          pctMkSmart(ro.mb, ro.mbUSD),
                        ),
                        React.createElement(
                          "span",
                          { style: { fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 } },
                          "MB / MARKUP",
                        ),
                      ),
                    ),
                  )
                : React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", rowGap: 6 } },
                    React.createElement(
                      "div",
                      { style: { whiteSpace: "nowrap" } },
                      React.createElement(
                        "span",
                        { style: { fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" } },
                        ro.clientCount,
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 },
                        },
                        "CLIENTES",
                      ),
                    ),
                    React.createElement("div", {
                      style: { width: 1, height: 14, background: "rgba(255,255,255,0.18)" },
                    }),
                    React.createElement(
                      "div",
                      { style: { whiteSpace: "nowrap" } },
                      React.createElement(
                        "span",
                        { style: { fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" } },
                        ro.count,
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 },
                        },
                        "OBRAS",
                      ),
                    ),
                    React.createElement("div", {
                      style: { width: 1, height: 14, background: "rgba(255,255,255,0.18)" },
                    }),
                    React.createElement(
                      "div",
                      { style: { whiteSpace: "nowrap" } },
                      React.createElement(
                        "span",
                        { style: { fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: GOLD } },
                        fmtSmart(ro.venta, ro.ventaUSD),
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 },
                        },
                        "VENTA TOTAL",
                      ),
                    ),
                    React.createElement("div", {
                      style: { width: 1, height: 14, background: "rgba(255,255,255,0.18)" },
                    }),
                    React.createElement(
                      "div",
                      { style: { whiteSpace: "nowrap" } },
                      React.createElement(
                        "span",
                        { style: { fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" } },
                        pctMkSmart(ro.mb, ro.mbUSD),
                      ),
                      React.createElement(
                        "span",
                        {
                          style: { fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 },
                        },
                        "MARGEN BRUTO / MARKUP",
                      ),
                    ),
                  ),
              n === "obras" &&
                xn.length > 1 &&
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 5, marginTop: 2 } },
                  xn.map((e, t) => {
                    const o = pt[e] === true;
                    return React.createElement(
                      "button",
                      {
                        key: e,
                        onClick: () => Io((a) => ({ ...a, [e]: !o })),
                        style: {
                          border: "1px solid " + (o ? PIE_COLORS[t % PIE_COLORS.length] : "rgba(255,255,255,0.25)"),
                          background: o ? PIE_COLORS[t % PIE_COLORS.length] : "transparent",
                          color: o ? "#fff" : "rgba(255,255,255,0.75)",
                          borderRadius: 20,
                          padding: "4px 9px",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        },
                      },
                      e,
                    );
                  }),
                ),
            ),
          ),
          React.createElement(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, marginLeft: "auto" } },
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" } },
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 9,
                    padding: 3,
                    border: "1px solid rgba(255,255,255,0.08)",
                  },
                },
                ["obras", "facturacion", "proveedores", "cashflow", "pagos", "eerr", "operaciones"]
                  .filter((e) => Jn[e])
                  .map((e) =>
                    React.createElement(
                      "button",
                      {
                        key: e,
                        onClick: () => {
                          (d(e), lo(false), e === "obras" && (be(null), no(null), it(null)));
                        },
                        style: {
                          border: "none",
                          padding: "6px 11px",
                          borderRadius: 7,
                          fontSize: 13,
                          fontWeight: 700,
                          cursor: "pointer",
                          background: n === e ? GOLD : "transparent",
                          color: n === e ? NAVY : "rgba(255,255,255,0.75)",
                          letterSpacing: 0.2,
                          transition: "background 0.15s",
                        },
                      },
                      e === "obras"
                        ? "Obras"
                        : e === "facturacion"
                          ? "Facturación"
                          : e === "proveedores"
                            ? "Proveedores"
                            : e === "cashflow"
                              ? "Cashflow"
                              : e === "pagos"
                                ? "Pagos"
                                : e === "eerr"
                                  ? "EERR"
                                  : "Operaciones",
                    ),
                  ),
              ),
              React.createElement(
                "div",
                { style: { display: "flex", alignItems: "center" } },
                React.createElement(
                  "button",
                  {
                    onClick: Ia,
                    title: "Cerrar sesión",
                    style: {
                      border: "1px solid " + GOLD,
                      background: "transparent",
                      color: GOLD,
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  ct === "admin" ? "Admin ✓" : ct === "comercial" ? "Comercial ✓" : (so ? so.nombre : "Rol") + " ✓",
                ),
              ),
            ),
            React.createElement(
              "div",
              { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" } },
              n === "obras" &&
                Rt &&
                React.createElement(
                  "button",
                  {
                    onClick: () => ln(true),
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: GOLD,
                      color: NAVY,
                      border: "none",
                      padding: "7px 13px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 13.5,
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                      letterSpacing: 0.15,
                    },
                  },
                  React.createElement(Plus, { size: 15 }),
                  " Nueva obra",
                ),
              Zn("obras") === "editar" &&
                React.createElement(
                  "button",
                  {
                    onClick: ar,
                    disabled: mn.length === 0,
                    title:
                      mn.length === 0
                        ? "No hay cambios para deshacer"
                        : "Vuelve al estado de antes del último cambio guardado (podés hacer clic varias veces para retroceder más)",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: mn.length === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: mn.length === 0 ? "default" : "pointer",
                    },
                  },
                  React.createElement(ArrowLeft, { size: 12 }),
                  " Deshacer",
                  mn.length > 0 ? " (" + mn.length + ")" : "",
                ),
              Zn("obras") === "editar" &&
                React.createElement(
                  "button",
                  {
                    onClick: $r,
                    title: "Facturas borradas: se pueden restaurar desde acá",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.85)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  React.createElement(Trash2, { size: 12 }),
                  " Papelera de facturas",
                ),
              fn &&
                React.createElement(
                  "button",
                  {
                    onClick: () => fa(true),
                    title: "Crear roles con PIN propio: qué pueden editar y qué secciones ven",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Roles",
                ),
              In("descargarBackup") &&
                React.createElement(
                  "button",
                  {
                    onClick: dr,
                    title:
                      "Descarga un archivo con TODOS los datos de la app, para restaurarlos en otro link publicado",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Descargar backup",
                ),
              In("verBackupTexto") &&
                React.createElement(
                  "button",
                  {
                    onClick: () => $o(na()),
                    title: "Si la descarga se bloquea, mostrá el backup como texto para copiarlo a mano",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.6)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Ver backup como texto",
                ),
              In("registros") &&
                React.createElement(
                  "button",
                  {
                    onClick: () => va(true),
                    title: "Bitácora de cambios de los últimos 3 días: qué se cambió y qué rol lo hizo",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Registros",
                ),
              In("auditoriaVentaCosto") &&
                React.createElement(
                  "button",
                  {
                    onClick: () => ya(true),
                    title:
                      "Cada vez que cambia la Venta Total, el Costo Real o el MB de una obra: fecha, cliente, centro de costo y qué cambió (proveedor o adicional nuevo, eliminado, o cambio de monto). Se guarda solo las últimas 48hs y se puede descargar en Excel.",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Auditoría Venta/Costo/MB",
                ),
              In("historial") &&
                React.createElement(
                  "button",
                  {
                    onClick: () => ma(true),
                    title:
                      "Foto diaria de Obras, Facturación, Pagos y Cashflow, guardada sola todos los días (últimos 90 días)",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Historial",
                ),
              In("restaurarBackup") &&
                React.createElement(
                  "label",
                  {
                    title: "Restaura todos los datos desde un archivo de backup descargado antes",
                    style: {
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.8)",
                      padding: "5px 9px",
                      borderRadius: 8,
                      fontSize: 12,
                      cursor: "pointer",
                    },
                  },
                  "Restaurar backup",
                  React.createElement("input", {
                    type: "file",
                    accept: "application/json",
                    style: { display: "none" },
                    onChange: async (e) => {
                      const t = e.target.files[0];
                      if (t) {
                        try {
                          (await gr(t), ho("Backup restaurado correctamente."));
                        } catch {
                          ho("No se pudo leer el archivo de backup.");
                        }
                        e.target.value = "";
                      }
                    },
                  }),
                ),
            ),
          ),
        ),
        Dt &&
          React.createElement(
            "div",
            {
              style: {
                background: GOLD,
                color: NAVY,
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 32px",
                textAlign: "center",
              },
            },
            Dt,
          ),
        Ea &&
          React.createElement(
            "div",
            {
              style: {
                background: "#E6EEE9",
                color: GREEN,
                fontSize: 12,
                fontWeight: 700,
                padding: "6px 32px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
              },
            },
            Ea,
            React.createElement(
              "button",
              {
                onClick: () => Oa(null),
                style: { border: "none", background: "none", cursor: "pointer", color: GREEN },
              },
              React.createElement(X, { size: 14 }),
            ),
          ),
        me &&
          React.createElement(
            "div",
            {
              style: {
                position: "fixed",
                inset: 0,
                background: "rgba(20,20,20,0.65)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 100,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: 340,
                  maxWidth: "90%",
                  padding: 22,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                },
              },
              React.createElement(
                "div",
                { style: { fontWeight: 700, color: NAVY, fontSize: 15 } },
                "Tipo de cambio de hoy",
              ),
              React.createElement(
                "div",
                { style: { fontSize: 12.5, color: MUTED, lineHeight: 1.4 } },
                "Antes de seguir, confirmá el tipo de cambio con el que se va a trabajar hoy. Se usa para mostrar los montos en dólares y queda fijo en cada carga nueva hasta que se vuelva a modificar.",
              ),
              React.createElement("input", {
                type: "number",
                autoFocus: true,
                placeholder: "Ej: 1450",
                value: Ke,
                onChange: (e) => Y(e.target.value),
                onKeyDown: (e) => {
                  e.key === "Enter" && Pa();
                },
                style: { ...inputStyle, width: "100%", fontSize: 15, padding: "8px 10px" },
              }),
              React.createElement(
                "button",
                {
                  onClick: Pa,
                  disabled: !Number(Ke) || Number(Ke) <= 0,
                  style: {
                    border: "none",
                    background: !Number(Ke) || Number(Ke) <= 0 ? "#ccc" : GOLD,
                    color: NAVY,
                    borderRadius: 8,
                    padding: "9px 12px",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: !Number(Ke) || Number(Ke) <= 0 ? "default" : "pointer",
                  },
                },
                "Confirmar y continuar",
              ),
            ),
          ),
        Wo && React.createElement(NewObraForm, { onCancel: () => ln(false), onSave: La }),
        Qa &&
          React.createElement(RolesAdminPanel, {
            onClose: () => fa(false),
            roles: Gn,
            obras: co,
            onSave: ir,
            onDelete: sr,
            presencia: er,
          }),
        $a && React.createElement(HistorialPanel, { onClose: () => ma(false), db: Me.current }),
        Go &&
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
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "80%",
                  height: "80%",
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
                  { style: { fontWeight: 700, color: NAVY, fontSize: 13 } },
                  "Backup completo (texto) — copiá todo y guardalo en un archivo .json",
                ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 10, alignItems: "center" } },
                  React.createElement(
                    "button",
                    {
                      onClick: async () => {
                        try {
                          (await navigator.clipboard.writeText(Go), ho("Backup copiado al portapapeles."));
                        } catch {
                          ho("No se pudo copiar automáticamente. Seleccioná el texto a mano.");
                        }
                      },
                      style: smallBtnPrimary,
                    },
                    "Copiar todo",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => $o(null),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(X, { size: 18 }),
                  ),
                ),
              ),
              React.createElement("textarea", {
                readOnly: true,
                value: Go,
                onClick: (e) => e.target.select(),
                style: {
                  flex: 1,
                  border: "none",
                  padding: 16,
                  fontFamily: "monospace",
                  fontSize: 11.5,
                  resize: "none",
                  outline: "none",
                },
              }),
            ),
          ),
        or &&
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
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "70%",
                  maxWidth: 760,
                  height: "80%",
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
                  null,
                  React.createElement(
                    "div",
                    { style: { fontWeight: 700, color: NAVY, fontSize: 13 } },
                    "Registros — cambios de los últimos 3 días",
                  ),
                  React.createElement(
                    "div",
                    { style: { fontSize: 11, color: MUTED, marginTop: 2 } },
                    "Se guardan solo los últimos 3 días; los más viejos se descartan solos.",
                  ),
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => va(false),
                    style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                  },
                  React.createElement(X, { size: 18 }),
                ),
              ),
              React.createElement(
                "div",
                { style: { flex: 1, overflowY: "auto", padding: "8px 18px" } },
                fallasGuardado.length > 0 &&
                  React.createElement(
                    "div",
                    {
                      style: {
                        border: "1px solid #EAC7BE",
                        background: "#FBEAE7",
                        borderRadius: 10,
                        padding: "10px 12px",
                        margin: "6px 0 12px",
                      },
                    },
                    React.createElement(
                      "div",
                      { style: { fontWeight: 700, color: RED, fontSize: 12.5, marginBottom: 6 } },
                      "⚠ Fallas de guardado (" + fallasGuardado.length + ")",
                    ),
                    fallasGuardado.map((e, t) =>
                      React.createElement(
                        "div",
                        {
                          key: t,
                          style: {
                            display: "flex",
                            gap: 12,
                            padding: "5px 0",
                            borderTop: t ? "1px solid #F1D5CF" : "none",
                            fontSize: 12,
                          },
                        },
                        React.createElement(
                          "div",
                          { style: { color: MUTED, minWidth: 128, flexShrink: 0 } },
                          new Date(e.fecha).toLocaleDateString("es-AR"),
                          " ",
                          new Date(e.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
                        ),
                        React.createElement(
                          "div",
                          { style: { minWidth: 90, flexShrink: 0, fontWeight: 700, color: NAVY } },
                          e.rol,
                        ),
                        React.createElement("div", { style: { color: "#333" } }, e.motivo),
                      ),
                    ),
                  ),
                jn.length === 0
                  ? React.createElement(
                      "div",
                      { style: { color: MUTED, fontSize: 13, padding: "20px 0", textAlign: "center" } },
                      "Todavía no hay cambios registrados.",
                    )
                  : [...jn]
                      .sort((e, t) => t.fecha - e.fecha)
                      .map((e, t) =>
                        React.createElement(
                          "div",
                          {
                            key: t,
                            style: {
                              display: "flex",
                              gap: 12,
                              padding: "8px 0",
                              borderBottom: "1px solid " + BORDER,
                              fontSize: 12.5,
                            },
                          },
                          React.createElement(
                            "div",
                            { style: { color: MUTED, minWidth: 128, flexShrink: 0 } },
                            new Date(e.fecha).toLocaleDateString("es-AR"),
                            " ",
                            new Date(e.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
                          ),
                          React.createElement(
                            "div",
                            { style: { minWidth: 90, flexShrink: 0, fontWeight: 700, color: NAVY } },
                            e.rol,
                          ),
                          React.createElement("div", { style: { color: "#333" } }, e.descripcion),
                        ),
                      ),
              ),
            ),
          ),
        nr &&
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
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "70%",
                  maxWidth: 760,
                  height: "80%",
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
                  null,
                  React.createElement(
                    "div",
                    { style: { fontWeight: 700, color: NAVY, fontSize: 13 } },
                    "Auditoría Venta/Costo/MB — cambios de las últimas 48hs",
                  ),
                  React.createElement(
                    "div",
                    { style: { fontSize: 11, color: MUTED, marginTop: 2 } },
                    "Cada vez que cambia la Venta Total, el Costo Real o el MB de una obra, con el detalle puntual (proveedor o adicional nuevo, eliminado, o cambio de monto). Se guardan solo las últimas 48hs; los más viejos se descartan solos.",
                  ),
                ),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 10, alignItems: "center" } },
                  React.createElement(
                    "button",
                    { onClick: fr, style: smallBtnGhost },
                    React.createElement(Download, { size: 13, style: { verticalAlign: "-2px" } }),
                    " Descargar Excel",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => ya(false),
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(X, { size: 18 }),
                  ),
                ),
              ),
              React.createElement(
                "div",
                { style: { flex: 1, overflowY: "auto", padding: "8px 18px" } },
                On.length === 0
                  ? React.createElement(
                      "div",
                      { style: { color: MUTED, fontSize: 13, padding: "20px 0", textAlign: "center" } },
                      "Todavía no hay cambios registrados en las últimas 48hs.",
                    )
                  : [...On]
                      .sort((e, t) => t.fecha - e.fecha)
                      .map((e, t) =>
                        React.createElement(
                          "div",
                          {
                            key: t,
                            style: {
                              display: "flex",
                              gap: 12,
                              padding: "8px 0",
                              borderBottom: "1px solid " + BORDER,
                              fontSize: 12.5,
                            },
                          },
                          React.createElement(
                            "div",
                            { style: { color: MUTED, minWidth: 128, flexShrink: 0 } },
                            new Date(e.fecha).toLocaleDateString("es-AR"),
                            " ",
                            new Date(e.fecha).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
                          ),
                          React.createElement(
                            "div",
                            { style: { minWidth: 90, flexShrink: 0, fontWeight: 700, color: NAVY } },
                            e.cliente,
                          ),
                          React.createElement(
                            "div",
                            { style: { minWidth: 140, flexShrink: 0, color: "#555" } },
                            e.centroCosto,
                          ),
                          React.createElement("div", { style: { color: "#333" } }, e.descripcion),
                        ),
                      ),
              ),
            ),
          ),
        et &&
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
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "80%",
                  height: "85%",
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
                React.createElement("div", { style: { fontWeight: 700, color: NAVY, fontSize: 13 } }, et.name),
                React.createElement(
                  "div",
                  { style: { display: "flex", gap: 10, alignItems: "center" } },
                  React.createElement(
                    "button",
                    {
                      onClick: () => ofrecerDescarga(et.name || "factura.pdf", dataUrlToBlob(et.rawData)),
                      style: { ...smallBtnGhost, textDecoration: "none" },
                    },
                    React.createElement(Download, { size: 13 }),
                    " Descargar",
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => {
                        (et.data.startsWith("blob:") && URL.revokeObjectURL(et.data), gt(null));
                      },
                      style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                    },
                    React.createElement(X, { size: 18 }),
                  ),
                ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    padding: 24,
                    background: BG,
                  },
                },
                React.createElement(
                  "div",
                  { style: { color: MUTED, fontSize: 13, textAlign: "center", maxWidth: 380 } },
                  "Por una restricción del navegador, el PDF no se puede previsualizar embebido acá adentro. Abrilo en una pestaña nueva o descargalo con los botones de arriba.",
                ),
                React.createElement(
                  "button",
                  { onClick: () => window.open(et.data, "_blank"), style: smallBtnPrimary },
                  React.createElement(Eye, { size: 14, style: { verticalAlign: "-2px" } }),
                  " Abrir PDF en pestaña nueva",
                ),
              ),
            ),
          ),
        Zo &&
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
                zIndex: 60,
              },
              onClick: () => s(null),
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "90%",
                  maxWidth: 560,
                  maxHeight: "80%",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                },
                onClick: (e) => e.stopPropagation(),
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
                  "Orden de Compra ",
                  Zo.ocTexto,
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => s(null),
                    style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                  },
                  React.createElement(X, { size: 18 }),
                ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    columnGap: 10,
                    padding: "12px 18px",
                    background: "#F1E9D2",
                  },
                },
                React.createElement(
                  "div",
                  null,
                  React.createElement("div", { style: labelStyle }, "VENTA"),
                  React.createElement("div", { style: { fontSize: 14, fontWeight: 700, color: NAVY } }, fmt(Zo.venta)),
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement("div", { style: labelStyle }, "SALDO A FACTURAR"),
                  React.createElement(
                    "div",
                    { style: { fontSize: 14, fontWeight: 700, color: Zo.saldoAFacturar > 0 ? RED : MUTED } },
                    fmt(Zo.saldoAFacturar),
                  ),
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement("div", { style: labelStyle }, "MB PROMEDIO / MARKUP"),
                  React.createElement(
                    "div",
                    {
                      style: {
                        fontSize: 14,
                        fontWeight: 700,
                        color: Zo.tieneLigadas ? (Zo.mbPromedio < 0 ? RED : GREEN) : MUTED,
                      },
                    },
                    Zo.tieneLigadas ? pctMk(Zo.mbPromedio) : "—",
                  ),
                ),
              ),
              React.createElement(
                "div",
                { style: { padding: "10px 18px 18px", overflowY: "auto" } },
                Zo.subObras.length === 0
                  ? React.createElement(
                      "div",
                      { style: { fontSize: 12.5, color: MUTED, padding: "10px 0" } },
                      "Ninguna sub obra de Costos tiene cargada esta Orden de Compra todavía (cargala desde la solapa Costos, en cada sub obra).",
                    )
                  : React.createElement(
                      React.Fragment,
                      null,
                      React.createElement(
                        "div",
                        {
                          style: {
                            display: "grid",
                            gridTemplateColumns: "1.6fr 1fr 0.8fr",
                            columnGap: 8,
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: MUTED,
                            padding: "6px 4px",
                          },
                        },
                        React.createElement("div", null, "SUB OBRA"),
                        React.createElement("div", null, "ESTADO"),
                        React.createElement("div", { style: { textAlign: "right" } }, "MB / MARKUP"),
                      ),
                      Zo.subObras.map((e, t) =>
                        React.createElement(
                          "div",
                          {
                            key: t,
                            style: {
                              display: "grid",
                              gridTemplateColumns: "1.6fr 1fr 0.8fr",
                              columnGap: 8,
                              fontSize: 12.5,
                              padding: "6px 4px",
                              alignItems: "center",
                              borderTop: "1px solid " + BORDER,
                            },
                          },
                          React.createElement("div", null, e.nombre),
                          React.createElement(
                            "div",
                            null,
                            React.createElement(StatusBadge, {
                              status: e.status || "EN PROCESO",
                              onClick: Rt ? () => Gr(e.idx) : void 0,
                            }),
                          ),
                          React.createElement(
                            "div",
                            { style: { textAlign: "right", color: e.mb < 0 ? RED : GREEN, fontWeight: 600 } },
                            pctMk(e.mb),
                          ),
                        ),
                      ),
                    ),
              ),
            ),
          ),
        Jr &&
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
                zIndex: 60,
              },
            },
            React.createElement(
              "div",
              {
                style: {
                  background: "#fff",
                  borderRadius: 12,
                  width: "78%",
                  maxWidth: 900,
                  height: "78%",
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
                  "Papelera y cambios de facturas",
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (Va(false), rn(null));
                    },
                    style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                  },
                  React.createElement(X, { size: 18 }),
                ),
              ),
              React.createElement(
                "div",
                { style: { display: "flex", gap: 6, padding: "10px 18px 0" } },
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (Xa("borradas"), rn(null));
                    },
                    style: {
                      border: "none",
                      padding: "7px 14px",
                      borderRadius: "7px 7px 0 0",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: hn === "borradas" ? "#F5F4F0" : "transparent",
                      color: hn === "borradas" ? NAVY : MUTED,
                    },
                  },
                  "Borradas (",
                  Pn.length,
                  ")",
                ),
                React.createElement(
                  "button",
                  {
                    onClick: () => {
                      (Xa("ediciones"), rn(null));
                    },
                    style: {
                      border: "none",
                      padding: "7px 14px",
                      borderRadius: "7px 7px 0 0",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: hn === "ediciones" ? "#F5F4F0" : "transparent",
                      color: hn === "ediciones" ? NAVY : MUTED,
                    },
                  },
                  "Ediciones (",
                  wn.length,
                  ")",
                ),
              ),
              React.createElement(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 18px",
                    borderBottom: "1px solid " + BORDER,
                  },
                },
                React.createElement(
                  "div",
                  { style: { fontSize: 11.5, color: MUTED } },
                  hn === "borradas"
                    ? "Facturas borradas recientemente (se guardan las últimas " +
                        Bn +
                        "). Restaurar la devuelve a la lista de facturas de esa obra."
                    : "Cómo estaba cada factura ANTES de su última edición (se guardan las últimas " +
                        Bn +
                        "). Restaurar vuelve todos sus campos a como estaban en ese momento.",
                ),
                (hn === "borradas" ? Pn.length > 0 : wn.length > 0) &&
                  (ua === "__vaciar__"
                    ? React.createElement(
                        "div",
                        { style: { display: "flex", alignItems: "center", gap: 6, flexShrink: 0, fontSize: 11.5 } },
                        React.createElement("span", { style: { color: RED, fontWeight: 700 } }, "¿Vaciar todo?"),
                        React.createElement(
                          "button",
                          {
                            onClick: () => (hn === "borradas" ? ai() : ri()),
                            style: {
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              color: RED,
                              fontWeight: 700,
                            },
                          },
                          "Sí",
                        ),
                        React.createElement(
                          "button",
                          {
                            onClick: () => rn(null),
                            style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                          },
                          "No",
                        ),
                      )
                    : React.createElement(
                        "button",
                        { onClick: () => rn("__vaciar__"), style: { ...smallBtnGhost, flexShrink: 0, color: RED } },
                        "Vaciar",
                      )),
              ),
              React.createElement(
                "div",
                { style: { flex: 1, overflowY: "auto", padding: "8px 18px" } },
                Qr
                  ? React.createElement("div", { style: { padding: 20, fontSize: 12.5, color: MUTED } }, "Cargando...")
                  : hn === "borradas"
                    ? Pn.length === 0
                      ? React.createElement(
                          "div",
                          { style: { padding: 20, fontSize: 12.5, color: MUTED } },
                          "No hay facturas borradas.",
                        )
                      : React.createElement(
                          "div",
                          { style: { display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 } },
                          Pn.map((e) =>
                            React.createElement(
                              "div",
                              {
                                key: e.id,
                                style: {
                                  display: "grid",
                                  gridTemplateColumns: "1.2fr 1.3fr 1fr 1fr 1fr 1.3fr 100px 100px",
                                  columnGap: 10,
                                  alignItems: "center",
                                  fontSize: 12.5,
                                  padding: "8px 10px",
                                  borderRadius: 6,
                                  background: "#F5F4F0",
                                },
                              },
                              React.createElement("div", { style: { fontWeight: 700, color: NAVY } }, e.cliente),
                              React.createElement("div", null, e.obra),
                              React.createElement("div", null, e.concepto || "—"),
                              React.createElement(
                                "div",
                                { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                fmt(e.importe, e.tc),
                              ),
                              React.createElement("div", null, e.fecha || "—"),
                              React.createElement(
                                "div",
                                { style: { color: MUTED, fontSize: 11 } },
                                "Borrada: ",
                                e.eliminadaEn ? new Date(e.eliminadaEn).toLocaleString("es-AR") : "—",
                              ),
                              React.createElement(
                                "button",
                                { onClick: () => ei(e), style: smallBtnPrimary },
                                "Restaurar",
                              ),
                              ua === e.id
                                ? React.createElement(
                                    "div",
                                    { style: { display: "flex", gap: 4, alignItems: "center", fontSize: 11.5 } },
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => oi(e.id),
                                        style: {
                                          border: "none",
                                          background: "none",
                                          cursor: "pointer",
                                          color: RED,
                                          fontWeight: 700,
                                        },
                                      },
                                      "Sí",
                                    ),
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => rn(null),
                                        style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                                      },
                                      "No",
                                    ),
                                  )
                                : React.createElement(
                                    "button",
                                    {
                                      onClick: () => rn(e.id),
                                      style: {
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        color: RED,
                                        fontSize: 11.5,
                                        textAlign: "left",
                                      },
                                    },
                                    "Eliminar",
                                  ),
                            ),
                          ),
                        )
                    : wn.length === 0
                      ? React.createElement(
                          "div",
                          { style: { padding: 20, fontSize: 12.5, color: MUTED } },
                          "No hay ediciones registradas.",
                        )
                      : React.createElement(
                          "div",
                          { style: { display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 } },
                          wn.map((e) =>
                            React.createElement(
                              "div",
                              {
                                key: e.id,
                                style: {
                                  display: "grid",
                                  gridTemplateColumns: "1.2fr 1.3fr 1fr 1fr 1fr 1.3fr 100px 100px",
                                  columnGap: 10,
                                  alignItems: "center",
                                  fontSize: 12.5,
                                  padding: "8px 10px",
                                  borderRadius: 6,
                                  background: "#F5F4F0",
                                },
                              },
                              React.createElement("div", { style: { fontWeight: 700, color: NAVY } }, e.cliente),
                              React.createElement("div", null, e.obra),
                              React.createElement("div", null, e.concepto || "—"),
                              React.createElement(
                                "div",
                                {
                                  style: { textAlign: "right", fontVariantNumeric: "tabular-nums" },
                                  title: "Importe que tenía antes de esta edición",
                                },
                                fmt(e.importe, e.tc),
                              ),
                              React.createElement("div", null, e.fecha || "—"),
                              React.createElement(
                                "div",
                                { style: { color: MUTED, fontSize: 11 } },
                                "Editada: ",
                                e.modificadaEn ? new Date(e.modificadaEn).toLocaleString("es-AR") : "—",
                              ),
                              React.createElement(
                                "button",
                                { onClick: () => ti(e), style: smallBtnPrimary },
                                "Restaurar",
                              ),
                              ua === e.id
                                ? React.createElement(
                                    "div",
                                    { style: { display: "flex", gap: 4, alignItems: "center", fontSize: 11.5 } },
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => ni(e.id),
                                        style: {
                                          border: "none",
                                          background: "none",
                                          cursor: "pointer",
                                          color: RED,
                                          fontWeight: 700,
                                        },
                                      },
                                      "Sí",
                                    ),
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => rn(null),
                                        style: { border: "none", background: "none", cursor: "pointer", color: MUTED },
                                      },
                                      "No",
                                    ),
                                  )
                                : React.createElement(
                                    "button",
                                    {
                                      onClick: () => rn(e.id),
                                      style: {
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        color: RED,
                                        fontSize: 11.5,
                                        textAlign: "left",
                                      },
                                    },
                                    "Eliminar",
                                  ),
                            ),
                          ),
                        ),
              ),
            ),
          ),
        n === "pagos"
          ? React.createElement(PagosView, {
              rows: k,
              obras: co,
              proveedoresMap: S,
              costoSubobrasMap: Z,
              subCostoProveedoresMap: ee,
              pagosMap: F,
              subCostoPagosMap: ne,
              proveedoresInfo: oe,
              onProveedorInfoChange: Ir,
              reglasProveedoresPago: Xe,
              onReglasProveedoresPagoChange: rt,
              correccionesAprendidas: Ct,
              onCorreccionesAprendidasChange: kt,
              onCrearCentroCosto: Dr,
              onCrearSubObra: Rr,
              onCrearProveedor: Pr,
              onAdd: Er,
              onAddMasivo: Or,
              onUpdate: zn,
              onDelete: Fr,
              onSetFechaPagado: wr,
              onReintentar: Nr,
              canEdit: Rt,
              isAdmin: fn,
            })
          : n === "facturacion"
            ? React.createElement(FacturacionView, {
                facturas: g,
                obras: co,
                onViewPdf: gt,
                onMarcarAnio: Ei,
                isAdmin: fn,
                isComercial: verRegaliasPresentacion,
                onGoToObra: (e, t) => {
                  (d("obras"), be(e), no(obraKey(e, t)), ae("facturas"), lo(false));
                },
              })
            : n === "proveedores"
              ? React.createElement(ProveedoresView, {
                  proveedoresMap: S,
                  pagosMap: F,
                  obras: co,
                  costoSubobrasMap: Z,
                  subCostoProveedoresMap: ee,
                  subCostoPagosMap: ne,
                  onRename: di,
                  onImportPagos: hr,
                  onReintentarPago: Ba,
                  canEdit: Rt,
                })
              : n === "cashflow"
                ? React.createElement(CashflowView, {
                    obras: co,
                    facturas: g,
                    proveedoresMap: S,
                    pagosMap: F,
                    costoSubobrasMap: Z,
                    subCostoProveedoresMap: ee,
                    subCostoPagosMap: ne,
                    canEdit: Rt,
                    cfIngresosValores: nt,
                    setCfIngresosValores: H,
                    cfIngresosComentarios: Ee,
                    setCfIngresosComentarios: Nt,
                    cfIngresosCategorias: qt,
                    setCfIngresosCategorias: po,
                    cfIngresosCategoriasValores: oo,
                    setCfIngresosCategoriasValores: Eo,
                    cfIngresosCategoriasComentarios: Oo,
                    setCfIngresosCategoriasComentarios: Bo,
                    cfEgresosCategorias: w,
                    setCfEgresosCategorias: Ne,
                    cfEgresosValores: Re,
                    setCfEgresosValores: at,
                    cfEgresosComentarios: dt,
                    setCfEgresosComentarios: Gt,
                    cfSalidasValores: G,
                    setCfSalidasValores: te,
                    cfSaldoInicial: V,
                    setCfSaldoInicial: ut,
                    cfBancos: At,
                    setCfBancos: go,
                    cfSimulacionLineas: No,
                    setCfSimulacionLineas: Jt,
                    cfSemanaInicio: gn,
                    setCfSemanaInicio: bn,
                    cfDiasPagoCliente: sn,
                    setCfDiasPagoCliente: fo,
                    cfRegaliasPagadas: cfRegPag,
                    setCfRegaliasPagadas: setCfRegPag,
                    navBarHeight: St,
                    onGoToObra: (e, t) => {
                      (d("obras"), be(e), no(obraKey(e, t)), ae("facturas"), lo(true));
                    },
                  })
                : n === "eerr"
                  ? React.createElement(EerrView, { eerrMensual: Le, setEerrMensual: Lt, canEdit: Rt })
                  : n === "operaciones"
                    ? React.createElement(OperacionesView, {
                        obras: co,
                        onGoToObra: (e, t) => {
                          (d("obras"), be(e), no(obraKey(e, t)), ae("facturas"), lo(false));
                        },
                        onReasignar: Rt ? qa : void 0,
                        onQuitarAsignacion: Rt
                          ? (e, t, o) => qa(e, t, o, "", 'con el botón "Eliminar" en Operaciones')
                          : void 0,
                        onAsignar: Rt ? li : void 0,
                        pmCatalogo: K,
                        ddoCatalogo: Bt,
                        canEdit: Rt,
                      })
                    : React.createElement(
                        "div",
                        { style: { padding: "22px 28px" } },
                        se === null
                          ? React.createElement(
                              React.Fragment,
                              null,
                              fn &&
                                React.createElement(
                                  "div",
                                  {
                                    style: {
                                      background: "#fff",
                                      borderRadius: 12,
                                      border: "1px solid " + BORDER,
                                      boxShadow: CARD_SHADOW,
                                      padding: "14px 18px",
                                      marginBottom: 16,
                                    },
                                  },
                                  React.createElement(
                                    "div",
                                    { style: { fontSize: 12.5, fontWeight: 700, color: NAVY, marginBottom: 6 } },
                                    "Importar obras",
                                  ),
                                  React.createElement(
                                    "div",
                                    { style: { fontSize: 11.5, color: MUTED, marginBottom: 8 } },
                                    "Columnas: Cliente, Centro de Costo, Venta Total, Costo Real, Mes, Año. Sin proveedores ni facturas — el MB se calcula solo. Se omiten filas cuyo Cliente + Centro de Costo ya exista (un mismo centro de costo puede repetirse para clientes distintos, sin problema).",
                                  ),
                                  React.createElement(
                                    "div",
                                    { style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" } },
                                    React.createElement(
                                      "label",
                                      { style: smallBtnPrimary },
                                      React.createElement(Upload, { size: 13, style: { verticalAlign: "-2px" } }),
                                      " Importar obras (Excel)",
                                      React.createElement("input", {
                                        type: "file",
                                        accept: ".xlsx,.xls,.csv",
                                        style: { display: "none" },
                                        onChange: async (e) => {
                                          const t = e.target.files[0];
                                          if (t) {
                                            try {
                                              const o = await t.arrayBuffer(),
                                                a = XLSX.read(o, { type: "array" }),
                                                r = a.Sheets[a.SheetNames[0]],
                                                i = XLSX.utils.sheet_to_json(r, { defval: null }),
                                                u = (D, T) => {
                                                  for (const O of Object.keys(D))
                                                    if (T.includes(O.toString().trim().toLowerCase())) return D[O];
                                                  return null;
                                                },
                                                m = i
                                                  .map((D) => {
                                                    const T = String(u(D, ["mes"]) || "")
                                                        .toUpperCase()
                                                        .trim(),
                                                      O =
                                                        MESES.find((_) => _ === T || _.startsWith(T.slice(0, 3))) ||
                                                        null;
                                                    return {
                                                      cliente: String(u(D, ["cliente"]) || "")
                                                        .toUpperCase()
                                                        .trim(),
                                                      obra: String(u(D, ["centro de costo", "obra"]) || "")
                                                        .toUpperCase()
                                                        .trim(),
                                                      ventaTotal: Number(u(D, ["venta total", "venta"])) || 0,
                                                      costoReal: Number(u(D, ["costo real", "costo"])) || 0,
                                                      mes: O,
                                                      anio: Number(u(D, ["año", "anio", "ano"])) || null,
                                                    };
                                                  })
                                                  .filter((D) => D.cliente && D.obra),
                                                x = Ci(m, Number(J) || 2025, ke);
                                              It(
                                                x.agregadasCount +
                                                  " obra(s) agregada(s)" +
                                                  (x.omitidasCount > 0
                                                    ? ", " + x.omitidasCount + " omitida(s) (ya existían)"
                                                    : "") +
                                                  " — el mes/año se toma de la planilla; si alguna fila no lo traía, se usó Enero " +
                                                  (Number(J) || 2025) +
                                                  " por defecto." +
                                                  (ke
                                                    ? " Se cargó además una factura por el total de cada obra, marcada como pagada."
                                                    : ""),
                                              );
                                            } catch {
                                              It("No se pudo leer el archivo.");
                                            }
                                            e.target.value = "";
                                          }
                                        },
                                      }),
                                    ),
                                    React.createElement(
                                      "div",
                                      { style: { display: "flex", alignItems: "center", gap: 6 } },
                                      React.createElement(
                                        "label",
                                        { style: { fontSize: 11.5, color: MUTED } },
                                        "Año por defecto:",
                                      ),
                                      React.createElement("input", {
                                        type: "number",
                                        value: J,
                                        onChange: (e) => fe(e.target.value),
                                        style: { ...inputStyle, width: 80 },
                                      }),
                                    ),
                                    React.createElement(
                                      "label",
                                      {
                                        style: {
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 6,
                                          fontSize: 11.5,
                                          color: MUTED,
                                          cursor: "pointer",
                                        },
                                      },
                                      React.createElement("input", {
                                        type: "checkbox",
                                        checked: ke,
                                        onChange: (e) => We(e.target.checked),
                                      }),
                                      "Marcar 100% facturado y cobrado",
                                    ),
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => {
                                          const e = XLSX.utils.aoa_to_sheet([
                                              ["Cliente", "Centro de Costo", "Venta Total", "Costo Real", "Mes", "Año"],
                                              ["PANDORA", "UNICENTER", 1e8, 7e7, "Marzo", 2025],
                                            ]),
                                            t = XLSX.utils.book_new();
                                          (XLSX.utils.book_append_sheet(t, e, "Obras"),
                                            descargarLibroXlsx(t, "plantilla_obras.xlsx"));
                                        },
                                        style: { ...smallBtnGhost, color: MUTED },
                                      },
                                      "Plantilla de ejemplo",
                                    ),
                                  ),
                                  wt &&
                                    React.createElement(
                                      "div",
                                      { style: { fontSize: 11.5, color: MUTED, marginTop: 8 } },
                                      wt,
                                    ),
                                ),
                              React.createElement(
                                "div",
                                { style: { display: "flex", gap: 16, marginBottom: 16, alignItems: "stretch" } },
                                React.createElement(
                                  "div",
                                  {
                                    style: {
                                      flex: 1,
                                      background: "#fff",
                                      borderRadius: 12,
                                      border: "1px solid " + BORDER,
                                      boxShadow: CARD_SHADOW,
                                      padding: "18px 20px",
                                    },
                                  },
                                  React.createElement(
                                    "div",
                                    {
                                      style: {
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 4,
                                        flexWrap: "wrap",
                                        gap: 8,
                                      },
                                    },
                                    React.createElement(
                                      "div",
                                      { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" } },
                                      React.createElement(
                                        "div",
                                        {
                                          style: { fontSize: 11.5, fontWeight: 700, color: MUTED, letterSpacing: 0.3 },
                                        },
                                        "VENTA CONSOLIDADA POR MES",
                                      ),
                                      Ao.anterior > 0 &&
                                        React.createElement(
                                          "div",
                                          {
                                            title:
                                              "Acumulado " +
                                              Ao.currentYear +
                                              " vs " +
                                              Ao.previousYear +
                                              " (Ene–" +
                                              Dn(Ao.currentMonthIdx) +
                                              ")",
                                            style: {
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 5,
                                              fontSize: 11,
                                              fontWeight: 700,
                                              color: valSmart(Ao.delta, Ao.deltaUSD) >= 0 ? GREEN : RED,
                                              background: valSmart(Ao.delta, Ao.deltaUSD) >= 0 ? "#E6EEE9" : "#F7E6E3",
                                              border:
                                                "1px solid " +
                                                (valSmart(Ao.delta, Ao.deltaUSD) >= 0 ? "#CFE0D5" : "#EAC7BE"),
                                              borderRadius: 20,
                                              padding: "3px 10px",
                                              cursor: "default",
                                            },
                                          },
                                          React.createElement(
                                            "span",
                                            null,
                                            valSmart(Ao.delta, Ao.deltaUSD) >= 0 ? "▲" : "▼",
                                          ),
                                          React.createElement(
                                            "span",
                                            null,
                                            fmtSmart(Math.abs(Ao.delta), Math.abs(Ao.deltaUSD)),
                                          ),
                                          React.createElement(
                                            "span",
                                            null,
                                            "(",
                                            pctSmart(Math.abs(Ao.deltaPct), Math.abs(Ao.deltaPctUSD)),
                                            ")",
                                          ),
                                        ),
                                    ),
                                  ),
                                  Ao.anterior > 0 &&
                                    React.createElement(
                                      "div",
                                      { style: { fontSize: 10, color: MUTED, marginBottom: 8 } },
                                      "vs ",
                                      Ao.previousYear,
                                      ": ",
                                      fmtSmart(Ao.anterior, Ao.anteriorUSD),
                                      " (Ene–",
                                      Dn(Ao.currentMonthIdx),
                                      ")",
                                    ),
                                  React.createElement(
                                    "div",
                                    { style: { width: "100%", height: 220 } },
                                    React.createElement(
                                      ResponsiveContainer,
                                      null,
                                      React.createElement(
                                        BarChart,
                                        { data: mr, margin: { top: 5, right: 10, left: 0, bottom: 0 } },
                                        React.createElement(CartesianGrid, {
                                          strokeDasharray: "3 3",
                                          stroke: BORDER,
                                          vertical: false,
                                        }),
                                        React.createElement(XAxis, {
                                          dataKey: "label",
                                          tick: { fontSize: 11, fill: MUTED },
                                          axisLine: { stroke: BORDER },
                                          tickLine: false,
                                        }),
                                        React.createElement(YAxis, {
                                          tick: { fontSize: 10, fill: MUTED },
                                          axisLine: false,
                                          tickLine: false,
                                          tickFormatter: (e) => (e / 1e6).toFixed(0) + "M",
                                        }),
                                        React.createElement(Tooltip, { formatter: (e) => fmt(e) }),
                                        Ro.map((e, t) =>
                                          React.createElement(Bar, {
                                            key: e,
                                            dataKey: e,
                                            name: String(e),
                                            fill: PIE_COLORS[xn.indexOf(e) % PIE_COLORS.length],
                                            radius: [4, 4, 0, 0],
                                            cursor: "pointer",
                                            onClick: (o) => {
                                              const a = o.payload || o;
                                              it({ anio: e, mesIdx: a.mesIdx, label: Dn(a.mesIdx) + " " + e });
                                            },
                                          }),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                React.createElement(
                                  "div",
                                  {
                                    style: {
                                      flex: 1,
                                      background: "#fff",
                                      borderRadius: 12,
                                      border: "1px solid " + BORDER,
                                      boxShadow: CARD_SHADOW,
                                      padding: "18px 20px",
                                    },
                                  },
                                  React.createElement(
                                    "div",
                                    {
                                      style: {
                                        fontSize: 11.5,
                                        fontWeight: 700,
                                        color: MUTED,
                                        marginBottom: 8,
                                        letterSpacing: 0.3,
                                      },
                                    },
                                    "VENTA POR CLIENTE",
                                  ),
                                  Ro.length > 1
                                    ? React.createElement(
                                        "div",
                                        { style: { width: "100%", height: Math.max(200, Ta.length * 30) + 30 } },
                                        Rn.length > 8 &&
                                          React.createElement(
                                            "div",
                                            { style: { fontSize: 10, color: MUTED, marginBottom: 4 } },
                                            'Top 8 clientes por venta total; el resto agrupado en "OTROS"',
                                          ),
                                        React.createElement(
                                          ResponsiveContainer,
                                          null,
                                          React.createElement(
                                            BarChart,
                                            {
                                              data: Ta,
                                              layout: "vertical",
                                              margin: { top: 5, right: 36, left: 10, bottom: 0 },
                                            },
                                            React.createElement(CartesianGrid, {
                                              strokeDasharray: "3 3",
                                              stroke: BORDER,
                                              horizontal: false,
                                            }),
                                            React.createElement(XAxis, {
                                              type: "number",
                                              tick: { fontSize: 10, fill: MUTED },
                                              axisLine: false,
                                              tickLine: false,
                                              tickFormatter: (e) => (e / 1e6).toFixed(0) + "M",
                                            }),
                                            React.createElement(YAxis, {
                                              type: "category",
                                              dataKey: "cliente",
                                              tick: { fontSize: 11, fill: TEXT },
                                              axisLine: { stroke: BORDER },
                                              tickLine: false,
                                              width: 110,
                                            }),
                                            React.createElement(Tooltip, { formatter: (e) => fmt(e) }),
                                            React.createElement(Legend, { wrapperStyle: { fontSize: 11 } }),
                                            Ro.map((e) => {
                                              const t = un.find((o) => o.anio === e)?.venta || 0;
                                              return React.createElement(
                                                Bar,
                                                {
                                                  key: e,
                                                  dataKey: e,
                                                  name: String(e),
                                                  fill: PIE_COLORS[xn.indexOf(e) % PIE_COLORS.length],
                                                  radius: [0, 4, 4, 0],
                                                  cursor: "pointer",
                                                  onClick: (o) => {
                                                    const a = o.payload || o;
                                                    ka[a.cliente] && be(a.cliente);
                                                  },
                                                },
                                                React.createElement(LabelList, {
                                                  dataKey: e,
                                                  position: "right",
                                                  formatter: (o) => (t ? ((o / t) * 100).toFixed(0) + "%" : ""),
                                                  style: { fontSize: 10, fill: MUTED },
                                                }),
                                              );
                                            }),
                                          ),
                                        ),
                                      )
                                    : React.createElement(
                                        "div",
                                        { style: { display: "flex", gap: 20, alignItems: "center" } },
                                        React.createElement(
                                          "div",
                                          { style: { width: 190, height: 190, flexShrink: 0 } },
                                          React.createElement(
                                            ResponsiveContainer,
                                            null,
                                            React.createElement(
                                              PieChart,
                                              null,
                                              React.createElement(
                                                Pie,
                                                {
                                                  data: ra,
                                                  dataKey: "value",
                                                  nameKey: "name",
                                                  cx: "50%",
                                                  cy: "50%",
                                                  outerRadius: 78,
                                                  onClick: (e) => be(e.name),
                                                  style: { cursor: "pointer" },
                                                },
                                                ra.map((e, t) =>
                                                  React.createElement(Cell, {
                                                    key: t,
                                                    fill: PIE_COLORS[t % PIE_COLORS.length],
                                                    opacity: !b.home || b.home === e.name ? 1 : 0.3,
                                                  }),
                                                ),
                                              ),
                                              React.createElement(Tooltip, { formatter: (e) => fmt(e) }),
                                            ),
                                          ),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { minWidth: 0 } },
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 4,
                                                fontSize: 12,
                                                maxHeight: 150,
                                                overflowY: "auto",
                                              },
                                            },
                                            ra.map((e, t) =>
                                              React.createElement(
                                                "div",
                                                {
                                                  key: e.name,
                                                  onClick: () => be(e.name),
                                                  onMouseEnter: () => R((o) => ({ ...o, home: e.name })),
                                                  onMouseLeave: () => R((o) => ({ ...o, home: null })),
                                                  style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    cursor: "pointer",
                                                  },
                                                },
                                                React.createElement("span", {
                                                  style: {
                                                    width: 9,
                                                    height: 9,
                                                    borderRadius: 2,
                                                    background: PIE_COLORS[t % PIE_COLORS.length],
                                                    flexShrink: 0,
                                                  },
                                                }),
                                                React.createElement(
                                                  "span",
                                                  {
                                                    style: {
                                                      fontWeight: 600,
                                                      overflow: "hidden",
                                                      textOverflow: "ellipsis",
                                                      whiteSpace: "nowrap",
                                                    },
                                                  },
                                                  e.name,
                                                ),
                                                React.createElement(
                                                  "span",
                                                  { style: { color: MUTED } },
                                                  ((e.value / ro.venta) * 100).toFixed(0),
                                                  "%",
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                ),
                              ),
                              Ue
                                ? (() => {
                                    const t = An.filter((i) => i.anio === Ue.anio && i.mesIdx === Ue.mesIdx),
                                      ventaMesPorCC = {};
                                    t.forEach((i) => {
                                      const g = ventaMesPorCC[i.key] || (ventaMesPorCC[i.key] = { monto: 0, montoUSD: 0 });
                                      ((g.monto += i.monto), (g.montoUSD += i.montoUSD || 0));
                                    });
                                    const e = co
                                        .map((i) => {
                                          const g = ventaMesPorCC[obraKey(i.cliente, i.obra)];
                                          return g ? { ...i, ventaMes: g.monto, ventaMesUSD: g.montoUSD } : null;
                                        })
                                        .filter((i) => i && i.ventaMes !== 0)
                                        .sort((i, u) => u.ventaMes - i.ventaMes),
                                      o = {};
                                    t.forEach((i) => {
                                      o[i.cliente] = (o[i.cliente] || 0) + i.monto;
                                    });
                                    const a = Object.entries(o)
                                        .map(([i, u]) => ({ name: i, value: u }))
                                        .filter((i) => i.value !== 0)
                                        .sort((i, u) => u.value - i.value),
                                      r = a.reduce((i, u) => i + u.value, 0);
                                    return React.createElement(
                                      React.Fragment,
                                      null,
                                      React.createElement(
                                        "button",
                                        { onClick: () => it(null), style: { ...smallBtnGhost, marginBottom: 14 } },
                                        React.createElement(ArrowLeft, { size: 14 }),
                                        " Volver a todos los meses",
                                      ),
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
                                          { style: { width: 200, height: 190, flexShrink: 0 } },
                                          React.createElement(
                                            ResponsiveContainer,
                                            null,
                                            React.createElement(
                                              PieChart,
                                              null,
                                              React.createElement(
                                                Pie,
                                                {
                                                  data: a,
                                                  dataKey: "value",
                                                  nameKey: "name",
                                                  cx: "50%",
                                                  cy: "50%",
                                                  outerRadius: 78,
                                                },
                                                a.map((i, u) =>
                                                  React.createElement(Cell, {
                                                    key: u,
                                                    fill: PIE_COLORS[u % PIE_COLORS.length],
                                                  }),
                                                ),
                                              ),
                                              React.createElement(Tooltip, { formatter: (i) => fmt(i) }),
                                            ),
                                          ),
                                        ),
                                        React.createElement(
                                          "div",
                                          null,
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                fontFamily: "Georgia, serif",
                                                fontSize: 18,
                                                fontWeight: 700,
                                                color: NAVY,
                                                marginBottom: 8,
                                              },
                                            },
                                            Ue.label,
                                            " — ",
                                            fmt(r),
                                          ),
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "grid",
                                                gridTemplateColumns: "1fr 1fr",
                                                columnGap: 10,
                                                gap: "4px 18px",
                                                fontSize: 12.5,
                                              },
                                            },
                                            a.map((i, u) =>
                                              React.createElement(
                                                "div",
                                                {
                                                  key: i.name,
                                                  style: { display: "flex", alignItems: "center", gap: 7 },
                                                },
                                                React.createElement("span", {
                                                  style: {
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: 3,
                                                    background: PIE_COLORS[u % PIE_COLORS.length],
                                                    flexShrink: 0,
                                                  },
                                                }),
                                                React.createElement("span", { style: { fontWeight: 600 } }, i.name),
                                                React.createElement(
                                                  "span",
                                                  { style: { color: MUTED } },
                                                  ((i.value / r) * 100).toFixed(0),
                                                  "%",
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                      React.createElement(
                                        "div",
                                        { style: { fontSize: 11.5, fontWeight: 600, color: MUTED, marginBottom: 6 } },
                                        "Centros de costo con venta en ",
                                        Ue.label,
                                        " (venta del mes, incluye órdenes de compra por su fecha; costo y MB son de la obra completa)",
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
                                              display: "grid",
                                              gridTemplateColumns: "1.6fr 1.6fr 1fr 1.1fr 1.1fr 0.8fr 0.8fr",
                                              columnGap: 10,
                                              padding: "11px 18px",
                                              fontSize: 11.5,
                                              fontWeight: 700,
                                              background: "#EFEDE7",
                                              borderBottom: "1px solid " + BORDER,
                                              letterSpacing: 0.3,
                                            },
                                          },
                                          React.createElement("div", null, "CLIENTE"),
                                          React.createElement("div", null, "CENTRO DE COSTO"),
                                          React.createElement("div", null, "ESTADO"),
                                          React.createElement("div", { style: { textAlign: "right" } }, "VENTA DEL MES"),
                                          React.createElement("div", { style: { textAlign: "right" } }, "COSTO OBRA"),
                                          React.createElement("div", { style: { textAlign: "right" } }, "MB INICIAL / MARKUP"),
                                          React.createElement("div", { style: { textAlign: "right" } }, "MB FINAL / MARKUP"),
                                        ),
                                        e.length === 0
                                          ? React.createElement(
                                              "div",
                                              { style: { padding: 20, fontSize: 12.5, color: MUTED } },
                                              "No hay ventas en este mes.",
                                            )
                                          : e.map((i) => {
                                              const u = obraKey(i.cliente, i.obra);
                                              return React.createElement(
                                                "div",
                                                {
                                                  key: u,
                                                  onClick: () => {
                                                    (be(i.cliente), no(u), ae("facturas"));
                                                  },
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "1.6fr 1.6fr 1fr 1.1fr 1.1fr 0.8fr 0.8fr",
                                                    columnGap: 10,
                                                    padding: "10px 18px",
                                                    fontSize: 13,
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid " + BORDER,
                                                  },
                                                },
                                                React.createElement(
                                                  "div",
                                                  { style: { fontWeight: 700, color: NAVY } },
                                                  i.cliente,
                                                ),
                                                React.createElement("div", null, i.obra),
                                                React.createElement(
                                                  "div",
                                                  null,
                                                  React.createElement(StatusBadge, { status: i.status }),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                                  fmtSmart(i.ventaMes, i.ventaMesUSD),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      textAlign: "right",
                                                      fontVariantNumeric: "tabular-nums",
                                                      color: MUTED,
                                                    },
                                                  },
                                                  fmtSmart(i.costoFinal, i.costoFinalUSD),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right" } },
                                                  React.createElement(MBValue, {
                                                    v: valSmart(i.mbInicial, i.mbInicialUSD),
                                                  }),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right" } },
                                                  React.createElement(MBValue, {
                                                    v: valSmart(i.mbFinal, i.mbFinalUSD),
                                                  }),
                                                ),
                                              );
                                            }),
                                        e.length > 0 &&
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "grid",
                                                gridTemplateColumns: "1.6fr 1.6fr 1fr 1.1fr 1.1fr 0.8fr 0.8fr",
                                                columnGap: 10,
                                                padding: "10px 18px",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                background: "#F1E9D2",
                                              },
                                            },
                                            React.createElement("div", { style: { color: NAVY } }, "TOTAL"),
                                            React.createElement("div", null),
                                            React.createElement("div", null),
                                            React.createElement(
                                              "div",
                                              { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                              fmtSmart(
                                                e.reduce((i, u) => i + u.ventaMes, 0),
                                                e.reduce((i, u) => i + (u.ventaMesUSD || 0), 0),
                                              ),
                                            ),
                                            React.createElement("div", null),
                                            React.createElement("div", null),
                                            React.createElement("div", null),
                                          ),
                                      ),
                                    );
                                  })()
                                : React.createElement(
                                    React.Fragment,
                                    null,
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
                                      React.createElement("input", {
                                        placeholder: "Buscar por cliente o centro de costo...",
                                        value: j,
                                        onChange: (e) => Q(e.target.value),
                                        style: { ...inputStyle, width: 320 },
                                      }),
                                      React.createElement(
                                        "button",
                                        { onClick: Ai, style: smallBtnGhost },
                                        "Descargar resumen de todas las obras",
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
                                            display: "grid",
                                            gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1.1fr 1fr 32px",
                                            columnGap: 10,
                                            padding: "11px 18px",
                                            fontSize: 11.5,
                                            fontWeight: 700,
                                            background: "#EFEDE7",
                                            borderBottom: "1px solid " + BORDER,
                                            letterSpacing: 0.3,
                                          },
                                        },
                                        React.createElement(SortHeader, {
                                          label: "CLIENTE",
                                          tableId: "clientList",
                                          sortKey: "cliente",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "OBRAS",
                                          tableId: "clientList",
                                          sortKey: "count",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "VENTA",
                                          tableId: "clientList",
                                          sortKey: "venta",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "COSTO FINAL",
                                          tableId: "clientList",
                                          sortKey: "costo",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "SALDO A PAGAR",
                                          tableId: "clientList",
                                          sortKey: "saldo",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "PRECIO X M2",
                                          tableId: "clientList",
                                          sortKey: "precioM2",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "MB / MARKUP",
                                          tableId: "clientList",
                                          sortKey: "mb",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement("div", null),
                                      ),
                                      So(
                                        "clientList",
                                        Object.entries(ka)
                                          .filter(([e, t]) => {
                                            const o = j.trim().toLowerCase();
                                            return o
                                              ? e.toLowerCase().includes(o) ||
                                                  t.some((a) => a.obra.toLowerCase().includes(o))
                                              : true;
                                          })
                                          .map(([e, t]) => {
                                            const o = t.reduce((le, ft) => le + ft.ventaFinal, 0),
                                              a = t.reduce((le, ft) => le + ft.costoFinal, 0),
                                              r = t.reduce((le, ft) => le + (ft.ventaFinalUSD || 0), 0),
                                              i = t.reduce((le, ft) => le + (ft.costoFinalUSD || 0), 0),
                                              u = t.reduce((le, ft) => le + (ft.saldoProveedores || 0), 0),
                                              m = t.reduce((le, ft) => le + (ft.saldoProveedoresUSD || 0), 0),
                                              x = o ? ((o - a) / o) * 100 : 0,
                                              D = r ? ((r - i) / r) * 100 : 0,
                                              T = Ro.map((le) => {
                                                const ft = t.filter(
                                                  (to) => (to.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                );
                                                return {
                                                  anio: le,
                                                  venta: ft.reduce((to, h) => to + h.ventaFinal, 0),
                                                  ventaUSD: ft.reduce((to, h) => to + (h.ventaFinalUSD || 0), 0),
                                                };
                                              }).filter((le) => le.venta > 0),
                                              O = Ro.map((le) => {
                                                const ft = t.filter(
                                                  (to) => (to.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                );
                                                return {
                                                  anio: le,
                                                  costo: ft.reduce((to, h) => to + h.costoFinal, 0),
                                                  costoUSD: ft.reduce((to, h) => to + (h.costoFinalUSD || 0), 0),
                                                };
                                              }).filter((le) => le.costo > 0),
                                              _ = Ro.map((le) => ({
                                                anio: le,
                                                count: t.filter(
                                                  (ft) => (ft.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                ).length,
                                              })).filter((le) => le.count > 0),
                                              xe = Ro.map((le) => {
                                                const ft = t.filter(
                                                    (Ce) =>
                                                      (Ce.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                  ),
                                                  to = ft.reduce((Ce, ie) => Ce + ie.ventaFinal, 0),
                                                  h = ft.reduce((Ce, ie) => Ce + ie.costoFinal, 0),
                                                  N = ft.reduce((Ce, ie) => Ce + (ie.ventaFinalUSD || 0), 0),
                                                  De = ft.reduce((Ce, ie) => Ce + (ie.costoFinalUSD || 0), 0);
                                                return {
                                                  anio: le,
                                                  venta: to,
                                                  mb: to ? ((to - h) / to) * 100 : 0,
                                                  mbUSD: N ? ((N - De) / N) * 100 : 0,
                                                };
                                              }).filter((le) => le.venta > 0),
                                              Ie = t.reduce((le, ft) => le + Ln(ft), 0),
                                              Te = Ie > 0 ? o / Ie : null,
                                              Ge = Ro.map((le) => {
                                                const ft = t.filter(
                                                    (N) => (N.anio || /* @__PURE__ */ new Date().getFullYear()) === le,
                                                  ),
                                                  to = ft.reduce((N, De) => N + De.ventaFinal, 0),
                                                  h = ft.reduce((N, De) => N + Ln(De), 0);
                                                return { anio: le, precioM2: h > 0 ? to / h : null };
                                              }).filter((le) => le.precioM2 != null),
                                              Ze = t.reduce(
                                                (le, ft) => le + (Z[obraKey(ft.cliente, ft.obra)] || []).length,
                                                0,
                                              );
                                            return {
                                              cliente: e,
                                              list: t,
                                              count: t.length,
                                              venta: o,
                                              costo: a,
                                              saldo: u,
                                              saldoUSD: m,
                                              mb: x,
                                              ventaUSD: r,
                                              costoUSD: i,
                                              mbUSD: D,
                                              ventaPorAnio: T,
                                              costoPorAnio: O,
                                              obrasPorAnio: _,
                                              mbPorAnio: xe,
                                              precioM2: Te,
                                              precioM2PorAnio: Ge,
                                              subObrasCostosCount: Ze,
                                            };
                                          }),
                                      ).map(
                                        ({
                                          cliente: e,
                                          list: t,
                                          count: o,
                                          venta: a,
                                          costo: r,
                                          saldo: i,
                                          saldoUSD: u,
                                          mb: m,
                                          ventaUSD: x,
                                          costoUSD: D,
                                          mbUSD: T,
                                          ventaPorAnio: O,
                                          costoPorAnio: _,
                                          obrasPorAnio: xe,
                                          mbPorAnio: Ie,
                                          precioM2: Te,
                                          precioM2PorAnio: Ge,
                                          subObrasCostosCount: Ze,
                                        }) =>
                                          React.createElement(
                                            "div",
                                            {
                                              key: e,
                                              onClick: () => be(e),
                                              style: {
                                                display: "grid",
                                                gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1.1fr 1fr 32px",
                                                columnGap: 10,
                                                padding: "12px 18px",
                                                fontSize: 13.5,
                                                alignItems: "center",
                                                cursor: "pointer",
                                                borderBottom: "1px solid " + BORDER,
                                              },
                                            },
                                            React.createElement("div", { style: { fontWeight: 700, color: NAVY } }, e),
                                            React.createElement(
                                              "div",
                                              { style: { textAlign: "right", color: MUTED } },
                                              xe.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                    xe.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        { key: le.anio, style: { fontSize: 11.5 } },
                                                        React.createElement(
                                                          "span",
                                                          { style: { fontWeight: 400 } },
                                                          le.anio,
                                                          ": ",
                                                        ),
                                                        le.count,
                                                      ),
                                                    ),
                                                  )
                                                : React.createElement(
                                                    React.Fragment,
                                                    null,
                                                    o,
                                                    e === "WU" && Ze > 0 ? " (" + Ze + ")" : "",
                                                  ),
                                            ),
                                            React.createElement(
                                              "div",
                                              { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                              O.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                    O.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        { key: le.anio, style: { fontSize: 11.5 } },
                                                        React.createElement(
                                                          "span",
                                                          { style: { color: MUTED, fontWeight: 400 } },
                                                          le.anio,
                                                          ": ",
                                                        ),
                                                        fmtSmart(le.venta, le.ventaUSD),
                                                      ),
                                                    ),
                                                  )
                                                : fmtSmart(a, x),
                                            ),
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  textAlign: "right",
                                                  fontVariantNumeric: "tabular-nums",
                                                  color: MUTED,
                                                },
                                              },
                                              _.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                    _.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        { key: le.anio, style: { fontSize: 11.5 } },
                                                        React.createElement(
                                                          "span",
                                                          { style: { fontWeight: 400 } },
                                                          le.anio,
                                                          ": ",
                                                        ),
                                                        fmtSmart(le.costo, le.costoUSD),
                                                      ),
                                                    ),
                                                  )
                                                : fmtSmart(r, D),
                                            ),
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  textAlign: "right",
                                                  fontVariantNumeric: "tabular-nums",
                                                  color: i > 0 ? RED : MUTED,
                                                },
                                              },
                                              fmtSmart(i, u),
                                            ),
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  textAlign: "right",
                                                  fontVariantNumeric: "tabular-nums",
                                                  color: MUTED,
                                                },
                                              },
                                              Ge.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                    Ge.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        { key: le.anio, style: { fontSize: 11.5 } },
                                                        React.createElement(
                                                          "span",
                                                          { style: { fontWeight: 400 } },
                                                          le.anio,
                                                          ": ",
                                                        ),
                                                        fmt(le.precioM2),
                                                      ),
                                                    ),
                                                  )
                                                : Te != null
                                                  ? fmt(Te)
                                                  : "—",
                                            ),
                                            React.createElement(
                                              "div",
                                              { style: { textAlign: "right" } },
                                              Ie.length > 1
                                                ? React.createElement(
                                                    "div",
                                                    {
                                                      style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 1,
                                                        alignItems: "flex-end",
                                                      },
                                                    },
                                                    Ie.map((le) =>
                                                      React.createElement(
                                                        "div",
                                                        {
                                                          key: le.anio,
                                                          style: {
                                                            fontSize: 11.5,
                                                            display: "flex",
                                                            gap: 4,
                                                            alignItems: "baseline",
                                                          },
                                                        },
                                                        React.createElement(
                                                          "span",
                                                          { style: { color: MUTED, fontWeight: 400 } },
                                                          le.anio,
                                                          ":",
                                                        ),
                                                        React.createElement(MBValue, { v: valSmart(le.mb, le.mbUSD) }),
                                                      ),
                                                    ),
                                                  )
                                                : React.createElement(MBValue, { v: valSmart(m, T) }),
                                            ),
                                            React.createElement(
                                              "div",
                                              { style: { display: "flex", justifyContent: "center", color: MUTED } },
                                              React.createElement(ChevronRight, { size: 16 }),
                                            ),
                                          ),
                                      ),
                                      React.createElement(
                                        "div",
                                        {
                                          style: {
                                            display: "grid",
                                            gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1.1fr 1fr 32px",
                                            columnGap: 10,
                                            padding: "12px 18px",
                                            fontSize: 13.5,
                                            fontWeight: 700,
                                            background: "#F1E9D2",
                                          },
                                        },
                                        React.createElement("div", { style: { color: NAVY } }, "TOTAL"),
                                        React.createElement("div", { style: { textAlign: "right" } }, ro.count),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                          un.length > 1
                                            ? React.createElement(
                                                "div",
                                                { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                un.map((e) =>
                                                  React.createElement(
                                                    "div",
                                                    { key: e.anio, style: { fontSize: 12 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { color: MUTED, fontWeight: 400 } },
                                                      e.anio,
                                                      ": ",
                                                    ),
                                                    fmtSmart(e.venta, e.ventaUSD),
                                                  ),
                                                ),
                                              )
                                            : fmtSmart(ro.venta, ro.ventaUSD),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                          un.length > 1
                                            ? React.createElement(
                                                "div",
                                                { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                un.map((e) =>
                                                  React.createElement(
                                                    "div",
                                                    { key: e.anio, style: { fontSize: 12 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { color: MUTED, fontWeight: 400 } },
                                                      e.anio,
                                                      ": ",
                                                    ),
                                                    fmtSmart(e.costo, e.costoUSD),
                                                  ),
                                                ),
                                              )
                                            : fmtSmart(ro.costo, ro.costoUSD),
                                        ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              textAlign: "right",
                                              fontVariantNumeric: "tabular-nums",
                                              color: ro.saldo > 0 ? RED : NAVY,
                                            },
                                          },
                                          fmtSmart(ro.saldo, ro.saldoUSD),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                          un.length > 1
                                            ? React.createElement(
                                                "div",
                                                { style: { display: "flex", flexDirection: "column", gap: 1 } },
                                                un.map((e) =>
                                                  React.createElement(
                                                    "div",
                                                    { key: e.anio, style: { fontSize: 12 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { color: MUTED, fontWeight: 400 } },
                                                      e.anio,
                                                      ": ",
                                                    ),
                                                    e.precioM2 != null ? fmt(e.precioM2) : "—",
                                                  ),
                                                ),
                                              )
                                            : ro.precioM2 != null
                                              ? fmt(ro.precioM2)
                                              : "—",
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right" } },
                                          un.length > 1
                                            ? React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 1,
                                                    alignItems: "flex-end",
                                                  },
                                                },
                                                un.map((e) =>
                                                  React.createElement(
                                                    "div",
                                                    {
                                                      key: e.anio,
                                                      style: {
                                                        fontSize: 12,
                                                        display: "flex",
                                                        gap: 4,
                                                        alignItems: "baseline",
                                                      },
                                                    },
                                                    React.createElement(
                                                      "span",
                                                      { style: { color: MUTED, fontWeight: 400 } },
                                                      e.anio,
                                                      ":",
                                                    ),
                                                    React.createElement(MBValue, { v: valSmart(e.mb, e.mbUSD) }),
                                                  ),
                                                ),
                                              )
                                            : React.createElement(MBValue, { v: valSmart(ro.mb, ro.mbUSD) }),
                                        ),
                                        React.createElement("div", null),
                                      ),
                                    ),
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          marginTop: 24,
                                          marginBottom: 10,
                                          fontSize: 13,
                                          fontWeight: 700,
                                          color: NAVY,
                                          display: "flex",
                                          alignItems: "baseline",
                                          gap: 8,
                                        },
                                      },
                                      "Todos los centros de costo",
                                      React.createElement(
                                        "span",
                                        { style: { fontSize: 11.5, fontWeight: 600, color: MUTED } },
                                        "(",
                                        jo.filter((e) => e.status !== "FINALIZADA").length,
                                        " en proceso)",
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
                                            display: "grid",
                                            gridTemplateColumns: "1.6fr 1.6fr 1fr 1fr 1fr",
                                            columnGap: 10,
                                            padding: "11px 18px",
                                            fontSize: 11.5,
                                            fontWeight: 700,
                                            background: "#EFEDE7",
                                            borderBottom: "1px solid " + BORDER,
                                            letterSpacing: 0.3,
                                          },
                                        },
                                        React.createElement(SortHeader, {
                                          label: "CLIENTE",
                                          tableId: "allObrasList",
                                          sortKey: "cliente",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "CENTRO DE COSTO",
                                          tableId: "allObrasList",
                                          sortKey: "obra",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "ESTADO",
                                          tableId: "allObrasList",
                                          sortKey: "status",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "PRECIO X M2",
                                          tableId: "allObrasList",
                                          sortKey: "precioM2",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "MB / MARKUP",
                                          tableId: "allObrasList",
                                          sortKey: "mbFinal",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                      ),
                                      (() => {
                                        const e = j.trim().toLowerCase(),
                                          t = jo
                                            .filter(
                                              (o) =>
                                                !e ||
                                                o.cliente.toLowerCase().includes(e) ||
                                                o.obra.toLowerCase().includes(e),
                                            )
                                            .map((o) => {
                                              const a = Ln(o);
                                              return { ...o, precioM2: a > 0 ? o.ventaFinal / a : null };
                                            });
                                        return t.length === 0
                                          ? React.createElement(
                                              "div",
                                              { style: { padding: 20, fontSize: 12.5, color: MUTED } },
                                              "No hay centros de costo cargados.",
                                            )
                                          : So("allObrasList", t).map((o) => {
                                              const a = obraKey(o.cliente, o.obra);
                                              return React.createElement(
                                                "div",
                                                {
                                                  key: a,
                                                  onClick: () => {
                                                    (be(o.cliente), no(a), ae("facturas"));
                                                  },
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "1.6fr 1.6fr 1fr 1fr 1fr",
                                                    columnGap: 10,
                                                    padding: "10px 18px",
                                                    fontSize: 13,
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    borderBottom: "1px solid " + BORDER,
                                                  },
                                                },
                                                React.createElement(
                                                  "div",
                                                  { style: { fontWeight: 700, color: NAVY } },
                                                  o.cliente,
                                                ),
                                                React.createElement("div", null, o.obra),
                                                React.createElement(
                                                  "div",
                                                  null,
                                                  React.createElement(StatusBadge, { status: o.status }),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      textAlign: "right",
                                                      fontVariantNumeric: "tabular-nums",
                                                      color: MUTED,
                                                    },
                                                  },
                                                  o.precioM2 != null ? fmt(o.precioM2) : "—",
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right" } },
                                                  React.createElement(MBValue, {
                                                    v: valSmart(o.mbFinal, o.mbFinalUSD),
                                                  }),
                                                ),
                                              );
                                            });
                                      })(),
                                    ),
                                  ),
                            )
                          : Ot
                            ? (() => {
                                const e = (Tn[se] || []).find((h) => obraKey(h.cliente, h.obra) === Ot);
                                if (!e) return null;
                                const t = Ot,
                                  o = S[t] || [],
                                  a = F[t] || [],
                                  r = (Do[t] || "").trim().toLowerCase(),
                                  i = a
                                    .map((h, N) => ({ ...h, _idx: N }))
                                    .filter((h) => !r || h.proveedor.toLowerCase().includes(r)),
                                  u = Jo[t],
                                  m = Vt[t],
                                  x = e.cliente !== "WU",
                                  D = (x && Number(e.m2)) || 0,
                                  T = x ? "1.7fr 1fr 1fr 1fr 1fr 1fr 1.2fr 50px" : "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px",
                                  O = o.map((h, N) => {
                                    const De = a
                                        .filter((Qe) => Qe.proveedor === h.proveedor)
                                        .reduce((Qe, z) => Qe + z.monto, 0),
                                      Ce = presupuestoEfectivo(h.presupuesto, De),
                                      ie = (Ce || 0) - (h.presupuestoOriginal || 0),
                                      Fe = h.presupuestoOriginal ? (ie / h.presupuestoOriginal) * 100 : 0,
                                      qe = x && D > 0 ? Ce / D : null;
                                    return {
                                      ...h,
                                      presupuesto: Ce,
                                      pagado: De,
                                      resta: Ce - De,
                                      desvio: ie,
                                      desvioPct: Fe,
                                      precioM2: qe,
                                      _idx: N,
                                    };
                                  }),
                                  _ = Fa(t, e.cliente, e.ventaFinal, e.ventaFinalUSD, e.status),
                                  xe = _
                                    ? [
                                        ...O,
                                        { ..._, pagado: 0, resta: _.presupuesto, desvio: 0, desvioPct: 0, _idx: -1 },
                                      ]
                                    : O,
                                  Ie = O.reduce((h, N) => h + N.desvio, 0),
                                  Te = O.reduce((h, N) => h + (N.presupuestoOriginal || 0), 0),
                                  Ge = Te ? (Ie / Te) * 100 : 0,
                                  Ze = g.filter((h) => h.cliente === e.cliente && h.obra === e.obra),
                                  le = Ze.reduce((h, N) => h + (N.importe || 0), 0),
                                  ft = Ze.filter((h) => h.status === "PAGADA").reduce(
                                    (h, N) => h + (N.importe || 0),
                                    0,
                                  ),
                                  to = e.ventaFinal - le;
                                return React.createElement(
                                  React.Fragment,
                                  null,
                                  Qt &&
                                    React.createElement(
                                      "button",
                                      {
                                        onClick: () => {
                                          (lo(false), d("cashflow"));
                                        },
                                        style: { ...smallBtnGhost, marginBottom: 14, marginRight: 8 },
                                      },
                                      React.createElement(ArrowLeft, { size: 14 }),
                                      " Volver a Cashflow",
                                    ),
                                  React.createElement(
                                    "button",
                                    {
                                      onClick: () => {
                                        (lo(false), no(null), ot(false), $t(null), vo(false), ao(null));
                                      },
                                      style: { ...smallBtnGhost, marginBottom: 14 },
                                    },
                                    React.createElement(ArrowLeft, { size: 14 }),
                                    " Volver a ",
                                    se,
                                  ),
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
                                      },
                                    },
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "flex-start",
                                          marginBottom: 6,
                                        },
                                      },
                                      React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              fontFamily: "Georgia, serif",
                                              fontSize: 20,
                                              fontWeight: 700,
                                              color: NAVY,
                                            },
                                          },
                                          e.obra,
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { fontSize: 12.5, color: MUTED, marginTop: 2 } },
                                          e.cliente,
                                          " · ",
                                          e.mes ? e.mes.charAt(0) + e.mes.slice(1).toLowerCase() : "—",
                                          " ",
                                          e.anio || "",
                                        ),
                                      ),
                                      React.createElement(
                                        "div",
                                        { style: { display: "flex", alignItems: "center", gap: 10 } },
                                        React.createElement(StatusBadge, {
                                          status: e.status,
                                          onClick: Rt ? () => Ha(e) : void 0,
                                        }),
                                        Rt &&
                                          React.createElement(
                                            "button",
                                            { onClick: () => tn(true), style: smallBtnGhost },
                                            React.createElement(Pencil, { size: 13 }),
                                            " Editar",
                                          ),
                                        fn &&
                                          React.createElement(
                                            "button",
                                            {
                                              onClick: () => {
                                                const h = g.filter(
                                                    (Ce) => Ce.cliente === e.cliente && Ce.obra === e.obra,
                                                  ).length,
                                                  N = (Tn[e.cliente] || []).length <= 1,
                                                  De =
                                                    '¿Seguro que querés BORRAR la obra "' +
                                                    e.obra +
                                                    '" de ' +
                                                    e.cliente +
                                                    `?

Se borran también todos sus proveedores, pagos y adicionales` +
                                                    (e.cliente === "WU"
                                                      ? ", órdenes de compra y sub obras de Costos"
                                                      : "") +
                                                    "." +
                                                    (h > 0
                                                      ? " Las " +
                                                        h +
                                                        " factura(s) de esta obra se mueven a la Papelera de facturas (se pueden recuperar desde ahí)."
                                                      : "") +
                                                    (N
                                                      ? `

Es la única obra de ` +
                                                        e.cliente +
                                                        ": el cliente también va a desaparecer de la lista."
                                                      : "") +
                                                    `

Esta acción se puede deshacer con el botón "Deshacer" del menú (salvo las facturas, que quedan en la Papelera).`;
                                                window.confirm(De) &&
                                                  (si(e.cliente, e.obra),
                                                  lo(false),
                                                  no(null),
                                                  ot(false),
                                                  $t(null),
                                                  vo(false),
                                                  ao(null),
                                                  N && be(null));
                                              },
                                              style: { ...smallBtnGhost, color: RED, borderColor: RED },
                                            },
                                            React.createElement(Trash2, { size: 13 }),
                                            " Eliminar obra",
                                          ),
                                      ),
                                    ),
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          display: "grid",
                                          gridTemplateColumns: e.cliente === "WU" ? "repeat(5, 1fr)" : "repeat(4, 1fr)",
                                          columnGap: 10,
                                          gap: 12,
                                          marginTop: 14,
                                        },
                                      },
                                      React.createElement(MiniStat, {
                                        label: e.totalSubobras > 0 ? "VENTA ORIGINAL (AUTO)" : "VENTA ORIGINAL",
                                        value: fmt(e.ventaOriginal, e.tc),
                                      }),
                                      React.createElement(
                                        "div",
                                        { onClick: () => ot((h) => !h), style: { cursor: "pointer" } },
                                        React.createElement(MiniStat, {
                                          label: "ADICIONALES " + (re ? "▲" : "▼"),
                                          value: fmt(e.totalAdicionales),
                                          color: e.totalAdicionales > 0 ? GOLD : MUTED,
                                        }),
                                      ),
                                      e.cliente === "WU" &&
                                        React.createElement(
                                          "div",
                                          { onClick: () => vo((h) => !h), style: { cursor: "pointer" } },
                                          React.createElement(MiniStat, {
                                            label: "ÓRDENES DE COMPRA " + (eo ? "▲" : "▼"),
                                            value: fmt(e.totalSubobras),
                                            color: e.totalSubobras > 0 ? GOLD : MUTED,
                                          }),
                                        ),
                                      React.createElement(MiniStat, {
                                        label: "VENTA TOTAL",
                                        value: fmtSmart(e.ventaFinal, e.ventaFinalUSD),
                                        color: NAVY,
                                      }),
                                      React.createElement(MiniStat, {
                                        label: "COSTO INICIAL",
                                        value: fmt(e.costoInicial, e.tc),
                                      }),
                                    ),
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          display: "grid",
                                          gridTemplateColumns: "repeat(4, 1fr)",
                                          columnGap: 10,
                                          gap: 12,
                                          marginTop: 12,
                                        },
                                      },
                                      React.createElement(MiniStat, {
                                        label: "COSTO REAL",
                                        value: fmtSmart(e.costoFinal, e.costoFinalUSD),
                                      }),
                                      React.createElement(MiniStat, {
                                        label: "MB INICIAL / MARKUP",
                                        value: pctMkSmart(e.mbInicial, e.mbInicialUSD),
                                        color:
                                          valSmart(e.mbInicial, e.mbInicialUSD) < 15
                                            ? RED
                                            : valSmart(e.mbInicial, e.mbInicialUSD) >= 30
                                              ? GREEN
                                              : NAVY,
                                      }),
                                      React.createElement(MiniStat, {
                                        label: "MB FINAL / MARKUP",
                                        value: pctMkSmart(e.mbFinal, e.mbFinalUSD),
                                        color:
                                          valSmart(e.mbFinal, e.mbFinalUSD) < 15
                                            ? RED
                                            : valSmart(e.mbFinal, e.mbFinalUSD) >= 30
                                              ? GREEN
                                              : NAVY,
                                      }),
                                      React.createElement(MiniStat, {
                                        label: "DESVÍO TOTAL vs. PRESUPUESTO",
                                        value: fmt(Ie) + " (" + (Ge >= 0 ? "+" : "") + Ge.toFixed(1) + "%)",
                                        color: Ie > 0 ? RED : Ie < 0 ? GREEN : MUTED,
                                      }),
                                    ),
                                    React.createElement(
                                      "div",
                                      {
                                        style: {
                                          display: "grid",
                                          gridTemplateColumns: x ? "repeat(5, 1fr)" : "repeat(4, 1fr)",
                                          columnGap: 10,
                                          gap: 12,
                                          marginTop: 12,
                                          paddingTop: 12,
                                          borderTop: "1px solid " + BORDER,
                                        },
                                      },
                                      React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              fontSize: 10,
                                              fontWeight: 700,
                                              color: MUTED,
                                              marginBottom: 4,
                                              letterSpacing: 0.4,
                                              textTransform: "uppercase",
                                            },
                                          },
                                          "DÍAS DE OBRA",
                                        ),
                                        Rt
                                          ? React.createElement("input", {
                                              type: "number",
                                              placeholder: "—",
                                              style: {
                                                ...inputStyle,
                                                width: "100%",
                                                maxWidth: 110,
                                                boxSizing: "border-box",
                                                fontFamily: "Georgia, serif",
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: NAVY,
                                              },
                                              value: e.diasObra ?? "",
                                              onChange: (h) => Nn(t, "diasObra", h.target.value),
                                              onBlur: (h) => {
                                                h.target.value !== "" &&
                                                  _t(
                                                    "Días de obra de " +
                                                      e.cliente +
                                                      " - " +
                                                      e.obra +
                                                      ": " +
                                                      h.target.value,
                                                  );
                                              },
                                            })
                                          : React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  fontFamily: "Georgia, serif",
                                                  fontSize: 17,
                                                  fontWeight: 700,
                                                  color: NAVY,
                                                },
                                              },
                                              e.diasObra || "—",
                                            ),
                                      ),
                                      x &&
                                        React.createElement(
                                          "div",
                                          null,
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                fontSize: 10,
                                                fontWeight: 700,
                                                color: MUTED,
                                                marginBottom: 4,
                                                letterSpacing: 0.4,
                                                textTransform: "uppercase",
                                              },
                                            },
                                            "M2",
                                          ),
                                          Rt
                                            ? React.createElement("input", {
                                                type: "number",
                                                placeholder: "—",
                                                style: {
                                                  ...inputStyle,
                                                  width: "100%",
                                                  maxWidth: 110,
                                                  boxSizing: "border-box",
                                                  fontFamily: "Georgia, serif",
                                                  fontSize: 15,
                                                  fontWeight: 700,
                                                  color: NAVY,
                                                },
                                                value: e.m2 ?? "",
                                                onChange: (h) => Nn(t, "m2", h.target.value),
                                                onBlur: (h) => {
                                                  h.target.value !== "" &&
                                                    _t("M2 de " + e.cliente + " - " + e.obra + ": " + h.target.value);
                                                },
                                              })
                                            : React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    fontFamily: "Georgia, serif",
                                                    fontSize: 17,
                                                    fontWeight: 700,
                                                    color: NAVY,
                                                  },
                                                },
                                                e.m2 || "—",
                                              ),
                                        ),
                                      React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              fontSize: 10,
                                              fontWeight: 700,
                                              color: MUTED,
                                              marginBottom: 4,
                                              letterSpacing: 0.4,
                                              textTransform: "uppercase",
                                            },
                                          },
                                          "PM",
                                        ),
                                        React.createElement(CascadingSelect, {
                                          value: e.pm || "",
                                          options: K,
                                          disabled: !Rt,
                                          emptyLabel: "Elegí un PM",
                                          newLabel: "+ Agregar nuevo PM",
                                          style: {
                                            ...inputStyle,
                                            width: "100%",
                                            boxSizing: "border-box",
                                            fontFamily: "Georgia, serif",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: NAVY,
                                          },
                                          onCommit: (h) => {
                                            const N = h.trim().toUpperCase();
                                            (de((De) => (De.includes(N) ? De : [...De, N].sort())),
                                              Nn(t, "pm", N),
                                              _t("Asignó PM " + N + " a " + e.cliente + " - " + e.obra));
                                          },
                                        }),
                                      ),
                                      React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              fontSize: 10,
                                              fontWeight: 700,
                                              color: MUTED,
                                              marginBottom: 4,
                                              letterSpacing: 0.4,
                                              textTransform: "uppercase",
                                            },
                                          },
                                          "DDO",
                                        ),
                                        React.createElement(CascadingSelect, {
                                          value: e.ddo || "",
                                          options: Bt,
                                          disabled: !Rt,
                                          emptyLabel: "Elegí un DDO",
                                          newLabel: "+ Agregar nuevo DDO",
                                          style: {
                                            ...inputStyle,
                                            width: "100%",
                                            boxSizing: "border-box",
                                            fontFamily: "Georgia, serif",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: NAVY,
                                          },
                                          onCommit: (h) => {
                                            const N = h.trim().toUpperCase();
                                            (Ft((De) => (De.includes(N) ? De : [...De, N].sort())),
                                              Nn(t, "ddo", N),
                                              _t("Asignó DDO " + N + " a " + e.cliente + " - " + e.obra));
                                          },
                                        }),
                                      ),
                                      React.createElement("div", null),
                                    ),
                                    e.cliente === "WU" &&
                                      eo &&
                                      (() => {
                                        const h = Pe[t] || [],
                                          N = qo,
                                          De = Z[t] || [],
                                          adicLista = adicionalesPorOC(De, h.map((ie) => ie.ordenCompra)),
                                          adicUsadosLista = new Set(),
                                          Ce = h.map((ie, Fe) => {
                                            const qe = (ie.ordenCompra || "").trim(),
                                              Qe = qe
                                                ? De.map((yt, uo) => ({ ...yt, _idx: uo })).filter((yt) =>
                                                    ordenCompraIncluye(yt.ordenCompra, qe),
                                                  )
                                                : [],
                                              z = Qe.map((yt) => {
                                                const uo = subCostoKey(t, yt.id),
                                                  Xo = ee[uo] || [],
                                                  He = ne[uo] || [],
                                                  Je = Xo.reduce(
                                                    (Co, $) =>
                                                      Co +
                                                      presupuestoEfectivo(
                                                        $.presupuesto,
                                                        pagadoDeProveedor(He, $.proveedor),
                                                      ),
                                                    0,
                                                  ),
                                                  bt = (yt.adicionales || []).reduce((Co, $) => Co + ($.monto || 0), 0),
                                                  Et = montoDeSubCostoParaOC(yt, qe) + bt,
                                                  Po = Et ? ((Et - Je) / Et) * 100 : 0;
                                                return {
                                                  sc: yt,
                                                  scCosto: Je,
                                                  scAdicionalTotal: bt,
                                                  scVentaEfectiva: Et,
                                                  scMB: Po,
                                                };
                                              }),
                                              he = z.reduce((yt, uo) => yt + uo.scVentaEfectiva, 0),
                                              Se = z.reduce((yt, uo) => yt + uo.scCosto, 0),
                                              je = he ? ((he - Se) / he) * 100 : 0,
                                              $e = (
                                                qe
                                                  ? Ze.filter(
                                                      (yt) => normalizarTexto(yt.ordenCompra) === normalizarTexto(qe),
                                                    )
                                                  : []
                                              ).reduce((yt, uo) => yt + (uo.importe || 0), 0),
                                              adicRow = !adicUsadosLista.has(normOC(qe)) && adicLista[normOC(qe)],
                                              adicMonto = adicRow ? adicRow.monto : 0,
                                              tt = (ie.venta || 0) + adicMonto - $e;
                                            return (
                                              adicRow && adicUsadosLista.add(normOC(qe)),
                                              {
                                                s: ie,
                                                i: Fe,
                                                ocTexto: qe,
                                                ligadas: Qe,
                                                ligadasConDatos: z,
                                                mbPromedio: je,
                                                saldoAFacturar: tt,
                                                adicional: adicRow || null,
                                              }
                                            );
                                          }),
                                          ocsAdicionalesNuevas = Object.values(adicLista)
                                            .filter((ie) => !ie.existente)
                                            .map((ie) => {
                                              const Fe = Ze.filter(
                                                (qe) => normalizarTexto(qe.ordenCompra) === normalizarTexto(ie.oc),
                                              ).reduce((qe, Qe) => qe + (Qe.importe || 0), 0);
                                              return { ...ie, saldoAFacturar: ie.monto - Fe };
                                            });
                                        return React.createElement(
                                          "div",
                                          {
                                            style: { marginTop: 14, borderTop: "1px solid " + BORDER, paddingTop: 12 },
                                          },
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 10,
                                                marginBottom: 6,
                                                flexWrap: "wrap",
                                              },
                                            },
                                            React.createElement(
                                              "div",
                                              { style: { fontSize: 11, fontWeight: 700, color: MUTED } },
                                              "ÓRDENES DE COMPRA",
                                            ),
                                            (h.length > 0 || ocsAdicionalesNuevas.length > 0) &&
                                              React.createElement(
                                                "button",
                                                {
                                                  onClick: () => {
                                                    const ie = [];
                                                    Ce.forEach(
                                                      ({
                                                        s: qe,
                                                        ocTexto: Qe,
                                                        ligadasConDatos: z,
                                                        saldoAFacturar: he,
                                                        adicional: adicX,
                                                      }) => {
                                                        if (z.length === 0) {
                                                          ie.push({
                                                            "Orden de Compra": Qe || "—",
                                                            Fecha: qe.fecha || "—",
                                                            "Sub Obra": "—",
                                                            Estado: "—",
                                                            Venta: qe.venta || 0,
                                                            Adicionales: adicX ? adicX.monto : 0,
                                                            MB: "",
                                                            "Saldo a Facturar": he,
                                                          });
                                                          return;
                                                        }
                                                        const Se = z.reduce((mt, $e) => mt + $e.scVentaEfectiva, 0),
                                                          je = (qe.venta || 0) + (adicX ? adicX.monto : 0) - he;
                                                        z.forEach(
                                                          ({
                                                            sc: mt,
                                                            scAdicionalTotal: $e,
                                                            scMB: tt,
                                                            scVentaEfectiva: yt,
                                                          }) => {
                                                            const uo = Se > 0 ? je * (yt / Se) : 0;
                                                            ie.push({
                                                              "Orden de Compra": Qe || "—",
                                                              Fecha: qe.fecha || "—",
                                                              "Sub Obra": mt.nombre,
                                                              Estado:
                                                                mt.status === "FINALIZADA"
                                                                  ? "Finalizada"
                                                                  : "En proceso",
                                                              Venta: mt.venta || 0,
                                                              Adicionales: $e,
                                                              MB: Number(tt.toFixed(1)),
                                                              Markup: markupDeMb(tt) == null ? "" : Number(markupDeMb(tt).toFixed(1)),
                                                              "Saldo a Facturar": Math.round(yt - uo),
                                                            });
                                                          },
                                                        );
                                                      },
                                                    );
                                                    ocsAdicionalesNuevas.forEach((qe) =>
                                                      ie.push({
                                                        "Orden de Compra": qe.oc,
                                                        Fecha: "—",
                                                        "Sub Obra": "Adicional de " + qe.subObras.join(", "),
                                                        Estado: "—",
                                                        Venta: qe.monto,
                                                        Adicionales: 0,
                                                        MB: "",
                                                        "Saldo a Facturar": qe.saldoAFacturar,
                                                      }),
                                                    );
                                                    const Fe = XLSX.utils.book_new();
                                                    (XLSX.utils.book_append_sheet(
                                                      Fe,
                                                      XLSX.utils.json_to_sheet(ie),
                                                      "Ordenes de Compra",
                                                    ),
                                                      descargarLibroXlsx(
                                                        Fe,
                                                        "ordenes_de_compra_" + t.replace(/[^a-z0-9]+/gi, "_") + ".xlsx",
                                                      ));
                                                  },
                                                  style: { ...smallBtnGhost, color: MUTED },
                                                },
                                                React.createElement(Download, { size: 13 }),
                                                " Descargar",
                                              ),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { fontSize: 11.5, color: MUTED, marginBottom: 8 } },
                                            'Cada orden de compra suma a la Venta Total y, según su fecha, se refleja en ese mes puntual en el gráfico de "Venta Consolidada por Mes" (no en el mes de la obra). El Saldo a Facturar resta las facturas de Facturación que tengan asignada esta misma Orden de Compra. Un adicional de sub obra cuya descripción es un número de orden de compra se suma a esa orden de compra (Venta y Saldo a Facturar); si el número es nuevo, aparece como una línea aparte con MB "—", porque su margen ya se cuenta en la orden de compra de la sub obra.',
                                          ),
                                          h.length === 0 && ocsAdicionalesNuevas.length === 0
                                            ? React.createElement(
                                                "div",
                                                { style: { fontSize: 12.5, color: MUTED, marginBottom: 8 } },
                                                "Todavía no cargaste órdenes de compra para esta obra.",
                                              )
                                            : React.createElement(
                                                React.Fragment,
                                                null,
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "grid",
                                                      gridTemplateColumns: "1fr 0.8fr 0.9fr 1.1fr 0.9fr 0.8fr 1.3fr 50px",
                                                      columnGap: 10,
                                                      fontSize: 11,
                                                      fontWeight: 700,
                                                      color: MUTED,
                                                      padding: "4px 8px",
                                                    },
                                                  },
                                                  React.createElement("div", null, "ORDEN DE COMPRA"),
                                                  React.createElement("div", null, "FECHA"),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "VENTA",
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "SALDO A FACTURAR",
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "MB PROMEDIO / MARKUP",
                                                  ),
                                                  React.createElement("div", null, "PDF"),
                                                  React.createElement("div", null),
                                                  React.createElement("div", null),
                                                ),
                                                Ce.map(
                                                  ({
                                                    s: ie,
                                                    i: Fe,
                                                    ocTexto: qe,
                                                    ligadas: Qe,
                                                    ligadasConDatos: z,
                                                    mbPromedio: he,
                                                    saldoAFacturar: Se,
                                                    adicional: adicRow,
                                                  }) =>
                                                    React.createElement(SubobraRow, {
                                                      key: Fe,
                                                      s: ie,
                                                      adicional: adicRow,
                                                      obraKey: t,
                                                      onSave: (je) => fi(t, Fe, je),
                                                      onDelete: () => mi(t, Fe),
                                                      readOnly: !Rt,
                                                      saldoAFacturar: Se,
                                                      mbPromedio: he,
                                                      tieneLigadas: Qe.length > 0,
                                                      ligadasCount: Qe.length,
                                                      onVerSubObras: () =>
                                                        s({
                                                          k: t,
                                                          ocTexto: qe || "(sin número)",
                                                          venta: (ie.venta || 0) + (adicRow ? adicRow.monto : 0),
                                                          saldoAFacturar: Se,
                                                          mbPromedio: he,
                                                          tieneLigadas: Qe.length > 0,
                                                          subObras: z.map((je) => ({
                                                            nombre: je.sc.nombre,
                                                            status: je.sc.status || "EN PROCESO",
                                                            mb: je.scMB,
                                                            idx: je.sc._idx,
                                                          })),
                                                        }),
                                                    }),
                                                ),
                                                ocsAdicionalesNuevas.map((ie) =>
                                                  React.createElement(SubobraRow, {
                                                    key: "adic-" + ie.oc,
                                                    s: { ordenCompra: ie.oc, venta: ie.monto, fecha: "" },
                                                    esAdicionalNuevo: true,
                                                    adicional: ie,
                                                    readOnly: true,
                                                    saldoAFacturar: ie.saldoAFacturar,
                                                    mbPromedio: 0,
                                                    tieneLigadas: false,
                                                  }),
                                                ),
                                              ),
                                          Rt &&
                                            (N
                                              ? React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 6,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                      marginTop: 8,
                                                    },
                                                  },
                                                  React.createElement("input", {
                                                    placeholder: "Orden de compra",
                                                    style: inputStyle,
                                                    onChange: (ie) =>
                                                      ao((Fe) => ({ ...Fe, ordenCompra: ie.target.value })),
                                                  }),
                                                  React.createElement("input", {
                                                    placeholder: "Venta",
                                                    type: "number",
                                                    style: { ...inputStyle, width: 130 },
                                                    onChange: (ie) => ao((Fe) => ({ ...Fe, venta: ie.target.value })),
                                                  }),
                                                  React.createElement("input", {
                                                    placeholder: "Fecha (cualquier formato)",
                                                    style: { ...inputStyle, width: 150 },
                                                    onChange: (ie) => ao((Fe) => ({ ...Fe, fecha: ie.target.value })),
                                                  }),
                                                  React.createElement("input", {
                                                    placeholder: "Observaciones",
                                                    style: { ...inputStyle, width: 200 },
                                                    onChange: (ie) =>
                                                      ao((Fe) => ({ ...Fe, observaciones: ie.target.value })),
                                                  }),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => gi(t, N), style: smallBtnPrimary },
                                                    "Guardar",
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => ao(null), style: smallBtnGhost },
                                                    React.createElement(X, { size: 13 }),
                                                  ),
                                                )
                                              : React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 8,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                      marginTop: 8,
                                                    },
                                                  },
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => ao({ ordenCompra: "" }), style: smallBtnGhost },
                                                    React.createElement(Plus, { size: 13 }),
                                                    " Agregar orden de compra",
                                                  ),
                                                  React.createElement(
                                                    "label",
                                                    { style: smallBtnGhost },
                                                    React.createElement(Upload, { size: 13 }),
                                                    " Importar órdenes de compra (Excel)",
                                                    React.createElement("input", {
                                                      type: "file",
                                                      accept: ".xlsx,.xls,.csv",
                                                      style: { display: "none" },
                                                      onChange: async (ie) => {
                                                        const Fe = ie.target.files[0];
                                                        if (Fe) {
                                                          try {
                                                            const qe = await Fe.arrayBuffer(),
                                                              Qe = XLSX.read(qe, { type: "array" }),
                                                              z = Qe.Sheets[Qe.SheetNames[0]],
                                                              he = XLSX.utils.sheet_to_json(z, { defval: null }),
                                                              Se = ($e, tt) => {
                                                                for (const yt of Object.keys($e))
                                                                  if (tt.includes(yt.toString().trim().toLowerCase()))
                                                                    return $e[yt];
                                                                return null;
                                                              },
                                                              je = he.map(($e) => {
                                                                let tt = Se($e, ["fecha"]);
                                                                if (typeof tt == "number" && XLSX.SSF) {
                                                                  const yt = XLSX.SSF.parse_date_code(tt);
                                                                  tt = yt
                                                                    ? String(yt.d).padStart(2, "0") +
                                                                      "/" +
                                                                      String(yt.m).padStart(2, "0") +
                                                                      "/" +
                                                                      yt.y
                                                                    : String(tt);
                                                                }
                                                                return {
                                                                  ordenCompra: String(
                                                                    Se($e, ["orden de compra", "orden compra", "oc"]) ||
                                                                      "",
                                                                  ).trim(),
                                                                  venta: Number(Se($e, ["venta", "importe"])) || 0,
                                                                  fecha: tt ? String(tt) : null,
                                                                  observaciones: String(
                                                                    Se($e, ["observaciones"]) || "",
                                                                  ).trim(),
                                                                };
                                                              }),
                                                              mt = bi(t, je);
                                                            zo(mt + " orden(es) de compra cargada(s).");
                                                          } catch {
                                                            zo("No se pudo leer el archivo.");
                                                          }
                                                          ie.target.value = "";
                                                        }
                                                      },
                                                    }),
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => {
                                                        const ie = XLSX.utils.aoa_to_sheet([
                                                            ["Orden de Compra", "Venta", "Fecha"],
                                                            ["OC-1234", 5e6, "15/03/2026"],
                                                          ]),
                                                          Fe = XLSX.utils.book_new();
                                                        (XLSX.utils.book_append_sheet(Fe, ie, "Ordenes de compra"),
                                                          descargarLibroXlsx(Fe, "plantilla_ordenes_compra.xlsx"));
                                                      },
                                                      style: { ...smallBtnGhost, color: MUTED },
                                                    },
                                                    "Plantilla de ejemplo",
                                                  ),
                                                  React.createElement(
                                                    "label",
                                                    { style: smallBtnGhost },
                                                    React.createElement(Upload, { size: 13 }),
                                                    " Cargar orden de compra con PDF",
                                                    React.createElement("input", {
                                                      type: "file",
                                                      accept: "application/pdf",
                                                      style: { display: "none" },
                                                      onChange: async (ie) => {
                                                        const Fe = ie.target.files[0];
                                                        if (((ie.target.value = ""), !!Fe)) {
                                                          OC_PDF_ST.pendientes[t] = Fe;
                                                          Uo((qe) => ({ ...qe, [t]: { status: "loading" } }));
                                                          try {
                                                            const {
                                                              ocNumero: qe,
                                                              total: Qe,
                                                              fechaPedido: z,
                                                              lineas: he,
                                                              sumaLineas: Se,
                                                            } = await extraerOrdenDeCompraDePdf(Fe);
                                                            if (!he.length)
                                                              throw new Error("No se encontraron líneas en el PDF.");
                                                            const je = Z[t] || [],
                                                              mt = he.map(($e) => {
                                                                let tt = null;
                                                                if ($e.nombreExtraido) {
                                                                  const yt = je.map((Xo) => Xo.nombre),
                                                                    uo = resolverConCoincidencia(
                                                                      $e.nombreExtraido,
                                                                      yt,
                                                                      (Ct || {}).subObra,
                                                                    );
                                                                  if (uo.valor) {
                                                                    const Xo = je.findIndex(
                                                                      (He) =>
                                                                        normalizarTexto(He.nombre) ===
                                                                        normalizarTexto(uo.valor),
                                                                    );
                                                                    Xo >= 0 && (tt = Xo);
                                                                  }
                                                                  if (tt === null) {
                                                                    const Xo = je.findIndex((He) =>
                                                                      nombresSubobraCoinciden(
                                                                        He.nombre,
                                                                        $e.nombreExtraido,
                                                                      ),
                                                                    );
                                                                    Xo >= 0 && (tt = Xo);
                                                                  }
                                                                }
                                                                return {
                                                                  descripcion: $e.descripcion,
                                                                  monto: $e.monto,
                                                                  nombreExtraido: $e.nombreExtraido,
                                                                  target: tt !== null ? String(tt) : "nueva",
                                                                  nombreNueva:
                                                                    tt !== null
                                                                      ? je[tt].nombre
                                                                      : $e.nombreExtraido || "VARIOS",
                                                                };
                                                              });
                                                            Uo(($e) => ({
                                                              ...$e,
                                                              [t]: {
                                                                status: "review",
                                                                ocNumero: qe || "",
                                                                total: Qe,
                                                                sumaLineas: Se,
                                                                lineas: mt,
                                                                fechaPedido: z || "",
                                                              },
                                                            }));
                                                          } catch (qe) {
                                                            Uo((Qe) => ({
                                                              ...Qe,
                                                              [t]: {
                                                                status: "error",
                                                                error:
                                                                  "No se pudo leer el PDF (" +
                                                                  (qe.message || "error desconocido") +
                                                                  "). Podés cargar la orden a mano.",
                                                              },
                                                            }));
                                                          }
                                                        }
                                                      },
                                                    }),
                                                  ),
                                                )),
                                          Fo &&
                                            React.createElement(
                                              "div",
                                              { style: { fontSize: 11.5, color: MUTED, marginTop: 6 } },
                                              Fo,
                                            ),
                                          Zt[t] &&
                                            Zt[t].status === "loading" &&
                                            React.createElement(
                                              "div",
                                              { style: { fontSize: 12.5, color: MUTED, marginTop: 10 } },
                                              "Leyendo el PDF...",
                                            ),
                                          Zt[t] &&
                                            Zt[t].status === "error" &&
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 8,
                                                  fontSize: 12.5,
                                                  color: RED,
                                                  marginTop: 10,
                                                },
                                              },
                                              Zt[t].error,
                                              React.createElement(
                                                "button",
                                                {
                                                  onClick: () => Uo((ie) => ({ ...ie, [t]: null })),
                                                  style: { ...smallBtnGhost, padding: "3px 8px" },
                                                },
                                                React.createElement(X, { size: 12 }),
                                              ),
                                            ),
                                          Zt[t] &&
                                            Zt[t].status === "review" &&
                                            (() => {
                                              const ie = Zt[t],
                                                Fe = Z[t] || [],
                                                qe = (he, Se) =>
                                                  Uo((je) => ({
                                                    ...je,
                                                    [t]: {
                                                      ...je[t],
                                                      lineas: je[t].lineas.map((mt, $e) =>
                                                        $e !== he ? mt : { ...mt, ...Se },
                                                      ),
                                                    },
                                                  })),
                                                Qe = ie.lineas.reduce((he, Se) => he + (Number(Se.monto) || 0), 0),
                                                z = ie.total !== null && Math.abs(Qe - ie.total) < 1;
                                              return React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    marginTop: 12,
                                                    border: "1px solid " + BORDER,
                                                    borderRadius: 10,
                                                    padding: 12,
                                                    background: "#FAF8F3",
                                                  },
                                                },
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      fontSize: 12,
                                                      fontWeight: 700,
                                                      color: NAVY,
                                                      marginBottom: 8,
                                                    },
                                                  },
                                                  "Revisá lo que se leyó del PDF antes de confirmar",
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 16,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                      marginBottom: 10,
                                                    },
                                                  },
                                                  React.createElement(
                                                    "div",
                                                    { style: { display: "flex", alignItems: "center", gap: 6 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { fontSize: 11.5, color: MUTED } },
                                                      "Orden de compra:",
                                                    ),
                                                    React.createElement("input", {
                                                      value: ie.ocNumero,
                                                      onChange: (he) =>
                                                        Uo((Se) => ({
                                                          ...Se,
                                                          [t]: { ...Se[t], ocNumero: he.target.value },
                                                        })),
                                                      style: { ...inputStyle, width: 150 },
                                                    }),
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    { style: { display: "flex", alignItems: "center", gap: 6 } },
                                                    React.createElement(
                                                      "span",
                                                      { style: { fontSize: 11.5, color: MUTED } },
                                                      "Fecha del pedido:",
                                                    ),
                                                    React.createElement("input", {
                                                      value: ie.fechaPedido || "",
                                                      placeholder: "dd/mm/aaaa",
                                                      onChange: (he) =>
                                                        Uo((Se) => ({
                                                          ...Se,
                                                          [t]: { ...Se[t], fechaPedido: he.target.value },
                                                        })),
                                                      style: {
                                                        ...inputStyle,
                                                        width: 100,
                                                        ...(ie.fechaPedido ? {} : { borderColor: RED }),
                                                      },
                                                    }),
                                                    !ie.fechaPedido &&
                                                      React.createElement(
                                                        "span",
                                                        { style: { fontSize: 11, color: RED } },
                                                        "no encontrada en el PDF, completala",
                                                      ),
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    { style: { fontSize: 11.5, color: MUTED } },
                                                    "Total del PDF: ",
                                                    React.createElement(
                                                      "b",
                                                      { style: { color: NAVY } },
                                                      ie.total !== null ? fmt(ie.total) : "no encontrado",
                                                    ),
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    {
                                                      style: {
                                                        fontSize: 11.5,
                                                        color: z ? GREEN : RED,
                                                        fontWeight: 600,
                                                      },
                                                    },
                                                    "Suma de líneas: ",
                                                    fmt(Qe),
                                                    " ",
                                                    ie.total !== null &&
                                                      (z
                                                        ? "✓ coincide con el total"
                                                        : "— no coincide con el total del PDF, revisá los montos"),
                                                  ),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "grid",
                                                      gridTemplateColumns: "2fr 1.6fr 1fr",
                                                      columnGap: 10,
                                                      fontSize: 11,
                                                      fontWeight: 700,
                                                      color: MUTED,
                                                      padding: "4px 8px",
                                                    },
                                                  },
                                                  React.createElement("div", null, "LÍNEA DEL PDF"),
                                                  React.createElement("div", null, "ASIGNAR A"),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "MONTO",
                                                  ),
                                                ),
                                                ie.lineas.map((he, Se) =>
                                                  React.createElement(
                                                    "div",
                                                    {
                                                      key: Se,
                                                      style: {
                                                        display: "grid",
                                                        gridTemplateColumns: "2fr 1.6fr 1fr",
                                                        columnGap: 10,
                                                        fontSize: 12,
                                                        padding: "5px 8px",
                                                        alignItems: "center",
                                                      },
                                                    },
                                                    React.createElement(
                                                      "div",
                                                      { style: { color: MUTED, fontSize: 11 }, title: he.descripcion },
                                                      he.nombreExtraido || "(sin sub obra marcada — VARIOS)",
                                                    ),
                                                    React.createElement(
                                                      "div",
                                                      { style: { display: "flex", gap: 6, alignItems: "center" } },
                                                      React.createElement(
                                                        "select",
                                                        {
                                                          value: he.target,
                                                          onChange: (je) => qe(Se, { target: je.target.value }),
                                                          style: { ...inputStyle, width: "100%" },
                                                        },
                                                        React.createElement(
                                                          "option",
                                                          { value: "nueva" },
                                                          "— Nueva sub obra —",
                                                        ),
                                                        Fe.map((je, mt) =>
                                                          React.createElement(
                                                            "option",
                                                            { key: mt, value: String(mt) },
                                                            je.nombre,
                                                          ),
                                                        ),
                                                      ),
                                                      he.target === "nueva" &&
                                                        React.createElement("input", {
                                                          value: he.nombreNueva,
                                                          onChange: (je) => qe(Se, { nombreNueva: je.target.value }),
                                                          placeholder: "Nombre de la sub obra",
                                                          style: { ...inputStyle, width: 160 },
                                                        }),
                                                    ),
                                                    React.createElement("input", {
                                                      type: "number",
                                                      value: he.monto,
                                                      onChange: (je) => qe(Se, { monto: Number(je.target.value) || 0 }),
                                                      style: { ...inputStyle, width: "100%", textAlign: "right" },
                                                    }),
                                                  ),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { display: "flex", gap: 8, marginTop: 10 } },
                                                  React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => {
                                                        const he = ie.lineas.map((Se) =>
                                                          Se.target === "nueva"
                                                            ? {
                                                                targetIdx: null,
                                                                nombreNueva: (Se.nombreNueva || "VARIOS").toUpperCase(),
                                                                monto: Number(Se.monto) || 0,
                                                              }
                                                            : {
                                                                targetIdx: Number(Se.target),
                                                                monto: Number(Se.monto) || 0,
                                                              },
                                                        );
                                                        (ie.lineas.forEach((Se) => {
                                                          if (!Se.nombreExtraido) return;
                                                          const je =
                                                            Se.target === "nueva"
                                                              ? (Se.nombreNueva || "VARIOS").toUpperCase()
                                                              : (Fe[Number(Se.target)] || {}).nombre;
                                                          je && zr(Se.nombreExtraido, je);
                                                        }),
                                                          ((ocImp) => {
                                                            Br(t, ocImp, ie.total || Qe, he, ie.fechaPedido);
                                                            const archivo = OC_PDF_ST.pendientes[t];
                                                            delete OC_PDF_ST.pendientes[t];
                                                            archivo &&
                                                              ocPdfGuardar(t, ocImp, archivo).catch((e) =>
                                                                window.alert(
                                                                  "La orden de compra se importó, pero no se pudo guardar el PDF: " +
                                                                    ((e && e.message) || e),
                                                                ),
                                                              );
                                                          })(ie.ocNumero || "PDF-" + Date.now()),
                                                          Uo((Se) => ({ ...Se, [t]: null })),
                                                          zo(
                                                            "Orden de compra importada desde PDF: " +
                                                              he.length +
                                                              " sub obra(s) actualizada(s).",
                                                          ));
                                                      },
                                                      style: smallBtnPrimary,
                                                    },
                                                    "Confirmar e importar",
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => Uo((he) => ({ ...he, [t]: null })),
                                                      style: smallBtnGhost,
                                                    },
                                                    "Cancelar",
                                                  ),
                                                ),
                                              );
                                            })(),
                                        );
                                      })(),
                                    re &&
                                      (() => {
                                        const h = P[t] || [],
                                          N = Ht;
                                        return React.createElement(
                                          "div",
                                          {
                                            style: { marginTop: 14, borderTop: "1px solid " + BORDER, paddingTop: 12 },
                                          },
                                          React.createElement(
                                            "div",
                                            { style: { fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 } },
                                            "ADICIONALES",
                                          ),
                                          h.length === 0
                                            ? React.createElement(
                                                "div",
                                                { style: { fontSize: 12.5, color: MUTED, marginBottom: 8 } },
                                                "Todavía no cargaste adicionales para esta obra.",
                                              )
                                            : React.createElement(
                                                React.Fragment,
                                                null,
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "grid",
                                                      gridTemplateColumns: "2fr 1fr 50px",
                                                      columnGap: 10,
                                                      fontSize: 11,
                                                      fontWeight: 700,
                                                      color: MUTED,
                                                      padding: "4px 8px",
                                                    },
                                                  },
                                                  React.createElement("div", null, "CONCEPTO"),
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    "MONTO",
                                                  ),
                                                  React.createElement("div", null),
                                                ),
                                                h.map((De, Ce) =>
                                                  React.createElement(AdicionalRow, {
                                                    key: Ce,
                                                    a: De,
                                                    onSave: (ie) => ui(t, Ce, ie),
                                                    onDelete: () => pi(t, Ce),
                                                    readOnly: !Rt,
                                                  }),
                                                ),
                                              ),
                                          e.cliente === "WU"
                                            ? React.createElement(
                                                "div",
                                                { style: { fontSize: 11.5, color: MUTED, marginTop: 8 } },
                                                "En WU, los adicionales nuevos se cargan dentro de cada sub obra (solapa Costos, más abajo) — los de acá arriba quedan como quedaron cargados antes.",
                                              )
                                            : Rt &&
                                                (N
                                                  ? React.createElement(
                                                      "div",
                                                      {
                                                        style: {
                                                          display: "flex",
                                                          gap: 6,
                                                          alignItems: "center",
                                                          flexWrap: "wrap",
                                                          marginTop: 8,
                                                        },
                                                      },
                                                      React.createElement("input", {
                                                        placeholder: "Concepto",
                                                        style: inputStyle,
                                                        onChange: (De) =>
                                                          $t((Ce) => ({ ...Ce, concepto: De.target.value })),
                                                      }),
                                                      React.createElement("input", {
                                                        placeholder: "Monto",
                                                        type: "number",
                                                        style: { ...inputStyle, width: 130 },
                                                        onChange: (De) =>
                                                          $t((Ce) => ({ ...Ce, monto: De.target.value })),
                                                      }),
                                                      React.createElement(
                                                        "button",
                                                        { onClick: () => ci(t, N), style: smallBtnPrimary },
                                                        "Guardar",
                                                      ),
                                                      React.createElement(
                                                        "button",
                                                        { onClick: () => $t(null), style: smallBtnGhost },
                                                        React.createElement(X, { size: 13 }),
                                                      ),
                                                    )
                                                  : React.createElement(
                                                      "button",
                                                      {
                                                        onClick: () => $t({ concepto: "" }),
                                                        style: { ...smallBtnGhost, marginTop: 8 },
                                                      },
                                                      React.createElement(Plus, { size: 13 }),
                                                      " Agregar adicional",
                                                    )),
                                        );
                                      })(),
                                  ),
                                  Wt &&
                                    React.createElement(EditObraForm, {
                                      obra: e,
                                      onCancel: () => tn(false),
                                      onSave: (h) => ii(t, h),
                                    }),
                                  React.createElement(
                                    "div",
                                    {
                                      style: {
                                        display: "flex",
                                        background: "#EDEAE1",
                                        borderRadius: 8,
                                        padding: 3,
                                        marginBottom: 16,
                                        width: "fit-content",
                                      },
                                    },
                                    ["facturas", "costos"].map((h) =>
                                      React.createElement(
                                        "button",
                                        {
                                          key: h,
                                          onClick: () => ae(h),
                                          style: {
                                            border: "none",
                                            padding: "8px 16px",
                                            borderRadius: 6,
                                            fontSize: 13,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            background: Kt === h ? "#fff" : "transparent",
                                            color: Kt === h ? NAVY : MUTED,
                                            boxShadow: Kt === h ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                                          },
                                        },
                                        h === "facturas" ? "Facturación" : "Costos",
                                      ),
                                    ),
                                  ),
                                  Kt === "facturas"
                                    ? React.createElement(
                                        React.Fragment,
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              display: "grid",
                                              gridTemplateColumns: "repeat(3, 1fr)",
                                              columnGap: 10,
                                              gap: 14,
                                              marginBottom: 16,
                                            },
                                          },
                                          React.createElement(SummaryCard, {
                                            label: "FACTURADO",
                                            value: fmt(le),
                                            color: NAVY,
                                          }),
                                          React.createElement(SummaryCard, {
                                            label: "PAGADO",
                                            value: fmt(ft),
                                            color: GREEN,
                                          }),
                                          React.createElement(SummaryCard, {
                                            label: "ADEUDADO (VENTA - FACTURADO)",
                                            value: fmt(to),
                                            color: RED,
                                          }),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { display: "flex", gap: 8, marginBottom: 12 } },
                                          Rt &&
                                            React.createElement(
                                              "button",
                                              { onClick: () => B({ status: "ADEUDA" }), style: smallBtnPrimary },
                                              React.createElement(Plus, { size: 13, style: { verticalAlign: "-2px" } }),
                                              " Cargar factura",
                                            ),
                                          fn &&
                                            to > 1 &&
                                            React.createElement(
                                              "button",
                                              { onClick: () => Oi(e), style: smallBtnGhost },
                                              "Marcar 100% facturado y cobrado",
                                            ),
                                          React.createElement(
                                            "button",
                                            { onClick: () => Ii(e), style: smallBtnGhost },
                                            "Descargar información de la obra",
                                          ),
                                        ),
                                        Lo &&
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                background: "#fff",
                                                border: "1px solid " + BORDER,
                                                borderRadius: 12,
                                                boxShadow: CARD_SHADOW,
                                                padding: 16,
                                                marginBottom: 14,
                                                display: "flex",
                                                gap: 8,
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                              },
                                            },
                                            React.createElement("input", {
                                              placeholder: "Concepto",
                                              style: inputStyle,
                                              onChange: (h) => B((N) => ({ ...N, concepto: h.target.value })),
                                            }),
                                            React.createElement("input", {
                                              placeholder: "Tipo (FC, S/F...)",
                                              style: { ...inputStyle, width: 100 },
                                              onChange: (h) => B((N) => ({ ...N, tipo: h.target.value })),
                                            }),
                                            React.createElement("input", {
                                              placeholder: "N°",
                                              style: { ...inputStyle, width: 80 },
                                              onChange: (h) => B((N) => ({ ...N, nro: h.target.value })),
                                            }),
                                            e.cliente === "WU" &&
                                              React.createElement("input", {
                                                placeholder: "Orden de Compra",
                                                list: "ocs-sugeridas-" + t,
                                                style: { ...inputStyle, width: 140 },
                                                onChange: (h) => B((N) => ({ ...N, ordenCompra: h.target.value })),
                                              }),
                                            React.createElement("input", {
                                              placeholder: "Fecha emisión (dd/mm/aaaa)",
                                              style: { ...inputStyle, width: 150 },
                                              value: Lo.fecha || "",
                                              onChange: (h) => B((N) => ({ ...N, fecha: h.target.value })),
                                              onBlur: (h) =>
                                                B((N) => ({ ...N, fecha: normalizarFecha(h.target.value) })),
                                            }),
                                            React.createElement(
                                              "select",
                                              {
                                                style: { ...selectStyle, width: 120 },
                                                value: Lo.status,
                                                onChange: (h) => B((N) => ({ ...N, status: h.target.value })),
                                              },
                                              React.createElement("option", { value: "ADEUDA" }, "Adeuda"),
                                              React.createElement("option", { value: "PAGADA" }, "Pagada"),
                                            ),
                                            React.createElement("input", {
                                              placeholder: "Importe",
                                              type: "number",
                                              style: { ...inputStyle, width: 110 },
                                              onChange: (h) => B((N) => ({ ...N, importe: h.target.value })),
                                            }),
                                            React.createElement("input", {
                                              placeholder: "Fecha de pago",
                                              style: { ...inputStyle, width: 130 },
                                              onChange: (h) => B((N) => ({ ...N, fechaPago: h.target.value })),
                                            }),
                                            React.createElement("input", {
                                              placeholder: "Forma de pago",
                                              style: { ...inputStyle, width: 130 },
                                              onChange: (h) => B((N) => ({ ...N, forma: h.target.value })),
                                            }),
                                            React.createElement(
                                              "label",
                                              { style: smallBtnGhost },
                                              React.createElement(Paperclip, { size: 13 }),
                                              " ",
                                              Lo.pdfName || "Adjuntar PDF",
                                              React.createElement("input", {
                                                type: "file",
                                                accept: "application/pdf",
                                                style: { display: "none" },
                                                onChange: async (h) => {
                                                  const N = h.target.files[0];
                                                  if (!N) return;
                                                  if (N.size > PDF_MAX_BYTES) {
                                                    alert(
                                                      "El PDF pesa demasiado (máx. 180 KB). Comprimilo o subilo a Drive y pegá el link en el concepto.",
                                                    );
                                                    return;
                                                  }
                                                  const De = await vi(N);
                                                  B((Ce) => ({ ...Ce, pdfData: De, pdfName: N.name }));
                                                },
                                              }),
                                            ),
                                            Lo.pdfName &&
                                              React.createElement(
                                                "button",
                                                {
                                                  onClick: () => B((h) => ({ ...h, pdfData: null, pdfName: null })),
                                                  title: "Quitar PDF adjunto",
                                                  style: {
                                                    border: "none",
                                                    background: "none",
                                                    cursor: "pointer",
                                                    color: RED,
                                                    display: "flex",
                                                  },
                                                },
                                                React.createElement(Trash2, { size: 13 }),
                                              ),
                                            React.createElement(
                                              "button",
                                              {
                                                onClick: () => {
                                                  (Yr(e.cliente, e.obra, Lo), B(null));
                                                },
                                                style: smallBtnPrimary,
                                              },
                                              "Guardar factura",
                                            ),
                                            React.createElement(
                                              "button",
                                              { onClick: () => B(null), style: smallBtnGhost },
                                              React.createElement(X, { size: 13 }),
                                            ),
                                          ),
                                        e.cliente === "WU" &&
                                          React.createElement(
                                            "datalist",
                                            { id: "ocs-sugeridas-" + t },
                                            Array.from(
                                              new Set(
                                                [
                                                  ...(Pe[t] || []).map((h) => (h.ordenCompra || "").trim()),
                                                  ...Object.keys(
                                                    adicionalesPorOC(
                                                      Z[t],
                                                      (Pe[t] || []).map((h) => h.ordenCompra),
                                                    ),
                                                  ),
                                                ].filter(Boolean),
                                              ),
                                            ).map((h) => React.createElement("option", { key: h, value: h })),
                                          ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: { display: "flex", gap: 10, marginBottom: 10, alignItems: "center" },
                                          },
                                          React.createElement(
                                            "select",
                                            {
                                              style: selectStyle,
                                              value: Yo[t] || "TODAS",
                                              onChange: (h) => yo((N) => ({ ...N, [t]: h.target.value })),
                                            },
                                            React.createElement("option", { value: "TODAS" }, "Todos los estados"),
                                            React.createElement("option", { value: "PAGADA" }, "Pagada"),
                                            React.createElement("option", { value: "ADEUDA" }, "Adeuda"),
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
                                                display: "grid",
                                                gridTemplateColumns:
                                                  e.cliente === "WU"
                                                    ? "1.5fr 0.7fr 0.8fr 1fr 1fr 0.9fr 1.1fr 0.9fr 0.7fr 50px"
                                                    : "1.8fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.7fr 50px",
                                                columnGap: 10,
                                                padding: "10px 16px",
                                                fontSize: 11,
                                                fontWeight: 700,
                                                background: "#EFEDE7",
                                                borderBottom: "1px solid " + BORDER,
                                              },
                                            },
                                            React.createElement(SortHeader, {
                                              label: "CONCEPTO",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "concepto",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "TIPO",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "tipo",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "N°",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "nro",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            e.cliente === "WU" &&
                                              React.createElement(SortHeader, {
                                                label: "ORDEN DE COMPRA",
                                                tableId: "obraFacturas:" + t,
                                                sortKey: "ordenCompra",
                                                sortState: we,
                                                onSort: ue,
                                              }),
                                            React.createElement(SortHeader, {
                                              label: "EMISION",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "fecha",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "ESTADO",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "status",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "IMPORTE",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "importe",
                                              sortState: we,
                                              onSort: ue,
                                              align: "right",
                                            }),
                                            React.createElement(SortHeader, {
                                              label: "PAGO",
                                              tableId: "obraFacturas:" + t,
                                              sortKey: "fechaPago",
                                              sortState: we,
                                              onSort: ue,
                                            }),
                                            React.createElement("div", { style: { textAlign: "center" } }, "PDF"),
                                            React.createElement("div", null),
                                          ),
                                          (() => {
                                            const h = Yo[t] || "TODAS",
                                              N = Ze.filter((De) => h === "TODAS" || De.status === h);
                                            return N.length === 0
                                              ? React.createElement(
                                                  "div",
                                                  { style: { padding: 18, fontSize: 12.5, color: MUTED } },
                                                  "Todavia no se cargaron facturas para esta obra.",
                                                )
                                              : So("obraFacturas:" + t, N).map((De) =>
                                                  React.createElement(FacturaRow, {
                                                    key: De.id,
                                                    f: De,
                                                    onSave: (Ce) => Kr(De.id, Ce),
                                                    onDelete: () => Zr(De.id),
                                                    onView: () =>
                                                      gt({
                                                        name: De.pdfName,
                                                        data: dataUrlToBlobUrl(De.pdfData),
                                                        rawData: De.pdfData,
                                                      }),
                                                    readOnly: !Rt,
                                                    mostrarOC: e.cliente === "WU",
                                                    ocListId: "ocs-sugeridas-" + t,
                                                  }),
                                                );
                                          })(),
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
                                            padding: "18px 20px",
                                          },
                                        },
                                        xe.length === 0
                                          ? React.createElement(
                                              "div",
                                              { style: { fontSize: 12.5, color: MUTED, marginBottom: 10 } },
                                              "Todavia no cargaste el detalle de costos de esta obra.",
                                            )
                                          : React.createElement(
                                              React.Fragment,
                                              null,
                                              (() => {
                                                const h = xe.reduce((N, De) => N + De.presupuesto, 0);
                                                return React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 24,
                                                      alignItems: "center",
                                                      marginBottom: 18,
                                                    },
                                                  },
                                                  React.createElement(
                                                    "div",
                                                    { style: { width: 260, height: 230, flexShrink: 0 } },
                                                    React.createElement(
                                                      ResponsiveContainer,
                                                      null,
                                                      React.createElement(
                                                        PieChart,
                                                        null,
                                                        React.createElement(
                                                          Pie,
                                                          {
                                                            data: xe.map((N) => ({
                                                              name: N.proveedor,
                                                              value: N.presupuesto,
                                                              pct: h ? (N.presupuesto / h) * 100 : 0,
                                                            })),
                                                            dataKey: "value",
                                                            nameKey: "name",
                                                            cx: "50%",
                                                            cy: "50%",
                                                            outerRadius: 78,
                                                          },
                                                          xe.map((N, De) =>
                                                            React.createElement(Cell, {
                                                              key: De,
                                                              fill: PIE_COLORS[De % PIE_COLORS.length],
                                                              opacity:
                                                                !b["proveedores:" + t] ||
                                                                b["proveedores:" + t] === N.proveedor
                                                                  ? 1
                                                                  : 0.3,
                                                            }),
                                                          ),
                                                        ),
                                                        React.createElement(Tooltip, {
                                                          formatter: (N, De, Ce) => [
                                                            fmt(N) + " (" + Ce.payload.pct.toFixed(1) + "%)",
                                                            De,
                                                          ],
                                                        }),
                                                      ),
                                                    ),
                                                  ),
                                                  React.createElement(
                                                    "div",
                                                    null,
                                                    React.createElement(
                                                      "div",
                                                      {
                                                        style: {
                                                          fontSize: 11,
                                                          fontWeight: 700,
                                                          color: MUTED,
                                                          marginBottom: 6,
                                                        },
                                                      },
                                                      "PARTICIPACIÓN POR PROVEEDOR (PRESUPUESTO REAL)",
                                                    ),
                                                    React.createElement(
                                                      "div",
                                                      {
                                                        style: {
                                                          display: "grid",
                                                          gridTemplateColumns: "1fr 1fr",
                                                          columnGap: 10,
                                                          gap: "3px 16px",
                                                          fontSize: 12,
                                                          maxHeight: 130,
                                                          overflowY: "auto",
                                                        },
                                                      },
                                                      xe.map((N, De) => {
                                                        const Ce = b["proveedores:" + t] === N.proveedor,
                                                          ie = h ? (N.presupuesto / h) * 100 : 0;
                                                        return React.createElement(
                                                          "div",
                                                          {
                                                            key: De,
                                                            onMouseEnter: () =>
                                                              R((Fe) => ({ ...Fe, ["proveedores:" + t]: N.proveedor })),
                                                            onMouseLeave: () =>
                                                              R((Fe) => ({ ...Fe, ["proveedores:" + t]: null })),
                                                            style: {
                                                              display: "flex",
                                                              alignItems: "center",
                                                              gap: 6,
                                                              cursor: "default",
                                                              padding: "2px 5px",
                                                              borderRadius: 5,
                                                              background: Ce ? "#F1E9D2" : "transparent",
                                                            },
                                                          },
                                                          React.createElement("span", {
                                                            style: {
                                                              width: 9,
                                                              height: 9,
                                                              borderRadius: 2,
                                                              background: PIE_COLORS[De % PIE_COLORS.length],
                                                              flexShrink: 0,
                                                            },
                                                          }),
                                                          React.createElement(
                                                            "span",
                                                            {
                                                              style: {
                                                                fontWeight: Ce ? 700 : 600,
                                                                color: Ce ? NAVY : TEXT,
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                              },
                                                            },
                                                            N.proveedor,
                                                          ),
                                                          React.createElement(
                                                            "span",
                                                            {
                                                              style: {
                                                                color: MUTED,
                                                                marginLeft: "auto",
                                                                flexShrink: 0,
                                                              },
                                                            },
                                                            ie.toFixed(0),
                                                            "%",
                                                          ),
                                                        );
                                                      }),
                                                    ),
                                                  ),
                                                );
                                              })(),
                                              React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: T,
                                                    columnGap: 10,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    padding: "4px 8px",
                                                  },
                                                },
                                                React.createElement(SortHeader, {
                                                  label: "PROVEEDOR",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "proveedor",
                                                  sortState: we,
                                                  onSort: ue,
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "PRESUPUESTO ORIGINAL",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "presupuestoOriginal",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "PRESUPUESTO REAL",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "presupuesto",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "PAGADO",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "pagado",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "SALDO A PAGAR",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "resta",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                x &&
                                                  React.createElement(SortHeader, {
                                                    label: "$/M2",
                                                    tableId: "proveedores:" + t,
                                                    sortKey: "precioM2",
                                                    sortState: we,
                                                    onSort: ue,
                                                    align: "right",
                                                  }),
                                                React.createElement(SortHeader, {
                                                  label: "DESVÍO",
                                                  tableId: "proveedores:" + t,
                                                  sortKey: "desvioPct",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement("div", null),
                                              ),
                                              So("proveedores:" + t, xe).map((h, N) =>
                                                React.createElement(ProveedorRow, {
                                                  key: h.esVirtualMzLatam ? "mz-latam-virtual" : h._idx,
                                                  p: h,
                                                  index: N,
                                                  onSave: h.esVirtualMzLatam ? () => {} : (De) => yr(t, h._idx, De),
                                                  onDelete: h.esVirtualMzLatam ? () => xr(t) : () => Sr(t, h._idx),
                                                  readOnly: !Rt,
                                                  soloEliminar: h.esVirtualMzLatam,
                                                  m2: x ? D : null,
                                                }),
                                              ),
                                              React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: T.replace("50px", "28px"),
                                                    columnGap: 10,
                                                    fontSize: 12.5,
                                                    fontWeight: 700,
                                                    padding: "8px 8px",
                                                    background: "#F1E9D2",
                                                    borderRadius: 4,
                                                    marginTop: 4,
                                                  },
                                                },
                                                React.createElement("div", { style: { color: NAVY } }, "TOTAL"),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right", color: MUTED } },
                                                  fmt(xe.reduce((h, N) => h + N.presupuestoOriginal, 0)),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right" } },
                                                  fmt(xe.reduce((h, N) => h + N.presupuesto, 0)),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right", color: GREEN } },
                                                  fmt(xe.reduce((h, N) => h + N.pagado, 0)),
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { textAlign: "right", color: RED } },
                                                  fmt(xe.reduce((h, N) => h + N.resta, 0)),
                                                ),
                                                x &&
                                                  React.createElement(
                                                    "div",
                                                    { style: { textAlign: "right" } },
                                                    D > 0 ? fmt(xe.reduce((h, N) => h + N.presupuesto, 0) / D) : "—",
                                                  ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      textAlign: "right",
                                                      color: Ie > 0 ? RED : Ie < 0 ? GREEN : MUTED,
                                                    },
                                                  },
                                                  fmt(Ie),
                                                  " (",
                                                  Ge >= 0 ? "+" : "",
                                                  Ge.toFixed(1),
                                                  "%)",
                                                ),
                                                React.createElement("div", null),
                                              ),
                                            ),
                                        Rt &&
                                          e.cliente !== "WU" &&
                                          React.createElement(
                                            "div",
                                            { style: { display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" } },
                                            u
                                              ? React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 6,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                    },
                                                  },
                                                  React.createElement("input", {
                                                    placeholder: "Proveedor",
                                                    list: "proveedores-sugeridos",
                                                    style: inputStyle,
                                                    onChange: (h) =>
                                                      xo((N) => ({
                                                        ...N,
                                                        [t]: { ...N[t], proveedor: h.target.value },
                                                      })),
                                                  }),
                                                  React.createElement(
                                                    "datalist",
                                                    { id: "proveedores-sugeridos" },
                                                    v.map((h) => React.createElement("option", { key: h, value: h })),
                                                  ),
                                                  React.createElement("input", {
                                                    placeholder: "Presupuesto original",
                                                    type: "number",
                                                    style: { ...inputStyle, width: 130 },
                                                    onChange: (h) =>
                                                      xo((N) => ({
                                                        ...N,
                                                        [t]: { ...N[t], presupuestoOriginal: h.target.value },
                                                      })),
                                                  }),
                                                  React.createElement("input", {
                                                    placeholder: "Presupuesto real",
                                                    type: "number",
                                                    style: { ...inputStyle, width: 120 },
                                                    onChange: (h) =>
                                                      xo((N) => ({
                                                        ...N,
                                                        [t]: { ...N[t], presupuesto: h.target.value },
                                                      })),
                                                  }),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => sa(t, u), style: smallBtnPrimary },
                                                    "Guardar",
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => xo((h) => ({ ...h, [t]: null })),
                                                      style: smallBtnGhost,
                                                    },
                                                    React.createElement(X, { size: 13 }),
                                                  ),
                                                )
                                              : React.createElement(
                                                  "button",
                                                  {
                                                    onClick: () => xo((h) => ({ ...h, [t]: { proveedor: "" } })),
                                                    style: smallBtnGhost,
                                                  },
                                                  React.createElement(Plus, { size: 13 }),
                                                  " Nuevo proveedor",
                                                ),
                                            xe.length > 0 &&
                                              (m
                                                ? React.createElement(
                                                    "div",
                                                    {
                                                      style: {
                                                        display: "flex",
                                                        gap: 6,
                                                        alignItems: "center",
                                                        flexWrap: "wrap",
                                                      },
                                                    },
                                                    React.createElement(ProveedorPicker, {
                                                      value: m.proveedor || "",
                                                      options: xe.map((h) => h.proveedor),
                                                      placeholder: "Proveedor...",
                                                      style: { width: 160 },
                                                      onChange: (h) =>
                                                        st((N) => ({ ...N, [t]: { ...N[t], proveedor: h } })),
                                                    }),
                                                    React.createElement("input", {
                                                      placeholder: "Monto",
                                                      type: "number",
                                                      style: { ...inputStyle, width: 100 },
                                                      onChange: (h) =>
                                                        st((N) => ({ ...N, [t]: { ...N[t], monto: h.target.value } })),
                                                    }),
                                                    React.createElement("input", {
                                                      placeholder: "Fecha (dd/mm/aaaa)",
                                                      style: { ...inputStyle, width: 130 },
                                                      onChange: (h) =>
                                                        st((N) => ({ ...N, [t]: { ...N[t], fecha: h.target.value } })),
                                                    }),
                                                    React.createElement("input", {
                                                      placeholder: "N° FC",
                                                      style: { ...inputStyle, width: 90 },
                                                      onChange: (h) =>
                                                        st((N) => ({ ...N, [t]: { ...N[t], fc: h.target.value } })),
                                                    }),
                                                    React.createElement("input", {
                                                      placeholder: "Observaciones",
                                                      style: { ...inputStyle, width: 160 },
                                                      onChange: (h) =>
                                                        st((N) => ({
                                                          ...N,
                                                          [t]: { ...N[t], observaciones: h.target.value },
                                                        })),
                                                    }),
                                                    React.createElement(
                                                      "button",
                                                      {
                                                        onClick: () => m.proveedor && br(t, m),
                                                        style: smallBtnPrimary,
                                                      },
                                                      "Registrar pago",
                                                    ),
                                                    React.createElement(
                                                      "button",
                                                      {
                                                        onClick: () => st((h) => ({ ...h, [t]: null })),
                                                        style: smallBtnGhost,
                                                      },
                                                      React.createElement(X, { size: 13 }),
                                                    ),
                                                  )
                                                : React.createElement(
                                                    "button",
                                                    {
                                                      onClick: () => st((h) => ({ ...h, [t]: { proveedor: "" } })),
                                                      style: smallBtnGhost,
                                                    },
                                                    React.createElement(Plus, { size: 13 }),
                                                    " Registrar pago semanal",
                                                  )),
                                            React.createElement(
                                              "label",
                                              { style: { ...smallBtnGhost, marginLeft: "auto" } },
                                              React.createElement(Upload, { size: 13 }),
                                              " Importar planilla de costos",
                                              React.createElement("input", {
                                                type: "file",
                                                accept: ".xlsx,.xls,.csv",
                                                style: { display: "none" },
                                                onChange: (h) => hi(t, h.target.files[0]),
                                              }),
                                            ),
                                            React.createElement(
                                              "button",
                                              {
                                                onClick: () => Ya("costos", t),
                                                style: { ...smallBtnGhost, color: MUTED },
                                              },
                                              "Plantilla de ejemplo",
                                            ),
                                            React.createElement(
                                              "label",
                                              { style: smallBtnGhost },
                                              React.createElement(Upload, { size: 13 }),
                                              " Importar planilla de pagos",
                                              React.createElement("input", {
                                                type: "file",
                                                accept: ".xlsx,.xls,.csv",
                                                style: { display: "none" },
                                                onChange: (h) => yi(t, h.target.files[0]),
                                              }),
                                            ),
                                            React.createElement(
                                              "button",
                                              {
                                                onClick: () => Ya("pagos", t),
                                                style: { ...smallBtnGhost, color: MUTED },
                                              },
                                              "Plantilla de ejemplo",
                                            ),
                                          ),
                                        a.length > 0 &&
                                          React.createElement(
                                            React.Fragment,
                                            null,
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "flex",
                                                  justifyContent: "space-between",
                                                  alignItems: "center",
                                                  flexWrap: "wrap",
                                                  gap: 8,
                                                  margin: "16px 0 6px",
                                                },
                                              },
                                              React.createElement(
                                                "div",
                                                { style: { fontSize: 11.5, fontWeight: 700, color: MUTED } },
                                                "HISTORIAL DE PAGOS",
                                              ),
                                              React.createElement(
                                                "div",
                                                { style: { display: "flex", gap: 8, alignItems: "center" } },
                                                React.createElement("input", {
                                                  placeholder: "Buscar proveedor...",
                                                  value: Do[t] || "",
                                                  onChange: (h) => dn((N) => ({ ...N, [t]: h.target.value })),
                                                  style: { ...inputStyle, width: 160 },
                                                }),
                                                React.createElement(
                                                  "button",
                                                  {
                                                    onClick: () =>
                                                      Za(i, "pagos_" + t.replace(/[^a-z0-9]+/gi, "_") + ".xlsx"),
                                                    style: { ...smallBtnGhost, color: MUTED },
                                                  },
                                                  React.createElement(Download, { size: 13 }),
                                                  " Descargar",
                                                ),
                                              ),
                                            ),
                                            React.createElement(
                                              "div",
                                              { style: { maxHeight: 200, overflowY: "auto" } },
                                              React.createElement(
                                                "div",
                                                {
                                                  style: {
                                                    display: "grid",
                                                    gridTemplateColumns: "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px",
                                                    columnGap: 10,
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    padding: "4px 8px",
                                                  },
                                                },
                                                React.createElement(SortHeader, {
                                                  label: "PROVEEDOR",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "proveedor",
                                                  sortState: we,
                                                  onSort: ue,
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "PAGO",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "monto",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "FECHA",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "fecha",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "N° FC",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "fc",
                                                  sortState: we,
                                                  onSort: ue,
                                                  align: "right",
                                                }),
                                                React.createElement(SortHeader, {
                                                  label: "OBSERVACIONES",
                                                  tableId: "pagos:" + t,
                                                  sortKey: "observaciones",
                                                  sortState: we,
                                                  onSort: ue,
                                                }),
                                                React.createElement("div", null),
                                              ),
                                              i.length === 0
                                                ? React.createElement(
                                                    "div",
                                                    { style: { padding: "10px 8px", fontSize: 12, color: MUTED } },
                                                    "Ningún pago coincide con la búsqueda.",
                                                  )
                                                : So("pagos:" + t, i).map((h) =>
                                                    React.createElement(PagoRow, {
                                                      key: h._idx,
                                                      p: h,
                                                      onSave: (N) => Ar(t, h._idx, N),
                                                      onDelete: () => Cr(t, h._idx),
                                                      readOnly: !Rt,
                                                    }),
                                                  ),
                                            ),
                                          ),
                                      ),
                                  e.cliente === "WU" &&
                                    Kt === "costos" &&
                                    (() => {
                                      const h = Z[t] || [],
                                        N = h.map((Ce, ie) => {
                                          const Fe = subCostoKey(t, Ce.id),
                                            qe = ee[Fe] || [],
                                            Qe = ne[Fe] || [],
                                            z = qe.map((he, Se) => {
                                              const je = Qe.filter((yt) => yt.proveedor === he.proveedor).reduce(
                                                  (yt, uo) => yt + uo.monto,
                                                  0,
                                                ),
                                                mt = presupuestoEfectivo(he.presupuesto, je),
                                                $e = (mt || 0) - (he.presupuestoOriginal || 0),
                                                tt = he.presupuestoOriginal ? ($e / he.presupuestoOriginal) * 100 : 0;
                                              return {
                                                ...he,
                                                presupuesto: mt,
                                                pagado: je,
                                                resta: mt - je,
                                                desvio: $e,
                                                desvioPct: tt,
                                                _idx: Se,
                                              };
                                            });
                                          return { sub: Ce, idx: ie, subK: Fe, subPagos: Qe, subProvsConDatos: z };
                                        }),
                                        De = N.reduce(
                                          (Ce, ie) => (
                                            ie.subProvsConDatos.forEach((Fe) => {
                                              ((Ce.presupuestoOriginal += Fe.presupuestoOriginal || 0),
                                                (Ce.presupuesto += Fe.presupuesto || 0),
                                                (Ce.pagado += Fe.pagado));
                                            }),
                                            Ce
                                          ),
                                          { presupuestoOriginal: 0, presupuesto: 0, pagado: 0 },
                                        );
                                      return (
                                        (De.resta = De.presupuesto - De.pagado),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              background: "#fff",
                                              borderRadius: 12,
                                              border: "1px solid " + BORDER,
                                              boxShadow: CARD_SHADOW,
                                              padding: "18px 20px",
                                              marginTop: 16,
                                            },
                                          },
                                          React.createElement(
                                            "datalist",
                                            { id: "proveedores-sugeridos-subcosto" },
                                            v.map((Ce) => React.createElement("option", { key: Ce, value: Ce })),
                                          ),
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "flex-start",
                                                gap: 10,
                                                marginBottom: 6,
                                                flexWrap: "wrap",
                                              },
                                            },
                                            React.createElement(
                                              "div",
                                              { style: { fontSize: 11, fontWeight: 700, color: MUTED } },
                                              "SUB OBRAS (COSTOS)",
                                            ),
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "flex",
                                                  gap: 8,
                                                  alignItems: "center",
                                                  flexWrap: "wrap",
                                                },
                                              },
                                              h.length > 0 &&
                                                React.createElement(
                                                  "button",
                                                  {
                                                    onClick: () => {
                                                      const Ce = N.map(({ sub: qe, subProvsConDatos: Qe }) => {
                                                          const z = Qe.reduce(
                                                              ($e, tt) => $e + (tt.presupuesto || 0),
                                                              0,
                                                            ),
                                                            he = Qe.reduce(($e, tt) => $e + tt.pagado, 0),
                                                            Se = (qe.adicionales || []).reduce(
                                                              ($e, tt) => $e + (tt.monto || 0),
                                                              0,
                                                            ),
                                                            je = (qe.venta || 0) + Se,
                                                            mt = je ? ((je - z) / je) * 100 : null;
                                                          return {
                                                            "Sub Obra": qe.nombre,
                                                            Estado:
                                                              qe.status === "FINALIZADA" ? "Finalizada" : "En proceso",
                                                            Venta: je,
                                                            Proveedores: Qe.length,
                                                            "Ppto. Real": z,
                                                            Pagado: he,
                                                            Saldo: z - he,
                                                            "Costo Real": z,
                                                            "Margen Bruto": mt === null ? "" : Math.round(mt * 10) / 10,
                                                            Markup: mt === null || markupDeMb(mt) == null ? "" : Math.round(markupDeMb(mt) * 10) / 10,
                                                          };
                                                        }),
                                                        ie = [];
                                                      N.forEach(({ sub: qe, subProvsConDatos: Qe }) => {
                                                        Qe.forEach((z) => {
                                                          ie.push({
                                                            "Sub Obra": qe.nombre,
                                                            Proveedor: z.proveedor,
                                                            "Costo Inicial": z.presupuestoOriginal || 0,
                                                            "Costo Real": z.presupuesto || 0,
                                                            Saldo: z.resta,
                                                          });
                                                        });
                                                      });
                                                      const Fe = XLSX.utils.book_new();
                                                      (XLSX.utils.book_append_sheet(
                                                        Fe,
                                                        XLSX.utils.json_to_sheet(Ce),
                                                        "Resumenes",
                                                      ),
                                                        XLSX.utils.book_append_sheet(
                                                          Fe,
                                                          XLSX.utils.json_to_sheet(ie),
                                                          "Proveedores",
                                                        ),
                                                        descargarLibroXlsx(
                                                          Fe,
                                                          "sub_obras_" + t.replace(/[^a-z0-9]+/gi, "_") + ".xlsx",
                                                        ));
                                                    },
                                                    style: { ...smallBtnGhost, color: MUTED },
                                                  },
                                                  React.createElement(Download, { size: 13 }),
                                                  " Descargar sub obras",
                                                ),
                                            ),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { fontSize: 11.5, color: MUTED, marginBottom: 14 } },
                                            "Agrupá proveedores en sub obras dentro de esta obra, independiente de las Órdenes de Compra. El Costo Real de la obra suma esto más los proveedores generales de Costos.",
                                          ),
                                          h.length > 0 &&
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "flex",
                                                  gap: 8,
                                                  alignItems: "center",
                                                  flexWrap: "wrap",
                                                  marginBottom: 14,
                                                },
                                              },
                                              React.createElement(
                                                "select",
                                                {
                                                  value: vn[t] || "TODOS",
                                                  onChange: (Ce) => Wn((ie) => ({ ...ie, [t]: Ce.target.value })),
                                                  style: selectStyle,
                                                },
                                                React.createElement("option", { value: "TODOS" }, "Todos los estados"),
                                                React.createElement("option", { value: "EN PROCESO" }, "En proceso"),
                                                React.createElement("option", { value: "FINALIZADA" }, "Finalizada"),
                                              ),
                                              React.createElement("input", {
                                                placeholder: "Buscar sub obra...",
                                                value: Fn[t] || "",
                                                onChange: (Ce) => Yn((ie) => ({ ...ie, [t]: Ce.target.value })),
                                                style: { ...inputStyle, width: 170 },
                                              }),
                                            ),
                                          h.length > 0 &&
                                            React.createElement(
                                              "div",
                                              {
                                                style: {
                                                  display: "grid",
                                                  gridTemplateColumns: "repeat(4, 1fr)",
                                                  columnGap: 10,
                                                  padding: "10px 14px",
                                                  background: "#F1E9D2",
                                                  borderRadius: 8,
                                                  marginBottom: 14,
                                                },
                                              },
                                              React.createElement(
                                                "div",
                                                null,
                                                React.createElement(
                                                  "div",
                                                  { style: labelStyle },
                                                  "PPTO. ORIGINAL (TODAS)",
                                                ),
                                                React.createElement(
                                                  "div",
                                                  { style: { fontSize: 15, fontWeight: 700, color: NAVY } },
                                                  fmt(De.presupuestoOriginal),
                                                ),
                                              ),
                                              React.createElement(
                                                "div",
                                                null,
                                                React.createElement("div", { style: labelStyle }, "PPTO. REAL (TODAS)"),
                                                React.createElement(
                                                  "div",
                                                  { style: { fontSize: 15, fontWeight: 700, color: NAVY } },
                                                  fmt(De.presupuesto),
                                                ),
                                              ),
                                              React.createElement(
                                                "div",
                                                null,
                                                React.createElement("div", { style: labelStyle }, "PAGADO (TODAS)"),
                                                React.createElement(
                                                  "div",
                                                  { style: { fontSize: 15, fontWeight: 700, color: GREEN } },
                                                  fmt(De.pagado),
                                                ),
                                              ),
                                              React.createElement(
                                                "div",
                                                null,
                                                React.createElement(
                                                  "div",
                                                  { style: labelStyle },
                                                  "SALDO A PAGAR (TODAS)",
                                                ),
                                                React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      fontSize: 15,
                                                      fontWeight: 700,
                                                      color: De.resta > 0 ? RED : MUTED,
                                                    },
                                                  },
                                                  fmt(De.resta),
                                                ),
                                              ),
                                            ),
                                          (() => {
                                            const Ce = normalizarTexto(Fn[t] || ""),
                                              ie = vn[t] || "TODOS",
                                              Fe = N.filter(
                                                ({ sub: qe }) => !Ce || normalizarTexto(qe.nombre).includes(Ce),
                                              ).filter(
                                                ({ sub: qe }) => ie === "TODOS" || (qe.status || "EN PROCESO") === ie,
                                              );
                                            return h.length === 0
                                              ? React.createElement(
                                                  "div",
                                                  { style: { fontSize: 12.5, color: MUTED, marginBottom: 8 } },
                                                  "Todavía no creaste sub obras de costo para esta obra.",
                                                )
                                              : Fe.length === 0
                                                ? React.createElement(
                                                    "div",
                                                    { style: { fontSize: 12.5, color: MUTED, marginBottom: 8 } },
                                                    "Ninguna sub obra coincide",
                                                    Ce ? ' con "' + Fn[t] + '"' : "",
                                                    ie !== "TODOS" ? " con el estado seleccionado" : "",
                                                    ".",
                                                  )
                                                : React.createElement(
                                                    "div",
                                                    {
                                                      style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 8,
                                                        marginBottom: 8,
                                                      },
                                                    },
                                                    Fe.map(
                                                      ({
                                                        sub: qe,
                                                        idx: Qe,
                                                        subK: z,
                                                        subPagos: he,
                                                        subProvsConDatos: Se,
                                                      }) => {
                                                        const je = !!pn[z],
                                                          mt = Jo[z],
                                                          $e = Vt[z],
                                                          tt = Se.reduce(($, ze) => $ + (ze.presupuesto || 0), 0),
                                                          yt = Se.reduce(($, ze) => $ + ze.pagado, 0),
                                                          uo = Se.reduce(($, ze) => $ + ze.resta, 0),
                                                          Xo = qe.adicionales || [],
                                                          He = Xo.reduce(($, ze) => $ + (ze.monto || 0), 0),
                                                          Je = (qe.venta || 0) + He,
                                                          bt = Je ? ((Je - tt) / Je) * 100 : 0,
                                                          Et = _e[z],
                                                          Po = (Do[z] || "").trim().toLowerCase(),
                                                          Co = he
                                                            .map(($, ze) => ({ ...$, _idx: ze }))
                                                            .filter(
                                                              ($) => !Po || $.proveedor.toLowerCase().includes(Po),
                                                            );
                                                        return React.createElement(
                                                          "div",
                                                          {
                                                            key: z,
                                                            style: {
                                                              border: "1px solid " + BORDER,
                                                              borderRadius: 8,
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
                                                                padding: "8px 12px",
                                                                background: "#FAFAF7",
                                                                gap: 8,
                                                              },
                                                            },
                                                            React.createElement(
                                                              "div",
                                                              {
                                                                style: {
                                                                  display: "flex",
                                                                  alignItems: "center",
                                                                  gap: 8,
                                                                  minWidth: 0,
                                                                },
                                                              },
                                                              React.createElement(SubCostoNombre, {
                                                                nombre: qe.nombre,
                                                                onSave: ($) => kr(t, Qe, $),
                                                                readOnly: !Rt,
                                                              }),
                                                              React.createElement(StatusBadge, {
                                                                status: qe.status || "EN PROCESO",
                                                                onClick: Rt ? () => Ga(t, Qe) : void 0,
                                                              }),
                                                            ),
                                                            Rt &&
                                                              React.createElement(
                                                                "button",
                                                                {
                                                                  onClick: () => jr(t, Qe),
                                                                  style: {
                                                                    border: "none",
                                                                    background: "none",
                                                                    cursor: "pointer",
                                                                    color: RED,
                                                                    flexShrink: 0,
                                                                  },
                                                                },
                                                                React.createElement(Trash2, { size: 13 }),
                                                              ),
                                                          ),
                                                          React.createElement(
                                                            "div",
                                                            {
                                                              style: {
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                padding: "6px 12px",
                                                                borderTop: "1px solid " + BORDER,
                                                                fontSize: 11.5,
                                                                flexWrap: "wrap",
                                                                gap: 6,
                                                                background: "#fff",
                                                              },
                                                            },
                                                            React.createElement(SubCostoVentaOC, {
                                                              venta: qe.venta,
                                                              ordenCompra: qe.ordenCompra,
                                                              onSave: ($) => Lr(t, Qe, $),
                                                              readOnly: !Rt,
                                                            }),
                                                            React.createElement(
                                                              "span",
                                                              { style: { color: MUTED } },
                                                              "Adicional: ",
                                                              React.createElement(
                                                                "b",
                                                                { style: { color: TEXT } },
                                                                fmt(He),
                                                              ),
                                                              " · ",
                                                              "Costo real: ",
                                                              React.createElement(
                                                                "b",
                                                                { style: { color: TEXT } },
                                                                fmt(tt),
                                                              ),
                                                              " · ",
                                                              "MB / Markup: ",
                                                              React.createElement(
                                                                "b",
                                                                { style: { color: bt < 0 ? RED : GREEN } },
                                                                pctMk(bt),
                                                              ),
                                                            ),
                                                          ),
                                                          React.createElement(
                                                            "div",
                                                            {
                                                              onClick: () => yn(($) => ({ ...$, [z]: !$[z] })),
                                                              style: {
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                padding: "7px 12px",
                                                                borderTop: "1px solid " + BORDER,
                                                                cursor: "pointer",
                                                                fontSize: 11.5,
                                                              },
                                                            },
                                                            React.createElement(
                                                              "span",
                                                              { style: { color: NAVY, fontWeight: 700 } },
                                                              React.createElement(
                                                                "span",
                                                                {
                                                                  style: {
                                                                    display: "inline-block",
                                                                    transform: je ? "rotate(90deg)" : "rotate(0deg)",
                                                                    transition: "transform 0.15s",
                                                                    marginRight: 6,
                                                                    fontSize: 10,
                                                                  },
                                                                },
                                                                "▶",
                                                              ),
                                                              "Proveedores",
                                                              Se.length > 0 ? " (" + Se.length + ")" : "",
                                                            ),
                                                            !je &&
                                                              React.createElement(
                                                                "span",
                                                                { style: { color: MUTED } },
                                                                "Ppto. real: ",
                                                                React.createElement(
                                                                  "b",
                                                                  { style: { color: TEXT } },
                                                                  fmt(tt),
                                                                ),
                                                                " · ",
                                                                "Pagado: ",
                                                                React.createElement(
                                                                  "b",
                                                                  { style: { color: GREEN } },
                                                                  fmt(yt),
                                                                ),
                                                                " · ",
                                                                "Saldo: ",
                                                                React.createElement(
                                                                  "b",
                                                                  { style: { color: uo > 0 ? RED : MUTED } },
                                                                  fmt(uo),
                                                                ),
                                                              ),
                                                          ),
                                                          je &&
                                                            React.createElement(
                                                              "div",
                                                              { style: { padding: "10px 12px 14px" } },
                                                              Se.length === 0
                                                                ? React.createElement(
                                                                    "div",
                                                                    {
                                                                      style: {
                                                                        fontSize: 12,
                                                                        color: MUTED,
                                                                        marginBottom: 8,
                                                                      },
                                                                    },
                                                                    "Todavía no cargaste proveedores para esta sub obra.",
                                                                  )
                                                                : React.createElement(
                                                                    React.Fragment,
                                                                    null,
                                                                    React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          display: "grid",
                                                                          gridTemplateColumns:
                                                                            "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px",
                                                                          columnGap: 8,
                                                                          fontSize: 10.5,
                                                                          fontWeight: 700,
                                                                          padding: "4px 6px",
                                                                        },
                                                                      },
                                                                      React.createElement(SortHeader, {
                                                                        label: "PROVEEDOR",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "proveedor",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "PPTO. ORIGINAL",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "presupuestoOriginal",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "PPTO. REAL",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "presupuesto",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "PAGADO",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "pagado",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "SALDO",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "resta",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement(SortHeader, {
                                                                        label: "DESVÍO",
                                                                        tableId: "subCosto:" + z,
                                                                        sortKey: "desvioPct",
                                                                        sortState: we,
                                                                        onSort: ue,
                                                                        align: "right",
                                                                      }),
                                                                      React.createElement("div", null),
                                                                    ),
                                                                    So("subCosto:" + z, Se).map(($) =>
                                                                      React.createElement(ProveedorRow, {
                                                                        key: $._idx,
                                                                        p: $,
                                                                        index: $._idx,
                                                                        onSave: (ze) => Vr(z, $._idx, ze),
                                                                        onDelete: () => Xr(z, $._idx),
                                                                        readOnly: !Rt,
                                                                      }),
                                                                    ),
                                                                    React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          display: "grid",
                                                                          gridTemplateColumns:
                                                                            "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px",
                                                                          columnGap: 8,
                                                                          fontSize: 11.5,
                                                                          fontWeight: 700,
                                                                          padding: "6px 6px",
                                                                          background: "#F1E9D2",
                                                                          borderRadius: 4,
                                                                          marginTop: 4,
                                                                        },
                                                                      },
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { color: NAVY } },
                                                                        "TOTAL",
                                                                      ),
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { textAlign: "right", color: MUTED } },
                                                                        fmt(
                                                                          Se.reduce(
                                                                            ($, ze) =>
                                                                              $ + (ze.presupuestoOriginal || 0),
                                                                            0,
                                                                          ),
                                                                        ),
                                                                      ),
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { textAlign: "right" } },
                                                                        fmt(tt),
                                                                      ),
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { textAlign: "right", color: GREEN } },
                                                                        fmt(yt),
                                                                      ),
                                                                      React.createElement(
                                                                        "div",
                                                                        { style: { textAlign: "right", color: RED } },
                                                                        fmt(uo),
                                                                      ),
                                                                      React.createElement("div", null),
                                                                      React.createElement("div", null),
                                                                    ),
                                                                  ),
                                                              React.createElement(
                                                                "div",
                                                                {
                                                                  style: {
                                                                    marginTop: 14,
                                                                    borderTop: "1px solid " + BORDER,
                                                                    paddingTop: 10,
                                                                  },
                                                                },
                                                                React.createElement(
                                                                  "div",
                                                                  {
                                                                    style: {
                                                                      fontSize: 10.5,
                                                                      fontWeight: 700,
                                                                      color: MUTED,
                                                                      marginBottom: 6,
                                                                    },
                                                                  },
                                                                  "ADICIONALES DE LA SUB OBRA",
                                                                ),
                                                                Xo.length === 0
                                                                  ? React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          fontSize: 12,
                                                                          color: MUTED,
                                                                          marginBottom: 6,
                                                                        },
                                                                      },
                                                                      "Todavía no cargaste adicionales para esta sub obra.",
                                                                    )
                                                                  : React.createElement(
                                                                      React.Fragment,
                                                                      null,
                                                                      React.createElement(
                                                                        "div",
                                                                        {
                                                                          style: {
                                                                            display: "grid",
                                                                            gridTemplateColumns: "2fr 1fr 50px",
                                                                            columnGap: 10,
                                                                            fontSize: 10.5,
                                                                            fontWeight: 700,
                                                                            color: MUTED,
                                                                            padding: "4px 6px",
                                                                          },
                                                                        },
                                                                        React.createElement("div", null, "CONCEPTO"),
                                                                        React.createElement(
                                                                          "div",
                                                                          { style: { textAlign: "right" } },
                                                                          "MONTO",
                                                                        ),
                                                                        React.createElement("div", null),
                                                                      ),
                                                                      Xo.map(($, ze) =>
                                                                        React.createElement(AdicionalRow, {
                                                                          key: ze,
                                                                          a: $,
                                                                          onSave: (pa) => Mr(t, Qe, ze, pa),
                                                                          onDelete: () => Wr(t, Qe, ze),
                                                                          readOnly: !Rt,
                                                                        }),
                                                                      ),
                                                                    ),
                                                                Rt &&
                                                                  (Et
                                                                    ? React.createElement(
                                                                        "div",
                                                                        {
                                                                          style: {
                                                                            display: "flex",
                                                                            gap: 6,
                                                                            alignItems: "center",
                                                                            flexWrap: "wrap",
                                                                            marginTop: 6,
                                                                          },
                                                                        },
                                                                        React.createElement("input", {
                                                                          placeholder: "Concepto",
                                                                          style: inputStyle,
                                                                          onChange: ($) =>
                                                                            xt((ze) => ({
                                                                              ...ze,
                                                                              [z]: {
                                                                                ...ze[z],
                                                                                concepto: $.target.value,
                                                                              },
                                                                            })),
                                                                        }),
                                                                        React.createElement("input", {
                                                                          placeholder: "Monto",
                                                                          type: "number",
                                                                          style: { ...inputStyle, width: 130 },
                                                                          onChange: ($) =>
                                                                            xt((ze) => ({
                                                                              ...ze,
                                                                              [z]: { ...ze[z], monto: $.target.value },
                                                                            })),
                                                                        }),
                                                                        React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () => Ur(t, Qe, Et),
                                                                            style: smallBtnPrimary,
                                                                          },
                                                                          "Guardar",
                                                                        ),
                                                                        React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () =>
                                                                              xt(($) => ({ ...$, [z]: null })),
                                                                            style: smallBtnGhost,
                                                                          },
                                                                          React.createElement(X, { size: 13 }),
                                                                        ),
                                                                      )
                                                                    : React.createElement(
                                                                        "button",
                                                                        {
                                                                          onClick: () =>
                                                                            xt(($) => ({
                                                                              ...$,
                                                                              [z]: { concepto: "" },
                                                                            })),
                                                                          style: { ...smallBtnGhost, marginTop: 6 },
                                                                        },
                                                                        React.createElement(Plus, { size: 13 }),
                                                                        " Agregar adicional",
                                                                      )),
                                                              ),
                                                              Rt &&
                                                                React.createElement(
                                                                  "div",
                                                                  {
                                                                    style: {
                                                                      display: "flex",
                                                                      gap: 6,
                                                                      marginTop: 10,
                                                                      flexWrap: "wrap",
                                                                    },
                                                                  },
                                                                  mt
                                                                    ? React.createElement(
                                                                        "div",
                                                                        {
                                                                          style: {
                                                                            display: "flex",
                                                                            gap: 6,
                                                                            alignItems: "center",
                                                                            flexWrap: "wrap",
                                                                          },
                                                                        },
                                                                        React.createElement("input", {
                                                                          placeholder: "Proveedor",
                                                                          list: "proveedores-sugeridos-subcosto",
                                                                          style: inputStyle,
                                                                          onChange: ($) =>
                                                                            xo((ze) => ({
                                                                              ...ze,
                                                                              [z]: {
                                                                                ...ze[z],
                                                                                proveedor: $.target.value,
                                                                              },
                                                                            })),
                                                                        }),
                                                                        React.createElement("input", {
                                                                          placeholder: "Presupuesto original",
                                                                          type: "number",
                                                                          style: { ...inputStyle, width: 130 },
                                                                          onChange: ($) =>
                                                                            xo((ze) => ({
                                                                              ...ze,
                                                                              [z]: {
                                                                                ...ze[z],
                                                                                presupuestoOriginal: $.target.value,
                                                                              },
                                                                            })),
                                                                        }),
                                                                        React.createElement("input", {
                                                                          placeholder: "Presupuesto real",
                                                                          type: "number",
                                                                          style: { ...inputStyle, width: 120 },
                                                                          onChange: ($) =>
                                                                            xo((ze) => ({
                                                                              ...ze,
                                                                              [z]: {
                                                                                ...ze[z],
                                                                                presupuesto: $.target.value,
                                                                              },
                                                                            })),
                                                                        }),
                                                                        React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () => da(z, mt),
                                                                            style: smallBtnPrimary,
                                                                          },
                                                                          "Guardar",
                                                                        ),
                                                                        React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () =>
                                                                              xo(($) => ({ ...$, [z]: null })),
                                                                            style: smallBtnGhost,
                                                                          },
                                                                          React.createElement(X, { size: 13 }),
                                                                        ),
                                                                      )
                                                                    : React.createElement(
                                                                        "button",
                                                                        {
                                                                          onClick: () =>
                                                                            xo(($) => ({
                                                                              ...$,
                                                                              [z]: { proveedor: "" },
                                                                            })),
                                                                          style: smallBtnGhost,
                                                                        },
                                                                        React.createElement(Plus, { size: 13 }),
                                                                        " Nuevo proveedor",
                                                                      ),
                                                                  Se.length > 0 &&
                                                                    ($e
                                                                      ? React.createElement(
                                                                          "div",
                                                                          {
                                                                            style: {
                                                                              display: "flex",
                                                                              gap: 6,
                                                                              alignItems: "center",
                                                                              flexWrap: "wrap",
                                                                            },
                                                                          },
                                                                          React.createElement(ProveedorPicker, {
                                                                            value: $e.proveedor || "",
                                                                            options: Se.map(($) => $.proveedor),
                                                                            placeholder: "Proveedor...",
                                                                            style: { width: 160 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: { ...ze[z], proveedor: $ },
                                                                              })),
                                                                          }),
                                                                          React.createElement("input", {
                                                                            placeholder: "Monto",
                                                                            type: "number",
                                                                            style: { ...inputStyle, width: 100 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: {
                                                                                  ...ze[z],
                                                                                  monto: $.target.value,
                                                                                },
                                                                              })),
                                                                          }),
                                                                          React.createElement("input", {
                                                                            placeholder: "Fecha (dd/mm/aaaa)",
                                                                            style: { ...inputStyle, width: 130 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: {
                                                                                  ...ze[z],
                                                                                  fecha: $.target.value,
                                                                                },
                                                                              })),
                                                                          }),
                                                                          React.createElement("input", {
                                                                            placeholder: "N° FC",
                                                                            style: { ...inputStyle, width: 90 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: { ...ze[z], fc: $.target.value },
                                                                              })),
                                                                          }),
                                                                          React.createElement("input", {
                                                                            placeholder: "Observaciones",
                                                                            style: { ...inputStyle, width: 150 },
                                                                            onChange: ($) =>
                                                                              st((ze) => ({
                                                                                ...ze,
                                                                                [z]: {
                                                                                  ...ze[z],
                                                                                  observaciones: $.target.value,
                                                                                },
                                                                              })),
                                                                          }),
                                                                          React.createElement(
                                                                            "button",
                                                                            {
                                                                              onClick: () => $e.proveedor && _r(z, $e),
                                                                              style: smallBtnPrimary,
                                                                            },
                                                                            "Registrar pago",
                                                                          ),
                                                                          React.createElement(
                                                                            "button",
                                                                            {
                                                                              onClick: () =>
                                                                                st(($) => ({ ...$, [z]: null })),
                                                                              style: smallBtnGhost,
                                                                            },
                                                                            React.createElement(X, { size: 13 }),
                                                                          ),
                                                                        )
                                                                      : React.createElement(
                                                                          "button",
                                                                          {
                                                                            onClick: () =>
                                                                              st(($) => ({
                                                                                ...$,
                                                                                [z]: { proveedor: "" },
                                                                              })),
                                                                            style: smallBtnGhost,
                                                                          },
                                                                          React.createElement(Plus, { size: 13 }),
                                                                          " Registrar pago",
                                                                        )),
                                                                  React.createElement(
                                                                    "label",
                                                                    { style: { ...smallBtnGhost, marginLeft: "auto" } },
                                                                    React.createElement(Upload, { size: 13 }),
                                                                    " Importar planilla de costos",
                                                                    React.createElement("input", {
                                                                      type: "file",
                                                                      accept: ".xlsx,.xls,.csv",
                                                                      style: { display: "none" },
                                                                      onChange: ($) => Si(z, $.target.files[0]),
                                                                    }),
                                                                  ),
                                                                  React.createElement(
                                                                    "button",
                                                                    {
                                                                      onClick: () => Ka("costos", z),
                                                                      style: { ...smallBtnGhost, color: MUTED },
                                                                    },
                                                                    "Plantilla de ejemplo",
                                                                  ),
                                                                  React.createElement(
                                                                    "label",
                                                                    { style: smallBtnGhost },
                                                                    React.createElement(Upload, { size: 13 }),
                                                                    " Importar planilla de pagos",
                                                                    React.createElement("input", {
                                                                      type: "file",
                                                                      accept: ".xlsx,.xls,.csv",
                                                                      style: { display: "none" },
                                                                      onChange: ($) => xi(z, $.target.files[0]),
                                                                    }),
                                                                  ),
                                                                  React.createElement(
                                                                    "button",
                                                                    {
                                                                      onClick: () => Ka("pagos", z),
                                                                      style: { ...smallBtnGhost, color: MUTED },
                                                                    },
                                                                    "Plantilla de ejemplo",
                                                                  ),
                                                                ),
                                                              he.length > 0 &&
                                                                React.createElement(
                                                                  React.Fragment,
                                                                  null,
                                                                  React.createElement(
                                                                    "div",
                                                                    {
                                                                      style: {
                                                                        display: "flex",
                                                                        justifyContent: "space-between",
                                                                        alignItems: "center",
                                                                        flexWrap: "wrap",
                                                                        gap: 6,
                                                                        margin: "12px 0 4px",
                                                                      },
                                                                    },
                                                                    React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          fontSize: 10.5,
                                                                          fontWeight: 700,
                                                                          color: MUTED,
                                                                        },
                                                                      },
                                                                      "HISTORIAL DE PAGOS",
                                                                    ),
                                                                    React.createElement(
                                                                      "div",
                                                                      {
                                                                        style: {
                                                                          display: "flex",
                                                                          gap: 6,
                                                                          alignItems: "center",
                                                                        },
                                                                      },
                                                                      React.createElement("input", {
                                                                        placeholder: "Buscar proveedor...",
                                                                        value: Do[z] || "",
                                                                        onChange: ($) =>
                                                                          dn((ze) => ({ ...ze, [z]: $.target.value })),
                                                                        style: {
                                                                          ...inputStyle,
                                                                          width: 140,
                                                                          fontSize: 11.5,
                                                                        },
                                                                      }),
                                                                      React.createElement(
                                                                        "button",
                                                                        {
                                                                          onClick: () =>
                                                                            Za(
                                                                              Co,
                                                                              "pagos_" +
                                                                                z.replace(/[^a-z0-9]+/gi, "_") +
                                                                                ".xlsx",
                                                                            ),
                                                                          style: {
                                                                            ...smallBtnGhost,
                                                                            color: MUTED,
                                                                            fontSize: 11,
                                                                          },
                                                                        },
                                                                        React.createElement(Download, { size: 12 }),
                                                                        " Descargar",
                                                                      ),
                                                                    ),
                                                                  ),
                                                                  React.createElement(
                                                                    "div",
                                                                    {
                                                                      style: {
                                                                        display: "grid",
                                                                        gridTemplateColumns:
                                                                          "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px",
                                                                        columnGap: 8,
                                                                        fontSize: 10.5,
                                                                        fontWeight: 700,
                                                                        padding: "4px 6px",
                                                                      },
                                                                    },
                                                                    React.createElement(SortHeader, {
                                                                      label: "PROVEEDOR",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "proveedor",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                    }),
                                                                    React.createElement(SortHeader, {
                                                                      label: "PAGO",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "monto",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                      align: "right",
                                                                    }),
                                                                    React.createElement(SortHeader, {
                                                                      label: "FECHA",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "fecha",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                      align: "right",
                                                                    }),
                                                                    React.createElement(SortHeader, {
                                                                      label: "N° FC",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "fc",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                      align: "right",
                                                                    }),
                                                                    React.createElement(SortHeader, {
                                                                      label: "OBSERVACIONES",
                                                                      tableId: "subCostoPagos:" + z,
                                                                      sortKey: "observaciones",
                                                                      sortState: we,
                                                                      onSort: ue,
                                                                    }),
                                                                    React.createElement("div", null),
                                                                  ),
                                                                  Co.length === 0
                                                                    ? React.createElement(
                                                                        "div",
                                                                        {
                                                                          style: {
                                                                            padding: "8px 6px",
                                                                            fontSize: 11.5,
                                                                            color: MUTED,
                                                                          },
                                                                        },
                                                                        "Ningún pago coincide con la búsqueda.",
                                                                      )
                                                                    : So("subCostoPagos:" + z, Co).map(($) =>
                                                                        React.createElement(PagoRow, {
                                                                          key: $._idx,
                                                                          p: $,
                                                                          onSave: (ze) => qr(z, $._idx, ze),
                                                                          onDelete: () => Hr(z, $._idx),
                                                                          readOnly: !Rt,
                                                                        }),
                                                                      ),
                                                                ),
                                                            ),
                                                        );
                                                      },
                                                    ),
                                                  );
                                          })(),
                                          Rt &&
                                            (Ho !== null
                                              ? React.createElement(
                                                  "div",
                                                  {
                                                    style: {
                                                      display: "flex",
                                                      gap: 6,
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                      marginTop: 8,
                                                    },
                                                  },
                                                  React.createElement("input", {
                                                    placeholder: "Nombre de la sub obra",
                                                    style: inputStyle,
                                                    onChange: (Ce) => nn(Ce.target.value),
                                                  }),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => Wa(t, Ho), style: smallBtnPrimary },
                                                    "Guardar",
                                                  ),
                                                  React.createElement(
                                                    "button",
                                                    { onClick: () => nn(null), style: smallBtnGhost },
                                                    React.createElement(X, { size: 13 }),
                                                  ),
                                                )
                                              : React.createElement(
                                                  "button",
                                                  { onClick: () => nn(""), style: smallBtnGhost },
                                                  React.createElement(Plus, { size: 13 }),
                                                  " Agregar sub obra",
                                                )),
                                        )
                                      );
                                    })(),
                                );
                              })()
                            : React.createElement(
                                React.Fragment,
                                null,
                                React.createElement(
                                  "button",
                                  { onClick: () => be(null), style: { ...smallBtnGhost, marginBottom: 14 } },
                                  React.createElement(ArrowLeft, { size: 14 }),
                                  " Volver a clientes",
                                ),
                                (() => {
                                  const e = (Tn[se] || []).filter((o) =>
                                      Ro.includes(o.anio || /* @__PURE__ */ new Date().getFullYear()),
                                    ),
                                    t = e.reduce((o, a) => o + a.ventaFinal, 0);
                                  return React.createElement(
                                    React.Fragment,
                                    null,
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
                                        { style: { width: 260, height: 230, flexShrink: 0 } },
                                        React.createElement(
                                          ResponsiveContainer,
                                          null,
                                          React.createElement(
                                            PieChart,
                                            null,
                                            React.createElement(
                                              Pie,
                                              {
                                                data: e.map((o) => ({ name: o.obra, value: o.ventaFinal })),
                                                dataKey: "value",
                                                nameKey: "name",
                                                cx: "50%",
                                                cy: "50%",
                                                outerRadius: 85,
                                              },
                                              e.map((o, a) =>
                                                React.createElement(Cell, {
                                                  key: a,
                                                  fill: PIE_COLORS[a % PIE_COLORS.length],
                                                  opacity:
                                                    !b["centroCosto:" + se] || b["centroCosto:" + se] === o.obra
                                                      ? 1
                                                      : 0.3,
                                                }),
                                              ),
                                            ),
                                            React.createElement(Tooltip, { formatter: (o) => fmt(o) }),
                                          ),
                                        ),
                                      ),
                                      React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              fontFamily: "Georgia, serif",
                                              fontSize: 20,
                                              fontWeight: 700,
                                              color: NAVY,
                                              marginBottom: 8,
                                            },
                                          },
                                          se,
                                        ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              display: "grid",
                                              gridTemplateColumns: "1fr 1fr",
                                              columnGap: 10,
                                              gap: "4px 18px",
                                              fontSize: 12.5,
                                            },
                                          },
                                          e.map((o, a) => {
                                            const r = b["centroCosto:" + se] === o.obra;
                                            return React.createElement(
                                              "div",
                                              {
                                                key: a,
                                                onMouseEnter: () => R((i) => ({ ...i, ["centroCosto:" + se]: o.obra })),
                                                onMouseLeave: () => R((i) => ({ ...i, ["centroCosto:" + se]: null })),
                                                style: {
                                                  display: "flex",
                                                  alignItems: "center",
                                                  gap: 7,
                                                  cursor: "default",
                                                  padding: "3px 6px",
                                                  borderRadius: 6,
                                                  background: r ? "#F1E9D2" : "transparent",
                                                },
                                              },
                                              React.createElement("span", {
                                                style: {
                                                  width: 10,
                                                  height: 10,
                                                  borderRadius: 3,
                                                  background: PIE_COLORS[a % PIE_COLORS.length],
                                                  flexShrink: 0,
                                                },
                                              }),
                                              React.createElement(
                                                "span",
                                                { style: { fontWeight: r ? 700 : 600, color: r ? NAVY : TEXT } },
                                                o.obra,
                                              ),
                                              React.createElement(
                                                "span",
                                                { style: { color: MUTED } },
                                                ((o.ventaFinal / t) * 100).toFixed(0),
                                                "%",
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
                                        },
                                      },
                                      React.createElement(
                                        "div",
                                        {
                                          style: {
                                            display: "grid",
                                            gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 1fr 0.8fr 0.8fr 32px",
                                            columnGap: 10,
                                            padding: "11px 18px",
                                            fontSize: 11.5,
                                            fontWeight: 700,
                                            background: "#EFEDE7",
                                            borderBottom: "1px solid " + BORDER,
                                            letterSpacing: 0.3,
                                          },
                                        },
                                        React.createElement(SortHeader, {
                                          label: "CENTRO DE COSTO",
                                          tableId: "obraList",
                                          sortKey: "obra",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "ESTADO",
                                          tableId: "obraList",
                                          sortKey: "status",
                                          sortState: we,
                                          onSort: ue,
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "VENTA",
                                          tableId: "obraList",
                                          sortKey: "ventaFinal",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "COSTO",
                                          tableId: "obraList",
                                          sortKey: "costoFinal",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "SALDO A PAGAR",
                                          tableId: "obraList",
                                          sortKey: "saldoProveedores",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "PRECIO X M2",
                                          tableId: "obraList",
                                          sortKey: "precioM2",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "MB INICIAL / MARKUP",
                                          tableId: "obraList",
                                          sortKey: "mbInicial",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement(SortHeader, {
                                          label: "MB FINAL / MARKUP",
                                          tableId: "obraList",
                                          sortKey: "mbFinal",
                                          sortState: we,
                                          onSort: ue,
                                          align: "right",
                                        }),
                                        React.createElement("div", null),
                                      ),
                                      So("obraList", e.map((o) => { const m = Ln(o); return { ...o, precioM2: m > 0 ? o.ventaFinal / m : null }; })).map((o) => {
                                        const a = obraKey(o.cliente, o.obra);
                                        return React.createElement(
                                          "div",
                                          {
                                            key: a,
                                            onClick: () => {
                                              (no(a), ae("facturas"), ot(false), $t(null), vo(false), ao(null));
                                            },
                                            style: {
                                              display: "grid",
                                              gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 1fr 0.8fr 0.8fr 32px",
                                              columnGap: 10,
                                              padding: "10px 18px",
                                              fontSize: 13,
                                              alignItems: "center",
                                              cursor: "pointer",
                                              borderBottom: "1px solid " + BORDER,
                                            },
                                          },
                                          React.createElement("div", { style: { fontWeight: 500 } }, o.obra),
                                          React.createElement(
                                            "div",
                                            null,
                                            React.createElement(StatusBadge, {
                                              status: o.status,
                                              onClick: Rt
                                                ? (r) => {
                                                    (r.stopPropagation(), Ha(o));
                                                  }
                                                : void 0,
                                            }),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                            fmtSmart(o.ventaFinal, o.ventaFinalUSD),
                                          ),
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                textAlign: "right",
                                                fontVariantNumeric: "tabular-nums",
                                                color: MUTED,
                                              },
                                            },
                                            fmtSmart(o.costoFinal, o.costoFinalUSD),
                                          ),
                                          React.createElement(
                                            "div",
                                            {
                                              style: {
                                                textAlign: "right",
                                                fontVariantNumeric: "tabular-nums",
                                                color: o.saldoProveedores > 0 ? RED : MUTED,
                                              },
                                            },
                                            fmtSmart(o.saldoProveedores, o.saldoProveedoresUSD),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED } },
                                            o.precioM2 != null ? fmt(o.precioM2) : "—",
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { textAlign: "right" } },
                                            React.createElement(MBValue, { v: valSmart(o.mbInicial, o.mbInicialUSD) }),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { textAlign: "right" } },
                                            React.createElement(MBValue, { v: valSmart(o.mbFinal, o.mbFinalUSD) }),
                                          ),
                                          React.createElement(
                                            "div",
                                            { style: { display: "flex", justifyContent: "center", color: MUTED } },
                                            React.createElement(ChevronRight, { size: 16 }),
                                          ),
                                        );
                                      }),
                                      React.createElement(
                                        "div",
                                        {
                                          style: {
                                            display: "grid",
                                            gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 1fr 0.8fr 0.8fr 32px",
                                            columnGap: 10,
                                            padding: "10px 18px",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            background: "#F1E9D2",
                                          },
                                        },
                                        React.createElement("div", { style: { color: NAVY } }, "TOTAL"),
                                        React.createElement("div", null),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums" } },
                                          fmt(t),
                                        ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              textAlign: "right",
                                              fontVariantNumeric: "tabular-nums",
                                              color: MUTED,
                                            },
                                          },
                                          fmt(e.reduce((o, a) => o + a.costoFinal, 0)),
                                        ),
                                        React.createElement(
                                          "div",
                                          {
                                            style: {
                                              textAlign: "right",
                                              fontVariantNumeric: "tabular-nums",
                                              color: RED,
                                            },
                                          },
                                          fmt(e.reduce((o, a) => o + (a.saldoProveedores || 0), 0)),
                                        ),
                                        React.createElement(
                                          "div",
                                          { style: { textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED } },
                                          (() => {
                                            const m = e.reduce((o, a) => o + Ln(a), 0);
                                            return m > 0 ? fmt(t / m) : "—";
                                          })(),
                                        ),
                                        React.createElement("div", null),
                                        React.createElement("div", null),
                                        React.createElement("div", null),
                                      ),
                                    ),
                                  );
                                })(),
                              ),
                        verRegaliasPresentacion &&
                          React.createElement(
                            React.Fragment,
                            null,
                            React.createElement(PresentacionSlides, { data: ia, refs: Tt }),
                            React.createElement(
                              "div",
                              { style: { display: "flex", justifyContent: "flex-end", marginTop: 24 } },
                              React.createElement(
                                "button",
                                {
                                  onClick: ur,
                                  disabled: Ut,
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
                                    cursor: Ut ? "default" : "pointer",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    opacity: Ut ? 0.7 : 1,
                                  },
                                },
                                React.createElement(Download, { size: 15 }),
                                " ",
                                Ut ? "Generando presentación..." : "Hacer presentación",
                              ),
                            ),
                          ),
                      ),
      );
}
