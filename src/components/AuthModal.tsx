import React, { useState } from 'react';
import { RosterOperator, OperatorProfile } from '../types/coverage';
import { buscarEnNomina } from '../data/operatorRoster';
import { 
  KeyRound, 
  UserCheck, 
  ShieldAlert, 
  CheckCircle2, 
  User, 
  LogIn, 
  X,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';

interface AuthModalProps {
  roster: RosterOperator[];
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: OperatorProfile) => void;
  onUpdateOperatorPin: (operatorId: string, pin: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  roster,
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [modo, setModo] = useState<'lista' | 'codigo'>('lista');
  const [identificador, setIdentificador] = useState('');
  const [selectedAsesorId, setSelectedAsesorId] = useState('');
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filtrar asesores que tienen nombre
  const asesoresValidos = roster.filter(r => r.nombreAsesor && r.nombreAsesor !== 'ASESOR NO IDENTIFICADO');

  const handleLoginPorLista = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsesorId) {
      setMensajeError('Por favor selecciona tu nombre de la lista de asesores.');
      return;
    }

    const match = roster.find(r => r.id === selectedAsesorId);
    if (!match) return;

    const isPy = match.campana?.toUpperCase().includes('PARAGUAY');
    const profile: OperatorProfile = {
      id: match.id,
      nombre: match.nombreAsesor,
      codigoOperador: match.codigoPerop,
      pais: isPy ? 'Paraguay' : 'Chile',
      campanasAsignadas: [match.campana || 'CHILE'],
      teamleader: match.teamleader,
      turno: match.turno
    };

    localStorage.setItem('VAL_COB_SESION_ACTIVA', JSON.stringify(profile));
    onLoginSuccess(profile);
    onClose();
  };

  const handleLoginPorCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);

    const match = buscarEnNomina(roster, identificador);
    if (!match) {
      setMensajeError(
        `No se encontró "${identificador}" en la nómina del documento. Verifica tu código PEROP (ej. PEROP1AM-40656) o tu nombre.`
      );
      return;
    }

    const isPy = match.campana?.toUpperCase().includes('PARAGUAY');
    const profile: OperatorProfile = {
      id: match.id,
      nombre: match.nombreAsesor,
      codigoOperador: match.codigoPerop,
      pais: isPy ? 'Paraguay' : 'Chile',
      campanasAsignadas: [match.campana || 'CHILE'],
      teamleader: match.teamleader,
      turno: match.turno
    };

    localStorage.setItem('VAL_COB_SESION_ACTIVA', JSON.stringify(profile));
    onLoginSuccess(profile);
    onClose();
  };

  const handleAccesoDirectoInvitado = () => {
    const guestProfile: OperatorProfile = {
      id: 'OP-VENTAS-DIRECTO',
      nombre: 'OPERADOR DE VENTAS (DIRECTO)',
      codigoOperador: 'PEROP-CHILE',
      pais: 'Chile',
      campanasAsignadas: ['CHILE 1-1', 'CHILE-PS-AUTO'],
      teamleader: 'CHILE TELEVENTAS'
    };
    localStorage.setItem('VAL_COB_SESION_ACTIVA', JSON.stringify(guestProfile));
    onLoginSuccess(guestProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Identificación de Asesor de Ventas
              </h3>
              <p className="text-xs text-slate-500">
                Sin correo electrónico · Acceso directo con tus datos de la hoja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Selector rápido vs Escribir código */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setModo('lista'); setMensajeError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              modo === 'lista' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Seleccionar mi Nombre de la Lista
          </button>
          <button
            type="button"
            onClick={() => { setModo('codigo'); setMensajeError(null); }}
            className={`flex-1 py-2 rounded-lg transition-all ${
              modo === 'codigo' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Escribir mi Código PEROP
          </button>
        </div>

        {modo === 'lista' ? (
          <form onSubmit={handleLoginPorLista} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Busca y selecciona tu nombre en la nómina:
              </label>
              <select
                value={selectedAsesorId}
                onChange={e => {
                  setSelectedAsesorId(e.target.value);
                  setMensajeError(null);
                }}
                className="w-full p-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none font-semibold text-slate-900 text-xs sm:text-sm"
              >
                <option value="">-- Elige tu nombre de asesor --</option>
                {asesoresValidos.map(op => (
                  <option key={op.id} value={op.id}>
                    {op.nombreAsesor} ({op.codigoPerop}) — Teamleader: {op.teamleader} ({op.campana})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 block mt-1">
                {asesoresValidos.length} asesores activos registrados en el documento.
              </span>
            </div>

            {selectedAsesorId && (() => {
              const sel = roster.find(r => r.id === selectedAsesorId);
              if (!sel) return null;
              return (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Datos Verificados:
                  </div>
                  <div>Asesor: <strong>{sel.nombreAsesor}</strong></div>
                  <div className="text-slate-600">Código: <strong>{sel.codigoPerop}</strong> · Teamleader: <strong>{sel.teamleader}</strong> · Turno: <strong>{sel.turno}</strong></div>
                </div>
              );
            })()}

            {mensajeError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{mensajeError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedAsesorId}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Ingresar con mis Credenciales</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginPorCodigo} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-800 mb-1.5">
                Escribe tu Código de Asesor (PEROP1AM o co-operator):
              </label>
              <input
                type="text"
                required
                value={identificador}
                onChange={e => {
                  setIdentificador(e.target.value);
                  setMensajeError(null);
                }}
                placeholder="Ej. PEROP1AM-40656 o PEROP1AM-15609"
                className="w-full p-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:border-blue-600 focus:outline-none font-mono font-bold text-slate-900 text-sm uppercase"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Puedes escribir tu código o tu nombre como figura en el Google Sheet.
              </span>
            </div>

            {mensajeError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{mensajeError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Validar e Ingresar</span>
            </button>
          </form>
        )}

        {/* Separator for instant guest access */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col items-center gap-2">
          <span className="text-[11px] text-slate-400">¿Solo necesitas consultar cobertura rápido?</span>
          <button
            type="button"
            onClick={handleAccesoDirectoInvitado}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Continuar sin Registrarme (Acceso Inmediato)
          </button>
        </div>
      </div>
    </div>
  );
};
