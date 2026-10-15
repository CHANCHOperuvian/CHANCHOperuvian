import React, { useState } from 'react';
import { ZoneDeliveryRecord } from '../types/coverage';
import { generatePortableHtml } from '../utils/portableHtmlGenerator';
import { 
  X, 
  Globe, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Copy, 
  Check, 
  ExternalLink,
  Laptop,
  Share2,
  FileCode,
  ShieldCheck,
  MousePointerClick
} from 'lucide-react';

interface LinkNoEmailHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ZoneDeliveryRecord[];
}

export const LinkNoEmailHelperModal: React.FC<LinkNoEmailHelperModalProps> = ({
  isOpen,
  onClose,
  records
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPortable = () => {
    const htmlContent = generatePortableHtml(records);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Validador_Multicampana_Sin_Correo.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Solución: Abrir el enlace en otra PC SIN pedir correo
              </h2>
              <p className="text-xs text-slate-500">
                Por qué Google solicita correo en otros equipos y cómo solucionarlo en 3 clics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 py-4 text-xs sm:text-sm">
          {/* Solución 1 Destacada: Archivo Portátil 100% Sin Login */}
          <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Solución 1: Archivo Web Autónomo (100% Garantizado Sin Login)
              </span>
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Recomendada
              </span>
            </div>
            <p className="text-emerald-950 text-xs leading-relaxed">
              Descarga este archivo HTML único. Contiene las <strong>{records.length} zonas de Chile</strong>, las paqueterías (Contraentrega y Blue Express), cálculo de fechas y Google Maps. <strong>No requiere Google, no requiere servidor ni correo</strong>. Los operadores pueden abrirlo en cualquier PC simplemente haciendo doble clic o enviándolo por WhatsApp.
            </p>
            <button
              onClick={handleDownloadPortable}
              className="mt-2 w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 text-xs"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Validador_Chile_Sin_Correo.html ({records.length} Zonas)</span>
            </button>
          </div>

          {/* Solución 2: Ajuste en Google Apps Script */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-blue-600" />
              Solución 2: Si estás usando el enlace de Google Apps Script
            </h3>
            <p className="text-slate-600 text-xs">
              Si tu enlace es de Google Apps Script (<code>script.google.com/macros/s/.../exec</code>) y al abrirlo en otra PC pide correo, es por uno de estos 2 motivos:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">1</span>
                  No se seleccionó "Nueva versión" al volver a implementar:
                </div>
                <p className="text-slate-600 pl-5">
                  En Apps Script, cuando cambias el código, Google <strong>no actualiza el enlace web automáticamente</strong>. Sigue mostrando la versión vieja.
                  <br />
                  <strong>Solución:</strong> En Apps Script ve a <strong>Implementar &gt; Gestionar implementaciones &gt; Clic en el icono del Lápiz (Editar) &gt; Versión: "Nueva versión" &gt; Implementar</strong>.
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">2</span>
                  Cuenta corporativa de Workspace (con dominio @empresa):
                </div>
                <p className="text-slate-600 pl-5">
                  Las empresas bloquean que gente fuera de la empresa acceda sin correo.
                  <br />
                  <strong>Solución:</strong> Crea la hoja o el script desde una cuenta personal <strong>@gmail.com</strong> (ej. <code>davideddyvablos@gmail.com</code>). En cuentas @gmail.com, Google permite seleccionar <strong>"Quién tiene acceso: Cualquier usuario"</strong> y jamás pide correo a los operadores.
                </p>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                  El enlace debe terminar en <code>/exec</code> (NUNCA en <code>/dev</code>):
                </div>
                <p className="text-slate-600 pl-5">
                  El enlace de prueba que termina en <code>/dev</code> siempre exige iniciar sesión. El enlace público para operadores termina obligatoriamente en <code>/exec</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Solución 3: Usar el link de esta Web App */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-blue-600" />
              Solución 3: Compartir el enlace directo de este Validador Web
            </span>
            <p className="text-blue-950 text-xs">
              Puedes copiar y enviar el enlace de esta aplicación web para que los operadores lo usen desde cualquier navegador:
            </p>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 p-2 font-mono text-xs bg-white border border-blue-300 rounded-lg text-slate-700 select-all"
              />
              <button
                onClick={handleCopyCurrentUrl}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Entendido, Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
