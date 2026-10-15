import React, { useState, useMemo, useEffect } from 'react';
import { ActiveTab, AppsScriptConfig, ZoneDeliveryRecord, OperatorProfile, RosterOperator, CampaignId } from './types/coverage';
import { generateSeedData } from './data/chileanCoverageData';
import { generateParaguaySeedData } from './data/paraguayCoverageData';
import { INITIAL_ROSTER } from './data/operatorRoster';
import { SearchEngine } from './utils/searchEngine';
import { Header } from './components/Header';
import { SearchValidator } from './components/SearchValidator';
import { OrderCreator } from './components/OrderCreator';
import { BatchValidator } from './components/BatchValidator';
import { RosterManager } from './components/RosterManager';
import { AppsScriptStudio } from './components/AppsScriptStudio';
import { DeploymentChecklist } from './components/DeploymentChecklist';
import { DatasetManager } from './components/DatasetManager';
import { AuthModal } from './components/AuthModal';
import { LinkNoEmailHelperModal } from './components/LinkNoEmailHelperModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('validator');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLinkHelperOpen, setIsLinkHelperOpen] = useState(false);

  // Active campaign: 'CHILE' or 'PARAGUAY'
  const [activeCampaign, setActiveCampaign] = useState<CampaignId>(() => {
    try {
      const saved = localStorage.getItem('VAL_COB_ACTIVE_CAMPAIGN');
      if (saved === 'CHILE' || saved === 'PARAGUAY') return saved;
    } catch (e) {}
    return 'CHILE';
  });

  // Save active campaign when changed
  const handleCampaignChange = (campaign: CampaignId) => {
    setActiveCampaign(campaign);
    try {
      localStorage.setItem('VAL_COB_ACTIVE_CAMPAIGN', campaign);
    } catch (e) {}
  };

  // Roster of operators from the Google Sheet
  const [roster, setRoster] = useState<RosterOperator[]>(() => {
    try {
      const saved = localStorage.getItem('VAL_COB_ROSTER_SHEET');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_ROSTER;
  });

  // Current logged in operator session
  const [currentOperator, setCurrentOperator] = useState<OperatorProfile>(() => {
    try {
      const saved = localStorage.getItem('VAL_COB_SESION_ACTIVA');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'OP-DAVID',
      nombre: 'DAVID VABLOS',
      codigoOperador: 'PEROP1AM-15609',
      pais: 'Chile',
      campanasAsignadas: ['CHILE', 'Chile 1-1', 'Chile-PS-Auto'],
      teamleader: 'DIRECCIÓN',
      turno: '07:00-16:00'
    };
  });

  // When operator changes or logs in, auto-adjust campaign if their profile specifies it
  const handleOperatorLogin = (op: OperatorProfile) => {
    setCurrentOperator(op);
    try {
      localStorage.setItem('VAL_COB_SESION_ACTIVA', JSON.stringify(op));
    } catch (e) {}

    const isPy = op.campanasAsignadas?.some(c => c.toUpperCase().includes('PARAGUAY')) || op.pais?.toUpperCase().includes('PARAGUAY');
    if (isPy) {
      handleCampaignChange('PARAGUAY');
    }
  };

  // Chilean Coverage Records dataset
  const [chileRecords, setChileRecords] = useState<ZoneDeliveryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('VAL_COB_CHILE_RECORDS');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return generateSeedData(1400);
  });

  // Paraguayan Coverage Records dataset
  const [paraguayRecords, setParaguayRecords] = useState<ZoneDeliveryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('VAL_COB_PARAGUAY_RECORDS');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return generateParaguaySeedData();
  });

  // Active records based on active campaign
  const activeRecords = useMemo(() => {
    return activeCampaign === 'CHILE' ? chileRecords : paraguayRecords;
  }, [activeCampaign, chileRecords, paraguayRecords]);

  // Handle updating records for the active campaign
  const handleUpdateRecords = (newRecords: ZoneDeliveryRecord[]) => {
    if (activeCampaign === 'CHILE') {
      setChileRecords(newRecords);
      try {
        localStorage.setItem('VAL_COB_CHILE_RECORDS', JSON.stringify(newRecords));
      } catch (e) {}
    } else {
      setParaguayRecords(newRecords);
      try {
        localStorage.setItem('VAL_COB_PARAGUAY_RECORDS', JSON.stringify(newRecords));
      } catch (e) {}
    }
  };

  // Search Engine instantiation for active campaign
  const searchEngine = useMemo(() => {
    return new SearchEngine(activeRecords);
  }, [activeRecords]);

  // Save roster when updated
  const handleUpdateRoster = (newRoster: RosterOperator[]) => {
    setRoster(newRoster);
    try {
      localStorage.setItem('VAL_COB_ROSTER_SHEET', JSON.stringify(newRoster));
    } catch (e) {}
  };

  const handleUpdateOperatorPin = (operatorId: string, pin: string) => {
    const updated = roster.map(op => (op.id === operatorId ? { ...op, pinPersonal: pin, registrado: true } : op));
    handleUpdateRoster(updated);
  };

  // Apps Script configuration state
  const [config, setConfig] = useState<AppsScriptConfig>({
    sourceSpreadsheetId: '1wP9_COBERTURA_DESPACHO_MULTICAMPANA_50K',
    sourceSheetName: 'Actualizacion de Datos del Operador',
    headerRow: 1,
    indexSpreadsheetId: '1zK8_INDICE_DESPACHO_ADMIN_MULTICAMPANA',
    indexSheetName: 'INDICE_COBERTURA',
    requireAllowlist: false, // Acceso 100% público sin correo
    maxResults: 100,
    minQueryLength: 2,
    lockTimeoutMs: 30000,
    authMode: 'public_universal',
    operatorPin: '1234',
    enableAtomicRebuild: true
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeCampaign={activeCampaign}
        onCampaignChange={handleCampaignChange}
        totalRecords={activeRecords.length}
        currentOperator={currentOperator}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenLinkHelperModal={() => setIsLinkHelperOpen(true)}
      />

      {/* Persistent Help Banner for Opening on Other PCs */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white text-xs px-4 py-2.5 border-b border-emerald-600/40 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
            <span className="text-slate-100">
              <strong>¿El link le pide correo a los operadores en otra PC?</strong> Se debe a la versión de Apps Script o cuenta Workspace. Puedes solucionarlo en 3 clics o descargar la app web portátil sin login con datos de Chile y Paraguay.
            </span>
          </div>
          <button
            onClick={() => setIsLinkHelperOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer"
          >
            Ver Solución y Descargar (.html)
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'validator' && (
          <SearchValidator
            engine={searchEngine}
            currentOperator={currentOperator}
            activeCampaign={activeCampaign}
            onCampaignChange={handleCampaignChange}
            onSelectForOrder={() => setActiveTab('order-creator')}
          />
        )}

        {activeTab === 'order-creator' && (
          <OrderCreator
            engine={searchEngine}
            currentOperator={currentOperator}
            activeCampaign={activeCampaign}
            onCampaignChange={handleCampaignChange}
          />
        )}

        {activeTab === 'batch' && (
          <BatchValidator
            engine={searchEngine}
            currentOperator={currentOperator}
            activeCampaign={activeCampaign}
            onCampaignChange={handleCampaignChange}
          />
        )}

        {activeTab === 'roster' && (
          <RosterManager
            roster={roster}
            onUpdateRoster={handleUpdateRoster}
            currentOperator={currentOperator}
            onSelectOperator={(op) => {
              setCurrentOperator(op);
              const isPy = op.campanasAsignadas?.some(c => c.toUpperCase().includes('PARAGUAY')) || op.pais?.toUpperCase().includes('PARAGUAY');
              if (isPy) handleCampaignChange('PARAGUAY');
            }}
          />
        )}

        {activeTab === 'script-generator' && (
          <AppsScriptStudio
            config={config}
            onConfigChange={setConfig}
            records={activeRecords}
          />
        )}

        {activeTab === 'deployment-guide' && (
          <DeploymentChecklist />
        )}

        {activeTab === 'dataset' && (
          <DatasetManager
            records={activeRecords}
            onUpdateRecords={handleUpdateRecords}
            engine={searchEngine}
            activeCampaign={activeCampaign}
            onCampaignChange={handleCampaignChange}
          />
        )}
      </main>

      {/* Operator Login and Registration Modal */}
      <AuthModal
        roster={roster}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleOperatorLogin}
        onUpdateOperatorPin={handleUpdateOperatorPin}
      />

      {/* Helper Modal to Fix Link Requiring Email on Other PCs */}
      <LinkNoEmailHelperModal
        isOpen={isLinkHelperOpen}
        onClose={() => setIsLinkHelperOpen(false)}
        records={activeRecords}
      />

      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-slate-300">
            Validador Multicampaña de Cobertura y Despacho · Chile 🇨🇱 y Paraguay 🇵🇾 · Acceso Público sin Correo Obligatorio
          </p>
          <p className="mt-1 text-[11px] text-slate-400">
            Plataforma operativa para asesores de televentas. Registro y credenciales según nómina compartida de Google Sheets ({roster.length} asesores activos).
          </p>
        </div>
      </footer>
    </div>
  );
}
