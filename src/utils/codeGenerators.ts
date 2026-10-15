import { AppsScriptConfig } from '../types/coverage';

export function generateAppsscriptJson(): string {
  return JSON.stringify(
    {
      timeZone: 'America/Santiago',
      dependencies: {},
      webapp: {
        executeAs: 'USER_DEPLOYING',
        access: 'ANYONE'
      },
      exceptionLogging: 'STACKDRIVER',
      runtimeVersion: 'V8'
    },
    null,
    2
  );
}

export function generateCodeGs(config: AppsScriptConfig): string {
  let indexRebuildFunction = '';
  if (config.enableAtomicRebuild) {
    indexRebuildFunction = `/**
 * Reconstruye el índice de forma ATÓMICA:
 * Escribe primero en una pestaña temporal '_TEMP' y luego reemplaza la activa.
 * Esto evita dejar el validador sin resultados si ocurre un error o timeout a mitad de camino.
 */
function reconstruirIndice() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(CONFIG.LOCK_TIMEOUT_MS)) {
    throw new Error('Ya hay una reconstrucción en curso. Intenta más tarde.');
  }

  try {
    const fuente = SpreadsheetApp.openById(CONFIG.SOURCE_SPREADSHEET_ID);
    const hojaFuente = fuente.getSheetByName(CONFIG.SOURCE_SHEET_NAME);

    if (!hojaFuente) {
      throw new Error('No existe la pestaña fuente: ' + CONFIG.SOURCE_SHEET_NAME);
    }

    const ultimaFila = hojaFuente.getLastRow();
    const ultimaColumna = hojaFuente.getLastColumn();

    if (ultimaFila <= CONFIG.HEADER_ROW || ultimaColumna < 1) {
      throw new Error('La hoja fuente no contiene registros.');
    }

    const encabezados = hojaFuente
      .getRange(CONFIG.HEADER_ROW, 1, 1, ultimaColumna)
      .getDisplayValues()[0]
      .map(h => String(h).trim());

    const filas = [];
    const tamanoBloqueLectura = 5000;
    const primeraFilaDatos = CONFIG.HEADER_ROW + 1;

    for (let inicio = primeraFilaDatos; inicio <= ultimaFila; inicio += tamanoBloqueLectura) {
      const numeroFilas = Math.min(tamanoBloqueLectura, ultimaFila - inicio + 1);
      const bloque = hojaFuente.getRange(inicio, 1, numeroFilas, ultimaColumna).getDisplayValues();

      bloque.forEach(valores => {
        if (valores.every(v => String(v).trim() === '')) return;

        const registro = {};
        encabezados.forEach((encabezado, i) => {
          const nombre = encabezado || ('COLUMNA_' + (i + 1));
          registro[nombre] = valores[i] || '';
        });

        // Enlace directo a Google Maps por localidad, comuna y región
        const localidad = registro['LOCALIDAD'] || registro['localidad'] || registro['SECTOR'] || registro['sector'] || registro['Sector'] || '';
        const comuna = registro['COMUNA'] || registro['comuna'] || registro['Zona'] || '';
        const region = registro['REGIÓN'] || registro['region'] || registro['Region'] || '';
        const qMaps = [localidad, comuna, region, 'Chile'].filter(Boolean).join(', ');
        registro['LOCALIDAD'] = localidad || comuna;
        registro['GOOGLE_MAPS_URL'] = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(qMaps);

        const textoBusqueda = normalizar_(valores.join(' '));
        filas.push([textoBusqueda, JSON.stringify(registro)]);
      });
    }

    if (filas.length === 0) {
      throw new Error('No se encontraron filas con datos útiles para indexar.');
    }

    const destino = SpreadsheetApp.openById(CONFIG.INDEX_SPREADSHEET_ID);
    const nombreTemporal = CONFIG.INDEX_SHEET_NAME + '_TEMP';

    let hojaTemp = destino.getSheetByName(nombreTemporal);
    if (hojaTemp) {
      destino.deleteSheet(hojaTemp);
    }
    hojaTemp = destino.insertSheet(nombreTemporal);

    hojaTemp.getRange(1, 1, 1, INDEX_HEADERS.length).setValues([INDEX_HEADERS]);

    const tamanoBloqueEscritura = 2000;
    for (let i = 0; i < filas.length; i += tamanoBloqueEscritura) {
      const corte = filas.slice(i, i + tamanoBloqueEscritura);
      hojaTemp.getRange(hojaTemp.getLastRow() + 1, 1, corte.length, INDEX_HEADERS.length).setValues(corte);
    }

    const hojaActiva = destino.getSheetByName(CONFIG.INDEX_SHEET_NAME);
    if (hojaActiva) {
      destino.deleteSheet(hojaActiva);
    }
    hojaTemp.setName(CONFIG.INDEX_SHEET_NAME);

    return {
      ok: true,
      mensaje: 'Índice reconstruido con éxito.',
      totalRegistros: filas.length,
      fecha: new Date().toISOString()
    };
  } finally {
    lock.releaseLock();
  }
}`;
  } else {
    indexRebuildFunction = `/**
 * Reconstrucción directa del índice en la pestaña configurada.
 */
function reconstruirIndice() {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(CONFIG.LOCK_TIMEOUT_MS)) {
    throw new Error('Ya hay una reconstrucción en curso.');
  }

  try {
    const fuente = SpreadsheetApp.openById(CONFIG.SOURCE_SPREADSHEET_ID);
    const hojaFuente = fuente.getSheetByName(CONFIG.SOURCE_SHEET_NAME);
    const ultimaFila = hojaFuente.getLastRow();
    const ultimaColumna = hojaFuente.getLastColumn();

    const encabezados = hojaFuente.getRange(CONFIG.HEADER_ROW, 1, 1, ultimaColumna).getDisplayValues()[0];
    const datos = hojaFuente.getRange(CONFIG.HEADER_ROW + 1, 1, ultimaFila - CONFIG.HEADER_ROW, ultimaColumna).getDisplayValues();

    const filas = datos.map(valores => {
      const registro = {};
      encabezados.forEach((h, i) => { registro[h || ('COL_' + i)] = valores[i] || ''; });
      const localidad = registro['LOCALIDAD'] || registro['localidad'] || registro['SECTOR'] || registro['sector'] || registro['Sector'] || '';
      const comuna = registro['COMUNA'] || registro['comuna'] || '';
      const region = registro['REGIÓN'] || registro['region'] || '';
      const qMaps = [localidad, comuna, region, 'Chile'].filter(Boolean).join(', ');
      registro['LOCALIDAD'] = localidad || comuna;
      registro['GOOGLE_MAPS_URL'] = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(qMaps);
      return [normalizar_(valores.join(' ')), JSON.stringify(registro)];
    });

    const destino = SpreadsheetApp.openById(CONFIG.INDEX_SPREADSHEET_ID);
    let hoja = destino.getSheetByName(CONFIG.INDEX_SHEET_NAME);
    if (!hoja) hoja = destino.insertSheet(CONFIG.INDEX_SHEET_NAME);
    hoja.clearContents();
    hoja.getRange(1, 1, 1, INDEX_HEADERS.length).setValues([INDEX_HEADERS]);
    if (filas.length > 0) {
      hoja.getRange(2, 1, filas.length, INDEX_HEADERS.length).setValues(filas);
    }

    return { ok: true, total: filas.length };
  } finally {
    lock.releaseLock();
  }
}`;
  }

  return `/**
 * ============================================================================
 * VALIDADOR DE COBERTURA Y DESPACHO CHILE — GOOGLE APPS SCRIPT
 * ============================================================================
 * CONFIGURACIÓN DE ACCESO 100% LIBRE (SIN CORREO ELECTRÓNICO):
 * - Los operadores de venta NO necesitan tener ningún correo electrónico abierto en el ordenador.
 * - Al desplegar en Google Apps Script:
 *   1. Menú: Implementar > Nueva implementación (Tipo: Aplicación web).
 *   2. "Ejecutar como": "Yo" (tu cuenta de Google con acceso a la hoja).
 *   3. "Quién tiene acceso": "Cualquier usuario" (Anyone, incluso anónimos sin cuenta).
 *   ¡Con estos 2 ajustes, Google NUNCA solicitará iniciar sesión ni pedirá correo!
 *
 * REGLAS DE DESPACHO CHILE:
 * - Únicas paqueterías autorizadas:
 *   1. "Contraentrega": Acepta Pago en Efectivo y Transferencia bancaria en la entrega.
 *   2. "Blue Express": Acepta ÚNICAMENTE Pago en Efectivo en la entrega.
 * - Cálculo automático de fecha de entrega sumando los días hábiles de tránsito.
 * - Enlace directo a Google Maps para cada comuna o región consultada.
 * ============================================================================
 */

const CONFIG = {
  // Spreadsheet con la base de datos de cobertura y despacho:
  SOURCE_SPREADSHEET_ID: '${config.sourceSpreadsheetId || '1wP9_COBERTURA_DESPACHO_CHILE_50K'}',
  SOURCE_SHEET_NAME: '${config.sourceSheetName || 'Actualizacion de Datos del Operador'}',
  HEADER_ROW: ${config.headerRow || 1},

  // Spreadsheet donde se aloja el índice optimizado para búsquedas veloces:
  INDEX_SPREADSHEET_ID: '${config.indexSpreadsheetId || '1zK8_INDICE_DESPACHO_ADMIN_CHILE'}',
  INDEX_SHEET_NAME: '${config.indexSheetName || 'INDICE_COBERTURA'}',

  // ACCESO LIBRE UNIVERSAL:
  // No requiere correo electrónico ni sesión abierta de Google en el ordenador del operador
  ACCESO_LIBRE_SIN_CORREO: true,

  // Máximo de resultados devueltos por consulta (protege el ancho de banda del navegador):
  MAX_RESULTS: ${config.maxResults || 100},

  // Mínimo de caracteres para iniciar búsqueda:
  MIN_QUERY_LENGTH: ${config.minQueryLength || 2},

  // Tiempo máximo de espera del candado LockService:
  LOCK_TIMEOUT_MS: ${config.lockTimeoutMs || 30000}
};

const INDEX_HEADERS = ['SEARCH_TEXT', 'ROW_JSON'];

/**
 * Entrada principal de la aplicación web.
 * Se sirve públicamente a cualquier persona sin requerir cuenta Google abierta.
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Validador de Cobertura y Despacho Chile')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Inicialización limpia sin verificación de correo.
 * Acceso directo e inmediato para todos los operadores de venta.
 */
function iniciarAplicacion() {
  return {
    ok: true,
    sinCorreo: true,
    titulo: 'Validador de Cobertura y Despacho Chile',
    minQueryLength: CONFIG.MIN_QUERY_LENGTH,
    maxResults: CONFIG.MAX_RESULTS,
    paqueteriasPermitidas: [
      { nombre: 'Contraentrega', pagos: 'Efectivo y Transferencia' },
      { nombre: 'Blue Express', pagos: 'Solo Efectivo' }
    ]
  };
}

/**
 * Búsqueda de cobertura optimizada en el índice del servidor.
 * NUNCA solicita ni requiere correo electrónico del operador.
 */
function buscarCobertura(consulta, codigoOperadorOpcional) {
  const query = normalizar_(consulta);

  if (query.length < CONFIG.MIN_QUERY_LENGTH) {
    throw new Error(
      'Escribe al menos ' + CONFIG.MIN_QUERY_LENGTH + ' caracteres para buscar.'
    );
  }

  const indice = obtenerHojaIndice_();
  const ultimaFila = indice.getLastRow();

  if (ultimaFila < 2) {
    throw new Error(
      'El índice todavía no está creado o está vacío. Ejecuta reconstruirIndice() desde el editor de Apps Script.'
    );
  }

  // Búsqueda rápida mediante TextFinder nativo de Sheets en la columna 1
  const rangoBusqueda = indice.getRange(2, 1, ultimaFila - 1, 1);

  const coincidencias = rangoBusqueda
    .createTextFinder(escaparRegex_(query))
    .useRegularExpression(true)
    .matchCase(false)
    .findAll();

  const resultados = [];
  const cantidad = Math.min(coincidencias.length, CONFIG.MAX_RESULTS);

  for (let i = 0; i < cantidad; i++) {
    const filaIndice = coincidencias[i].getRow();
    const json = indice.getRange(filaIndice, 2).getDisplayValue();

    try {
      const reg = JSON.parse(json);

      // Normalizar paqueterías autorizadas exclusivamente a Contraentrega o Blue Express
      const paqOriginal = String(reg['PAQUETERÍA'] || reg['paqueteria'] || reg['Courier'] || '').toLowerCase();
      let paqFinal = 'Contraentrega';
      let pagoFinal = 'Efectivo y Transferencia';

      if (paqOriginal.includes('blue') || paqOriginal.includes('express')) {
        paqFinal = 'Blue Express';
        pagoFinal = 'Solo Efectivo';
      } else {
        paqFinal = 'Contraentrega';
        pagoFinal = 'Efectivo y Transferencia';
      }

      reg['PAQUETERÍA_VALIDADA'] = paqFinal;
      reg['METODO_PAGO_VALIDADO'] = pagoFinal;

      // Calcular días de tránsito y fecha estimada de entrega
      const dias = parseInt(reg['DÍAS DE TRÁNSITO'] || reg['DIAS_TRANSITO'] || reg['diasTransito'] || (paqFinal === 'Contraentrega' ? 1 : 3), 10);
      reg['DIAS_TRANSITO_NUM'] = dias;
      reg['FECHA_ESTIMADA_ENTREGA'] = calcularFechaEntrega_(dias);

      // Enlace directo a Google Maps para enviar al cliente o visualizar zona
      const comuna = reg['COMUNA'] || reg['comuna'] || reg['Zona'] || '';
      const region = reg['REGIÓN'] || reg['region'] || reg['Region'] || '';
      reg['MAPS_URL'] = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent((comuna ? comuna + ', ' : '') + (region ? region + ', ' : '') + 'Chile');

      resultados.push(reg);
    } catch (e) {
      // Ignorar fila si tuviese formato irregular
    }
  }

  return {
    ok: true,
    query: String(consulta).trim(),
    totalEncontrado: coincidencias.length,
    resultadosDevueltos: resultados.length,
    limitado: coincidencias.length > CONFIG.MAX_RESULTS,
    operadorIdentificado: codigoOperadorOpcional || 'OPERADOR_LIBRE',
    resultados: resultados
  };
}

/**
 * Calcula la fecha estimada de entrega sumando días hábiles de tránsito (excluyendo sábados y domingos).
 */
function calcularFechaEntrega_(diasTransito) {
  var fecha = new Date();
  if (fecha.getHours() >= 15) {
    fecha.setDate(fecha.getDate() + 1);
  }
  var agregados = 0;
  while (agregados < diasTransito) {
    fecha.setDate(fecha.getDate() + 1);
    var dia = fecha.getDay();
    if (dia !== 0 && dia !== 6) {
      agregados++;
    }
  }
  var dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return dias[fecha.getDay()] + ' ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getFullYear();
}

${indexRebuildFunction}

/**
 * Devuelve la hoja del índice o un error descriptivo.
 */
function obtenerHojaIndice_() {
  const ss = SpreadsheetApp.openById(CONFIG.INDEX_SPREADSHEET_ID);
  const hoja = ss.getSheetByName(CONFIG.INDEX_SHEET_NAME);

  if (!hoja) {
    throw new Error('No se encontró la pestaña del índice "' + CONFIG.INDEX_SHEET_NAME + '" en el spreadsheet.');
  }

  return hoja;
}

/**
 * Normalización de texto idéntica a la del motor de indexación:
 * minúsculas, eliminación de tildes (NFD) y compresión de espacios.
 */
function normalizar_(valor) {
  return String(valor == null ? '' : valor)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/\\s+/g, ' ')
    .trim();
}

/**
 * Escapa caracteres especiales para el motor TextFinder con regex.
 */
function escaparRegex_(texto) {
  return String(texto).replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g, '\\\\$&');
}
`;
}

export function generateIndexHtml(config: AppsScriptConfig): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <base target="_top">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Validador de Cobertura y Despacho Chile</title>

  <style>
    :root {
      --navy: #0f1e36;
      --navy-light: #182d4d;
      --blue: #1d4ed8;
      --blue-hover: #1e40af;
      --bg: #f4f6fa;
      --surface: #ffffff;
      --border: #dbe2ea;
      --muted: #64748b;
      --green: #15803d;
      --green-bg: #f0fdf4;
      --orange: #c2410c;
      --orange-bg: #fff7ed;
      --red: #b91c1c;
      --red-bg: #fef2f2;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: var(--bg);
      color: var(--navy);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
    }

    .topbar {
      padding: 20px;
      background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(15, 30, 54, 0.15);
    }

    .topbar-inner, main {
      width: min(1140px, 94%);
      margin: 0 auto;
    }

    .badge-open {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: rgba(16, 185, 129, 0.2);
      color: #6ee7b7;
      border: 1px solid rgba(16, 185, 129, 0.4);
      padding: 4px 10px;
      border-radius: 20px;
      margin-bottom: 8px;
    }

    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #34d399;
    }

    h1 {
      margin: 2px 0 6px;
      font-size: clamp(20px, 3.5vw, 28px);
      font-weight: 800;
      letter-spacing: -0.5px;
    }

    .subtitle {
      color: #cbd5e1;
      font-size: 13.5px;
      max-width: 750px;
    }

    main { padding: 22px 0 60px; }

    .panel {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px;
      margin-bottom: 20px;
      box-shadow: 0 4px 16px rgba(15, 30, 54, 0.04);
    }

    .notice-box {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 16px;
      font-size: 12.5px;
      color: #1e40af;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }

    .label {
      display: block;
      font-weight: 700;
      font-size: 15px;
      margin-bottom: 8px;
      color: var(--navy);
    }

    .search-row {
      display: flex;
      gap: 10px;
    }

    input[type="search"] {
      width: 100%;
      min-width: 0;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 16px;
      color: var(--navy);
      background: #fff;
      outline: none;
      transition: all 0.2s ease;
    }

    input[type="search"]:focus {
      border-color: var(--blue);
      box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.12);
    }

    button.btn-primary {
      border: 0;
      border-radius: 12px;
      padding: 14px 24px;
      background: var(--blue);
      color: white;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    button.btn-primary:hover:not(:disabled) {
      background: var(--blue-hover);
    }

    button:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .hint {
      color: var(--muted);
      font-size: 12.5px;
      margin-top: 10px;
    }

    .status {
      margin-top: 14px;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .status.info { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
    .status.success { background: var(--green-bg); color: var(--green); border: 1px solid #bbf7d0; }
    .status.error { background: var(--red-bg); color: var(--red); border: 1px solid #fecaca; }

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }

    .result-header h2 {
      font-size: 18px;
      font-weight: 700;
      color: var(--navy);
    }

    .count-badge {
      background: #f1f5f9;
      color: #334155;
      font-size: 12.5px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 20px;
    }

    .results {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 16px;
      margin-top: 20px;
    }

    .result-card {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 18px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(15, 30, 54, 0.03);
      position: relative;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      display: flex;
      flex-col;
      flex-direction: column;
    }

    .result-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(15, 30, 54, 0.07);
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f5f9;
    }

    .card-title {
      font-size: 15px;
      font-weight: 800;
      color: var(--navy);
    }

    .maps-link-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      border-radius: 8px;
      border: 1px solid #bfdbfe;
      transition: all 0.15s;
    }

    .maps-link-btn:hover {
      background: #dbeafe;
      color: #1e40af;
    }

    .delivery-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px;
      margin: 10px 0;
    }

    .delivery-date {
      font-size: 14px;
      font-weight: 800;
      color: #1e3a8a;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .paq-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .paq-contraentrega {
      background: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    .paq-blueexpress {
      background: #ffedd5;
      color: #c2410c;
      border: 1px solid #fed7aa;
    }

    .payment-note {
      font-size: 12px;
      color: #475569;
      margin-top: 4px;
    }

    .field {
      padding: 6px 0;
      border-bottom: 1px solid #f8fafc;
      font-size: 13px;
    }

    .field-name {
      color: var(--muted);
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .field-value {
      font-weight: 600;
      color: #1e293b;
    }

    .empty {
      padding: 40px 16px;
      text-align: center;
      color: var(--muted);
      font-size: 14px;
      grid-column: 1 / -1;
    }

    .footer {
      text-align: center;
      color: var(--muted);
      font-size: 12px;
      padding: 16px;
    }

    @media (max-width: 640px) {
      .search-row { flex-direction: column; }
      button.btn-primary { width: 100%; }
      .results { grid-template-columns: 1fr; }
    }
  </style>
</head>

<body>
  <header class="topbar">
    <div class="topbar-inner">
      <div class="badge-open">
        <span class="badge-dot"></span>
        Acceso Público Directo · Sin Correo Electrónico
      </div>
      <h1>Validador Multicampaña de Cobertura y Despacho</h1>
      <p class="subtitle">
        Consulta libre para operadores de venta sin necesidad de cuenta Google abierta. Campañas Chile y Paraguay con fechas de entrega y Google Maps.
      </p>
    </div>
  </header>

  <main>
    <section class="panel">
      <div class="notice-box">
        <div>
          <strong>⚡ Operatividad Inmediata:</strong> Los operadores de venta no requieren tener cuenta ni correo de Google abierto en este equipo.
        </div>
        <div style="font-weight: 700;">
          Paqueterías: Contraentrega (Efectivo/Transferencia) · Blue Express (Solo Efectivo)
        </div>
      </div>

      <label class="label" for="consulta">
        Escribe la comuna, región o dirección a validar:
      </label>

      <div class="search-row">
        <input
          id="consulta"
          type="search"
          autocomplete="off"
          placeholder="Ej.: Maipú, Puente Alto, Providencia, Viña del Mar, Concepción, La Serena, Antofagasta..."
          aria-label="Texto de búsqueda de cobertura"
          autofocus
        >
        <button id="btnBuscar" class="btn-primary" type="button">
          Buscar Cobertura
        </button>
      </div>

      <p class="hint">
        Búsqueda por texto normalizado (sin distinguir mayúsculas ni tildes). Escribe al menos 2 letras y pulsa Buscar o Enter.
      </p>

      <div id="estado" class="status info" role="status">
        Listo para consultar. Escribe una comuna para iniciar la validación.
      </div>
    </section>

    <section class="panel">
      <div class="result-header">
        <h2>Zonas y Factibilidad de Despacho</h2>
        <span id="contador" class="count-badge">Esperando búsqueda</span>
      </div>

      <div id="resultados" class="results">
        <div class="empty">
          Ingresa una comuna o dirección y presiona “Buscar Cobertura”.
        </div>
      </div>
    </section>

    <div class="footer">
      Validador Multicampaña de Cobertura y Despacho · Plataforma operativa de ventas · Chile y Paraguay · Acceso público sin correo.
    </div>
  </main>

  <script>
    const input = document.getElementById('consulta');
    const boton = document.getElementById('btnBuscar');
    const estado = document.getElementById('estado');
    const resultados = document.getElementById('resultados');
    const contador = document.getElementById('contador');

    let minimoCaracteres = ${config.minQueryLength || 2};
    let buscando = false;

    function setEstado(mensaje, tipo) {
      estado.textContent = mensaje;
      estado.className = 'status ' + (tipo || 'info');
    }

    function renderizarResultados(data) {
      resultados.innerHTML = '';
      const lista = data.resultados || [];
      contador.textContent = data.totalEncontrado + ' coincidencia(s)';

      if (lista.length === 0) {
        resultados.innerHTML = '<div class="empty">No se encontraron zonas de reparto para "' + escapeHtml(data.query) + '". Verifica que esté bien escrita o prueba por región.</div>';
        return;
      }

      lista.forEach((reg, idx) => {
        const card = document.createElement('article');
        card.className = 'result-card';

        const localidad = reg['LOCALIDAD'] || reg['localidad'] || reg['SECTOR'] || reg['sector'] || reg['Sector'] || reg['Zona'] || reg['COMUNA'] || 'Sector Urbano';
        const comuna = reg['COMUNA'] || reg['comuna'] || 'Zona Chile';
        const region = reg['REGIÓN'] || reg['region'] || reg['Region'] || '';
        const paqueteria = reg['PAQUETERÍA_VALIDADA'] || reg['PAQUETERÍA'] || 'Contraentrega';
        const metodoPago = reg['METODO_PAGO_VALIDADO'] || (paqueteria.includes('Blue') ? 'Solo Efectivo' : 'Efectivo y Transferencia');
        const diasTransito = reg['DIAS_TRANSITO_NUM'] || reg['DÍAS DE TRÁNSITO'] || reg['DIAS_TRANSITO'] || 2;
        const fechaEstimada = reg['FECHA_ESTIMADA_ENTREGA'] || 'Próximo día hábil';
        const qMaps = [localidad, comuna, region, 'Chile'].filter(Boolean).join(', ');
        const mapsUrl = reg['MAPS_URL'] || reg['GOOGLE_MAPS_URL'] || ('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(qMaps));

        const isContra = paqueteria.toLowerCase().includes('contra');

        card.innerHTML = \`
          <div class="card-top">
            <div>
              <div class="card-title">📍 \${escapeHtml(localidad)}</div>
              <div style="font-size: 12px; color: #334155; font-weight: 600;">Comuna: \${escapeHtml(comuna)}</div>
              <div style="font-size: 11px; color: #64748b;">\${escapeHtml(region)}</div>
            </div>
            <a href="\${mapsUrl}" target="_blank" rel="noopener noreferrer" class="maps-link-btn" title="Abrir ubicación en Google Maps">
              📍 Ver en Maps
            </a>
          </div>

          <div class="delivery-box">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">
              Fecha Estimada de Entrega:
            </div>
            <div class="delivery-date">
              📅 \${escapeHtml(fechaEstimada)}
            </div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
              Plazo: \${diasTransito} día(s) hábil(es) de tránsito
            </div>

            <div style="margin-top: 8px;">
              <span class="paq-badge \${isContra ? 'paq-contraentrega' : 'paq-blueexpress'}">
                📦 \${escapeHtml(paqueteria)}
              </span>
              <div class="payment-note">
                💳 Pago en entrega: <strong>\${escapeHtml(metodoPago)}</strong>
              </div>
            </div>
          </div>

          <div style="margin-top: auto; padding-top: 8px;">
            <div class="field">
              <span class="field-name">Estado de Reparto:</span>
              <span class="field-value" style="color: #15803d; font-weight: 800;">✓ Cobertura Factible</span>
            </div>
          </div>
        \`;

        resultados.appendChild(card);
      });

      if (data.limitado) {
        setEstado('Se encontraron más resultados. Escribe más letras para acotar la búsqueda.', 'info');
      }
    }

    function escapeHtml(str) {
      return String(str == null ? '' : str).replace(/[&<>"']/g, m => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      })[m]);
    }

    function buscar() {
      const consulta = input.value.trim();
      if (consulta.length < minimoCaracteres) {
        setEstado('Escribe al menos ' + minimoCaracteres + ' caracteres para buscar.', 'error');
        input.focus();
        return;
      }

      if (buscando) return;
      buscando = true;
      boton.disabled = true;
      setEstado('Consultando cobertura en servidor...', 'info');
      contador.textContent = 'Buscando...';
      resultados.innerHTML = '<div class="empty">Buscando zonas en la base de despacho...</div>';

      google.script.run
        .withSuccessHandler(data => {
          buscando = false;
          boton.disabled = false;
          renderizarResultados(data);
          setEstado('Búsqueda completada con éxito (' + data.totalEncontrado + ' zonas encontradas).', 'success');
        })
        .withFailureHandler(error => {
          buscando = false;
          boton.disabled = false;
          contador.textContent = 'Error';
          const msg = error && error.message ? error.message : 'Error al consultar el servidor.';
          setEstado(msg, 'error');
          resultados.innerHTML = '<div class="empty">' + escapeHtml(msg) + '</div>';
        })
        .buscarCobertura(consulta);
    }

    boton.addEventListener('click', buscar);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') buscar(); });

    // Inicialización al cargar la página sin comprobación de correo
    function iniciar() {
      google.script.run
        .withSuccessHandler(data => {
          minimoCaracteres = data.minQueryLength || 2;
          boton.disabled = false;
          setEstado('Sistema listo. Acceso público sin correo verificado.', 'success');
        })
        .withFailureHandler(err => {
          // Aún si falla la inicialización secundaria, permitir buscar
          boton.disabled = false;
          setEstado('Listo para consultar.', 'info');
        })
        .iniciarAplicacion();
    }

    iniciar();
  </script>
</body>
</html>
`;
}
