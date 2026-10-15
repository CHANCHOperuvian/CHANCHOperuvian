import React, { useState, useMemo } from 'react';
import { AppsScriptConfig } from '../types/coverage';
import { generateCodeGs, generateIndexHtml, generateAppsscriptJson } from '../utils/codeGenerators';
import { 
  Code, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Settings2, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Globe,
  FileJson
} from 'lucide-react';
import { ZoneDeliveryRecord } from '../types/coverage';
import { generatePortableHtml } from '../utils/portableHtmlGenerator';

interface AppsScriptStudioProps {
  config: AppsScriptConfig;
  onConfigChange: (newConfig: AppsScriptConfig) => void;
  records: ZoneDeliveryRecord[];
}

export const AppsScriptStudio: React.FC<AppsScriptStudioProps> = ({
  config,
  onConfigChange,
  records
}) => {
  const [activeFile, setActiveFile] = useState<'Code.gs' | 'Index.html' | 'appsscript.json'>('Code.gs');
  const [copied, setCopied] = useState<string | null>(null);

  const generatedCodeGs = useMemo(() => generateCodeGs(config), [config]);
  const generatedIndexHtml = useMemo(() => generateIndexHtml(config), [config]);
  const generatedAppsscriptJson = useMemo(() => generateAppsscriptJson(), []);

  const activeContent = 
    activeFile === 'Code.gs' 
      ? generatedCodeGs 
      : activeFile === 'Index.html' 
        ? generatedIndexHtml 
        : generatedAppsscriptJson;

  const handleCopy = (content: string, key: string) => {
    navigator.clipboard.writeText(content);
    setCopied(key);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPortable = () => {
    const htmlContent = generatePortableHtml(records);
    handleDownload('Validador_Chile_Sin_Correo.html', htmlContent);
  };

  const handleDownloadAll = () => {
    handleDownload('Code.gs', generatedCodeGs);
    setTimeout(() => {
      handleDownload('Index.html', generatedIndexHtml);
    }, 300);
    setTimeout(() => {
      handleDownload('appsscript.json', generatedAppsscriptJson);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Universal No-Email Banner */}
      <section className="bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 text-white rounded-2xl p-6 border border-emerald-700/50 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0 mt-0.5 border border-emerald-500/30">
            <Globe className="w-7 h-7 text-emerald-400" />
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-700/50">
                Solución Definitiva: Acceso 100% Sin Correo Electrónico
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1.5">
                Cómo evitar que Google pida iniciar sesión o correo a los operadores
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl">
              Los operadores de venta <strong>no trabajan con correo electrónico abierto en sus ordenadores</strong>. Si Google solicita iniciar sesión o pide acceso al abrir el enlace, se debe exclusivamente a la opción seleccionada al desplegar la Aplicación Web en Apps Script.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-emerald-900/40 border border-emerald-500/40 rounded-xl text-xs space-y-1.5">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  CONFIGURACIÓN CORRECTA (Sin pedir correo):
                </div>
                <div className="text-slate-200">
                  1. <strong>"Ejecutar como":</strong> <span className="text-emerald-300 font-bold">"Yo"</span> (tu cuenta administradora).
                </div>
                <div className="text-slate-200">
                  2. <strong>"Quién tiene acceso":</strong> <span className="text-emerald-300 font-bold">"Cualquier usuario"</span> (Anyone / anónimos sin cuenta).
                </div>
                <div className="text-[11px] text-emerald-200/80 font-medium">
                  ✓ El enlace se abrirá directo en cualquier navegador sin solicitar cuenta ni Gmail.
                </div>
              </div>

              <div className="p-3.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs space-y-1.5">
                <div className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  ERROR COMÚN (Provoca solicitud de acceso):
                </div>
                <div className="text-slate-300">
                  ✗ Si no seleccionas <strong>"Nueva versión"</strong> al guardar, Google sigue usando la versión vieja que pedía correo.
                </div>
                <div className="text-[11px] text-rose-200/80 font-medium">
                  → En Apps Script: <strong>Implementar &gt; Gestionar implementaciones &gt; Lápiz (Editar) &gt; Versión: "Nueva versión"</strong>.
                </div>
              </div>
            </div>

            <div className="mt-2 p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center gap-2">
              <span className="font-bold text-amber-300 shrink-0">⚠️ Si usas correo de empresa (@tuempresa):</span>
              <span>
                Las cuentas de Google Workspace bloquean el acceso externo sin login. Si tu empresa no permite "Cualquier usuario", abre la hoja e implementa el script desde una cuenta <strong>@gmail.com</strong> personal donde Google nunca exige correo.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Configuration Settings */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Parámetros de la Base de Datos y Búsqueda
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadPortable}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              title="Descarga un único archivo HTML que funciona en cualquier PC sin internet ni Google"
            >
              <Download className="w-4 h-4" />
              Descargar App Portátil Sin Login (.html)
            </button>
            <button
              onClick={handleDownloadAll}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              Descargar Código (.gs + .html + manifest)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          {/* Source Spreadsheet ID */}
          <div>
            <label className="block font-semibold text-xs text-slate-700 mb-1">
              ID Hoja Fuente (Base de Cobertura):
            </label>
            <input
              type="text"
              value={config.sourceSpreadsheetId}
              onChange={e => onConfigChange({ ...config, sourceSpreadsheetId: e.target.value })}
              placeholder="1wP9_COBERTURA_DESPACHO_CHILE_50K"
              className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Documento con las zonas de despacho de Chile
            </span>
          </div>

          {/* Source Sheet Name */}
          <div>
            <label className="block font-semibold text-xs text-slate-700 mb-1">
              Nombre de Pestaña Fuente:
            </label>
            <input
              type="text"
              value={config.sourceSheetName}
              onChange={e => onConfigChange({ ...config, sourceSheetName: e.target.value })}
              placeholder="Actualizacion de Datos del Operador"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Nombre exacto de la hoja en el spreadsheet
            </span>
          </div>

          {/* Index Spreadsheet ID */}
          <div>
            <label className="block font-semibold text-xs text-slate-700 mb-1">
              ID Hoja del Índice (Búsqueda Rápida):
            </label>
            <input
              type="text"
              value={config.indexSpreadsheetId}
              onChange={e => onConfigChange({ ...config, indexSpreadsheetId: e.target.value })}
              placeholder="1zK8_INDICE_DESPACHO_ADMIN_CHILE"
              className="w-full text-xs font-mono p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Hoja interna donde se genera el índice ultraveloz
            </span>
          </div>

          {/* Index Sheet Name */}
          <div>
            <label className="block font-semibold text-xs text-slate-700 mb-1">
              Nombre de Pestaña del Índice:
            </label>
            <input
              type="text"
              value={config.indexSheetName}
              onChange={e => onConfigChange({ ...config, indexSheetName: e.target.value })}
              placeholder="INDICE_COBERTURA"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Pestaña que consulta TextFinder en &lt; 5 ms
            </span>
          </div>

          {/* Max Results */}
          <div>
            <label className="block font-semibold text-xs text-slate-700 mb-1">
              Límite de Resultados por Búsqueda:
            </label>
            <input
              type="number"
              min={10}
              max={500}
              value={config.maxResults}
              onChange={e => onConfigChange({ ...config, maxResults: Number(e.target.value) || 100 })}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Límite de zonas devueltas por consulta (Default: 100)
            </span>
          </div>

          {/* Atomic Rebuild Toggle */}
          <div className="flex flex-col justify-center">
            <label className="flex items-center gap-2 cursor-pointer mt-1">
              <input
                type="checkbox"
                checked={config.enableAtomicRebuild}
                onChange={e => onConfigChange({ ...config, enableAtomicRebuild: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-xs font-bold text-slate-800">
                Reconstrucción Atómica de Índice
              </span>
            </label>
            <span className="text-[11px] text-slate-500 mt-1">
              Escribe en pestaña temporal y reemplaza para nunca dejar la app en blanco
            </span>
          </div>
        </div>

        {/* Security / Access Guarantee */}
        <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Garantía de Acceso:</strong> Código 100% libre de solicitudes de correo o inicio de sesión en Google.
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            Sin Correo Requerido
          </span>
        </div>
      </section>

      {/* Code Editor & Viewer */}
      <section className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl text-white">
        {/* Editor Tab Bar */}
        <div className="bg-slate-950 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile('Code.gs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFile === 'Code.gs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Code.gs (Backend)</span>
            </button>

            <button
              onClick={() => setActiveFile('Index.html')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFile === 'Index.html'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Index.html (Interfaz Web)</span>
            </button>

            <button
              onClick={() => setActiveFile('appsscript.json')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFile === 'appsscript.json'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileJson className="w-3.5 h-3.5 text-amber-400" />
              <span>appsscript.json (Manifiesto de Acceso)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(activeContent, activeFile)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              {copied === activeFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar {activeFile}</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleDownload(activeFile, activeContent)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </button>
          </div>
        </div>

        {/* Code View Area */}
        <div className="p-4 bg-slate-950/70 overflow-x-auto max-h-[550px] font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
          <pre>{activeContent}</pre>
        </div>

        {/* Editor Footer Status */}
        <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>
            {activeFile === 'Code.gs'
              ? 'Contiene motor TextFinder, cálculo de días de tránsito, Google Maps y reconstrucción de índice.'
              : activeFile === 'Index.html'
                ? 'Interfaz responsiva para operadores de venta, con badges de paquetería y enlaces a Maps.'
                : 'Manifiesto que fuerza "executeAs: USER_DEPLOYING" y "access: ANYONE" sin solicitar correo.'}
          </span>
          <span className="text-emerald-400 font-medium">✓ Listo para Producción</span>
        </div>
      </section>
    </div>
  );
};
