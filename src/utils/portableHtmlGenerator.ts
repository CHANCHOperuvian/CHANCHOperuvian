import { ZoneDeliveryRecord } from '../types/coverage';

/**
 * Genera un archivo HTML 100% autónomo (Single-File App) con toda la base de datos de Chile integrada.
 * NO requiere servidor, NO requiere Google Apps Script, NO pide correo electrónico ni cuenta Google.
 * Soporta filtrado por Región, Comuna y LOCALIDADES reales de cada comuna.
 */
export function generatePortableHtml(records: ZoneDeliveryRecord[]): string {
  const recordsJson = JSON.stringify(
    records.map(r => ({
      id: r.id,
      campaignId: r.campaignId || (r.pais === 'Paraguay' ? 'PARAGUAY' : 'CHILE'),
      pais: r.pais || (r.campaignId === 'PARAGUAY' ? 'Paraguay' : 'Chile'),
      region: r.region,
      comuna: r.comuna,
      localidad: r.localidad || r.sectorZona || r.comuna,
      sectorZona: r.sectorZona,
      zipCode: r.zipCode || '',
      paqueteria: r.paqueteria,
      metodoPago: r.metodoPago,
      diasTransito: r.diasTransito,
      diasEntregaTexto: r.diasEntregaTexto || '',
      fechaEntrega: r.fechaEntregaEstimada,
      restricciones: r.restricciones || ''
    }))
  );

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Validador Multicampaña de Despacho · Chile y Paraguay</title>
  <style>
    :root {
      --primary: #2563eb;
      --primary-dark: #1d4ed8;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --green: #15803d;
      --green-bg: #dcfce7;
      --orange: #c2410c;
      --orange-bg: #ffedd5;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); padding-bottom: 50px; }
    header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 24px 20px;
      border-bottom: 3px solid var(--primary);
    }
    .header-inner { max-width: 1200px; margin: 0 auto; }
    .badge {
      display: inline-block;
      background: #22c55e;
      color: #052e16;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 999px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    h1 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
    .subtitle { font-size: 13px; color: #94a3b8; }
    main { max-width: 1200px; margin: 20px auto; padding: 0 16px; }
    .panel {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
      margin-bottom: 20px;
    }
    .rules-banner {
      background: #f1f5f9;
      border-left: 4px solid var(--primary);
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 12.5px;
      color: #334155;
      margin-bottom: 16px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 10px;
    }
    .search-box {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
    }
    input[type="text"] {
      flex: 1;
      min-width: 0;
      padding: 12px 16px;
      font-size: 15px;
      border: 1.5px solid var(--border);
      border-radius: 10px;
      outline: none;
    }
    input[type="text"]:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.15);
    }
    .filters {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    select {
      padding: 8px 12px;
      font-size: 13px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: #fff;
      color: #334155;
      font-weight: 600;
    }
    .counter {
      font-size: 13px;
      font-weight: 700;
      color: #475569;
      margin: 12px 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 14px;
    }
    .card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      display: flex;
      flex-direction: column;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 14px rgba(0,0,0,0.06);
    }
    .card-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f1f5f9;
    }
    .localidad-name {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
    }
    .comuna-tag {
      font-size: 12px;
      color: #475569;
      font-weight: 600;
    }
    .region-name {
      font-size: 11px;
      color: #94a3b8;
    }
    .btn-maps {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 5px 9px;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 700;
      text-decoration: none;
      shrink: 0;
    }
    .btn-maps:hover { background: #dbeafe; }
    .delivery-info {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      margin-bottom: 10px;
    }
    .date-val {
      font-size: 13.5px;
      font-weight: 800;
      color: #1e3a8a;
    }
    .badge-paq {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 5px;
      text-transform: uppercase;
      margin-top: 6px;
    }
    .badge-contra {
      background: var(--green-bg);
      color: var(--green);
      border: 1px solid #bbf7d0;
    }
    .badge-blue {
      background: var(--orange-bg);
      color: var(--orange);
      border: 1px solid #fed7aa;
    }
    .payment-text {
      font-size: 12px;
      color: #475569;
      margin-top: 4px;
    }
    .copy-order-btn {
      margin-top: auto;
      padding: 8px 12px;
      background: #0f172a;
      color: white;
      border: 0;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
    }
    .copy-order-btn:hover { background: #1e293b; }
    .empty {
      grid-column: 1 / -1;
      padding: 40px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <header>
    <div class="header-inner">
      <div class="badge">Acceso Directo Autónomo · Sin Correo Electrónico</div>
      <h1>Validador de Cobertura y Despacho Chile</h1>
      <p class="subtitle">
        Consulta libre para operadores de venta sin necesidad de cuenta Google ni correo abierto. Filtro por Localidades reales.
      </p>
    </div>
  </header>

  <main>
    <section class="panel">
      <div class="rules-banner">
        <div>
          <strong>📦 Paqueterías Oficiales:</strong> Contraentrega (Efectivo y Transferencia) · Blue Express (Solo Efectivo)
        </div>
        <div>
          <strong>📍 Google Maps:</strong> Redireccionamiento directo a la localidad exacta del cliente
        </div>
      </div>

      <div class="search-box">
        <input
          type="text"
          id="busqueda"
          placeholder="Escribe localidad, comuna o región (ej. Ciudad Satélite, Reñaca, Chicureo, Maipú, Viña del Mar)..."
          autocomplete="off"
          autofocus
        >
      </div>

      <div class="filters">
        <select id="filtroRegion">
          <option value="">Todas las Regiones de Chile</option>
        </select>

        <select id="filtroComuna">
          <option value="">Todas las Comunas</option>
        </select>

        <select id="filtroLocalidad">
          <option value="">Todas las Localidades</option>
        </select>

        <select id="filtroPaqueteria">
          <option value="">Ambas Paqueterías</option>
          <option value="Contraentrega">Contraentrega (Efectivo y Transferencia)</option>
          <option value="Blue Express">Blue Express (Solo Efectivo)</option>
        </select>
      </div>

      <div class="counter">
        <span id="contadorTexto">Cargando base de datos...</span>
        <span style="font-size: 11px; color: #166534; font-weight: 800;">✓ Funcionando 100% Offline / Sin Login</span>
      </div>

      <div id="contenedorResultados" class="grid"></div>
    </section>
  </main>

  <script>
    const DATA = ${recordsJson};

    function normalizar(texto) {
      return String(texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\\u0300-\\u036f]/g, '')
        .trim();
    }

    function calcularFechaEntrega(diasTransito) {
      const fecha = new Date();
      if (fecha.getHours() >= 15) {
        fecha.setDate(fecha.getDate() + 1);
      }
      let agregados = 0;
      while (agregados < diasTransito) {
        fecha.setDate(fecha.getDate() + 1);
        const dia = fecha.getDay();
        if (dia !== 0 && dia !== 6) {
          agregados++;
        }
      }
      const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return dias[fecha.getDay()] + ' ' + fecha.getDate() + ' de ' + meses[fecha.getMonth()] + ' de ' + fecha.getFullYear();
    }

    const selectRegion = document.getElementById('filtroRegion');
    const selectComuna = document.getElementById('filtroComuna');
    const selectLocalidad = document.getElementById('filtroLocalidad');
    const selectPaq = document.getElementById('filtroPaqueteria');
    const inputBusqueda = document.getElementById('busqueda');
    const contenedor = document.getElementById('contenedorResultados');
    const contador = document.getElementById('contadorTexto');

    // Llenar selector de regiones
    const regionesUnicas = Array.from(new Set(DATA.map(r => r.region).filter(Boolean))).sort();
    regionesUnicas.forEach(reg => {
      const opt = document.createElement('option');
      opt.value = reg;
      opt.textContent = reg;
      selectRegion.appendChild(opt);
    });

    function actualizarComunas() {
      const reg = selectRegion.value;
      const comunasFiltradas = Array.from(
        new Set(DATA.filter(r => !reg || r.region === reg).map(r => r.comuna).filter(Boolean))
      ).sort();

      selectComuna.innerHTML = '<option value="">Todas las Comunas</option>';
      comunasFiltradas.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c;
        opt.textContent = c;
        selectComuna.appendChild(opt);
      });
      actualizarLocalidades();
    }

    function actualizarLocalidades() {
      const reg = selectRegion.value;
      const com = selectComuna.value;
      const localidadesFiltradas = Array.from(
        new Set(DATA.filter(r => (!reg || r.region === reg) && (!com || r.comuna === com)).map(r => r.localidad).filter(Boolean))
      ).sort();

      selectLocalidad.innerHTML = '<option value="">Todas las Localidades (' + localidadesFiltradas.length + ')</option>';
      localidadesFiltradas.forEach(loc => {
        const opt = document.createElement('option');
        opt.value = loc;
        opt.textContent = loc;
        selectLocalidad.appendChild(opt);
      });
    }

    selectRegion.addEventListener('change', () => {
      actualizarComunas();
      render();
    });

    selectComuna.addEventListener('change', () => {
      actualizarLocalidades();
      render();
    });

    selectLocalidad.addEventListener('change', render);
    selectPaq.addEventListener('change', render);
    inputBusqueda.addEventListener('input', render);

    actualizarComunas();

    function render() {
      const q = normalizar(inputBusqueda.value);
      const paq = selectPaq.value;
      const reg = selectRegion.value;
      const com = selectComuna.value;
      const loc = selectLocalidad.value;

      const filtrados = DATA.filter(item => {
        if (paq && item.paqueteria !== paq) return false;
        if (reg && item.region !== reg) return false;
        if (com && item.comuna !== com) return false;
        if (loc && item.localidad !== loc) return false;
        if (q) {
          const bolsa = normalizar(item.localidad + ' ' + item.comuna + ' ' + item.region + ' ' + (item.sectorZona || '') + ' ' + item.paqueteria);
          if (!bolsa.includes(q)) return false;
        }
        return true;
      });

      const maxMostrar = 120;
      const recortados = filtrados.slice(0, maxMostrar);
      contador.textContent = filtrados.length + ' localidad(es) encontrada(s)' + (filtrados.length > maxMostrar ? ' (mostrando primeras ' + maxMostrar + ')' : '');

      if (recortados.length === 0) {
        contenedor.innerHTML = '<div class="empty">No se encontraron localidades que coincidan con la búsqueda. Prueba con otro nombre de sector, comuna o región.</div>';
        return;
      }

      contenedor.innerHTML = recortados.map((item, idx) => {
        const isContra = item.paqueteria === 'Contraentrega';
        const fechaEstimada = calcularFechaEntrega(item.diasTransito || 2);
        const queryMaps = [item.localidad, item.comuna, item.region, 'Chile'].filter(Boolean).join(', ');
        const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(queryMaps);

        return \`
          <article class="card">
            <div class="card-head">
              <div>
                <div class="localidad-name">📍 \${item.localidad}</div>
                <div class="comuna-tag">Comuna: \${item.comuna}</div>
                <div class="region-name">\${item.region}</div>
              </div>
              <a href="\${mapsUrl}" target="_blank" rel="noopener noreferrer" class="btn-maps" title="Abrir en Google Maps">
                📍 Maps
              </a>
            </div>

            <div class="delivery-info">
              <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b;">
                Fecha Estimada de Entrega:
              </div>
              <div class="date-val">📅 \${fechaEstimada}</div>
              <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                Plazo: \${item.diasTransito} día(s) hábil(es)
              </div>

              <div style="margin-top: 8px;">
                <span class="badge-paq \${isContra ? 'badge-contra' : 'badge-blue'}">
                  📦 \${item.paqueteria}
                </span>
                <div class="payment-text">
                  💳 Pago en entrega: <strong>\${item.metodoPago}</strong>
                </div>
              </div>
            </div>

            <button class="copy-order-btn" onclick="copiarFicha(\${idx})">
              📋 Copiar Datos de Entrega
            </button>
          </article>
        \`;
      }).join('');
    }

    window.copiarFicha = function(idx) {
      const q = normalizar(inputBusqueda.value);
      const paq = selectPaq.value;
      const reg = selectRegion.value;
      const com = selectComuna.value;
      const loc = selectLocalidad.value;

      const filtrados = DATA.filter(item => {
        if (paq && item.paqueteria !== paq) return false;
        if (reg && item.region !== reg) return false;
        if (com && item.comuna !== com) return false;
        if (loc && item.localidad !== loc) return false;
        if (q) {
          const bolsa = normalizar(item.localidad + ' ' + item.comuna + ' ' + item.region + ' ' + (item.sectorZona || '') + ' ' + item.paqueteria);
          if (!bolsa.includes(q)) return false;
        }
        return true;
      });
      const item = filtrados[idx];
      if (!item) return;

      const fecha = calcularFechaEntrega(item.diasTransito || 2);
      const queryMaps = [item.localidad, item.comuna, item.region, 'Chile'].filter(Boolean).join(', ');
      const texto = '📍 LOCALIDAD: ' + item.localidad + '\\n' +
                    '🏙️ COMUNA: ' + item.comuna + ' (' + item.region + ')\\n' +
                    '📦 PAQUETERÍA: ' + item.paqueteria + '\\n' +
                    '💳 PAGO EN ENTREGA: ' + item.metodoPago + '\\n' +
                    '📅 FECHA ESTIMADA: ' + fecha + ' (' + item.diasTransito + ' días hábiles)\\n' +
                    '🗺️ MAPS: https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(queryMaps);

      navigator.clipboard.writeText(texto).then(() => {
        alert('¡Datos de entrega copiados para enviar al cliente!\\n\\n' + texto);
      });
    };

    render();
  </script>
</body>
</html>`;
}
