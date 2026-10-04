// (Continúa la función App: carga de datos, guardado y sincronización con la base.)
  useEffect(() => {
    !datosCargados ||
      estadoConexion === "unavailable" ||
      !dbRef.current ||
      Da.current ||
      (obras.length === 0 && g.length === 0) ||
      ((Da.current = true),
      (async () => {
        try {
          if ((await dbRef.current.doc("app/tcHistoricoAplicado").get()).exists) return;
          await dbRef.current.doc("app/tcHistoricoAplicado").set({ done: true, aplicadoEn: Date.now() });
          const t = {};
          (obras.forEach((i) => {
            t[obraKey(i.cliente, i.obra)] = i.anio;
          }),
            setObras((i) => i.map((u) => ({ ...u, tc: tcParaAnioHistorico(u.anio) }))));
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
          (setProveedoresMap((i) => o(i)), setPagosMap((i) => o(i)), setAdicionalesMap((i) => o(i)), setOrdenesCompraMap((i) => o(i)));
          const a = (i) => {
            const u = { ...i };
            return (
              Object.entries(costoSubobrasMap).forEach(([m, x]) => {
                const D = tcParaAnioHistorico(t[m]);
                (x || []).forEach((T, O) => {
                  const _ = subCostoKey(m, O);
                  u[_] && (u[_] = u[_].map((xe) => ({ ...xe, tc: D })));
                });
              }),
              u
            );
          };
          (setSubCostoProveedoresMap((i) => a(i)), setSubCostoPagosMap((i) => a(i)));
          const r = dbRef.current.collection("facturas");
          (await Promise.all(
            g.map((i) => {
              const u = tcParaAnioHistorico(t[obraKey(i.cliente, i.obra)]);
              return r
                .doc(i.id)
                .update({ tc: u })
                .catch(() => {});
            }),
          ),
            setTipoCambio((i) => i || 1450));
        } catch {}
      })());
  }, [datosCargados, estadoConexion, obras.length, g.length]);
  const Ra = useRef(false);
  (useEffect(() => {
    !datosCargados ||
      estadoConexion === "unavailable" ||
      !dbRef.current ||
      Ra.current ||
      !Object.values(costoSubobrasMap).some((t) => (t || []).some((o) => !o.id)) ||
      ((Ra.current = true),
      (async () => {
        try {
          if ((await dbRef.current.doc("app/subCostoIdsAplicado").get()).exists) return;
          await dbRef.current.doc("app/subCostoIdsAplicado").set({ done: true, aplicadoEn: Date.now() });
          const o = {},
            a = {};
          if (
            (Object.entries(costoSubobrasMap).forEach(([i, u]) => {
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
          (setCostoSubobrasMap(a), setSubCostoProveedoresMap((i) => r(i)), setSubCostoPagosMap((i) => r(i)));
        } catch {}
      })());
  }, [datosCargados, estadoConexion, costoSubobrasMap]),
    useEffect(() => {
      if (!datosCargados) return;
      if (!Sn) {
        ge(false);
        return;
      }
      let e = false;
      function t() {
        const a = fechaComercialHoy(),
          r = tcFecha !== a;
        (r && !e && Y(tipoCambio ? String(tipoCambio) : ""), (e = r), ge(r));
      }
      t();
      const o = setInterval(t, 6e4);
      return () => clearInterval(o);
    }, [datosCargados, ct, Sn, tcFecha]));
  function mostrarErrorGuardado(id, motivo) {
    setErrorGuardado({ id, motivo });
    try {
      dbRef.current &&
        dbRef.current
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
      !dbRef.current ||
      dbRef.current
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
    !e || e <= 0 || (setTipoCambio(e), setTcFecha(fechaComercialHoy()), ge(false));
  }
  (useEffect(() => {
    if (!datosCargados || !dbRef.current) return;
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
      dbRef.current
        .collection("presencia")
        .doc(e.key)
        .set({ nombre: e.nombre, ultimaVez: Date.now() })
        .catch(() => {});
    };
    t();
    const o = setInterval(t, 3e4);
    return () => clearInterval(o);
  }, [datosCargados, ct, so]),
    useEffect(() => {
      if (!datosCargados || !fn || !dbRef.current) return;
      const e = dbRef.current.collection("presencia").onSnapshot(
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
    }, [datosCargados, fn]));
  function na() {
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
      facturas: g,
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
      eerrMensual: eerrMensual,
      pagosSemanales: pagosSemanales,
      proveedoresInfoMap: proveedoresInfoMap,
      reglasProveedoresPago: reglasProveedoresPago,
      correccionesAprendidas: correccionesAprendidas,
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
    if (!datosCargados || estadoConexion === "unavailable" || !dbRef.current || (obras.length === 0 && g.length === 0)) return;
    const e = cr();
    if (wa.current === e || aa.current) return;
    aa.current = true;
    const t = dbRef.current;
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
  }, [datosCargados, estadoConexion, obras, g, pagosSemanales, cfIngresosValores, cfIngresosCategoriasValores, cfEgresosValores, cfSalidasValores]),
    useEffect(() => {
      const e = setInterval(Na, 6e4);
      return () => clearInterval(e);
    }, [datosCargados, estadoConexion]));
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
    if (!dbRef.current) return;
    const t = dbRef.current.collection("facturas"),
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
          (aplicarEstadoGuardado(i), pr(i.facturas).catch(() => {}), t(true));
        } catch (i) {
          o(i);
        }
      }),
        (a.onerror = o),
        a.readAsText(e));
    });
  }
  function Fa(e, t, o, a, r) {
    if (t !== "WU" || mzLatamOcultoMap[e] || r === "FINALIZADA") return null;
    const i = pagosMap[e] || [],
      u = costoSubobrasMap[e] || [],
      m = i.reduce((z, he) => z + (he.monto || 0), 0),
      x = i.reduce((z, he) => z + aUsd(he.monto, he.tc), 0),
      D = u.filter((z) => (z.venta || 0) > 0),
      T = u.filter((z) => !((z.venta || 0) > 0)),
      O = T.reduce((z, he) => {
        const Se = subCostoKey(e, he.id),
          je = subCostoProveedoresMap[Se] || [],
          mt = subCostoPagosMap[Se] || [];
        return (
          z + je.reduce(($e, tt) => $e + presupuestoEfectivo(tt.presupuesto, pagadoDeProveedor(mt, tt.proveedor)), 0)
        );
      }, 0),
      _ = T.reduce((z, he) => {
        const Se = subCostoKey(e, he.id),
          je = subCostoProveedoresMap[Se] || [],
          mt = subCostoPagosMap[Se] || [];
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
          je = subCostoProveedoresMap[Se] || [],
          mt = subCostoPagosMap[Se] || [];
        return (
          z + je.reduce(($e, tt) => $e + presupuestoEfectivo(tt.presupuesto, pagadoDeProveedor(mt, tt.proveedor)), 0)
        );
      }, 0),
      ft = Ze.reduce((z, he) => {
        const Se = subCostoKey(e, he.id),
          je = subCostoProveedoresMap[Se] || [],
          mt = subCostoPagosMap[Se] || [];
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
      Qe = qe > 0 ? Fe / qe : tipoCambio || 0;
    return { proveedor: "MZ LATAM", presupuestoOriginal: Fe, presupuesto: Fe, tc: Qe, esVirtualMzLatam: true };
  }
  const co = useMemo(
    () =>
      obras.map((e) => {
        const t = obraKey(e.cliente, e.obra),
          o = costoSubobrasMap[t] || [],
          a = o.reduce((He, Je) => He + (Je.adicionales || []).reduce((bt, Et) => bt + (Et.monto || 0), 0), 0),
          r = o.reduce((He, Je) => He + (Je.adicionales || []).reduce((bt, Et) => bt + aUsd(Et.monto, Et.tc), 0), 0),
          i = adicionalesMap[t] || [],
          u = i.reduce((He, Je) => He + (Je.monto || 0), 0) + a,
          m = i.reduce((He, Je) => He + aUsd(Je.monto, Je.tc), 0) + r,
          x = ordenesCompraMap[t] || [],
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
          h = proveedoresMap[t],
          N = pagosMap[t] || [],
          De = o.reduce((He, Je) => {
            const bt = subCostoKey(t, Je.id),
              Et = subCostoProveedoresMap[bt] || [],
              Po = subCostoPagosMap[bt] || [];
            return (
              He + Et.reduce((Co, $) => Co + presupuestoEfectivo($.presupuesto, pagadoDeProveedor(Po, $.proveedor)), 0)
            );
          }, 0),
          Ce = o.reduce((He, Je) => {
            const bt = subCostoKey(t, Je.id),
              Et = subCostoProveedoresMap[bt] || [],
              Po = subCostoPagosMap[bt] || [];
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
              Et = subCostoProveedoresMap[bt] || [],
              Po = subCostoPagosMap[bt] || [];
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
              Et = subCostoProveedoresMap[bt] || [],
              Po = subCostoPagosMap[bt] || [];
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
    [obras, proveedoresMap, pagosMap, adicionalesMap, ordenesCompraMap, costoSubobrasMap, subCostoProveedoresMap, subCostoPagosMap, mzLatamOcultoMap, tipoCambio],
  );
  useEffect(() => {
    const e = Sa.current,
      t = {};
    (co.forEach((u) => {
      const m = obraKey(u.cliente, u.obra),
        x = {};
      (proveedoresMap[m] || []).forEach((T) => {
        const O = (T.proveedor || "").trim();
        if (!O) return;
        const _ = pagadoDeProveedor(pagosMap[m] || [], T.proveedor);
        x[O] = (x[O] || 0) + presupuestoEfectivo(T.presupuesto, _);
      });
      const D = {};
      ((adicionalesMap[m] || []).forEach((T) => {
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
        setCambiosFinancieros((u) => {
          const m = a - 1728e5;
          return [...u.filter((D) => D.fecha >= m), ...r];
        }));
  }, [co, proveedoresMap, pagosMap, adicionalesMap]);
  function fr() {
    if (cambiosFinancieros.length === 0) {
      alert("No hay cambios registrados en las últimas 48hs para exportar.");
      return;
    }
    const e = [...cambiosFinancieros].sort((i, u) => i.fecha - u.fecha),
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
            a = ordenesCompraMap[o] || [],
            r = a.length > 0,
            adicOC = r ? adicionalesPorOC(costoSubobrasMap[o], a.map((m) => m.ordenCompra)) : {},
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
    }, [co, ordenesCompraMap, costoSubobrasMap]),
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
      (Object.entries(proveedoresMap).forEach(([W, pe]) => {
        const Mt = pagosMap[W] || [];
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
        Object.entries(subCostoProveedoresMap || {}).forEach(([W, pe]) => {
          const Mt = (subCostoPagosMap || {})[W] || [];
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
          const Mt = Number(cfSalidasValores[W.ccId + "|" + pe]) || 0,
            io = W.proveedores.reduce((wo, To) => wo + (Number(cfSalidasValores[To.id + "|" + pe]) || 0), 0);
          return Math.max(Mt, io);
        },
        regMapApp = regaliasPorSemana(g, tt),
        Et = tt.map((W) => {
          const pe = Xo.reduce((mo, _o) => mo + (Number(cfIngresosValores[_o.id + "|" + W]) || 0), 0),
            Mt = cfIngresosCategorias.reduce((mo, _o) => mo + (Number(cfIngresosCategoriasValores[_o + "|" + W]) || 0), 0),
            io = pe + Mt,
            wo = cfEgresosCategorias.reduce((mo, _o) => mo + (Number(cfEgresosValores[_o + "|" + W]) || 0), 0),
            To = Je.reduce((mo, _o) => mo + bt(_o, W), 0),
            Pt = wo + To + regaliaPendiente(regMapApp, cfRegPag, W);
          return { semana: W, ingresos: io, egresos: Pt, neto: io - Pt };
        });
      let Po = Number(cfSaldoInicial) || 0;
      const Co = Et.map((W) => ((Po += W.neto), Po)),
        $ = Et.map((W, pe) => [semanaLabelCorta(W.semana), fmt(W.ingresos), fmt(W.egresos), fmt(W.neto), fmt(Co[pe])]),
        ze = Et.map((W, pe) => ({ semana: semanaLabelCorta(W.semana), saldo: Co[pe] })),
        pa = Et.reduce((W, pe) => W + pe.ingresos, 0),
        Di = Et.reduce((W, pe) => W + pe.egresos, 0),
        Ri = Co.length ? Co[Co.length - 1] : Number(cfSaldoInicial) || 0;
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
        saldoInicialCash: Number(cfSaldoInicial) || 0,
        saldoProyectadoCash: Ri,
        totalIngresosCash: pa,
        totalEgresosCash: Di,
      };
    }, [co, g, proveedoresMap, pagosMap, subCostoProveedoresMap, subCostoPagosMap, gn, cfSaldoInicial, cfIngresosValores, cfIngresosCategorias, cfIngresosCategoriasValores, cfEgresosCategorias, cfEgresosValores, cfSalidasValores, cfRegPag]);
  function La(e) {
    const t = Number(e.venta) || 0,
      o = Number(e.costoInicial) || 0;
    (setObras((a) => [
      ...a,
      {
        cliente: e.cliente.toUpperCase(),
        obra: e.obra.toUpperCase(),
        status: "EN PROCESO",
        costoInicial: o,
        costoFinal: o,
        ventaOriginal: t,
        tc: tipoCambio,
        mes: e.mes || "ENERO",
        anio: Number(e.anio) || /* @__PURE__ */ new Date().getFullYear(),
      },
    ]),
      _t("Nueva obra: " + e.cliente.toUpperCase() + " - " + e.obra.toUpperCase()),
      ln(false));
  }
