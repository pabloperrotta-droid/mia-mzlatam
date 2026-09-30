/*
 * Órdenes de pago en Xubio a partir de las líneas de Pagos de MIA (pedido del usuario, 30/09/2026):
 *   1. Al cargar la línea, MIA pone el centro de costo en la factura (ver procesar.js). Tiene que ser
 *      antes de la OP porque Xubio no deja modificar facturas ya canceladas.
 *   2. El usuario sube a MIA el Excel de e-cheqs emitidos del banco (colección `echeqs`).
 *   3. Cuando tilda la línea como pagada (Fecha Pagado), se arma la OP de ese proveedor y ese día:
 *        - una OP por proveedor (CUIT) y Fecha Pagado, con todas sus líneas;
 *        - retención de Ganancias igual que el botón "Retenciones" de MIA: sobre el Importe Bruto
 *          (sin IVA) de las facturas A, MAT 2% sobre lo que pase de $224.000 (Enajenación Bs. Cambio
 *          y Bs. Muebles), MO 2% sobre lo que pase de $67.170 (Locación de Obras y/o Servicios);
 *          se descuenta de los cheques si hay E-Cheq, si no de la transferencia;
 *        - cheques: los del Excel del banco con ese CUIT y esa fecha de emisión; tienen que sumar
 *          E-Cheq − retención;
 *        - transferencia → Banco Santander Rio; efectivo → Caja.
 *   El resultado queda en `xubioOP/{cuit}_{fecha}` y MIA lo muestra en Pagos.
 *   En Producción la OP se crea en Xubio al tildar la línea como pagada (pedido del usuario: "es el
 *   mismo checkbox o el mismo campo de fecha de pagado"). En QA solo se muestra la vista previa.
 *   Xubio asigna solo el número de OP y el del certificado de retención. La OP no lleva observación:
 *   se aplica a las facturas a mano en Xubio y ahí queda el número de factura.
 */
const { xubio, buscarFactura, buscarProveedor, comoLista, idDe } = require("./xubio");

const CUENTA_CHEQUES = { ID: 799621, id: 799621, nombre: "Cheques diferidos Banco Santander Rio" };
const BANCO_SANTANDER = { ID: 47, id: 47, nombre: "Banco Santander Río" };
const CUENTA_TRANSFERENCIA = { ID: 799624, id: 799624, nombre: "Banco Santander Rio" };
const CUENTA_CAJA = { ID: -13, id: -13, nombre: "Caja" };
const PESOS = { ID: -2, id: -2, nombre: "Pesos Argentinos" };
const CONCEPTO_MAT = { ID: -60, id: -60, nombre: "Enajenación Bs. Cambio y Bs. Muebles" };
const CONCEPTO_MO = { ID: -61, id: -61, nombre: "Locación de Obras y/o Servicios" };

const soloDigitos = (s) => String(s || "").replace(/\D/g, "");
const num = (v) => Number(v) || 0;
const r2 = (v) => Math.round(v * 100) / 100;
// "25/09/2026" → "2026-09-25"
function fechaISO(s) {
  const m = String(s || "").match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  return m ? m[3] + "-" + m[2].padStart(2, "0") + "-" + m[1].padStart(2, "0") : "";
}
const claveGrupo = (l) => soloDigitos(l.cuit) + "_" + fechaISO(l.fechaPagado);

// Misma cuenta que calcularRetencionGananciasProveedor() de MIA.
function retencion(lineas) {
  const a = lineas.filter((l) => l.facturaA);
  const mat = a.filter((l) => l.mat && !l.mo).reduce((s, l) => s + num(l.importeBruto), 0);
  const mo = a.filter((l) => l.mo && !l.mat).reduce((s, l) => s + num(l.importeBruto), 0);
  const retMat = mat > 224000 ? r2((mat - 224000) * 0.02) : 0;
  const retMo = mo > 67170 ? r2((mo - 67170) * 0.02) : 0;
  return { mat, mo, retMat, retMo, total: r2(retMat + retMo) };
}

/*
 * Arma la OP de un grupo (mismo proveedor y Fecha Pagado). No escribe nada en Xubio.
 * `estadosCentro`: resultado del centro de costo por línea (xubioEstado).
 * `cheques`: e-cheqs del banco disponibles para este CUIT y fecha.
 */
async function armarOP(lineas, cheques, estadosCentro) {
  const l0 = lineas[0];
  const cuit = soloDigitos(l0.cuit);
  const fecha = fechaISO(l0.fechaPagado);
  const res = { cuit, fecha, lineas: lineas.map((l) => l.id), proveedorMia: l0.proveedorPago || l0.proveedor || "" };

  // Facturas en Xubio (tienen que estar encontradas; el centro ya puesto).
  const facturas = [];
  const sinCentro = [];
  for (const l of lineas) {
    const e = estadosCentro[l.id];
    if (!e || (e.estado !== "ok" && e.estado !== "ya_estaba")) sinCentro.push(l.factura);
    const f = await buscarFactura({ cuit, factura: l.factura, fecha: l.fechaPagado });
    if (f.estado !== "encontrada")
      return { ...res, estado: "falta_factura", mensaje: "Factura " + l.factura + ": " + (f.mensaje || f.estado) };
    facturas.push({ linea: l.id, numero: f.comprobante.numeroDocumento, id: f.comprobante.transaccionid, total: f.comprobante.importetotal });
  }
  res.facturas = facturas;
  // Primero el centro de costo: Xubio no deja cambiarlo una vez que la factura tiene la OP aplicada.
  if (sinCentro.length)
    return {
      ...res,
      estado: "esperando_centro",
      mensaje:
        "Primero tiene que quedar ✅ el centro de costo de: " + sinCentro.join(", ") +
        " (Xubio no deja cambiarlo después de la OP). Se vuelve a probar sola.",
    };

  const prov = await buscarProveedor(cuit);
  if (!prov) return { ...res, estado: "falta_proveedor", mensaje: "No hay en Xubio un proveedor con CUIT " + cuit + "." };
  const provId = prov.proveedorid != null ? prov.proveedorid : idDe(prov);
  res.proveedorXubio = prov.nombre || prov.razonSocial;

  const echeq = lineas.reduce((s, l) => s + num(l.echeq), 0);
  const transf = lineas.reduce((s, l) => s + num(l.transferencia), 0);
  const efectivo = lineas.reduce((s, l) => s + num(l.efectivo), 0);
  const diegoLevy = lineas.reduce((s, l) => s + num(l.diegoLevy), 0);
  const ret = retencion(lineas);
  const retEnCheques = echeq > 0 ? ret.total : 0;
  const retEnTransf = echeq > 0 ? 0 : transf > 0 ? ret.total : 0;
  const retAplicada = retEnCheques + retEnTransf;
  const esperadoCheques = r2(echeq - retEnCheques);
  const sumaCheques = r2(cheques.reduce((s, c) => s + num(c.importe), 0));
  res.importes = {
    echeq: r2(echeq),
    transferencia: r2(transf - retEnTransf),
    efectivo: r2(efectivo),
    diegoLevy: r2(diegoLevy),
    retencion: r2(retAplicada),
    chequesEsperado: esperadoCheques,
    chequesBanco: sumaCheques,
    totalFacturas: r2(lineas.reduce((s, l) => s + num(l.importe), 0)),
  };
  res.cheques = cheques.map((c) => ({ numero: c.numero, vencimiento: c.fechaPago, importe: num(c.importe) }));
  res.retenciones = [];
  if (retAplicada > 0) {
    if (ret.retMat > 0) res.retenciones.push({ concepto: CONCEPTO_MAT.nombre, base: r2(ret.mat), importe: ret.retMat });
    if (ret.retMo > 0) res.retenciones.push({ concepto: CONCEPTO_MO.nombre, base: r2(ret.mo), importe: ret.retMo });
  }

  if (echeq > 0 && cheques.length === 0)
    return { ...res, estado: "faltan_cheques", mensaje: "Faltan los e-cheqs del banco para este proveedor y fecha: subí el Excel del banco." };
  if (echeq > 0 && Math.abs(sumaCheques - esperadoCheques) > 1)
    return {
      ...res,
      estado: "no_coincide",
      mensaje:
        "Los e-cheqs del banco suman $" + sumaCheques.toLocaleString("es-AR") + " y en MIA corresponden $" +
        esperadoCheques.toLocaleString("es-AR") + " (E-Cheq menos retención).",
    };
  if (echeq === 0 && cheques.length > 0)
    return { ...res, estado: "no_coincide", mensaje: "Hay e-cheqs del banco para este proveedor y fecha, pero en MIA no tiene E-Cheq." };

  const instrumentos = [
    ...cheques.map((c) => ({
      tipoCuenta: 4,
      cuenta: CUENTA_CHEQUES,
      moneda: PESOS,
      cotizacion: 1,
      importe: num(c.importe),
      chequePropio: String(c.numero).replace(/^0+/, ""),
      vencimientoCheque: c.fechaPago,
      banco: BANCO_SANTANDER,
      descripcion: "",
    })),
  ];
  if (res.importes.transferencia > 0)
    instrumentos.push({ tipoCuenta: 2, cuenta: CUENTA_TRANSFERENCIA, moneda: PESOS, cotizacion: 1, importe: res.importes.transferencia, descripcion: "" });
  if (efectivo > 0) instrumentos.push({ tipoCuenta: 1, cuenta: CUENTA_CAJA, moneda: PESOS, cotizacion: 1, importe: r2(efectivo), descripcion: "" });
  if (!instrumentos.length) return { ...res, estado: "sin_valores", mensaje: "La línea no tiene E-Cheq, Transferencia ni Efectivo." };

  const retItems = [];
  if (retAplicada > 0) {
    if (ret.retMat > 0)
      retItems.push({ tipoRetencion: "4", conceptoRetencion: CONCEPTO_MAT, descripcion: "", moneda: PESOS, cotizacion: 1, importeISAR: r2(ret.mat), importeRetenido: ret.retMat, importeMonPpal: ret.retMat, fechaComprobante: fecha });
    if (ret.retMo > 0)
      retItems.push({ tipoRetencion: "4", conceptoRetencion: CONCEPTO_MO, descripcion: "", moneda: PESOS, cotizacion: 1, importeISAR: r2(ret.mo), importeRetenido: ret.retMo, importeMonPpal: ret.retMo, fechaComprobante: fecha });
  }
  res.cuerpo = {
    circuitoContable: { ID: -2, id: -2 },
    proveedor: { ID: provId, id: provId },
    fecha,
    cotizacion: 1,
    utilizaMonedaExtranjera: 0,
    moneda: PESOS,
    observacion: "",
    transaccionInstrumentoDePago: instrumentos,
    transaccionRetencionItems: retItems,
  };
  res.aviso = [diegoLevy > 0 ? "Diego Levy ($" + r2(diegoLevy).toLocaleString("es-AR") + ") no va en la OP." : ""]
    .filter(Boolean)
    .join(" ");
  return { ...res, estado: "lista", mensaje: "OP lista para crear en Xubio." };
}

// Crea la OP en Xubio. Antes se fija que no exista ya una del mismo proveedor, fecha e importe.
async function crearOP(cuerpo) {
  const total = r2(
    cuerpo.transaccionInstrumentoDePago.reduce((s, i) => s + num(i.importe), 0) +
      cuerpo.transaccionRetencionItems.reduce((s, i) => s + num(i.importeRetenido), 0),
  );
  const existentes = comoLista(await xubio("GET", "/pagoBean?fechaDesde=" + cuerpo.fecha + "&fechaHasta=" + cuerpo.fecha));
  const igual = existentes.find(
    (op) =>
      idDe(op.proveedor) === cuerpo.proveedor.ID &&
      Math.abs(
        r2(
          comoLista(op.transaccionInstrumentoDePago).reduce((s, i) => s + num(i.importe), 0) +
            comoLista(op.transaccionRetencionItems).reduce((s, i) => s + num(i.importeRetenido), 0),
        ) - total,
      ) < 1,
  );
  if (igual) return { estado: "ya_existia", numero: igual.numeroRecibo, id: igual.transaccionid };
  const creada = await xubio("POST", "/pagoBean", cuerpo);
  return { estado: "creada", numero: creada && creada.numeroRecibo, id: creada && creada.transaccionid };
}

module.exports = { armarOP, crearOP, claveGrupo, fechaISO, retencion };
