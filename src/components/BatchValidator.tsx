import React, { useState } from 'react';
import { SearchEngine } from '../utils/searchEngine';
import { ZoneDeliveryRecord, OperatorProfile, CampaignId } from '../types/coverage';
import { calcularFechaEntrega, calcularFechaEntregaParaguay } from '../utils/transitCalculator';
import { 
  ListChecks, 
  Play, 
  Download, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw,
  Truck,
  Calendar,
  MapPin
} from 'lucide-react';

interface BatchValidatorProps {
  engine: SearchEngine;
  currentOperator: OperatorProfile;
  activeCampaign: CampaignId;
  onCampaignChange?: (campaign: CampaignId) => void;
}

interface BatchResultRow {
  lineaOriginal: string;
  coincidencias: number;
  mejorRegistro?: ZoneDeliveryRecord;
  paqueteria: string;
  metodoPago: string;
  diasTransito: number;
  fechaEntrega: string;
}

export const BatchValidator: React.FC<BatchValidatorProps> = ({ engine, activeCampaign }) => {
  const [inputText, setInputText] = useState(() => {
    return activeCampaign === 'CHILE'
      ? `Maipú, Región Metropolitana\nPuente Alto, Región Metropolitana\nViña del Mar, Valparaíso\nConcepción Centro, Biobío\nAntofagasta, Antofagasta\nTemuco, La Araucanía\nPuerto Montt, Los Lagos`
      : `Sajonia, Asunción\nCiudad del Este, Alto Paraná\nSan Lorenzo, Central\nLuque, Central\nVillarrica, Guairá\nEncarnación, Itapúa\nCoronel Oviedo, Caaguazú\nPedro Juan Caballero, Amambay`;
  });
  const [results, setResults] = useState<BatchResultRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRunBatch = () => {
    setIsProcessing(true);
    const lines = inputText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    setTimeout(() => {
      const output: BatchResultRow[] = lines.map(line => {
        const search = engine.search(line, { maxResults: 1 });
        if (search.totalEncontrado > 0) {
          const match = search.resultados[0];
          const calc = (match.campaignId === 'PARAGUAY' || match.diasEntregaTexto)
            ? calcularFechaEntregaParaguay(match.diasTransito, match.diasEntregaTexto)
            : calcularFechaEntrega(match.diasTransito);
          return {
            lineaOriginal: line,
            coincidencias: search.totalEncontrado,
            mejorRegistro: match,
            paqueteria: match.paqueteria,
            metodoPago: match.campaignId === 'PARAGUAY' ? 'Efectivo / Transferencia' : match.metodoPago,
            diasTransito: match.diasTransito,
            fechaEntrega: calc.fechaTextoLargo
          };
        } else {
          return {
            lineaOriginal: line,
            coincidencias: 0,
            paqueteria: 'Sin Cobertura',
            metodoPago: 'No Aplica',
            diasTransito: 0,
            fechaEntrega: 'No Disponible'
          };
        }
      });

      setResults(output);
      setIsProcessing(false);
    }, 150);
  };

  const handleCopySummary = () => {
    if (results.length === 0) return;
    const tsv = [
      'Zona Consultada\tPaquetería\tMétodo de Pago\tDías Tránsito\tFecha Estimada de Entrega',
      ...results.map(r => 
        `${r.lineaOriginal}\t${r.paqueteria}\t${r.metodoPago}\t${r.diasTransito} días\t${r.fechaEntrega}`
      )
    ].join('\n');

    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (results.length === 0) return;
    const headers = ['Zona Consultada', 'Paqueteria', 'Metodo de Pago', 'Dias de Transito', 'Fecha Estimada de Entrega'];
    const rows = results.map(r => [
      `"${r.lineaOriginal.replace(/"/g, '""')}"`,
      `"${r.paqueteria}"`,
      `"${r.metodoPago}"`,
      `"${r.diasTransito} días hábiles"`,
      `"${r.fechaEntrega}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(row => row.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `validacion_lote_paqueterias_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    total: results.length,
    contraentrega: results.filter(r => r.paqueteria === 'Contraentrega').length,
    blueExpress: results.filter(r => r.paqueteria === 'Blue Express').length,
    sinCobertura: results.filter(r => r.paqueteria === 'Sin Cobertura').length
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-blue-600" />
              Validación Masiva de Paqueterías y Días de Entrega
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Pega una lista de comunas o zonas para calcular en bloque la fecha estimada de entrega y si corresponde a Contraentrega o Blue Express.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            rows={6}
            placeholder="Pega aquí tus comunas (ej. Maipú&#10;Puente Alto&#10;Viña del Mar&#10;Concepción)..."
            className="w-full font-mono text-xs sm:text-sm p-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-inner"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Líneas detectadas: <strong>{inputText.split('\n').filter(l => l.trim().length > 0).length}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setInputText('')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Limpiar
              </button>
              <button
                onClick={handleRunBatch}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 fill-white" />
                )}
                <span>Calcular Fechas y Paqueterías</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results View */}
      {results.length > 0 && (
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-xs text-slate-500 font-semibold uppercase block">Total Consultadas</span>
              <strong className="text-xl text-slate-900">{stats.total}</strong>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <span className="text-xs text-emerald-800 font-semibold uppercase block">Contraentrega (Efectivo/Transf.)</span>
              <strong className="text-xl text-emerald-800">{stats.contraentrega}</strong>
            </div>
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
              <span className="text-xs text-blue-800 font-semibold uppercase block">Blue Express (Solo Efectivo)</span>
              <strong className="text-xl text-blue-800">{stats.blueExpress}</strong>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
              <span className="text-xs text-rose-700 font-semibold uppercase block">Sin Cobertura</span>
              <strong className="text-xl text-rose-800">{stats.sinCobertura}</strong>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <h3 className="font-bold text-sm text-slate-900">
              Detalle de Despacho y Fechas Calculadas
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                Copiar (Excel/TSV)
              </button>
              <button
                onClick={handleDownloadCsv}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar CSV
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Zona Consultada</th>
                  <th className="px-4 py-3">Paquetería</th>
                  <th className="px-4 py-3">Método de Pago</th>
                  <th className="px-4 py-3">Días de Tránsito</th>
                  <th className="px-4 py-3">Fecha Estimada de Entrega</th>
                  <th className="px-4 py-3 text-center">Google Maps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r, i) => {
                  const isContraentrega = r.paqueteria === 'Contraentrega';
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.lineaOriginal + ', Chile')}`;
                  return (
                    <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-2.5 text-slate-400 font-mono">{i + 1}</td>
                      <td className="px-4 py-2.5">
                        <div className="font-bold text-slate-900">
                          {r.mejorRegistro ? `📍 ${r.mejorRegistro.localidad}` : r.lineaOriginal}
                        </div>
                        {r.mejorRegistro && (
                          <div className="text-[11px] text-slate-500 font-medium">
                            Comuna: {r.mejorRegistro.comuna} · {r.mejorRegistro.region}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          isContraentrega ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {r.paqueteria}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`font-semibold ${
                          isContraentrega ? 'text-emerald-800' : 'text-amber-800 font-bold'
                        }`}>
                          {r.metodoPago}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-bold text-slate-700">
                        {r.diasTransito > 0 ? `${r.diasTransito} días` : '—'}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-blue-950">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{r.fechaEntrega}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          <MapPin className="w-3 h-3 text-rose-500" />
                          <span>Abrir Maps</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
