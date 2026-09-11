const { useState, useEffect, useMemo, useRef } = React;
const { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Legend } = Recharts;

function ChevronRight({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 18 6-6-6-6" /></svg>; }
function Plus({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14" /><path d="M12 5v14" /></svg>; }
function X({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>; }
function PieIcon({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" /><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /></svg>; }
function ArrowLeft({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>; }
function Upload({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>; }
function Pencil({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>; }
function Trash2({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>; }
function Eye({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>; }
function Download({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>; }
function Paperclip({ size = 24, ...p }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>; }

const PDF_MAX_BYTES = 180 * 1024;

const NAVY = "#1A1A1A";
const NAVY_DEEP = "#000000";
const GOLD = "#C9A227";
const BG = "#F5F4F2";
const BORDER = "#DEDBD1";
const TEXT = "#1A1A1A";
const MUTED = "#6E6E6E";
const GREEN = "#3F6B4A";
const RED = "#B03A2E";
const CARD_SHADOW = "0 1px 2px rgba(20, 20, 20, 0.04), 0 4px 14px rgba(20, 20, 20, 0.05)";
const CARD_STYLE = { background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW };
const PIE_COLORS = ["#1A1A1A", "#C9A227", "#6E6E6E", "#B08D3E", "#3F6B4A", "#8C8577", "#D9C27A", "#4C4C4C", "#A68A4A", "#2B2B2E", "#E3C67A", "#8A6A1E"];
const MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];

const SEED_OBRAS = [{"cliente": "SABORES EXPRESS", "obra": "RETIRO", "status": "FINALIZADA", "costoInicial": 59793175, "costoFinal": 69211384, "ventaOriginal": 76049787, "mes": "FEBRERO", "anio": 2026}, {"cliente": "NEW ARRECIFE", "obra": "UNICENTER", "status": "FINALIZADA", "costoInicial": 2533333, "costoFinal": 2533333, "ventaOriginal": 3800000, "mes": "FEBRERO", "anio": 2026}, {"cliente": "LIDHERMA", "obra": "CABELLO", "status": "FINALIZADA", "costoInicial": 36197694, "costoFinal": 35287186, "ventaOriginal": 45697804, "mes": "FEBRERO", "anio": 2026}, {"cliente": "WU", "obra": "WU CIVIL WORK", "status": "EN PROCESO", "costoInicial": 435047651, "costoFinal": 435047651, "ventaOriginal": 609066712, "mes": "FEBRERO", "anio": 2026}, {"cliente": "COPELAND", "obra": "SUIPACHA", "status": "FINALIZADA", "costoInicial": 7592098, "costoFinal": 7592098, "ventaOriginal": 11483940, "mes": "FEBRERO", "anio": 2026}, {"cliente": "YKU", "obra": "TERRAZAS DE MAYO", "status": "FINALIZADA", "costoInicial": 53573000, "costoFinal": 69492551, "ventaOriginal": 64753555, "mes": "MARZO", "anio": 2026}, {"cliente": "SPRINGWALL", "obra": "SPRINGWALL LIBERTADOR", "status": "FINALIZADA", "costoInicial": 1100000, "costoFinal": 1100000, "ventaOriginal": 1500000, "mes": "ABRIL", "anio": 2026}, {"cliente": "SHANGAI", "obra": "SHANGAI CORRIENTES", "status": "FINALIZADA", "costoInicial": 190764731, "costoFinal": 198183648, "ventaOriginal": 245000000, "mes": "ABRIL", "anio": 2026}, {"cliente": "REEF", "obra": "REEF ABASTO", "status": "FINALIZADA", "costoInicial": 29869866, "costoFinal": 29343774, "ventaOriginal": 29263568, "mes": "ABRIL", "anio": 2026}, {"cliente": "PANDORA", "obra": "SALTA", "status": "FINALIZADA", "costoInicial": 81854824, "costoFinal": 1326990, "ventaOriginal": 122782235, "mes": "ABRIL", "anio": 2026}, {"cliente": "PANDORA", "obra": "UNICENTER", "status": "EN PROCESO", "costoInicial": 0, "costoFinal": 5316000, "ventaOriginal": 105965444, "mes": "ABRIL", "anio": 2026}, {"cliente": "SABORES EXPRESS", "obra": "VILLA DEL PARQUE", "status": "FINALIZADA", "costoInicial": 49318778, "costoFinal": 61071337, "ventaOriginal": 60900000, "mes": "MAYO", "anio": 2026}, {"cliente": "B+D", "obra": "GALERIAS PACIFICO", "status": "FINALIZADA", "costoInicial": 15626000, "costoFinal": 15848443, "ventaOriginal": 22400000, "mes": "MAYO", "anio": 2026}, {"cliente": "B+D", "obra": "DEVOTO SHOPPING", "status": "FINALIZADA", "costoInicial": 15686000, "costoFinal": 15848443, "ventaOriginal": 22400000, "mes": "MAYO", "anio": 2026}, {"cliente": "DESPEGAR", "obra": "UNICENTER", "status": "EN PROCESO", "costoInicial": 104114312, "costoFinal": 108966147, "ventaOriginal": 133554321, "mes": "MAYO", "anio": 2026}, {"cliente": "SPRINGWALL", "obra": "JUAN B JUSTO", "status": "FINALIZADA", "costoInicial": 1933333, "costoFinal": 1933333, "ventaOriginal": 2900000, "mes": "JUNIO", "anio": 2026}, {"cliente": "DESPEGAR", "obra": "SOLEIL FACTORY", "status": "EN PROCESO", "costoInicial": 21126000, "costoFinal": 21126000, "ventaOriginal": 28097580, "mes": "JUNIO", "anio": 2026}, {"cliente": "SABORES EXPRESS", "obra": "LANUS", "status": "EN PROCESO", "costoInicial": 50954473, "costoFinal": 52743714, "ventaOriginal": 60900000, "mes": "JULIO", "anio": 2026}, {"cliente": "SABORES EXPRESS", "obra": "VALENTIN ALSINA", "status": "EN PROCESO", "costoInicial": 52049180, "costoFinal": 56358673, "ventaOriginal": 63500000, "mes": "JULIO", "anio": 2026}, {"cliente": "NATURA", "obra": "NATURA CABILDO", "status": "EN PROCESO", "costoInicial": 112578135, "costoFinal": 112578135, "ventaOriginal": 158024354, "mes": "AGOSTO", "anio": 2026}, {"cliente": "NATURA", "obra": "NATURA SANTA FE", "status": "EN PROCESO", "costoInicial": 112578135, "costoFinal": 112578135, "ventaOriginal": 154444815, "mes": "AGOSTO", "anio": 2026}, {"cliente": "NATURA", "obra": "NATURA UNICENTER", "status": "EN PROCESO", "costoInicial": 112578135, "costoFinal": 112578135, "ventaOriginal": 154444815, "mes": "AGOSTO", "anio": 2026}, {"cliente": "PANDORA", "obra": "PANDORA ALCORTA", "status": "EN PROCESO", "costoInicial": 3605000, "costoFinal": 3605000, "ventaOriginal": 7931000, "mes": "AGOSTO", "anio": 2026}, {"cliente": "DESPEGAR", "obra": "PLAZA OESTE", "status": "EN PROCESO", "costoInicial": 24500000, "costoFinal": 24500000, "ventaOriginal": 29027844, "mes": "AGOSTO", "anio": 2026}, {"cliente": "B+D", "obra": "PLAZA OESTE", "status": "EN PROCESO", "costoInicial": 2700000, "costoFinal": 2700000, "ventaOriginal": 3550000, "mes": "AGOSTO", "anio": 2026}, {"cliente": "NATURA", "obra": "DESMONTE GONDOLA", "status": "EN PROCESO", "costoInicial": 2680000, "costoFinal": 2680000, "ventaOriginal": 4480000, "mes": "AGOSTO", "anio": 2026}];
const SEED_ADICIONALES = {"SABORES EXPRESS|RETIRO": [{"concepto": "ADICIONALES (histórico)", "monto": 2590507}], "LIDHERMA|CABELLO": [{"concepto": "ADICIONALES (histórico)", "monto": 840000}], "YKU|TERRAZAS DE MAYO": [{"concepto": "ADICIONALES (histórico)", "monto": 21425060}], "SHANGAI|SHANGAI CORRIENTES": [{"concepto": "ADICIONALES (histórico)", "monto": 10570000}], "REEF|REEF ABASTO": [{"concepto": "ADICIONALES (histórico)", "monto": 5163526}], "PANDORA|SALTA": [{"concepto": "ADICIONALES (histórico)", "monto": 12561262}], "PANDORA|UNICENTER": [{"concepto": "ADICIONALES (histórico)", "monto": 5775000}], "SABORES EXPRESS|VILLA DEL PARQUE": [{"concepto": "ADICIONALES (histórico)", "monto": 3804727}], "B+D|GALERIAS PACIFICO": [{"concepto": "ADICIONALES (histórico)", "monto": 3713480}], "B+D|DEVOTO SHOPPING": [{"concepto": "ADICIONALES (histórico)", "monto": 855500}], "DESPEGAR|UNICENTER": [{"concepto": "ADICIONALES (histórico)", "monto": 7000000}], "SABORES EXPRESS|LANUS": [{"concepto": "ADICIONALES (histórico)", "monto": 1809000}]};

// Detalle de proveedores cargado como ejemplo para PANDORA | UNICENTER (del archivo que compartiste)
const SEED_PROVEEDORES = {
  "PANDORA|UNICENTER": [{"proveedor": "EUROLAMP", "presupuestoOriginal": 9223010, "presupuesto": 9049510}, {"proveedor": "ALL INK", "presupuestoOriginal": 1700000, "presupuesto": 1700000}, {"proveedor": "TEODORU", "presupuestoOriginal": 2929050, "presupuesto": 4699050}, {"proveedor": "CHECK CLIMATIZACION", "presupuestoOriginal": 1598853, "presupuesto": 3195700}, {"proveedor": "CMD MUDANZAS GUARADADO", "presupuestoOriginal": 0, "presupuesto": 2900000}, {"proveedor": "CASAS", "presupuestoOriginal": 15314000, "presupuesto": 18734000}, {"proveedor": "MATERIALES", "presupuestoOriginal": 16147312, "presupuesto": 9608822}, {"proveedor": "RUBEN", "presupuestoOriginal": 3500000, "presupuesto": 3600000}, {"proveedor": "ELECTRICA MAIPU", "presupuestoOriginal": 8348678, "presupuesto": 8348678}, {"proveedor": "DESMONTE", "presupuestoOriginal": 1200000, "presupuesto": 0}, {"proveedor": "PROVISIÓN DE 4 PARLANTES DE EMBUTIR", "presupuestoOriginal": 248552, "presupuesto": 0}, {"proveedor": "PALAVECINO", "presupuestoOriginal": 4000000, "presupuesto": 4950000}, {"proveedor": "DONATO + ESTIMACIÓN+ ZOCALO ACERO", "presupuestoOriginal": 4500000, "presupuesto": 4500000}, {"proveedor": "FUMAGALLI", "presupuestoOriginal": 2930000, "presupuesto": 2929752}, {"proveedor": "IMAK", "presupuestoOriginal": 800000, "presupuesto": 800000}, {"proveedor": "PROVISIÓN DE MICROONDAS", "presupuestoOriginal": 261000, "presupuesto": 155000}, {"proveedor": "PROVISIÓN DE HELADERA / FRIGOBAR", "presupuestoOriginal": 372999, "presupuesto": 339400}, {"proveedor": "PROVISION Y ARMADO DE ESCRITORIO + SILLA", "presupuestoOriginal": 509000, "presupuesto": 375000}, {"proveedor": "PROVISIÓN Y ARMADO DE ESTANTERIAS TIPO RACK DE 90*42*200, RE", "presupuestoOriginal": 823848, "presupuesto": 0}, {"proveedor": "LIMPIEZA DE OBRA EN EJECUCIÓN", "presupuestoOriginal": 685000, "presupuesto": 685000}, {"proveedor": "FLETES", "presupuestoOriginal": 550000, "presupuesto": 2607000}, {"proveedor": "VOLQUETES", "presupuestoOriginal": 1500000, "presupuesto": 1500000}, {"proveedor": "MATAFUEGO", "presupuestoOriginal": 300000, "presupuesto": 162000}, {"proveedor": "EJECUCIÓN DE PLANOS Y PRESENTACIÓN A SHOPPING", "presupuestoOriginal": 300000, "presupuesto": 0}, {"proveedor": "SUPERVISIÓN DE OBRA", "presupuestoOriginal": 3500000, "presupuesto": 3500000}, {"proveedor": "SEGUROS - ACCIDENTES PERSONALES", "presupuestoOriginal": 326620, "presupuesto": 326620}, {"proveedor": "SEGUROS - RESP CIVIL", "presupuestoOriginal": 245000, "presupuesto": 245000}, {"proveedor": "CAPOMASI VIDRIO ROTO", "presupuestoOriginal": 0, "presupuesto": 1906800}, {"proveedor": "PABLO MORH", "presupuestoOriginal": 0, "presupuesto": 825000}, {"proveedor": "MUEBLES VARIOS", "presupuestoOriginal": 0, "presupuesto": 1144825}, {"proveedor": "BARUGEL", "presupuestoOriginal": 0, "presupuesto": 1346855}, {"proveedor": "UNAMA", "presupuestoOriginal": 0, "presupuesto": 5316000}]
};

// Historial de pagos semanales por proveedor (alimenta "costo real pagado" y "resta por pagar")
const SEED_PAGOS = {
  "PANDORA|UNICENTER": [{"proveedor": "EUROLAMP", "monto": 9049510, "fecha": "07/05/2026", "fc": "148"}, {"proveedor": "ALL INK", "monto": 850000, "fecha": "14/05/2026", "fc": "803"}, {"proveedor": "TEODORU", "monto": 1633500, "fecha": "08/05/2026", "fc": "—"}, {"proveedor": "CHECK CLIMATIZACION", "monto": 330088, "fecha": "22/05/2026", "fc": "237"}, {"proveedor": "CHECK CLIMATIZACION", "monto": 1934612, "fecha": "22/05/2026", "fc": "235/236"}, {"proveedor": "MATAFUEGO Y PEDESTAL", "monto": 162000, "fecha": "—", "fc": "—"}, {"proveedor": "CMD MUDANZAS GUARADADO", "monto": 2900000, "fecha": "12/06/2026", "fc": "978"}, {"proveedor": "SERVICIOS GG", "monto": 508000, "fecha": "30/07/2026", "fc": "817/816"}, {"proveedor": "CASAS", "monto": 2500000, "fecha": "30/07/2026", "fc": "504"}, {"proveedor": "CASAS", "monto": 3500000, "fecha": "07/08/2026", "fc": "508"}, {"proveedor": "CENTROSEC", "monto": 2818114, "fecha": "07/08/2026", "fc": "73600"}, {"proveedor": "FRATINI", "monto": 680000, "fecha": "07/08/2026", "fc": "7708"}, {"proveedor": "RUBEN SILVERO", "monto": 1000000, "fecha": "07/08/2026", "fc": "139"}, {"proveedor": "SERVICIOS GG", "monto": 130000, "fecha": "14/08/2026", "fc": "827"}, {"proveedor": "ELECTRICA MAIPU", "monto": 713432, "fecha": "14/08/2026", "fc": "11307"}, {"proveedor": "ELECTRICA MAIPU", "monto": 2157424, "fecha": "14/08/2026", "fc": "11312"}, {"proveedor": "CENTROSEC", "monto": 686193, "fecha": "12/08/2026", "fc": "73695/73736"}, {"proveedor": "CASAS", "monto": 4000000, "fecha": "12/08/2026", "fc": "—"}, {"proveedor": "RUBEN SILVERO", "monto": 1000000, "fecha": "12/08/2026", "fc": "—"}, {"proveedor": "CMD", "monto": 429000, "fecha": "12/08/2026", "fc": "1020"}, {"proveedor": "FLETE JONNY", "monto": 350000, "fecha": "12/08/2026", "fc": "320"}, {"proveedor": "MDF PISO", "monto": 360000, "fecha": "12/08/2026", "fc": "—"}, {"proveedor": "PALAVECINO", "monto": 2970000, "fecha": "12/08/2026", "fc": "577"}, {"proveedor": "ELECTRICA MAIPU", "monto": 925901, "fecha": "12/08/2026", "fc": "11331/11332"}, {"proveedor": "CAPOMASI VIDRIO ROTO", "monto": 1906800, "fecha": "21/08/2026", "fc": "657"}, {"proveedor": "QUAGLIA", "monto": 1750000, "fecha": "21/08/2026", "fc": "203"}, {"proveedor": "RUBEN SILVERO", "monto": 800000, "fecha": "21/08/2026", "fc": "143"}, {"proveedor": "PINTURERIA SAN ANDRES", "monto": 1475, "fecha": "21/08/2026", "fc": "8146"}, {"proveedor": "CASAS", "monto": 2500000, "fecha": "21/08/2026", "fc": "512"}, {"proveedor": "ALL INK", "monto": 850000, "fecha": "21/08/2026", "fc": "839"}, {"proveedor": "CENTROSEC", "monto": 823433, "fecha": "21/08/2026", "fc": "73797"}, {"proveedor": "CENTROSEC", "monto": 322876, "fecha": "21/08/2026", "fc": "73824"}]
};

const SEED_FACTURAS = [{"cliente": "NEW ARRECIFE", "obra": "UNICENTER", "concepto": "DESMONTE Y MUDANZA", "tipo": "FC", "nro": "130", "fecha": "09/02/2026", "status": "PAGADA", "importe": 3800000, "fechaPago": "19/02/2026", "forma": null}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "25/02/2026", "status": "PAGADA", "importe": 0, "fechaPago": "25/02/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "25/02/2026", "status": "PAGADA", "importe": 0, "fechaPago": "25/02/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "25/02/2026", "status": "PAGADA", "importe": 0, "fechaPago": "25/02/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "25/02/2026", "status": "PAGADA", "importe": 0, "fechaPago": "25/02/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "25/02/2026", "status": "PAGADA", "importe": 0, "fechaPago": "25/02/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "26/02/2026", "status": "PAGADA", "importe": 0, "fechaPago": "26/02/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "OBRA CABELLO", "tipo": "FC", "nro": "140", "fecha": "25/03/2026", "status": "PAGADA", "importe": 46537804, "fechaPago": null, "forma": null}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "25/03/2026", "status": "PAGADA", "importe": 0, "fechaPago": "25/03/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "30/03/2026", "status": "PAGADA", "importe": 0, "fechaPago": "30/03/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "RETENCION", "tipo": "S/F", "nro": null, "fecha": "01/04/2026", "status": "PAGADA", "importe": 0, "fechaPago": "01/04/2026", "forma": null}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "10/04/2026", "status": "PAGADA", "importe": 0, "fechaPago": "10/04/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "14/04/2026", "status": "PAGADA", "importe": 0, "fechaPago": "14/04/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "14/05/2026", "status": "PAGADA", "importe": 0, "fechaPago": "14/05/2026", "forma": "TRANSFENCIA"}, {"cliente": "LIDHERMA", "obra": "CABELLO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "14/05/2026", "status": "PAGADA", "importe": 0, "fechaPago": "22/05/2026", "forma": "TRANSFENCIA"}, {"cliente": "SABORES EXPRESS", "obra": "RETIRO", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "02/02/2026", "status": "PAGADA", "importe": 38024900, "fechaPago": "02/02/2026", "forma": "EFECTIVO PESOS"}, {"cliente": "SABORES EXPRESS", "obra": "RETIRO", "concepto": "AVANCE", "tipo": "S/F", "nro": null, "fecha": "31/03/2026", "status": "PAGADA", "importe": 12928463, "fechaPago": "31/03/2026", "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "RETIRO", "concepto": "AVANCE", "tipo": "FC", "nro": "149", "fecha": "27/04/2026", "status": "PAGADA", "importe": 11407468, "fechaPago": "28/04/2026", "forma": "EFECTIVO PESOS"}, {"cliente": "SABORES EXPRESS", "obra": "RETIRO", "concepto": null, "tipo": "S/F", "nro": null, "fecha": "13/05/2026", "status": "PAGADA", "importe": 930000, "fechaPago": "13/05/2026", "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "RETIRO", "concepto": null, "tipo": "S/F", "nro": null, "fecha": "27/05/2026", "status": "PAGADA", "importe": 9886472, "fechaPago": "27/05/2026", "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "RETIRO", "concepto": "ADICIONAL", "tipo": "S/F", "nro": null, "fecha": "08/06/2026", "status": "PAGADA", "importe": 1660500, "fechaPago": "08/06/2026", "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "RETIRO", "concepto": "SALDO", "tipo": "S/F", "nro": null, "fecha": "29/07/2026", "status": "PAGADA", "importe": 3802491, "fechaPago": null, "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2540000099", "tipo": "FC", "nro": "97", "fecha": "20/02/2026", "status": "PAGADA", "importe": 20369069, "fechaPago": "11/03/2026", "forma": "TRANSFENCIA"}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2650000100", "tipo": "FC", "nro": "98", "fecha": "21/04/2026", "status": "PAGADA", "importe": 47387422, "fechaPago": "22/04/2026", "forma": "TRANSFENCIA"}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000380", "tipo": "FC", "nro": "100", "fecha": "03/06/2026", "status": "PAGADA", "importe": 40139400, "fechaPago": "04/06/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000380", "tipo": "FC", "nro": "106", "fecha": "26/06/2026", "status": "PAGADA", "importe": 48384980, "fechaPago": "02/07/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": null, "tipo": "FC", "nro": "109", "fecha": "17/07/2026", "status": "PAGADA", "importe": 73663105, "fechaPago": "17/07/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000438", "tipo": "FC", "nro": "110", "fecha": "03/08/2026", "status": "PAGADA", "importe": 49497980, "fechaPago": "03/08/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000406", "tipo": "FC", "nro": "111", "fecha": "03/08/2026", "status": "PAGADA", "importe": 12873988, "fechaPago": "03/08/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000413", "tipo": "FC", "nro": "112", "fecha": "03/08/2026", "status": "PAGADA", "importe": 6186268, "fechaPago": "03/08/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000447", "tipo": "FC", "nro": "113", "fecha": "03/08/2026", "status": "PAGADA", "importe": 7959347, "fechaPago": "03/08/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000493", "tipo": "FC", "nro": "118", "fecha": "18/08/2026", "status": "PAGADA", "importe": 40714455, "fechaPago": "25/08/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000449", "tipo": "FC", "nro": "120", "fecha": "19/08/2026", "status": "PAGADA", "importe": 75589230, "fechaPago": "25/08/2026", "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000441", "tipo": "FC", "nro": "122", "fecha": "01/09/2026", "status": "ADEUDA", "importe": 15406560, "fechaPago": null, "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000099", "tipo": "FC", "nro": "123", "fecha": "01/09/2026", "status": "ADEUDA", "importe": 10129925, "fechaPago": null, "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000514", "tipo": "FC", "nro": "124", "fecha": "01/09/2026", "status": "ADEUDA", "importe": 33750603, "fechaPago": null, "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000493", "tipo": "FC", "nro": "125", "fecha": "01/09/2026", "status": "ADEUDA", "importe": 11415181, "fechaPago": null, "forma": null}, {"cliente": "WU", "obra": "WU CIVIL WORK", "concepto": "OC 2640000380", "tipo": "FC", "nro": "126", "fecha": "01/09/2026", "status": "ADEUDA", "importe": 8794800, "fechaPago": null, "forma": null}, {"cliente": "COPELAND", "obra": "SUIPACHA", "concepto": "DEMOLICION Y OBRA NUEVA", "tipo": "FC", "nro": "135", "fecha": "24/02/2026", "status": "PAGADA", "importe": 11483940, "fechaPago": "08/04/2026", "forma": null}, {"cliente": "YKU", "obra": "TERRAZAS DE MAYO", "concepto": "OBRA", "tipo": "S/F", "nro": null, "fecha": "19/03/2026", "status": "PAGADA", "importe": 30000000, "fechaPago": null, "forma": null}, {"cliente": "YKU", "obra": "TERRAZAS DE MAYO", "concepto": "OBRA", "tipo": "FC", "nro": "141", "fecha": "25/03/2026", "status": "PAGADA", "importe": 31707555, "fechaPago": "28/04/2026", "forma": null}, {"cliente": "YKU", "obra": "TERRAZAS DE MAYO", "concepto": "ADICIONALES Y FINAL DE OBRA", "tipo": "FC", "nro": "155", "fecha": "02/06/2026", "status": "PAGADA", "importe": 24147660, "fechaPago": "16/06/2026", "forma": null}, {"cliente": "YKU", "obra": "TERRAZAS DE MAYO", "concepto": "ADICIONALES SOPORTES", "tipo": null, "nro": "162", "fecha": "25/06/2026", "status": "PAGADA", "importe": 323400, "fechaPago": "30/06/2026", "forma": null}, {"cliente": "YKU", "obra": "TERRAZAS DE MAYO", "concepto": "GASTOS CH RECHAZADO", "tipo": "ND", "nro": "169", "fecha": "22/07/2026", "status": "ADEUDA", "importe": 93999, "fechaPago": null, "forma": null}, {"cliente": "SPRINGWALL", "obra": "SPRINGWALL LIBERTADOR", "concepto": "DESMONTE CARTEL", "tipo": "FC", "nro": "142", "fecha": "06/04/2026", "status": "ADEUDA", "importe": 1500000, "fechaPago": null, "forma": null}, {"cliente": "SHANGAI", "obra": "SHANGAI CORRIENTES", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "05/04/2026", "status": "PAGADA", "importe": 120750000, "fechaPago": null, "forma": null}, {"cliente": "SHANGAI", "obra": "SHANGAI CORRIENTES", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "29/04/2026", "status": "PAGADA", "importe": 55200000, "fechaPago": null, "forma": null}, {"cliente": "SHANGAI", "obra": "SHANGAI CORRIENTES", "concepto": "ANTICIPO", "tipo": "S/F", "nro": null, "fecha": "19/05/2026", "status": "PAGADA", "importe": 4000000, "fechaPago": null, "forma": null}, {"cliente": "SHANGAI", "obra": "SHANGAI CORRIENTES", "concepto": null, "tipo": "S/F", "nro": null, "fecha": "27/05/2026", "status": "PAGADA", "importe": 31500000, "fechaPago": null, "forma": null}, {"cliente": "SHANGAI", "obra": "SHANGAI CORRIENTES", "concepto": "AVANCE", "tipo": "S/F", "nro": null, "fecha": "26/06/2026", "status": "PAGADA", "importe": 10000000, "fechaPago": null, "forma": null}, {"cliente": "SHANGAI", "obra": "SHANGAI CORRIENTES", "concepto": "AVANCE", "tipo": "S/F", "nro": null, "fecha": "26/06/2026", "status": "PAGADA", "importe": 21000000, "fechaPago": null, "forma": null}, {"cliente": "SHANGAI", "obra": "SHANGAI CORRIENTES", "concepto": "SALDO DE OBRA", "tipo": "S/F", "nro": null, "fecha": "20/07/2026", "status": "PAGADA", "importe": 14000000, "fechaPago": null, "forma": null}, {"cliente": "REEF", "obra": "REEF ABASTO", "concepto": null, "tipo": "FC", "nro": "145", "fecha": "14/04/2026", "status": "PAGADA", "importe": 29263568, "fechaPago": "15/04/2026", "forma": null}, {"cliente": "REEF", "obra": "REEF ABASTO", "concepto": null, "tipo": "fc", "nro": "154", "fecha": "11/05/2026", "status": "PAGADA", "importe": 1131050, "fechaPago": "15/05/2026", "forma": null}, {"cliente": "REEF", "obra": "REEF ABASTO", "concepto": null, "tipo": "fc", "nro": "157", "fecha": "03/06/2026", "status": "PAGADA", "importe": 4032476, "fechaPago": null, "forma": null}, {"cliente": "PANDORA", "obra": "SALTA", "concepto": "ANTICIPO 90 % OBRA SALTA", "tipo": "FC", "nro": "146", "fecha": "15/04/2026", "status": "PAGADA", "importe": 110504012, "fechaPago": "12/05/2026", "forma": "TRANSFENCIA"}, {"cliente": "PANDORA", "obra": "SALTA", "concepto": "FINAL DE OBRA", "tipo": "FC", "nro": "163", "fecha": "29/06/2026", "status": "PAGADA", "importe": 12278224, "fechaPago": "28/07/2026", "forma": null}, {"cliente": "PANDORA", "obra": "SALTA", "concepto": "ADICIONALES", "tipo": "FC", "nro": "170", "fecha": "23/07/2026", "status": "ADEUDA", "importe": 5012542, "fechaPago": null, "forma": null}, {"cliente": "PANDORA", "obra": "SALTA", "concepto": "ADICIONALES", "tipo": "FC", "nro": "175", "fecha": "13/08/2026", "status": "ADEUDA", "importe": 7548720, "fechaPago": null, "forma": null}, {"cliente": "PANDORA", "obra": "UNICENTER", "concepto": "TIENDA UNICENTER", "tipo": "FC", "nro": "150", "fecha": "30/04/2026", "status": "PAGADA", "importe": 74175811, "fechaPago": "26/05/2026", "forma": "TRANSFENCIA"}, {"cliente": "PANDORA", "obra": "UNICENTER", "concepto": "ADICIONALES", "tipo": "FC", "nro": "158", "fecha": "08/06/2026", "status": "ADEUDA", "importe": 5775000, "fechaPago": null, "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "VILLA DEL PARQUE", "concepto": null, "tipo": "S/F", "nro": null, "fecha": "06/05/2026", "status": "PAGADA", "importe": 30450000, "fechaPago": "06/05/2026", "forma": "EFECTIVO PESOS"}, {"cliente": "SABORES EXPRESS", "obra": "VILLA DEL PARQUE", "concepto": null, "tipo": "S/F", "nro": null, "fecha": "08/06/2026", "status": "PAGADA", "importe": 8526000, "fechaPago": "08/06/2026", "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "VILLA DEL PARQUE", "concepto": "ADICIOAL", "tipo": "S/F", "nro": null, "fecha": "25/06/2026", "status": "PAGADA", "importe": 3804727, "fechaPago": "25/06/2026", "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "VILLA DEL PARQUE", "concepto": null, "tipo": "S/F", "nro": null, "fecha": "13/07/2026", "status": "PAGADA", "importe": 18879000, "fechaPago": "13/07/2026", "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "VILLA DEL PARQUE", "concepto": null, "tipo": "S/F", "nro": null, "fecha": "30/07/2026", "status": "PAGADA", "importe": 1785400, "fechaPago": "30/07/2026", "forma": null}, {"cliente": "B+D", "obra": "GALERIAS PACIFICO", "concepto": "GONDOLA", "tipo": "FC", "nro": "152", "fecha": "11/05/2026", "status": "PAGADA", "importe": 11200000, "fechaPago": "18/05/2026", "forma": "TRANSFENCIA"}, {"cliente": "B+D", "obra": "GALERIAS PACIFICO", "concepto": "GONDOLA", "tipo": "FC", "nro": "164", "fecha": "03/07/2026", "status": "PAGADA", "importe": 11200000, "fechaPago": "13/07/2026", "forma": null}, {"cliente": "B+D", "obra": "GALERIAS PACIFICO", "concepto": "ADICIONALES", "tipo": "FC", "nro": "171", "fecha": "23/07/2026", "status": "PAGADA", "importe": 3713480, "fechaPago": "07/08/2026", "forma": null}, {"cliente": "B+D", "obra": "DEVOTO SHOPPING", "concepto": "GONDOLA", "tipo": "FC", "nro": "153", "fecha": "11/05/2026", "status": "PAGADA", "importe": 11200000, "fechaPago": "18/05/2026", "forma": "TRANSFENCIA"}, {"cliente": "B+D", "obra": "DEVOTO SHOPPING", "concepto": "GONDOLA", "tipo": "FC", "nro": "166", "fecha": "14/07/2026", "status": "PAGADA", "importe": 11200000, "fechaPago": null, "forma": null}, {"cliente": "B+D", "obra": "DEVOTO SHOPPING", "concepto": "ADICIONALES", "tipo": "FC", "nro": "172", "fecha": "23/07/2026", "status": "PAGADA", "importe": 855500, "fechaPago": "07/08/2026", "forma": null}, {"cliente": "DESPEGAR", "obra": "UNICENTER", "concepto": "PROYECTO EJECUTIVO", "tipo": "FC", "nro": "99", "fecha": "11/05/2026", "status": "PAGADA", "importe": 7000000, "fechaPago": "23/06/2026", "forma": null}, {"cliente": "DESPEGAR", "obra": "UNICENTER", "concepto": "OBRA UNICENTER", "tipo": "FC", "nro": "104", "fecha": "18/06/2026", "status": "PAGADA", "importe": 66777160, "fechaPago": "23/06/2026", "forma": null}, {"cliente": "DESPEGAR", "obra": "UNICENTER", "concepto": "AVANCE DE OBRA", "tipo": "FC", "nro": "114", "fecha": "04/08/2026", "status": "PAGADA", "importe": 42166296, "fechaPago": null, "forma": null}, {"cliente": "SPRINGWALL", "obra": "JUAN B JUSTO", "concepto": "PROYECTO ARQUITECTURA", "tipo": "FC", "nro": "159", "fecha": "09/06/2026", "status": "ADEUDA", "importe": 2900000, "fechaPago": null, "forma": null}, {"cliente": "DESPEGAR", "obra": "SOLEIL FACTORY", "concepto": "GONDOLA", "tipo": "FC", "nro": "105", "fecha": "22/06/2026", "status": "PAGADA", "importe": 14048790, "fechaPago": "25/06/2026", "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "LANUS", "concepto": "ANTICPO", "tipo": "S/F", "nro": null, "fecha": "07/07/2026", "status": "PAGADA", "importe": 30750000, "fechaPago": null, "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "LANUS", "concepto": "AVANCE", "tipo": "S/F", "nro": null, "fecha": "29/07/2026", "status": "PAGADA", "importe": 6765000, "fechaPago": null, "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "LANUS", "concepto": "AVANCE", "tipo": "S/F", "nro": null, "fecha": "19/08/2026", "status": "PAGADA", "importe": 11685000, "fechaPago": null, "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "VALENTIN ALSINA", "concepto": "ANTICPO 50%", "tipo": "S/F", "nro": null, "fecha": "27/07/2026", "status": "PAGADA", "importe": 31750000, "fechaPago": null, "forma": null}, {"cliente": "SABORES EXPRESS", "obra": "VALENTIN ALSINA", "concepto": "AVANCE", "tipo": "S/F", "nro": null, "fecha": "24/08/2026", "status": "PAGADA", "importe": 12700000, "fechaPago": null, "forma": null}, {"cliente": "NATURA", "obra": "NATURA CABILDO", "concepto": "LOCAL", "tipo": "FC", "nro": "115", "fecha": "06/08/2026", "status": "PAGADA", "importe": 61777926, "fechaPago": null, "forma": null}, {"cliente": "NATURA", "obra": "NATURA SANTA FE", "concepto": "LOCAL", "tipo": "FC", "nro": "116", "fecha": "06/08/2026", "status": "PAGADA", "importe": 61777926, "fechaPago": null, "forma": null}, {"cliente": "NATURA", "obra": "NATURA UNICENTER", "concepto": "LOCAL", "tipo": "FC", "nro": "117", "fecha": "06/08/2026", "status": "PAGADA", "importe": 61777926, "fechaPago": null, "forma": null}, {"cliente": "PANDORA", "obra": "PANDORA ALCORTA", "concepto": null, "tipo": "FC", "nro": "176", "fecha": "21/08/2026", "status": "ADEUDA", "importe": 7931000, "fechaPago": null, "forma": null}, {"cliente": "DESPEGAR", "obra": "PLAZA OESTE", "concepto": "GONDOLA PLAZA OESTE", "tipo": "FC", "nro": "177", "fecha": "25/08/2026", "status": "PAGADA", "importe": 14513922, "fechaPago": null, "forma": null}, {"cliente": "B+D", "obra": "PLAZA OESTE", "concepto": "REEMPLAZO ACRILIICO", "tipo": "FC", "nro": "178", "fecha": "25/08/2026", "status": "PAGADA", "importe": 1775000, "fechaPago": null, "forma": null}, {"cliente": "NATURA", "obra": "DESMONTE GONDOLA", "concepto": "DESMONTE Y ARMADO", "tipo": "FC", "nro": "179", "fecha": "27/08/2026", "status": "ADEUDA", "importe": 4480000, "fechaPago": null, "forma": null}];

// Estado de moneda (vista pesos/dólares), a nivel de módulo para que TODOS
// los llamados a fmt(...) en cualquier parte de la app se conviertan solos,
// sin tener que pasar la moneda como prop por cada componente. El componente
// App sincroniza este objeto en cada render (ver moneda/tipoCambio más abajo).
const monedaState = { moneda: "ARS", tipoCambio: 0 };

// tc (segundo argumento, opcional) es el tipo de cambio que estaba vigente
// cuando ESE registro puntual se cargó (pago, factura, presupuesto, etc.), si
// lo tiene guardado. Si no se pasa (o el registro es viejo y no lo tiene), se
// usa el tipo de cambio ACTUAL como aproximación.
const fmt = (n, tc) => {
  if (n === null || n === undefined || isNaN(n)) return "—";
  if (monedaState.moneda === "USD") {
    const tasa = Number(tc) || monedaState.tipoCambio;
    if (!tasa) return "US$ —";
    const neg = n < 0;
    // Sin decimales (igual que en pesos): con centavos, el texto se hacía
    // demasiado largo y se pisaba con las columnas vecinas en el header.
    const s = Math.round(Math.abs(n) / tasa).toLocaleString("en-US");
    return (neg ? "-US$" : "US$") + s;
  }
  const neg = n < 0;
  const s = Math.round(Math.abs(n)).toLocaleString("de-DE");
  return (neg ? "-$" : "$") + s;
};
const pct = (n) => (n === null || n === undefined || isNaN(n)) ? "—" : n.toFixed(1) + "%";

// Convierte un monto en pesos a su equivalente en dólares usando SU PROPIO
// tipo de cambio (tc) si lo tiene guardado; si no (dato viejo sin migrar),
// usa el tipo de cambio vigente como último recurso.
const aUsd = (monto, tc) => {
  const tasa = Number(tc) > 0 ? Number(tc) : (monedaState.tipoCambio || 0);
  if (!tasa) return 0;
  return (Number(monto) || 0) / tasa;
};
// Formatea un monto que YA está en dólares (no hay que volver a dividirlo
// por ningún tipo de cambio: usarlo para totales/acumulados calculados con
// aUsd, nunca para un monto en pesos crudo).
const fmtUsdRaw = (usd) => {
  if (usd === null || usd === undefined || isNaN(usd)) return "—";
  const neg = usd < 0;
  const s = Math.round(Math.abs(usd)).toLocaleString("en-US");
  return (neg ? "-US$" : "US$") + s;
};
// Para acumulados/totales que ya se calcularon en las dos monedas por
// separado (sumando cada registro con SU PROPIO tipo de cambio histórico):
// elige cuál mostrar según la vista actual, sin volver a convertir nada.
const fmtSmart = (pesos, usd) => monedaState.moneda === "USD" ? fmtUsdRaw(usd) : fmt(pesos);
const pctSmart = (arsVal, usdVal) => pct(monedaState.moneda === "USD" ? usdVal : arsVal);
const valSmart = (arsVal, usdVal) => monedaState.moneda === "USD" ? usdVal : arsVal;
const SEED_CATALOGO_PROVEEDORES = ["ALL INK", "BARUGEL", "CAPOMASI VIDRIO ROTO", "CASAS", "CHECK CLIMATIZACION", "CMD MUDANZAS GUARADADO", "DESMONTE", "DONATO + ESTIMACIÓN+ ZOCALO ACERO", "EJECUCIÓN DE PLANOS Y PRESENTACIÓN A SHOPPING", "ELECTRICA MAIPU", "EUROLAMP", "FLETES", "FUMAGALLI", "IMAK", "LIMPIEZA DE OBRA EN EJECUCIÓN", "MATAFUEGO", "MATERIALES", "MUEBLES VARIOS", "PABLO MORH", "PALAVECINO", "PROVISION Y ARMADO DE ESCRITORIO + SILLA", "PROVISIÓN DE 4 PARLANTES DE EMBUTIR", "PROVISIÓN DE HELADERA / FRIGOBAR", "PROVISIÓN DE MICROONDAS", "PROVISIÓN Y ARMADO DE ESTANTERIAS TIPO RACK DE 90*42*200, RE", "RUBEN", "SEGUROS - ACCIDENTES PERSONALES", "SEGUROS - RESP CIVIL", "SUPERVISIÓN DE OBRA", "TEODORU", "UNAMA", "VOLQUETES"];

const ADMIN_PIN = "4237";
const COMERCIAL_PIN = "1234";

const obraKey = (cliente, obra) => cliente + "|" + obra;
// Sub obras dentro de Costos (solo WU): agrupaciones internas de costo,
// independientes de las Órdenes de Compra, identificadas por la obra + su índice.
const subCostoKey = (k, index) => k + "::subCosto::" + index;

// Fechas en el resto de la app se guardan como texto "DD/MM/AAAA" (o "—" si no hay).
// Devuelve { mesIdx (0-11), anio } o null si no se puede interpretar.
function parseFechaMesAnio(fechaStr) {
  if (!fechaStr) return null;
  const partes = fechaStr.split("/");
  if (partes.length !== 3) return null;
  const mes = parseInt(partes[1], 10);
  const anio = parseInt(partes[2], 10);
  if (isNaN(mes) || isNaN(anio) || mes < 1 || mes > 12) return null;
  return { mesIdx: mes - 1, anio };
}

// Tipo de cambio histórico asignado una única vez (ver migración de tipo de
// cambio más abajo) a los datos que ya estaban cargados antes de que
// existiera el campo "tc": todo lo de obras 2025 queda a $1264, todo lo
// demás (2026 en adelante, o sin año) queda a $1450.
const tcParaAnioHistorico = (anio) => anio === 2025 ? 1264 : 1450;

// Si a un proveedor se le pagó más de lo que tiene presupuestado como costo
// real, el costo real pasa a ser lo pagado (nunca puede quedar "saldo
// negativo" de un proveedor sobrepagado).
const pagadoDeProveedor = (pagos, proveedor) =>
  (pagos || []).filter((pg) => pg.proveedor === proveedor).reduce((s, pg) => s + (pg.monto || 0), 0);
const presupuestoEfectivo = (presupuesto, pagado) => Math.max(presupuesto || 0, pagado || 0);

// Al cargar un proveedor en una obra (a mano o por importación), si ya existe
// uno con el mismo nombre en esa misma lista, se consolidan sumando los
// presupuestos en vez de crear una fila duplicada.
function consolidarProveedores(lista) {
  const merged = [];
  lista.forEach((p) => {
    const existente = merged.find((m) => m.proveedor === p.proveedor);
    if (existente) {
      existente.presupuestoOriginal = (existente.presupuestoOriginal || 0) + (p.presupuestoOriginal || 0);
      existente.presupuesto = (existente.presupuesto || 0) + (p.presupuesto || 0);
      // El tipo de cambio del registro combinado queda con el de la carga
      // más reciente (si la trae), para reflejar el último valor cargado.
      if (p.tc) existente.tc = p.tc;
    } else {
      merged.push({ ...p });
    }
  });
  return merged;
}

function normalizarFecha(input) {
  if (!input) return input;
  const str = String(input).trim();
  const pad2 = (n) => String(n).padStart(2, "0");

  // Formato ISO: yyyy-mm-dd
  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (m) return pad2(m[3]) + "/" + pad2(m[2]) + "/" + m[1];

  // dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy (con o sin ceros, año de 2 o 4 dígitos)
  m = str.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/);
  if (m) {
    let anio = m[3];
    if (anio.length === 2) anio = (Number(anio) < 50 ? "20" : "19") + anio;
    return pad2(m[1]) + "/" + pad2(m[2]) + "/" + anio;
  }

  return str;
}

function fechaEsValida(fechaStr) {
  if (!fechaStr) return false;
  const partes = String(fechaStr).split("/");
  if (partes.length !== 3) return false;
  const mes = parseInt(partes[1], 10);
  const anio = parseInt(partes[2], 10);
  return !isNaN(mes) && !isNaN(anio) && mes >= 1 && mes <= 12;
}
function anioDeFecha(fechaStr) {
  const partes = String(fechaStr || "").split("/");
  if (partes.length !== 3) return null;
  const anio = parseInt(partes[2], 10);
  return isNaN(anio) ? null : anio;
}
function mesIdxDeFecha(fechaStr) {
  const partes = String(fechaStr || "").split("/");
  if (partes.length !== 3) return null;
  const mes = parseInt(partes[1], 10);
  return isNaN(mes) ? null : mes - 1;
}
function capitalizar(str) {
  return str ? str.charAt(0) + str.slice(1).toLowerCase() : str;
}

// --- Helpers de semanas para CASHFLOW (semana calendario terminada en viernes) ---
function fechaAObjetoDate(fechaStr) {
  if (!fechaStr) return null;
  const partes = fechaStr.split("/");
  if (partes.length !== 3) return null;
  const d = parseInt(partes[0], 10), m = parseInt(partes[1], 10), y = parseInt(partes[2], 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  return new Date(y, m - 1, d);
}
function dateAFechaStr(d) {
  return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear();
}
function viernesDeLaSemana(d) {
  const day = d.getDay();
  const delta = (5 - day + 7) % 7;
  const r = new Date(d);
  r.setDate(r.getDate() + delta);
  return r;
}
function generarSemanas(desdeStr, cantidad) {
  const base = viernesDeLaSemana(fechaAObjetoDate(desdeStr) || new Date());
  const arr = [];
  for (let i = 0; i < cantidad; i++) {
    const f = new Date(base);
    f.setDate(f.getDate() + i * 7);
    arr.push(dateAFechaStr(f));
  }
  return arr;
}
function moverSemanas(desdeStr, semanas) {
  const base = fechaAObjetoDate(desdeStr) || new Date();
  const f = new Date(base);
  f.setDate(f.getDate() + semanas * 7);
  return dateAFechaStr(viernesDeLaSemana(f));
}
function semanaLabelCorta(fechaStr) {
  const partes = fechaStr.split("/");
  return partes[0] + "/" + partes[1];
}

// "Día comercial" para el popup obligatorio de tipo de cambio: el día no
// cambia a medianoche sino recién a las 9:00 de la mañana (hora local), para
// no pedirle el tipo de cambio del día a alguien que entra de madrugada
// antes de que arranque la jornada. Se calcula en hora LOCAL (no con
// toISOString, que es UTC y en husos horarios negativos como el de
// Argentina hace que el día cambie varias horas antes de medianoche local).
function fechaComercialHoy() {
  const ahora = new Date();
  const base = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  if (ahora.getHours() < 9) base.setDate(base.getDate() - 1);
  const y = base.getFullYear();
  const m = String(base.getMonth() + 1).padStart(2, "0");
  const d = String(base.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}
function dataUrlToBlobUrl(dataUrl) {
  try {
    return URL.createObjectURL(dataUrlToBlob(dataUrl));
  } catch (e) {
    return dataUrl;
  }
}
// La vista publicada no permite descargas por link directo (<a download>);
// hay que ofrecerlas a través de la capacidad "downloads", que le muestra
// al usuario una confirmación antes de guardar el archivo.
async function ofrecerDescarga(filename, data) {
  try {
    if (!(window.claude && window.claude.use)) { alert("La descarga de archivos no está disponible en esta vista."); return; }
    const downloads = await window.claude.use("downloads");
    if (!downloads) { alert("La descarga de archivos no está disponible en esta vista."); return; }
    await downloads.save({ filename, data });
  } catch (e) {
    if (!e || e.code !== "declined") alert("No se pudo descargar \"" + filename + "\".");
  }
}
function descargarLibroXlsx(wb, filename) {
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  ofrecerDescarga(filename, new Blob([wbout], { type: "application/octet-stream" }));
}
const pieLabel = ({ name, percent }) => name + " " + (percent * 100).toFixed(0) + "%";

function StatusBadge({ status, onClick }) {
  if (!status) return null;
  const isDone = status === "FINALIZADA";
  return (
    <span onClick={onClick} style={{
      fontSize: 10.5, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
      background: isDone ? "#E6EEE9" : "#F7ECD3",
      color: isDone ? GREEN : "#8A6A1E",
      border: "1px solid " + (isDone ? "#CFE0D5" : "#E9D8A8"),
      whiteSpace: "nowrap", letterSpacing: 0.3, textTransform: "uppercase",
      cursor: onClick ? "pointer" : "default",
    }}>
      {isDone ? "Finalizada" : "En proceso"}
    </span>
  );
}

function MBValue({ v }) {
  const color = v < 15 ? RED : v >= 30 ? GREEN : TEXT;
  return <span style={{ color, fontWeight: 600 }}>{pct(v)}</span>;
}

const inputStyle = { border: "1px solid " + BORDER, borderRadius: 7, padding: "7px 10px", fontSize: 12.5, width: 130, background: "#fff", color: TEXT, outline: "none" };
const selectStyle = { border: "1px solid " + BORDER, borderRadius: 8, padding: "8px 12px", fontSize: 12.5, background: "#fff", color: TEXT, outline: "none" };
const smallBtnPrimary = { background: NAVY, color: "#fff", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 2px rgba(20,20,20,0.15)", letterSpacing: 0.1 };
const smallBtnGhost = { display: "flex", alignItems: "center", gap: 4, background: "#fff", color: NAVY, border: "1px solid " + BORDER, borderRadius: 7, padding: "7px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" };
const labelStyle = { display: "block", fontSize: 10.5, fontWeight: 700, color: MUTED, marginBottom: 4, letterSpacing: 0.4, textTransform: "uppercase" };

// ---------------------------------------------------------------------------
// Presentación / informe financiero (PDF). Se renderizan 8 láminas fijas de
// 1280x720 fuera de pantalla; generarPresentacionPdf() (en App) las
// convierte a imagen con html2canvas y las junta en un PDF con jsPDF.
// ---------------------------------------------------------------------------
const SLIDE_W = 1280, SLIDE_H = 720;
const slideFrame = { width: SLIDE_W, height: SLIDE_H, background: "#fff", position: "relative", overflow: "hidden", fontFamily: "Inter, sans-serif", boxSizing: "border-box", color: TEXT };

function SlideHeader({ title, subtitle }) {
  return (
    <div style={{ padding: "34px 48px 0" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: NAVY, letterSpacing: 0.2 }}>{title}</div>
      <div style={{ fontSize: 13, color: MUTED, marginTop: 3 }}>{subtitle}</div>
      <div style={{ height: 3, width: 54, background: GOLD, marginTop: 14, borderRadius: 2 }} />
    </div>
  );
}
function SlideFooter({ n }) {
  return (
    <div style={{ position: "absolute", left: 48, right: 48, bottom: 20, display: "flex", justifyContent: "space-between", fontSize: 10, color: MUTED }}>
      <div>MZ LATAM · DOCUMENTO CONFIDENCIAL DE USO INTERNO</div>
      <div>{n}</div>
    </div>
  );
}
function KpiCard({ label, value, sub, color }) {
  return (
    <div style={{ flex: 1, background: "#F7F6F3", border: "1px solid " + BORDER, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, letterSpacing: 0.3, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || NAVY }}>{value}</div>
      {sub && <div style={{ fontSize: 9.5, color: MUTED, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}
function Tbl({ cols, rows, totalRow, widths }) {
  const tpl = widths ? widths.join(" ") : cols.map(() => "1fr").join(" ");
  return (
    <div style={{ border: "1px solid " + BORDER, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: tpl, columnGap: 8, padding: "7px 12px", background: "#EFEDE7", fontSize: 10, fontWeight: 700, color: NAVY }}>
        {cols.map((c, i) => <div key={i} style={{ textAlign: i === 0 ? "left" : "right" }}>{c}</div>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: tpl, columnGap: 8, padding: "5.5px 12px", fontSize: 11,
          background: i % 2 === 0 ? "#fff" : "#F7F6F3", borderTop: "1px solid " + BORDER,
        }}>
          {r.map((c, j) => <div key={j} style={{ textAlign: j === 0 ? "left" : "right", color: j === 0 ? TEXT : TEXT, fontWeight: j === 0 ? 500 : 400 }}>{c}</div>)}
        </div>
      ))}
      {totalRow && (
        <div style={{
          display: "grid", gridTemplateColumns: tpl, columnGap: 8, padding: "7px 12px", fontSize: 11, fontWeight: 800,
          background: "#F1E9D2", borderTop: "1px solid " + BORDER, color: NAVY,
        }}>
          {totalRow.map((c, j) => <div key={j} style={{ textAlign: j === 0 ? "left" : "right" }}>{c}</div>)}
        </div>
      )}
    </div>
  );
}

function PresentacionSlides({ data, refs }) {
  const { anioActual, anioAnterior, mesActualIdx } = data;
  const mesActualNombre = capitalizar(MESES[mesActualIdx]);
  // El año anterior siempre se muestra completo (12 meses); el año en curso
  // solo hasta el mes actual (los meses futuros van con "—").
  const ventaMesRows = data.chartVentaMes.map((row, idx) => [
    row.label.toUpperCase(),
    fmt(row[anioAnterior]),
    idx <= mesActualIdx ? fmt(row[anioActual]) : "—",
  ]);

  return (
    <div style={{ position: "fixed", top: 0, left: -20000, zIndex: -1 }}>
      {/* Slide 1 — Portada */}
      <div ref={refs[0]} style={{ ...slideFrame, background: NAVY_DEEP, color: "#fff" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: GOLD }} />
        <div style={{ position: "absolute", top: "38%", left: 0, right: 0, textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: GOLD, letterSpacing: 4 }}>INFORME FINANCIERO</div>
          <div style={{ fontSize: 46, fontWeight: 800, color: "#fff", marginTop: 14 }}>{mesActualNombre} {anioActual}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 16 }}>Ventas · Facturación · Márgenes · Resultado del ejercicio</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 0.5 }}>
          MZ LATAM · DOCUMENTO CONFIDENCIAL DE USO INTERNO
        </div>
      </div>

      {/* Slide 2 — Venta por mes */}
      <div ref={refs[1]} style={slideFrame}>
        <SlideHeader title="VENTA POR MES" subtitle={"Comparativo " + anioAnterior + " (año completo) vs. " + anioActual + " (a " + mesActualNombre.toLowerCase() + ")"} />
        <div style={{ display: "flex", gap: 24, padding: "20px 48px 0", height: 560, boxSizing: "border-box" }}>
          <div style={{ flex: 0.95 }}>
            <Tbl
              cols={["MES", "VENTA " + anioAnterior, "VENTA " + anioActual]}
              widths={["1.3fr", "1fr", "1fr"]}
              rows={ventaMesRows}
              totalRow={["TOTAL", fmt(data.totalVentaAnterior), fmt(data.totalVentaActual)]}
            />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <KpiCard label={"TOTAL " + anioAnterior + " (AÑO COMPLETO)"} value={fmt(data.totalVentaAnterior)} />
              <KpiCard label={"TOTAL " + anioActual + " (A " + mesActualNombre.toUpperCase() + ")"} value={fmt(data.totalVentaActual)} color={GOLD} />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer>
                <BarChart data={data.chartVentaMes} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={BORDER} />
                  <XAxis dataKey="label" tick={{ fontSize: 9.5, fill: MUTED }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9.5, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"} />
                  <Bar dataKey={anioAnterior} fill={"#B8B2A0"} radius={[3, 3, 0, 0]} />
                  <Bar dataKey={anioActual} fill={GOLD} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <SlideFooter n={2} />
      </div>

      {/* Slide 3 — Facturación (resumen) */}
      <div ref={refs[2]} style={slideFrame}>
        <SlideHeader title="FACTURACIÓN" subtitle={"Venta vs. facturado, por año de obra"} />
        <div style={{ padding: "20px 48px 0" }}>
          <Tbl
            cols={["CONCEPTO", String(anioAnterior), String(anioActual)]}
            widths={["2fr", "1fr", "1fr"]}
            rows={[
              ["Venta", fmt(data.ventaAnioAnterior), fmt(data.ventaAnioActual)],
              ["Facturado (pagado + adeudado)", fmt(data.facturadoAnioAnterior), fmt(data.facturadoAnioActual)],
              ["Resta por facturar", fmt(data.restaAnioAnterior), fmt(data.restaAnioActual)],
            ]}
          />
          <div style={{ fontSize: 10, color: MUTED, marginTop: 8 }}>
            Los KPI de abajo son el total general (todas las obras, todos los años) — igual que en la pantalla de Facturación.
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
            <KpiCard label="TOTAL POR FACTURAR" value={fmt(data.totalPorFacturar)} sub="*detalle próxima lámina" color={GOLD} />
            <KpiCard label="FACTURADO PEND. DE COBRO" value={fmt(data.facturadoPendCobro)} sub="*detalle próxima lámina" color={RED} />
            <KpiCard label="TOTAL PENDIENTE DE INGRESOS" value={fmt(data.totalPendienteIngresos)} color={NAVY} />
          </div>
        </div>
        <SlideFooter n={3} />
      </div>

      {/* Slide 4 — Facturación mes a mes (año actual) */}
      <div ref={refs[3]} style={slideFrame}>
        <SlideHeader title={"FACTURACIÓN " + anioActual} subtitle={"Facturas emitidas por mes, hasta " + mesActualNombre.toLowerCase()} />
        <div style={{ display: "flex", gap: 24, padding: "20px 48px 0", height: 560, boxSizing: "border-box" }}>
          <div style={{ flex: 0.8 }}>
            <Tbl
              cols={["MES", "IMPORTE", "SHARE"]}
              widths={["1fr", "1.3fr", "0.8fr"]}
              rows={data.facturacionMensualActual.map((r) => [
                r.mes.toUpperCase(), fmt(r.importe),
                data.facturadoAnioActual ? ((r.importe / data.facturadoAnioActual) * 100).toFixed(0) + "%" : "—",
              ])}
              totalRow={["TOTAL", fmt(data.facturadoAnioActual), "100%"]}
            />
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer>
              <BarChart data={data.facturacionMensualActual} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={BORDER} />
                <XAxis dataKey="mes" tick={{ fontSize: 9.5, fill: MUTED }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9.5, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"} />
                <Bar dataKey="importe" fill={NAVY} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <SlideFooter n={4} />
      </div>

      {/* Slide 5 — Detalle pendiente de ingresos por cliente */}
      <div ref={refs[4]} style={slideFrame}>
        <SlideHeader title="DETALLE PENDIENTE DE INGRESOS" subtitle="Facturado pendiente de cobro y deuda sin facturar, por cliente" />
        <div style={{ display: "flex", gap: 24, padding: "20px 48px 0" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 }}>FACTURADO PEND. DE COBRO</div>
            <Tbl
              cols={["CLIENTE", "IMPORTE"]}
              widths={["1.4fr", "1fr"]}
              rows={data.pendCobroPorCliente.slice(0, 9).map((r) => [r.cliente, fmt(r.monto)])}
              totalRow={["TOTAL GENERAL", fmt(data.facturadoPendCobro)]}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 }}>DEUDA SIN FACTURAR</div>
            <Tbl
              cols={["CLIENTE", "IMPORTE"]}
              widths={["1.4fr", "1fr"]}
              rows={data.deudaSinFacturarPorCliente.slice(0, 9).map((r) => [r.cliente, fmt(r.monto)])}
              totalRow={["TOTAL GENERAL", fmt(data.totalPorFacturar)]}
            />
          </div>
        </div>
        <SlideFooter n={5} />
      </div>

      {/* Slide 6 — Venta por cliente */}
      <div ref={refs[5]} style={slideFrame}>
        <SlideHeader title="VENTA POR CLIENTE" subtitle={"Ranking " + anioActual + " por participación sobre el total"} />
        <div style={{ display: "flex", gap: 24, padding: "20px 48px 0", height: 560, boxSizing: "border-box" }}>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer>
              <BarChart data={data.ventaPorClienteActual} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid horizontal={false} stroke={BORDER} />
                <XAxis type="number" tick={{ fontSize: 9.5, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"} />
                <YAxis type="category" dataKey="cliente" width={110} tick={{ fontSize: 10, fill: TEXT }} axisLine={false} tickLine={false} />
                <Bar dataKey="venta" fill={GOLD} radius={[0, 4, 4, 0]}>
                  <LabelList dataKey="venta" position="right" formatter={(v) => (v / 1000000).toFixed(0) + "M"} style={{ fontSize: 9.5, fill: NAVY }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 0.85 }}>
            <Tbl
              cols={["CLIENTE", "VENTA", "SHARE"]}
              widths={["1.3fr", "1fr", "0.7fr"]}
              rows={data.ventaPorClienteActual.map((c) => [
                c.cliente, fmt(c.venta),
                data.totalVentaClienteActual ? ((c.venta / data.totalVentaClienteActual) * 100).toFixed(1) + "%" : "—",
              ])}
              totalRow={["TOTAL", fmt(data.totalVentaClienteActual), "100,0%"]}
            />
          </div>
        </div>
        <SlideFooter n={6} />
      </div>

      {/* Slide 7 — Margen bruto */}
      <div ref={refs[6]} style={slideFrame}>
        <SlideHeader title={"MARGEN BRUTO " + anioActual} subtitle="Evolución del margen inicial a final por cliente" />
        <div style={{ padding: "20px 48px 0" }}>
          <Tbl
            cols={["CLIENTE", "VENTA FINAL", "MB INICIAL", "MB FINAL", "VARIACIÓN"]}
            widths={["1.4fr", "1fr", "0.8fr", "0.8fr", "0.9fr"]}
            rows={data.margenPorCliente.map((c) => [
              c.cliente, fmt(c.venta), pct(c.mbInicial), pct(c.mbFinal),
              (c.variacion >= 0 ? "+" : "") + c.variacion.toFixed(0) + " p.p.",
            ])}
            totalRow={["TOTAL GENERAL", fmt(data.margenTotal.venta), pct(data.margenTotal.mbInicial), pct(data.margenTotal.mbFinal),
              (data.margenTotal.variacion >= 0 ? "+" : "") + data.margenTotal.variacion.toFixed(0) + " p.p."]}
          />
        </div>
        <SlideFooter n={7} />
      </div>

      {/* Slide 8 — CASH (proyección semanal, desde Cashflow) */}
      <div ref={refs[7]} style={slideFrame}>
        <SlideHeader title="CASH" subtitle="Proyección semanal de ingresos, egresos y saldo — pantalla Cashflow" />
        <div style={{ display: "flex", gap: 24, padding: "20px 48px 0", height: 560, boxSizing: "border-box" }}>
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <KpiCard label="SALDO INICIAL" value={fmt(data.saldoInicialCash)} />
              <KpiCard label="INGRESOS PROYECTADOS (12 SEM.)" value={fmt(data.totalIngresosCash)} color={GREEN} />
              <KpiCard label="EGRESOS PROYECTADOS (12 SEM.)" value={fmt(data.totalEgresosCash)} color={RED} />
              <KpiCard label="SALDO PROYECTADO A 12 SEMANAS" value={fmt(data.saldoProyectadoCash)} color={data.saldoProyectadoCash >= 0 ? GOLD : RED} />
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer>
                <BarChart data={data.cashChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={BORDER} />
                  <XAxis dataKey="semana" tick={{ fontSize: 9.5, fill: MUTED }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9.5, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"} />
                  <Bar dataKey="saldo" fill={NAVY} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div style={{ flex: 0.85 }}>
            <Tbl
              cols={["SEMANA", "INGRESOS", "EGRESOS", "NETO", "SALDO ACUM."]}
              widths={["0.8fr", "1fr", "1fr", "1fr", "1fr"]}
              rows={data.cashRows}
            />
          </div>
        </div>
        <SlideFooter n={8} />
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState("obras");
  const [obras, setObras] = useState(SEED_OBRAS);
  const [facturas, setFacturas] = useState(() => SEED_FACTURAS.map((f, i) => ({ ...f, id: i })));
  const [proveedoresMap, setProveedoresMap] = useState(SEED_PROVEEDORES);
  const [pagosMap, setPagosMap] = useState(SEED_PAGOS);
  const [adicionalesMap, setAdicionalesMap] = useState(SEED_ADICIONALES);
  const [subobrasMap, setSubobrasMap] = useState({});
  const [costoSubobrasMap, setCostoSubobrasMap] = useState({});
  const [subCostoProveedoresMap, setSubCostoProveedoresMap] = useState({});
  const [subCostoPagosMap, setSubCostoPagosMap] = useState({});
  const [cfIngresosValores, setCfIngresosValores] = useState({});
  const [cfEgresosCategorias, setCfEgresosCategorias] = useState(["CHEQUES Y ARRASTRE", "SUELDOS", "ALQUILER", "EXPENSAS", "IMPUESTOS", "CARGAS SOCIALES", "PRESTAMOS", "TARJETAS DE CREDITO", "MARKETING", "VARIOS"]);
  const [cfEgresosValores, setCfEgresosValores] = useState({});
  const [cfSalidasValores, setCfSalidasValores] = useState({});
  const [cfSaldoInicial, setCfSaldoInicial] = useState(0);
  const [cfSemanaInicio, setCfSemanaInicio] = useState(() => dateAFechaStr(viernesDeLaSemana(new Date())));
  const [cfDiasPagoCliente, setCfDiasPagoCliente] = useState({});
  const [proveedoresCatalogo, setProveedoresCatalogo] = useState(SEED_CATALOGO_PROVEEDORES);
  // Tipo de cambio: es compartido con todo el equipo (se guarda en la base
  // junto al resto de los datos) y queda fijo hasta que alguien con permiso
  // de edición lo modifique a mano. Cada vez que se carga un monto nuevo en
  // pesos en cualquier parte de la app, se le graba el valor de este campo en
  // ese momento (ver "tc" en cada registro), para que no cambie después si el
  // tipo de cambio se vuelve a actualizar.
  const [tipoCambio, setTipoCambio] = useState(0);
  // Moneda de visualización: solo cambia lo que se MUESTRA en pantalla, nunca
  // lo que se carga (siempre se carga en pesos). Es una preferencia de esta
  // pestaña/navegador, no se comparte con el equipo.
  const [moneda, setMoneda] = useState("ARS");
  const [editandoTC, setEditandoTC] = useState(false);
  const [tcInput, setTcInput] = useState("");
  // Fecha (AAAA-MM-DD) del último día en que un admin/comercial confirmó el
  // tipo de cambio a través del popup obligatorio (ver showTcPopup más abajo).
  // Es un dato compartido (se guarda junto al resto), así que una vez que
  // cualquiera de ellos lo confirma en el día, no se le vuelve a pedir a nadie más.
  const [tcFecha, setTcFecha] = useState("");
  const [showTcPopup, setShowTcPopup] = useState(false);
  const [tcPopupInput, setTcPopupInput] = useState("");
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [selectedMes, setSelectedMes] = useState(null);
  const [yearToggle, setYearToggle] = useState(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from(new Set(SEED_OBRAS.map((o) => o.anio || currentYear)));
    const init = {};
    years.forEach((y) => { init[y] = y === currentYear; });
    return init;
  });
  const [selectedObra, setSelectedObra] = useState(null);
  const [obraTab, setObraTab] = useState("facturas");
  const [editingObra, setEditingObra] = useState(false);
  const [newFacturaDraft, setNewFacturaDraft] = useState(null);
  const [showAdicionales, setShowAdicionales] = useState(false);
  const [newAdicionalDraft, setNewAdicionalDraft] = useState(null);
  const [showSubobras, setShowSubobras] = useState(false);
  const [newSubobraDraft, setNewSubobraDraft] = useState(null);
  const [importSubobrasMsg, setImportSubobrasMsg] = useState(null);
  const [newSubCostoDraft, setNewSubCostoDraft] = useState(null);
  const [expandedSubCostos, setExpandedSubCostos] = useState({});
  const [sortState, setSortState] = useState({});
  const [facturaFilter, setFacturaFilter] = useState({});
  const [pagoBusqueda, setPagoBusqueda] = useState({});
  const [activeSlice, setActiveSlice] = useState({});
  const [buscarCliente, setBuscarCliente] = useState("");
  const [importObrasAnio, setImportObrasAnio] = useState(2025);
  const [importObrasMarcarFacturado, setImportObrasMarcarFacturado] = useState(false);
  const [importObrasMsg, setImportObrasMsg] = useState(null);
  const [viewingPdf, setViewingPdf] = useState(null);
  const [generandoPresentacion, setGenerandoPresentacion] = useState(false);
  const presentacionSlideRefs = useRef(Array.from({ length: 8 }, () => React.createRef())).current;

  function toggleSort(tableId, key) {
    setSortState((prev) => {
      const cur = prev[tableId];
      const dir = cur && cur.key === key && cur.dir === "asc" ? "desc" : "asc";
      return { ...prev, [tableId]: { key, dir } };
    });
  }

  function applySort(tableId, rows) {
    const s = sortState[tableId];
    if (!s) return rows;
    return [...rows].sort((a, b) => {
      let va = a[s.key], vb = b[s.key];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va < vb) return s.dir === "asc" ? -1 : 1;
      if (va > vb) return s.dir === "asc" ? 1 : -1;
      return 0;
    });
  }
  const [showNewObra, setShowNewObra] = useState(false);
  const [newProveedorDraft, setNewProveedorDraft] = useState({});
  const [newPagoDraft, setNewPagoDraft] = useState({});
  const [ready, setReady] = useState(false);
  const [backupMsg, setBackupMsg] = useState(null);
  const [role, setRole] = useState("operaciones");
  const [backupTexto, setBackupTexto] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const isAdmin = role === "admin";
  const canEdit = role === "admin" || role === "comercial";

  // Sincroniza el estado de moneda "en vivo" (ver fmt más arriba) en cada
  // render, así todos los componentes hijos formatean con el valor vigente.
  monedaState.moneda = moneda;
  monedaState.tipoCambio = Number(tipoCambio) || 0;

  const dbRef = useRef(null);
  const applyingRemoteRef = useRef(false);
  const pendingLocalSaveRef = useRef(false);
  const facturasSeedRef = useRef(false);
  const [dbStatus, setDbStatus] = useState("connecting"); // connecting | ok | unavailable | error
  const [saveError, setSaveError] = useState(null);

  // Deshacer: antes de guardar cada cambio, se guarda una copia de cómo
  // estaban los datos justo antes (en memoria de esta pestaña, no en la base
  // compartida) para poder volver atrás si alguien borra o modifica algo por
  // error. lastPayloadRef siempre apunta al último estado ya confirmado.
  const lastPayloadRef = useRef(null);
  const isUndoingRef = useRef(false);
  const [undoStack, setUndoStack] = useState([]);
  const [undoMsg, setUndoMsg] = useState(null);

  function deshacerUltimoCambio() {
    if (undoStack.length === 0) return;
    const anterior = undoStack[undoStack.length - 1];
    isUndoingRef.current = true;
    aplicarDatosPrincipales(anterior.payload);
    setUndoStack((prev) => prev.slice(0, -1));
    setUndoMsg("Se deshizo el cambio guardado el " + new Date(anterior.ts).toLocaleString("es-AR") + ". Podés seguir deshaciendo con más clics.");
  }

  // El rol se recuerda en este navegador únicamente (no es un dato compartido con el equipo).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("obras-role");
      if (saved === "admin" || saved === "comercial") setRole(saved);
    } catch (e) { /* localStorage no disponible en este navegador */ }
  }, []);

  function intentarLogin() {
    if (pinInput === ADMIN_PIN) {
      setRole("admin");
      setShowLogin(false); setPinInput(""); setLoginError(false);
      try { window.localStorage.setItem("obras-role", "admin"); } catch (e) {}
    } else if (pinInput === COMERCIAL_PIN) {
      setRole("comercial");
      setShowLogin(false); setPinInput(""); setLoginError(false);
      try { window.localStorage.setItem("obras-role", "comercial"); } catch (e) {}
    } else {
      setLoginError(true);
    }
  }

  function salirARolOperaciones() {
    setRole("operaciones");
    try { window.localStorage.setItem("obras-role", "operaciones"); } catch (e) {}
  }

  // Todo lo que NO sean facturas se guarda junto, en un único documento
  // compartido. Las facturas viven en su propia colección (una obra puede
  // acumular cientos con el tiempo, y algunas llevan un PDF adjunto) para
  // que ninguna otra parte de la app se vea afectada por su tamaño.
  function aplicarDatosPrincipales(parsed) {
    setObras(parsed.obras || SEED_OBRAS);
    setProveedoresMap(parsed.proveedoresMap || SEED_PROVEEDORES);
    setPagosMap(parsed.pagosMap || SEED_PAGOS);
    setAdicionalesMap(parsed.adicionalesMap || SEED_ADICIONALES);
    setSubobrasMap(parsed.subobrasMap || {});
    setCostoSubobrasMap(parsed.costoSubobrasMap || {});
    setSubCostoProveedoresMap(parsed.subCostoProveedoresMap || {});
    setSubCostoPagosMap(parsed.subCostoPagosMap || {});
    setProveedoresCatalogo(parsed.proveedoresCatalogo || SEED_CATALOGO_PROVEEDORES);
    setCfIngresosValores(parsed.cfIngresosValores || {});
    setCfEgresosCategorias(parsed.cfEgresosCategorias || ["CHEQUES Y ARRASTRE", "SUELDOS", "ALQUILER", "EXPENSAS", "IMPUESTOS", "CARGAS SOCIALES", "PRESTAMOS", "TARJETAS DE CREDITO", "MARKETING", "VARIOS"]);
    setCfEgresosValores(parsed.cfEgresosValores || {});
    setCfSalidasValores(parsed.cfSalidasValores || {});
    setCfSaldoInicial(parsed.cfSaldoInicial || 0);
    setCfDiasPagoCliente(parsed.cfDiasPagoCliente || {});
    setTipoCambio(parsed.tipoCambio || 0);
    setTcFecha(parsed.tcFecha || "");
  }

  // Conexión a la base compartida de la app + carga inicial + sincronización
  // en vivo con lo que carguen otros miembros del equipo.
  useEffect(() => {
    let unsubState = null;
    let unsubFacturas = null;
    let cancelled = false;
    (async () => {
      let db = null;
      try { db = window.claude && window.claude.use ? await window.claude.use("db") : null; } catch (e) { db = null; }
      if (cancelled) return;
      if (!db) { setDbStatus("unavailable"); setReady(true); return; }
      dbRef.current = db;

      unsubState = db.doc("app/state").onSnapshot(
        (snap) => {
          // Si todavía tenemos una edición local recién hecha sin confirmar
          // guardada, no la pisamos con esta instantánea remota (puede ser el
          // eco de nuestro propio guardado en curso, o un cambio de otra
          // persona más viejo que lo que ya tenemos localmente). Cuando
          // nuestro guardado termine, el próximo cambio remoto se aplica normal.
          if (snap.exists && !pendingLocalSaveRef.current) {
            applyingRemoteRef.current = true;
            const data = JSON.parse(JSON.stringify(snap.data()));
            aplicarDatosPrincipales(data);
            lastPayloadRef.current = data;
          }
          setDbStatus("ok");
          setReady(true);
        },
        () => { setDbStatus("error"); setReady(true); }
      );

      unsubFacturas = db.collection("facturas").orderBy("creadoEn").onSnapshot(
        async (qsnap) => {
          setFacturas(qsnap.docs.map((d) => ({ ...d.data(), id: d.id })));
          // Primera vez que se publica esta app: no hay facturas todavía, se
          // cargan las de ejemplo una única vez (protegido con una marca en
          // app/facturasSeed para no duplicarlas si dos personas entran a la vez).
          if (qsnap.empty && !facturasSeedRef.current) {
            facturasSeedRef.current = true;
            try {
              const marca = await db.doc("app/facturasSeed").get();
              if (!marca.exists) {
                await db.doc("app/facturasSeed").set({ done: true });
                for (let i = 0; i < SEED_FACTURAS.length; i++) {
                  await db.collection("facturas").doc(String(i)).set({ ...SEED_FACTURAS[i], creadoEn: i });
                }
              }
            } catch (e) { /* si falla, se puede recargar la página para reintentar */ }
          }
        },
        () => {}
      );
    })();
    return () => {
      cancelled = true;
      if (unsubState) unsubState();
      if (unsubFacturas) unsubFacturas();
    };
  }, []);

  // Guardado (con demora corta para no escribir en cada tecla) de todo el
  // estado compartido, salvo las facturas.
  useEffect(() => {
    if (!ready || dbStatus === "unavailable" || !dbRef.current) return;
    if (applyingRemoteRef.current) { applyingRemoteRef.current = false; return; }
    // Marca que hay una edición local todavía no confirmada en la base, para
    // que si llega una instantánea remota mientras tanto (ver más arriba) no
    // la pise. Se limpia recién cuando ESTE guardado puntual termina (si mientras
    // tanto hubo otra edición, el efecto ya se volvió a disparar y la vuelve a
    // marcar en true, así que nunca se pierde el rastro de un cambio pendiente).
    pendingLocalSaveRef.current = true;
    const payload = {
      obras, proveedoresMap, pagosMap, adicionalesMap, subobrasMap, costoSubobrasMap, subCostoProveedoresMap, subCostoPagosMap, proveedoresCatalogo,
      cfIngresosValores, cfEgresosCategorias, cfEgresosValores, cfSalidasValores, cfSaldoInicial, cfDiasPagoCliente, tipoCambio, tcFecha,
    };
    const db = dbRef.current;
    const timer = setTimeout(() => {
      // Si este guardado es producto de un "Deshacer" no lo volvemos a
      // agregar a la pila (si no, deshacer y rehacer quedarían dando vueltas
      // entre los mismos dos estados en vez de ir hacia atrás de verdad).
      const esDeshacer = isUndoingRef.current;
      isUndoingRef.current = false;
      if (!esDeshacer && lastPayloadRef.current) {
        const anterior = lastPayloadRef.current;
        setUndoStack((prev) => {
          const next = [...prev, { payload: anterior, ts: Date.now() }];
          return next.length > 15 ? next.slice(next.length - 15) : next;
        });
      }
      db.doc("app/state").set(payload)
        .then(() => { pendingLocalSaveRef.current = false; lastPayloadRef.current = payload; setSaveError(null); })
        .catch((err) => {
          pendingLocalSaveRef.current = false;
          if (err && err.code === "invalid_argument") {
            setSaveError("Los datos superaron el límite de tamaño permitido para guardarse. Si esto persiste, avisá para dividir el almacenamiento.");
          } else if (err && err.code === "quota_exceeded") {
            setSaveError("Se alcanzó el límite de almacenamiento de la app.");
          } else {
            setSaveError("No se pudieron guardar los últimos cambios. Verificá tu conexión.");
          }
        });
    }, 500);
    return () => clearTimeout(timer);
  }, [obras, proveedoresMap, pagosMap, adicionalesMap, subobrasMap, costoSubobrasMap, subCostoProveedoresMap, subCostoPagosMap, proveedoresCatalogo, cfIngresosValores, cfEgresosCategorias, cfEgresosValores, cfSalidasValores, cfSaldoInicial, cfDiasPagoCliente, tipoCambio, tcFecha, ready, dbStatus]);

  // Migración única de tipo de cambio histórico: la primera vez que se
  // publicó el switch pesos/dólares, todo lo que ya estaba cargado no tenía
  // ningún tipo de cambio guardado. Se corre una única vez (protegida con una
  // marca en app/tcHistoricoAplicado, mismo mecanismo que la semilla de
  // facturas) para dejar fijo: obras 2025 a $1264, el resto (2026 en
  // adelante) a $1450. De ahí en más, cada carga nueva usa el tipo de cambio
  // vigente en ese momento (ver tipoCambio más arriba), no este valor fijo.
  const tcHistoricoRef = useRef(false);
  useEffect(() => {
    if (!ready || dbStatus === "unavailable" || !dbRef.current) return;
    if (tcHistoricoRef.current) return;
    if (obras.length === 0 && facturas.length === 0) return;
    tcHistoricoRef.current = true;
    (async () => {
      try {
        const marca = await dbRef.current.doc("app/tcHistoricoAplicado").get();
        if (marca.exists) return;
        await dbRef.current.doc("app/tcHistoricoAplicado").set({ done: true, aplicadoEn: Date.now() });

        const anioPorKey = {};
        obras.forEach((o) => { anioPorKey[obraKey(o.cliente, o.obra)] = o.anio; });

        setObras((prev) => prev.map((o) => ({ ...o, tc: tcParaAnioHistorico(o.anio) })));

        const migrarMapa = (mapa) => {
          const next = {};
          Object.entries(mapa).forEach(([k, lista]) => {
            const tc = tcParaAnioHistorico(anioPorKey[k]);
            next[k] = (lista || []).map((item) => ({ ...item, tc }));
          });
          return next;
        };
        setProveedoresMap((prev) => migrarMapa(prev));
        setPagosMap((prev) => migrarMapa(prev));
        setAdicionalesMap((prev) => migrarMapa(prev));
        setSubobrasMap((prev) => migrarMapa(prev));

        // Sub obras de Costos (solo WU): usan el mismo tipo de cambio que la obra madre.
        const migrarSubMapa = (mapa) => {
          const next = { ...mapa };
          Object.entries(costoSubobrasMap).forEach(([k, subs]) => {
            const tc = tcParaAnioHistorico(anioPorKey[k]);
            (subs || []).forEach((_, idx) => {
              const subK = subCostoKey(k, idx);
              if (next[subK]) next[subK] = next[subK].map((item) => ({ ...item, tc }));
            });
          });
          return next;
        };
        setSubCostoProveedoresMap((prev) => migrarSubMapa(prev));
        setSubCostoPagosMap((prev) => migrarSubMapa(prev));

        // Las facturas viven en su propia colección: se actualizan una por una.
        const col = dbRef.current.collection("facturas");
        await Promise.all(facturas.map((f) => {
          const tc = tcParaAnioHistorico(anioPorKey[obraKey(f.cliente, f.obra)]);
          return col.doc(f.id).update({ tc }).catch(() => {});
        }));

        // Si todavía nadie fijó un tipo de cambio "vigente", arranca en el de
        // 2026 (el más reciente) para que lo próximo que se cargue siga esa
        // base hasta que se actualice a mano.
        setTipoCambio((prev) => prev || 1450);
      } catch (e) { /* si falla, se puede reintentar recargando la página */ }
    })();
  }, [ready, dbStatus, obras.length, facturas.length]);

  // Popup obligatorio de tipo de cambio: en cuanto entra a la app (o inicia
  // sesión) el primer admin/comercial del día, se le pide confirmar el tipo
  // de cambio vigente antes de dejarlo seguir. tcFecha es un dato compartido
  // (viaja con el resto del estado), así que una vez que cualquiera lo
  // confirma en el día, no se le vuelve a pedir a nadie más hasta el día
  // siguiente. No aplica al rol "operaciones" (solo lectura). El "día" para
  // esto arranca a las 9 de la mañana (ver fechaComercialHoy), así que se
  // vuelve a evaluar cada un minuto: si alguien deja la sesión abierta desde
  // antes de las 9, el popup le va a aparecer solo apenas se crucen las 9,
  // sin necesidad de recargar la página.
  useEffect(() => {
    if (!ready) return;
    if (role !== "admin" && role !== "comercial") { setShowTcPopup(false); return; }
    let mostradoAntes = false;
    function evaluar() {
      const hoy = fechaComercialHoy();
      const necesitaConfirmar = tcFecha !== hoy;
      if (necesitaConfirmar && !mostradoAntes) {
        setTcPopupInput(tipoCambio ? String(tipoCambio) : "");
      }
      mostradoAntes = necesitaConfirmar;
      setShowTcPopup(necesitaConfirmar);
    }
    evaluar();
    const id = setInterval(evaluar, 60000);
    return () => clearInterval(id);
  }, [ready, role, tcFecha]);

  function confirmarTcDelDia() {
    const val = Number(tcPopupInput);
    if (!val || val <= 0) return;
    setTipoCambio(val);
    setTcFecha(fechaComercialHoy());
    setShowTcPopup(false);
  }

  // Backup completo: descarga TODOS los datos de la app en un único archivo
  // JSON. Sirve para llevar la info de un link publicado a otro, ya que cada
  // vez que se publica una nueva versión, el almacenamiento arranca vacío.
  function armarBackupJson() {
    const data = {
      obras, proveedoresMap, pagosMap, adicionalesMap, subobrasMap, costoSubobrasMap, subCostoProveedoresMap, subCostoPagosMap, proveedoresCatalogo, facturas,
      cfIngresosValores, cfEgresosCategorias, cfEgresosValores, cfSalidasValores, cfSaldoInicial, cfDiasPagoCliente, tipoCambio, tcFecha,
      exportadoEl: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  }

  function exportarBackupCompleto() {
    const json = armarBackupJson();
    ofrecerDescarga("backup_seguimiento_obras_" + new Date().toISOString().slice(0, 10) + ".json", json);
  }

  // Arma un PDF tipo "informe financiero" (portada + 7 láminas) a partir de
  // los datos vigentes de la app, hasta el mes en curso. Renderiza las
  // láminas fuera de pantalla (presentacionSlideRefs) y las convierte a
  // imagen con html2canvas; jsPDF las junta en un PDF apaisado.
  async function generarPresentacionPdf() {
    if (!(window.html2canvas && window.jspdf)) {
      alert("No se pudo cargar el generador de PDF. Probá recargar la página.");
      return;
    }
    setGenerandoPresentacion(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const { jsPDF } = window.jspdf;
      const W = 1280, H = 720;
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [W, H] });
      for (let i = 0; i < presentacionSlideRefs.length; i++) {
        const node = presentacionSlideRefs[i].current;
        if (!node) continue;
        const canvas = await window.html2canvas(node, { scale: 2, backgroundColor: "#ffffff", logging: false });
        const img = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage([W, H], "landscape");
        pdf.addImage(img, "PNG", 0, 0, W, H);
      }
      const blob = pdf.output("blob");
      const nombreMes = MESES[presentacionData.mesActualIdx].toLowerCase();
      await ofrecerDescarga("informe_financiero_" + nombreMes + "_" + presentacionData.anioActual + ".pdf", blob);
    } catch (err) {
      alert("No se pudo generar la presentación. Probá de nuevo.");
    } finally {
      setGenerandoPresentacion(false);
    }
  }

  // Reemplaza TODAS las facturas guardadas por las del backup. Se hace de a
  // una (no hay una operación atómica de "borrar todo y cargar todo" en el
  // almacenamiento compartido) para no saturar de escrituras simultáneas.
  async function restaurarFacturasDesdeBackup(nuevasFacturas) {
    if (!dbRef.current) return;
    const col = dbRef.current.collection("facturas");
    const actuales = await col.get();
    for (const d of actuales.docs) {
      await col.doc(d.id).delete().catch(() => {});
    }
    for (const f of (nuevasFacturas || [])) {
      const { id, ...rest } = f;
      await col.add(rest).catch(() => {});
    }
  }

  function importarBackupCompleto(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target.result);
          aplicarDatosPrincipales(parsed);
          restaurarFacturasDesdeBackup(parsed.facturas).catch(() => {});
          resolve(true);
        } catch (err) { reject(err); }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  // Venta Total = Venta Original + Adicionales + Sub-obras (con orden de compra y fecha propia).
  // Si la obra usa sub-obras, la Venta Original pasa a calcularse sola como la suma
  // de esas sub-obras más los adicionales (no se le suma nada por encima).
  // Costo Real = suma de presupuestos reales de proveedores (si ya se cargaron).
  // MB Inicial y Final se recalculan siempre a partir de la Venta Total vigente.
  // Para cada obra se calculan DOS versiones de cada total: la de pesos de
  // siempre, y una en dólares que NO surge de dividir el total en pesos por
  // un tipo de cambio único, sino de convertir cada pago/presupuesto/venta
  // individual por SU PROPIO tipo de cambio histórico y recién ahí sumarlos.
  // Así, si cambiás el tipo de cambio vigente, lo que ya estaba cargado no
  // se mueve un solo dólar (solo lo nuevo que cargues de ahí en más).
  const obrasComputadas = useMemo(() => {
    return obras.map((o) => {
      const k = obraKey(o.cliente, o.obra);
      const adicionales = adicionalesMap[k] || [];
      const totalAdicionales = adicionales.reduce((s, a) => s + (a.monto || 0), 0);
      const totalAdicionalesUSD = adicionales.reduce((s, a) => s + aUsd(a.monto, a.tc), 0);
      const subobras = subobrasMap[k] || [];
      const totalSubobras = subobras.reduce((s, sub) => s + (sub.venta || 0), 0);
      const totalSubobrasUSD = subobras.reduce((s, sub) => s + aUsd(sub.venta, sub.tc), 0);
      const usaSubobras = subobras.length > 0;
      const ventaOriginalCalculada = usaSubobras ? (totalSubobras + totalAdicionales) : (o.ventaOriginal || 0);
      const ventaOriginalCalculadaUSD = usaSubobras ? (totalSubobrasUSD + totalAdicionalesUSD) : aUsd(o.ventaOriginal, o.tc);
      const ventaFinal = usaSubobras ? ventaOriginalCalculada : (o.ventaOriginal || 0) + totalAdicionales + totalSubobras;
      const ventaFinalUSD = usaSubobras ? ventaOriginalCalculadaUSD : aUsd(o.ventaOriginal, o.tc) + totalAdicionalesUSD + totalSubobrasUSD;
      const provs = proveedoresMap[k];
      const pagos = pagosMap[k] || [];
      const pagadoUSDDeProveedor = (listaPagos, proveedor) =>
        (listaPagos || []).filter((pg) => pg.proveedor === proveedor).reduce((s, pg) => s + aUsd(pg.monto, pg.tc), 0);
      const subCostos = costoSubobrasMap[k] || [];
      const totalSubCostos = subCostos.reduce((s, sub, idx) => {
        const subK = subCostoKey(k, idx);
        const subProvs = subCostoProveedoresMap[subK] || [];
        const subPagos = subCostoPagosMap[subK] || [];
        return s + subProvs.reduce((s2, p) => s2 + presupuestoEfectivo(p.presupuesto, pagadoDeProveedor(subPagos, p.proveedor)), 0);
      }, 0);
      const totalSubCostosUSD = subCostos.reduce((s, sub, idx) => {
        const subK = subCostoKey(k, idx);
        const subProvs = subCostoProveedoresMap[subK] || [];
        const subPagos = subCostoPagosMap[subK] || [];
        return s + subProvs.reduce((s2, p) => s2 + Math.max(aUsd(p.presupuesto, p.tc), pagadoUSDDeProveedor(subPagos, p.proveedor)), 0);
      }, 0);
      // Saldo a pagar a proveedores: lo que falta pagar de cada proveedor
      // (presupuesto real - pagado, nunca negativo), sumado en la obra y,
      // para WU, también en sus sub obras de Costos.
      const restaProveedores = (provs || []).reduce((s, p) => {
        const pagadoP = pagadoDeProveedor(pagos, p.proveedor);
        return s + (presupuestoEfectivo(p.presupuesto, pagadoP) - pagadoP);
      }, 0);
      const restaProveedoresUSD = (provs || []).reduce((s, p) => {
        const pagadoPUSD = pagadoUSDDeProveedor(pagos, p.proveedor);
        return s + (Math.max(aUsd(p.presupuesto, p.tc), pagadoPUSD) - pagadoPUSD);
      }, 0);
      const restaSubCostos = subCostos.reduce((s, sub, idx) => {
        const subK = subCostoKey(k, idx);
        const subProvs = subCostoProveedoresMap[subK] || [];
        const subPagos = subCostoPagosMap[subK] || [];
        return s + subProvs.reduce((s2, p) => {
          const pagadoP = pagadoDeProveedor(subPagos, p.proveedor);
          return s2 + (presupuestoEfectivo(p.presupuesto, pagadoP) - pagadoP);
        }, 0);
      }, 0);
      const restaSubCostosUSD = subCostos.reduce((s, sub, idx) => {
        const subK = subCostoKey(k, idx);
        const subProvs = subCostoProveedoresMap[subK] || [];
        const subPagos = subCostoPagosMap[subK] || [];
        return s + subProvs.reduce((s2, p) => {
          const pagadoPUSD = pagadoUSDDeProveedor(subPagos, p.proveedor);
          return s2 + (Math.max(aUsd(p.presupuesto, p.tc), pagadoPUSD) - pagadoPUSD);
        }, 0);
      }, 0);
      const saldoProveedores = restaProveedores + restaSubCostos;
      const saldoProveedoresUSD = restaProveedoresUSD + restaSubCostosUSD;
      let costoFinal, costoFinalUSD;
      if (o.cliente === "WU") {
        // En WU, el Costo Real es el importe mayor entre la suma de las sub
        // obras (+ proveedores generales de Costos, si hubiera) y el Costo Inicial.
        const provsSum = provs && provs.length > 0 ? provs.reduce((s, p) => s + presupuestoEfectivo(p.presupuesto, pagadoDeProveedor(pagos, p.proveedor)), 0) : 0;
        const provsSumUSD = provs && provs.length > 0 ? provs.reduce((s, p) => s + Math.max(aUsd(p.presupuesto, p.tc), pagadoUSDDeProveedor(pagos, p.proveedor)), 0) : 0;
        costoFinal = Math.max(provsSum + totalSubCostos, o.costoInicial);
        costoFinalUSD = Math.max(provsSumUSD + totalSubCostosUSD, aUsd(o.costoInicial, o.tc));
      } else {
        costoFinal = provs && provs.length > 0 ? provs.reduce((s, p) => s + presupuestoEfectivo(p.presupuesto, pagadoDeProveedor(pagos, p.proveedor)), 0) : o.costoFinal;
        costoFinalUSD = provs && provs.length > 0 ? provs.reduce((s, p) => s + Math.max(aUsd(p.presupuesto, p.tc), pagadoUSDDeProveedor(pagos, p.proveedor)), 0) : aUsd(o.costoFinal, o.tc);
      }
      const mbInicial = ventaFinal ? ((ventaFinal - o.costoInicial) / ventaFinal) * 100 : 0;
      const mbFinal = ventaFinal ? ((ventaFinal - costoFinal) / ventaFinal) * 100 : 0;
      const mbInicialUSD = ventaFinalUSD ? ((ventaFinalUSD - aUsd(o.costoInicial, o.tc)) / ventaFinalUSD) * 100 : 0;
      const mbFinalUSD = ventaFinalUSD ? ((ventaFinalUSD - costoFinalUSD) / ventaFinalUSD) * 100 : 0;
      return {
        ...o, ventaOriginal: ventaOriginalCalculada, ventaOriginalUSD: ventaOriginalCalculadaUSD, ventaOriginalManual: o.ventaOriginal,
        totalAdicionales, totalAdicionalesUSD, totalSubobras, totalSubobrasUSD, ventaFinal, ventaFinalUSD, costoFinal, costoFinalUSD, mbInicial, mbFinal, mbInicialUSD, mbFinalUSD,
        saldoProveedores, saldoProveedoresUSD,
      };
    });
  }, [obras, proveedoresMap, pagosMap, adicionalesMap, subobrasMap, costoSubobrasMap, subCostoProveedoresMap, subCostoPagosMap, tipoCambio]);

  const clientes = useMemo(() => {
    const map = {};
    obrasComputadas.forEach((o) => {
      if (!map[o.cliente]) map[o.cliente] = [];
      map[o.cliente].push(o);
    });
    return map;
  }, [obrasComputadas]);


  const mesLabelCorto = (idx) => {
    const abbr = MESES[idx].slice(0, 3);
    return abbr.charAt(0) + abbr.slice(1).toLowerCase();
  };

  const aniosDisponibles = useMemo(() => {
    return Array.from(new Set(obrasComputadas.map((o) => o.anio || new Date().getFullYear()))).sort();
  }, [obrasComputadas]);

  useEffect(() => {
    setYearToggle((prev) => {
      const next = { ...prev };
      const currentYear = new Date().getFullYear();
      let changed = false;
      aniosDisponibles.forEach((y) => { if (!(y in next)) { next[y] = y === currentYear; changed = true; } });
      return changed ? next : prev;
    });
  }, [aniosDisponibles]);

  const aniosActivos = aniosDisponibles.filter((y) => yearToggle[y] === true);

  const totals = useMemo(() => {
    const venta = obrasComputadas.reduce((s, o) => s + (o.ventaFinal || 0), 0);
    const costo = obrasComputadas.reduce((s, o) => s + (o.costoFinal || 0), 0);
    const ventaUSD = obrasComputadas.reduce((s, o) => s + (o.ventaFinalUSD || 0), 0);
    const costoUSD = obrasComputadas.reduce((s, o) => s + (o.costoFinalUSD || 0), 0);
    const mb = venta ? ((venta - costo) / venta) * 100 : 0;
    const mbUSD = ventaUSD ? ((ventaUSD - costoUSD) / ventaUSD) * 100 : 0;
    return { venta, costo, mb, ventaUSD, costoUSD, mbUSD, count: obrasComputadas.length, clientCount: Object.keys(clientes).length };
  }, [obrasComputadas, clientes]);

  const obrasFiltradasPorAnio = useMemo(() => {
    return obrasComputadas.filter((o) => aniosActivos.includes(o.anio || new Date().getFullYear()));
  }, [obrasComputadas, aniosActivos]);

  const totalsFiltrados = useMemo(() => {
    const venta = obrasFiltradasPorAnio.reduce((s, o) => s + (o.ventaFinal || 0), 0);
    const costo = obrasFiltradasPorAnio.reduce((s, o) => s + (o.costoFinal || 0), 0);
    const ventaUSD = obrasFiltradasPorAnio.reduce((s, o) => s + (o.ventaFinalUSD || 0), 0);
    const costoUSD = obrasFiltradasPorAnio.reduce((s, o) => s + (o.costoFinalUSD || 0), 0);
    const saldo = obrasFiltradasPorAnio.reduce((s, o) => s + (o.saldoProveedores || 0), 0);
    const saldoUSD = obrasFiltradasPorAnio.reduce((s, o) => s + (o.saldoProveedoresUSD || 0), 0);
    const mb = venta ? ((venta - costo) / venta) * 100 : 0;
    const mbUSD = ventaUSD ? ((ventaUSD - costoUSD) / ventaUSD) * 100 : 0;
    const clientCount = new Set(obrasFiltradasPorAnio.map((o) => o.cliente)).size;
    return { venta, costo, saldo, saldoUSD, mb, ventaUSD, costoUSD, mbUSD, count: obrasFiltradasPorAnio.length, clientCount };
  }, [obrasFiltradasPorAnio]);

  const statsPorAnioActivo = useMemo(() => {
    return aniosActivos.map((y) => {
      const obrasDelAnio = obrasComputadas.filter((o) => (o.anio || new Date().getFullYear()) === y);
      const venta = obrasDelAnio.reduce((s, o) => s + o.ventaFinal, 0);
      const costo = obrasDelAnio.reduce((s, o) => s + o.costoFinal, 0);
      const ventaUSD = obrasDelAnio.reduce((s, o) => s + (o.ventaFinalUSD || 0), 0);
      const costoUSD = obrasDelAnio.reduce((s, o) => s + (o.costoFinalUSD || 0), 0);
      const mb = venta ? ((venta - costo) / venta) * 100 : 0;
      const mbUSD = ventaUSD ? ((ventaUSD - costoUSD) / ventaUSD) * 100 : 0;
      const clientCount = new Set(obrasDelAnio.map((o) => o.cliente)).size;
      return { anio: y, clientCount, count: obrasDelAnio.length, venta, costo, mb, ventaUSD, costoUSD, mbUSD };
    });
  }, [obrasComputadas, aniosActivos]);

  const clientesFiltrados = useMemo(() => {
    const map = {};
    obrasFiltradasPorAnio.forEach((o) => {
      if (!map[o.cliente]) map[o.cliente] = [];
      map[o.cliente].push(o);
    });
    return map;
  }, [obrasFiltradasPorAnio]);

  const ventaPorCliente = useMemo(() => {
    const map = {};
    obrasFiltradasPorAnio.forEach((o) => { map[o.cliente] = (map[o.cliente] || 0) + o.ventaFinal; });
    return Object.entries(map).map(([cliente, value]) => ({ name: cliente, value })).sort((a, b) => b.value - a.value);
  }, [obrasFiltradasPorAnio]);

  const ventaPorClientePorAnio = useMemo(() => {
    const clientesSet = Array.from(new Set(obrasFiltradasPorAnio.map((o) => o.cliente)));
    return clientesSet.map((cliente) => {
      const row = { cliente };
      let total = 0;
      aniosActivos.forEach((y) => {
        const v = obrasFiltradasPorAnio
          .filter((o) => o.cliente === cliente && (o.anio || new Date().getFullYear()) === y)
          .reduce((s, o) => s + o.ventaFinal, 0);
        row[y] = v;
        total += v;
      });
      row.total = total;
      return row;
    }).sort((a, b) => b.total - a.total);
  }, [obrasFiltradasPorAnio, aniosActivos]);

  // Top 8 clientes por venta total; el resto se agrupa en "OTROS" para no saturar el gráfico
  const ventaPorClientePorAnioTop = useMemo(() => {
    if (ventaPorClientePorAnio.length <= 8) return ventaPorClientePorAnio;
    const top = ventaPorClientePorAnio.slice(0, 8);
    const resto = ventaPorClientePorAnio.slice(8);
    const otros = { cliente: "OTROS (" + resto.length + ")", total: 0 };
    aniosActivos.forEach((y) => { otros[y] = 0; });
    resto.forEach((row) => {
      aniosActivos.forEach((y) => { otros[y] += row[y] || 0; });
      otros.total += row.total;
    });
    return [...top, otros];
  }, [ventaPorClientePorAnio, aniosActivos]);

  // Cada obra aporta su venta base (Original + Adicionales) en su propio mes/año,
  // y cada sub-obra aporta su venta en el mes/año de SU propia fecha de orden de compra.
  const ventaEventos = useMemo(() => {
    const eventos = [];
    obrasComputadas.forEach((o) => {
      const k = obraKey(o.cliente, o.obra);
      const subobras = subobrasMap[k] || [];
      const usaSubobras = subobras.length > 0;
      // Si la obra usa sub-obras, "Venta Original" ya es la suma de esas sub-obras
      // más los adicionales (ver obrasComputadas). Para no duplicar ese monto acá,
      // la "base" que va al mes de la obra es solo el adicional (las sub-obras se
      // imputan cada una por separado, según su propia fecha).
      const ventaBase = usaSubobras
        ? (o.totalAdicionales || 0)
        : (o.ventaOriginal || 0) + (o.totalAdicionales || 0);
      const ventaBaseUSD = usaSubobras
        ? (o.totalAdicionalesUSD || 0)
        : aUsd(o.ventaOriginal, o.tc) + (o.totalAdicionalesUSD || 0);
      eventos.push({ anio: o.anio || new Date().getFullYear(), mesIdx: MESES.indexOf(o.mes || "ENERO"), monto: ventaBase, montoUSD: ventaBaseUSD });
      subobras.forEach((sub) => {
        const parsed = parseFechaMesAnio(sub.fecha) || { anio: o.anio || new Date().getFullYear(), mesIdx: MESES.indexOf(o.mes || "ENERO") };
        eventos.push({ anio: parsed.anio, mesIdx: parsed.mesIdx, monto: sub.venta || 0, montoUSD: aUsd(sub.venta, sub.tc) });
      });
    });
    return eventos;
  }, [obrasComputadas, subobrasMap]);

  const ventaPorMesData = useMemo(() => {
    return MESES.map((mesNombre, idx) => {
      const row = { label: mesLabelCorto(idx), mesIdx: idx };
      aniosActivos.forEach((y) => {
        row[y] = ventaEventos
          .filter((ev) => ev.anio === y && ev.mesIdx === idx)
          .reduce((s, ev) => s + ev.monto, 0);
      });
      return row;
    });
  }, [ventaEventos, aniosActivos]);

  // Comparación acumulada (año en curso vs. año anterior, mismos meses transcurridos)
  const comparacionAnioActual = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const currentMonthIdx = new Date().getMonth();
    const sumHasta = (anio) => ventaEventos
      .filter((ev) => ev.anio === anio && ev.mesIdx <= currentMonthIdx)
      .reduce((s, ev) => s + ev.monto, 0);
    const sumHastaUSD = (anio) => ventaEventos
      .filter((ev) => ev.anio === anio && ev.mesIdx <= currentMonthIdx)
      .reduce((s, ev) => s + (ev.montoUSD || 0), 0);
    const actual = sumHasta(currentYear);
    const anterior = sumHasta(previousYear);
    const delta = actual - anterior;
    const deltaPct = anterior ? (delta / anterior) * 100 : null;
    const actualUSD = sumHastaUSD(currentYear);
    const anteriorUSD = sumHastaUSD(previousYear);
    const deltaUSD = actualUSD - anteriorUSD;
    const deltaPctUSD = anteriorUSD ? (deltaUSD / anteriorUSD) * 100 : null;
    return { currentYear, previousYear, currentMonthIdx, actual, anterior, delta, deltaPct, actualUSD, anteriorUSD, deltaUSD, deltaPctUSD };
  }, [ventaEventos]);

  // Datos para el informe/presentación de Comercial: siempre año en curso vs.
  // año anterior, "a la fecha" (hasta el mes actual), independiente de los
  // filtros de año que el usuario tenga tildados en la pantalla de Obras.
  // Reutiliza ventaEventos (venta por mes real, respetando sub-obras) para
  // que el gráfico coincida con "VENTA CONSOLIDADA POR MES" de la pantalla
  // de Obras, y obraAnioMap para que coincida con Facturación.
  const presentacionData = useMemo(() => {
    const now = new Date();
    const anioActual = now.getFullYear();
    const anioAnterior = anioActual - 1;
    const mesActualIdx = now.getMonth();

    const obraAnioMap = {};
    obrasComputadas.forEach((o) => { obraAnioMap[obraKey(o.cliente, o.obra)] = o.anio || anioActual; });
    const sumImporte = (arr) => arr.reduce((s, f) => s + (f.importe || 0), 0);

    // Venta por mes: mismos eventos que alimentan "VENTA CONSOLIDADA POR MES"
    // (ventaEventos ya reparte cada sub-obra en el mes de su propia fecha).
    // El año anterior se muestra completo (12 meses, ya cerrado); el año en
    // curso solo hasta el mes actual (los meses futuros todavía no tienen
    // venta y quedan en 0/"—" en la lámina).
    const ventaDelMes = (anio, idx) => ventaEventos.filter((ev) => ev.anio === anio && ev.mesIdx === idx).reduce((s, ev) => s + ev.monto, 0);
    const chartVentaMes = MESES.map((m, idx) => ({
      label: mesLabelCorto(idx),
      [anioAnterior]: ventaDelMes(anioAnterior, idx),
      [anioActual]: idx <= mesActualIdx ? ventaDelMes(anioActual, idx) : 0,
    }));
    const totalVentaAnterior = chartVentaMes.reduce((s, row) => s + row[anioAnterior], 0);
    const totalVentaActual = chartVentaMes.reduce((s, row) => s + row[anioActual], 0);

    // "Venta" y "Facturado" por año de obra: igual que Facturación filtrada
    // por año (venta = suma de ventaFinal de las obras de ese año; facturado
    // = suma de TODAS las facturas cargadas contra obras de ese año, estén
    // pagadas o adeudadas). Así coincide con lo que se ve ahí sin filtros.
    const ventaDeAnio = (anio) => obrasComputadas.filter((o) => (o.anio || anioActual) === anio).reduce((s, o) => s + o.ventaFinal, 0);
    const facturasPorObraDeAnio = (anio) => facturas.filter((f) => obraAnioMap[obraKey(f.cliente, f.obra)] === anio);

    const ventaAnioAnterior = ventaDeAnio(anioAnterior);
    const ventaAnioActual = ventaDeAnio(anioActual);
    const facturadoAnioAnterior = sumImporte(facturasPorObraDeAnio(anioAnterior));
    const facturasAnioActualPorObra = facturasPorObraDeAnio(anioActual);
    const facturadoAnioActual = sumImporte(facturasAnioActualPorObra);
    const restaAnioAnterior = ventaAnioAnterior - facturadoAnioAnterior;
    const restaAnioActual = ventaAnioActual - facturadoAnioActual;

    // Facturado pendiente de cobro y venta total - facturado total, calculados
    // exactamente igual que en la pantalla de Facturación (sin filtros): así
    // el informe siempre coincide con lo que se ve ahí.
    const ventaTotalTodas = obrasComputadas.reduce((s, o) => s + o.ventaFinal, 0);
    const facturadoTotalTodas = facturas.reduce((s, f) => s + (f.importe || 0), 0);
    const totalPorFacturar = ventaTotalTodas - facturadoTotalTodas;
    const facturadoPendCobro = facturas.filter((f) => f.status === "ADEUDA").reduce((s, f) => s + (f.importe || 0), 0);
    const totalPendienteIngresos = totalPorFacturar + facturadoPendCobro;

    // Facturación mes a mes del año actual: mismas facturas que "Facturado
    // {anioActual}" de arriba (por año de obra), repartidas por el mes real
    // de emisión de cada una, acotado a Ene–mes actual igual que el gráfico
    // de venta. El total de esta tabla siempre es facturadoAnioActual (no la
    // suma de los meses), para que no quede desalineado por alguna factura
    // sin fecha válida — así la lámina 4 siempre cierra con la lámina 3.
    const facturacionMensualActual = MESES.slice(0, mesActualIdx + 1).map((m, idx) => ({
      mes: mesLabelCorto(idx),
      importe: sumImporte(facturasAnioActualPorObra.filter((f) => mesIdxDeFecha(f.fecha) === idx)),
    }));

    const clientesSet = new Set([...obrasComputadas.map((o) => o.cliente), ...facturas.map((f) => f.cliente)]);
    const pendCobroPorCliente = Array.from(clientesSet).map((cliente) => ({
      cliente, monto: facturas.filter((f) => f.cliente === cliente && f.status === "ADEUDA").reduce((s, f) => s + (f.importe || 0), 0),
    })).filter((r) => r.monto >= 1).sort((a, b) => b.monto - a.monto);

    // Venta total - facturado, por cliente, sobre TODAS las obras (todos los
    // años) — igual que "Pendiente por facturar" en Facturación sin filtros,
    // para que el total de esta tabla coincida con el KPI de arriba.
    const deudaSinFacturarPorCliente = Array.from(new Set(obrasComputadas.map((o) => o.cliente))).map((cliente) => {
      const obrasCliente = obrasComputadas.filter((o) => o.cliente === cliente);
      const venta = obrasCliente.reduce((s, o) => s + o.ventaFinal, 0);
      const facturado = obrasCliente.reduce((s, o) =>
        s + facturas.filter((f) => f.cliente === o.cliente && f.obra === o.obra).reduce((s2, f) => s2 + (f.importe || 0), 0), 0
      );
      return { cliente, monto: venta - facturado };
    }).filter((r) => r.monto >= 1).sort((a, b) => b.monto - a.monto);

    const obrasAnioActual = obrasComputadas.filter((o) => (o.anio || anioActual) === anioActual);
    const clientesAnioActual = Array.from(new Set(obrasAnioActual.map((o) => o.cliente)));
    const ventaPorClienteActual = clientesAnioActual.map((cliente) => ({
      cliente, venta: obrasAnioActual.filter((o) => o.cliente === cliente).reduce((s, o) => s + o.ventaFinal, 0),
    })).sort((a, b) => b.venta - a.venta);
    const totalVentaClienteActual = ventaPorClienteActual.reduce((s, c) => s + c.venta, 0);

    const margenPorCliente = clientesAnioActual.map((cliente) => {
      const obrasCliente = obrasAnioActual.filter((o) => o.cliente === cliente);
      const venta = obrasCliente.reduce((s, o) => s + o.ventaFinal, 0);
      const costoInicial = obrasCliente.reduce((s, o) => s + (o.costoInicial || 0), 0);
      const costoFinal = obrasCliente.reduce((s, o) => s + (o.costoFinal || 0), 0);
      const mbInicial = venta ? ((venta - costoInicial) / venta) * 100 : 0;
      const mbFinal = venta ? ((venta - costoFinal) / venta) * 100 : 0;
      return { cliente, venta, mbInicial, mbFinal, variacion: mbFinal - mbInicial };
    }).sort((a, b) => b.venta - a.venta);
    const margenTotal = (() => {
      const venta = obrasAnioActual.reduce((s, o) => s + o.ventaFinal, 0);
      const costoInicial = obrasAnioActual.reduce((s, o) => s + (o.costoInicial || 0), 0);
      const costoFinal = obrasAnioActual.reduce((s, o) => s + (o.costoFinal || 0), 0);
      const mbInicial = venta ? ((venta - costoInicial) / venta) * 100 : 0;
      const mbFinal = venta ? ((venta - costoFinal) / venta) * 100 : 0;
      return { venta, mbInicial, mbFinal, variacion: mbFinal - mbInicial };
    })();

    // CASH: reproduce la misma lógica que la pantalla de Cashflow (ingresos
    // por facturas adeudadas + venta pendiente de facturar, egresos por
    // categoría + salidas a proveedores, saldo acumulado semana a semana),
    // acotado a las próximas CANTIDAD_SEMANAS_CASH semanas desde la semana
    // vigente en esa pantalla (cfSemanaInicio), para que la lámina siempre
    // coincida con lo que se ve ahí.
    const CANTIDAD_SEMANAS_CASH = 12;
    const semanasCash = generarSemanas(cfSemanaInicio, CANTIDAD_SEMANAS_CASH);

    const ingresosAdeudadosCash = facturas.filter((f) => f.status === "ADEUDA").map((f) => ({ id: "f" + f.id, importe: f.importe || 0 }));
    const ingresosPendientesFacturarCash = obrasComputadas.map((o) => {
      const facturado = facturas.filter((f) => f.cliente === o.cliente && f.obra === o.obra).reduce((s, f) => s + (f.importe || 0), 0);
      const pendiente = o.ventaFinal - facturado;
      return { o, pendiente };
    }).filter((x) => x.pendiente > 1).map(({ o, pendiente }) => ({ id: "pf|" + o.cliente + "|" + o.obra, importe: pendiente }));
    const ingresosTodosCash = [...ingresosAdeudadosCash, ...ingresosPendientesFacturarCash];

    const salidasPorCCMapCash = {};
    Object.entries(proveedoresMap).forEach(([k, provs]) => {
      const pagos = pagosMap[k] || [];
      provs.forEach((p) => {
        const pagado = pagos.filter((pg) => pg.proveedor === p.proveedor).reduce((s, pg) => s + pg.monto, 0);
        const saldo = (p.presupuesto || 0) - pagado;
        if (saldo > 1) {
          const ccId = "cc|" + k;
          if (!salidasPorCCMapCash[ccId]) salidasPorCCMapCash[ccId] = { ccId, proveedores: [] };
          salidasPorCCMapCash[ccId].proveedores.push({ id: k + "|" + p.proveedor, saldo });
        }
      });
    });
    // Sub obras de Costos (solo WU): tienen su propia lista de proveedores,
    // separada de la de la obra general, así que sin este bloque nunca
    // se reflejaba lo que se les debe en la proyección de Cash del PDF.
    Object.entries(subCostoProveedoresMap || {}).forEach(([subK, provs]) => {
      const pagos = (subCostoPagosMap || {})[subK] || [];
      provs.forEach((p) => {
        const pagado = pagos.filter((pg) => pg.proveedor === p.proveedor).reduce((s, pg) => s + pg.monto, 0);
        const saldo = (p.presupuesto || 0) - pagado;
        if (saldo > 1) {
          const ccId = "cc|" + subK;
          if (!salidasPorCCMapCash[ccId]) salidasPorCCMapCash[ccId] = { ccId, proveedores: [] };
          salidasPorCCMapCash[ccId].proveedores.push({ id: subK + "|" + p.proveedor, saldo });
        }
      });
    });
    const salidasPorCentroDeCostoCash = Object.values(salidasPorCCMapCash);
    const montoEfectivoCCSemanaCash = (cc, sem) => {
      const ccVal = Number(cfSalidasValores[cc.ccId + "|" + sem]) || 0;
      const provVal = cc.proveedores.reduce((s, p) => s + (Number(cfSalidasValores[p.id + "|" + sem]) || 0), 0);
      return Math.max(ccVal, provVal);
    };

    const totalesPorSemanaCash = semanasCash.map((sem) => {
      const ingresos = ingresosTodosCash.reduce((s, it) => s + (Number(cfIngresosValores[it.id + "|" + sem]) || 0), 0);
      const egresosCat = cfEgresosCategorias.reduce((s, cat) => s + (Number(cfEgresosValores[cat + "|" + sem]) || 0), 0);
      const egresosSalidas = salidasPorCentroDeCostoCash.reduce((s, cc) => s + montoEfectivoCCSemanaCash(cc, sem), 0);
      const egresos = egresosCat + egresosSalidas;
      return { semana: sem, ingresos, egresos, neto: ingresos - egresos };
    });
    let accCash = cfSaldoInicial;
    const arrastreCash = totalesPorSemanaCash.map((t) => { accCash += t.neto; return accCash; });
    const cashRows = totalesPorSemanaCash.map((t, i) => [
      semanaLabelCorta(t.semana), fmt(t.ingresos), fmt(t.egresos), fmt(t.neto), fmt(arrastreCash[i]),
    ]);
    const cashChart = totalesPorSemanaCash.map((t, i) => ({ semana: semanaLabelCorta(t.semana), saldo: arrastreCash[i] }));
    const totalIngresosCash = totalesPorSemanaCash.reduce((s, t) => s + t.ingresos, 0);
    const totalEgresosCash = totalesPorSemanaCash.reduce((s, t) => s + t.egresos, 0);
    const saldoProyectadoCash = arrastreCash.length ? arrastreCash[arrastreCash.length - 1] : cfSaldoInicial;

    return {
      anioActual, anioAnterior, mesActualIdx,
      chartVentaMes, totalVentaAnterior, totalVentaActual,
      ventaAnioAnterior, ventaAnioActual, facturadoAnioAnterior, facturadoAnioActual,
      restaAnioAnterior, restaAnioActual,
      totalPorFacturar, facturadoPendCobro, totalPendienteIngresos,
      facturacionMensualActual, pendCobroPorCliente, deudaSinFacturarPorCliente,
      ventaPorClienteActual, totalVentaClienteActual, margenPorCliente, margenTotal,
      cashRows, cashChart, saldoInicialCash: cfSaldoInicial, saldoProyectadoCash, totalIngresosCash, totalEgresosCash,
    };
  }, [
    obrasComputadas, facturas, proveedoresMap, pagosMap, subCostoProveedoresMap, subCostoPagosMap,
    cfSemanaInicio, cfSaldoInicial, cfIngresosValores, cfEgresosCategorias, cfEgresosValores, cfSalidasValores,
  ]);

  function addObra(form) {
    const ventaOriginal = Number(form.venta) || 0;
    const costoInicial = Number(form.costoInicial) || 0;
    setObras((prev) => [...prev, {
      cliente: form.cliente.toUpperCase(), obra: form.obra.toUpperCase(), status: "EN PROCESO",
      costoInicial, costoFinal: costoInicial, ventaOriginal, tc: tipoCambio,
      mes: form.mes || "ENERO", anio: Number(form.anio) || new Date().getFullYear(),
    }]);
    setShowNewObra(false);
  }

  function addProveedor(k, form) {
    const presupuestoOriginal = Number(form.presupuestoOriginal) || 0;
    const presupuesto = Number(form.presupuesto) || presupuestoOriginal;
    const nombre = form.proveedor.toUpperCase();
    setProveedoresMap((prev) => ({
      ...prev,
      [k]: consolidarProveedores([...(prev[k] || []), { proveedor: nombre, presupuestoOriginal, presupuesto, tc: tipoCambio }]),
    }));
    addCatalogoProveedor(nombre);
    setNewProveedorDraft((prev) => ({ ...prev, [k]: null }));
  }

  function addPago(k, form) {
    const monto = Number(form.monto) || 0;
    setPagosMap((prev) => ({
      ...prev,
      [k]: [...(prev[k] || []), { proveedor: form.proveedor.toUpperCase(), monto, fecha: form.fecha || "—", fc: form.fc || "—", observaciones: form.observaciones || "", tc: tipoCambio }],
    }));
    setNewPagoDraft((prev) => ({ ...prev, [k]: null }));
  }

  // Carga masiva de pagos general: cada fila trae su propio Cliente, Centro
  // de Costo y Proveedor. Sigue la misma lógica que registrar un pago a mano:
  // solo se aplica si ese proveedor ya está cargado en esa obra (para que
  // sume a lo pagado y reste del saldo correspondiente).
  // Si la fila trae "Sub Obra" (solo tiene sentido en WU), el pago se aplica
  // dentro de esa sub obra de Costos en lugar de la lista general de la obra;
  // en el resto de los clientes esa columna queda vacía y no cambia nada.
  // Resuelve a qué obra o sub obra apunta una fila (sin mirar el proveedor):
  // devuelve { ok: true, target: "main"|"sub", key/subK } o { ok: false, motivo }.
  function resolverDestinoPago(r) {
    const key = obraKey(r.cliente, r.obra);
    if (r.subObra) {
      const subCostos = costoSubobrasMap[key] || [];
      const idx = subCostos.findIndex((s) => (s.nombre || "").trim().toUpperCase() === r.subObra.trim().toUpperCase());
      if (idx < 0) return { ok: false, motivo: "No se encontró la sub obra \"" + r.subObra + "\" en " + r.cliente + " / " + r.obra };
      return { ok: true, target: "sub", subK: subCostoKey(key, idx) };
    }
    if (!obras.some((o) => obraKey(o.cliente, o.obra) === key)) {
      return { ok: false, motivo: "No se encontró la obra \"" + r.obra + "\" para el cliente \"" + r.cliente + "\"" };
    }
    return { ok: true, target: "main", key };
  }

  // Valida una fila de pago sin aplicarla: devuelve { ok: true, target, key/subK, pago }
  // o { ok: false, motivo } explicando exactamente por qué no se puede cargar.
  function validarPago(r) {
    const dest = resolverDestinoPago(r);
    if (!dest.ok) return dest;
    const pago = { proveedor: r.proveedor, monto: r.importe, fecha: r.fecha, fc: r.factura, observaciones: r.observaciones || "", tc: tipoCambio };
    if (dest.target === "sub") {
      const subProvs = subCostoProveedoresMap[dest.subK] || [];
      if (!subProvs.some((p) => p.proveedor === r.proveedor)) {
        return { ok: false, motivo: "El proveedor \"" + r.proveedor + "\" no está cargado en esa sub obra" };
      }
      return { ok: true, target: "sub", subK: dest.subK, pago };
    }
    const provs = proveedoresMap[dest.key] || [];
    if (!provs.some((p) => p.proveedor === r.proveedor)) {
      return { ok: false, motivo: "El proveedor \"" + r.proveedor + "\" no está cargado en esa obra" };
    }
    return { ok: true, target: "main", key: dest.key, pago };
  }

  // Aplica en bloque una lista de resultados ya validados (ok: true) de validarPago.
  function aplicarPagosValidados(validados) {
    const mainOnes = validados.filter((v) => v.target === "main");
    const subOnes = validados.filter((v) => v.target === "sub");
    if (mainOnes.length) {
      setPagosMap((prev) => {
        const next = { ...prev };
        mainOnes.forEach(({ key, pago }) => { next[key] = [...(next[key] || []), pago]; });
        return next;
      });
    }
    if (subOnes.length) {
      setSubCostoPagosMap((prev) => {
        const next = { ...prev };
        subOnes.forEach(({ subK, pago }) => { next[subK] = [...(next[subK] || []), pago]; });
        return next;
      });
    }
  }

  // Carga masiva de pagos general: cada fila trae su propio Cliente, Centro
  // de Costo y Proveedor. Sigue la misma lógica que registrar un pago a mano:
  // solo se aplica si ese proveedor ya está cargado en esa obra (para que
  // sume a lo pagado y reste del saldo correspondiente).
  // Si la fila trae "Sub Obra" (solo tiene sentido en WU), el pago se aplica
  // dentro de esa sub obra de Costos en lugar de la lista general de la obra;
  // en el resto de los clientes esa columna queda vacía y no cambia nada.
  // Las filas que no se pueden aplicar se devuelven en "fallidos" (con el motivo)
  // para que la persona las corrija a mano y reintente, en vez de perderlas.
  function importarPagosGeneral(filas) {
    const fallidos = [];
    const validados = [];
    filas.forEach((r) => {
      const res = validarPago(r);
      if (res.ok) validados.push(res);
      else fallidos.push({ ...r, motivo: res.motivo });
    });
    aplicarPagosValidados(validados);
    return { aplicadosCount: validados.length, fallidos };
  }

  // Reintenta una única fila (ya corregida a mano) desde el modal de revisión.
  // A diferencia de la carga masiva (que nunca da de alta proveedores solos,
  // para no crear altas accidentales por errores de tipeo en un archivo grande),
  // acá si el proveedor no existe en la obra o sub obra de destino se lo crea
  // en el momento con el presupuesto original/real que se haya cargado en el
  // popup (0 si se dejó vacío), y recién después se aplica el pago.
  function reintentarPagoIndividual(r) {
    const dest = resolverDestinoPago(r);
    if (!dest.ok) return dest;
    const nombreProv = (r.proveedor || "").trim().toUpperCase();
    if (!nombreProv) return { ok: false, motivo: "Falta el nombre del proveedor" };
    const provsActuales = dest.target === "sub" ? (subCostoProveedoresMap[dest.subK] || []) : (proveedoresMap[dest.key] || []);
    const yaExiste = provsActuales.some((p) => p.proveedor === nombreProv);
    if (!yaExiste) {
      const presupuestoOriginal = Number(r.presupuestoOriginal) || 0;
      const presupuesto = Number(r.presupuestoReal) || presupuestoOriginal;
      if (dest.target === "sub") addSubCostoProveedor(dest.subK, { proveedor: nombreProv, presupuestoOriginal, presupuesto });
      else addProveedor(dest.key, { proveedor: nombreProv, presupuestoOriginal, presupuesto });
    }
    const pago = { proveedor: nombreProv, monto: Number(r.importe) || 0, fecha: r.fecha, fc: r.factura, observaciones: r.observaciones || "", tc: tipoCambio };
    aplicarPagosValidados([{ target: dest.target, key: dest.key, subK: dest.subK, pago }]);
    return { ok: true };
  }

  function updateProveedor(k, index, changes) {
    // El tipo de cambio se fija cuando se carga el proveedor y no se toca al
    // editar (aunque se corrija el presupuesto): un error de tipeo no es un
    // cambio real del tipo de cambio vigente en ese momento.
    setProveedoresMap((prev) => ({
      ...prev,
      [k]: prev[k].map((p, i) => i !== index ? p : {
        proveedor: (changes.proveedor || p.proveedor).toUpperCase(),
        presupuestoOriginal: Number(changes.presupuestoOriginal) || 0,
        presupuesto: Number(changes.presupuesto) || 0,
        tc: p.tc || tipoCambio,
      }),
    }));
  }

  function deleteProveedor(k, index) {
    setProveedoresMap((prev) => ({ ...prev, [k]: prev[k].filter((_, i) => i !== index) }));
  }

  function updatePago(k, index, changes) {
    // Se conserva el tipo de cambio con el que se cargó el pago originalmente.
    setPagosMap((prev) => ({
      ...prev,
      [k]: prev[k].map((p, i) => i !== index ? p : {
        proveedor: (changes.proveedor || p.proveedor).toUpperCase(),
        monto: Number(changes.monto) || 0,
        fecha: changes.fecha || p.fecha,
        fc: changes.fc || p.fc,
        observaciones: changes.observaciones !== undefined ? changes.observaciones : (p.observaciones || ""),
        tc: p.tc || tipoCambio,
      }),
    }));
  }

  function deletePago(k, index) {
    setPagosMap((prev) => ({ ...prev, [k]: prev[k].filter((_, i) => i !== index) }));
  }

  // Sub obras dentro de Costos (solo WU): agrupaciones internas de costo,
  // independientes de las Órdenes de Compra. Cada una tiene su propia lista
  // de proveedores/presupuestos, guardada en subCostoProveedoresMap/subCostoPagosMap.

  function addCostoSubobra(k, nombre) {
    setCostoSubobrasMap((prev) => ({
      ...prev,
      [k]: [...(prev[k] || []), { nombre: nombre || "SUB OBRA" }],
    }));
    setNewSubCostoDraft(null);
  }

  function renameCostoSubobra(k, index, nombre) {
    setCostoSubobrasMap((prev) => ({
      ...prev,
      [k]: prev[k].map((s, i) => i !== index ? s : { ...s, nombre: nombre || s.nombre }),
    }));
  }

  function deleteCostoSubobra(k, index) {
    const subK = subCostoKey(k, index);
    setCostoSubobrasMap((prev) => ({ ...prev, [k]: prev[k].filter((_, i) => i !== index) }));
    setSubCostoProveedoresMap((prev) => { const next = { ...prev }; delete next[subK]; return next; });
    setSubCostoPagosMap((prev) => { const next = { ...prev }; delete next[subK]; return next; });
  }

  function addSubCostoProveedor(subK, form) {
    const presupuestoOriginal = Number(form.presupuestoOriginal) || 0;
    const presupuesto = Number(form.presupuesto) || presupuestoOriginal;
    const nombre = form.proveedor.toUpperCase();
    setSubCostoProveedoresMap((prev) => ({
      ...prev,
      [subK]: consolidarProveedores([...(prev[subK] || []), { proveedor: nombre, presupuestoOriginal, presupuesto, tc: tipoCambio }]),
    }));
    addCatalogoProveedor(nombre);
    setNewProveedorDraft((prev) => ({ ...prev, [subK]: null }));
  }

  function updateSubCostoProveedor(subK, index, changes) {
    // Se conserva el tipo de cambio con el que se cargó el proveedor originalmente.
    setSubCostoProveedoresMap((prev) => ({
      ...prev,
      [subK]: prev[subK].map((p, i) => i !== index ? p : {
        proveedor: (changes.proveedor || p.proveedor).toUpperCase(),
        presupuestoOriginal: Number(changes.presupuestoOriginal) || 0,
        presupuesto: Number(changes.presupuesto) || 0,
        tc: p.tc || tipoCambio,
      }),
    }));
  }

  function deleteSubCostoProveedor(subK, index) {
    setSubCostoProveedoresMap((prev) => ({ ...prev, [subK]: prev[subK].filter((_, i) => i !== index) }));
  }

  function addSubCostoPago(subK, form) {
    const monto = Number(form.monto) || 0;
    setSubCostoPagosMap((prev) => ({
      ...prev,
      [subK]: [...(prev[subK] || []), { proveedor: form.proveedor.toUpperCase(), monto, fecha: form.fecha || "—", fc: form.fc || "—", observaciones: form.observaciones || "", tc: tipoCambio }],
    }));
    setNewPagoDraft((prev) => ({ ...prev, [subK]: null }));
  }

  function updateSubCostoPago(subK, index, changes) {
    // Se conserva el tipo de cambio con el que se cargó el pago originalmente.
    setSubCostoPagosMap((prev) => ({
      ...prev,
      [subK]: prev[subK].map((p, i) => i !== index ? p : {
        proveedor: (changes.proveedor || p.proveedor).toUpperCase(),
        monto: Number(changes.monto) || 0,
        fecha: changes.fecha || p.fecha,
        fc: changes.fc || p.fc,
        observaciones: changes.observaciones !== undefined ? changes.observaciones : (p.observaciones || ""),
        tc: p.tc || tipoCambio,
      }),
    }));
  }

  function deleteSubCostoPago(subK, index) {
    setSubCostoPagosMap((prev) => ({ ...prev, [subK]: prev[subK].filter((_, i) => i !== index) }));
  }

  function avisarErrorFactura(err) {
    if (err && err.code === "invalid_argument") {
      setSaveError("No se pudo guardar la factura: es muy pesada (probablemente por el PDF adjunto). Probá con un PDF de menos de 180 KB.");
    } else {
      setSaveError("No se pudo guardar la factura. Verificá tu conexión.");
    }
  }

  function addFactura(cliente, obra, form) {
    if (!dbRef.current) return;
    dbRef.current.collection("facturas").add({
      cliente, obra,
      concepto: form.concepto || null,
      tipo: form.tipo || null,
      nro: form.nro || null,
      fecha: normalizarFecha(form.fecha) || "—",
      status: form.status || "ADEUDA",
      importe: Number(form.importe) || 0,
      fechaPago: form.fechaPago ? normalizarFecha(form.fechaPago) : null,
      forma: form.forma || null,
      pdfData: form.pdfData || null,
      pdfName: form.pdfName || null,
      creadoEn: Date.now(),
      tc: tipoCambio,
    }).then(() => setSaveError(null)).catch(avisarErrorFactura);
  }

  // Poda una colección de historial/papelera para que no crezca infinito:
  // se queda solo con los "cap" registros más recientes (según el campo de
  // fecha que tenga cada uno). Si falla, no afecta lo que ya se guardó.
  async function podarColeccion(col, cap) {
    try {
      const snap = await col.get();
      if (snap.docs.length > cap) {
        const ordenados = snap.docs
          .map((d) => ({ id: d.id, ts: d.data().eliminadaEn || d.data().modificadaEn || 0 }))
          .sort((a, b) => a.ts - b.ts);
        const aBorrar = ordenados.slice(0, ordenados.length - cap);
        for (const item of aBorrar) { await col.doc(item.id).delete().catch(() => {}); }
      }
    } catch (e) { /* si falla la poda, no afecta lo ya guardado */ }
  }
  const PAPELERA_CAP = 50;

  function updateFactura(id, changes) {
    if (!dbRef.current) return;
    const f = facturas.find((x) => x.id === id);
    if (!f) return;
    // Guarda cómo estaba la factura ANTES de este cambio, para poder
    // deshacer una edición por error (ej. dejar un importe en 0 sin querer).
    const { id: _omitId, ...datosAnteriores } = f;
    const ediciones = dbRef.current.collection("facturasEdiciones");
    ediciones.add({ ...datosAnteriores, facturaIdOriginal: id, modificadaEn: Date.now() })
      .then(() => podarColeccion(ediciones, PAPELERA_CAP))
      .catch(() => {});
    dbRef.current.collection("facturas").doc(id).set({
      cliente: f.cliente, obra: f.obra, creadoEn: f.creadoEn,
      concepto: changes.concepto || null,
      tipo: changes.tipo || null,
      nro: changes.nro || null,
      fecha: changes.fecha ? normalizarFecha(changes.fecha) : f.fecha,
      status: changes.status || f.status,
      importe: Number(changes.importe) || 0,
      fechaPago: changes.fechaPago ? normalizarFecha(changes.fechaPago) : null,
      forma: changes.forma || null,
      pdfData: changes.pdfData !== undefined ? changes.pdfData : f.pdfData,
      pdfName: changes.pdfName !== undefined ? changes.pdfName : f.pdfName,
      // Se conserva el tipo de cambio con el que se cargó la factura originalmente.
      tc: f.tc || tipoCambio,
    }).then(() => setSaveError(null)).catch(avisarErrorFactura);
  }

  // Antes de borrar una factura de verdad, se guarda una copia en la
  // "papelera" (otra colección aparte). Así, si alguien borra algo por
  // error, se puede restaurar después desde el botón Papelera.
  function deleteFactura(id) {
    if (!dbRef.current) return;
    const f = facturas.find((x) => x.id === id);
    const col = dbRef.current.collection("facturas");
    if (!f) { col.doc(id).delete().catch(() => {}); return; }
    const { id: _omit, ...rest } = f;
    const papelera = dbRef.current.collection("facturasPapelera");
    papelera.add({ ...rest, facturaIdOriginal: id, eliminadaEn: Date.now() })
      .then(() => {
        col.doc(id).delete().catch(() => {});
        podarColeccion(papelera, PAPELERA_CAP);
      })
      .catch(() => {
        // Si ni siquiera se pudo guardar la copia de seguridad, igual se
        // borra para no bloquear al usuario, pero se avisa que no quedó respaldo.
        col.doc(id).delete().catch(() => {});
        setSaveError("Se eliminó la factura pero no se pudo guardar una copia de seguridad en la papelera.");
      });
  }

  const [showPapelera, setShowPapelera] = useState(false);
  const [papeleraTab, setPapeleraTab] = useState("borradas"); // borradas | ediciones
  const [papelera, setPapelera] = useState([]);
  const [ediciones, setEdiciones] = useState([]);
  const [papeleraLoading, setPapeleraLoading] = useState(false);

  async function abrirPapelera() {
    setShowPapelera(true);
    setPapeleraLoading(true);
    try {
      const [snapBorradas, snapEdiciones] = await Promise.all([
        dbRef.current.collection("facturasPapelera").get(),
        dbRef.current.collection("facturasEdiciones").get(),
      ]);
      setPapelera(snapBorradas.docs.map((d) => ({ ...d.data(), id: d.id })).sort((a, b) => (b.eliminadaEn || 0) - (a.eliminadaEn || 0)));
      setEdiciones(snapEdiciones.docs.map((d) => ({ ...d.data(), id: d.id })).sort((a, b) => (b.modificadaEn || 0) - (a.modificadaEn || 0)));
    } catch (e) { setPapelera([]); setEdiciones([]); }
    setPapeleraLoading(false);
  }

  async function restaurarFacturaDePapelera(entry) {
    if (!dbRef.current) return;
    const { id: papeleraId, facturaIdOriginal, eliminadaEn, ...datosFactura } = entry;
    try {
      const col = dbRef.current.collection("facturas");
      if (facturaIdOriginal) {
        await col.doc(facturaIdOriginal).set(datosFactura);
      } else {
        await col.add(datosFactura);
      }
      await dbRef.current.collection("facturasPapelera").doc(papeleraId).delete().catch(() => {});
      setPapelera((prev) => prev.filter((x) => x.id !== papeleraId));
    } catch (e) {
      setSaveError("No se pudo restaurar la factura.");
    }
  }

  async function restaurarEdicionFactura(entry) {
    if (!dbRef.current) return;
    const { id: edicionId, facturaIdOriginal, modificadaEn, ...datosFactura } = entry;
    try {
      const col = dbRef.current.collection("facturas");
      if (facturaIdOriginal) {
        await col.doc(facturaIdOriginal).set(datosFactura);
      } else {
        await col.add(datosFactura);
      }
      await dbRef.current.collection("facturasEdiciones").doc(edicionId).delete().catch(() => {});
      setEdiciones((prev) => prev.filter((x) => x.id !== edicionId));
    } catch (e) {
      setSaveError("No se pudo restaurar la factura.");
    }
  }

  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);

  async function eliminarPermanenteDePapelera(id) {
    if (!dbRef.current) return;
    try {
      await dbRef.current.collection("facturasPapelera").doc(id).delete();
      setPapelera((prev) => prev.filter((x) => x.id !== id));
    } catch (e) { setSaveError("No se pudo eliminar de la papelera."); }
    setConfirmarEliminarId(null);
  }

  async function eliminarPermanenteDeEdicion(id) {
    if (!dbRef.current) return;
    try {
      await dbRef.current.collection("facturasEdiciones").doc(id).delete();
      setEdiciones((prev) => prev.filter((x) => x.id !== id));
    } catch (e) { setSaveError("No se pudo eliminar del historial."); }
    setConfirmarEliminarId(null);
  }

  async function vaciarPapelera() {
    if (!dbRef.current || papelera.length === 0) return;
    await Promise.all(papelera.map((f) => dbRef.current.collection("facturasPapelera").doc(f.id).delete().catch(() => {})));
    setPapelera([]);
    setConfirmarEliminarId(null);
  }

  async function vaciarEdiciones() {
    if (!dbRef.current || ediciones.length === 0) return;
    await Promise.all(ediciones.map((f) => dbRef.current.collection("facturasEdiciones").doc(f.id).delete().catch(() => {})));
    setEdiciones([]);
    setConfirmarEliminarId(null);
  }

  function updateObra(k, changes) {
    const [oldCliente, oldObraName] = k.split("|");
    const newCliente = (changes.cliente || oldCliente).toUpperCase().trim();
    const newObraName = (changes.obra || oldObraName).toUpperCase().trim();
    const renaming = newCliente !== oldCliente || newObraName !== oldObraName;
    const newKey = obraKey(newCliente, newObraName);

    // Si el nuevo cliente + centro de costo ya corresponde a OTRA obra existente,
    // no se puede renombrar (se pisarían los datos de esa otra obra).
    if (renaming && obras.some((o) => { const ok = obraKey(o.cliente, o.obra); return ok === newKey && ok !== k; })) {
      alert("Ya existe una obra \"" + newObraName + "\" para el cliente \"" + newCliente + "\". Elegí otro nombre.");
      return;
    }

    // El tipo de cambio se fija la primera vez que se carga la venta y no se
    // toca al editar (aunque se corrija el importe): un error de carga no es
    // un cambio del tipo de cambio vigente en ese momento.
    setObras((prev) => prev.map((o) => {
      if (obraKey(o.cliente, o.obra) !== k) return o;
      const ventaOriginal = Number(changes.venta) || 0;
      const costoInicial = Number(changes.costoInicial) || 0;
      return { ...o, cliente: newCliente, obra: newObraName, ventaOriginal, costoInicial, costoFinal: costoInicial, status: changes.status, mes: changes.mes || o.mes, anio: Number(changes.anio) || o.anio, tc: o.tc || tipoCambio };
    }));

    if (renaming) {
      const moveKey = (mapSetter) => mapSetter((prev) => {
        if (!(k in prev)) return prev;
        const next = { ...prev };
        next[newKey] = next[k];
        delete next[k];
        return next;
      });
      moveKey(setProveedoresMap);
      moveKey(setPagosMap);
      moveKey(setAdicionalesMap);
      moveKey(setSubobrasMap);
      moveKey(setCostoSubobrasMap);

      // subCostoProveedoresMap / subCostoPagosMap usan claves con prefijo
      // "<obraKey>::subCosto::<indice>", así que hay que migrar todas las
      // que empiecen con la clave vieja, no solo una entrada exacta.
      const moveSubCostoKeys = (mapSetter) => mapSetter((prev) => {
        const prefix = k + "::subCosto::";
        const matching = Object.keys(prev).filter((kk) => kk.startsWith(prefix));
        if (matching.length === 0) return prev;
        const next = { ...prev };
        matching.forEach((kk) => {
          const suffix = kk.slice(prefix.length);
          next[newKey + "::subCosto::" + suffix] = next[kk];
          delete next[kk];
        });
        return next;
      });
      moveSubCostoKeys(setSubCostoProveedoresMap);
      moveSubCostoKeys(setSubCostoPagosMap);

      // Cashflow: los valores cargados a mano en las grillas de Ingresos y
      // Salidas semanales usan claves basadas en cliente/obra (y, para las
      // sub obras de Costos de WU, el mismo prefijo con "::subCosto::"), así
      // que hay que migrarlas también o quedan huérfanas (invisibles) tras
      // un renombre.
      setCfIngresosValores((prev) => {
        const prefijoViejo = "pf|" + oldCliente + "|" + oldObraName + "|";
        const matching = Object.keys(prev).filter((kk) => kk.startsWith(prefijoViejo));
        if (matching.length === 0) return prev;
        const prefijoNuevo = "pf|" + newCliente + "|" + newObraName + "|";
        const next = { ...prev };
        matching.forEach((kk) => {
          next[prefijoNuevo + kk.slice(prefijoViejo.length)] = next[kk];
          delete next[kk];
        });
        return next;
      });
      setCfSalidasValores((prev) => {
        let next = prev;
        let changed = false;
        const aplicar = (prefijoViejo, prefijoNuevo) => {
          const matching = Object.keys(next).filter((kk) => kk.startsWith(prefijoViejo));
          if (matching.length === 0) return;
          if (!changed) { next = { ...next }; changed = true; }
          matching.forEach((kk) => {
            next[prefijoNuevo + kk.slice(prefijoViejo.length)] = next[kk];
            delete next[kk];
          });
        };
        aplicar("cc|" + k + "::subCosto::", "cc|" + newKey + "::subCosto::");
        aplicar(k + "::subCosto::", newKey + "::subCosto::");
        aplicar("cc|" + k + "|", "cc|" + newKey + "|");
        aplicar(k + "|", newKey + "|");
        return next;
      });

      // Se actualiza también el estado local de facturas al toque (además de
      // Firestore más abajo), para que la vista no muestre "sin facturas" un
      // instante o directamente se quede así si no hay conexión en ese momento.
      setFacturas((prev) => prev.map((f) => (
        f.cliente === oldCliente && f.obra === oldObraName ? { ...f, cliente: newCliente, obra: newObraName } : f
      )));

      if (dbRef.current) {
        // Se consulta la base en vivo (no el estado local, que puede estar desactualizado
        // si se hacen renombres seguidos rápido) para no dejar facturas con los datos viejos.
        const col = dbRef.current.collection("facturas");
        col.where("cliente", "==", oldCliente).where("obra", "==", oldObraName).get()
          .then((snap) => {
            snap.docs.forEach((d) => col.doc(d.id).update({ cliente: newCliente, obra: newObraName }).catch(() => {}));
          })
          .catch(() => {
            facturas
              .filter((f) => f.cliente === oldCliente && f.obra === oldObraName)
              .forEach((f) => col.doc(f.id).update({ cliente: newCliente, obra: newObraName }).catch(() => {}));
          });
      }
      setSelectedCliente(newCliente);
      setSelectedObra(newKey);
    }

    setEditingObra(false);
  }

  function renameProveedor(oldName, newName) {
    const oldU = oldName.trim().toUpperCase();
    const newU = newName.trim().toUpperCase();
    if (!oldU || !newU || oldU === newU) return;

    setProveedoresMap((prev) => {
      const next = {};
      Object.entries(prev).forEach(([k, provs]) => {
        const renamed = provs.map((p) => p.proveedor === oldU ? { ...p, proveedor: newU } : p);
        const merged = [];
        renamed.forEach((p) => {
          const existente = merged.find((m) => m.proveedor === p.proveedor);
          if (existente) {
            existente.presupuestoOriginal += p.presupuestoOriginal || 0;
            existente.presupuesto += p.presupuesto || 0;
          } else {
            merged.push({ ...p });
          }
        });
        next[k] = merged;
      });
      return next;
    });

    setPagosMap((prev) => {
      const next = {};
      Object.entries(prev).forEach(([k, pagos]) => {
        next[k] = pagos.map((pg) => pg.proveedor === oldU ? { ...pg, proveedor: newU } : pg);
      });
      return next;
    });

    // Las sub obras de Costos (solo WU) tienen su propia lista de proveedores
    // y pagos, separada de la de la obra general, así que hay que corregirlas
    // también acá o el nombre viejo se queda pisado ahí.
    setSubCostoProveedoresMap((prev) => {
      const next = {};
      Object.entries(prev).forEach(([subK, provs]) => {
        const renamed = provs.map((p) => p.proveedor === oldU ? { ...p, proveedor: newU } : p);
        const merged = [];
        renamed.forEach((p) => {
          const existente = merged.find((m) => m.proveedor === p.proveedor);
          if (existente) {
            existente.presupuestoOriginal += p.presupuestoOriginal || 0;
            existente.presupuesto += p.presupuesto || 0;
          } else {
            merged.push({ ...p });
          }
        });
        next[subK] = merged;
      });
      return next;
    });

    setSubCostoPagosMap((prev) => {
      const next = {};
      Object.entries(prev).forEach(([subK, pagos]) => {
        next[subK] = pagos.map((pg) => pg.proveedor === oldU ? { ...pg, proveedor: newU } : pg);
      });
      return next;
    });

    setProveedoresCatalogo((prev) => {
      const withoutOld = prev.filter((n) => n !== oldU);
      return withoutOld.includes(newU) ? withoutOld.sort() : [...withoutOld, newU].sort();
    });

    // Cashflow: las salidas semanales cargadas a mano por proveedor también
    // usan su nombre en la clave (cliente|obra|proveedor|semana, o con el
    // prefijo "::subCosto::" para las sub obras de WU), así que hay que
    // corregirlas en todas las obras donde aparezca este proveedor.
    setCfSalidasValores((prev) => {
      let changed = false;
      const next = { ...prev };
      Object.keys(prev).forEach((kk) => {
        if (kk.startsWith("cc|")) return;
        const partes = kk.split("|");
        if (partes.length !== 4 || partes[2] !== oldU) return;
        const nuevaClave = partes[0] + "|" + partes[1] + "|" + newU + "|" + partes[3];
        next[nuevaClave] = next[kk];
        delete next[kk];
        changed = true;
      });
      return changed ? next : prev;
    });
  }

  function addCatalogoProveedor(nombre) {
    const n = nombre.trim().toUpperCase();
    if (!n) return;
    setProveedoresCatalogo((prev) => prev.includes(n) ? prev : [...prev, n].sort());
  }

  function addAdicional(k, form) {
    const monto = Number(form.monto) || 0;
    setAdicionalesMap((prev) => ({
      ...prev,
      [k]: [...(prev[k] || []), { concepto: form.concepto || "ADICIONAL", monto, tc: tipoCambio }],
    }));
    setNewAdicionalDraft(null);
  }

  function updateAdicional(k, index, changes) {
    // Se conserva el tipo de cambio con el que se cargó el adicional originalmente,
    // aunque se corrija el importe: fue un error de carga, no un cambio del
    // tipo de cambio vigente en ese momento.
    setAdicionalesMap((prev) => ({
      ...prev,
      [k]: prev[k].map((a, i) => i !== index ? a : { concepto: changes.concepto || a.concepto, monto: Number(changes.monto) || 0, tc: a.tc || tipoCambio }),
    }));
  }

  function deleteAdicional(k, index) {
    setAdicionalesMap((prev) => ({ ...prev, [k]: prev[k].filter((_, i) => i !== index) }));
  }

  function addSubobra(k, form) {
    const venta = Number(form.venta) || 0;
    setSubobrasMap((prev) => ({
      ...prev,
      [k]: [...(prev[k] || []), { ordenCompra: form.ordenCompra || "", venta, fecha: normalizarFecha(form.fecha) || "—", observaciones: form.observaciones || "", tc: tipoCambio }],
    }));
    setNewSubobraDraft(null);
  }

  function updateSubobra(k, index, changes) {
    // Se conserva el tipo de cambio con el que se cargó la sub obra originalmente.
    setSubobrasMap((prev) => ({
      ...prev,
      [k]: prev[k].map((s, i) => i !== index ? s : {
        ordenCompra: changes.ordenCompra !== undefined ? changes.ordenCompra : s.ordenCompra,
        venta: Number(changes.venta) || 0,
        fecha: changes.fecha ? normalizarFecha(changes.fecha) : s.fecha,
        observaciones: changes.observaciones !== undefined ? changes.observaciones : s.observaciones,
        tc: s.tc || tipoCambio,
      }),
    }));
  }

  function deleteSubobra(k, index) {
    setSubobrasMap((prev) => ({ ...prev, [k]: prev[k].filter((_, i) => i !== index) }));
  }

  // Carga masiva de sub-obras para UNA obra puntual: Orden de Compra, Venta, Fecha.
  function importarSubobrasMasivo(k, filas) {
    const nuevas = filas
      .filter((r) => r.ordenCompra || r.venta)
      .map((r) => ({
        ordenCompra: r.ordenCompra || "",
        venta: r.venta || 0,
        fecha: normalizarFecha(r.fecha) || "—",
        observaciones: r.observaciones || "",
      }));
    if (nuevas.length) {
      setSubobrasMap((prev) => ({ ...prev, [k]: [...(prev[k] || []), ...nuevas] }));
    }
    return nuevas.length;
  }

  function toggleStatus(o) {
    setObras((prev) => prev.map((x) => obraKey(x.cliente, x.obra) !== obraKey(o.cliente, o.obra) ? x : {
      ...x, status: x.status === "FINALIZADA" ? "EN PROCESO" : "FINALIZADA",
    }));
  }

  function readSpreadsheet(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: "array" });
          const sheet = wb.Sheets[wb.SheetNames[0]];
          resolve(XLSX.utils.sheet_to_json(sheet, { defval: null }));
        } catch (err) { reject(err); }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function readPdfAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function pick(row, keys) {
    for (const key of Object.keys(row)) {
      if (keys.includes(key.toString().trim().toLowerCase())) return row[key];
    }
    return null;
  }

  async function handleImportCostos(k, file) {
    if (!file) return;
    try {
      const rows = await readSpreadsheet(file);
      const nuevos = rows.map((r) => {
        const proveedor = String(pick(r, ["proveedor"]) || "").toUpperCase().trim();
        const presupuestoOriginal = Number(pick(r, ["presupuesto original", "presupuesto", "original"])) || 0;
        const presupuestoReal = Number(pick(r, ["presupuesto real", "real"])) || presupuestoOriginal;
        return { proveedor, presupuestoOriginal, presupuesto: presupuestoReal, tc: tipoCambio };
      }).filter((r) => r.proveedor);
      if (nuevos.length) {
        setProveedoresMap((prev) => ({ ...prev, [k]: consolidarProveedores([...(prev[k] || []), ...nuevos]) }));
        nuevos.forEach((n) => addCatalogoProveedor(n.proveedor));
      }
    } catch (e) { /* archivo invalido, se ignora */ }
  }

  async function handleImportPagos(k, file) {
    if (!file) return;
    try {
      const rows = await readSpreadsheet(file);
      const nuevos = rows.map((r) => {
        const proveedor = String(pick(r, ["proveedor"]) || "").toUpperCase().trim();
        const monto = Number(pick(r, ["monto", "importe", "pago"])) || 0;
        let fecha = pick(r, ["fecha"]);
        if (typeof fecha === "number" && XLSX.SSF) {
          const d = XLSX.SSF.parse_date_code(fecha);
          fecha = d ? String(d.d).padStart(2, "0") + "/" + String(d.m).padStart(2, "0") + "/" + d.y : String(fecha);
        }
        const fc = String(pick(r, ["n° fc", "nro fc", "n fc", "fc", "nro factura", "numero factura"]) ?? "—");
        const observaciones = String(pick(r, ["observaciones"]) || "");
        return { proveedor, monto, fecha: fecha ? String(fecha) : "—", fc, observaciones, tc: tipoCambio };
      }).filter((r) => r.proveedor && r.monto);
      if (nuevos.length) setPagosMap((prev) => ({ ...prev, [k]: [...(prev[k] || []), ...nuevos] }));
    } catch (e) { /* archivo invalido, se ignora */ }
  }

  function downloadTemplate(kind, k) {
    const isCostos = kind === "costos";
    const headers = isCostos ? ["Proveedor", "Presupuesto Original", "Presupuesto Real"] : ["Proveedor", "Monto", "Fecha", "N° FC", "Observaciones"];
    const proveedoresExistentes = proveedoresMap[k] || [];
    let rows;
    if (isCostos) {
      rows = [["EJEMPLO PROVEEDOR SRL", 1000000, 1000000]];
    } else if (proveedoresExistentes.length > 0) {
      rows = proveedoresExistentes.map((p) => [p.proveedor, "", "", "", ""]);
    } else {
      rows = [["EJEMPLO PROVEEDOR SRL", 100000, "07/09/2026", "1234", ""]];
    }
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, isCostos ? "Costos" : "Pagos");
    descargarLibroXlsx(wb, isCostos ? "plantilla_costos.xlsx" : "plantilla_pagos.xlsx");
  }

  // Mismas importaciones que handleImportCostos/handleImportPagos/downloadTemplate,
  // pero apuntando a una sub obra de Costos (subK) en lugar de la obra completa.
  async function handleImportCostosSubCosto(subK, file) {
    if (!file) return;
    try {
      const rows = await readSpreadsheet(file);
      const nuevos = rows.map((r) => {
        const proveedor = String(pick(r, ["proveedor"]) || "").toUpperCase().trim();
        const presupuestoOriginal = Number(pick(r, ["presupuesto original", "presupuesto", "original"])) || 0;
        const presupuestoReal = Number(pick(r, ["presupuesto real", "real"])) || presupuestoOriginal;
        return { proveedor, presupuestoOriginal, presupuesto: presupuestoReal, tc: tipoCambio };
      }).filter((r) => r.proveedor);
      if (nuevos.length) {
        setSubCostoProveedoresMap((prev) => ({ ...prev, [subK]: consolidarProveedores([...(prev[subK] || []), ...nuevos]) }));
        nuevos.forEach((n) => addCatalogoProveedor(n.proveedor));
      }
    } catch (e) { /* archivo invalido, se ignora */ }
  }

  async function handleImportPagosSubCosto(subK, file) {
    if (!file) return;
    try {
      const rows = await readSpreadsheet(file);
      const nuevos = rows.map((r) => {
        const proveedor = String(pick(r, ["proveedor"]) || "").toUpperCase().trim();
        const monto = Number(pick(r, ["monto", "importe", "pago"])) || 0;
        let fecha = pick(r, ["fecha"]);
        if (typeof fecha === "number" && XLSX.SSF) {
          const d = XLSX.SSF.parse_date_code(fecha);
          fecha = d ? String(d.d).padStart(2, "0") + "/" + String(d.m).padStart(2, "0") + "/" + d.y : String(fecha);
        }
        const fc = String(pick(r, ["n° fc", "nro fc", "n fc", "fc", "nro factura", "numero factura"]) ?? "—");
        const observaciones = String(pick(r, ["observaciones"]) || "");
        return { proveedor, monto, fecha: fecha ? String(fecha) : "—", fc, observaciones, tc: tipoCambio };
      }).filter((r) => r.proveedor && r.monto);
      if (nuevos.length) setSubCostoPagosMap((prev) => ({ ...prev, [subK]: [...(prev[subK] || []), ...nuevos] }));
    } catch (e) { /* archivo invalido, se ignora */ }
  }

  function downloadTemplateSubCosto(kind, subK) {
    const isCostos = kind === "costos";
    const headers = isCostos ? ["Proveedor", "Presupuesto Original", "Presupuesto Real"] : ["Proveedor", "Monto", "Fecha", "N° FC", "Observaciones"];
    const proveedoresExistentes = subCostoProveedoresMap[subK] || [];
    let rows;
    if (isCostos) {
      rows = [["EJEMPLO PROVEEDOR SRL", 1000000, 1000000]];
    } else if (proveedoresExistentes.length > 0) {
      rows = proveedoresExistentes.map((p) => [p.proveedor, "", "", "", ""]);
    } else {
      rows = [["EJEMPLO PROVEEDOR SRL", 100000, "07/09/2026", "1234", ""]];
    }
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, isCostos ? "Costos" : "Pagos");
    descargarLibroXlsx(wb, isCostos ? "plantilla_costos.xlsx" : "plantilla_pagos.xlsx");
  }

  function exportResumen() {
    const rows = obrasComputadas.map((o) => ({
      Cliente: o.cliente, "Centro de Costo": o.obra, Estado: o.status,
      Mes: o.mes ? o.mes.charAt(0) + o.mes.slice(1).toLowerCase() : "", "Año": o.anio || "",
      Venta: o.ventaFinal, "Costo Inicial": o.costoInicial, "Costo Real": o.costoFinal,
      "MB Inicial %": Number(o.mbInicial.toFixed(1)), "MB Final %": Number(o.mbFinal.toFixed(1)),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resumen");
    descargarLibroXlsx(wb, "resumen_obras.xlsx");
  }

  // Descarga el historial de pagos de una obra (o de una sub obra de Costos) puntual.
  function exportPagosObra(pagos, nombreArchivo) {
    const rows = pagos.map((p) => ({
      Proveedor: p.proveedor, Pago: p.monto, Fecha: p.fecha, "N° FC": p.fc, Observaciones: p.observaciones || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");
    descargarLibroXlsx(wb, nombreArchivo);
  }

  // Carga masiva de obras: Cliente, Centro de Costo, Venta Total, Costo Real, Mes, Año.
  // No trae proveedores ni facturas; costoInicial se toma igual al Costo Real
  // (no hay una apertura "inicial" separada en la planilla), y el MB se calcula
  // solo. Se omiten filas cuyo Cliente+Centro de Costo ya exista.
  // Si marcarFacturado es true, por cada obra nueva se carga una factura sintética
  // por el total de la venta, ya marcada como PAGADA (100% facturado y cobrado).
  function importarObrasMasivo(filas, anioDefault, marcarFacturado) {
    const existentes = new Set(obras.map((o) => obraKey(o.cliente, o.obra)));
    const nuevas = [];
    let omitidas = 0;
    filas.forEach((r) => {
      const key = obraKey(r.cliente, r.obra);
      if (existentes.has(key)) { omitidas++; return; }
      existentes.add(key);
      nuevas.push({
        cliente: r.cliente, obra: r.obra, status: "FINALIZADA",
        costoInicial: r.costoReal, costoFinal: r.costoReal, ventaOriginal: r.ventaTotal,
        mes: r.mes && MESES.includes(r.mes) ? r.mes : "ENERO",
        anio: r.anio || anioDefault,
      });
    });
    if (nuevas.length) setObras((prev) => [...prev, ...nuevas]);
    if (marcarFacturado && nuevas.length && dbRef.current) {
      const col = dbRef.current.collection("facturas");
      nuevas.forEach((o, idx) => {
        col.add({
          cliente: o.cliente, obra: o.obra,
          concepto: "SALDO TOTAL DE OBRA", tipo: "S/F", nro: null,
          fecha: "01/" + String(MESES.indexOf(o.mes) + 1).padStart(2, "0") + "/" + o.anio,
          status: "PAGADA", importe: o.ventaOriginal,
          fechaPago: "01/" + String(MESES.indexOf(o.mes) + 1).padStart(2, "0") + "/" + o.anio,
          forma: null, pdfData: null, pdfName: null, creadoEn: Date.now() + idx,
        }).catch(() => {});
      });
    }
    return { agregadasCount: nuevas.length, omitidasCount: omitidas };
  }

  // Para obras que ya están cargadas: completa, para cada obra del año
  // indicado, la diferencia entre su Venta Total y lo que ya tenga facturado,
  // con una factura sintética marcada como PAGADA. Si una obra ya está
  // 100% facturada, no le agrega nada (evita duplicar).
  // Consulta la base en vivo (no el estado local, que puede estar desactualizado
  // por ejemplo si se hace doble clic) y es idempotente: si la obra ya tiene una
  // factura "SALDO TOTAL DE OBRA" cargada, no agrega otra (evita duplicados).
  async function marcarAnioFacturado(anio) {
    const obrasDelAnio = obrasComputadas.filter((o) => (o.anio || new Date().getFullYear()) === anio);
    const col = dbRef.current ? dbRef.current.collection("facturas") : null;
    if (!col) return 0;
    let count = 0;
    for (const o of obrasDelAnio) {
      try {
        const snap = await col.where("cliente", "==", o.cliente).where("obra", "==", o.obra).get();
        const yaTieneSaldo = snap.docs.some((d) => (d.data().concepto || "") === "SALDO TOTAL DE OBRA");
        if (yaTieneSaldo) continue;
        const facturadoActual = snap.docs.reduce((s, d) => s + (d.data().importe || 0), 0);
        const faltante = o.ventaFinal - facturadoActual;
        if (faltante > 1) {
          const mesIdx = MESES.indexOf(o.mes || "ENERO");
          const fechaStr = "01/" + String(mesIdx + 1).padStart(2, "0") + "/" + (o.anio || anio);
          await col.add({
            cliente: o.cliente, obra: o.obra,
            concepto: "SALDO TOTAL DE OBRA", tipo: "S/F", nro: null,
            fecha: fechaStr, status: "PAGADA", importe: faltante,
            fechaPago: fechaStr, forma: null, pdfData: null, pdfName: null, creadoEn: Date.now() + count,
          });
          count++;
        }
      } catch {}
    }
    return count;
  }

  // Igual que marcarAnioFacturado pero para UNA sola obra puntual.
  async function marcarObraFacturada(o) {
    if (!dbRef.current) return false;
    const col = dbRef.current.collection("facturas");
    try {
      const snap = await col.where("cliente", "==", o.cliente).where("obra", "==", o.obra).get();
      const yaTieneSaldo = snap.docs.some((d) => (d.data().concepto || "") === "SALDO TOTAL DE OBRA");
      if (yaTieneSaldo) return false;
      const facturadoActual = snap.docs.reduce((s, d) => s + (d.data().importe || 0), 0);
      const faltante = o.ventaFinal - facturadoActual;
      if (faltante <= 1) return false;
      const mesIdx = MESES.indexOf(o.mes || "ENERO");
      const fechaStr = "01/" + String(mesIdx + 1).padStart(2, "0") + "/" + (o.anio || new Date().getFullYear());
      await col.add({
        cliente: o.cliente, obra: o.obra,
        concepto: "SALDO TOTAL DE OBRA", tipo: "S/F", nro: null,
        fecha: fechaStr, status: "PAGADA", importe: faltante,
        fechaPago: fechaStr, forma: null, pdfData: null, pdfName: null, creadoEn: Date.now(),
      });
      return true;
    } catch {
      return false;
    }
  }

  function exportObra(o) {
    const k = obraKey(o.cliente, o.obra);
    const provs = proveedoresMap[k] || [];
    const pagos = pagosMap[k] || [];
    const facturasObra = facturas.filter((f) => f.cliente === o.cliente && f.obra === o.obra);
    const subCostos = costoSubobrasMap[k] || [];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(facturasObra.map((f) => ({
      Concepto: f.concepto, Tipo: f.tipo, "N°": f.nro, "Fecha emisión": f.fecha, Estado: f.status,
      Importe: f.importe, "Fecha de pago": f.fechaPago, "Forma de pago": f.forma,
    }))), "Facturas");
    const filasCostos = provs.map((p) => {
      const pagado = pagos.filter((pg) => pg.proveedor === p.proveedor).reduce((s, pg) => s + pg.monto, 0);
      return { "Sub Obra": "", Proveedor: p.proveedor, "Presupuesto Original": p.presupuestoOriginal, "Presupuesto Real": p.presupuesto, Pagado: pagado, Saldo: p.presupuesto - pagado };
    });
    const filasPagos = pagos.map((p) => ({
      "Sub Obra": "", Proveedor: p.proveedor, Monto: p.monto, Fecha: p.fecha, "N° FC": p.fc,
    }));
    // Sub obras de Costos (solo WU): tienen su propia lista de proveedores y
    // pagos, separada de la de la obra general, así que hay que incluirlas
    // también o el Excel sale incompleto para esas obras.
    subCostos.forEach((sub, idx) => {
      const subK = subCostoKey(k, idx);
      const subProvs = subCostoProveedoresMap[subK] || [];
      const subPagos = subCostoPagosMap[subK] || [];
      subProvs.forEach((p) => {
        const pagado = subPagos.filter((pg) => pg.proveedor === p.proveedor).reduce((s, pg) => s + pg.monto, 0);
        filasCostos.push({ "Sub Obra": sub.nombre || "SUB OBRA", Proveedor: p.proveedor, "Presupuesto Original": p.presupuestoOriginal, "Presupuesto Real": p.presupuesto, Pagado: pagado, Saldo: p.presupuesto - pagado });
      });
      subPagos.forEach((p) => {
        filasPagos.push({ "Sub Obra": sub.nombre || "SUB OBRA", Proveedor: p.proveedor, Monto: p.monto, Fecha: p.fecha, "N° FC": p.fc });
      });
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filasCostos), "Costos");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(filasPagos), "Pagos");
    descargarLibroXlsx(wb, (o.cliente + "_" + o.obra).replace(/[^a-z0-9]+/gi, "_") + ".xlsx");
  }

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: BG, minHeight: "100vh", color: TEXT }}>
      {(dbStatus === "unavailable" || dbStatus === "error" || saveError) && (
        <div style={{
          background: dbStatus === "unavailable" || dbStatus === "error" ? "#3A2323" : "#4A3B12",
          color: "#F5E9C8", fontSize: 12.5, padding: "8px 20px", textAlign: "center",
        }}>
          {dbStatus === "unavailable"
            ? "No se pudo conectar al almacenamiento compartido. Los cambios que hagas ahora no se van a guardar."
            : dbStatus === "error"
            ? "Hubo un problema al conectar con el almacenamiento compartido. Probá recargar la página."
            : saveError}
        </div>
      )}
      {moneda === "USD" && !tipoCambio && (
        <div style={{ background: "#4A3B12", color: "#F5E9C8", fontSize: 12.5, padding: "8px 20px", textAlign: "center" }}>
          {canEdit
            ? "Todavía no fijaste un tipo de cambio, así que no se pueden mostrar los montos en dólares. Hacé clic en \"Dólar: sin fijar\" arriba a la derecha para cargarlo."
            : "Todavía no hay un tipo de cambio cargado, así que no se pueden mostrar los montos en dólares."}
        </div>
      )}
      <div style={{
        background: "linear-gradient(135deg, " + NAVY + " 0%, " + NAVY_DEEP + " 100%)",
        padding: "18px 28px", display: "flex", justifyContent: "flex-start", columnGap: 40, alignItems: "flex-start", flexWrap: "wrap", rowGap: 14,
        borderBottom: "3px solid " + GOLD,
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: 0.2 }}>
              MZ LATAM SA
            </div>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 7, padding: 2, border: "1px solid rgba(255,255,255,0.15)" }}>
              {["ARS", "USD"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMoneda(m)}
                  title={m === "USD" ? "Ver todos los montos convertidos a dólares (al tipo de cambio vigente de cada registro)" : "Ver todos los montos en pesos"}
                  style={{
                    border: "none", padding: "4px 10px", borderRadius: 5, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                    background: moneda === m ? GOLD : "transparent", color: moneda === m ? NAVY : "rgba(255,255,255,0.7)",
                    letterSpacing: 0.2,
                  }}
                >
                  {m === "ARS" ? "$ Pesos" : "US$ Dólares"}
                </button>
              ))}
            </div>
            {editandoTC ? (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <input
                  type="number" autoFocus placeholder="Ej: 1450"
                  value={tcInput}
                  onChange={(e) => setTcInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { setTipoCambio(Number(tcInput) || 0); setEditandoTC(false); }
                    if (e.key === "Escape") setEditandoTC(false);
                  }}
                  style={{ ...inputStyle, width: 80 }}
                />
                <button
                  onClick={() => { setTipoCambio(Number(tcInput) || 0); setEditandoTC(false); }}
                  style={{ border: "none", background: GOLD, color: NAVY, borderRadius: 6, padding: "5px 8px", cursor: "pointer", fontWeight: 700 }}
                >✓</button>
                <button
                  onClick={() => setEditandoTC(false)}
                  style={{ border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.7)", borderRadius: 6, padding: "5px 8px", cursor: "pointer" }}
                >✕</button>
              </div>
            ) : (
              <button
                onClick={canEdit ? () => { setTcInput(tipoCambio ? String(tipoCambio) : ""); setEditandoTC(true); } : undefined}
                title={canEdit
                  ? "Tipo de cambio vigente: se graba en cada monto nuevo que se cargue de acá en adelante, y no se borra hasta que lo modifiques."
                  : "Tipo de cambio vigente (usado para mostrar los montos en dólares)"}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  border: "1px solid rgba(255,255,255,0.25)", background: "transparent",
                  color: "rgba(255,255,255,0.85)", padding: "5px 9px", borderRadius: 8, fontSize: 12, whiteSpace: "nowrap",
                  cursor: canEdit ? "pointer" : "default",
                }}
              >
                Dólar: {tipoCambio ? "$" + Number(tipoCambio).toLocaleString("de-DE") : "sin fijar"}{canEdit && <Pencil size={11} />}
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
            {statsPorAnioActivo.length > 1 ? (
              <>
                {statsPorAnioActivo.map((v) => (
                  <div key={v.anio} style={{ display: "grid", gridTemplateColumns: "48px 119px 106px 212px 99px", alignItems: "center", columnGap: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: GOLD, letterSpacing: 0.4 }}>{v.anio}</div>
                    <div style={{ whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>{v.clientCount}</span>
                      <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>CLIENTES</span>
                    </div>
                    <div style={{ whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>{v.count}</span>
                      <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>OBRAS</span>
                    </div>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={fmtSmart(v.venta, v.ventaUSD)}>
                      <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>{fmtSmart(v.venta, v.ventaUSD)}</span>
                      <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>VENTA</span>
                    </div>
                    <div style={{ whiteSpace: "nowrap" }}>
                      <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: "#fff" }}>{pctSmart(v.mb, v.mbUSD)}</span>
                      <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>MB</span>
                    </div>
                  </div>
                ))}
                <div style={{ height: 1, background: "rgba(255,255,255,0.25)", margin: "2px 0" }} />
                <div style={{ display: "grid", gridTemplateColumns: "48px 119px 106px 212px 99px 1fr", alignItems: "center", columnGap: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 0.4 }}>TOTAL</div>
                  <div style={{ whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD }}>{totalsFiltrados.clientCount}</span>
                    <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>CLIENTES</span>
                  </div>
                  <div style={{ whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD }}>{totalsFiltrados.count}</span>
                    <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>OBRAS</span>
                  </div>
                  <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={fmtSmart(totalsFiltrados.venta, totalsFiltrados.ventaUSD)}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD }}>{fmtSmart(totalsFiltrados.venta, totalsFiltrados.ventaUSD)}</span>
                    <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>VENTA</span>
                  </div>
                  <div style={{ whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: GOLD }}>{pctSmart(totalsFiltrados.mb, totalsFiltrados.mbUSD)}</span>
                    <span style={{ fontSize: 13.5, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>MB</span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", rowGap: 6 }}>
                <div style={{ whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" }}>{totalsFiltrados.clientCount}</span>
                  <span style={{ fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 }}>CLIENTES</span>
                </div>
                <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.18)" }} />
                <div style={{ whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" }}>{totalsFiltrados.count}</span>
                  <span style={{ fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 }}>OBRAS</span>
                </div>
                <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.18)" }} />
                <div style={{ whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: GOLD }}>{fmtSmart(totalsFiltrados.venta, totalsFiltrados.ventaUSD)}</span>
                  <span style={{ fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 }}>VENTA TOTAL</span>
                </div>
                <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.18)" }} />
                <div style={{ whiteSpace: "nowrap" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontSize: 23, fontWeight: 700, color: "#fff" }}>{pctSmart(totalsFiltrados.mb, totalsFiltrados.mbUSD)}</span>
                  <span style={{ fontSize: 14.5, color: "rgba(255,255,255,0.55)", marginLeft: 6, letterSpacing: 0.3 }}>MARGEN BRUTO</span>
                </div>
              </div>
            )}
            {tab === "obras" && aniosDisponibles.length > 1 && (
              <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                {aniosDisponibles.map((y, i) => {
                  const active = yearToggle[y] === true;
                  return (
                    <button
                      key={y}
                      onClick={() => setYearToggle((prev) => ({ ...prev, [y]: !active }))}
                      style={{
                        border: "1px solid " + (active ? PIE_COLORS[i % PIE_COLORS.length] : "rgba(255,255,255,0.25)"),
                        background: active ? PIE_COLORS[i % PIE_COLORS.length] : "transparent",
                        color: active ? "#fff" : "rgba(255,255,255,0.75)",
                        borderRadius: 20, padding: "4px 9px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      }}
                    >
                      {y}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between" }}>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 9, padding: 3, border: "1px solid rgba(255,255,255,0.08)" }}>
              {["obras", "facturacion", "proveedores", "cashflow"].map((t) => (
                <button key={t} onClick={() => { setTab(t); if (t === "obras") { setSelectedCliente(null); setSelectedObra(null); setSelectedMes(null); } }} style={{
                  border: "none", padding: "6px 11px", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer",
                  background: tab === t ? GOLD : "transparent", color: tab === t ? NAVY : "rgba(255,255,255,0.75)",
                  letterSpacing: 0.2, transition: "background 0.15s",
                }}>
                  {t === "obras" ? "Obras" : t === "facturacion" ? "Facturación" : t === "proveedores" ? "Proveedores" : "Cashflow"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {role !== "operaciones" ? (
                <button
                  onClick={salirARolOperaciones}
                  title="Volver a modo Operaciones (solo lectura)"
                  style={{ border: "1px solid " + GOLD, background: "transparent", color: GOLD, padding: "5px 9px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
                >
                  {role === "admin" ? "Admin ✓" : "Comercial ✓"}
                </button>
              ) : showLogin ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input
                    type="password" placeholder="PIN" value={pinInput}
                    onChange={(e) => { setPinInput(e.target.value); setLoginError(false); }}
                    onKeyDown={(e) => { if (e.key === "Enter") intentarLogin(); }}
                    style={{ ...inputStyle, width: 100 }}
                    autoFocus
                  />
                  <button onClick={intentarLogin} style={{ border: "none", background: GOLD, color: NAVY, borderRadius: 6, padding: "6px 9px", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Entrar</button>
                  <button onClick={() => { setShowLogin(false); setPinInput(""); setLoginError(false); }} style={{ border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.8)", borderRadius: 6, padding: "6px 9px", fontSize: 12.5, cursor: "pointer" }}>✕</button>
                  {loginError && <span style={{ fontSize: 12, color: "#F5A3A3" }}>PIN incorrecto</span>}
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  title="Ingresar como Comercial o Admin"
                  style={{ border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.5)", padding: "5px 9px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
                >
                  Operaciones (solo lectura)
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {tab === "obras" && canEdit && (
              <button onClick={() => setShowNewObra(true)} style={{
                display: "flex", alignItems: "center", gap: 6, background: GOLD, color: NAVY, border: "none",
                padding: "7px 13px", borderRadius: 8, fontWeight: 700, fontSize: 13.5, cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.25)", letterSpacing: 0.15,
              }}>
                <Plus size={15} /> Nueva obra
              </button>
            )}
            {canEdit && (
              <button
                onClick={deshacerUltimoCambio}
                disabled={undoStack.length === 0}
                title={undoStack.length === 0 ? "No hay cambios para deshacer" : "Vuelve al estado de antes del último cambio guardado (podés hacer clic varias veces para retroceder más)"}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  border: "1px solid rgba(255,255,255,0.25)", background: "transparent",
                  color: undoStack.length === 0 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)",
                  padding: "5px 9px", borderRadius: 8, fontSize: 12,
                  cursor: undoStack.length === 0 ? "default" : "pointer",
                }}
              >
                <ArrowLeft size={12} /> Deshacer{undoStack.length > 0 ? " (" + undoStack.length + ")" : ""}
              </button>
            )}
            {canEdit && (
              <button
                onClick={abrirPapelera}
                title="Facturas borradas: se pueden restaurar desde acá"
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.85)",
                  padding: "5px 9px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                }}
              >
                <Trash2 size={12} /> Papelera de facturas
              </button>
            )}
            {isAdmin && (
              <>
                <button
                  onClick={exportarBackupCompleto}
                  title="Descarga un archivo con TODOS los datos de la app, para restaurarlos en otro link publicado"
                  style={{
                    border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.8)",
                    padding: "5px 9px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                  }}
                >
                  Descargar backup
                </button>
                <button
                  onClick={() => setBackupTexto(armarBackupJson())}
                  title="Si la descarga se bloquea, mostrá el backup como texto para copiarlo a mano"
                  style={{
                    border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.6)",
                    padding: "5px 9px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                  }}
                >
                  Ver backup como texto
                </button>
                <label
                  title="Restaura todos los datos desde un archivo de backup descargado antes"
                  style={{
                    border: "1px solid rgba(255,255,255,0.25)", background: "transparent", color: "rgba(255,255,255,0.8)",
                    padding: "5px 9px", borderRadius: 8, fontSize: 12, cursor: "pointer",
                  }}
                >
                  Restaurar backup
                  <input
                    type="file" accept="application/json" style={{ display: "none" }}
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      try {
                        await importarBackupCompleto(file);
                        setBackupMsg("Backup restaurado correctamente.");
                      } catch (err) {
                        setBackupMsg("No se pudo leer el archivo de backup.");
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </>
            )}
          </div>
        </div>
      </div>
      {backupMsg && (
        <div style={{ background: GOLD, color: NAVY, fontSize: 12, fontWeight: 700, padding: "6px 32px", textAlign: "center" }}>
          {backupMsg}
        </div>
      )}
      {undoMsg && (
        <div style={{ background: "#E6EEE9", color: GREEN, fontSize: 12, fontWeight: 700, padding: "6px 32px", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
          {undoMsg}
          <button onClick={() => setUndoMsg(null)} style={{ border: "none", background: "none", cursor: "pointer", color: GREEN }}><X size={14} /></button>
        </div>
      )}

      {showTcPopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,20,0.65)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 340, maxWidth: "90%", padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 700, color: NAVY, fontSize: 15 }}>Tipo de cambio de hoy</div>
            <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.4 }}>
              Antes de seguir, confirmá el tipo de cambio con el que se va a trabajar hoy. Se usa para mostrar los montos en dólares y queda fijo en cada carga nueva hasta que se vuelva a modificar.
            </div>
            <input
              type="number" autoFocus placeholder="Ej: 1450"
              value={tcPopupInput}
              onChange={(e) => setTcPopupInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") confirmarTcDelDia(); }}
              style={{ ...inputStyle, width: "100%", fontSize: 15, padding: "8px 10px" }}
            />
            <button
              onClick={confirmarTcDelDia}
              disabled={!Number(tcPopupInput) || Number(tcPopupInput) <= 0}
              style={{
                border: "none", background: (!Number(tcPopupInput) || Number(tcPopupInput) <= 0) ? "#ccc" : GOLD, color: NAVY,
                borderRadius: 8, padding: "9px 12px", fontWeight: 700, fontSize: 13,
                cursor: (!Number(tcPopupInput) || Number(tcPopupInput) <= 0) ? "default" : "pointer",
              }}
            >
              Confirmar y continuar
            </button>
          </div>
        </div>
      )}

      {showNewObra && <NewObraForm onCancel={() => setShowNewObra(false)} onSave={addObra} />}

      {backupTexto && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,20,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ background: "#fff", borderRadius: 12, width: "80%", height: "80%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid " + BORDER }}>
              <div style={{ fontWeight: 700, color: NAVY, fontSize: 13 }}>Backup completo (texto) — copiá todo y guardalo en un archivo .json</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(backupTexto);
                      setBackupMsg("Backup copiado al portapapeles.");
                    } catch (e) {
                      setBackupMsg("No se pudo copiar automáticamente. Seleccioná el texto a mano.");
                    }
                  }}
                  style={smallBtnPrimary}
                >
                  Copiar todo
                </button>
                <button onClick={() => setBackupTexto(null)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
              </div>
            </div>
            <textarea
              readOnly value={backupTexto}
              onClick={(e) => e.target.select()}
              style={{ flex: 1, border: "none", padding: 16, fontFamily: "monospace", fontSize: 11.5, resize: "none", outline: "none" }}
            />
          </div>
        </div>
      )}

      {viewingPdf && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,20,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ background: "#fff", borderRadius: 12, width: "80%", height: "85%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid " + BORDER }}>
              <div style={{ fontWeight: 700, color: NAVY, fontSize: 13 }}>{viewingPdf.name}</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <button onClick={() => ofrecerDescarga(viewingPdf.name || "factura.pdf", dataUrlToBlob(viewingPdf.rawData))} style={{ ...smallBtnGhost, textDecoration: "none" }}>
                  <Download size={13} /> Descargar
                </button>
                <button
                  onClick={() => { if (viewingPdf.data.startsWith("blob:")) URL.revokeObjectURL(viewingPdf.data); setViewingPdf(null); }}
                  style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}
                ><X size={18} /></button>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 24, background: BG }}>
              <div style={{ color: MUTED, fontSize: 13, textAlign: "center", maxWidth: 380 }}>
                Por una restricción del navegador, el PDF no se puede previsualizar embebido acá adentro. Abrilo en una pestaña nueva o descargalo con los botones de arriba.
              </div>
              <button onClick={() => window.open(viewingPdf.data, "_blank")} style={smallBtnPrimary}>
                <Eye size={14} style={{ verticalAlign: "-2px" }} /> Abrir PDF en pestaña nueva
              </button>
            </div>
          </div>
        </div>
      )}

      {showPapelera && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,20,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60 }}>
          <div style={{ background: "#fff", borderRadius: 12, width: "78%", maxWidth: 900, height: "78%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid " + BORDER }}>
              <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>Papelera y cambios de facturas</div>
              <button onClick={() => { setShowPapelera(false); setConfirmarEliminarId(null); }} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", gap: 6, padding: "10px 18px 0" }}>
              <button onClick={() => { setPapeleraTab("borradas"); setConfirmarEliminarId(null); }} style={{
                border: "none", padding: "7px 14px", borderRadius: "7px 7px 0 0", fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: papeleraTab === "borradas" ? "#F5F4F0" : "transparent", color: papeleraTab === "borradas" ? NAVY : MUTED,
              }}>Borradas ({papelera.length})</button>
              <button onClick={() => { setPapeleraTab("ediciones"); setConfirmarEliminarId(null); }} style={{
                border: "none", padding: "7px 14px", borderRadius: "7px 7px 0 0", fontSize: 12, fontWeight: 700, cursor: "pointer",
                background: papeleraTab === "ediciones" ? "#F5F4F0" : "transparent", color: papeleraTab === "ediciones" ? NAVY : MUTED,
              }}>Ediciones ({ediciones.length})</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "8px 18px", borderBottom: "1px solid " + BORDER }}>
              <div style={{ fontSize: 11.5, color: MUTED }}>
                {papeleraTab === "borradas"
                  ? "Facturas borradas recientemente (se guardan las últimas " + PAPELERA_CAP + "). Restaurar la devuelve a la lista de facturas de esa obra."
                  : "Cómo estaba cada factura ANTES de su última edición (se guardan las últimas " + PAPELERA_CAP + "). Restaurar vuelve todos sus campos a como estaban en ese momento."}
              </div>
              {(papeleraTab === "borradas" ? papelera.length > 0 : ediciones.length > 0) && (
                confirmarEliminarId === "__vaciar__" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, fontSize: 11.5 }}>
                    <span style={{ color: RED, fontWeight: 700 }}>¿Vaciar todo?</span>
                    <button onClick={() => (papeleraTab === "borradas" ? vaciarPapelera() : vaciarEdiciones())} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontWeight: 700 }}>Sí</button>
                    <button onClick={() => setConfirmarEliminarId(null)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}>No</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmarEliminarId("__vaciar__")} style={{ ...smallBtnGhost, flexShrink: 0, color: RED }}>Vaciar</button>
                )
              )}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "8px 18px" }}>
              {papeleraLoading ? (
                <div style={{ padding: 20, fontSize: 12.5, color: MUTED }}>Cargando...</div>
              ) : papeleraTab === "borradas" ? (
                papelera.length === 0 ? (
                  <div style={{ padding: 20, fontSize: 12.5, color: MUTED }}>No hay facturas borradas.</div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 }}>
                    {papelera.map((f) => (
                      <div key={f.id} style={{
                        display: "grid", gridTemplateColumns: "1.2fr 1.3fr 1fr 1fr 1fr 1.3fr 100px 100px", columnGap: 10,
                        alignItems: "center", fontSize: 12.5, padding: "8px 10px", borderRadius: 6, background: "#F5F4F0",
                      }}>
                        <div style={{ fontWeight: 700, color: NAVY }}>{f.cliente}</div>
                        <div>{f.obra}</div>
                        <div>{f.concepto || "—"}</div>
                        <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(f.importe, f.tc)}</div>
                        <div>{f.fecha || "—"}</div>
                        <div style={{ color: MUTED, fontSize: 11 }}>Borrada: {f.eliminadaEn ? new Date(f.eliminadaEn).toLocaleString("es-AR") : "—"}</div>
                        <button onClick={() => restaurarFacturaDePapelera(f)} style={smallBtnPrimary}>Restaurar</button>
                        {confirmarEliminarId === f.id ? (
                          <div style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 11.5 }}>
                            <button onClick={() => eliminarPermanenteDePapelera(f.id)} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontWeight: 700 }}>Sí</button>
                            <button onClick={() => setConfirmarEliminarId(null)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}>No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmarEliminarId(f.id)} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontSize: 11.5, textAlign: "left" }}>Eliminar</button>
                        )}
                      </div>
                    ))}
                  </div>
                )
              ) : ediciones.length === 0 ? (
                <div style={{ padding: 20, fontSize: 12.5, color: MUTED }}>No hay ediciones registradas.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8 }}>
                  {ediciones.map((f) => (
                    <div key={f.id} style={{
                      display: "grid", gridTemplateColumns: "1.2fr 1.3fr 1fr 1fr 1fr 1.3fr 100px 100px", columnGap: 10,
                      alignItems: "center", fontSize: 12.5, padding: "8px 10px", borderRadius: 6, background: "#F5F4F0",
                    }}>
                      <div style={{ fontWeight: 700, color: NAVY }}>{f.cliente}</div>
                      <div>{f.obra}</div>
                      <div>{f.concepto || "—"}</div>
                      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }} title="Importe que tenía antes de esta edición">{fmt(f.importe, f.tc)}</div>
                      <div>{f.fecha || "—"}</div>
                      <div style={{ color: MUTED, fontSize: 11 }}>Editada: {f.modificadaEn ? new Date(f.modificadaEn).toLocaleString("es-AR") : "—"}</div>
                      <button onClick={() => restaurarEdicionFactura(f)} style={smallBtnPrimary}>Restaurar</button>
                      {confirmarEliminarId === f.id ? (
                        <div style={{ display: "flex", gap: 4, alignItems: "center", fontSize: 11.5 }}>
                          <button onClick={() => eliminarPermanenteDeEdicion(f.id)} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontWeight: 700 }}>Sí</button>
                          <button onClick={() => setConfirmarEliminarId(null)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}>No</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmarEliminarId(f.id)} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontSize: 11.5, textAlign: "left" }}>Eliminar</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "facturacion" ? (
        <FacturacionView
          facturas={facturas} obras={obrasComputadas} onViewPdf={setViewingPdf} onMarcarAnio={marcarAnioFacturado} isAdmin={isAdmin} isComercial={role === "comercial"}
          onGoToObra={(cliente, obra) => { setTab("obras"); setSelectedCliente(cliente); setSelectedObra(obraKey(cliente, obra)); setObraTab("facturas"); }}
        />
      ) : tab === "proveedores" ? (
        <ProveedoresView proveedoresMap={proveedoresMap} pagosMap={pagosMap} obras={obrasComputadas} costoSubobrasMap={costoSubobrasMap} subCostoProveedoresMap={subCostoProveedoresMap} subCostoPagosMap={subCostoPagosMap} onRename={renameProveedor} onImportPagos={importarPagosGeneral} onReintentarPago={reintentarPagoIndividual} canEdit={canEdit} />
      ) : tab === "cashflow" ? (
        <CashflowView
          obras={obrasComputadas} facturas={facturas} proveedoresMap={proveedoresMap} pagosMap={pagosMap}
          costoSubobrasMap={costoSubobrasMap} subCostoProveedoresMap={subCostoProveedoresMap} subCostoPagosMap={subCostoPagosMap}
          canEdit={canEdit}
          cfIngresosValores={cfIngresosValores} setCfIngresosValores={setCfIngresosValores}
          cfEgresosCategorias={cfEgresosCategorias} setCfEgresosCategorias={setCfEgresosCategorias}
          cfEgresosValores={cfEgresosValores} setCfEgresosValores={setCfEgresosValores}
          cfSalidasValores={cfSalidasValores} setCfSalidasValores={setCfSalidasValores}
          cfSaldoInicial={cfSaldoInicial} setCfSaldoInicial={setCfSaldoInicial}
          cfSemanaInicio={cfSemanaInicio} setCfSemanaInicio={setCfSemanaInicio}
          cfDiasPagoCliente={cfDiasPagoCliente} setCfDiasPagoCliente={setCfDiasPagoCliente}
        />
      ) : (
        <div style={{ padding: "22px 28px" }}>

          {selectedCliente === null ? (
            <>
              {isAdmin && (
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "14px 18px", marginBottom: 16 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, marginBottom: 6 }}>Importar obras</div>
                <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 8 }}>
                  Columnas: Cliente, Centro de Costo, Venta Total, Costo Real, Mes, Año. Sin proveedores ni facturas — el MB se calcula solo. Se omiten filas cuyo Cliente + Centro de Costo ya exista (un mismo centro de costo puede repetirse para clientes distintos, sin problema).
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                  <label style={smallBtnPrimary}>
                    <Upload size={13} style={{ verticalAlign: "-2px" }} /> Importar obras (Excel)
                    <input
                      type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }}
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          const buf = await file.arrayBuffer();
                          const wb = XLSX.read(buf, { type: "array" });
                          const sheet = wb.Sheets[wb.SheetNames[0]];
                          const filas = XLSX.utils.sheet_to_json(sheet, { defval: null });
                          const pickCol = (r, keys) => {
                            for (const key of Object.keys(r)) {
                              if (keys.includes(key.toString().trim().toLowerCase())) return r[key];
                            }
                            return null;
                          };
                          const parsed = filas.map((r) => {
                            const mesRaw = String(pickCol(r, ["mes"]) || "").toUpperCase().trim();
                            const mesNormalizado = MESES.find((m) => m === mesRaw || m.startsWith(mesRaw.slice(0, 3))) || null;
                            return {
                              cliente: String(pickCol(r, ["cliente"]) || "").toUpperCase().trim(),
                              obra: String(pickCol(r, ["centro de costo", "obra"]) || "").toUpperCase().trim(),
                              ventaTotal: Number(pickCol(r, ["venta total", "venta"])) || 0,
                              costoReal: Number(pickCol(r, ["costo real", "costo"])) || 0,
                              mes: mesNormalizado,
                              anio: Number(pickCol(r, ["año", "anio", "ano"])) || null,
                            };
                          }).filter((r) => r.cliente && r.obra);
                          const result = importarObrasMasivo(parsed, Number(importObrasAnio) || 2025, importObrasMarcarFacturado);
                          setImportObrasMsg(
                            result.agregadasCount + " obra(s) agregada(s)" +
                            (result.omitidasCount > 0 ? ", " + result.omitidasCount + " omitida(s) (ya existían)" : "") +
                            " — el mes/año se toma de la planilla; si alguna fila no lo traía, se usó Enero " + (Number(importObrasAnio) || 2025) + " por defecto." +
                            (importObrasMarcarFacturado ? " Se cargó además una factura por el total de cada obra, marcada como pagada." : "")
                          );
                        } catch (err) { setImportObrasMsg("No se pudo leer el archivo."); }
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <label style={{ fontSize: 11.5, color: MUTED }}>Año por defecto:</label>
                    <input type="number" value={importObrasAnio} onChange={(e) => setImportObrasAnio(e.target.value)} style={{ ...inputStyle, width: 80 }} />
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: MUTED, cursor: "pointer" }}>
                    <input type="checkbox" checked={importObrasMarcarFacturado} onChange={(e) => setImportObrasMarcarFacturado(e.target.checked)} />
                    Marcar 100% facturado y cobrado
                  </label>
                  <button
                    onClick={() => {
                      const ws = XLSX.utils.aoa_to_sheet([
                        ["Cliente", "Centro de Costo", "Venta Total", "Costo Real", "Mes", "Año"],
                        ["PANDORA", "UNICENTER", 100000000, 70000000, "Marzo", 2025],
                      ]);
                      const wbT = XLSX.utils.book_new();
                      XLSX.utils.book_append_sheet(wbT, ws, "Obras");
                      descargarLibroXlsx(wbT, "plantilla_obras.xlsx");
                    }}
                    style={{ ...smallBtnGhost, color: MUTED }}
                  >
                    Plantilla de ejemplo
                  </button>
                </div>
                {importObrasMsg && <div style={{ fontSize: 11.5, color: MUTED, marginTop: 8 }}>{importObrasMsg}</div>}
              </div>
              )}

              <div style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "stretch" }}>
                <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: MUTED, letterSpacing: 0.3 }}>VENTA CONSOLIDADA POR MES</div>
                      {comparacionAnioActual.anterior > 0 && (
                        <div
                          title={"Acumulado " + comparacionAnioActual.currentYear + " vs " + comparacionAnioActual.previousYear + " (Ene–" + mesLabelCorto(comparacionAnioActual.currentMonthIdx) + ")"}
                          style={{
                            display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700,
                            color: valSmart(comparacionAnioActual.delta, comparacionAnioActual.deltaUSD) >= 0 ? GREEN : RED,
                            background: valSmart(comparacionAnioActual.delta, comparacionAnioActual.deltaUSD) >= 0 ? "#E6EEE9" : "#F7E6E3",
                            border: "1px solid " + (valSmart(comparacionAnioActual.delta, comparacionAnioActual.deltaUSD) >= 0 ? "#CFE0D5" : "#EAC7BE"),
                            borderRadius: 20, padding: "3px 10px", cursor: "default",
                          }}
                        >
                          <span>{valSmart(comparacionAnioActual.delta, comparacionAnioActual.deltaUSD) >= 0 ? "▲" : "▼"}</span>
                          <span>{fmtSmart(Math.abs(comparacionAnioActual.delta), Math.abs(comparacionAnioActual.deltaUSD))}</span>
                          <span>({pctSmart(Math.abs(comparacionAnioActual.deltaPct), Math.abs(comparacionAnioActual.deltaPctUSD))})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {comparacionAnioActual.anterior > 0 && (
                    <div style={{ fontSize: 10, color: MUTED, marginBottom: 8 }}>
                      vs {comparacionAnioActual.previousYear}: {fmtSmart(comparacionAnioActual.anterior, comparacionAnioActual.anteriorUSD)} (Ene–{mesLabelCorto(comparacionAnioActual.currentMonthIdx)})
                    </div>
                  )}
                  <div style={{ width: "100%", height: 220 }}>
                    <ResponsiveContainer>
                      <BarChart data={ventaPorMesData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: MUTED }} axisLine={{ stroke: BORDER }} tickLine={false} />
                        <YAxis tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"} />
                        <Tooltip formatter={(v) => fmt(v)} />
                        {aniosActivos.map((y, i) => (
                          <Bar
                            key={y} dataKey={y} name={String(y)} fill={PIE_COLORS[aniosDisponibles.indexOf(y) % PIE_COLORS.length]}
                            radius={[4, 4, 0, 0]} cursor="pointer"
                            onClick={(data) => {
                              const row = data.payload || data;
                              setSelectedMes({ anio: y, mesIdx: row.mesIdx, label: mesLabelCorto(row.mesIdx) + " " + y });
                            }}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div style={{ flex: 1, background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px" }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: 0.3 }}>VENTA POR CLIENTE</div>
                  {aniosActivos.length > 1 ? (
                    <div style={{ width: "100%", height: Math.max(200, ventaPorClientePorAnioTop.length * 30) + 30 }}>
                      {ventaPorClientePorAnio.length > 8 && (
                        <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>Top 8 clientes por venta total; el resto agrupado en "OTROS"</div>
                      )}
                      <ResponsiveContainer>
                        <BarChart data={ventaPorClientePorAnioTop} layout="vertical" margin={{ top: 5, right: 36, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 10, fill: MUTED }} axisLine={false} tickLine={false} tickFormatter={(v) => (v / 1000000).toFixed(0) + "M"} />
                          <YAxis type="category" dataKey="cliente" tick={{ fontSize: 11, fill: TEXT }} axisLine={{ stroke: BORDER }} tickLine={false} width={110} />
                          <Tooltip formatter={(v) => fmt(v)} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          {aniosActivos.map((y) => {
                            const yearTotal = statsPorAnioActivo.find((s) => s.anio === y)?.venta || 0;
                            return (
                              <Bar
                                key={y} dataKey={y} name={String(y)} fill={PIE_COLORS[aniosDisponibles.indexOf(y) % PIE_COLORS.length]}
                                radius={[0, 4, 4, 0]} cursor="pointer"
                                onClick={(data) => { const row = data.payload || data; if (clientesFiltrados[row.cliente]) setSelectedCliente(row.cliente); }}
                              >
                                <LabelList
                                  dataKey={y} position="right"
                                  formatter={(v) => yearTotal ? ((v / yearTotal) * 100).toFixed(0) + "%" : ""}
                                  style={{ fontSize: 10, fill: MUTED }}
                                />
                              </Bar>
                            );
                          })}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                      <div style={{ width: 190, height: 190, flexShrink: 0 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={ventaPorCliente} dataKey="value" nameKey="name" cx="50%" cy="50%"
                              outerRadius={78} onClick={(d) => setSelectedCliente(d.name)}
                              style={{ cursor: "pointer" }}
                            >
                              {ventaPorCliente.map((c, i) => (
                                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                                  opacity={!activeSlice.home || activeSlice.home === c.name ? 1 : 0.3} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(v) => fmt(v)} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, maxHeight: 150, overflowY: "auto" }}>
                          {ventaPorCliente.map((c, i) => (
                            <div
                              key={c.name}
                              onClick={() => setSelectedCliente(c.name)}
                              onMouseEnter={() => setActiveSlice((prev) => ({ ...prev, home: c.name }))}
                              onMouseLeave={() => setActiveSlice((prev) => ({ ...prev, home: null }))}
                              style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                            >
                              <span style={{ width: 9, height: 9, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                              <span style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                              <span style={{ color: MUTED }}>{((c.value / totalsFiltrados.venta) * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>


              {selectedMes ? (
                (() => {
                  const obrasDelMes = obrasComputadas.filter((o) => (o.anio || new Date().getFullYear()) === selectedMes.anio && MESES.indexOf(o.mes || "ENERO") === selectedMes.mesIdx);
                  const ventaClienteMes = {};
                  obrasDelMes.forEach((o) => { ventaClienteMes[o.cliente] = (ventaClienteMes[o.cliente] || 0) + o.ventaFinal; });
                  const pieMes = Object.entries(ventaClienteMes).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
                  const totalVentaMes = pieMes.reduce((s, p) => s + p.value, 0);
                  return (
                    <>
                      <button onClick={() => setSelectedMes(null)} style={{ ...smallBtnGhost, marginBottom: 14 }}>
                        <ArrowLeft size={14} /> Volver a todos los meses
                      </button>

                      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px", marginBottom: 16, display: "flex", gap: 24, alignItems: "center" }}>
                        <div style={{ width: 200, height: 190, flexShrink: 0 }}>
                          <ResponsiveContainer>
                            <PieChart>
                              <Pie data={pieMes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={78}>
                                {pieMes.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                              </Pie>
                              <Tooltip formatter={(v) => fmt(v)} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{selectedMes.label} — {fmt(totalVentaMes)}</div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10, gap: "4px 18px", fontSize: 12.5 }}>
                            {pieMes.map((c, i) => (
                              <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                <span style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                                <span style={{ fontWeight: 600 }}>{c.name}</span>
                                <span style={{ color: MUTED }}>{((c.value / totalVentaMes) * 100).toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
                        <div style={{
                          display: "grid", gridTemplateColumns: "1.6fr 1.6fr 1fr 1.1fr 1.1fr 0.8fr 0.8fr", columnGap: 10,
                          padding: "11px 18px", fontSize: 11.5, fontWeight: 700, background: "#EFEDE7",
                          borderBottom: "1px solid " + BORDER, letterSpacing: 0.3,
                        }}>
                          <div>CLIENTE</div><div>CENTRO DE COSTO</div><div>ESTADO</div>
                          <div style={{ textAlign: "right" }}>VENTA</div><div style={{ textAlign: "right" }}>COSTO</div>
                          <div style={{ textAlign: "right" }}>MB INICIAL</div><div style={{ textAlign: "right" }}>MB FINAL</div>
                        </div>
                        {obrasDelMes.length === 0 ? (
                          <div style={{ padding: 20, fontSize: 12.5, color: MUTED }}>No hay obras cargadas para este mes.</div>
                        ) : obrasDelMes.map((o) => {
                          const k = obraKey(o.cliente, o.obra);
                          return (
                            <div
                              key={k}
                              onClick={() => { setSelectedCliente(o.cliente); setSelectedObra(k); setObraTab("facturas"); }}
                              style={{
                                display: "grid", gridTemplateColumns: "1.6fr 1.6fr 1fr 1.1fr 1.1fr 0.8fr 0.8fr", columnGap: 10,
                                padding: "10px 18px", fontSize: 13, alignItems: "center", cursor: "pointer",
                                borderBottom: "1px solid " + BORDER,
                              }}
                            >
                              <div style={{ fontWeight: 700, color: NAVY }}>{o.cliente}</div>
                              <div>{o.obra}</div>
                              <div><StatusBadge status={o.status} /></div>
                              <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtSmart(o.ventaFinal, o.ventaFinalUSD)}</div>
                              <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED }}>{fmtSmart(o.costoFinal, o.costoFinalUSD)}</div>
                              <div style={{ textAlign: "right" }}><MBValue v={valSmart(o.mbInicial, o.mbInicialUSD)} /></div>
                              <div style={{ textAlign: "right" }}><MBValue v={valSmart(o.mbFinal, o.mbFinalUSD)} /></div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()
              ) : (
                <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <input
                  placeholder="Buscar por cliente o centro de costo..."
                  value={buscarCliente}
                  onChange={(e) => setBuscarCliente(e.target.value)}
                  style={{ ...inputStyle, width: 320 }}
                />
                <button onClick={exportResumen} style={smallBtnGhost}>Descargar resumen de todas las obras</button>
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1fr 32px", columnGap: 10,
                  padding: "11px 18px", fontSize: 11.5, fontWeight: 700, background: "#EFEDE7",
                  borderBottom: "1px solid " + BORDER, letterSpacing: 0.3,
                }}>
                  <SortHeader label="CLIENTE" tableId="clientList" sortKey="cliente" sortState={sortState} onSort={toggleSort} />
                  <SortHeader label="OBRAS" tableId="clientList" sortKey="count" sortState={sortState} onSort={toggleSort} align="right" />
                  <SortHeader label="VENTA" tableId="clientList" sortKey="venta" sortState={sortState} onSort={toggleSort} align="right" />
                  <SortHeader label="COSTO FINAL" tableId="clientList" sortKey="costo" sortState={sortState} onSort={toggleSort} align="right" />
                  <SortHeader label="SALDO A PAGAR" tableId="clientList" sortKey="saldo" sortState={sortState} onSort={toggleSort} align="right" />
                  <SortHeader label="MB" tableId="clientList" sortKey="mb" sortState={sortState} onSort={toggleSort} align="right" />
                  <div />
                </div>
                {applySort("clientList", Object.entries(clientesFiltrados).filter(([cliente, list]) => {
                  const q = buscarCliente.trim().toLowerCase();
                  if (!q) return true;
                  return cliente.toLowerCase().includes(q) || list.some((o) => o.obra.toLowerCase().includes(q));
                }).map(([cliente, list]) => {
                  const venta = list.reduce((s, o) => s + o.ventaFinal, 0);
                  const costo = list.reduce((s, o) => s + o.costoFinal, 0);
                  const ventaUSD = list.reduce((s, o) => s + (o.ventaFinalUSD || 0), 0);
                  const costoUSD = list.reduce((s, o) => s + (o.costoFinalUSD || 0), 0);
                  const saldo = list.reduce((s, o) => s + (o.saldoProveedores || 0), 0);
                  const saldoUSD = list.reduce((s, o) => s + (o.saldoProveedoresUSD || 0), 0);
                  const mb = venta ? ((venta - costo) / venta) * 100 : 0;
                  const mbUSD = ventaUSD ? ((ventaUSD - costoUSD) / ventaUSD) * 100 : 0;
                  const ventaPorAnio = aniosActivos.map((y) => {
                    const obrasDelAnio = list.filter((o) => (o.anio || new Date().getFullYear()) === y);
                    return { anio: y, venta: obrasDelAnio.reduce((s, o) => s + o.ventaFinal, 0), ventaUSD: obrasDelAnio.reduce((s, o) => s + (o.ventaFinalUSD || 0), 0) };
                  }).filter((v) => v.venta > 0);
                  const costoPorAnio = aniosActivos.map((y) => {
                    const obrasDelAnio = list.filter((o) => (o.anio || new Date().getFullYear()) === y);
                    return { anio: y, costo: obrasDelAnio.reduce((s, o) => s + o.costoFinal, 0), costoUSD: obrasDelAnio.reduce((s, o) => s + (o.costoFinalUSD || 0), 0) };
                  }).filter((v) => v.costo > 0);
                  const obrasPorAnio = aniosActivos.map((y) => ({
                    anio: y, count: list.filter((o) => (o.anio || new Date().getFullYear()) === y).length,
                  })).filter((v) => v.count > 0);
                  const mbPorAnio = aniosActivos.map((y) => {
                    const obrasDelAnio = list.filter((o) => (o.anio || new Date().getFullYear()) === y);
                    const ventaY = obrasDelAnio.reduce((s, o) => s + o.ventaFinal, 0);
                    const costoY = obrasDelAnio.reduce((s, o) => s + o.costoFinal, 0);
                    const ventaYUSD = obrasDelAnio.reduce((s, o) => s + (o.ventaFinalUSD || 0), 0);
                    const costoYUSD = obrasDelAnio.reduce((s, o) => s + (o.costoFinalUSD || 0), 0);
                    return { anio: y, venta: ventaY, mb: ventaY ? ((ventaY - costoY) / ventaY) * 100 : 0, mbUSD: ventaYUSD ? ((ventaYUSD - costoYUSD) / ventaYUSD) * 100 : 0 };
                  }).filter((v) => v.venta > 0);
                  const subObrasCostosCount = list.reduce((s, o) => s + ((costoSubobrasMap[obraKey(o.cliente, o.obra)] || []).length), 0);
                  return { cliente, list, count: list.length, venta, costo, saldo, saldoUSD, mb, ventaUSD, costoUSD, mbUSD, ventaPorAnio, costoPorAnio, obrasPorAnio, mbPorAnio, subObrasCostosCount };
                })).map(({ cliente, list, count, venta, costo, saldo, saldoUSD, mb, ventaUSD, costoUSD, mbUSD, ventaPorAnio, costoPorAnio, obrasPorAnio, mbPorAnio, subObrasCostosCount }) => {
                  return (
                    <div
                      key={cliente}
                      onClick={() => setSelectedCliente(cliente)}
                      style={{
                        display: "grid", gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1fr 32px", columnGap: 10,
                        padding: "12px 18px", fontSize: 13.5, alignItems: "center", cursor: "pointer",
                        borderBottom: "1px solid " + BORDER,
                      }}
                    >
                      <div style={{ fontWeight: 700, color: NAVY }}>{cliente}</div>
                      <div style={{ textAlign: "right", color: MUTED }}>
                        {obrasPorAnio.length > 1 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {obrasPorAnio.map((v) => (
                              <div key={v.anio} style={{ fontSize: 11.5 }}>
                                <span style={{ fontWeight: 400 }}>{v.anio}: </span>{v.count}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <>{count}{cliente === "WU" && subObrasCostosCount > 0 ? " (" + subObrasCostosCount + ")" : ""}</>
                        )}
                      </div>
                      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                        {ventaPorAnio.length > 1 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {ventaPorAnio.map((v) => (
                              <div key={v.anio} style={{ fontSize: 11.5 }}>
                                <span style={{ color: MUTED, fontWeight: 400 }}>{v.anio}: </span>{fmtSmart(v.venta, v.ventaUSD)}
                              </div>
                            ))}
                          </div>
                        ) : fmtSmart(venta, ventaUSD)}
                      </div>
                      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED }}>
                        {costoPorAnio.length > 1 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {costoPorAnio.map((v) => (
                              <div key={v.anio} style={{ fontSize: 11.5 }}>
                                <span style={{ fontWeight: 400 }}>{v.anio}: </span>{fmtSmart(v.costo, v.costoUSD)}
                              </div>
                            ))}
                          </div>
                        ) : fmtSmart(costo, costoUSD)}
                      </div>
                      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: saldo > 0 ? RED : MUTED }}>
                        {fmtSmart(saldo, saldoUSD)}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        {mbPorAnio.length > 1 ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
                            {mbPorAnio.map((v) => (
                              <div key={v.anio} style={{ fontSize: 11.5, display: "flex", gap: 4, alignItems: "baseline" }}>
                                <span style={{ color: MUTED, fontWeight: 400 }}>{v.anio}:</span><MBValue v={valSmart(v.mb, v.mbUSD)} />
                              </div>
                            ))}
                          </div>
                        ) : <MBValue v={valSmart(mb, mbUSD)} />}
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", color: MUTED }}><ChevronRight size={16} /></div>
                    </div>
                  );
                })}
                <div style={{
                  display: "grid", gridTemplateColumns: "2fr 0.8fr 1.2fr 1.2fr 1.2fr 1fr 32px", columnGap: 10,
                  padding: "12px 18px", fontSize: 13.5, fontWeight: 700, background: "#F1E9D2",
                }}>
                  <div style={{ color: NAVY }}>TOTAL</div>
                  <div style={{ textAlign: "right" }}>{totalsFiltrados.count}</div>
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {statsPorAnioActivo.length > 1 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {statsPorAnioActivo.map((v) => (
                          <div key={v.anio} style={{ fontSize: 12 }}>
                            <span style={{ color: MUTED, fontWeight: 400 }}>{v.anio}: </span>{fmtSmart(v.venta, v.ventaUSD)}
                          </div>
                        ))}
                      </div>
                    ) : fmtSmart(totalsFiltrados.venta, totalsFiltrados.ventaUSD)}
                  </div>
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {statsPorAnioActivo.length > 1 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {statsPorAnioActivo.map((v) => (
                          <div key={v.anio} style={{ fontSize: 12 }}>
                            <span style={{ color: MUTED, fontWeight: 400 }}>{v.anio}: </span>{fmtSmart(v.costo, v.costoUSD)}
                          </div>
                        ))}
                      </div>
                    ) : fmtSmart(totalsFiltrados.costo, totalsFiltrados.costoUSD)}
                  </div>
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: totalsFiltrados.saldo > 0 ? RED : NAVY }}>
                    {fmtSmart(totalsFiltrados.saldo, totalsFiltrados.saldoUSD)}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {statsPorAnioActivo.length > 1 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
                        {statsPorAnioActivo.map((v) => (
                          <div key={v.anio} style={{ fontSize: 12, display: "flex", gap: 4, alignItems: "baseline" }}>
                            <span style={{ color: MUTED, fontWeight: 400 }}>{v.anio}:</span><MBValue v={valSmart(v.mb, v.mbUSD)} />
                          </div>
                        ))}
                      </div>
                    ) : <MBValue v={valSmart(totalsFiltrados.mb, totalsFiltrados.mbUSD)} />}
                  </div>
                  <div />
                </div>
              </div>

              <div style={{ marginTop: 24, marginBottom: 10, fontSize: 13, fontWeight: 700, color: NAVY }}>
                Todos los centros de costo
              </div>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1.6fr 1.6fr 1fr", columnGap: 10,
                  padding: "11px 18px", fontSize: 11.5, fontWeight: 700, background: "#EFEDE7",
                  borderBottom: "1px solid " + BORDER, letterSpacing: 0.3,
                }}>
                  <SortHeader label="CLIENTE" tableId="allObrasList" sortKey="cliente" sortState={sortState} onSort={toggleSort} />
                  <SortHeader label="CENTRO DE COSTO" tableId="allObrasList" sortKey="obra" sortState={sortState} onSort={toggleSort} />
                  <SortHeader label="ESTADO" tableId="allObrasList" sortKey="status" sortState={sortState} onSort={toggleSort} />
                </div>
                {(() => {
                  const q = buscarCliente.trim().toLowerCase();
                  const filtradas = obrasComputadas.filter((o) => !q || o.cliente.toLowerCase().includes(q) || o.obra.toLowerCase().includes(q));
                  if (filtradas.length === 0) {
                    return <div style={{ padding: 20, fontSize: 12.5, color: MUTED }}>No hay centros de costo cargados.</div>;
                  }
                  return applySort("allObrasList", filtradas).map((o) => {
                    const k = obraKey(o.cliente, o.obra);
                    return (
                      <div
                        key={k}
                        onClick={() => { setSelectedCliente(o.cliente); setSelectedObra(k); setObraTab("facturas"); }}
                        style={{
                          display: "grid", gridTemplateColumns: "1.6fr 1.6fr 1fr", columnGap: 10,
                          padding: "10px 18px", fontSize: 13, alignItems: "center", cursor: "pointer",
                          borderBottom: "1px solid " + BORDER,
                        }}
                      >
                        <div style={{ fontWeight: 700, color: NAVY }}>{o.cliente}</div>
                        <div>{o.obra}</div>
                        <div><StatusBadge status={o.status} /></div>
                      </div>
                    );
                  });
                })()}
              </div>
                </>
              )}
            </>
          ) : selectedObra ? (
            (() => {
              const o = clientes[selectedCliente].find((x) => obraKey(x.cliente, x.obra) === selectedObra);
              const k = selectedObra;
              const provs = proveedoresMap[k] || [];
              const pagos = pagosMap[k] || [];
              const pagosBusquedaTexto = (pagoBusqueda[k] || "").trim().toLowerCase();
              const pagosFiltrados = pagos
                .map((p, idx) => ({ ...p, _idx: idx }))
                .filter((p) => !pagosBusquedaTexto || p.proveedor.toLowerCase().includes(pagosBusquedaTexto));
              const provDraft = newProveedorDraft[k];
              const pagoDraft = newPagoDraft[k];
              const provsConDatos = provs.map((p, idx) => {
                const pagado = pagos.filter((pg) => pg.proveedor === p.proveedor).reduce((s, pg) => s + pg.monto, 0);
                const presupuesto = presupuestoEfectivo(p.presupuesto, pagado);
                const desvio = (presupuesto || 0) - (p.presupuestoOriginal || 0);
                const desvioPct = p.presupuestoOriginal ? (desvio / p.presupuestoOriginal) * 100 : 0;
                return { ...p, presupuesto, pagado, resta: presupuesto - pagado, desvio, desvioPct, _idx: idx };
              });
              const desvioTotalObra = provsConDatos.reduce((s, p) => s + p.desvio, 0);
              const presupOriginalTotalObra = provsConDatos.reduce((s, p) => s + (p.presupuestoOriginal || 0), 0);
              const desvioTotalPctObra = presupOriginalTotalObra ? (desvioTotalObra / presupOriginalTotalObra) * 100 : 0;
              const facturasObra = facturas.filter((f) => f.cliente === o.cliente && f.obra === o.obra);
              const facTotal = facturasObra.reduce((s, f) => s + (f.importe || 0), 0);
              const facPagado = facturasObra.filter((f) => f.status === "PAGADA").reduce((s, f) => s + (f.importe || 0), 0);
              const facAdeuda = o.ventaFinal - facTotal;

              return (
                <>
                  <button onClick={() => { setSelectedObra(null); setShowAdicionales(false); setNewAdicionalDraft(null); setShowSubobras(false); setNewSubobraDraft(null); }} style={{ ...smallBtnGhost, marginBottom: 14 }}>
                    <ArrowLeft size={14} /> Volver a {selectedCliente}
                  </button>

                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <div>
                        <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: NAVY }}>{o.obra}</div>
                        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>{o.cliente} · {o.mes ? o.mes.charAt(0) + o.mes.slice(1).toLowerCase() : "—"} {o.anio || ""}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <StatusBadge status={o.status} onClick={canEdit ? () => toggleStatus(o) : undefined} />
                        {canEdit && <button onClick={() => setEditingObra(true)} style={smallBtnGhost}><Pencil size={13} /> Editar</button>}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: o.cliente === "WU" ? "repeat(5, 1fr)" : "repeat(4, 1fr)", columnGap: 10, gap: 12, marginTop: 14 }}>
                      <MiniStat label={o.totalSubobras > 0 ? "VENTA ORIGINAL (AUTO)" : "VENTA ORIGINAL"} value={fmt(o.ventaOriginal, o.tc)} />
                      <div onClick={() => setShowAdicionales((v) => !v)} style={{ cursor: "pointer" }}>
                        <MiniStat label={"ADICIONALES " + (showAdicionales ? "▲" : "▼")} value={fmt(o.totalAdicionales)} color={o.totalAdicionales > 0 ? GOLD : MUTED} />
                      </div>
                      {o.cliente === "WU" && (
                        <div onClick={() => setShowSubobras((v) => !v)} style={{ cursor: "pointer" }}>
                          <MiniStat label={"ÓRDENES DE COMPRA " + (showSubobras ? "▲" : "▼")} value={fmt(o.totalSubobras)} color={o.totalSubobras > 0 ? GOLD : MUTED} />
                        </div>
                      )}
                      <MiniStat label="VENTA TOTAL" value={fmtSmart(o.ventaFinal, o.ventaFinalUSD)} color={NAVY} />
                      <MiniStat label="COSTO INICIAL" value={fmt(o.costoInicial, o.tc)} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", columnGap: 10, gap: 12, marginTop: 12 }}>
                      <MiniStat label="COSTO REAL" value={fmtSmart(o.costoFinal, o.costoFinalUSD)} />
                      <MiniStat label="MB INICIAL" value={pctSmart(o.mbInicial, o.mbInicialUSD)} color={valSmart(o.mbInicial, o.mbInicialUSD) < 15 ? RED : valSmart(o.mbInicial, o.mbInicialUSD) >= 30 ? GREEN : NAVY} />
                      <MiniStat label="MB FINAL" value={pctSmart(o.mbFinal, o.mbFinalUSD)} color={valSmart(o.mbFinal, o.mbFinalUSD) < 15 ? RED : valSmart(o.mbFinal, o.mbFinalUSD) >= 30 ? GREEN : NAVY} />
                      <MiniStat label="DESVÍO TOTAL vs. PRESUPUESTO" value={fmt(desvioTotalObra) + " (" + (desvioTotalPctObra >= 0 ? "+" : "") + desvioTotalPctObra.toFixed(1) + "%)"} color={desvioTotalObra > 0 ? RED : desvioTotalObra < 0 ? GREEN : MUTED} />
                    </div>

                    {o.cliente === "WU" && showSubobras && (() => {
                      const subobras = subobrasMap[k] || [];
                      const draft = newSubobraDraft;
                      return (
                        <div style={{ marginTop: 14, borderTop: "1px solid " + BORDER, paddingTop: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 }}>ÓRDENES DE COMPRA</div>
                          <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 8 }}>
                            Cada orden de compra suma a la Venta Total y, según su fecha, se refleja en ese mes puntual en el gráfico de "Venta Consolidada por Mes" (no en el mes de la obra).
                          </div>
                          {subobras.length === 0 ? (
                            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 8 }}>Todavía no cargaste órdenes de compra para esta obra.</div>
                          ) : (
                            <>
                              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 50px", columnGap: 10, fontSize: 11, fontWeight: 700, color: MUTED, padding: "4px 8px" }}>
                                <div>ORDEN DE COMPRA</div><div style={{ textAlign: "right" }}>VENTA</div><div>FECHA</div><div>OBSERVACIONES</div><div />
                              </div>
                              {subobras.map((s, i) => (
                                <SubobraRow key={i} s={s} onSave={(ch) => updateSubobra(k, i, ch)} onDelete={() => deleteSubobra(k, i)} readOnly={!canEdit} />
                              ))}
                            </>
                          )}
                          {canEdit && (draft ? (
                            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                              <input placeholder="Orden de compra" style={inputStyle} onChange={(e) => setNewSubobraDraft((d) => ({ ...d, ordenCompra: e.target.value }))} />
                              <input placeholder="Venta" type="number" style={{ ...inputStyle, width: 130 }} onChange={(e) => setNewSubobraDraft((d) => ({ ...d, venta: e.target.value }))} />
                              <input placeholder="Fecha (cualquier formato)" style={{ ...inputStyle, width: 150 }} onChange={(e) => setNewSubobraDraft((d) => ({ ...d, fecha: e.target.value }))} />
                              <input placeholder="Observaciones" style={{ ...inputStyle, width: 200 }} onChange={(e) => setNewSubobraDraft((d) => ({ ...d, observaciones: e.target.value }))} />
                              <button onClick={() => addSubobra(k, draft)} style={smallBtnPrimary}>Guardar</button>
                              <button onClick={() => setNewSubobraDraft(null)} style={smallBtnGhost}><X size={13} /></button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                              <button onClick={() => setNewSubobraDraft({ ordenCompra: "" })} style={smallBtnGhost}>
                                <Plus size={13} /> Agregar orden de compra
                              </button>
                              <label style={smallBtnGhost}>
                                <Upload size={13} /> Importar órdenes de compra (Excel)
                                <input
                                  type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }}
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    try {
                                      const buf = await file.arrayBuffer();
                                      const wb = XLSX.read(buf, { type: "array" });
                                      const sheet = wb.Sheets[wb.SheetNames[0]];
                                      const filas = XLSX.utils.sheet_to_json(sheet, { defval: null });
                                      const pickCol = (r, keys) => {
                                        for (const key of Object.keys(r)) {
                                          if (keys.includes(key.toString().trim().toLowerCase())) return r[key];
                                        }
                                        return null;
                                      };
                                      const parsed = filas.map((r) => {
                                        let fecha = pickCol(r, ["fecha"]);
                                        if (typeof fecha === "number" && XLSX.SSF) {
                                          const d = XLSX.SSF.parse_date_code(fecha);
                                          fecha = d ? String(d.d).padStart(2, "0") + "/" + String(d.m).padStart(2, "0") + "/" + d.y : String(fecha);
                                        }
                                        return {
                                          ordenCompra: String(pickCol(r, ["orden de compra", "orden compra", "oc"]) || "").trim(),
                                          venta: Number(pickCol(r, ["venta", "importe"])) || 0,
                                          fecha: fecha ? String(fecha) : null,
                                          observaciones: String(pickCol(r, ["observaciones"]) || "").trim(),
                                        };
                                      });
                                      const n = importarSubobrasMasivo(k, parsed);
                                      setImportSubobrasMsg(n + " orden(es) de compra cargada(s).");
                                    } catch (err) { setImportSubobrasMsg("No se pudo leer el archivo."); }
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                              <button
                                onClick={() => {
                                  const ws = XLSX.utils.aoa_to_sheet([
                                    ["Orden de Compra", "Venta", "Fecha"],
                                    ["OC-1234", 5000000, "15/03/2026"],
                                  ]);
                                  const wbT = XLSX.utils.book_new();
                                  XLSX.utils.book_append_sheet(wbT, ws, "Ordenes de compra");
                                  descargarLibroXlsx(wbT, "plantilla_ordenes_compra.xlsx");
                                }}
                                style={{ ...smallBtnGhost, color: MUTED }}
                              >
                                Plantilla de ejemplo
                              </button>
                            </div>
                          ))}
                          {importSubobrasMsg && <div style={{ fontSize: 11.5, color: MUTED, marginTop: 6 }}>{importSubobrasMsg}</div>}
                        </div>
                      );
                    })()}

                    {showAdicionales && (() => {
                      const adicionales = adicionalesMap[k] || [];
                      const draft = newAdicionalDraft;
                      return (
                        <div style={{ marginTop: 14, borderTop: "1px solid " + BORDER, paddingTop: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 }}>ADICIONALES</div>
                          {adicionales.length === 0 ? (
                            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 8 }}>Todavía no cargaste adicionales para esta obra.</div>
                          ) : (
                            <>
                              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 50px", columnGap: 10, fontSize: 11, fontWeight: 700, color: MUTED, padding: "4px 8px" }}>
                                <div>CONCEPTO</div><div style={{ textAlign: "right" }}>MONTO</div><div />
                              </div>
                              {adicionales.map((a, i) => (
                                <AdicionalRow key={i} a={a} onSave={(ch) => updateAdicional(k, i, ch)} onDelete={() => deleteAdicional(k, i)} readOnly={!canEdit} />
                              ))}
                            </>
                          )}
                          {canEdit && (draft ? (
                            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                              <input placeholder="Concepto" style={inputStyle} onChange={(e) => setNewAdicionalDraft((d) => ({ ...d, concepto: e.target.value }))} />
                              <input placeholder="Monto" type="number" style={{ ...inputStyle, width: 130 }} onChange={(e) => setNewAdicionalDraft((d) => ({ ...d, monto: e.target.value }))} />
                              <button onClick={() => addAdicional(k, draft)} style={smallBtnPrimary}>Guardar</button>
                              <button onClick={() => setNewAdicionalDraft(null)} style={smallBtnGhost}><X size={13} /></button>
                            </div>
                          ) : (
                            <button onClick={() => setNewAdicionalDraft({ concepto: "" })} style={{ ...smallBtnGhost, marginTop: 8 }}>
                              <Plus size={13} /> Agregar adicional
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {editingObra && (
                    <EditObraForm obra={o} onCancel={() => setEditingObra(false)} onSave={(changes) => updateObra(k, changes)} />
                  )}

                  <div style={{ display: "flex", background: "#EDEAE1", borderRadius: 8, padding: 3, marginBottom: 16, width: "fit-content" }}>
                    {["facturas", "costos"].map((t) => (
                      <button key={t} onClick={() => setObraTab(t)} style={{
                        border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer",
                        background: obraTab === t ? "#fff" : "transparent", color: obraTab === t ? NAVY : MUTED,
                        boxShadow: obraTab === t ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                      }}>
                        {t === "facturas" ? "Facturación" : "Costos"}
                      </button>
                    ))}
                  </div>

                  {obraTab === "facturas" ? (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", columnGap: 10, gap: 14, marginBottom: 16 }}>
                        <SummaryCard label="FACTURADO" value={fmt(facTotal)} color={NAVY} />
                        <SummaryCard label="PAGADO" value={fmt(facPagado)} color={GREEN} />
                        <SummaryCard label="ADEUDADO (VENTA - FACTURADO)" value={fmt(facAdeuda)} color={RED} />
                      </div>

                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        {canEdit && (
                          <button onClick={() => setNewFacturaDraft({ status: "ADEUDA" })} style={smallBtnPrimary}>
                            <Plus size={13} style={{ verticalAlign: "-2px" }} /> Cargar factura
                          </button>
                        )}
                        {isAdmin && facAdeuda > 1 && (
                          <button onClick={() => marcarObraFacturada(o)} style={smallBtnGhost}>
                            Marcar 100% facturado y cobrado
                          </button>
                        )}
                        <button onClick={() => exportObra(o)} style={smallBtnGhost}>Descargar información de la obra</button>
                      </div>

                      {newFacturaDraft && (
                        <div style={{ background: "#fff", border: "1px solid " + BORDER, borderRadius: 12, boxShadow: CARD_SHADOW, padding: 16, marginBottom: 14, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                          <input placeholder="Concepto" style={inputStyle} onChange={(e) => setNewFacturaDraft((d) => ({ ...d, concepto: e.target.value }))} />
                          <input placeholder="Tipo (FC, S/F...)" style={{ ...inputStyle, width: 100 }} onChange={(e) => setNewFacturaDraft((d) => ({ ...d, tipo: e.target.value }))} />
                          <input placeholder="N°" style={{ ...inputStyle, width: 80 }} onChange={(e) => setNewFacturaDraft((d) => ({ ...d, nro: e.target.value }))} />
                          <input placeholder="Fecha emisión (dd/mm/aaaa)" style={{ ...inputStyle, width: 150 }} onChange={(e) => setNewFacturaDraft((d) => ({ ...d, fecha: e.target.value }))} />
                          <select style={{ ...selectStyle, width: 120 }} value={newFacturaDraft.status} onChange={(e) => setNewFacturaDraft((d) => ({ ...d, status: e.target.value }))}>
                            <option value="ADEUDA">Adeuda</option>
                            <option value="PAGADA">Pagada</option>
                          </select>
                          <input placeholder="Importe" type="number" style={{ ...inputStyle, width: 110 }} onChange={(e) => setNewFacturaDraft((d) => ({ ...d, importe: e.target.value }))} />
                          <input placeholder="Fecha de pago" style={{ ...inputStyle, width: 130 }} onChange={(e) => setNewFacturaDraft((d) => ({ ...d, fechaPago: e.target.value }))} />
                          <input placeholder="Forma de pago" style={{ ...inputStyle, width: 130 }} onChange={(e) => setNewFacturaDraft((d) => ({ ...d, forma: e.target.value }))} />
                          <label style={smallBtnGhost}>
                            <Paperclip size={13} /> {newFacturaDraft.pdfName || "Adjuntar PDF"}
                            <input
                              type="file" accept="application/pdf" style={{ display: "none" }}
                              onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                if (file.size > PDF_MAX_BYTES) { alert("El PDF pesa demasiado (máx. 180 KB). Comprimilo o subilo a Drive y pegá el link en el concepto."); return; }
                                const data = await readPdfAsDataUrl(file);
                                setNewFacturaDraft((d) => ({ ...d, pdfData: data, pdfName: file.name }));
                              }}
                            />
                          </label>
                          {newFacturaDraft.pdfName && (
                            <button
                              onClick={() => setNewFacturaDraft((d) => ({ ...d, pdfData: null, pdfName: null }))}
                              title="Quitar PDF adjunto"
                              style={{ border: "none", background: "none", cursor: "pointer", color: RED, display: "flex" }}
                            ><Trash2 size={13} /></button>
                          )}
                          <button onClick={() => { addFactura(o.cliente, o.obra, newFacturaDraft); setNewFacturaDraft(null); }} style={smallBtnPrimary}>Guardar factura</button>
                          <button onClick={() => setNewFacturaDraft(null)} style={smallBtnGhost}><X size={13} /></button>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "center" }}>
                        <select style={selectStyle} value={facturaFilter[k] || "TODAS"} onChange={(e) => setFacturaFilter((prev) => ({ ...prev, [k]: e.target.value }))}>
                          <option value="TODAS">Todos los estados</option>
                          <option value="PAGADA">Pagada</option>
                          <option value="ADEUDA">Adeuda</option>
                        </select>
                      </div>

                      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
                        <div style={{
                          display: "grid", gridTemplateColumns: "1.8fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.7fr 50px", columnGap: 10,
                          padding: "10px 16px", fontSize: 11, fontWeight: 700, background: "#EFEDE7", borderBottom: "1px solid " + BORDER,
                        }}>
                          <SortHeader label="CONCEPTO" tableId={"obraFacturas:" + k} sortKey="concepto" sortState={sortState} onSort={toggleSort} />
                          <SortHeader label="TIPO" tableId={"obraFacturas:" + k} sortKey="tipo" sortState={sortState} onSort={toggleSort} />
                          <SortHeader label="N°" tableId={"obraFacturas:" + k} sortKey="nro" sortState={sortState} onSort={toggleSort} />
                          <SortHeader label="EMISION" tableId={"obraFacturas:" + k} sortKey="fecha" sortState={sortState} onSort={toggleSort} />
                          <SortHeader label="ESTADO" tableId={"obraFacturas:" + k} sortKey="status" sortState={sortState} onSort={toggleSort} />
                          <SortHeader label="IMPORTE" tableId={"obraFacturas:" + k} sortKey="importe" sortState={sortState} onSort={toggleSort} align="right" />
                          <SortHeader label="PAGO" tableId={"obraFacturas:" + k} sortKey="fechaPago" sortState={sortState} onSort={toggleSort} />
                          <div style={{ textAlign: "center" }}>PDF</div>
                          <div />
                        </div>
                        {(() => {
                          const filtro = facturaFilter[k] || "TODAS";
                          const filtradas = facturasObra.filter((f) => filtro === "TODAS" || f.status === filtro);
                          return filtradas.length === 0 ? (
                            <div style={{ padding: 18, fontSize: 12.5, color: MUTED }}>Todavia no se cargaron facturas para esta obra.</div>
                          ) : applySort("obraFacturas:" + k, filtradas).map((f) => (
                            <FacturaRow key={f.id} f={f} onSave={(ch) => updateFactura(f.id, ch)} onDelete={() => deleteFactura(f.id)} onView={() => setViewingPdf({ name: f.pdfName, data: dataUrlToBlobUrl(f.pdfData), rawData: f.pdfData })} readOnly={!canEdit} />
                          ));
                        })()}
                      </div>
                    </>
                  ) : (
                    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px" }}>
                      {provsConDatos.length === 0 ? (
                        <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 10 }}>
                          Todavia no cargaste el detalle de costos de esta obra.
                        </div>
                      ) : (
                        <>
                          {(() => {
                            const totalPresupuestoObra = provsConDatos.reduce((s, p) => s + p.presupuesto, 0);
                            return (
                          <div style={{ display: "flex", gap: 24, alignItems: "center", marginBottom: 18 }}>
                            <div style={{ width: 260, height: 230, flexShrink: 0 }}>
                              <ResponsiveContainer>
                                <PieChart>
                                  <Pie
                                    data={provsConDatos.map((p) => ({ name: p.proveedor, value: p.presupuesto, pct: totalPresupuestoObra ? (p.presupuesto / totalPresupuestoObra) * 100 : 0 }))}
                                    dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={78}
                                  >
                                    {provsConDatos.map((p, i) => (
                                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                                        opacity={!activeSlice["proveedores:" + k] || activeSlice["proveedores:" + k] === p.proveedor ? 1 : 0.3} />
                                    ))}
                                  </Pie>
                                  <Tooltip formatter={(v, name, props) => [fmt(v) + " (" + props.payload.pct.toFixed(1) + "%)", name]} />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 }}>PARTICIPACIÓN POR PROVEEDOR (PRESUPUESTO REAL)</div>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10, gap: "3px 16px", fontSize: 12, maxHeight: 130, overflowY: "auto" }}>
                                {provsConDatos.map((p, i) => {
                                  const active = activeSlice["proveedores:" + k] === p.proveedor;
                                  const pct = totalPresupuestoObra ? (p.presupuesto / totalPresupuestoObra) * 100 : 0;
                                  return (
                                    <div
                                      key={i}
                                      onMouseEnter={() => setActiveSlice((prev) => ({ ...prev, ["proveedores:" + k]: p.proveedor }))}
                                      onMouseLeave={() => setActiveSlice((prev) => ({ ...prev, ["proveedores:" + k]: null }))}
                                      style={{
                                        display: "flex", alignItems: "center", gap: 6, cursor: "default",
                                        padding: "2px 5px", borderRadius: 5, background: active ? "#F1E9D2" : "transparent",
                                      }}
                                    >
                                      <span style={{ width: 9, height: 9, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                                      <span style={{ fontWeight: active ? 700 : 600, color: active ? NAVY : TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.proveedor}</span>
                                      <span style={{ color: MUTED, marginLeft: "auto", flexShrink: 0 }}>{pct.toFixed(0)}%</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                            );
                          })()}

                          <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px", columnGap: 10, fontSize: 11, fontWeight: 700, padding: "4px 8px" }}>
                            <SortHeader label="PROVEEDOR" tableId={"proveedores:" + k} sortKey="proveedor" sortState={sortState} onSort={toggleSort} />
                            <SortHeader label="PRESUPUESTO ORIGINAL" tableId={"proveedores:" + k} sortKey="presupuestoOriginal" sortState={sortState} onSort={toggleSort} align="right" />
                            <SortHeader label="PRESUPUESTO REAL" tableId={"proveedores:" + k} sortKey="presupuesto" sortState={sortState} onSort={toggleSort} align="right" />
                            <SortHeader label="PAGADO" tableId={"proveedores:" + k} sortKey="pagado" sortState={sortState} onSort={toggleSort} align="right" />
                            <SortHeader label="SALDO A PAGAR" tableId={"proveedores:" + k} sortKey="resta" sortState={sortState} onSort={toggleSort} align="right" />
                            <SortHeader label="DESVÍO" tableId={"proveedores:" + k} sortKey="desvioPct" sortState={sortState} onSort={toggleSort} align="right" />
                            <div />
                          </div>
                          {applySort("proveedores:" + k, provsConDatos).map((p, i) => (
                            <ProveedorRow key={p._idx} p={p} index={i} onSave={(ch) => updateProveedor(k, p._idx, ch)} onDelete={() => deleteProveedor(k, p._idx)} readOnly={!canEdit} />
                          ))}
                          <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr 1fr 1.2fr 28px", columnGap: 10, fontSize: 12.5, fontWeight: 700, padding: "8px 8px", background: "#F1E9D2", borderRadius: 4, marginTop: 4 }}>
                            <div style={{ color: NAVY }}>TOTAL</div>
                            <div style={{ textAlign: "right", color: MUTED }}>{fmt(provsConDatos.reduce((s, p) => s + p.presupuestoOriginal, 0))}</div>
                            <div style={{ textAlign: "right" }}>{fmt(provsConDatos.reduce((s, p) => s + p.presupuesto, 0))}</div>
                            <div style={{ textAlign: "right", color: GREEN }}>{fmt(provsConDatos.reduce((s, p) => s + p.pagado, 0))}</div>
                            <div style={{ textAlign: "right", color: RED }}>{fmt(provsConDatos.reduce((s, p) => s + p.resta, 0))}</div>
                            <div style={{ textAlign: "right", color: desvioTotalObra > 0 ? RED : desvioTotalObra < 0 ? GREEN : MUTED }}>{fmt(desvioTotalObra)} ({desvioTotalPctObra >= 0 ? "+" : ""}{desvioTotalPctObra.toFixed(1)}%)</div>
                            <div />
                          </div>
                        </>
                      )}

                      {canEdit && o.cliente !== "WU" && (
                      <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
                        {provDraft ? (
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            <input placeholder="Proveedor" list="proveedores-sugeridos" style={inputStyle} onChange={(e) => setNewProveedorDraft((p) => ({ ...p, [k]: { ...p[k], proveedor: e.target.value } }))} />
                            <datalist id="proveedores-sugeridos">
                              {proveedoresCatalogo.map((n) => <option key={n} value={n} />)}
                            </datalist>
                            <input placeholder="Presupuesto original" type="number" style={{ ...inputStyle, width: 130 }} onChange={(e) => setNewProveedorDraft((p) => ({ ...p, [k]: { ...p[k], presupuestoOriginal: e.target.value } }))} />
                            <input placeholder="Presupuesto real" type="number" style={{ ...inputStyle, width: 120 }} onChange={(e) => setNewProveedorDraft((p) => ({ ...p, [k]: { ...p[k], presupuesto: e.target.value } }))} />
                            <button onClick={() => addProveedor(k, provDraft)} style={smallBtnPrimary}>Guardar</button>
                            <button onClick={() => setNewProveedorDraft((p) => ({ ...p, [k]: null }))} style={smallBtnGhost}><X size={13} /></button>
                          </div>
                        ) : (
                          <button onClick={() => setNewProveedorDraft((p) => ({ ...p, [k]: { proveedor: "" } }))} style={smallBtnGhost}>
                            <Plus size={13} /> Nuevo proveedor
                          </button>
                        )}

                        {provsConDatos.length > 0 && (
                          pagoDraft ? (
                            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                              <select style={{ ...inputStyle, width: 160 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [k]: { ...p[k], proveedor: e.target.value } }))}>
                                <option value="">Proveedor...</option>
                                {provsConDatos.map((p, i) => <option key={i} value={p.proveedor}>{p.proveedor}</option>)}
                              </select>
                              <input placeholder="Monto" type="number" style={{ ...inputStyle, width: 100 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [k]: { ...p[k], monto: e.target.value } }))} />
                              <input placeholder="Fecha (dd/mm/aaaa)" style={{ ...inputStyle, width: 130 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [k]: { ...p[k], fecha: e.target.value } }))} />
                              <input placeholder="N° FC" style={{ ...inputStyle, width: 90 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [k]: { ...p[k], fc: e.target.value } }))} />
                              <input placeholder="Observaciones" style={{ ...inputStyle, width: 160 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [k]: { ...p[k], observaciones: e.target.value } }))} />
                              <button onClick={() => pagoDraft.proveedor && addPago(k, pagoDraft)} style={smallBtnPrimary}>Registrar pago</button>
                              <button onClick={() => setNewPagoDraft((p) => ({ ...p, [k]: null }))} style={smallBtnGhost}><X size={13} /></button>
                            </div>
                          ) : (
                            <button onClick={() => setNewPagoDraft((p) => ({ ...p, [k]: { proveedor: "" } }))} style={smallBtnGhost}>
                              <Plus size={13} /> Registrar pago semanal
                            </button>
                          )
                        )}

                        <label style={{ ...smallBtnGhost, marginLeft: "auto" }}>
                          <Upload size={13} /> Importar planilla de costos
                          <input type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => handleImportCostos(k, e.target.files[0])} />
                        </label>
                        <button onClick={() => downloadTemplate("costos", k)} style={{ ...smallBtnGhost, color: MUTED }}>Plantilla de ejemplo</button>
                        <label style={smallBtnGhost}>
                          <Upload size={13} /> Importar planilla de pagos
                          <input type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => handleImportPagos(k, e.target.files[0])} />
                        </label>
                        <button onClick={() => downloadTemplate("pagos", k)} style={{ ...smallBtnGhost, color: MUTED }}>Plantilla de ejemplo</button>
                      </div>
                      )}

                      {pagos.length > 0 && (
                        <>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, margin: "16px 0 6px" }}>
                            <div style={{ fontSize: 11.5, fontWeight: 700, color: MUTED }}>HISTORIAL DE PAGOS</div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <input placeholder="Buscar proveedor..." value={pagoBusqueda[k] || ""} onChange={(e) => setPagoBusqueda((prev) => ({ ...prev, [k]: e.target.value }))} style={{ ...inputStyle, width: 160 }} />
                              <button onClick={() => exportPagosObra(pagosFiltrados, "pagos_" + k.replace(/[^a-z0-9]+/gi, "_") + ".xlsx")} style={{ ...smallBtnGhost, color: MUTED }}>
                                <Download size={13} /> Descargar
                              </button>
                            </div>
                          </div>
                          <div style={{ maxHeight: 200, overflowY: "auto" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px", columnGap: 10, fontSize: 11, fontWeight: 700, padding: "4px 8px" }}>
                              <SortHeader label="PROVEEDOR" tableId={"pagos:" + k} sortKey="proveedor" sortState={sortState} onSort={toggleSort} />
                              <SortHeader label="PAGO" tableId={"pagos:" + k} sortKey="monto" sortState={sortState} onSort={toggleSort} align="right" />
                              <SortHeader label="FECHA" tableId={"pagos:" + k} sortKey="fecha" sortState={sortState} onSort={toggleSort} align="right" />
                              <SortHeader label="N° FC" tableId={"pagos:" + k} sortKey="fc" sortState={sortState} onSort={toggleSort} align="right" />
                              <SortHeader label="OBSERVACIONES" tableId={"pagos:" + k} sortKey="observaciones" sortState={sortState} onSort={toggleSort} />
                              <div />
                            </div>
                            {pagosFiltrados.length === 0 ? (
                              <div style={{ padding: "10px 8px", fontSize: 12, color: MUTED }}>Ningún pago coincide con la búsqueda.</div>
                            ) : applySort("pagos:" + k, pagosFiltrados).map((p) => (
                              <PagoRow key={p._idx} p={p} onSave={(ch) => updatePago(k, p._idx, ch)} onDelete={() => deletePago(k, p._idx)} readOnly={!canEdit} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {o.cliente === "WU" && obraTab === "costos" && (() => {
                    const subCostos = costoSubobrasMap[k] || [];
                    const datosPorSubCosto = subCostos.map((sub, idx) => {
                      const subK = subCostoKey(k, idx);
                      const subProvs = subCostoProveedoresMap[subK] || [];
                      const subPagos = subCostoPagosMap[subK] || [];
                      const subProvsConDatos = subProvs.map((p, i2) => {
                        const pagado = subPagos.filter((pg) => pg.proveedor === p.proveedor).reduce((s2, pg) => s2 + pg.monto, 0);
                        const presupuesto = presupuestoEfectivo(p.presupuesto, pagado);
                        const desvio = (presupuesto || 0) - (p.presupuestoOriginal || 0);
                        const desvioPct = p.presupuestoOriginal ? (desvio / p.presupuestoOriginal) * 100 : 0;
                        return { ...p, presupuesto, pagado, resta: presupuesto - pagado, desvio, desvioPct, _idx: i2 };
                      });
                      return { sub, idx, subK, subPagos, subProvsConDatos };
                    });
                    const totalesTodas = datosPorSubCosto.reduce((acc, d) => {
                      d.subProvsConDatos.forEach((p) => {
                        acc.presupuestoOriginal += p.presupuestoOriginal || 0;
                        acc.presupuesto += p.presupuesto || 0;
                        acc.pagado += p.pagado;
                      });
                      return acc;
                    }, { presupuestoOriginal: 0, presupuesto: 0, pagado: 0 });
                    totalesTodas.resta = totalesTodas.presupuesto - totalesTodas.pagado;

                    return (
                      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px", marginTop: 16 }}>
                        <datalist id="proveedores-sugeridos-subcosto">
                          {proveedoresCatalogo.map((n) => <option key={n} value={n} />)}
                        </datalist>
                        <div style={{ fontSize: 11, fontWeight: 700, color: MUTED, marginBottom: 6 }}>SUB OBRAS (COSTOS)</div>
                        <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 14 }}>
                          Agrupá proveedores en sub obras dentro de esta obra, independiente de las Órdenes de Compra. El Costo Real de la obra suma esto más los proveedores generales de Costos.
                        </div>

                        {subCostos.length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", columnGap: 10, padding: "10px 14px", background: "#F1E9D2", borderRadius: 8, marginBottom: 14 }}>
                            <div><div style={labelStyle}>PPTO. ORIGINAL (TODAS)</div><div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{fmt(totalesTodas.presupuestoOriginal)}</div></div>
                            <div><div style={labelStyle}>PPTO. REAL (TODAS)</div><div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{fmt(totalesTodas.presupuesto)}</div></div>
                            <div><div style={labelStyle}>PAGADO (TODAS)</div><div style={{ fontSize: 15, fontWeight: 700, color: GREEN }}>{fmt(totalesTodas.pagado)}</div></div>
                            <div><div style={labelStyle}>SALDO A PAGAR (TODAS)</div><div style={{ fontSize: 15, fontWeight: 700, color: totalesTodas.resta > 0 ? RED : MUTED }}>{fmt(totalesTodas.resta)}</div></div>
                          </div>
                        )}

                        {subCostos.length === 0 ? (
                          <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 8 }}>Todavía no creaste sub obras de costo para esta obra.</div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 8 }}>
                            {datosPorSubCosto.map(({ sub, idx, subK, subPagos, subProvsConDatos }) => {
                              const expanded = !!expandedSubCostos[subK];
                              const subProvDraft = newProveedorDraft[subK];
                              const subPagoDraft = newPagoDraft[subK];
                              const subTotalPresupuesto = subProvsConDatos.reduce((s2, p) => s2 + (p.presupuesto || 0), 0);
                              const subTotalPagado = subProvsConDatos.reduce((s2, p) => s2 + p.pagado, 0);
                              const subTotalResta = subProvsConDatos.reduce((s2, p) => s2 + p.resta, 0);
                              const subPagosBusquedaTexto = (pagoBusqueda[subK] || "").trim().toLowerCase();
                              const subPagosFiltrados = subPagos
                                .map((p, i2) => ({ ...p, _idx: i2 }))
                                .filter((p) => !subPagosBusquedaTexto || p.proveedor.toLowerCase().includes(subPagosBusquedaTexto));
                              return (
                                <div key={subK} style={{ border: "1px solid " + BORDER, borderRadius: 8, overflow: "hidden" }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#FAFAF7" }}>
                                    <SubCostoNombre nombre={sub.nombre} onSave={(nombre) => renameCostoSubobra(k, idx, nombre)} readOnly={!canEdit} />
                                    {canEdit && (
                                      <button onClick={() => deleteCostoSubobra(k, idx)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}><Trash2 size={13} /></button>
                                    )}
                                  </div>
                                  <div
                                    onClick={() => setExpandedSubCostos((prev) => ({ ...prev, [subK]: !prev[subK] }))}
                                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 12px", borderTop: "1px solid " + BORDER, cursor: "pointer", fontSize: 11.5 }}
                                  >
                                    <span style={{ color: NAVY, fontWeight: 700 }}>
                                      <span style={{ display: "inline-block", transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", marginRight: 6, fontSize: 10 }}>▶</span>
                                      Proveedores{subProvsConDatos.length > 0 ? " (" + subProvsConDatos.length + ")" : ""}
                                    </span>
                                    {!expanded && (
                                      <span style={{ color: MUTED }}>
                                        Ppto. real: <b style={{ color: TEXT }}>{fmt(subTotalPresupuesto)}</b>
                                        {" · "}Pagado: <b style={{ color: GREEN }}>{fmt(subTotalPagado)}</b>
                                        {" · "}Saldo: <b style={{ color: subTotalResta > 0 ? RED : MUTED }}>{fmt(subTotalResta)}</b>
                                      </span>
                                    )}
                                  </div>
                                  {expanded && (
                                    <div style={{ padding: "10px 12px 14px" }}>
                                      {subProvsConDatos.length === 0 ? (
                                        <div style={{ fontSize: 12, color: MUTED, marginBottom: 8 }}>Todavía no cargaste proveedores para esta sub obra.</div>
                                      ) : (
                                        <>
                                          <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px", columnGap: 8, fontSize: 10.5, fontWeight: 700, padding: "4px 6px" }}>
                                            <SortHeader label="PROVEEDOR" tableId={"subCosto:" + subK} sortKey="proveedor" sortState={sortState} onSort={toggleSort} />
                                            <SortHeader label="PPTO. ORIGINAL" tableId={"subCosto:" + subK} sortKey="presupuestoOriginal" sortState={sortState} onSort={toggleSort} align="right" />
                                            <SortHeader label="PPTO. REAL" tableId={"subCosto:" + subK} sortKey="presupuesto" sortState={sortState} onSort={toggleSort} align="right" />
                                            <SortHeader label="PAGADO" tableId={"subCosto:" + subK} sortKey="pagado" sortState={sortState} onSort={toggleSort} align="right" />
                                            <SortHeader label="SALDO" tableId={"subCosto:" + subK} sortKey="resta" sortState={sortState} onSort={toggleSort} align="right" />
                                            <SortHeader label="DESVÍO" tableId={"subCosto:" + subK} sortKey="desvioPct" sortState={sortState} onSort={toggleSort} align="right" />
                                            <div />
                                          </div>
                                          {applySort("subCosto:" + subK, subProvsConDatos).map((p) => (
                                            <ProveedorRow key={p._idx} p={p} index={p._idx} onSave={(ch) => updateSubCostoProveedor(subK, p._idx, ch)} onDelete={() => deleteSubCostoProveedor(subK, p._idx)} readOnly={!canEdit} />
                                          ))}
                                          <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px", columnGap: 8, fontSize: 11.5, fontWeight: 700, padding: "6px 6px", background: "#F1E9D2", borderRadius: 4, marginTop: 4 }}>
                                            <div style={{ color: NAVY }}>TOTAL</div>
                                            <div style={{ textAlign: "right", color: MUTED }}>{fmt(subProvsConDatos.reduce((s2, p) => s2 + (p.presupuestoOriginal || 0), 0))}</div>
                                            <div style={{ textAlign: "right" }}>{fmt(subTotalPresupuesto)}</div>
                                            <div style={{ textAlign: "right", color: GREEN }}>{fmt(subTotalPagado)}</div>
                                            <div style={{ textAlign: "right", color: RED }}>{fmt(subTotalResta)}</div>
                                            <div /><div />
                                          </div>
                                        </>
                                      )}

                                      {canEdit && (
                                        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                                          {subProvDraft ? (
                                            <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                                              <input placeholder="Proveedor" list="proveedores-sugeridos-subcosto" style={inputStyle} onChange={(e) => setNewProveedorDraft((p) => ({ ...p, [subK]: { ...p[subK], proveedor: e.target.value } }))} />
                                              <input placeholder="Presupuesto original" type="number" style={{ ...inputStyle, width: 130 }} onChange={(e) => setNewProveedorDraft((p) => ({ ...p, [subK]: { ...p[subK], presupuestoOriginal: e.target.value } }))} />
                                              <input placeholder="Presupuesto real" type="number" style={{ ...inputStyle, width: 120 }} onChange={(e) => setNewProveedorDraft((p) => ({ ...p, [subK]: { ...p[subK], presupuesto: e.target.value } }))} />
                                              <button onClick={() => addSubCostoProveedor(subK, subProvDraft)} style={smallBtnPrimary}>Guardar</button>
                                              <button onClick={() => setNewProveedorDraft((p) => ({ ...p, [subK]: null }))} style={smallBtnGhost}><X size={13} /></button>
                                            </div>
                                          ) : (
                                            <button onClick={() => setNewProveedorDraft((p) => ({ ...p, [subK]: { proveedor: "" } }))} style={smallBtnGhost}>
                                              <Plus size={13} /> Nuevo proveedor
                                            </button>
                                          )}

                                          {subProvsConDatos.length > 0 && (
                                            subPagoDraft ? (
                                              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                                                <select style={{ ...inputStyle, width: 160 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [subK]: { ...p[subK], proveedor: e.target.value } }))}>
                                                  <option value="">Proveedor...</option>
                                                  {subProvsConDatos.map((p, i2) => <option key={i2} value={p.proveedor}>{p.proveedor}</option>)}
                                                </select>
                                                <input placeholder="Monto" type="number" style={{ ...inputStyle, width: 100 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [subK]: { ...p[subK], monto: e.target.value } }))} />
                                                <input placeholder="Fecha (dd/mm/aaaa)" style={{ ...inputStyle, width: 130 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [subK]: { ...p[subK], fecha: e.target.value } }))} />
                                                <input placeholder="N° FC" style={{ ...inputStyle, width: 90 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [subK]: { ...p[subK], fc: e.target.value } }))} />
                                                <input placeholder="Observaciones" style={{ ...inputStyle, width: 150 }} onChange={(e) => setNewPagoDraft((p) => ({ ...p, [subK]: { ...p[subK], observaciones: e.target.value } }))} />
                                                <button onClick={() => subPagoDraft.proveedor && addSubCostoPago(subK, subPagoDraft)} style={smallBtnPrimary}>Registrar pago</button>
                                                <button onClick={() => setNewPagoDraft((p) => ({ ...p, [subK]: null }))} style={smallBtnGhost}><X size={13} /></button>
                                              </div>
                                            ) : (
                                              <button onClick={() => setNewPagoDraft((p) => ({ ...p, [subK]: { proveedor: "" } }))} style={smallBtnGhost}>
                                                <Plus size={13} /> Registrar pago
                                              </button>
                                            )
                                          )}

                                          <label style={{ ...smallBtnGhost, marginLeft: "auto" }}>
                                            <Upload size={13} /> Importar planilla de costos
                                            <input type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => handleImportCostosSubCosto(subK, e.target.files[0])} />
                                          </label>
                                          <button onClick={() => downloadTemplateSubCosto("costos", subK)} style={{ ...smallBtnGhost, color: MUTED }}>Plantilla de ejemplo</button>
                                          <label style={smallBtnGhost}>
                                            <Upload size={13} /> Importar planilla de pagos
                                            <input type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => handleImportPagosSubCosto(subK, e.target.files[0])} />
                                          </label>
                                          <button onClick={() => downloadTemplateSubCosto("pagos", subK)} style={{ ...smallBtnGhost, color: MUTED }}>Plantilla de ejemplo</button>
                                        </div>
                                      )}

                                      {subPagos.length > 0 && (
                                        <>
                                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6, margin: "12px 0 4px" }}>
                                            <div style={{ fontSize: 10.5, fontWeight: 700, color: MUTED }}>HISTORIAL DE PAGOS</div>
                                            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                              <input placeholder="Buscar proveedor..." value={pagoBusqueda[subK] || ""} onChange={(e) => setPagoBusqueda((prev) => ({ ...prev, [subK]: e.target.value }))} style={{ ...inputStyle, width: 140, fontSize: 11.5 }} />
                                              <button onClick={() => exportPagosObra(subPagosFiltrados, "pagos_" + subK.replace(/[^a-z0-9]+/gi, "_") + ".xlsx")} style={{ ...smallBtnGhost, color: MUTED, fontSize: 11 }}>
                                                <Download size={12} /> Descargar
                                              </button>
                                            </div>
                                          </div>
                                          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px", columnGap: 8, fontSize: 10.5, fontWeight: 700, padding: "4px 6px" }}>
                                            <SortHeader label="PROVEEDOR" tableId={"subCostoPagos:" + subK} sortKey="proveedor" sortState={sortState} onSort={toggleSort} />
                                            <SortHeader label="PAGO" tableId={"subCostoPagos:" + subK} sortKey="monto" sortState={sortState} onSort={toggleSort} align="right" />
                                            <SortHeader label="FECHA" tableId={"subCostoPagos:" + subK} sortKey="fecha" sortState={sortState} onSort={toggleSort} align="right" />
                                            <SortHeader label="N° FC" tableId={"subCostoPagos:" + subK} sortKey="fc" sortState={sortState} onSort={toggleSort} align="right" />
                                            <SortHeader label="OBSERVACIONES" tableId={"subCostoPagos:" + subK} sortKey="observaciones" sortState={sortState} onSort={toggleSort} />
                                            <div />
                                          </div>
                                          {subPagosFiltrados.length === 0 ? (
                                            <div style={{ padding: "8px 6px", fontSize: 11.5, color: MUTED }}>Ningún pago coincide con la búsqueda.</div>
                                          ) : applySort("subCostoPagos:" + subK, subPagosFiltrados).map((p) => (
                                            <PagoRow key={p._idx} p={p} onSave={(ch) => updateSubCostoPago(subK, p._idx, ch)} onDelete={() => deleteSubCostoPago(subK, p._idx)} readOnly={!canEdit} />
                                          ))}
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {canEdit && (newSubCostoDraft !== null ? (
                          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginTop: 8 }}>
                            <input placeholder="Nombre de la sub obra" style={inputStyle} onChange={(e) => setNewSubCostoDraft(e.target.value)} />
                            <button onClick={() => addCostoSubobra(k, newSubCostoDraft)} style={smallBtnPrimary}>Guardar</button>
                            <button onClick={() => setNewSubCostoDraft(null)} style={smallBtnGhost}><X size={13} /></button>
                          </div>
                        ) : (
                          <button onClick={() => setNewSubCostoDraft("")} style={smallBtnGhost}>
                            <Plus size={13} /> Agregar sub obra
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </>
              );
            })()
          ) : (
            <>
              <button onClick={() => setSelectedCliente(null)} style={{ ...smallBtnGhost, marginBottom: 14 }}>
                <ArrowLeft size={14} /> Volver a clientes
              </button>

              {(() => {
                const obrasDelCliente = clientes[selectedCliente].filter((o) => aniosActivos.includes(o.anio || new Date().getFullYear()));
                const ventaCliente = obrasDelCliente.reduce((s, x) => s + x.ventaFinal, 0);
                return (
                <>
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px", marginBottom: 16, display: "flex", gap: 24, alignItems: "center" }}>
                <div style={{ width: 260, height: 230, flexShrink: 0 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={obrasDelCliente.map((o) => ({ name: o.obra, value: o.ventaFinal }))}
                        dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85}
                      >
                        {obrasDelCliente.map((o, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                            opacity={!activeSlice["centroCosto:" + selectedCliente] || activeSlice["centroCosto:" + selectedCliente] === o.obra ? 1 : 0.3} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => fmt(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 8 }}>{selectedCliente}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10, gap: "4px 18px", fontSize: 12.5 }}>
                    {obrasDelCliente.map((o, i) => {
                      const active = activeSlice["centroCosto:" + selectedCliente] === o.obra;
                      return (
                        <div
                          key={i}
                          onMouseEnter={() => setActiveSlice((prev) => ({ ...prev, ["centroCosto:" + selectedCliente]: o.obra }))}
                          onMouseLeave={() => setActiveSlice((prev) => ({ ...prev, ["centroCosto:" + selectedCliente]: null }))}
                          style={{
                            display: "flex", alignItems: "center", gap: 7, cursor: "default",
                            padding: "3px 6px", borderRadius: 6, background: active ? "#F1E9D2" : "transparent",
                          }}
                        >
                          <span style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                          <span style={{ fontWeight: active ? 700 : 600, color: active ? NAVY : TEXT }}>{o.obra}</span>
                          <span style={{ color: MUTED }}>{((o.ventaFinal / ventaCliente) * 100).toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
                <div style={{
                  display: "grid", gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 0.8fr 0.8fr 32px", columnGap: 10,
                  padding: "11px 18px", fontSize: 11.5, fontWeight: 700, background: "#EFEDE7",
                  borderBottom: "1px solid " + BORDER, letterSpacing: 0.3,
                }}>
                  <SortHeader label="CENTRO DE COSTO" tableId="obraList" sortKey="obra" sortState={sortState} onSort={toggleSort} />
                  <SortHeader label="ESTADO" tableId="obraList" sortKey="status" sortState={sortState} onSort={toggleSort} />
                  <SortHeader label="VENTA" tableId="obraList" sortKey="ventaFinal" sortState={sortState} onSort={toggleSort} align="right" />
                  <SortHeader label="COSTO" tableId="obraList" sortKey="costoFinal" sortState={sortState} onSort={toggleSort} align="right" />
                  <SortHeader label="SALDO A PAGAR" tableId="obraList" sortKey="saldoProveedores" sortState={sortState} onSort={toggleSort} align="right" />
                  <SortHeader label="MB INICIAL" tableId="obraList" sortKey="mbInicial" sortState={sortState} onSort={toggleSort} align="right" />
                  <SortHeader label="MB FINAL" tableId="obraList" sortKey="mbFinal" sortState={sortState} onSort={toggleSort} align="right" />
                  <div />
                </div>

                {applySort("obraList", obrasDelCliente).map((o) => {
                  const k = obraKey(o.cliente, o.obra);
                  return (
                    <div
                      key={k}
                      onClick={() => { setSelectedObra(k); setObraTab("facturas"); setShowAdicionales(false); setNewAdicionalDraft(null); setShowSubobras(false); setNewSubobraDraft(null); }}
                      style={{
                        display: "grid", gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 0.8fr 0.8fr 32px", columnGap: 10,
                        padding: "10px 18px", fontSize: 13, alignItems: "center", cursor: "pointer",
                        borderBottom: "1px solid " + BORDER,
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>{o.obra}</div>
                      <div><StatusBadge status={o.status} onClick={canEdit ? (e) => { e.stopPropagation(); toggleStatus(o); } : undefined} /></div>
                      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtSmart(o.ventaFinal, o.ventaFinalUSD)}</div>
                      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED }}>{fmtSmart(o.costoFinal, o.costoFinalUSD)}</div>
                      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: o.saldoProveedores > 0 ? RED : MUTED }}>{fmtSmart(o.saldoProveedores, o.saldoProveedoresUSD)}</div>
                      <div style={{ textAlign: "right" }}><MBValue v={valSmart(o.mbInicial, o.mbInicialUSD)} /></div>
                      <div style={{ textAlign: "right" }}><MBValue v={valSmart(o.mbFinal, o.mbFinalUSD)} /></div>
                      <div style={{ display: "flex", justifyContent: "center", color: MUTED }}><ChevronRight size={16} /></div>
                    </div>
                  );
                })}
                <div style={{
                  display: "grid", gridTemplateColumns: "1.8fr 1fr 1.1fr 1.1fr 1.1fr 0.8fr 0.8fr 32px", columnGap: 10,
                  padding: "10px 18px", fontSize: 13, fontWeight: 700, background: "#F1E9D2",
                }}>
                  <div style={{ color: NAVY }}>TOTAL</div><div />
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(ventaCliente)}</div>
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: MUTED }}>{fmt(obrasDelCliente.reduce((s, x) => s + x.costoFinal, 0))}</div>
                  <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", color: RED }}>{fmt(obrasDelCliente.reduce((s, x) => s + (x.saldoProveedores || 0), 0))}</div>
                  <div /><div /><div />
                </div>
              </div>
                </>
                );
              })()}
            </>
          )}
          {/* Solo visible en la sección Obras (dentro de este mismo tab), al final del contenido (no flotante) */}
          {role === "comercial" && (
            <>
              <PresentacionSlides data={presentacionData} refs={presentacionSlideRefs} />
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button
                  onClick={generarPresentacionPdf}
                  disabled={generandoPresentacion}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, background: NAVY, color: "#fff", border: "1px solid " + GOLD,
                    padding: "12px 20px", borderRadius: 30, fontWeight: 700, fontSize: 13, cursor: generandoPresentacion ? "default" : "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)", opacity: generandoPresentacion ? 0.7 : 1,
                  }}
                >
                  <Download size={15} /> {generandoPresentacion ? "Generando presentación..." : "Hacer presentación"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ProveedorRow({ p, index, onSave, onDelete, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState(p);
  if (editing) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px", columnGap: 10, fontSize: 12.5, padding: "6px 8px", background: "#F7EDD2", borderRadius: 4, gap: 4, alignItems: "center" }}>
        <input style={inputStyle} defaultValue={p.proveedor} onChange={(e) => setForm((f) => ({ ...f, proveedor: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%", textAlign: "right" }} type="number" defaultValue={p.presupuestoOriginal} onChange={(e) => setForm((f) => ({ ...f, presupuestoOriginal: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%", textAlign: "right" }} type="number" defaultValue={p.presupuesto} onChange={(e) => setForm((f) => ({ ...f, presupuesto: e.target.value }))} />
        <div style={{ textAlign: "right", color: GREEN }}>{fmt(p.pagado)}</div>
        <div style={{ textAlign: "right", color: p.resta > 0 ? RED : MUTED, fontWeight: 600 }}>{fmt(p.resta)}</div>
        <div style={{ textAlign: "right", color: p.desvio > 0 ? RED : p.desvio < 0 ? GREEN : MUTED, fontWeight: 600 }}>{fmt(p.desvio)} ({p.desvioPct >= 0 ? "+" : ""}{p.desvioPct.toFixed(1)}%)</div>
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => { onSave(form); setEditing(false); }} style={{ border: "none", background: "none", cursor: "pointer", color: GREEN }}>✓</button>
          <button onClick={() => setEditing(false)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr 1fr 1.2fr 50px", columnGap: 10, fontSize: 12.5, padding: "7px 8px",
      background: index % 2 === 0 ? "#fff" : "#F5F4F0", borderRadius: 4, alignItems: "center",
    }}>
      <div>{p.proveedor}</div>
      <div style={{ textAlign: "right", color: MUTED }}>{fmt(p.presupuestoOriginal, p.tc)}</div>
      <div style={{ textAlign: "right" }}>{fmt(p.presupuesto, p.tc)}</div>
      <div style={{ textAlign: "right", color: GREEN }}>{fmt(p.pagado)}</div>
      <div style={{ textAlign: "right", color: p.resta > 0 ? RED : MUTED, fontWeight: 600 }}>{fmt(p.resta)}</div>
      <div style={{ textAlign: "right", color: p.desvio > 0 ? RED : p.desvio < 0 ? GREEN : MUTED, fontWeight: 600 }}>{fmt(p.desvio)} ({p.desvioPct >= 0 ? "+" : ""}{p.desvioPct.toFixed(1)}%)</div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "center" }}>
        {readOnly ? null : confirmDelete ? (
          <>
            <button onClick={onDelete} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontWeight: 700, fontSize: 13 }}>✓</button>
            <button onClick={() => setConfirmDelete(false)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 }}>✕</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><Pencil size={12} /></button>
            <button onClick={() => setConfirmDelete(true)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function AdicionalRow({ a, onSave, onDelete, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState(a);
  if (editing) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 50px", columnGap: 10, fontSize: 12.5, padding: "6px 8px", background: "#F7EDD2", gap: 4, alignItems: "center" }}>
        <input style={inputStyle} defaultValue={a.concepto} onChange={(e) => setForm((f) => ({ ...f, concepto: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%", textAlign: "right" }} type="number" defaultValue={a.monto} onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))} />
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => { onSave(form); setEditing(false); }} style={{ border: "none", background: "none", cursor: "pointer", color: GREEN }}>✓</button>
          <button onClick={() => setEditing(false)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 50px", columnGap: 10, fontSize: 12.5, padding: "6px 8px", alignItems: "center" }}>
      <div>{a.concepto}</div>
      <div style={{ textAlign: "right" }}>{fmt(a.monto, a.tc)}</div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "center" }}>
        {readOnly ? null : confirmDelete ? (
          <>
            <button onClick={onDelete} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontWeight: 700, fontSize: 13 }}>✓</button>
            <button onClick={() => setConfirmDelete(false)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 }}>✕</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><Pencil size={12} /></button>
            <button onClick={() => setConfirmDelete(true)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function SubCostoNombre({ nombre, onSave, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(nombre);
  if (editing) {
    return (
      <div style={{ display: "flex", gap: 6, alignItems: "center", flex: 1 }}>
        <input style={inputStyle} defaultValue={nombre} onChange={(e) => setValue(e.target.value)} />
        <button onClick={() => { onSave(value); setEditing(false); }} style={{ border: "none", background: "none", cursor: "pointer", color: GREEN }}>✓</button>
        <button onClick={() => setEditing(false)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontWeight: 700, color: NAVY, fontSize: 13 }}>{nombre}</span>
      {!readOnly && <button onClick={() => setEditing(true)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><Pencil size={12} /></button>}
    </div>
  );
}

function SubobraRow({ s, onSave, onDelete, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState(s);
  if (editing) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 50px", columnGap: 10, fontSize: 12.5, padding: "6px 8px", background: "#F7EDD2", gap: 4, alignItems: "center" }}>
        <input style={inputStyle} defaultValue={s.ordenCompra} onChange={(e) => setForm((f) => ({ ...f, ordenCompra: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%", textAlign: "right" }} type="number" defaultValue={s.venta} onChange={(e) => setForm((f) => ({ ...f, venta: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%" }} defaultValue={s.fecha} onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%" }} defaultValue={s.observaciones || ""} onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))} />
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => { onSave(form); setEditing(false); }} style={{ border: "none", background: "none", cursor: "pointer", color: GREEN }}>✓</button>
          <button onClick={() => setEditing(false)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1.5fr 50px", columnGap: 10, fontSize: 12.5, padding: "6px 8px", alignItems: "center" }}>
      <div>{s.ordenCompra || "—"}</div>
      <div style={{ textAlign: "right" }}>{fmt(s.venta, s.tc)}</div>
      <div style={{ color: fechaEsValida(s.fecha) ? MUTED : RED, fontWeight: fechaEsValida(s.fecha) ? 400 : 700 }} title={fechaEsValida(s.fecha) ? "" : "Fecha no reconocida: se atribuye al mes de la obra, no al mes que corresponde"}>
        {s.fecha}{!fechaEsValida(s.fecha) && " ⚠"}
      </div>
      <div style={{ color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.observaciones || "—"}</div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "center" }}>
        {readOnly ? null : confirmDelete ? (
          <>
            <button onClick={onDelete} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontWeight: 700, fontSize: 13 }}>✓</button>
            <button onClick={() => setConfirmDelete(false)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 }}>✕</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><Pencil size={12} /></button>
            <button onClick={() => setConfirmDelete(true)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function PagoRow({ p, onSave, onDelete, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState(p);
  if (editing) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px", columnGap: 10, fontSize: 12, padding: "5px 8px", background: "#F7EDD2", gap: 4, alignItems: "center" }}>
        <input style={inputStyle} defaultValue={p.proveedor} onChange={(e) => setForm((f) => ({ ...f, proveedor: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%", textAlign: "right" }} type="number" defaultValue={p.monto} onChange={(e) => setForm((f) => ({ ...f, monto: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%", textAlign: "right" }} defaultValue={p.fecha} onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%", textAlign: "right" }} defaultValue={p.fc} onChange={(e) => setForm((f) => ({ ...f, fc: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%" }} defaultValue={p.observaciones || ""} onChange={(e) => setForm((f) => ({ ...f, observaciones: e.target.value }))} />
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => { onSave(form); setEditing(false); }} style={{ border: "none", background: "none", cursor: "pointer", color: GREEN }}>✓</button>
          <button onClick={() => setEditing(false)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.9fr 0.9fr 0.9fr 1.6fr 50px", columnGap: 10, fontSize: 12, padding: "5px 8px", alignItems: "center" }}>
      <div>{p.proveedor}</div><div style={{ textAlign: "right" }}>{fmt(p.monto, p.tc)}</div>
      <div style={{ textAlign: "right", color: MUTED }}>{p.fecha}</div><div style={{ textAlign: "right", color: MUTED }}>{p.fc}</div>
      <div style={{ color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={p.observaciones || ""}>{p.observaciones || "—"}</div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "center" }}>
        {readOnly ? null : confirmDelete ? (
          <>
            <button onClick={onDelete} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontWeight: 700, fontSize: 13 }}>✓</button>
            <button onClick={() => setConfirmDelete(false)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 }}>✕</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><Pencil size={12} /></button>
            <button onClick={() => setConfirmDelete(true)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function FacturaRow({ f, onSave, onDelete, onView, readOnly }) {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState(f);
  if (editing) {
    return (
      <div style={{
        display: "grid", gridTemplateColumns: "1.8fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.7fr 50px", columnGap: 10,
        padding: "8px 16px", fontSize: 12, alignItems: "center", background: "#F7EDD2", gap: 4,
      }}>
        <input style={inputStyle} defaultValue={f.concepto || ""} onChange={(e) => setForm((d) => ({ ...d, concepto: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%" }} defaultValue={f.tipo || ""} onChange={(e) => setForm((d) => ({ ...d, tipo: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%" }} defaultValue={f.nro || ""} onChange={(e) => setForm((d) => ({ ...d, nro: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%" }} defaultValue={f.fecha || ""} onChange={(e) => setForm((d) => ({ ...d, fecha: e.target.value }))} />
        <select style={{ ...selectStyle, width: "100%" }} defaultValue={f.status} onChange={(e) => setForm((d) => ({ ...d, status: e.target.value }))}>
          <option value="ADEUDA">Adeuda</option>
          <option value="PAGADA">Pagada</option>
        </select>
        <input style={{ ...inputStyle, width: "100%", textAlign: "right" }} type="number" defaultValue={f.importe} onChange={(e) => setForm((d) => ({ ...d, importe: e.target.value }))} />
        <input style={{ ...inputStyle, width: "100%" }} defaultValue={f.fechaPago || ""} onChange={(e) => setForm((d) => ({ ...d, fechaPago: e.target.value }))} />
        {form.pdfName ? (
          <button
            onClick={() => setForm((d) => ({ ...d, pdfData: null, pdfName: null }))}
            title="Quitar PDF adjunto"
            style={{ border: "none", background: "none", cursor: "pointer", color: RED, display: "flex", justifyContent: "center" }}
          ><Trash2 size={13} /></button>
        ) : (
          <label style={{ cursor: "pointer", color: MUTED, display: "flex", justifyContent: "center" }}>
            <Paperclip size={13} />
            <input
              type="file" accept="application/pdf" style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                if (file.size > PDF_MAX_BYTES) { alert("El PDF pesa demasiado (máx. 180 KB). Comprimilo o subilo a Drive y pegá el link en el concepto."); return; }
                const reader = new FileReader();
                reader.onload = (ev) => setForm((d) => ({ ...d, pdfData: ev.target.result, pdfName: file.name }));
                reader.readAsDataURL(file);
              }}
            />
          </label>
        )}
        <div style={{ display: "flex", gap: 4 }}>
          <button onClick={() => { onSave(form); setEditing(false); }} style={{ border: "none", background: "none", cursor: "pointer", color: GREEN }}>✓</button>
          <button onClick={() => setEditing(false)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}>✕</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1.8fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.7fr 50px", columnGap: 10,
      padding: "9px 16px", fontSize: 12.5, alignItems: "center",
    }}>
      <div style={{ color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.concepto || "—"}</div>
      <div>{f.tipo || "—"}</div>
      <div>{f.nro || "—"}</div>
      <div>{f.fecha}</div>
      <div><StatusBadge status={f.status === "PAGADA" ? "FINALIZADA" : "EN PROCESO"} /></div>
      <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(f.importe, f.tc)}</div>
      <div style={{ color: MUTED }}>{f.fechaPago || "—"}</div>
      <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
        {f.pdfData ? (
          <>
            <button onClick={onView} title="Ver PDF" style={{ border: "none", background: "none", cursor: "pointer", color: NAVY }}><Eye size={13} /></button>
            <button onClick={() => ofrecerDescarga(f.pdfName || "factura.pdf", dataUrlToBlob(f.pdfData))} title="Descargar" style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, display: "flex" }}><Download size={13} /></button>
          </>
        ) : (
          <span style={{ color: "#CCCFD9", fontSize: 11 }}>—</span>
        )}
      </div>
      <div style={{ display: "flex", gap: 5, justifyContent: "center", alignItems: "center" }}>
        {readOnly ? null : confirmDelete ? (
          <>
            <button onClick={onDelete} style={{ border: "none", background: "none", cursor: "pointer", color: RED, fontWeight: 700, fontSize: 13 }}>✓</button>
            <button onClick={() => setConfirmDelete(false)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 13 }}>✕</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><Pencil size={12} /></button>
            <button onClick={() => setConfirmDelete(true)} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}><Trash2 size={12} /></button>
          </>
        )}
      </div>
    </div>
  );
}

function SortHeader({ label, tableId, sortKey, sortState, onSort, align }) {
  const active = sortState[tableId]?.key === sortKey;
  const dir = active ? sortState[tableId].dir : null;
  return (
    <div onClick={() => onSort(tableId, sortKey)} style={{ cursor: "pointer", userSelect: "none", display: "flex", alignItems: "center", gap: 3, justifyContent: align === "right" ? "flex-end" : "flex-start", color: active ? NAVY : MUTED, letterSpacing: 0.3 }}>
      {label} <span style={{ fontSize: 9, opacity: active ? 1 : 0.35 }}>{dir === "desc" ? "▼" : "▲"}</span>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, marginBottom: 4, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: color || NAVY }}>{value}</div>
    </div>
  );
}

function EditObraForm({ obra, onCancel, onSave }) {
  const [form, setForm] = useState({ cliente: obra.cliente, obra: obra.obra, venta: obra.ventaOriginalManual !== undefined ? obra.ventaOriginalManual : obra.ventaOriginal, costoInicial: obra.costoInicial, status: obra.status || "EN PROCESO", mes: obra.mes || "ENERO", anio: obra.anio || new Date().getFullYear() });
  const venta = Number(form.venta) || 0;
  const costo = Number(form.costoInicial) || 0;
  const mb = venta ? ((venta - costo) / venta) * 100 : null;
  return (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px", marginBottom: 16 }}>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Editar obra</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Cliente (solo afecta a esta obra)</label>
          <input style={{ ...inputStyle, width: "100%" }} value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Centro de costo</label>
          <input style={{ ...inputStyle, width: "100%" }} value={form.obra} onChange={(e) => setForm({ ...form, obra: e.target.value })} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", columnGap: 10, gap: 12, marginBottom: 14 }}>
        <div>
          <label style={labelStyle}>Venta Original</label>
          <input style={{ ...inputStyle, width: "100%" }} type="number" value={form.venta} onChange={(e) => setForm({ ...form, venta: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Costo inicial</label>
          <input style={{ ...inputStyle, width: "100%" }} type="number" value={form.costoInicial} onChange={(e) => setForm({ ...form, costoInicial: e.target.value })} />
        </div>
        <div>
          <label style={labelStyle}>Estado</label>
          <select style={{ ...selectStyle, width: "100%" }} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="EN PROCESO">En proceso</option>
            <option value="FINALIZADA">Finalizada</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Mes</label>
          <select style={{ ...selectStyle, width: "100%" }} value={form.mes} onChange={(e) => setForm({ ...form, mes: e.target.value })}>
            {MESES.map((m) => <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Año</label>
          <input style={{ ...inputStyle, width: "100%" }} type="number" value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value })} />
        </div>
      </div>
      <div style={{ background: BG, borderRadius: 8, padding: "10px 12px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: MUTED, fontWeight: 700 }}>MARGEN BRUTO INICIAL</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: mb === null ? MUTED : (mb < 15 ? RED : mb >= 30 ? GREEN : NAVY) }}>{mb === null ? "—" : pct(mb)}</span>
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={smallBtnGhost}>Cancelar</button>
        <button onClick={() => onSave(form)} style={smallBtnPrimary}>Guardar cambios</button>
      </div>
    </div>
  );
}

function NewObraForm({ onCancel, onSave }) {
  const [form, setForm] = useState({ cliente: "", obra: "", venta: "", costoInicial: "", mes: "ENERO", anio: new Date().getFullYear() });
  const venta = Number(form.venta) || 0;
  const costo = Number(form.costoInicial) || 0;
  const mb = venta ? ((venta - costo) / venta) * 100 : null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,20,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 380 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 14 }}>Nueva obra</div>
        <label style={labelStyle}>Cliente</label>
        <input style={{ ...inputStyle, width: "100%", marginBottom: 10 }} value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })} placeholder="Ej: PANDORA" />
        <label style={labelStyle}>Centro de costo</label>
        <input style={{ ...inputStyle, width: "100%", marginBottom: 10 }} value={form.obra} onChange={(e) => setForm({ ...form, obra: e.target.value })} placeholder="Ej: DOT 4" />
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Mes de ejecución</label>
            <select style={{ ...selectStyle, width: "100%" }} value={form.mes} onChange={(e) => setForm({ ...form, mes: e.target.value })}>
              {MESES.map((m) => <option key={m} value={m}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <div style={{ width: 100 }}>
            <label style={labelStyle}>Año</label>
            <input style={{ ...inputStyle, width: "100%" }} type="number" value={form.anio} onChange={(e) => setForm({ ...form, anio: e.target.value })} />
          </div>
        </div>
        <label style={labelStyle}>Venta Original</label>
        <input style={{ ...inputStyle, width: "100%", marginBottom: 10 }} type="number" value={form.venta} onChange={(e) => setForm({ ...form, venta: e.target.value })} placeholder="0" />
        <label style={labelStyle}>Costo inicial</label>
        <input style={{ ...inputStyle, width: "100%", marginBottom: 10 }} type="number" value={form.costoInicial} onChange={(e) => setForm({ ...form, costoInicial: e.target.value })} placeholder="0" />
        <div style={{ background: BG, borderRadius: 8, padding: "10px 12px", marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: MUTED, fontWeight: 700 }}>MARGEN BRUTO INICIAL</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: mb === null ? MUTED : (mb < 15 ? RED : mb >= 30 ? GREEN : NAVY) }}>{mb === null ? "—" : pct(mb)}</span>
        </div>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={smallBtnGhost}>Cancelar</button>
          <button onClick={() => form.cliente && form.obra && onSave(form)} style={smallBtnPrimary}>Crear obra</button>
        </div>
      </div>
    </div>
  );
}

function ProveedoresComparacion({ nombres, rows, buscar, onQuitar, onLimpiar }) {
  const q = buscar.trim().toLowerCase();
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: NAVY }}>
          Comparando {nombres.length} proveedores
        </div>
        <button onClick={onLimpiar} style={smallBtnGhost}>Ver todos los proveedores</button>
      </div>
      <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 6, alignItems: "flex-start" }}>
        {nombres.map((nombre) => {
          const rowsDeEste = rows.filter((r) => r.proveedor === nombre && (!q || r.cliente.toLowerCase().includes(q) || r.obra.toLowerCase().includes(q)));
          const totalPresupuesto = rowsDeEste.reduce((s, r) => s + r.presupuesto, 0);
          const totalPresupuestoUSD = rowsDeEste.reduce((s, r) => s + r.presupuestoUSD, 0);
          return (
            <div key={nombre} style={{ minWidth: 260, maxWidth: 300, flex: "1 0 260px", background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F1E9D2", borderBottom: "1px solid " + BORDER }}>
                <div style={{ fontWeight: 700, color: NAVY, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nombre}</div>
                <button onClick={() => onQuitar(nombre)} title="Quitar de la comparación" style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, fontSize: 14, flexShrink: 0, marginLeft: 8 }}>✕</button>
              </div>
              <div style={{ maxHeight: 420, overflowY: "auto" }}>
                {rowsDeEste.map((r, i) => (
                  <div key={i} style={{ padding: "8px 14px", fontSize: 12, borderBottom: "1px solid " + BORDER, background: i % 2 === 0 ? "#fff" : "#F5F4F0" }}>
                    <div style={{ fontWeight: 600 }}>{r.cliente}</div>
                    <div style={{ color: MUTED, marginTop: 1 }}>{r.obra}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      <StatusBadge status={r.status} />
                      <span style={{ fontWeight: 600 }}>{fmtSmart(r.presupuesto, r.presupuestoUSD)}</span>
                    </div>
                  </div>
                ))}
                {rowsDeEste.length === 0 && (
                  <div style={{ padding: 14, fontSize: 12, color: MUTED }}>Sin obras que coincidan.</div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", fontSize: 12.5, fontWeight: 700, color: NAVY, background: "#F1E9D2", borderTop: "1px solid " + BORDER }}>
                <span>TOTAL</span><span>{fmtSmart(totalPresupuesto, totalPresupuestoUSD)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProveedoresView({ proveedoresMap, pagosMap, obras, costoSubobrasMap, subCostoProveedoresMap, subCostoPagosMap, onRename, onImportPagos, onReintentarPago, canEdit }) {
  const [selectedProveedores, setSelectedProveedores] = useState([]);
  const selectedProveedor = selectedProveedores.length === 1 ? selectedProveedores[0] : null;
  function toggleProveedor(name) {
    setSelectedProveedores((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);
  }
  const [hovered, setHovered] = useState(null);
  const [sort, setSort] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [buscar, setBuscar] = useState("");
  const [buscarFocus, setBuscarFocus] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  const [pagosFallidos, setPagosFallidos] = useState([]);
  const [showFallidosModal, setShowFallidosModal] = useState(false);
  const [showDescargarPagos, setShowDescargarPagos] = useState(false);
  const aniosConPagos = useMemo(() => {
    const set = new Set((obras || []).map((o) => o.anio || new Date().getFullYear()));
    return Array.from(set).sort((a, b) => b - a);
  }, [obras]);
  const [pagosAnio, setPagosAnio] = useState(() => aniosConPagos[0] || new Date().getFullYear());
  const [pagosMes, setPagosMes] = useState("TODO");

  function updateFallidoField(idx, field, value) {
    setPagosFallidos((prev) => prev.map((r, i) => i !== idx ? r : { ...r, [field]: value }));
  }

  function reintentarFallido(idx) {
    setPagosFallidos((prev) => {
      const row = prev[idx];
      if (!row) return prev;
      const normalizado = {
        ...row,
        cliente: (row.cliente || "").toUpperCase().trim(),
        obra: (row.obra || "").toUpperCase().trim(),
        proveedor: (row.proveedor || "").toUpperCase().trim(),
        subObra: (row.subObra || "").toUpperCase().trim(),
        importe: Number(row.importe) || 0,
      };
      const res = onReintentarPago(normalizado);
      if (res.ok) {
        return prev.filter((_, i) => i !== idx);
      }
      return prev.map((r, i) => i !== idx ? r : { ...normalizado, motivo: res.motivo });
    });
  }

  function descartarFallido(idx) {
    setPagosFallidos((prev) => prev.filter((_, i) => i !== idx));
  }

  const rows = useMemo(() => {
    const statusMap = {};
    const costoMap = {};
    const costoMapUSD = {};
    (obras || []).forEach((o) => {
      const k = obraKey(o.cliente, o.obra);
      statusMap[k] = o.status;
      costoMap[k] = o.costoFinal;
      costoMapUSD[k] = o.costoFinalUSD;
    });
    const out = [];
    Object.entries(proveedoresMap).forEach(([k, provs]) => {
      const [cliente, obra] = k.split("|");
      const pagos = pagosMap[k] || [];
      const costoObra = costoMap[k] || 0;
      const costoObraUSD = costoMapUSD[k] || 0;
      provs.forEach((p) => {
        if ((p.proveedor || "").trim().toUpperCase() === "MZ LATAM") return;
        const pagosDeEste = pagos.filter((pg) => pg.proveedor === p.proveedor);
        const pagado = pagosDeEste.reduce((s, pg) => s + pg.monto, 0);
        const pagadoUSD = pagosDeEste.reduce((s, pg) => s + aUsd(pg.monto, pg.tc), 0);
        const presupuesto = presupuestoEfectivo(p.presupuesto, pagado);
        const presupuestoUSD = Math.max(aUsd(p.presupuesto, p.tc), pagadoUSD);
        const presupuestoOriginalUSD = aUsd(p.presupuestoOriginal, p.tc);
        const desvio = (presupuesto || 0) - (p.presupuestoOriginal || 0);
        const desvioUSD = presupuestoUSD - presupuestoOriginalUSD;
        const desvioPct = p.presupuestoOriginal ? (desvio / p.presupuestoOriginal) * 100 : 0;
        const desvioPctUSD = presupuestoOriginalUSD ? (desvioUSD / presupuestoOriginalUSD) * 100 : 0;
        const share = costoObra ? (presupuesto / costoObra) * 100 : 0;
        const shareUSD = costoObraUSD ? (presupuestoUSD / costoObraUSD) * 100 : 0;
        out.push({
          proveedor: p.proveedor, cliente, obra, k,
          presupuestoOriginal: p.presupuestoOriginal, presupuestoOriginalUSD, presupuesto, presupuestoUSD,
          pagado, pagadoUSD, resta: presupuesto - pagado, restaUSD: presupuestoUSD - pagadoUSD,
          desvio, desvioUSD, desvioPct, desvioPctUSD, share, shareUSD,
          status: statusMap[k] || null,
        });
      });
    });
    // Sub obras de Costos (solo WU): tienen su propia lista de proveedores,
    // separada de la de la obra general, así que sin este bloque nunca
    // aparecían en la solapa Proveedores (pie chart, tabla, búsqueda, etc).
    const sufijoSubCosto = "::subCosto::";
    Object.entries(subCostoProveedoresMap || {}).forEach(([subK, provs]) => {
      const sepIdx = subK.indexOf(sufijoSubCosto);
      if (sepIdx < 0) return;
      const k = subK.slice(0, sepIdx);
      const subIdx = Number(subK.slice(sepIdx + sufijoSubCosto.length));
      const [cliente, obraBase] = k.split("|");
      const subNombre = ((costoSubobrasMap[k] || [])[subIdx] || {}).nombre || "SUB OBRA";
      const obra = obraBase + " · " + subNombre;
      const pagos = (subCostoPagosMap || {})[subK] || [];
      const costoObra = costoMap[k] || 0;
      const costoObraUSD = costoMapUSD[k] || 0;
      provs.forEach((p) => {
        if ((p.proveedor || "").trim().toUpperCase() === "MZ LATAM") return;
        const pagosDeEste = pagos.filter((pg) => pg.proveedor === p.proveedor);
        const pagado = pagosDeEste.reduce((s, pg) => s + pg.monto, 0);
        const pagadoUSD = pagosDeEste.reduce((s, pg) => s + aUsd(pg.monto, pg.tc), 0);
        const presupuesto = presupuestoEfectivo(p.presupuesto, pagado);
        const presupuestoUSD = Math.max(aUsd(p.presupuesto, p.tc), pagadoUSD);
        const presupuestoOriginalUSD = aUsd(p.presupuestoOriginal, p.tc);
        const desvio = (presupuesto || 0) - (p.presupuestoOriginal || 0);
        const desvioUSD = presupuestoUSD - presupuestoOriginalUSD;
        const desvioPct = p.presupuestoOriginal ? (desvio / p.presupuestoOriginal) * 100 : 0;
        const desvioPctUSD = presupuestoOriginalUSD ? (desvioUSD / presupuestoOriginalUSD) * 100 : 0;
        const share = costoObra ? (presupuesto / costoObra) * 100 : 0;
        const shareUSD = costoObraUSD ? (presupuestoUSD / costoObraUSD) * 100 : 0;
        out.push({
          proveedor: p.proveedor, cliente, obra, k: subK,
          presupuestoOriginal: p.presupuestoOriginal, presupuestoOriginalUSD, presupuesto, presupuestoUSD,
          pagado, pagadoUSD, resta: presupuesto - pagado, restaUSD: presupuestoUSD - pagadoUSD,
          desvio, desvioUSD, desvioPct, desvioPctUSD, share, shareUSD,
          status: statusMap[k] || null,
        });
      });
    });
    return out;
  }, [proveedoresMap, pagosMap, obras, costoSubobrasMap, subCostoProveedoresMap, subCostoPagosMap]);

  const totalesPorProveedor = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      if (!map[r.proveedor]) map[r.proveedor] = { presupuesto: 0, presupuestoUSD: 0, presupuestoOriginal: 0, presupuestoOriginalUSD: 0, shareSum: 0, shareSumUSD: 0, shareCount: 0 };
      map[r.proveedor].presupuesto += r.presupuesto;
      map[r.proveedor].presupuestoUSD += r.presupuestoUSD;
      map[r.proveedor].presupuestoOriginal += r.presupuestoOriginal || 0;
      map[r.proveedor].presupuestoOriginalUSD += r.presupuestoOriginalUSD || 0;
      map[r.proveedor].shareSum += r.share || 0;
      map[r.proveedor].shareSumUSD += r.shareUSD || 0;
      map[r.proveedor].shareCount += 1;
    });
    return Object.entries(map).map(([proveedor, v]) => ({
      name: proveedor, value: v.presupuesto, valueUSD: v.presupuestoUSD,
      desvioPct: v.presupuestoOriginal ? ((v.presupuesto - v.presupuestoOriginal) / v.presupuestoOriginal) * 100 : 0,
      desvioPctUSD: v.presupuestoOriginalUSD ? ((v.presupuestoUSD - v.presupuestoOriginalUSD) / v.presupuestoOriginalUSD) * 100 : 0,
      shareProm: v.shareCount ? v.shareSum / v.shareCount : 0,
      sharePromUSD: v.shareCount ? v.shareSumUSD / v.shareCount : 0,
    })).sort((a, b) => b.value - a.value);
  }, [rows]);

  const totalGeneral = totalesPorProveedor.reduce((s, p) => s + p.value, 0);
  const totalGeneralUSD = totalesPorProveedor.reduce((s, p) => s + p.valueUSD, 0);

  const proveedoresConIndice = totalesPorProveedor.map((p, i) => ({ ...p, colorIndex: i }));
  const mitadProveedores = Math.ceil(proveedoresConIndice.length / 2);
  const proveedoresCol1 = proveedoresConIndice.slice(0, mitadProveedores);
  const proveedoresCol2 = proveedoresConIndice.slice(mitadProveedores);

  const sugerencias = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    if (!q) return [];
    const vistos = new Set();
    const out = [];
    totalesPorProveedor.forEach((p) => {
      if (p.name.toLowerCase().includes(q) && !vistos.has(p.name)) {
        vistos.add(p.name);
        out.push({ proveedor: p.name, contexto: null });
      }
    });
    rows.forEach((r) => {
      if (vistos.has(r.proveedor)) return;
      if (r.cliente.toLowerCase().includes(q) || r.obra.toLowerCase().includes(q)) {
        vistos.add(r.proveedor);
        out.push({ proveedor: r.proveedor, contexto: r.cliente + " · " + r.obra });
      }
    });
    return out.slice(0, 8);
  }, [buscar, totalesPorProveedor, rows]);

  const tableRows = (selectedProveedor ? rows.filter((r) => r.proveedor === selectedProveedor) : rows).filter((r) => {
    const q = buscar.trim().toLowerCase();
    if (!q) return true;
    return r.proveedor.toLowerCase().includes(q) || r.cliente.toLowerCase().includes(q);
  });
  const sortedRows = useMemo(() => {
    if (!sort) return tableRows;
    return [...tableRows].sort((a, b) => {
      let va = a[sort.key], vb = b[sort.key];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [tableRows, sort]);

  function onSort(key) {
    setSort((prev) => ({ key, dir: prev && prev.key === key && prev.dir === "asc" ? "desc" : "asc" }));
  }
  const localSortState = { table: sort };

  function exportProveedores() {
    const rowsOut = sortedRows.map((r) => ({
      Proveedor: r.proveedor, Cliente: r.cliente, "Centro de Costo": r.obra,
      Estado: r.status === "FINALIZADA" ? "Finalizada" : r.status === "EN PROCESO" ? "En proceso" : "",
      "Presupuesto Original": r.presupuestoOriginal, "Presupuesto Real": r.presupuesto,
      Pagado: r.pagado, Saldo: r.resta, "Desvío %": Number(r.desvioPct.toFixed(1)),
      "Share Obra %": Number(r.share.toFixed(1)),
    }));
    const ws = XLSX.utils.json_to_sheet(rowsOut);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Proveedores");
    descargarLibroXlsx(wb, "proveedores.xlsx");
  }

  // Descarga todos los pagos hechos a proveedores (obras "normales" + sub obras
  // de WU) para un año, ya sea completo o filtrado a un mes puntual.
  function exportPagosProveedores(anio, mesIdx) {
    const filas = [];
    Object.entries(pagosMap).forEach(([k, pagos]) => {
      const [cliente, obra] = k.split("|");
      (pagos || []).forEach((pg) => {
        const parsed = parseFechaMesAnio(pg.fecha);
        if (!parsed || parsed.anio !== anio) return;
        if (mesIdx !== null && parsed.mesIdx !== mesIdx) return;
        filas.push({
          Cliente: cliente, "Centro de Costo": obra, "Sub Obra": "", Proveedor: pg.proveedor,
          Importe: pg.monto, Factura: pg.fc, Fecha: pg.fecha, Observaciones: pg.observaciones || "",
        });
      });
    });
    const sufijoSubCosto = "::subCosto::";
    Object.entries(subCostoPagosMap || {}).forEach(([subK, pagos]) => {
      const sepIdx = subK.indexOf(sufijoSubCosto);
      if (sepIdx < 0) return;
      const k = subK.slice(0, sepIdx);
      const subIdx = Number(subK.slice(sepIdx + sufijoSubCosto.length));
      const [cliente, obra] = k.split("|");
      const subNombre = ((costoSubobrasMap[k] || [])[subIdx] || {}).nombre || "";
      (pagos || []).forEach((pg) => {
        const parsed = parseFechaMesAnio(pg.fecha);
        if (!parsed || parsed.anio !== anio) return;
        if (mesIdx !== null && parsed.mesIdx !== mesIdx) return;
        filas.push({
          Cliente: cliente, "Centro de Costo": obra, "Sub Obra": subNombre, Proveedor: pg.proveedor,
          Importe: pg.monto, Factura: pg.fc, Fecha: pg.fecha, Observaciones: pg.observaciones || "",
        });
      });
    });
    filas.sort((a, b) => a.Cliente.localeCompare(b.Cliente) || a["Centro de Costo"].localeCompare(b["Centro de Costo"]));
    const ws = XLSX.utils.json_to_sheet(filas);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");
    const nombreMes = mesIdx === null ? "todo_el_anio" : MESES[mesIdx].toLowerCase();
    descargarLibroXlsx(wb, "pagos_proveedores_" + anio + "_" + nombreMes + ".xlsx");
  }

  const bulkImportPanel = !canEdit ? null : (
    <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "16px 20px", marginBottom: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Carga masiva de pagos</div>
      <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
        Subí un Excel con columnas Cliente, Centro de Costo, Proveedor, Importe, Factura, Fecha. Cada fila se suma a lo pagado del proveedor en la obra que corresponda (solo si ese proveedor ya está cargado ahí) y resta del saldo. La columna Sub Obra es opcional: solo aplica para WU (para cargar el pago dentro de esa sub obra de Costos); para el resto de los clientes dejala vacía y no afecta su carga.
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <label style={smallBtnPrimary}>
          <Upload size={13} style={{ verticalAlign: "-2px" }} /> Importar pagos (Excel)
          <input
            type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }}
            onChange={async (e) => {
              const file = e.target.files[0];
              if (!file) return;
              try {
                const buf = await file.arrayBuffer();
                const wb = XLSX.read(buf, { type: "array" });
                const sheet = wb.Sheets[wb.SheetNames[0]];
                const filas = XLSX.utils.sheet_to_json(sheet, { defval: null });
                const pickCol = (r, keys) => {
                  for (const key of Object.keys(r)) {
                    if (keys.includes(key.toString().trim().toLowerCase())) return r[key];
                  }
                  return null;
                };
                const parsedAll = filas.map((r) => {
                  const cliente = String(pickCol(r, ["cliente"]) || "").toUpperCase().trim();
                  const obra = String(pickCol(r, ["centro de costo", "obra"]) || "").toUpperCase().trim();
                  const proveedor = String(pickCol(r, ["proveedor"]) || "").toUpperCase().trim();
                  const importe = Number(pickCol(r, ["importe", "monto"])) || 0;
                  let fecha = pickCol(r, ["fecha"]);
                  if (typeof fecha === "number" && XLSX.SSF) {
                    const d = XLSX.SSF.parse_date_code(fecha);
                    fecha = d ? String(d.d).padStart(2, "0") + "/" + String(d.m).padStart(2, "0") + "/" + d.y : String(fecha);
                  }
                  const factura = String(pickCol(r, ["factura", "n° factura", "nro factura", "fc"]) ?? "—");
                  const subObra = String(pickCol(r, ["sub obra", "sub-obra", "subobra"]) || "").toUpperCase().trim();
                  const observaciones = String(pickCol(r, ["observaciones"]) || "");
                  return { cliente, obra, proveedor, importe, fecha: fecha ? String(fecha) : "—", factura, subObra, observaciones };
                });
                const invalidas = parsedAll
                  .filter((r) => !(r.cliente && r.obra && r.proveedor && r.importe))
                  .map((r) => ({ ...r, motivo: "Faltan datos obligatorios (Cliente, Centro de Costo, Proveedor o Importe)" }));
                const paraEnviar = parsedAll.filter((r) => r.cliente && r.obra && r.proveedor && r.importe);
                const result = onImportPagos(paraEnviar);
                const todosFallidos = [...invalidas, ...result.fallidos];
                setImportMsg(
                  result.aplicadosCount + " pago(s) aplicados" +
                  (todosFallidos.length > 0 ? ", " + todosFallidos.length + " para revisar" : "")
                );
                if (todosFallidos.length > 0) {
                  setPagosFallidos(todosFallidos);
                  setShowFallidosModal(true);
                }
              } catch (err) { setImportMsg("No se pudo leer el archivo."); }
              e.target.value = "";
            }}
          />
        </label>
        <button
          onClick={() => {
            const ws = XLSX.utils.aoa_to_sheet([
              ["Cliente", "Centro de Costo", "Proveedor", "Importe", "Factura", "Fecha", "Sub Obra", "Observaciones"],
              ["PANDORA", "UNICENTER", "CASAS", 100000, "1234", "07/09/2026", "", ""],
              ["WU", "WU CIVIL WORK", "CASAS", 100000, "1234", "07/09/2026", "PLAZA ITALIAS", ""],
            ]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Pagos");
            descargarLibroXlsx(wb, "plantilla_pagos.xlsx");
          }}
          style={{ ...smallBtnGhost, color: MUTED }}
        >
          Plantilla de ejemplo
        </button>
        <button onClick={() => setShowDescargarPagos((v) => !v)} style={{ ...smallBtnGhost, color: MUTED }}>
          <Download size={13} style={{ verticalAlign: "-2px" }} /> Descargar pagos a proveedores
        </button>
      </div>
      {showDescargarPagos && (
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", marginTop: 10, padding: 10, background: BG, borderRadius: 8 }}>
          <div>
            <label style={labelStyle}>Año</label>
            <select style={selectStyle} value={pagosAnio} onChange={(e) => setPagosAnio(Number(e.target.value))}>
              {aniosConPagos.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Período</label>
            <select style={selectStyle} value={pagosMes} onChange={(e) => setPagosMes(e.target.value)}>
              <option value="TODO">Total año</option>
              {MESES.map((m, i) => <option key={m} value={i}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
            </select>
          </div>
          <button
            onClick={() => { exportPagosProveedores(pagosAnio, pagosMes === "TODO" ? null : Number(pagosMes)); setShowDescargarPagos(false); }}
            style={smallBtnPrimary}
          >
            <Download size={13} style={{ verticalAlign: "-2px" }} /> Descargar
          </button>
        </div>
      )}
      {importMsg && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
          <div style={{ fontSize: 11.5, color: MUTED }}>{importMsg}</div>
          {pagosFallidos.length > 0 && (
            <button onClick={() => setShowFallidosModal(true)} style={{ ...smallBtnGhost, color: RED, padding: "4px 10px", fontSize: 11 }}>
              Revisar {pagosFallidos.length} pendiente{pagosFallidos.length === 1 ? "" : "s"}
            </button>
          )}
        </div>
      )}
    </div>
  );

  const fallidosModal = showFallidosModal && (
    <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,20,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 70 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: "82%", maxWidth: 980, height: "82%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid " + BORDER }}>
          <div style={{ fontWeight: 700, color: NAVY, fontSize: 14 }}>
            Pagos para revisar {pagosFallidos.length > 0 ? "(" + pagosFallidos.length + ")" : ""}
          </div>
          <button onClick={() => setShowFallidosModal(false)} style={{ border: "none", background: "none", cursor: "pointer", color: MUTED }}><X size={18} /></button>
        </div>
        <div style={{ padding: "10px 18px", fontSize: 12, color: MUTED, borderBottom: "1px solid " + BORDER }}>
          Estas filas no se pudieron cargar. Corregí los datos y apretá "Reintentar" para cada una, o "Descartar" si no la vas a cargar.
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          {pagosFallidos.length === 0 && (
            <div style={{ fontSize: 13, color: MUTED, textAlign: "center", marginTop: 20 }}>No quedan pagos pendientes de revisión.</div>
          )}
          {pagosFallidos.map((r, idx) => {
            const clienteNorm = (r.cliente || "").trim().toUpperCase();
            const obrasDelCliente = clienteNorm ? obras.filter((o) => (o.cliente || "").trim().toUpperCase() === clienteNorm) : [];
            const obraValida = obrasDelCliente.some((o) => o.obra === r.obra);
            const destKey = obraKey(r.cliente, r.obra);
            const subObraNorm = (r.subObra || "").trim().toUpperCase();
            let destinoValido = false;
            let provsDestino = [];
            if (obraValida) {
              if (subObraNorm) {
                const subCostos = costoSubobrasMap[destKey] || [];
                const subIdx = subCostos.findIndex((s) => (s.nombre || "").trim().toUpperCase() === subObraNorm);
                if (subIdx >= 0) {
                  destinoValido = true;
                  provsDestino = subCostoProveedoresMap[subCostoKey(destKey, subIdx)] || [];
                }
              } else {
                destinoValido = true;
                provsDestino = proveedoresMap[destKey] || [];
              }
            }
            const proveedorNorm = (r.proveedor || "").trim().toUpperCase();
            const proveedorExiste = proveedorNorm && provsDestino.some((p) => p.proveedor === proveedorNorm);
            const mostrarCrearProveedor = destinoValido && proveedorNorm && !proveedorExiste;
            return (
            <div key={idx} style={{ border: "1px solid " + BORDER, borderRadius: 10, padding: 14, background: "#F9F8F5" }}>
              <div style={{ fontSize: 11.5, color: RED, fontWeight: 600, marginBottom: 10 }}>{r.motivo}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.2fr 1.2fr 0.9fr 0.8fr 0.8fr 1fr", columnGap: 8, rowGap: 4, fontSize: 11.5 }}>
                <div style={{ color: MUTED }}>Cliente</div>
                <div style={{ color: MUTED }}>Centro de Costo</div>
                <div style={{ color: MUTED }}>Proveedor</div>
                <div style={{ color: MUTED }}>Importe</div>
                <div style={{ color: MUTED }}>Factura</div>
                <div style={{ color: MUTED }}>Fecha</div>
                <div style={{ color: MUTED }}>Sub Obra</div>
                <input value={r.cliente} onChange={(e) => updateFallidoField(idx, "cliente", e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" }} />
                <select value={obraValida ? r.obra : ""} onChange={(e) => updateFallidoField(idx, "obra", e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" }}>
                  <option value="">{r.obra ? r.obra + " (no encontrada)" : "-- Elegir --"}</option>
                  {obrasDelCliente.map((o) => (
                    <option key={o.obra} value={o.obra}>{o.obra}</option>
                  ))}
                </select>
                <input value={r.proveedor} onChange={(e) => updateFallidoField(idx, "proveedor", e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" }} />
                <input type="number" value={r.importe} onChange={(e) => updateFallidoField(idx, "importe", e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" }} />
                <input value={r.factura} onChange={(e) => updateFallidoField(idx, "factura", e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" }} />
                <input value={r.fecha} onChange={(e) => updateFallidoField(idx, "fecha", e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" }} />
                <input value={r.subObra} onChange={(e) => updateFallidoField(idx, "subObra", e.target.value)} placeholder="(opcional)" style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: "100%", boxSizing: "border-box" }} />
              </div>
              {mostrarCrearProveedor && (
                <div style={{ marginTop: 8, padding: 8, background: "#FBF3DC", border: "1px solid " + GOLD, borderRadius: 8, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 11, color: NAVY, fontWeight: 600 }}>"{r.proveedor}" no está cargado ahí — se creará al reintentar:</div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <label style={{ fontSize: 10.5, color: MUTED }}>Presup. original</label>
                    <input type="number" value={r.presupuestoOriginal || ""} onChange={(e) => updateFallidoField(idx, "presupuestoOriginal", e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: 110 }} />
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <label style={{ fontSize: 10.5, color: MUTED }}>Presup. real</label>
                    <input type="number" value={r.presupuestoReal || ""} onChange={(e) => updateFallidoField(idx, "presupuestoReal", e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: "5px 7px", width: 110 }} />
                  </div>
                </div>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 10 }}>
                <button onClick={() => descartarFallido(idx)} style={{ ...smallBtnGhost, color: MUTED }}>Descartar</button>
                <button onClick={() => reintentarFallido(idx)} style={smallBtnPrimary}>Reintentar</button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  if (rows.length === 0) {
    return (
      <div style={{ padding: "22px 28px" }}>
        {bulkImportPanel}
        {fallidosModal}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: 24, fontSize: 13, color: MUTED }}>
          Todavía no cargaste proveedores en ninguna obra.
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "22px 28px" }}>
      {bulkImportPanel}
      {fallidosModal}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "18px 20px", marginBottom: 16, display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ width: 260, height: 240, flexShrink: 0 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={totalesPorProveedor} dataKey={monedaState.moneda === "USD" ? "valueUSD" : "value"} nameKey="name" cx="50%" cy="50%" outerRadius={90}
                onClick={(d) => toggleProveedor(d.name)}
                style={{ cursor: "pointer" }}
              >
                {totalesPorProveedor.map((p, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                    opacity={!hovered || hovered === p.name ? 1 : 0.3} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => monedaState.moneda === "USD" ? fmtUsdRaw(v) : fmt(v)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, color: MUTED, marginBottom: 8, letterSpacing: 0.3 }}>
            PARTICIPACIÓN COSTOS ACUMULADO TOTAL OBRAS MZ / SHARE ACUMULADO EN SUS OBRAS
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: 12.5, maxHeight: 160, overflowY: "auto" }}>
            {[proveedoresCol1, proveedoresCol2].map((col, ci) => (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
                {col.map((p) => {
                  const active = selectedProveedores.includes(p.name);
                  const valorSel = valSmart(p.value, p.valueUSD);
                  const totalSel = valSmart(totalGeneral, totalGeneralUSD);
                  const shareProm = valSmart(p.shareProm, p.sharePromUSD);
                  const desvioPct = valSmart(p.desvioPct, p.desvioPctUSD);
                  return (
                    <div
                      key={p.name}
                      onClick={() => toggleProveedor(p.name)}
                      onMouseEnter={() => setHovered(p.name)}
                      onMouseLeave={() => setHovered(null)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7, cursor: "pointer",
                        padding: "3px 6px", borderRadius: 6, background: active ? "#F1E9D2" : "transparent",
                      }}
                    >
                      <span style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[p.colorIndex % PIE_COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontWeight: active ? 700 : 600, color: active ? NAVY : TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                      <span style={{ color: MUTED }}>{(totalSel ? (valorSel / totalSel) * 100 : 0).toFixed(0)}%</span>
                      <span style={{ color: MUTED, fontSize: 11 }} title="Promedio de la participación de este proveedor en el costo de cada obra/sub obra en la que trabajó">
                        · share prom. {shareProm.toFixed(1)}%
                      </span>
                      <span style={{ color: desvioPct > 0 ? RED : desvioPct < 0 ? GREEN : MUTED, fontWeight: 600, fontSize: 11 }}>
                        · desvío {desvioPct >= 0 ? "+" : ""}{desvioPct.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: MUTED, marginTop: 10 }}>Click en un proveedor para ver en qué obras trabajó. Podés seleccionar más de uno para compararlos.</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "16px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Corregir nombre de un proveedor</div>
        <div style={{ fontSize: 12, color: MUTED, marginBottom: 10 }}>
          Si un proveedor quedó cargado con un nombre distinto por error (ej. "Victoriata" en vez de "Victoria"), corregilo acá: se va a consolidar automáticamente con el nombre correcto en todas las obras.
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <select style={{ ...selectStyle, width: 220 }} value={renaming || ""} onChange={(e) => { setRenaming(e.target.value); setRenameValue(""); }}>
            <option value="">Proveedor a corregir...</option>
            {totalesPorProveedor.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          </select>
          <span style={{ color: MUTED }}>→</span>
          <input placeholder="Nombre correcto" style={inputStyle} value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
          <button
            onClick={() => { if (renaming && renameValue) { onRename(renaming, renameValue); setRenaming(null); setRenameValue(""); setSelectedProveedores((prev) => prev.filter((n) => n !== renaming)); } }}
            style={smallBtnPrimary}
          >
            Consolidar
          </button>
        </div>
      </div>

      {selectedProveedores.length > 1 ? (
        <ProveedoresComparacion
          nombres={selectedProveedores}
          rows={rows}
          buscar={buscar}
          onQuitar={toggleProveedor}
          onLimpiar={() => setSelectedProveedores([])}
        />
      ) : (
      <>
      {selectedProveedor && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: NAVY }}>{selectedProveedor}</div>
          <button onClick={() => setSelectedProveedores([])} style={smallBtnGhost}>Ver todos los proveedores</button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <div style={{ position: "relative", width: 320 }}>
          <input
            placeholder="Buscar proveedor o cliente para seleccionar..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            onFocus={() => setBuscarFocus(true)}
            onBlur={() => setBuscarFocus(false)}
            style={{ ...inputStyle, width: "100%" }}
          />
          {buscarFocus && sugerencias.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20,
              background: "#fff", border: "1px solid " + BORDER, borderRadius: 8, boxShadow: CARD_SHADOW,
              maxHeight: 260, overflowY: "auto",
            }}>
              {sugerencias.map((s) => (
                <div
                  key={s.proveedor}
                  onMouseDown={(e) => { e.preventDefault(); toggleProveedor(s.proveedor); setBuscar(""); }}
                  style={{
                    padding: "8px 12px", cursor: "pointer", fontSize: 12.5,
                    borderBottom: "1px solid " + BORDER,
                    background: selectedProveedores.includes(s.proveedor) ? "#F1E9D2" : "#fff",
                  }}
                  onMouseEnter={(e) => { if (!selectedProveedores.includes(s.proveedor)) e.currentTarget.style.background = "#F5F4F0"; }}
                  onMouseLeave={(e) => { if (!selectedProveedores.includes(s.proveedor)) e.currentTarget.style.background = "#fff"; }}
                >
                  <div style={{ fontWeight: 600, color: NAVY }}>
                    {s.proveedor}{selectedProveedores.includes(s.proveedor) ? " ✓" : ""}
                  </div>
                  {s.contexto && <div style={{ color: MUTED, fontSize: 11 }}>{s.contexto}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={exportProveedores} style={smallBtnGhost}><Download size={13} /> Descargar proveedores</button>
      </div>

      {selectedProveedor ? (
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.5fr 1.1fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1.1fr 0.9fr", columnGap: 10,
          padding: "10px 16px", fontSize: 11, fontWeight: 700, background: "#EFEDE7", borderBottom: "1px solid " + BORDER,
        }}>
          <SortHeader label="PROVEEDOR" tableId="table" sortKey="proveedor" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="CLIENTE" tableId="table" sortKey="cliente" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="OBRA" tableId="table" sortKey="obra" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="ESTADO" tableId="table" sortKey="status" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="PRESUPUESTO ORIGINAL" tableId="table" sortKey="presupuestoOriginal" sortState={localSortState} onSort={(_, k) => onSort(k)} align="right" />
          <SortHeader label="PRESUPUESTO REAL" tableId="table" sortKey="presupuesto" sortState={localSortState} onSort={(_, k) => onSort(k)} align="right" />
          <SortHeader label="PAGADO" tableId="table" sortKey="pagado" sortState={localSortState} onSort={(_, k) => onSort(k)} align="right" />
          <SortHeader label="SALDO" tableId="table" sortKey="resta" sortState={localSortState} onSort={(_, k) => onSort(k)} align="right" />
          <SortHeader label="DESVÍO" tableId="table" sortKey="desvioPct" sortState={localSortState} onSort={(_, k) => onSort(k)} align="right" />
          <SortHeader label="SHARE OBRA" tableId="table" sortKey="share" sortState={localSortState} onSort={(_, k) => onSort(k)} align="right" />
        </div>
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {sortedRows.map((r, i) => {
            const desvioPctSel = valSmart(r.desvioPct, r.desvioPctUSD);
            const shareSel = valSmart(r.share, r.shareUSD);
            return (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "1.5fr 1.1fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1.1fr 0.9fr", columnGap: 10,
              padding: "9px 16px", fontSize: 12.5, alignItems: "center",
              background: i % 2 === 0 ? "#fff" : "#F5F4F0", borderBottom: "1px solid " + BORDER,
            }}>
              <div style={{ fontWeight: 600 }}>{r.proveedor}</div>
              <div>{r.cliente}</div>
              <div>{r.obra}</div>
              <div><StatusBadge status={r.status} /></div>
              <div style={{ textAlign: "right", color: MUTED }}>{fmtSmart(r.presupuestoOriginal, r.presupuestoOriginalUSD)}</div>
              <div style={{ textAlign: "right" }}>{fmtSmart(r.presupuesto, r.presupuestoUSD)}</div>
              <div style={{ textAlign: "right", color: GREEN }}>{fmtSmart(r.pagado, r.pagadoUSD)}</div>
              <div style={{ textAlign: "right", color: r.resta > 0 ? RED : MUTED, fontWeight: 600 }}>{fmtSmart(r.resta, r.restaUSD)}</div>
              <div style={{ textAlign: "right", color: r.desvio > 0 ? RED : r.desvio < 0 ? GREEN : MUTED, fontWeight: 600 }}>{desvioPctSel >= 0 ? "+" : ""}{desvioPctSel.toFixed(1)}%</div>
              <div style={{ textAlign: "right", color: MUTED }}>{shareSel.toFixed(1)}%</div>
            </div>
            );
          })}
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "1.5fr 1.1fr 1.3fr 1fr 1fr 1fr 1fr 1fr 1.1fr 0.9fr", columnGap: 10,
          padding: "10px 16px", fontSize: 12.5, fontWeight: 700, background: "#F1E9D2", borderTop: "1px solid " + BORDER,
        }}>
          <div style={{ color: NAVY }}>{"TOTAL " + selectedProveedor}</div>
          <div /><div /><div />
          <div style={{ textAlign: "right", color: MUTED }}>{fmtSmart(sortedRows.reduce((s, r) => s + r.presupuestoOriginal, 0), sortedRows.reduce((s, r) => s + r.presupuestoOriginalUSD, 0))}</div>
          <div style={{ textAlign: "right" }}>{fmtSmart(sortedRows.reduce((s, r) => s + r.presupuesto, 0), sortedRows.reduce((s, r) => s + r.presupuestoUSD, 0))}</div>
          <div style={{ textAlign: "right", color: GREEN }}>{fmtSmart(sortedRows.reduce((s, r) => s + r.pagado, 0), sortedRows.reduce((s, r) => s + r.pagadoUSD, 0))}</div>
          <div style={{ textAlign: "right", color: RED }}>{fmtSmart(sortedRows.reduce((s, r) => s + r.resta, 0), sortedRows.reduce((s, r) => s + r.restaUSD, 0))}</div>
          <div style={{ textAlign: "right", color: NAVY }}>
            {(() => {
              const origTot = sortedRows.reduce((s, r) => s + r.presupuestoOriginal, 0);
              const desvTot = sortedRows.reduce((s, r) => s + r.desvio, 0);
              const origTotUSD = sortedRows.reduce((s, r) => s + r.presupuestoOriginalUSD, 0);
              const desvTotUSD = sortedRows.reduce((s, r) => s + r.desvioUSD, 0);
              const pct = origTot ? (desvTot / origTot) * 100 : 0;
              const pctUSD = origTotUSD ? (desvTotUSD / origTotUSD) * 100 : 0;
              const pctSel = valSmart(pct, pctUSD);
              return (pctSel >= 0 ? "+" : "") + pctSel.toFixed(1) + "%";
            })()}
          </div>
          <div style={{ textAlign: "right", color: NAVY }}>
            {(() => {
              const prom = sortedRows.length ? sortedRows.reduce((s, r) => s + r.share, 0) / sortedRows.length : 0;
              const promUSD = sortedRows.length ? sortedRows.reduce((s, r) => s + r.shareUSD, 0) / sortedRows.length : 0;
              return valSmart(prom, promUSD).toFixed(1);
            })()}% prom.
          </div>
        </div>
      </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: 24, fontSize: 13, color: MUTED, textAlign: "center" }}>
          Seleccioná un proveedor en el gráfico para ver el detalle de sus obras, o más de uno para compararlos.
        </div>
      )}
      </>
      )}
    </div>
  );
}

function CashflowView({
  obras, facturas, proveedoresMap, pagosMap, canEdit,
  costoSubobrasMap, subCostoProveedoresMap, subCostoPagosMap,
  cfIngresosValores, setCfIngresosValores,
  cfEgresosCategorias, setCfEgresosCategorias,
  cfEgresosValores, setCfEgresosValores,
  cfSalidasValores, setCfSalidasValores,
  cfSaldoInicial, setCfSaldoInicial,
  cfSemanaInicio, setCfSemanaInicio,
  cfDiasPagoCliente, setCfDiasPagoCliente,
}) {
  const CANTIDAD_SEMANAS = 26;
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [calcMsg, setCalcMsg] = useState(null);
  const [ccExpandido, setCcExpandido] = useState({});
  const semanas = useMemo(() => generarSemanas(cfSemanaInicio, CANTIDAD_SEMANAS), [cfSemanaInicio]);

  const ingresosAdeudados = useMemo(() => facturas.filter((f) => f.status === "ADEUDA").map((f) => ({
    id: "f" + f.id, tipo: "Facturado (adeuda)", cliente: f.cliente, obra: f.obra,
    concepto: f.concepto || "FACTURA", nro: f.nro, fecha: f.fecha, importe: f.importe || 0,
  })), [facturas]);

  const ingresosPendientesFacturar = useMemo(() => {
    return obras.map((o) => {
      const facturado = facturas.filter((f) => f.cliente === o.cliente && f.obra === o.obra).reduce((s, f) => s + (f.importe || 0), 0);
      const pendiente = o.ventaFinal - facturado;
      return { o, pendiente };
    }).filter((x) => x.pendiente > 1).map(({ o, pendiente }) => ({
      id: "pf|" + o.cliente + "|" + o.obra, tipo: "Pendiente de facturar", cliente: o.cliente, obra: o.obra,
      concepto: "PENDIENTE DE FACTURAR", nro: null, fecha: null, importe: pendiente,
    }));
  }, [obras, facturas]);

  const ingresosTodos = useMemo(() => [...ingresosAdeudados, ...ingresosPendientesFacturar], [ingresosAdeudados, ingresosPendientesFacturar]);

  const clientesConIngreso = useMemo(() => Array.from(new Set(ingresosTodos.map((it) => it.cliente))).sort(), [ingresosTodos]);

  // Calcula automáticamente la semana de cada ítem SIN NADA todavía distribuido:
  // - Facturado y adeudado: fecha de emisión + días de pago del cliente (30 por defecto).
  // - Pendiente de facturar: se reparte en 3 partes iguales, a 30, 40 y 50 días desde hoy.
  // No pisa ítems que ya tengan algo cargado a mano.
  function calcularAutomatico() {
    const nuevosIngresos = { ...cfIngresosValores };
    let aplicados = 0;
    ingresosAdeudados.forEach((it) => {
      const yaDistribuido = Object.keys(cfIngresosValores).some((k) => k.indexOf(it.id + "|") === 0 && Number(cfIngresosValores[k]) > 0);
      if (yaDistribuido) return;
      const fechaEmision = fechaAObjetoDate(it.fecha);
      if (!fechaEmision) return;
      const dias = Number(cfDiasPagoCliente[it.cliente]) || 30;
      const objetivo = new Date(fechaEmision);
      objetivo.setDate(objetivo.getDate() + dias);
      const semana = dateAFechaStr(viernesDeLaSemana(objetivo));
      nuevosIngresos[it.id + "|" + semana] = it.importe;
      aplicados++;
    });
    ingresosPendientesFacturar.forEach((it) => {
      const yaDistribuido = Object.keys(cfIngresosValores).some((k) => k.indexOf(it.id + "|") === 0 && Number(cfIngresosValores[k]) > 0);
      if (yaDistribuido) return;
      const tercio = it.importe / 3;
      [30, 40, 50].forEach((dias) => {
        const objetivo = new Date();
        objetivo.setDate(objetivo.getDate() + dias);
        const semana = dateAFechaStr(viernesDeLaSemana(objetivo));
        nuevosIngresos[it.id + "|" + semana] = (Number(nuevosIngresos[it.id + "|" + semana]) || 0) + tercio;
      });
      aplicados++;
    });
    setCfIngresosValores(nuevosIngresos);
    setCalcMsg(aplicados + " ítem(s) completado(s) automáticamente (los que ya tenían algo cargado a mano no se tocaron).");
  }

  const salidasSemanales = useMemo(() => {
    const out = [];
    Object.entries(proveedoresMap).forEach(([k, provs]) => {
      const [cliente, obra] = k.split("|");
      const pagos = pagosMap[k] || [];
      provs.forEach((p) => {
        const pagado = pagos.filter((pg) => pg.proveedor === p.proveedor).reduce((s, pg) => s + pg.monto, 0);
        const saldo = (p.presupuesto || 0) - pagado;
        if (saldo > 1) out.push({ id: k + "|" + p.proveedor, ccId: "cc|" + k, cliente, obra, proveedor: p.proveedor, saldo });
      });
    });
    // Sub obras de Costos (solo WU): tienen su propia lista de proveedores,
    // separada de la de la obra general, así que sin este bloque nunca
    // aparecían en las salidas semanales del Cashflow.
    const sufijoSubCosto = "::subCosto::";
    Object.entries(subCostoProveedoresMap || {}).forEach(([subK, provs]) => {
      const sepIdx = subK.indexOf(sufijoSubCosto);
      if (sepIdx < 0) return;
      const k = subK.slice(0, sepIdx);
      const subIdx = Number(subK.slice(sepIdx + sufijoSubCosto.length));
      const [cliente, obraBase] = k.split("|");
      const subNombre = ((costoSubobrasMap[k] || [])[subIdx] || {}).nombre || "SUB OBRA";
      const obra = obraBase + " · " + subNombre;
      const pagos = (subCostoPagosMap || {})[subK] || [];
      provs.forEach((p) => {
        const pagado = pagos.filter((pg) => pg.proveedor === p.proveedor).reduce((s, pg) => s + pg.monto, 0);
        const saldo = (p.presupuesto || 0) - pagado;
        if (saldo > 1) out.push({ id: subK + "|" + p.proveedor, ccId: "cc|" + subK, cliente, obra, proveedor: p.proveedor, saldo });
      });
    });
    return out;
  }, [proveedoresMap, pagosMap, subCostoProveedoresMap, subCostoPagosMap, costoSubobrasMap]);

  const salidasPorCentroDeCosto = useMemo(() => {
    const map = {};
    salidasSemanales.forEach((it) => {
      if (!map[it.ccId]) map[it.ccId] = { ccId: it.ccId, cliente: it.cliente, obra: it.obra, saldo: 0, proveedores: [] };
      map[it.ccId].saldo += it.saldo;
      map[it.ccId].proveedores.push(it);
    });
    return Object.values(map).sort((a, b) => b.saldo - a.saldo);
  }, [salidasSemanales]);

  const totalesPorSemana = useMemo(() => {
    return semanas.map((sem) => {
      const ingresos = ingresosTodos.reduce((s, it) => s + (Number(cfIngresosValores[it.id + "|" + sem]) || 0), 0);
      const egresosCat = cfEgresosCategorias.reduce((s, cat) => s + (Number(cfEgresosValores[cat + "|" + sem]) || 0), 0);
      const egresosSalidas = salidasPorCentroDeCosto.reduce((s, cc) => s + montoEfectivoCCSemana(cc, sem), 0);
      const egresos = egresosCat + egresosSalidas;
      return { semana: sem, ingresos, egresos, neto: ingresos - egresos };
    });
  }, [semanas, ingresosTodos, cfIngresosValores, cfEgresosCategorias, cfEgresosValores, salidasPorCentroDeCosto, cfSalidasValores]);

  const arrastre = useMemo(() => {
    let acc = cfSaldoInicial;
    return totalesPorSemana.map((t) => { acc += t.neto; return acc; });
  }, [totalesPorSemana, cfSaldoInicial]);

  function distribuidoDe(valoresMap, id) {
    let total = 0;
    Object.keys(valoresMap).forEach((key) => {
      if (key.indexOf(id + "|") === 0) total += Number(valoresMap[key]) || 0;
    });
    return total;
  }

  // Si en una semana cargaste el total del centro de costo Y además el monto
  // de un proveedor puntual, lo del proveedor se considera parte de ese total
  // (no se suma aparte). El monto "efectivo" de esa semana es el mayor entre
  // lo cargado a nivel centro de costo y la suma de lo cargado por proveedor.
  function montoEfectivoCCSemana(cc, sem) {
    const ccVal = Number(cfSalidasValores[cc.ccId + "|" + sem]) || 0;
    const provVal = cc.proveedores.reduce((s, p) => s + (Number(cfSalidasValores[p.id + "|" + sem]) || 0), 0);
    return Math.max(ccVal, provVal);
  }

  function distribuidoEfectivoCC(cc) {
    const semanasConDatos = new Set();
    const prefijoCC = cc.ccId + "|";
    Object.keys(cfSalidasValores).forEach((key) => {
      if (key.indexOf(prefijoCC) === 0) semanasConDatos.add(key.slice(prefijoCC.length));
      cc.proveedores.forEach((p) => {
        const prefijoP = p.id + "|";
        if (key.indexOf(prefijoP) === 0) semanasConDatos.add(key.slice(prefijoP.length));
      });
    });
    let total = 0;
    semanasConDatos.forEach((sem) => { total += montoEfectivoCCSemana(cc, sem); });
    return total;
  }

  // Pegado estilo Excel: si copiás varias celdas (en fila, en columna, o un
  // bloque) y pegás a partir de una celda de la grilla, distribuye cada valor
  // en las celdas correspondientes (hacia la derecha = semanas siguientes,
  // hacia abajo = filas/ítems siguientes), igual que en una planilla.
  function manejarPegadoGrilla(e, filasObjetivo, obtenerId, semIdx, filaIdx, setValores) {
    const texto = (e.clipboardData || window.clipboardData).getData("text");
    if (!texto) return;
    e.preventDefault();
    const filas = texto.replace(/\r/g, "").split("\n").filter((linea, i, arr) => !(i === arr.length - 1 && linea === ""));
    const grilla = filas.map((f) => f.split("\t"));
    setValores((prev) => {
      const next = { ...prev };
      grilla.forEach((fila, rOffset) => {
        const objetivo = filasObjetivo[filaIdx + rOffset];
        if (!objetivo) return;
        const id = obtenerId(objetivo);
        fila.forEach((valorCrudo, cOffset) => {
          const sem = semanas[semIdx + cOffset];
          if (!sem) return;
          const limpio = valorCrudo.trim().replace(/\./g, "").replace(",", ".").replace(/[^0-9.\-]/g, "");
          if (limpio !== "") next[id + "|" + sem] = limpio;
        });
      });
      return next;
    });
  }

  return (
    <div style={{ padding: "22px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: NAVY }}>Cashflow semanal</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setCfSemanaInicio(moverSemanas(cfSemanaInicio, -CANTIDAD_SEMANAS))} style={smallBtnGhost}>« Semanas anteriores</button>
          <button onClick={() => setCfSemanaInicio(dateAFechaStr(viernesDeLaSemana(new Date())))} style={smallBtnGhost}>Hoy</button>
          <button onClick={() => setCfSemanaInicio(moverSemanas(cfSemanaInicio, CANTIDAD_SEMANAS))} style={smallBtnGhost}>Semanas siguientes »</button>
        </div>
      </div>

      {/* ===================== TÉRMINOS DE PAGO POR CLIENTE ===================== */}
      {canEdit && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "16px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Términos de pago por cliente</div>
          <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 10 }}>
            Días desde la emisión de la factura hasta que se cobra (default 30 si no lo cargás). "Calcular automáticamente" completa los ítems que todavía no tengan nada cargado a mano: lo Facturado y adeudado cae a esos días de la fecha de emisión; lo Pendiente de facturar se reparte en 3 partes iguales a 30, 40 y 50 días desde hoy.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "6px 16px", marginBottom: 12 }}>
            {clientesConIngreso.map((cliente) => (
              <div key={cliente} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{cliente}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <input
                    type="number" style={{ ...inputStyle, width: 60 }}
                    value={cfDiasPagoCliente[cliente] ?? ""}
                    placeholder="30"
                    onChange={(e) => setCfDiasPagoCliente((prev) => ({ ...prev, [cliente]: e.target.value }))}
                  />
                  <span style={{ fontSize: 11, color: MUTED }}>días</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={calcularAutomatico} style={smallBtnPrimary}>Calcular semanas automáticamente</button>
          {calcMsg && <div style={{ fontSize: 11.5, color: MUTED, marginTop: 8 }}>{calcMsg}</div>}
        </div>
      )}

      {/* ===================== INGRESOS ===================== */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "12px 18px", fontWeight: 700, color: NAVY, background: "#EFEDE7", fontSize: 13, letterSpacing: 0.3 }}>INGRESOS</div>
        {ingresosTodos.length === 0 ? (
          <div style={{ padding: 16, fontSize: 12.5, color: MUTED }}>No hay facturas adeudadas ni venta pendiente de facturar.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr repeat(" + semanas.length + ", 95px) 1fr", minWidth: 320 + semanas.length * 95 }}>
              <div style={{ padding: "8px 18px", fontSize: 11, fontWeight: 700, color: MUTED, borderBottom: "1px solid " + BORDER }}>CLIENTE / CENTRO DE COSTO / ORIGEN</div>
              <div style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "right", borderBottom: "1px solid " + BORDER }}>TOTAL</div>
              {semanas.map((s) => <div key={s} style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "center", borderBottom: "1px solid " + BORDER }}>{semanaLabelCorta(s)}</div>)}
              <div style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "right", borderBottom: "1px solid " + BORDER }}>RESTA</div>

              <div style={{ padding: "7px 18px", fontSize: 12.5, fontWeight: 700, color: NAVY, background: "#F1E9D2", borderBottom: "1px solid " + BORDER }}>TOTAL INGRESOS</div>
              <div style={{ padding: "7px 6px", fontSize: 12.5, fontWeight: 700, textAlign: "right", background: "#F1E9D2", borderBottom: "1px solid " + BORDER, fontVariantNumeric: "tabular-nums" }}>
                {fmt(ingresosTodos.reduce((s, it) => s + it.importe, 0))}
              </div>
              {semanas.map((s) => (
                <div key={s} style={{ padding: "7px 6px", fontSize: 12, fontWeight: 700, textAlign: "right", background: "#F1E9D2", borderBottom: "1px solid " + BORDER, color: GREEN }}>
                  {fmt(ingresosTodos.reduce((sum, it) => sum + (Number(cfIngresosValores[it.id + "|" + s]) || 0), 0))}
                </div>
              ))}
              <div style={{ padding: "7px 6px", fontSize: 12.5, fontWeight: 700, textAlign: "right", background: "#F1E9D2", borderBottom: "1px solid " + BORDER, color: GOLD }}>
                {fmt(ingresosTodos.reduce((s, it) => s + (it.importe - distribuidoDe(cfIngresosValores, it.id)), 0))}
              </div>

              {ingresosTodos.map((it, itemIdx) => {
                const distribuido = distribuidoDe(cfIngresosValores, it.id);
                const resta = it.importe - distribuido;
                return (
                  <React.Fragment key={it.id}>
                    <div style={{ padding: "6px 18px", fontSize: 12, borderBottom: "1px solid " + BORDER }}>
                      <div style={{ fontWeight: 600 }}>{it.cliente} · {it.obra}</div>
                      <div style={{ color: MUTED, fontSize: 11 }}>{it.tipo}{it.nro ? " · N° " + it.nro : ""}</div>
                    </div>
                    <div style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", borderBottom: "1px solid " + BORDER, fontVariantNumeric: "tabular-nums" }}>{fmt(it.importe)}</div>
                    {semanas.map((s, semIdx) => (
                      <div key={s} style={{ padding: "4px 6px", borderBottom: "1px solid " + BORDER }}>
                        {canEdit ? (
                          <input
                            type="text" inputMode="decimal" style={{ ...inputStyle, width: "100%", textAlign: "right", fontSize: 11.5 }}
                            value={cfIngresosValores[it.id + "|" + s] ?? ""}
                            onChange={(e) => setCfIngresosValores((prev) => ({ ...prev, [it.id + "|" + s]: e.target.value }))}
                            onPaste={(e) => manejarPegadoGrilla(e, ingresosTodos, (x) => x.id, semIdx, itemIdx, setCfIngresosValores)}
                          />
                        ) : (
                          <div style={{ textAlign: "right", fontSize: 12 }}>{fmt(Number(cfIngresosValores[it.id + "|" + s]) || 0)}</div>
                        )}
                      </div>
                    ))}
                    <div style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", borderBottom: "1px solid " + BORDER, color: resta > 0.5 ? GOLD : MUTED, fontWeight: 600 }}>{fmt(resta)}</div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ===================== EGRESOS ===================== */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden", marginBottom: 20 }}>
        <div style={{ padding: "12px 18px", fontWeight: 700, color: NAVY, background: "#EFEDE7", fontSize: 13, letterSpacing: 0.3 }}>EGRESOS</div>

        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(" + semanas.length + ", 95px) 1fr", minWidth: 280 + semanas.length * 95 }}>
            <div style={{ padding: "8px 18px", fontSize: 11, fontWeight: 700, color: MUTED, borderBottom: "1px solid " + BORDER }}>CATEGORÍA</div>
            {semanas.map((s) => <div key={s} style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "center", borderBottom: "1px solid " + BORDER }}>{semanaLabelCorta(s)}</div>)}
            <div style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "right", borderBottom: "1px solid " + BORDER }}>TOTAL</div>

            <div style={{ padding: "7px 18px", fontSize: 12.5, fontWeight: 700, color: NAVY, background: "#F1E9D2", borderBottom: "1px solid " + BORDER }}>TOTAL EGRESOS (CATEGORÍAS)</div>
            {semanas.map((s) => (
              <div key={s} style={{ padding: "7px 6px", fontSize: 12, fontWeight: 700, textAlign: "right", background: "#F1E9D2", borderBottom: "1px solid " + BORDER, color: RED }}>
                {fmt(cfEgresosCategorias.reduce((sum, cat) => sum + (Number(cfEgresosValores[cat + "|" + s]) || 0), 0))}
              </div>
            ))}
            <div style={{ padding: "7px 6px", fontSize: 12.5, fontWeight: 700, textAlign: "right", background: "#F1E9D2", borderBottom: "1px solid " + BORDER }}>
              {fmt(cfEgresosCategorias.reduce((s, cat) => s + distribuidoDe(cfEgresosValores, cat), 0))}
            </div>

            {cfEgresosCategorias.map((cat, catIdx) => (
              <React.Fragment key={cat}>
                <div style={{ padding: "6px 18px", fontSize: 12.5, borderBottom: "1px solid " + BORDER, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{cat}</span>
                  {canEdit && <button onClick={() => setCfEgresosCategorias((prev) => prev.filter((c) => c !== cat))} style={{ border: "none", background: "none", cursor: "pointer", color: RED }}><Trash2 size={11} /></button>}
                </div>
                {semanas.map((s, semIdx) => (
                  <div key={s} style={{ padding: "4px 6px", borderBottom: "1px solid " + BORDER }}>
                    {canEdit ? (
                      <input
                        type="text" inputMode="decimal" style={{ ...inputStyle, width: "100%", textAlign: "right", fontSize: 11.5 }}
                        value={cfEgresosValores[cat + "|" + s] ?? ""}
                        onChange={(e) => setCfEgresosValores((prev) => ({ ...prev, [cat + "|" + s]: e.target.value }))}
                        onPaste={(e) => manejarPegadoGrilla(e, cfEgresosCategorias, (c) => c, semIdx, catIdx, setCfEgresosValores)}
                      />
                    ) : (
                      <div style={{ textAlign: "right", fontSize: 12 }}>{fmt(Number(cfEgresosValores[cat + "|" + s]) || 0)}</div>
                    )}
                  </div>
                ))}
                <div style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", borderBottom: "1px solid " + BORDER, fontWeight: 600, color: MUTED }}>
                  {fmt(distribuidoDe(cfEgresosValores, cat))}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {canEdit && (
          <div style={{ display: "flex", gap: 8, padding: "10px 18px", alignItems: "center" }}>
            <input placeholder="Nueva categoría" style={inputStyle} value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} />
            <button onClick={() => { if (nuevaCategoria.trim()) { setCfEgresosCategorias((prev) => [...prev, nuevaCategoria.trim().toUpperCase()]); setNuevaCategoria(""); } }} style={smallBtnGhost}><Plus size={13} /> Agregar categoría</button>
          </div>
        )}

        <div style={{ padding: "12px 18px", fontWeight: 700, color: NAVY, fontSize: 12.5, borderTop: "1px solid " + BORDER, marginTop: 4 }}>SALIDAS SEMANALES (pagos a proveedores pendientes)</div>
        {salidasSemanales.length === 0 ? (
          <div style={{ padding: 16, fontSize: 12.5, color: MUTED }}>No hay pagos a proveedores pendientes.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr repeat(" + semanas.length + ", 95px) 1fr", minWidth: 320 + semanas.length * 95 }}>
              <div style={{ padding: "8px 18px", fontSize: 11, fontWeight: 700, color: MUTED, borderBottom: "1px solid " + BORDER }}>CENTRO DE COSTO / PROVEEDOR</div>
              <div style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "right", borderBottom: "1px solid " + BORDER }}>SALDO</div>
              {semanas.map((s) => <div key={s} style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "center", borderBottom: "1px solid " + BORDER }}>{semanaLabelCorta(s)}</div>)}
              <div style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "right", borderBottom: "1px solid " + BORDER }}>RESTA</div>

              <div style={{ padding: "7px 18px", fontSize: 12.5, fontWeight: 700, color: NAVY, background: "#F1E9D2", borderBottom: "1px solid " + BORDER }}>TOTAL SALIDAS SEMANALES</div>
              <div style={{ padding: "7px 6px", fontSize: 12.5, fontWeight: 700, textAlign: "right", background: "#F1E9D2", borderBottom: "1px solid " + BORDER, color: RED, fontVariantNumeric: "tabular-nums" }}>
                {fmt(salidasSemanales.reduce((s, it) => s + it.saldo, 0))}
              </div>
              {semanas.map((s) => (
                <div key={s} style={{ padding: "7px 6px", fontSize: 12, fontWeight: 700, textAlign: "right", background: "#F1E9D2", borderBottom: "1px solid " + BORDER, color: RED }}>
                  {fmt(salidasPorCentroDeCosto.reduce((sum, cc) => sum + montoEfectivoCCSemana(cc, s), 0))}
                </div>
              ))}
              <div style={{ padding: "7px 6px", fontSize: 12.5, fontWeight: 700, textAlign: "right", background: "#F1E9D2", borderBottom: "1px solid " + BORDER, color: GOLD }}>
                {fmt(salidasPorCentroDeCosto.reduce((s, cc) => s + (cc.saldo - distribuidoEfectivoCC(cc)), 0))}
              </div>

              {salidasPorCentroDeCosto.map((cc, ccIdx) => {
                const restaCC = cc.saldo - distribuidoEfectivoCC(cc);
                const abierto = !!ccExpandido[cc.ccId];
                return (
                  <React.Fragment key={cc.ccId}>
                    <div
                      onClick={() => setCcExpandido((prev) => ({ ...prev, [cc.ccId]: !prev[cc.ccId] }))}
                      style={{ padding: "7px 18px", fontSize: 12.5, borderBottom: "1px solid " + BORDER, fontWeight: 700, color: NAVY, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, background: "#FAFAF7" }}
                    >
                      <span style={{ display: "inline-block", transform: abierto ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", fontSize: 10 }}>▶</span>
                      {cc.cliente} · {cc.obra}
                    </div>
                    <div style={{ padding: "7px 6px", fontSize: 12.5, textAlign: "right", borderBottom: "1px solid " + BORDER, color: RED, fontWeight: 700, background: "#FAFAF7", fontVariantNumeric: "tabular-nums" }}>{fmt(cc.saldo)}</div>
                    {semanas.map((s, semIdx) => (
                      <div key={s} style={{ padding: "4px 6px", borderBottom: "1px solid " + BORDER, background: "#FAFAF7" }}>
                        {canEdit ? (
                          <input
                            type="text" inputMode="decimal" style={{ ...inputStyle, width: "100%", textAlign: "right", fontSize: 11.5, fontWeight: 700 }}
                            value={cfSalidasValores[cc.ccId + "|" + s] ?? ""}
                            onChange={(e) => setCfSalidasValores((prev) => ({ ...prev, [cc.ccId + "|" + s]: e.target.value }))}
                            onPaste={(e) => manejarPegadoGrilla(e, salidasPorCentroDeCosto, (x) => x.ccId, semIdx, ccIdx, setCfSalidasValores)}
                          />
                        ) : (
                          <div style={{ textAlign: "right", fontSize: 12, fontWeight: 700 }}>{fmt(Number(cfSalidasValores[cc.ccId + "|" + s]) || 0)}</div>
                        )}
                      </div>
                    ))}
                    <div style={{ padding: "7px 6px", fontSize: 12.5, textAlign: "right", borderBottom: "1px solid " + BORDER, fontWeight: 700, background: "#FAFAF7", color: restaCC > 0.5 ? GOLD : MUTED }}>{fmt(restaCC)}</div>

                    {abierto && cc.proveedores.map((it, provIdx) => {
                      const distribuido = distribuidoDe(cfSalidasValores, it.id);
                      const resta = it.saldo - distribuido;
                      return (
                        <React.Fragment key={it.id}>
                          <div style={{ padding: "6px 18px 6px 34px", fontSize: 12, borderBottom: "1px solid " + BORDER, color: MUTED }}>{it.proveedor}</div>
                          <div style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", borderBottom: "1px solid " + BORDER, color: RED, fontVariantNumeric: "tabular-nums" }}>{fmt(it.saldo)}</div>
                          {semanas.map((s, semIdx) => (
                            <div key={s} style={{ padding: "4px 6px", borderBottom: "1px solid " + BORDER }}>
                              {canEdit ? (
                                <input
                                  type="text" inputMode="decimal" style={{ ...inputStyle, width: "100%", textAlign: "right", fontSize: 11.5 }}
                                  value={cfSalidasValores[it.id + "|" + s] ?? ""}
                                  onChange={(e) => setCfSalidasValores((prev) => ({ ...prev, [it.id + "|" + s]: e.target.value }))}
                                  onPaste={(e) => manejarPegadoGrilla(e, cc.proveedores, (x) => x.id, semIdx, provIdx, setCfSalidasValores)}
                                />
                              ) : (
                                <div style={{ textAlign: "right", fontSize: 12 }}>{fmt(Number(cfSalidasValores[it.id + "|" + s]) || 0)}</div>
                              )}
                            </div>
                          ))}
                          <div style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", borderBottom: "1px solid " + BORDER, color: resta > 0.5 ? GOLD : MUTED, fontWeight: 600 }}>{fmt(resta)}</div>
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ===================== CASH ===================== */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
        <div style={{ padding: "12px 18px", fontWeight: 700, color: NAVY, background: "#EFEDE7", fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", letterSpacing: 0.3 }}>
          <span>CASH</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, fontWeight: 400 }}>
            <span style={{ color: MUTED }}>Saldo inicial (antes de la primera semana visible):</span>
            {canEdit ? (
              <input type="number" style={{ ...inputStyle, width: 140 }} value={cfSaldoInicial} onChange={(e) => setCfSaldoInicial(Number(e.target.value) || 0)} />
            ) : <b>{fmt(cfSaldoInicial)}</b>}
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr repeat(" + semanas.length + ", 95px)", minWidth: 200 + semanas.length * 95 }}>
            <div style={{ padding: "8px 18px", borderBottom: "1px solid " + BORDER }} />
            {semanas.map((s) => <div key={s} style={{ padding: "8px 6px", fontSize: 11, fontWeight: 700, color: MUTED, textAlign: "center", borderBottom: "1px solid " + BORDER }}>Sem. {semanaLabelCorta(s)}</div>)}

            <div style={{ padding: "6px 18px", fontSize: 12.5, fontWeight: 600, borderBottom: "1px solid " + BORDER }}>Ingresos</div>
            {totalesPorSemana.map((t) => <div key={t.semana} style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", color: GREEN, borderBottom: "1px solid " + BORDER }}>{fmt(t.ingresos)}</div>)}

            <div style={{ padding: "6px 18px", fontSize: 12.5, fontWeight: 600, borderBottom: "1px solid " + BORDER }}>Egresos</div>
            {totalesPorSemana.map((t) => <div key={t.semana} style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", color: RED, borderBottom: "1px solid " + BORDER }}>{fmt(t.egresos)}</div>)}

            <div style={{ padding: "6px 18px", fontSize: 12.5, fontWeight: 700, color: NAVY, borderBottom: "1px solid " + BORDER }}>Neto semanal</div>
            {totalesPorSemana.map((t) => <div key={t.semana} style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", fontWeight: 700, color: t.neto >= 0 ? GREEN : RED, borderBottom: "1px solid " + BORDER }}>{fmt(t.neto)}</div>)}

            <div style={{ padding: "6px 18px", fontSize: 12.5, fontWeight: 700, background: "#F1E9D2" }}>Saldo acumulado</div>
            {arrastre.map((v, i) => <div key={i} style={{ padding: "6px 6px", fontSize: 12, textAlign: "right", fontWeight: 700, background: "#F1E9D2", color: v >= 0 ? NAVY : RED }}>{fmt(v)}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function FacturacionView({ facturas, obras, onViewPdf, onMarcarAnio, isAdmin, isComercial, onGoToObra }) {
  const [fCliente, setFCliente] = useState("TODOS");
  const [fEstado, setFEstado] = useState("TODOS");
  const [fAnio, setFAnio] = useState("TODOS");
  const [sort, setSort] = useState(null);
  const [showPendientes, setShowPendientes] = useState(false);
  const [buscar, setBuscar] = useState("");
  const [marcarMsg, setMarcarMsg] = useState(null);

  const clientesOpts = useMemo(() => ["TODOS", ...Array.from(new Set(facturas.map((f) => f.cliente))).sort()], [facturas]);
  const aniosOpts = useMemo(() => ["TODOS", ...Array.from(new Set(obras.map((o) => o.anio || new Date().getFullYear()))).sort()], [obras]);
  const obrasKeySet = useMemo(() => new Set(obras.map((o) => obraKey(o.cliente, o.obra))), [obras]);

  const obraYearMap = useMemo(() => {
    const map = {};
    obras.forEach((o) => { map[o.cliente + "|" + o.obra] = o.anio || new Date().getFullYear(); });
    return map;
  }, [obras]);

  const facturaAnio = (f) => obraYearMap[f.cliente + "|" + f.obra];

  const filtered = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    const rows = facturas.filter((f) =>
      (fCliente === "TODOS" || f.cliente === fCliente) &&
      (fEstado === "TODOS" || f.status === fEstado) &&
      (fAnio === "TODOS" || facturaAnio(f) === fAnio) &&
      (!q || f.cliente.toLowerCase().includes(q) || f.obra.toLowerCase().includes(q))
    );
    if (!sort) return rows;
    return [...rows].sort((a, b) => {
      let va = a[sort.key], vb = b[sort.key];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }, [facturas, fCliente, fEstado, fAnio, sort, obraYearMap, buscar]);

  function onSort(key) {
    setSort((prev) => ({ key, dir: prev && prev.key === key && prev.dir === "asc" ? "desc" : "asc" }));
  }
  const localSortState = { table: sort };

  function exportFacturas() {
    const rows = filtered.map((f) => ({
      Cliente: f.cliente, Obra: f.obra, Concepto: f.concepto || "",
      Tipo: f.tipo || "", "N°": f.nro || "", Emision: f.fecha,
      Estado: f.status, Importe: f.importe, Pago: f.fechaPago || "", Forma: f.forma || "",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Facturas");
    descargarLibroXlsx(wb, "facturas.xlsx");
  }

  const [regaliasMes, setRegaliasMes] = useState(new Date().getMonth());
  const [regaliasAnio, setRegaliasAnio] = useState(new Date().getFullYear());
  const [regaliasPicker, setRegaliasPicker] = useState(false);
  const regaliasAniosOpts = useMemo(() => {
    const set = new Set([new Date().getFullYear()]);
    facturas.forEach((f) => {
      const partes = String(f.fecha || "").split("/");
      if (partes.length === 3) {
        const anio = parseInt(partes[2], 10);
        if (!isNaN(anio)) set.add(anio);
      }
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [facturas]);
  function exportRegalias() {
    const rowsData = facturas.filter((f) => {
      const partes = String(f.fecha || "").split("/");
      if (partes.length !== 3) return false;
      return parseInt(partes[1], 10) - 1 === regaliasMes && parseInt(partes[2], 10) === regaliasAnio;
    });
    const header = ["CLIENTE", "OBRA", "CONCEPTO", "TIPO DE DOCUMENTO", "NRO FACTURA", "FECHA EMISION", "STATUS", "IMPORTE", "FECHA DE PAGO", "FORMA DE PAGO"];
    const aoa = rowsData.map((f) => [
      f.cliente, f.obra, f.concepto || "", f.tipo || "", f.nro || "", f.fecha, f.status, f.importe || 0, f.fechaPago || "", f.forma || "",
    ]);
    const totalFacturado = rowsData.reduce((s, f) => s + (f.importe || 0), 0);
    const regalias = totalFacturado * 0.01;
    const mesNombre = MESES[regaliasMes].charAt(0) + MESES[regaliasMes].slice(1).toLowerCase();
    const ws = XLSX.utils.aoa_to_sheet([
      header,
      ...aoa,
      [],
      ["TOTAL FACTURADO", "", "", "", "", "", "", totalFacturado],
      ["REGALIAS " + mesNombre.toUpperCase() + " " + regaliasAnio, "", "", "", "", "", "", regalias],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Regalias");
    descargarLibroXlsx(wb, "regalias_" + mesNombre.toLowerCase() + "_" + regaliasAnio + ".xlsx");
  }

  const obrasEnAlcance = useMemo(() => obras.filter((o) =>
    (fCliente === "TODOS" || o.cliente === fCliente) &&
    (fAnio === "TODOS" || (o.anio || new Date().getFullYear()) === fAnio)
  ), [obras, fCliente, fAnio]);

  const facturasEnAlcance = useMemo(() => facturas.filter((f) =>
    (fCliente === "TODOS" || f.cliente === fCliente) &&
    (fAnio === "TODOS" || facturaAnio(f) === fAnio)
  ), [facturas, fCliente, fAnio, obraYearMap]);

  const totals = useMemo(() => {
    const pagado = facturasEnAlcance.filter((f) => f.status === "PAGADA").reduce((s, f) => s + (f.importe || 0), 0);
    const adeuda = facturasEnAlcance.filter((f) => f.status === "ADEUDA").reduce((s, f) => s + (f.importe || 0), 0);
    const total = pagado + adeuda;
    const pagadoUSD = facturasEnAlcance.filter((f) => f.status === "PAGADA").reduce((s, f) => s + aUsd(f.importe, f.tc), 0);
    const adeudaUSD = facturasEnAlcance.filter((f) => f.status === "ADEUDA").reduce((s, f) => s + aUsd(f.importe, f.tc), 0);
    const totalUSD = pagadoUSD + adeudaUSD;
    const ventaTotal = obrasEnAlcance.reduce((s, o) => s + o.ventaFinal, 0);
    const ventaTotalUSD = obrasEnAlcance.reduce((s, o) => s + (o.ventaFinalUSD || 0), 0);
    const pendienteFacturar = ventaTotal - total;
    const pendienteFacturarUSD = ventaTotalUSD - totalUSD;
    return { pagado, adeuda, total, ventaTotal, pendienteFacturar, count: facturasEnAlcance.length, pagadoUSD, adeudaUSD, totalUSD, ventaTotalUSD, pendienteFacturarUSD };
  }, [facturasEnAlcance, obrasEnAlcance]);

  const porObraBreakdown = useMemo(() => {
    const map = new Map();
    const kOf = (cliente, obra) => obraKey(cliente, obra);
    obrasEnAlcance.forEach((o) => {
      const k = kOf(o.cliente, o.obra);
      if (!map.has(k)) map.set(k, { cliente: o.cliente, obra: o.obra, ventaTotal: 0, ventaTotalUSD: 0, facturado: 0, facturadoUSD: 0, pendienteCobro: 0, pendienteCobroUSD: 0 });
      map.get(k).ventaTotal += o.ventaFinal;
      map.get(k).ventaTotalUSD += (o.ventaFinalUSD || 0);
    });
    facturasEnAlcance.forEach((f) => {
      const k = kOf(f.cliente, f.obra);
      if (!map.has(k)) map.set(k, { cliente: f.cliente, obra: f.obra, ventaTotal: 0, ventaTotalUSD: 0, facturado: 0, facturadoUSD: 0, pendienteCobro: 0, pendienteCobroUSD: 0 });
      const row = map.get(k);
      const usd = aUsd(f.importe, f.tc);
      row.facturado += f.importe || 0;
      row.facturadoUSD += usd;
      if (f.status === "ADEUDA") { row.pendienteCobro += f.importe || 0; row.pendienteCobroUSD += usd; }
    });
    return Array.from(map.values())
      .map((row) => ({ ...row, pendienteFacturar: row.ventaTotal - row.facturado, pendienteFacturarUSD: row.ventaTotalUSD - row.facturadoUSD }))
      .sort((a, b) => b.ventaTotal - a.ventaTotal);
  }, [obrasEnAlcance, facturasEnAlcance]);

  function exportPendientesFacturar() {
    const rows = porObraBreakdown
      .filter((c) => Math.abs(c.pendienteFacturar) >= 1)
      .map((c) => ({
        Cliente: c.cliente, Obra: c.obra,
        "Venta Total (ARS)": c.ventaTotal, "Venta Total (USD)": Number(c.ventaTotalUSD.toFixed(2)),
        "Facturado (ARS)": c.facturado, "Facturado (USD)": Number(c.facturadoUSD.toFixed(2)),
        "Pendiente de Cobro (ARS)": c.pendienteCobro, "Pendiente de Cobro (USD)": Number(c.pendienteCobroUSD.toFixed(2)),
        "Pendiente de Facturar (ARS)": c.pendienteFacturar, "Pendiente de Facturar (USD)": Number(c.pendienteFacturarUSD.toFixed(2)),
      }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pendiente de facturar");
    descargarLibroXlsx(wb, "pendiente_de_facturar.xlsx");
  }

  return (
    <div style={{ padding: "22px 28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", columnGap: 14, gap: 14, marginBottom: 18 }}>
        <SummaryCard label="TOTAL FACTURADO" value={fmtSmart(totals.total, totals.totalUSD)} color={NAVY} />
        <SummaryCard label="COBRADO / PAGADO" value={fmtSmart(totals.pagado, totals.pagadoUSD)} color={GREEN} />
        <SummaryCard label="ADEUDADO" value={fmtSmart(totals.adeuda, totals.adeudaUSD)} color={RED} />
        <div onClick={() => setShowPendientes((v) => !v)} style={{ cursor: "pointer" }}>
          <SummaryCard label={"PENDIENTE POR FACTURAR " + (showPendientes ? "▲" : "▼")} value={fmtSmart(totals.pendienteFacturar, totals.pendienteFacturarUSD)} color={GOLD} />
        </div>
      </div>

      {showPendientes && (
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden", marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 16px", borderBottom: "1px solid " + BORDER }}>
            <button onClick={exportPendientesFacturar} style={smallBtnGhost}>
              <Download size={13} /> Descargar pendiente de facturar
            </button>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr 1fr 1.15fr 1.15fr", columnGap: 10,
            padding: "10px 16px", fontSize: 11, fontWeight: 700, background: "#EFEDE7", borderBottom: "1px solid " + BORDER,
          }}>
            <div>CLIENTE</div>
            <div>OBRA</div>
            <div style={{ textAlign: "right" }}>VENTA TOTAL</div>
            <div style={{ textAlign: "right" }}>FACTURADO</div>
            <div style={{ textAlign: "right" }}>PENDIENTE DE COBRO</div>
            <div style={{ textAlign: "right" }}>PENDIENTE DE FACTURAR</div>
          </div>
          {porObraBreakdown.filter((c) => Math.abs(c.pendienteFacturar) >= 1).map((c, i) => {
            const obraExisteP = obrasKeySet.has(obraKey(c.cliente, c.obra));
            return (
              <div
                key={obraKey(c.cliente, c.obra)}
                onClick={obraExisteP ? () => onGoToObra(c.cliente, c.obra) : undefined}
                title={obraExisteP ? "Ir a la obra " + c.obra + " (" + c.cliente + ")" : undefined}
                style={{
                  display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr 1fr 1.15fr 1.15fr", columnGap: 10,
                  padding: "9px 16px", fontSize: 12.5, alignItems: "center", cursor: obraExisteP ? "pointer" : "default",
                  background: i % 2 === 0 ? "#fff" : "#F5F4F0", borderBottom: "1px solid " + BORDER,
                }}
                onMouseEnter={(e) => { if (obraExisteP) e.currentTarget.style.background = "#EFEDE7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F5F4F0"; }}
              >
                <div style={{ fontWeight: 600, color: obraExisteP ? NAVY : TEXT, textDecoration: obraExisteP ? "underline" : "none", textDecorationColor: BORDER }}>{c.cliente}</div>
                <div style={{ color: MUTED }}>{c.obra}</div>
                <div style={{ textAlign: "right" }}>{fmtSmart(c.ventaTotal, c.ventaTotalUSD)}</div>
                <div style={{ textAlign: "right", color: GREEN }}>{fmtSmart(c.facturado, c.facturadoUSD)}</div>
                <div style={{ textAlign: "right", color: c.pendienteCobro > 0 ? RED : MUTED }}>{fmtSmart(c.pendienteCobro, c.pendienteCobroUSD)}</div>
                <div style={{ textAlign: "right", color: c.pendienteFacturar > 0 ? GOLD : MUTED, fontWeight: 600 }}>{fmtSmart(c.pendienteFacturar, c.pendienteFacturarUSD)}</div>
              </div>
            );
          })}
          {porObraBreakdown.filter((c) => Math.abs(c.pendienteFacturar) >= 1).length === 0 && (
            <div style={{ padding: 16, fontSize: 12.5, color: MUTED }}>No hay obras con venta pendiente de facturar.</div>
          )}
        </div>
      )}

      {(() => {
        const porCliente = {};
        facturasEnAlcance.filter((f) => f.status === "ADEUDA").forEach((f) => {
          porCliente[f.cliente] = (porCliente[f.cliente] || 0) + (f.importe || 0);
        });
        const data = Object.entries(porCliente).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        const totalAdeuda = data.reduce((s, d) => s + d.value, 0);
        if (data.length === 0) return null;
        return (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, padding: "14px 18px", marginBottom: 18, display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ width: 140, height: 130, flexShrink: 0 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55}
                    onClick={(d) => { if (fCliente === d.name && fEstado === "ADEUDA") { setFCliente("TODOS"); setFEstado("TODOS"); } else { setFCliente(d.name); setFEstado("ADEUDA"); } }}
                    style={{ cursor: "pointer" }}
                  >
                    {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmt(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: MUTED, marginBottom: 6, letterSpacing: 0.3 }}>PORCENTAJE FACTURADO Y PRÓXIMO A COBRAR DE CADA CLIENTE</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 10, gap: "3px 16px", fontSize: 11.5 }}>
                {data.map((c, i) => (
                  <div
                    key={c.name}
                    onClick={() => { if (fCliente === c.name && fEstado === "ADEUDA") { setFCliente("TODOS"); setFEstado("TODOS"); } else { setFCliente(c.name); setFEstado("ADEUDA"); } }}
                    style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", background: fCliente === c.name && fEstado === "ADEUDA" ? "#F1E9D2" : "transparent", borderRadius: 5, padding: "2px 4px" }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: MUTED }}>{((c.value / totalAdeuda) * 100).toFixed(0)}% · {fmt(c.value)}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: MUTED, marginTop: 6 }}>Click en un cliente para ver el detalle de lo que debe</div>
            </div>
          </div>
        );
      })()}

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <select value={fCliente} onChange={(e) => setFCliente(e.target.value)} style={selectStyle}>
          {clientesOpts.map((c) => <option key={c} value={c}>{c === "TODOS" ? "Todos los clientes" : c}</option>)}
        </select>
        <select value={fEstado} onChange={(e) => setFEstado(e.target.value)} style={selectStyle}>
          <option value="TODOS">Todos los estados</option>
          <option value="PAGADA">Pagada</option>
          <option value="ADEUDA">Adeuda</option>
        </select>
        <select value={fAnio} onChange={(e) => setFAnio(e.target.value === "TODOS" ? "TODOS" : Number(e.target.value))} style={selectStyle}>
          {aniosOpts.map((a) => <option key={a} value={a}>{a === "TODOS" ? "Todos los años" : a}</option>)}
        </select>
        {isAdmin && fAnio !== "TODOS" && (
          <button
            onClick={() => {
              setMarcarMsg("Procesando...");
              onMarcarAnio(fAnio).then((n) => {
                setMarcarMsg(n > 0 ? "Se completaron " + n + " obra(s) del " + fAnio + " a 100% facturado y cobrado." : "Las obras del " + fAnio + " ya estaban 100% facturadas.");
              });
            }}
            style={smallBtnGhost}
          >
            Marcar {fAnio} 100% facturado y cobrado
          </button>
        )}
        <input
          placeholder="Buscar por cliente o centro de costo..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          style={{ ...inputStyle, width: 260 }}
        />
        {(fCliente !== "TODOS" || fEstado !== "TODOS" || fAnio !== "TODOS" || buscar) && (
          <button
            onClick={() => { setFCliente("TODOS"); setFEstado("TODOS"); setFAnio("TODOS"); setBuscar(""); }}
            style={smallBtnGhost}
          >
            <X size={13} /> Ver todos
          </button>
        )}
        <div style={{ fontSize: 12.5, color: MUTED, alignSelf: "center", marginLeft: 4 }}>{filtered.length} facturas</div>
        {isComercial && (
          <div style={{ position: "relative", marginLeft: "auto" }}>
            <button onClick={() => setRegaliasPicker((v) => !v)} style={smallBtnGhost}>
              <Download size={13} /> Descargar regalías
            </button>
            {regaliasPicker && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 20,
                background: "#fff", border: "1px solid " + BORDER, borderRadius: 10, boxShadow: CARD_SHADOW,
                padding: 12, display: "flex", flexDirection: "column", gap: 8, width: 220,
              }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: NAVY }}>¿Facturas emitidas en qué mes?</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <select value={regaliasMes} onChange={(e) => setRegaliasMes(Number(e.target.value))} style={{ ...selectStyle, flex: 1.4 }}>
                    {MESES.map((m, i) => <option key={m} value={i}>{m.charAt(0) + m.slice(1).toLowerCase()}</option>)}
                  </select>
                  <select value={regaliasAnio} onChange={(e) => setRegaliasAnio(Number(e.target.value))} style={{ ...selectStyle, flex: 1 }}>
                    {regaliasAniosOpts.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  <button onClick={() => setRegaliasPicker(false)} style={{ ...smallBtnGhost, color: MUTED }}>Cancelar</button>
                  <button onClick={() => { exportRegalias(); setRegaliasPicker(false); }} style={smallBtnPrimary}>Descargar</button>
                </div>
              </div>
            )}
          </div>
        )}
        <button onClick={exportFacturas} style={{ ...smallBtnGhost, marginLeft: isComercial ? 8 : "auto" }}>
          <Download size={13} /> Descargar facturas
        </button>
      </div>
      {marcarMsg && <div style={{ fontSize: 11.5, color: MUTED, marginTop: -6, marginBottom: 14 }}>{marcarMsg}</div>}

      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid " + BORDER, boxShadow: CARD_SHADOW, overflow: "hidden" }}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1.6fr 0.7fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.6fr", columnGap: 10,
          padding: "10px 16px", fontSize: 11, fontWeight: 700, background: "#EFEDE7", borderBottom: "1px solid " + BORDER,
        }}>
          <SortHeader label="CLIENTE" tableId="table" sortKey="cliente" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="OBRA" tableId="table" sortKey="obra" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="CONCEPTO" tableId="table" sortKey="concepto" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="TIPO" tableId="table" sortKey="tipo" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="N°" tableId="table" sortKey="nro" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="EMISION" tableId="table" sortKey="fecha" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="ESTADO" tableId="table" sortKey="status" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="IMPORTE" tableId="table" sortKey="importe" sortState={localSortState} onSort={(_, k) => onSort(k)} align="right" />
          <SortHeader label="PAGO" tableId="table" sortKey="fechaPago" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <SortHeader label="FORMA" tableId="table" sortKey="forma" sortState={localSortState} onSort={(_, k) => onSort(k)} />
          <div style={{ textAlign: "center" }}>PDF</div>
        </div>
        <div style={{ maxHeight: 520, overflowY: "auto" }}>
          {filtered.map((f, i) => {
            const obraExiste = obrasKeySet.has(obraKey(f.cliente, f.obra));
            return (
            <div
              key={i}
              onClick={obraExiste ? () => onGoToObra(f.cliente, f.obra) : undefined}
              title={obraExiste ? "Ir a la obra " + f.obra + " (" + f.cliente + ")" : undefined}
              style={{
                display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1.6fr 0.7fr 0.8fr 0.9fr 1fr 1.1fr 0.9fr 1.2fr 0.6fr", columnGap: 10,
                padding: "8px 16px", fontSize: 12.5, alignItems: "center",
                background: i % 2 === 0 ? "#fff" : "#F5F4F0", borderBottom: "1px solid " + BORDER,
                cursor: obraExiste ? "pointer" : "default",
              }}
              onMouseEnter={(e) => { if (obraExiste) e.currentTarget.style.background = "#EFEDE7"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F5F4F0"; }}
            >
              <div style={{ fontWeight: 600, color: obraExiste ? NAVY : TEXT, textDecoration: obraExiste ? "underline" : "none", textDecorationColor: obraExiste ? BORDER : "transparent" }}>{f.cliente}</div>
              <div>{f.obra}</div>
              <div style={{ color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.concepto || "—"}</div>
              <div>{f.tipo || "—"}</div>
              <div>{f.nro || "—"}</div>
              <div>{f.fecha}</div>
              <div><StatusBadge status={f.status === "PAGADA" ? "FINALIZADA" : "EN PROCESO"} /></div>
              <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmt(f.importe, f.tc)}</div>
              <div style={{ color: MUTED }}>{f.fechaPago || "—"}</div>
              <div style={{ color: MUTED }}>{f.forma || "—"}</div>
              <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                {f.pdfData ? (
                  <>
                    <button onClick={(e) => { e.stopPropagation(); onViewPdf({ name: f.pdfName, data: dataUrlToBlobUrl(f.pdfData), rawData: f.pdfData }); }} title="Ver PDF" style={{ border: "none", background: "none", cursor: "pointer", color: NAVY }}><Eye size={13} /></button>
                    <button onClick={(e) => { e.stopPropagation(); ofrecerDescarga(f.pdfName || "factura.pdf", dataUrlToBlob(f.pdfData)); }} title="Descargar" style={{ border: "none", background: "none", cursor: "pointer", color: MUTED, display: "flex" }}><Download size={13} /></button>
                  </>
                ) : (
                  <span style={{ color: "#CCCFD9", fontSize: 11 }}>—</span>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
      <div style={{ fontSize: 11, color: MUTED, marginTop: 10, marginBottom: 20 }}>
        Los totales toman el campo Importe de cada comprobante (facturas y anticipos con monto propio cargado). "Pendiente por facturar" = Venta Total de las obras en alcance menos lo ya facturado.
      </div>

    </div>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div style={{ background: "#fff", border: "1px solid " + BORDER, borderRadius: 12, boxShadow: CARD_SHADOW, padding: "14px 18px" }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: MUTED, marginBottom: 7, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 700, color }}>{value}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
