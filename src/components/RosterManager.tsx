import React, { useState, useMemo } from 'react';
import { RosterOperator, OperatorProfile } from '../types/coverage';
import { parsearCsvNomina } from '../data/operatorRoster';
import { 
  Users, 
  Search, 
  Upload, 
  CheckCircle2, 
  UserCheck, 
  Shield, 
  Clock, 
  RefreshCw, 
  Copy, 
  Check, 
  SlidersHorizontal,
  FileSpreadsheet,
  LogIn
} from 'lucide-react';

interface RosterManagerProps {
  roster: RosterOperator[];
  onUpdateRoster: (newRoster: RosterOperator[]) => void;
  currentOperator: OperatorProfile;
  onSelectOperator: (profile: OperatorProfile) => void;
}

export const RosterManager: React.FC<RosterManagerProps> = ({
  roster,
  onUpdateRoster,
  currentOperator,
  onSelectOperator
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamleader, setSelectedTeamleader] = useState('');
  const [selectedCampana, setSelectedCampana] = useState('');
  const [csvInput, setCsvInput] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Unique teamleaders and campaigns
  const teamleaders = useMemo(() => {
    const set = new Set(roster.map(r => r.teamleader).filter(Boolean));
    return Array.from(set);
  }, [roster]);

  const campanas = useMemo(() => {
    const set = new Set(roster.map(r => r.campana).filter(Boolean));
    return Array.from(set);
  }, [roster]);

  // Filtered operators
  const filteredOperators = useMemo(() => {
    return roster.filter(op => {
      if (selectedTeamleader && op.teamleader !== selectedTeamleader) return false;
      if (selectedCampana && op.campana !== selectedCampana) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchName = op.nombreAsesor.toLowerCase().includes(query);
        const matchCode = op.codigoPerop.toLowerCase().includes(query);
        const matchTl = op.teamleader.toLowerCase().includes(query);
        if (!matchName && !matchCode && !matchTl) return false;
      }
      return true;
    });
  }, [roster, selectedTeamleader, selectedCampana, searchTerm]);

  const handleImportCsv = () => {
    if (!csvInput.trim()) return;
    const parsed = parsearCsvNomina(csvInput);
    if (parsed.length > 0) {
      // Merge with existing avoiding duplicates
      const existingCodes = new Set(roster.map(r => r.codigoPerop.toUpperCase()));
      const filteredNew = parsed.filter(p => !existingCodes.has(p.codigoPerop.toUpperCase()));
      const updated = [...roster, ...filteredNew];
      onUpdateRoster(updated);
      alert(`¡Se agregaron ${filteredNew.length} nuevos asesores desde el Google Sheet!`);
      setCsvInput('');
      setShowImportBox(false);
    } else {
      alert('No se detectaron columnas válidas de asesor / PEROP en el texto pegado.');
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Nómina de Operadores Sincronizada desde Google Sheet
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Cualquier asesor que figure en el documento puede registrarse e iniciar sesión con sus credenciales.
            </p>
          </div>

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 self-start md:self-auto transition-colors"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>{showImportBox ? 'Ocultar Importador' : 'Actualizar desde Google Sheet'}</span>
          </button>
        </div>

        {/* CSV Import box */}
        {showImportBox && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Pegar Filas de la Pestaña "Actualizacion de Datos del Operador"
              </span>
              <span className="text-[11px] text-slate-500">
                Formato CSV / TSV con columnas: TEAMLEADER, ASESORES, PEROP1AM, CAMPAÑA, TURNO
              </span>
            </div>

            <textarea
              value={csvInput}
              onChange={e => setCsvInput(e.target.value)}
              rows={4}
              placeholder="Pega aquí las filas copiadas desde tu hoja de cálculo..."
              className="w-full p-3 font-mono text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowImportBox(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportCsv}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Procesar y Actualizar Nómina</span>
              </button>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <input
              type="search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por asesor, código PEROP o teamleader..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={selectedTeamleader}
            onChange={e => setSelectedTeamleader(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none"
          >
            <option value="">Todos los Teamleaders ({teamleaders.length})</option>
            {teamleaders.map(tl => (
              <option key={tl} value={tl}>{tl}</option>
            ))}
          </select>

          <select
            value={selectedCampana}
            onChange={e => setSelectedCampana(e.target.value)}
            className="text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:outline-none"
          >
            <option value="">Todas las Campañas</option>
            {campanas.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(searchTerm || selectedTeamleader || selectedCampana) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTeamleader('');
                setSelectedCampana('');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Limpiar
            </button>
          )}
        </div>
      </section>

      {/* Roster Table */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            Mostrando <strong>{filteredOperators.length}</strong> asesores autorizados
          </span>
          <span className="text-xs text-slate-500">
            Sesión actual: <strong>{currentOperator.nombre}</strong> ({currentOperator.codigoOperador})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Nombre Asesor</th>
                <th className="px-4 py-3">Código PEROP</th>
                <th className="px-4 py-3">Teamleader</th>
                <th className="px-4 py-3">Campaña</th>
                <th className="px-4 py-3">Turno</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOperators.map((op, i) => {
                const isActive = currentOperator.codigoOperador === op.codigoPerop;
                return (
                  <tr
                    key={op.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isActive ? 'bg-blue-50/70' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-slate-400 font-mono">{op.numero || i + 1}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-1.5">
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      <span>{op.nombreAsesor}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {op.codigoPerop}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-semibold">
                      {op.teamleader}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        op.campana.includes('CHILE') ? 'bg-emerald-100 text-emerald-900' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {op.campana}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{op.turno}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isActive ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-md">
                          En Sesión
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const profile: OperatorProfile = {
                              id: op.id,
                              nombre: op.nombreAsesor,
                              codigoOperador: op.codigoPerop,
                              pais: 'Chile',
                              campanasAsignadas: [op.campana],
                              teamleader: op.teamleader,
                              turno: op.turno
                            };
                            onSelectOperator(profile);
                            localStorage.setItem('VAL_COB_SESION_ACTIVA', JSON.stringify(profile));
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-blue-600 rounded-md transition-all inline-flex items-center gap-1"
                        >
                          <LogIn className="w-3 h-3" />
                          <span>Usar Sesión</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
