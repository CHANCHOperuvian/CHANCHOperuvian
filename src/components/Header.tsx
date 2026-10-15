import React from 'react';
import { ActiveTab, OperatorProfile, CampaignId } from '../types/coverage';
import { 
  Search, 
  ListChecks, 
  Code, 
  BookOpen, 
  Database, 
  Truck, 
  ShoppingCart, 
  Users, 
  LogIn, 
  UserCircle2,
  Globe
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeCampaign: CampaignId;
  onCampaignChange: (campaign: CampaignId) => void;
  totalRecords: number;
  currentOperator: OperatorProfile;
  onOpenAuthModal: () => void;
  onOpenLinkHelperModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeCampaign,
  onCampaignChange,
  totalRecords,
  currentOperator,
  onOpenAuthModal,
  onOpenLinkHelperModal
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar info */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2 border-b border-slate-800 text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onOpenLinkHelperModal}
              className="inline-flex items-center gap-1.5 font-bold tracking-wide uppercase text-xs text-white bg-emerald-600 hover:bg-emerald-500 px-3 py-1 rounded-lg shadow-sm transition-all border border-emerald-400/50 cursor-pointer animate-pulse"
              title="Haz clic si en otra PC el link pide correo"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>¿Pide correo en otra PC? Clic para Solucionar</span>
            </button>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-slate-300 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Zonas {activeCampaign}: <strong className="text-white">{totalRecords.toLocaleString('es-CL')}</strong>
            </span>
            <span className="hidden lg:inline text-slate-600">|</span>
            <span className="hidden lg:inline text-amber-300 font-medium">
              {activeCampaign === 'CHILE' 
                ? 'Contraentrega (Efectivo/Transferencia) · Blue Express (Solo Efectivo)'
                : 'Take and go · Take and go Interior · JCG (Cobro en Guaraníes ₲ / Efectivo y Transferencia)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Campaign Switcher Pills in Topbar */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-700/80 shadow-inner">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2">Campaña:</span>
              <button
                type="button"
                onClick={() => onCampaignChange('CHILE')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeCampaign === 'CHILE'
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Cambiar a Campaña Chile"
              >
                <span>🇨🇱</span>
                <span>CHILE</span>
              </button>
              <button
                type="button"
                onClick={() => onCampaignChange('PARAGUAY')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  activeCampaign === 'PARAGUAY'
                    ? 'bg-red-600 text-white shadow-sm ring-1 ring-red-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title="Cambiar a Campaña Paraguay"
              >
                <span>🇵🇾</span>
                <span>PARAGUAY</span>
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1 rounded-lg border border-slate-700">
              <UserCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 leading-none">Asesor en sesión:</span>
                <span className="text-xs font-bold text-white leading-tight truncate max-w-[170px]">
                  {currentOperator.nombre.split(' ')[0]} {currentOperator.nombre.split(' ')[1] || ''} ({currentOperator.codigoOperador})
                </span>
              </div>
              <button
                onClick={onOpenAuthModal}
                className="ml-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 bg-slate-900/60 hover:bg-slate-900 px-2 py-1 rounded border border-slate-700 cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>Cambiar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Title and navigation tabs */}
        <div className="py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-xl shadow-md text-white shrink-0 ${
                activeCampaign === 'CHILE' 
                  ? 'bg-blue-600 shadow-blue-500/20' 
                  : 'bg-red-600 shadow-red-500/20'
              }`}>
                {activeCampaign === 'CHILE' ? 'CL' : 'PY'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    Validador Multicampaña de Despacho
                  </h1>
                  <span className={`text-[11px] font-bold border px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                    activeCampaign === 'CHILE'
                      ? 'bg-blue-950 text-blue-300 border-blue-700/60'
                      : 'bg-red-950 text-red-300 border-red-700/60'
                  }`}>
                    <span>{activeCampaign === 'CHILE' ? '🇨🇱 Campaña CHILE' : '🇵🇾 Campaña PARAGUAY'}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  </span>
                  <span className="text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2.5 py-0.5 rounded-full">
                    Pago Contra Entrega (COD)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {activeCampaign === 'CHILE'
                    ? 'Despacho en Chile: Duston Gel, FlexiGo, Glowy Care, Oxys · Couriers Blue Express y Contraentrega con fecha estimada y Google Maps.'
                    : 'Despacho en Paraguay: Tridentex, Oxys Serum, Sustarox Gel · Couriers Take and go, Take and go Interior y JCG en 16 Departamentos.'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('validator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'validator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              Validar Cobertura
            </button>

            <button
              onClick={() => setActiveTab('order-creator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'order-creator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              Tomar Pedido COD
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'batch'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              Lotes de Clientes
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'roster'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 text-amber-400" />
              Nómina Sheet
            </button>

            <button
              onClick={() => setActiveTab('script-generator')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'script-generator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Code className="w-4 h-4" />
              Código Apps Script
            </button>

            <button
              onClick={() => setActiveTab('deployment-guide')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'deployment-guide'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Guía Despliegue
            </button>

            <button
              onClick={() => setActiveTab('dataset')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === 'dataset'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4" />
              Base 50k+
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
