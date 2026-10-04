// (Continúa la función App: acciones de obras, sub obras, órdenes de compra, proveedores y pagos.)
  function sa(e, t) {
    const o = Number(t.presupuestoOriginal) || 0,
      a = Number(t.presupuesto) || o,
      r = t.proveedor.toUpperCase();
    (_t("Nuevo proveedor " + r + " en " + e),
      setProveedoresMap((i) => ({
        ...i,
        [e]: consolidarProveedores([...(i[e] || []), { proveedor: r, presupuestoOriginal: o, presupuesto: a, tc: tipoCambio }]),
      })),
      qn(r),
      xo((i) => ({ ...i, [e]: null })));
  }
  function br(e, t) {
    const o = Number(t.monto) || 0;
    (setPagosMap((a) => ({
      ...a,
      [e]: [
        ...(a[e] || []),
        {
          proveedor: t.proveedor.toUpperCase(),
          monto: o,
          fecha: t.fecha || "—",
          fc: t.fc || "—",
          observaciones: t.observaciones || "",
          tc: tipoCambio,
        },
      ],
    })),
      _t("Pago a " + t.proveedor.toUpperCase() + " en " + e + ": " + fmt(o)),
      st((a) => ({ ...a, [e]: null })));
  }
  function _n(e) {
    const t = obraKey(e.cliente, e.obra);
    if (e.subObra) {
      const o = costoSubobrasMap[t] || [],
        a = o.findIndex((r) => (r.nombre || "").trim().toUpperCase() === e.subObra.trim().toUpperCase());
      return a < 0
        ? { ok: false, motivo: 'No se encontró la sub obra "' + e.subObra + '" en ' + e.cliente + " / " + e.obra }
        : { ok: true, target: "sub", subK: subCostoKey(t, o[a].id) };
    }
    return obras.some((o) => obraKey(o.cliente, o.obra) === t)
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
      tc: tipoCambio,
    };
    return t.target === "sub"
      ? (subCostoProveedoresMap[t.subK] || []).some((i) => i.proveedor === e.proveedor)
        ? { ok: true, target: "sub", subK: t.subK, pago: o }
        : { ok: false, motivo: 'El proveedor "' + e.proveedor + '" no está cargado en esa sub obra' }
      : (proveedoresMap[t.key] || []).some((r) => r.proveedor === e.proveedor)
        ? { ok: true, target: "main", key: t.key, pago: o }
        : { ok: false, motivo: 'El proveedor "' + e.proveedor + '" no está cargado en esa obra' };
  }
  function za(e) {
    const t = e.filter((a) => a.target === "main"),
      o = e.filter((a) => a.target === "sub");
    (t.length &&
      setPagosMap((a) => {
        const r = { ...a };
        return (
          t.forEach(({ key: i, pago: u }) => {
            r[i] = [...(r[i] || []), u];
          }),
          r
        );
      }),
      o.length &&
        setSubCostoPagosMap((a) => {
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
    if (!(t.target === "sub" ? subCostoProveedoresMap[t.subK] || [] : proveedoresMap[t.key] || []).some((u) => u.proveedor === o)) {
      const u = Number(e.presupuestoOriginal) || 0,
        m = Number(e.presupuestoReal) || u;
      t.target === "sub"
        ? agregarProveedorSubObra(t.subK, { proveedor: o, presupuestoOriginal: u, presupuesto: m })
        : sa(t.key, { proveedor: o, presupuestoOriginal: u, presupuesto: m });
    }
    const i = {
      proveedor: o,
      monto: Number(e.importe) || 0,
      fecha: e.fecha,
      fc: e.factura,
      observaciones: e.observaciones || "",
      tc: tipoCambio,
      ...(e.origenSemanalId ? { _origenSemanalId: e.origenSemanalId } : {}),
    };
    return (
      za([{ target: t.target, key: t.key, subK: t.subK, pago: i }]),
      { ok: true, target: t.target, key: t.key, subK: t.subK }
    );
  }
  function yr(e, t, o) {
    (setProveedoresMap((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              proveedor: (o.proveedor || r.proveedor).toUpperCase(),
              presupuestoOriginal: Number(o.presupuestoOriginal) || 0,
              presupuesto: Number(o.presupuesto) || 0,
              tc: r.tc || tipoCambio,
            },
      ),
    })),
      _t("Editó proveedor en " + e + ": " + (o.proveedor || "").toUpperCase()));
  }
  function Sr(e, t) {
    const o = (proveedoresMap[e] || [])[t]?.proveedor || "";
    (setProveedoresMap((a) => ({ ...a, [e]: a[e].filter((r, i) => i !== t) })), _t("Borró proveedor " + o + " de " + e));
  }
  function xr(e) {
    (setMzLatamOcultoMap((t) => ({ ...t, [e]: true })), _t("Ocultó el proveedor MZ LATAM de " + e));
  }
  function Ar(e, t, o) {
    (setPagosMap((a) => ({
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
              tc: r.tc || tipoCambio,
            },
      ),
    })),
      _t("Editó pago en " + e + ": " + (o.proveedor || "").toUpperCase()));
  }
  function Cr(e, t) {
    const o = (pagosMap[e] || [])[t];
    (setPagosMap((a) => ({ ...a, [e]: a[e].filter((r, i) => i !== t) })),
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
      tc: tipoCambio,
      registradoEnCostos: false,
      motivoError: "",
      alertaPresupuesto: false,
      restanteAntesPago: 0,
    };
    setPagosSemanales((t) => [...t, e]);
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
        tc: tipoCambio,
        registradoEnCostos: false,
        motivoError: "",
        alertaPresupuesto: false,
        restanteAntesPago: 0,
        ...a,
        id: a.id || t + "-" + r + "-" + Math.random().toString(36).slice(2, 8),
      }));
    setPagosSemanales((a) => [...a, ...o]);
  }
  function zn(e, t) {
    setPagosSemanales((o) => o.map((a) => (a.id !== e ? a : { ...a, ...t })));
  }
  function Ir(e, t) {
    e && setProveedoresInfoMap((o) => ({ ...o, [e]: { ...(o[e] || {}), ...t } }));
  }
  function Dr(e, t, o) {
    const a = (e || "").trim().toUpperCase(),
      r = (t || "").trim().toUpperCase();
    !a ||
      !r ||
      obras.some((i) => obraKey(i.cliente, i.obra) === obraKey(a, r)) ||
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
    r && ((costoSubobrasMap[a] || []).some((i) => (i.nombre || "").trim().toUpperCase() === r) || Wa(a, r));
  }
  function Pr(e, t, o, a, r) {
    const i = (a || "").trim().toUpperCase();
    if (!i) return;
    const u = _n({ cliente: e, obra: t, subObra: o });
    if (!u.ok || (u.target === "sub" ? subCostoProveedoresMap[u.subK] || [] : proveedoresMap[u.key] || []).some((T) => T.proveedor === i)) return;
    const x = Number((r || {}).presupuestoOriginal) || 0,
      D = Number((r || {}).presupuestoReal) || x;
    u.target === "sub"
      ? agregarProveedorSubObra(u.subK, { proveedor: i, presupuestoOriginal: x, presupuesto: D })
      : sa(u.key, { proveedor: i, presupuestoOriginal: x, presupuesto: D });
  }
  function Ua(e) {
    (setPagosMap((t) => {
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
      setSubCostoPagosMap((t) => {
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
    const o = pagosSemanales.find((_) => _.id === e);
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
      const xe = (x.target === "sub" ? subCostoProveedoresMap[x.subK] || [] : proveedoresMap[x.key] || []).find((Ze) => Ze.proveedor === a),
        Ie = (xe && Number(xe.presupuesto)) || 0,
        Ge = (x.target === "sub" ? subCostoPagosMap[x.subK] || [] : pagosMap[x.key] || [])
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
    const o = pagosSemanales.find((a) => a.id === e);
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
    const t = pagosSemanales.find((o) => o.id === e);
    !t || !t.fechaPagado || t.registradoEnCostos || Ma(e, t.fechaPagado);
  }
  function Fr(e) {
    const t = pagosSemanales.find((o) => o.id === e);
    (Ua(e),
      setPagosSemanales((o) => o.filter((a) => a.id !== e)),
      _t("Borró línea de Pagos" + (t ? ": " + (t.proveedor || "—") + " / " + (t.cliente || "—") : "")));
  }
  function Wa(e, t) {
    (setCostoSubobrasMap((o) => ({
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
      setPagosSemanales((u) => {
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
    const r = costoSubobrasMap[e] || [],
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
      unificarSubObras(e, t, u, a);
      return;
    }
    (setCostoSubobrasMap((m) => ({ ...m, [e]: m[e].map((x, D) => (D !== t ? x : { ...x, nombre: a || x.nombre })) })),
      la(e, i.nombre, a));
  }
  function unificarSubObras(e, t, o, a) {
    const r = costoSubobrasMap[e] || [],
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
    (setCostoSubobrasMap((Ge) => ({ ...Ge, [e]: (Ge[e] || []).filter((Ze, le) => le !== t).map((Ze) => (Ze.id === u.id ? Ie : Ze)) })),
      setSubCostoProveedoresMap((Ge) => {
        const Ze = { ...Ge };
        return ((Ze[x] = consolidarProveedores([...(Ge[x] || []), ...(Ge[m] || [])])), delete Ze[m], Ze);
      }),
      setSubCostoPagosMap((Ge) => {
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
  function editarVentaSubObra(e, t, o) {
    setCostoSubobrasMap((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              ...r,
              venta: Number(o.venta) || 0,
              ordenCompra: o.ordenCompra !== void 0 ? o.ordenCompra : r.ordenCompra || "",
              tc: r.tc || tipoCambio,
            },
      ),
    }));
  }
  function aprenderNombreSubObra(e, t) {
    const o = String(e || "").trim(),
      a = String(t || "").trim();
    !o ||
      !a ||
      o.length < 5 ||
      normalizarTexto(o) === normalizarTexto(a) ||
      setCorreccionesAprendidas((r) => {
        const i = r || { cliente: {}, centroCosto: {}, subObra: {}, imputacion: {}, proveedor: {} },
          u = { ...(i.subObra || {}) };
        return ((u[normalizarTexto(o)] = a), { ...i, subObra: u });
      });
  }
  function importarOrdenCompraPdf(e, t, o, a, r) {
    (setCostoSubobrasMap((i) => {
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
          u[T] = { ...conMontoDeOC(O, t, D), tc: O.tc || tipoCambio };
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
                tc: tipoCambio,
              },
              t,
              D,
            ),
          );
        }),
        { ...i, [e]: u }
      );
    }),
      setOrdenesCompraMap((i) => {
        const u = i[e] || [];
        if (u.some((D) => (D.ordenCompra || "").trim().toUpperCase() === t.trim().toUpperCase())) return i;
        const x = normalizarFecha(r) || normalizarFecha(/* @__PURE__ */ new Date().toLocaleDateString("es-AR")) || "—";
        return {
          ...i,
          [e]: [...u, { ordenCompra: t, venta: o || 0, fecha: x, observaciones: "Importado de PDF", tc: tipoCambio }],
        };
      }),
      _t("Importó PDF de orden de compra " + t + " en " + e + " (" + a.length + " sub obra(s))"));
  }
  function agregarAdicionalSubObra(e, t, o) {
    const a = Number(o.monto) || 0,
      r = (costoSubobrasMap[e] || [])[t] || {},
      i = r.nombre || "SUB OBRA";
    (setCostoSubobrasMap((u) => ({
      ...u,
      [e]: u[e].map((m, x) =>
        x !== t
          ? m
          : {
              ...m,
              adicionales: [...(m.adicionales || []), { concepto: o.concepto || "ADICIONAL", monto: a, tc: tipoCambio }],
            },
      ),
    })),
      _t("Adicional en sub obra " + i + " (" + e + "): " + (o.concepto || "ADICIONAL") + " " + fmt(a)),
      xt((u) => ({ ...u, [subCostoKey(e, r.id)]: null })));
  }
  function editarAdicionalSubObra(e, t, o, a) {
    setCostoSubobrasMap((r) => ({
      ...r,
      [e]: r[e].map((i, u) =>
        u !== t
          ? i
          : {
              ...i,
              adicionales: (i.adicionales || []).map((m, x) =>
                x !== o ? m : { concepto: a.concepto || m.concepto, monto: Number(a.monto) || 0, tc: m.tc || tipoCambio },
              ),
            },
      ),
    }));
  }
  function borrarAdicionalSubObra(e, t, o) {
    setCostoSubobrasMap((a) => ({
      ...a,
      [e]: a[e].map((r, i) => (i !== t ? r : { ...r, adicionales: (r.adicionales || []).filter((u, m) => m !== o) })),
    }));
  }
  function alternarEstadoSubObra(e, t) {
    setCostoSubobrasMap((o) => ({
      ...o,
      [e]: o[e].map((a, r) =>
        r !== t ? a : { ...a, status: a.status === "FINALIZADA" ? "EN PROCESO" : "FINALIZADA" },
      ),
    }));
  }
  function alternarEstadoSubObraDesdePopup(e) {
    Zo &&
      (alternarEstadoSubObra(Zo.k, e),
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
  function borrarSubObra(e, t) {
    const o = (costoSubobrasMap[e] || [])[t] || {},
      a = subCostoKey(e, o.id);
    (setCostoSubobrasMap((r) => ({ ...r, [e]: r[e].filter((i, u) => u !== t) })),
      setSubCostoProveedoresMap((r) => {
        const i = { ...r };
        return (delete i[a], i);
      }),
      setSubCostoPagosMap((r) => {
        const i = { ...r };
        return (delete i[a], i);
      }));
  }
  function agregarProveedorSubObra(e, t) {
    const o = Number(t.presupuestoOriginal) || 0,
      a = Number(t.presupuesto) || o,
      r = t.proveedor.toUpperCase();
    (setSubCostoProveedoresMap((i) => ({
      ...i,
      [e]: consolidarProveedores([...(i[e] || []), { proveedor: r, presupuestoOriginal: o, presupuesto: a, tc: tipoCambio }]),
    })),
      qn(r),
      xo((i) => ({ ...i, [e]: null })));
  }
  function editarProveedorSubObra(e, t, o) {
    setSubCostoProveedoresMap((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              proveedor: (o.proveedor || r.proveedor).toUpperCase(),
              presupuestoOriginal: Number(o.presupuestoOriginal) || 0,
              presupuesto: Number(o.presupuesto) || 0,
              tc: r.tc || tipoCambio,
            },
      ),
    }));
  }
  function borrarProveedorSubObra(e, t) {
    setSubCostoProveedoresMap((o) => ({ ...o, [e]: o[e].filter((a, r) => r !== t) }));
  }
  function agregarPagoSubObra(e, t) {
    const o = Number(t.monto) || 0;
    (setSubCostoPagosMap((a) => ({
      ...a,
      [e]: [
        ...(a[e] || []),
        {
          proveedor: t.proveedor.toUpperCase(),
          monto: o,
          fecha: t.fecha || "—",
          fc: t.fc || "—",
          observaciones: t.observaciones || "",
          tc: tipoCambio,
        },
      ],
    })),
      st((a) => ({ ...a, [e]: null })));
  }
  function editarPagoSubObra(e, t, o) {
    setSubCostoPagosMap((a) => ({
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
              tc: r.tc || tipoCambio,
            },
      ),
    }));
  }
  function borrarPagoSubObra(e, t) {
    setSubCostoPagosMap((o) => ({ ...o, [e]: o[e].filter((a, r) => r !== t) }));
  }
  function ja(e) {
    e && e.code === "invalid_argument"
      ? setAvisoGuardado(
          "No se pudo guardar la factura: es muy pesada (probablemente por el PDF adjunto). Probá con un PDF de menos de 180 KB.",
        )
      : setAvisoGuardado("No se pudo guardar la factura. Verificá tu conexión."),
      mostrarErrorGuardado(
        Date.now(),
        "No se pudo guardar la factura (" + ((e && (e.code || e.message)) || "error desconocido") + ").",
      );
  }
  function Yr(e, t, o) {
    dbRef.current &&
      (dbRef.current
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
          tc: tipoCambio,
        })
        .then(() => setAvisoGuardado(null))
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
    if (!dbRef.current) return;
    const o = g.find((u) => u.id === e);
    if (!o) return;
    const { id: a, ...r } = o,
      i = dbRef.current.collection("facturasEdiciones");
    (i
      .add({ ...r, facturaIdOriginal: e, modificadaEn: Date.now() })
      .then(() => ca(i, Bn))
      .catch(() => {}),
      dbRef.current
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
          tc: o.tc || tipoCambio,
        })
        .then(() => setAvisoGuardado(null))
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
    if (!dbRef.current) return;
    const t = g.find((u) => u.id === e),
      o = dbRef.current.collection("facturas");
    if (!t) {
      o.doc(e)
        .delete()
        .catch(() => {});
      return;
    }
    _t("Borró factura en " + t.cliente + " / " + t.obra + (t.nro ? " N°" + t.nro : "") + ": " + fmt(t.importe));
    const { id: a, ...r } = t,
      i = dbRef.current.collection("facturasPapelera");
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
          setAvisoGuardado("Se eliminó la factura pero no se pudo guardar una copia de seguridad en la papelera."));
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
        dbRef.current.collection("facturasPapelera").get(),
        dbRef.current.collection("facturasEdiciones").get(),
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
    if (!dbRef.current) return;
    const { id: t, facturaIdOriginal: o, eliminadaEn: a, ...r } = e;
    try {
      const i = dbRef.current.collection("facturas");
      (o ? await i.doc(o).set(r) : await i.add(r),
        await dbRef.current
          .collection("facturasPapelera")
          .doc(t)
          .delete()
          .catch(() => {}),
        Un((u) => u.filter((m) => m.id !== t)));
    } catch {
      setAvisoGuardado("No se pudo restaurar la factura.");
    }
  }
  async function ti(e) {
    if (!dbRef.current) return;
    const { id: t, facturaIdOriginal: o, modificadaEn: a, ...r } = e;
    try {
      const i = dbRef.current.collection("facturas");
      (o ? await i.doc(o).set(r) : await i.add(r),
        await dbRef.current
          .collection("facturasEdiciones")
          .doc(t)
          .delete()
          .catch(() => {}),
        Mn((u) => u.filter((m) => m.id !== t)));
    } catch {
      setAvisoGuardado("No se pudo restaurar la factura.");
    }
  }
  const [ua, rn] = useState(null);
  async function oi(e) {
    if (dbRef.current) {
      try {
        (await dbRef.current.collection("facturasPapelera").doc(e).delete(), Un((t) => t.filter((o) => o.id !== e)));
      } catch {
        setAvisoGuardado("No se pudo eliminar de la papelera.");
      }
      rn(null);
    }
  }
  async function ni(e) {
    if (dbRef.current) {
      try {
        (await dbRef.current.collection("facturasEdiciones").doc(e).delete(), Mn((t) => t.filter((o) => o.id !== e)));
      } catch {
        setAvisoGuardado("No se pudo eliminar del historial.");
      }
      rn(null);
    }
  }
  async function ai() {
    !dbRef.current ||
      Pn.length === 0 ||
      (await Promise.all(
        Pn.map((e) =>
          dbRef.current
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
    !dbRef.current ||
      wn.length === 0 ||
      (await Promise.all(
        wn.map((e) =>
          dbRef.current
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
      obras.some((x) => {
        const D = obraKey(x.cliente, x.obra);
        return D === m && D !== e;
      })
    ) {
      alert('Ya existe una obra "' + i + '" para el cliente "' + r + '". Elegí otro nombre.');
      return;
    }
    if (
      (setObras((x) =>
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
            tc: D.tc || tipoCambio,
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
      (x(setProveedoresMap), x(setPagosMap), x(setAdicionalesMap), x(setOrdenesCompraMap), x(setCostoSubobrasMap));
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
        (D(setSubCostoProveedoresMap),
        D(setSubCostoPagosMap),
        setCfIngresosValores((T) => {
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
        setCfSalidasValores((T) => {
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
        setPagosSemanales((T) => {
          let O = false;
          const _ = T.map((xe) =>
            (xe.cliente || "").trim().toUpperCase() === o && (xe.centroCosto || "").trim().toUpperCase() === a
              ? ((O = true), { ...xe, cliente: r, centroCosto: i })
              : xe,
          );
          return O ? _ : T;
        }),
        dbRef.current)
      ) {
        const T = dbRef.current.collection("facturas");
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
    setObras((x) => x.filter((D) => obraKey(D.cliente, D.obra) !== o));
    const r = (x) =>
      x((D) => {
        if (!(o in D)) return D;
        const T = { ...D };
        return (delete T[o], T);
      });
    (r(setProveedoresMap), r(setPagosMap), r(setAdicionalesMap), r(setOrdenesCompraMap), r(setCostoSubobrasMap), r(setMzLatamOcultoMap));
    const i = (x) =>
      x((D) => {
        const T = o + "::subCosto::",
          O = Object.keys(D).filter((xe) => xe.startsWith(T));
        if (O.length === 0) return D;
        const _ = { ...D };
        return (O.forEach((xe) => delete _[xe]), _);
      });
    (i(setSubCostoProveedoresMap), i(setSubCostoPagosMap));
    const u = "pf|" + e + "|" + t + "|",
      m = (x, D) =>
        x((T) => {
          const O = Object.keys(T).filter((xe) => xe.startsWith(D));
          if (O.length === 0) return T;
          const _ = { ...T };
          return (O.forEach((xe) => delete _[xe]), _);
        });
    if (
      (m(setCfIngresosValores, u),
      m(setCfIngresosComentarios, u),
      setCfSalidasValores((x) => {
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
      dbRef.current && a.length > 0)
    ) {
      const x = dbRef.current.collection("facturas"),
        D = dbRef.current.collection("facturasPapelera");
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
    setObras((a) => a.map((r) => (obraKey(r.cliente, r.obra) === e ? { ...r, [t]: o } : r)));
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
          ? setPmCatalogo((m) => (m.includes(a) ? m : [...m, a].sort()))
          : setDdoCatalogo((m) => (m.includes(a) ? m : [...m, a].sort()))),
      _t("Asignó " + (o === "pm" ? "PM" : "DDO") + " " + a + " a " + e + " - " + t + " (desde Operaciones)"));
  }
  function di(e, t) {
    const o = e.trim().toUpperCase(),
      a = t.trim().toUpperCase();
    !o ||
      !a ||
      o === a ||
      (setProveedoresMap((r) => {
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
      setPagosMap((r) => {
        const i = {};
        return (
          Object.entries(r).forEach(([u, m]) => {
            i[u] = m.map((x) => (x.proveedor === o ? { ...x, proveedor: a } : x));
          }),
          i
        );
      }),
      setSubCostoProveedoresMap((r) => {
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
      setSubCostoPagosMap((r) => {
        const i = {};
        return (
          Object.entries(r).forEach(([u, m]) => {
            i[u] = m.map((x) => (x.proveedor === o ? { ...x, proveedor: a } : x));
          }),
          i
        );
      }),
      setProveedoresCatalogo((r) => {
        const i = r.filter((u) => u !== o);
        return i.includes(a) ? i.sort() : [...i, a].sort();
      }),
      setCfSalidasValores((r) => {
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
    t && setProveedoresCatalogo((o) => (o.includes(t) ? o : [...o, t].sort()));
  }
  function ci(e, t) {
    const o = Number(t.monto) || 0;
    (setAdicionalesMap((a) => ({ ...a, [e]: [...(a[e] || []), { concepto: t.concepto || "ADICIONAL", monto: o, tc: tipoCambio }] })),
      _t("Adicional en " + e + ": " + (t.concepto || "ADICIONAL") + " " + fmt(o)),
      $t(null));
  }
  function ui(e, t, o) {
    setAdicionalesMap((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t ? r : { concepto: o.concepto || r.concepto, monto: Number(o.monto) || 0, tc: r.tc || tipoCambio },
      ),
    }));
  }
  function borrarAdicionalObra(e, t) {
    (setAdicionalesMap((o) => ({ ...o, [e]: o[e].filter((a, r) => r !== t) })), _t("Borró adicional en " + e));
  }
  function agregarOrdenCompra(e, t) {
    const o = Number(t.venta) || 0;
    (setOrdenesCompraMap((a) => ({
      ...a,
      [e]: [
        ...(a[e] || []),
        {
          ordenCompra: t.ordenCompra || "",
          venta: o,
          fecha: normalizarFecha(t.fecha) || "—",
          observaciones: t.observaciones || "",
          tc: tipoCambio,
        },
      ],
    })),
      _t("Nueva orden de compra en " + e + ": " + fmt(o)),
      ao(null));
  }
  function editarOrdenCompra(e, t, o) {
    setOrdenesCompraMap((a) => ({
      ...a,
      [e]: a[e].map((r, i) =>
        i !== t
          ? r
          : {
              ordenCompra: o.ordenCompra !== void 0 ? o.ordenCompra : r.ordenCompra,
              venta: Number(o.venta) || 0,
              fecha: o.fecha ? normalizarFecha(o.fecha) : r.fecha,
              observaciones: o.observaciones !== void 0 ? o.observaciones : r.observaciones,
              tc: r.tc || tipoCambio,
            },
      ),
    }));
  }
  function borrarOrdenCompra(e, t) {
    const o = (((ordenesCompraMap[e] || [])[t] || {}).ordenCompra || "").trim();
    (setOrdenesCompraMap((a) => ({ ...a, [e]: a[e].filter((r, i) => i !== t) })),
      o &&
        setCostoSubobrasMap((a) => {
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
  function importarOrdenesCompraExcel(e, t) {
    const o = t
      .filter((a) => a.ordenCompra || a.venta)
      .map((a) => ({
        ordenCompra: a.ordenCompra || "",
        venta: a.venta || 0,
        fecha: normalizarFecha(a.fecha) || "—",
        observaciones: a.observaciones || "",
      }));
    return (o.length && setOrdenesCompraMap((a) => ({ ...a, [e]: [...(a[e] || []), ...o] })), o.length);
  }
  function Ha(e) {
    const t = e.status === "FINALIZADA" ? "EN PROCESO" : "FINALIZADA";
    (setObras((o) => o.map((a) => (obraKey(a.cliente, a.obra) !== obraKey(e.cliente, e.obra) ? a : { ...a, status: t }))),
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
            return { proveedor: i, presupuestoOriginal: u, presupuesto: m, tc: tipoCambio };
          })
          .filter((r) => r.proveedor);
        a.length &&
          (setProveedoresMap((r) => ({ ...r, [e]: consolidarProveedores([...(r[e] || []), ...a]) })),
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
            return { proveedor: i, monto: u, fecha: m ? String(m) : "—", fc: x, observaciones: D, tc: tipoCambio };
          })
          .filter((r) => r.proveedor && r.monto);
        a.length && setPagosMap((r) => ({ ...r, [e]: [...(r[e] || []), ...a] }));
      } catch {}
  }
  function Ya(e, t) {
    const o = e === "costos",
      a = o
        ? ["Proveedor", "Presupuesto Original", "Presupuesto Real"]
        : ["Proveedor", "Monto", "Fecha", "N° FC", "Observaciones"],
      r = proveedoresMap[t] || [];
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
            return { proveedor: i, presupuestoOriginal: u, presupuesto: m, tc: tipoCambio };
          })
          .filter((r) => r.proveedor);
        a.length &&
          (setSubCostoProveedoresMap((r) => ({ ...r, [e]: consolidarProveedores([...(r[e] || []), ...a]) })),
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
            return { proveedor: i, monto: u, fecha: m ? String(m) : "—", fc: x, observaciones: D, tc: tipoCambio };
          })
          .filter((r) => r.proveedor && r.monto);
        a.length && setSubCostoPagosMap((r) => ({ ...r, [e]: [...(r[e] || []), ...a] }));
      } catch {}
  }
  function Ka(e, t) {
    const o = e === "costos",
      a = o
        ? ["Proveedor", "Presupuesto Original", "Presupuesto Real"]
        : ["Proveedor", "Monto", "Fecha", "N° FC", "Observaciones"],
      r = subCostoProveedoresMap[t] || [];
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
    const a = new Set(obras.map((u) => obraKey(u.cliente, u.obra))),
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
      r.length && setObras((u) => [...u, ...r]),
      o && r.length && dbRef.current)
    ) {
      const u = dbRef.current.collection("facturas");
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
      o = dbRef.current ? dbRef.current.collection("facturas") : null;
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
    if (!dbRef.current) return false;
    const t = dbRef.current.collection("facturas");
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
      o = proveedoresMap[t] || [],
      a = pagosMap[t] || [],
      r = g.filter((O) => O.cliente === e.cliente && O.obra === e.obra),
      i = costoSubobrasMap[t] || [],
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
        xe = subCostoProveedoresMap[_] || [],
        Ie = subCostoPagosMap[_] || [];
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
