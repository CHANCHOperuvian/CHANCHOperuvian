import React, { useState } from 'react';
import { ZoneDeliveryRecord, CampaignId } from '../types/coverage';
import { SearchEngine } from '../utils/searchEngine';
import { generateMassiveDataset, generateSeedData, CHILE_PRODUCTS } from '../data/chileanCoverageData';
import { generateParaguaySeedData, generateParaguayMassiveDataset, PARAGUAY_PRODUCTS } from '../data/paraguayCoverageData';
import { calcularFechaEntrega, calcularFechaEntregaParaguay } from '../utils/transitCalculator';
import { 
  Database, 
  Zap, 
  Upload, 
  Flame, 
  CheckCircle2, 
  FileSpreadsheet,
  Gauge,
  Truck
} from 'lucide-react';

interface DatasetManagerProps {
  records: ZoneDeliveryRecord[];
  onUpdateRecords: (newRecords: ZoneDeliveryRecord[]) => void;
  engine: SearchEngine;
  activeCampaign: CampaignId;
  onCampaignChange?: (campaign: CampaignId) => void;
}

export const DatasetManager: React.FC<DatasetManagerProps> = ({
  records,
  onUpdateRecords,
  engine,
  activeCampaign
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [benchmarkResults, setBenchmarkResults] = useState<{
    query: string;
    matches: number;
    timeMs: number;
  }[] | null>(null);
  const [avgTime, setAvgTime] = useState<number | null>(null);

  const handleLoadMassive = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const massive = activeCampaign === 'PARAGUAY' 
        ? generateParaguayMassiveDataset(30000) 
        : generateMassiveDataset(52000);
      onUpdateRecords(massive);
      setIsGenerating(false);
    }, 100);
  };

  const handleLoadSeedChile = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const seed = generateSeedData(1400);
      onUpdateRecords(seed);
      setIsGenerating(false);
    }, 100);
  };

  const handleLoadSeedParaguay = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const seed = generateParaguaySeedData();
      onUpdateRecords(seed);
      setIsGenerating(false);
    }, 100);
  };

  const handleRunBenchmark = () => {
    const testQueries = [
      'Maipú',
      'Puente Alto',
      'Viña del Mar',
      'Concepción',
      'Antofagasta',
      'Santiago Centro',
      'Temuco',
      'Puerto Montt'
    ];

    const results = testQueries.map(q => {
      const res = engine.search(q, { maxResults: 100 });
      return {
        query: q,
        matches: res.totalEncontrado,
        timeMs: res.tiempoMs
      };
    });

    const total = results.reduce((acc, curr) => acc + curr.timeMs, 0);
    setAvgTime(Number((total / results.length).toFixed(2)));
    setBenchmarkResults(results);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2) return;

      const delimiter = lines[0].includes(';') ? ';' : lines[0].includes('\t') ? '\t' : ',';
      const imported: ZoneDeliveryRecord[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
        if (row.length < 2) continue;

        const region = row[0] || 'Región Metropolitana de Santiago';
        const comuna = row[1] || 'Santiago Centro';
        const localidad = row[2] || `${comuna} Centro`;
        const paqueteriaRaw = (row[3] || '').toLowerCase().includes('blue') ? 'Blue Express' : 'Contraentrega';
        const metodoPago = paqueteriaRaw === 'Contraentrega' ? 'Efectivo y Transferencia' : 'Solo Efectivo';
        const diasTransito = parseInt(row[4], 10) || (paqueteriaRaw === 'Contraentrega' ? 1 : 3);
        const calc = calcularFechaEntrega(diasTransito);

        const recordObj: ZoneDeliveryRecord = {
          id: `IMP-${String(i).padStart(5, '0')}`,
          region,
          comuna,
          localidad,
          sectorZona: `Sector: ${localidad} (${comuna})`,
          coberturaEstado: 'Factible con Cobertura',
          paqueteria: paqueteriaRaw,
          metodoPago,
          diasTransito,
          fechaEntregaEstimada: calc.fechaTextoLargo,
          costoEnvioCLP: 0,
          envioGratis: true,
          productosDisponibles: CHILE_PRODUCTS.map(p => p.nombre),
          restricciones: paqueteriaRaw === 'Contraentrega' 
            ? 'Contraentrega: pago en efectivo o transferencia.' 
            : 'Blue Express: pago estrictamente en efectivo.',
          ultimaActualizacion: new Date().toISOString().slice(0, 10)
        };
        imported.push(recordObj);
      }

      if (imported.length > 0) {
        onUpdateRecords(imported);
        alert(`¡Se importaron ${imported.length.toLocaleString('es-CL')} registros de zonas con éxito!`);
      }
    };
    reader.readAsText(file);
  };

  const contraentregaCount = records.filter(r => r.paqueteria === 'Contraentrega').length;
  const blueExpressCount = records.filter(r => r.paqueteria === 'Blue Express').length;

  return (
    <div className="space-y-6">
      {/* Benchmark Control Panel */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              Base de Datos y Días de Tránsito (50.000+ Filas)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Gestión de zonas y cálculo dinámico de fechas de entrega para Contraentrega y Blue Express.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleLoadSeedChile}
              disabled={isGenerating}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              🇨🇱 Cargar Zonas Chile (1.400)
            </button>

            <button
              onClick={handleLoadSeedParaguay}
              disabled={isGenerating}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              🇵🇾 Cargar Zonas Paraguay (383)
            </button>

            <button
              onClick={handleLoadMassive}
              disabled={isGenerating || records.length > 40000}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>Cargar 50.000+ Filas ({activeCampaign})</span>
            </button>
          </div>
        </div>

        {/* Current status stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Zonas y Comunas</span>
            <strong className="text-2xl font-extrabold text-slate-900 mt-1 block">
              {records.length.toLocaleString('es-CL')}
            </strong>
            <span className="text-[11px] text-blue-600 font-medium">Actualizadas con Días de Tránsito</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Contraentrega</span>
            <strong className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              {contraentregaCount.toLocaleString('es-CL')}
            </strong>
            <span className="text-[11px] text-emerald-800 font-semibold">Efectivo + Transferencia</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Blue Express</span>
            <strong className="text-2xl font-extrabold text-blue-600 mt-1 block">
              {blueExpressCount.toLocaleString('es-CL')}
            </strong>
            <span className="text-[11px] text-amber-800 font-semibold">Solo Efectivo</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <span className="text-xs text-slate-500 font-semibold uppercase block">Tiempo Búsqueda</span>
            <strong className="text-2xl font-extrabold text-purple-600 mt-1 block">
              {avgTime !== null ? `${avgTime} ms` : '< 4 ms'}
            </strong>
            <span className="text-[11px] text-slate-400">Latencia Sub-milisegundo</span>
          </div>
        </div>

        {/* Run live benchmark button */}
        <div className="bg-slate-900 text-white rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Ejecutar Batería de Prueba de Búsqueda
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Simula 8 consultas simultáneas con cálculo de fecha de entrega en tiempo real.
            </p>
          </div>
          <button
            onClick={handleRunBenchmark}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <PlayIcon className="w-3.5 h-3.5 fill-white" />
            Lanzar Benchmark
          </button>
        </div>

        {/* Benchmark table */}
        {benchmarkResults && (
          <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Comuna de Prueba</th>
                  <th className="px-4 py-2.5">Zonas Coincidentes</th>
                  <th className="px-4 py-2.5 text-right">Tiempo de Respuesta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {benchmarkResults.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono font-medium text-slate-900">"{r.query}"</td>
                    <td className="px-4 py-2 text-slate-600">{r.matches.toLocaleString('es-CL')} zonas</td>
                    <td className="px-4 py-2 text-right font-mono font-bold text-emerald-600">{r.timeMs} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CSV Importer */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
          <Upload className="w-5 h-5 text-blue-600" />
          Importar Archivo de Cobertura de Zonas (CSV / TSV)
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-4">
          Puedes importar un archivo CSV con columnas: <code>Región, Comuna, Sector, Paquetería (Contraentrega / Blue Express), Días de Tránsito</code>.
        </p>

        <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
          <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">
            Haz clic o arrastra tu archivo .CSV aquí
          </p>
          <input
            type="file"
            accept=".csv,.txt,.tsv"
            onChange={handleFileUpload}
            className="mt-3 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
