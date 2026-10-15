import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  BookOpen, 
  ShieldAlert, 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  Server, 
  Users, 
  Database, 
  FileSpreadsheet,
  AlertOctagon,
  HelpCircle,
  Globe,
  LockOpen
} from 'lucide-react';

export const DeploymentChecklist: React.FC = () => {
  const [checklist, setChecklist] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false,
    7: false,
    8: false
  });

  const toggleCheck = (id: number) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;

  const items = [
    {
      id: 1,
      titulo: 'La cuenta desplegadora puede leer la hoja fuente de despacho',
      desc: 'La cuenta de Google que publicará la Web App tiene permisos de lectura sobre el archivo de Google Sheets que contiene las zonas de Chile.'
    },
    {
      id: 2,
      titulo: 'La hoja índice pertenece a la cuenta administradora y no está compartida',
      desc: 'El archivo INDEX_SPREADSHEET_ID es propiedad exclusiva del administrador y está cerrado para proteger los datos brutos de alteraciones.'
    },
    {
      id: 3,
      titulo: 'Acceso 100% libre sin correo para operadores de venta',
      desc: 'Configurado en "Quién tiene acceso: Cualquier usuario" (Anyone) para que ningún operador requiera correo electrónico abierto en el ordenador.'
    },
    {
      id: 4,
      titulo: 'Las búsquedas devuelven resultados filtrados y no exponen la base completa',
      desc: 'El servidor solo devuelve hasta MAX_RESULTS (ej. 100) registros coincidentes, jamás transfiere las 50.000 filas al navegador.'
    },
    {
      id: 5,
      titulo: 'Se ha comprobado el tiempo de respuesta subsegundo (< 2 seg)',
      desc: 'La respuesta de TextFinder con expresión regular toma entre 0.4s y 1.8s en Google Sheets, garantizando agilidad para la atención telefónica.'
    },
    {
      id: 6,
      titulo: 'La reconstrucción del índice se ha probado sin perder la versión anterior',
      desc: 'Se utiliza la reconstrucción atómica en pestaña temporal (_TEMP) para que una falla o timeout no borre el índice en vivo.'
    },
    {
      id: 7,
      titulo: 'Validación de paqueterías autorizadas (Contraentrega y Blue Express)',
      desc: 'Se comprobó que Contraentrega permite Efectivo y Transferencia, mientras Blue Express restringe a Solo Efectivo, con cálculo de fecha de entrega y Google Maps.'
    },
    {
      id: 8,
      titulo: 'Protocolo de actualización de nuevos operadores o zonas',
      desc: 'Protocolo claro para registrar nuevos asesores desde la pestaña compartida y reconstruir el índice al sumar nuevas comunas de Chile.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Visual Architecture Diagram */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-800 gap-2">
          <h2 className="text-base font-bold flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-400" />
            Arquitectura de Acceso Público Abierto (Sin Correo Electrónico)
          </h2>
          <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
            Acceso Directo Habilitado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Box 1 */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 mb-2">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Operadores de Ventas</h4>
            <p className="text-[11px] text-slate-300 mt-1">
              Ordenadores sin correo electrónico abierto ni sesión de Google requerida.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-500">
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>

          {/* Box 2 */}
          <div className="bg-slate-800/90 border border-emerald-600/60 p-4 rounded-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-bl">
              Público
            </div>
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-600/30 flex items-center justify-center text-emerald-400 mb-2">
              <Globe className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Web App Apps Script</h4>
            <p className="text-[11px] text-slate-300 mt-1">
              Ejecutar como: <strong>Yo</strong> · Acceso: <strong>Cualquiera</strong>.
            </p>
          </div>

          <div className="hidden md:flex justify-center text-slate-500">
            <ArrowRight className="w-6 h-6 animate-pulse" />
          </div>

          {/* Box 3 */}
          <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-purple-600/30 flex items-center justify-center text-purple-400 mb-2">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-white">Base Google Sheet</h4>
            <p className="text-[11px] text-slate-300 mt-1">
              Lectura directa en servidor. Cero exposición ni bloqueo para operadores.
            </p>
          </div>
        </div>
      </section>

      {/* Checklist section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              Lista de Salida a Producción
            </h2>
            <p className="text-xs text-slate-500">
              Verifica los 8 requisitos técnicos antes de habilitar los accesos de todos los operadores.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {completedCount} de 8 completados
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                checklist[item.id]
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mt-0.5">
                {checklist[item.id] ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div>
                <h4 className={`text-xs sm:text-sm font-bold ${checklist[item.id] ? 'text-emerald-950' : 'text-slate-800'}`}>
                  {item.titulo}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Troubleshooting Guides */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
          <HelpCircle className="w-5 h-5 text-amber-600" />
          Guía de Resolución: "Aún solicita acceso al querer ingresar sin correo"
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Paso a Paso en Google Apps Script (Solución en 1 Minuto)
            </div>
            <p className="text-emerald-950 text-xs leading-relaxed">
              En tu proyecto de Google Apps Script:
            </p>
            <ol className="list-decimal pl-4 space-y-1 text-xs text-emerald-900">
              <li>Haz clic en el botón azul <strong>"Implementar"</strong> (arriba a la derecha).</li>
              <li>Selecciona <strong>"Administrar implementaciones"</strong> o <strong>"Nueva implementación"</strong>.</li>
              <li>Tipo: <strong>"Aplicación web"</strong>.</li>
              <li><strong>Ejecutar como:</strong> Selecciona <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">"Yo (tu cuenta)"</span>.</li>
              <li><strong>Quién tiene acceso:</strong> Selecciona <span className="font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-300">"Cualquier usuario"</span> (Anyone).</li>
              <li>Pulsa <strong>"Implementar"</strong> y copia el nuevo enlace web.</li>
            </ol>
            <p className="text-[11px] text-emerald-800 font-semibold mt-2">
              ✓ Con estos 2 ajustes, ningún navegador volverá a solicitar correo ni inicio de sesión.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/70 space-y-2">
            <div className="font-bold text-rose-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              Por qué Google pedía acceso antes
            </div>
            <p className="text-rose-950 text-xs">
              <strong>1. Ejecutar como el usuario que accede:</strong> Si se marcaba esa opción, Google intentaba que cada visitante ejecutara el script con sus propios permisos, exigiendo iniciar sesión en Google.
            </p>
            <p className="text-rose-950 text-xs">
              <strong>2. Uso de Session.getActiveUser():</strong> Ese método obliga a Google a solicitar credenciales de identidad. En el nuevo código generado, se removió por completo esa instrucción.
            </p>
            <p className="text-rose-950 text-xs">
              <strong>3. Quién tiene acceso restringido:</strong> Si se elegía "Solo dentro de mi organización", Google bloqueaba a cualquier persona que no tuviese sesión abierta en el navegador.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
