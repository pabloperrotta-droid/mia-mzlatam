// Prueba pedida por soporte de Xubio (07/10/2026), autorizada por el usuario: PUT del JSON que mandó Xubio sobre
// la factura de compra 77723999 (A-00011-00008239). Lee antes, guarda, lee después. Solo informa centros e importes.
const { xubio, comoLista, idDe } = require("./xubio.js");
const ID = 77723999;
const cuerpo = {
  externalId: "", numeroDocumento: "A-00011-00008239", descripcion: "", fecha: "2026-09-25",
  importeGravado: 152479.34, importeImpuestos: 32020.66, importetotal: 184500,
  moneda: { ID: -2, nombre: "Pesos Argentinos", codigo: "PESOS_ARGENTINOS", id: -2 },
  circuitoContable: { ID: -2, nombre: "default", codigo: "DEFAULT", id: -2 },
  cotizacion: 1, fechaVto: "2026-09-25", cotizacionListaDePrecio: 1,
  deposito: { ID: -2, nombre: "Depósito Universal", codigo: "DEPOSITO_UNIVERSAL", id: -2 },
  provincia: { ID: 1, nombre: "Buenos Aires", codigo: "BUENOS_AIRES", id: 1 },
  condicionDePago: 1, transaccionid: 77723999, fechaComprobante: "2026-09-25",
  transaccionProductoItems: [{
    transaccionCVItemId: 95921824, importe: 152479.34, descripcion: "",
    centroDeCosto: { ID: 61321, nombre: "WU MARTIN CORONADO", codigo: "WU_MARTIN_CORONADO", id: 61321 },
    cantidad: 1, precio: 152479.34,
    producto: { ID: 2676728, nombre: "MATERIALES", codigo: "MATERIALES", id: 2676728 },
    deposito: { ID: -2, nombre: "Depósito Universal", codigo: "DEPOSITO_UNIVERSAL", id: -2 },
    iva: 32020.66, total: 184500, precioconivaincluido: 0, montoExento: 0, porcentajeDescuento: 0, transaccionId: 77723999,
  }],
  proveedor: { ID: 6357339, nombre: "JORGE FERNANDEZ  Y  SILVIA CHUMBA   SH", codigo: "JORGE_FERNANDEZ_Y_SILVIA_CHUMBA_SH", id: 6357339 },
  tipo: 1, transaccionPercepcionItems: [], transaccionOrdenPagoItems: [], fechaFiscal: "2026-09-25", puntoVenta: "00011", cbuinformada: false,
};
const resumen = (f) => {
  const items = comoLista(f.transaccionProductoItems);
  return "total " + f.importetotal + " | items " + items.length + " | centros " + items.map((it) => (it.centroDeCosto && it.centroDeCosto.nombre) || idDe(it.centroDeCosto) || "-").join(",") +
    " | itemIds " + items.map((it) => it.transaccionCVItemId).join(",") + " | OP " + comoLista(f.transaccionOrdenPagoItems).length;
};
(async () => {
  const antes = await xubio("GET", "/comprobanteCompraBean/" + ID);
  console.log("::notice::ANTES " + resumen(antes));
  if (Math.abs(Number(antes.importetotal) - 184500) > 1) { console.log("::error::El total no es 184500: no se manda nada."); process.exit(1); }
  try {
    await xubio("PUT", "/comprobanteCompraBean/" + ID, cuerpo);
    console.log("::notice::PUT OK");
  } catch (e) {
    console.log("::error::PUT rechazado: " + String((e && e.message) || e).slice(0, 600).replace(/\n/g, " "));
  }
  const despues = await xubio("GET", "/comprobanteCompraBean/" + ID);
  console.log("::notice::DESPUES " + resumen(despues));
})().catch((e) => { console.log("::error::" + String((e && e.message) || e).slice(0, 600).replace(/\n/g, " ")); process.exit(1); });
