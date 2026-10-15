import React, { useState, useMemo, useEffect } from 'react';
import { ZoneDeliveryRecord, OperatorProfile, CampaignId } from '../types/coverage';
import { SearchEngine } from '../utils/searchEngine';
import { CHILE_REGIONS, COMUNAS_BY_REGION, LOCALIDADES_BY_COMUNA, CHILE_PRODUCTS } from '../data/chileanCoverageData';
import { PARAGUAY_DEPARTAMENTOS, CIUDADES_BY_DEPARTAMENTO, BARRIOS_BY_CIUDAD, PARAGUAY_PRODUCTS } from '../data/paraguayCoverageData';
import { calcularFechaEntrega, calcularFechaEntregaParaguay } from '../utils/transitCalculator';
import { 
  Search, 
  MapPin, 
  Truck, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  RotateCcw, 
  SlidersHorizontal, 
  PhoneCall, 
  Zap, 
  Table as TableIcon, 
  LayoutGrid, 
  ExternalLink,
  Globe,
  Compass,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';

interface SearchValidatorProps {
  engine: SearchEngine;
  currentOperator: OperatorProfile;
  activeCampaign: CampaignId;
  onCampaignChange: (campaign: CampaignId) => void;
  onSelectForOrder?: (record: ZoneDeliveryRecord) => void;
}

export const SearchValidator: React.FC<SearchValidatorProps> = ({
  engine,
  currentOperator,
  activeCampaign,
  onCampaignChange,
  onSelectForOrder
}) => {
  const [query, setQuery] = useState('');
  
  // Chilean filters
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');
  const [selectedLocalidad, setSelectedLocalidad] = useState('');

  // Paraguay filters
  const [selectedDepartamento, setSelectedDepartamento] = useState('');
  const [selectedCiudad, setSelectedCiudad] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('');
  const [selectedZipCode, setSelectedZipCode] = useState('');

  // Common filters
  const [selectedPaqueteria, setSelectedPaqueteria] = useState('');
  const [selectedMetodoPago, setSelectedMetodoPago] = useState('');
  const [selectedProducto, setSelectedProducto] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [scriptModalRecord, setScriptModalRecord] = useState<ZoneDeliveryRecord | null>(null);
  const [mapModalRecord, setMapModalRecord] = useState<ZoneDeliveryRecord | null>(null);

  // Clear sub-filters when switching campaign
  useEffect(() => {
    setQuery('');
    setSelectedRegion('');
    setSelectedComuna('');
    setSelectedLocalidad('');
    setSelectedDepartamento('');
    setSelectedCiudad('');
    setSelectedBarrio('');
    setSelectedZipCode('');
    setSelectedPaqueteria('');
    setSelectedMetodoPago('');
    setSelectedProducto('');
  }, [activeCampaign]);

  // Chile: Comunas disponibles
  const availableChileComunas = useMemo(() => {
    if (!selectedRegion) {
      return Object.values(COMUNAS_BY_REGION).flat();
    }
    return COMUNAS_BY_REGION[selectedRegion] || [];
  }, [selectedRegion]);

  // Chile: Localidades disponibles
  const availableChileLocalidades = useMemo(() => {
    if (selectedComuna) {
      return LOCALIDADES_BY_COMUNA[selectedComuna] || [];
    }
    if (selectedRegion && COMUNAS_BY_REGION[selectedRegion]) {
      const comunas = COMUNAS_BY_REGION[selectedRegion];
      return Array.from(new Set(comunas.flatMap(c => LOCALIDADES_BY_COMUNA[c] || [])));
    }
    return [];
  }, [selectedRegion, selectedComuna]);

  // Paraguay: Ciudades disponibles
  const availableParaguayCiudades = useMemo(() => {
    if (!selectedDepartamento) {
      return Object.values(CIUDADES_BY_DEPARTAMENTO).flat();
    }
    return CIUDADES_BY_DEPARTAMENTO[selectedDepartamento] || [];
  }, [selectedDepartamento]);

  // Paraguay: Barrios disponibles
  const availableParaguayBarrios = useMemo(() => {
    if (selectedCiudad) {
      return BARRIOS_BY_CIUDAD[selectedCiudad] || [];
    }
    if (selectedDepartamento && CIUDADES_BY_DEPARTAMENTO[selectedDepartamento]) {
      const ciudades = CIUDADES_BY_DEPARTAMENTO[selectedDepartamento];
      return Array.from(new Set(ciudades.flatMap(c => BARRIOS_BY_CIUDAD[c] || [])));
    }
    return [];
  }, [selectedDepartamento, selectedCiudad]);

  // Products list according to active campaign
  const currentProducts = useMemo(() => {
    return activeCampaign === 'CHILE' ? CHILE_PRODUCTS : PARAGUAY_PRODUCTS;
  }, [activeCampaign]);

  // Search Results
  const searchResults = useMemo(() => {
    if (activeCampaign === 'CHILE') {
      return engine.search(query, {
        campaignId: 'CHILE',
        maxResults: 150,
        minQueryLength: 2,
        region: selectedRegion || undefined,
        comuna: selectedComuna || undefined,
        localidad: selectedLocalidad || undefined,
        paqueteria: selectedPaqueteria || undefined,
        metodoPago: selectedMetodoPago || undefined,
        producto: selectedProducto || undefined
      });
    } else {
      return engine.search(query, {
        campaignId: 'PARAGUAY',
        maxResults: 150,
        minQueryLength: 2,
        departamento: selectedDepartamento || undefined,
        ciudad: selectedCiudad || undefined,
        barrio: selectedBarrio || undefined,
        zipCode: selectedZipCode || undefined,
        paqueteria: selectedPaqueteria || undefined,
        metodoPago: selectedMetodoPago || undefined,
        producto: selectedProducto || undefined
      });
    }
  }, [
    engine,
    query,
    activeCampaign,
    selectedRegion,
    selectedComuna,
    selectedLocalidad,
    selectedDepartamento,
    selectedCiudad,
    selectedBarrio,
    selectedZipCode,
    selectedPaqueteria,
    selectedMetodoPago,
    selectedProducto
  ]);

  const getMapsUrl = (localidad: string, comuna: string, region: string, calle?: string) => {
    const countryName = activeCampaign === 'PARAGUAY' ? 'Paraguay' : 'Chile';
    const queryParts = [calle, localidad, comuna, region, countryName].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryParts)}`;
  };

  const getMapsEmbedUrl = (localidad: string, comuna: string, region: string) => {
    const countryName = activeCampaign === 'PARAGUAY' ? 'Paraguay' : 'Chile';
    const queryParts = [localidad, comuna, region, countryName].filter(Boolean).join(', ');
    return `https://maps.google.com/maps?q=${encodeURIComponent(queryParts)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedRegion('');
    setSelectedComuna('');
    setSelectedLocalidad('');
    setSelectedDepartamento('');
    setSelectedCiudad('');
    setSelectedBarrio('');
    setSelectedZipCode('');
    setSelectedPaqueteria('');
    setSelectedMetodoPago('');
    setSelectedProducto('');
  };

  return (
    <div className="space-y-6">
      {/* Campaign Selector Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-700 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-md text-white shrink-0 ${
              activeCampaign === 'CHILE' ? 'bg-blue-600' : 'bg-red-600'
            }`}>
              {activeCampaign === 'CHILE' ? '🇨🇱' : '🇵🇾'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Campaña de Operación:</span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  activeCampaign === 'CHILE' ? 'bg-blue-900/80 text-blue-200 border border-blue-500/50' : 'bg-red-900/80 text-red-200 border border-red-500/50'
                }`}>
                  {activeCampaign === 'CHILE' ? 'CHILE (CL)' : 'PARAGUAY (PY)'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
                {activeCampaign === 'CHILE' 
                  ? 'Cobertura Chile · 16 Regiones y Comunas' 
                  : 'Cobertura Paraguay · 16 Departamentos, Asunción y Ciudades'}
              </h2>
            </div>
          </div>

          {/* Switcher Buttons */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-700/80 self-start md:self-auto shadow-inner">
            <button
              type="button"
              onClick={() => onCampaignChange('CHILE')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCampaign === 'CHILE'
                  ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-base">🇨🇱</span>
              <div className="text-left leading-tight">
                <span className="block font-black">Campaña CHILE</span>
                <span className="text-[10px] opacity-80 font-normal">Blue Express / Contraentrega</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onCampaignChange('PARAGUAY')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCampaign === 'PARAGUAY'
                  ? 'bg-red-600 text-white shadow-md ring-2 ring-red-400/50 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-base">🇵🇾</span>
              <div className="text-left leading-tight">
                <span className="block font-black">Campaña PARAGUAY</span>
                <span className="text-[10px] opacity-80 font-normal">Take and go / JCG COD</span>
              </div>
            </button>
          </div>
        </div>

        {/* Campaign rules summary */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
          {activeCampaign === 'CHILE' ? (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400">Paqueterías oficiales:</span>
                <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 px-2 py-0.5 rounded font-semibold">
                  Contraentrega: Efectivo y Transferencia
                </span>
                <span className="bg-blue-950/80 text-blue-300 border border-blue-600/40 px-2 py-0.5 rounded font-semibold">
                  Blue Express: Solo Efectivo
                </span>
              </div>
              <span className="text-amber-300 font-medium">
                Moneda: Pesos Chilenos (CLP $) · Envío Gratis
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-slate-400">Couriers autorizados:</span>
                <span className="bg-purple-950/80 text-purple-300 border border-purple-600/40 px-2 py-0.5 rounded font-semibold">
                  Take and go (Asunción e Interior)
                </span>
                <span className="bg-amber-950/80 text-amber-300 border border-amber-600/40 px-2 py-0.5 rounded font-semibold">
                  JCG (Capital e Interior)
                </span>
              </div>
              <span className="text-emerald-300 font-medium">
                Moneda: Guaraníes (PYG ₲) · Efectivo y Transferencia al recibir
              </span>
            </>
          )}
        </div>
      </section>

      {/* Search Input Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <label htmlFor="search-input" className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Search className={`w-5 h-5 ${activeCampaign === 'CHILE' ? 'text-blue-600' : 'text-red-600'}`} />
            {activeCampaign === 'CHILE' 
              ? 'Buscar Cobertura por Localidad, Comuna o Región (Chile):'
              : 'Buscar Cobertura por Barrio, Ciudad, Departamento o ZIP Code (Paraguay):'}
          </label>
          <span className="text-xs text-slate-500 font-medium">
            {activeCampaign === 'CHILE'
              ? 'Fechas de tránsito y despacho calculadas automáticamente'
              : 'Días y tiempos de entrega oficiales (Take and go / JCG)'}
          </span>
        </div>

        <div className="relative">
          <input
            id="search-input"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={
              activeCampaign === 'CHILE'
                ? "Ej.: Santiago Centro, Reñaca, Chicureo, Providencia, Maipú, Viña del Mar, Concepción, Alerce..."
                : "Ej.: Sajonia, Villa Morra, Ciudad del Este, San Lorenzo, Luque, Capiatá, 1001, 10101, Villarrica..."
            }
            className={`w-full bg-slate-50 border-2 rounded-xl px-4 py-3.5 pl-11 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-all shadow-inner ${
              activeCampaign === 'CHILE'
                ? 'border-slate-200 focus:border-blue-600'
                : 'border-slate-200 focus:border-red-600'
            }`}
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-4" />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-3.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded-md cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Dynamic Filters depending on Campaign */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filtros:
          </div>

          {activeCampaign === 'CHILE' ? (
            /* Chile filters: Región -> Comuna -> Localidad */
            <>
              <select
                value={selectedRegion}
                onChange={e => {
                  setSelectedRegion(e.target.value);
                  setSelectedComuna('');
                  setSelectedLocalidad('');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Todas las Regiones (Chile)</option>
                {CHILE_REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <select
                value={selectedComuna}
                onChange={e => {
                  setSelectedComuna(e.target.value);
                  setSelectedLocalidad('');
                }}
                className={`text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                  selectedComuna ? 'bg-blue-50 text-blue-900 font-bold border-blue-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border-slate-300'
                }`}
              >
                <option value="">Todas las Comunas</option>
                {availableChileComunas.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={selectedLocalidad}
                onChange={e => setSelectedLocalidad(e.target.value)}
                disabled={availableChileLocalidades.length === 0}
                className={`text-xs rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer ${
                  selectedLocalidad
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm'
                    : availableChileLocalidades.length > 0
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                <option value="">
                  {selectedComuna
                    ? `Localidades de ${selectedComuna} (${availableChileLocalidades.length})`
                    : selectedRegion
                      ? `Localidades en Región (${availableChileLocalidades.length})`
                      : 'Filtrar por Localidad (Elige Comuna)'}
                </option>
                {availableChileLocalidades.map(loc => (
                  <option key={loc} value={loc} className="text-slate-900 bg-white">{loc}</option>
                ))}
              </select>

              <select
                value={selectedPaqueteria}
                onChange={e => setSelectedPaqueteria(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="">Ambas Paqueterías</option>
                <option value="Contraentrega">Contraentrega (Efectivo y Transferencia)</option>
                <option value="Blue Express">Blue Express (Solo Efectivo)</option>
              </select>
            </>
          ) : (
            /* Paraguay filters: Departamento -> Ciudad -> Barrio / ZIP */
            <>
              <select
                value={selectedDepartamento}
                onChange={e => {
                  setSelectedDepartamento(e.target.value);
                  setSelectedCiudad('');
                  setSelectedBarrio('');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="">Todos los Departamentos (Paraguay)</option>
                {PARAGUAY_DEPARTAMENTOS.map(dep => (
                  <option key={dep} value={dep}>{dep}</option>
                ))}
              </select>

              <select
                value={selectedCiudad}
                onChange={e => {
                  setSelectedCiudad(e.target.value);
                  setSelectedBarrio('');
                }}
                className={`text-xs rounded-lg px-2.5 py-1.5 border focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer ${
                  selectedCiudad ? 'bg-red-50 text-red-900 font-bold border-red-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium border-slate-300'
                }`}
              >
                <option value="">Todas las Ciudades / Distritos</option>
                {availableParaguayCiudades.map(ciu => (
                  <option key={ciu} value={ciu}>{ciu}</option>
                ))}
              </select>

              <select
                value={selectedBarrio}
                onChange={e => setSelectedBarrio(e.target.value)}
                disabled={availableParaguayBarrios.length === 0}
                className={`text-xs rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer ${
                  selectedBarrio
                    ? 'bg-red-600 text-white font-bold border-red-600 shadow-sm'
                    : availableParaguayBarrios.length > 0
                      ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold hover:bg-amber-100'
                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                }`}
              >
                <option value="">
                  {selectedCiudad
                    ? `Barrios de ${selectedCiudad} (${availableParaguayBarrios.length})`
                    : selectedDepartamento
                      ? `Barrios en Departamento (${availableParaguayBarrios.length})`
                      : 'Barrios (Elige Ciudad primero)'}
                </option>
                {availableParaguayBarrios.map(b => (
                  <option key={b} value={b} className="text-slate-900 bg-white">{b}</option>
                ))}
              </select>

              <select
                value={selectedPaqueteria}
                onChange={e => setSelectedPaqueteria(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                <option value="">Todos los Couriers</option>
                <option value="Take and go">Take and go</option>
                <option value="Take and go Interior">Take and go Interior</option>
                <option value="JCG">JCG</option>
              </select>

              <input
                type="text"
                value={selectedZipCode}
                onChange={e => setSelectedZipCode(e.target.value.trim())}
                placeholder="Código Postal / ZIP (ej: 1001)"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded-lg px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500 w-44"
              />
            </>
          )}

          {/* Product filter */}
          <select
            value={selectedProducto}
            onChange={e => setSelectedProducto(e.target.value)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Todos los Productos ({activeCampaign})</option>
            {currentProducts.map(p => (
              <option key={p.id} value={p.nombre}>{p.nombre}</option>
            ))}
          </select>

          {/* Reset button */}
          {(query || selectedRegion || selectedComuna || selectedLocalidad || selectedDepartamento || selectedCiudad || selectedBarrio || selectedZipCode || selectedPaqueteria || selectedMetodoPago || selectedProducto) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 ml-auto bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Restablecer
            </button>
          )}
        </div>

        {/* Quick Chips according to Campaign */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase">
            {activeCampaign === 'CHILE' ? 'Regiones rápidas:' : 'Departamentos rápidos:'}
          </span>
          {activeCampaign === 'CHILE' ? (
            ['Región Metropolitana de Santiago', 'Región de Valparaíso', 'Región del Biobío', 'Región de Antofagasta', 'Región de Los Lagos'].map(r => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRegion(r);
                  setSelectedComuna('');
                  setSelectedLocalidad('');
                }}
                className={`text-[11px] px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  selectedRegion === r
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.replace('Región de ', '').replace('Región del ', '').replace('Región ', '')}
              </button>
            ))
          ) : (
            ['ASUNCIÓN', 'CENTRAL', 'ALTO PARANÁ', 'CAAGUAZÚ', 'ITAPÚA', 'CORDILLERA', 'SAN PEDRO', 'CONCEPCIÓN'].map(dep => (
              <button
                key={dep}
                onClick={() => {
                  setSelectedDepartamento(dep);
                  setSelectedCiudad('');
                  setSelectedBarrio('');
                }}
                className={`text-[11px] px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                  selectedDepartamento === dep
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dep}
              </button>
            ))
          )}
        </div>
      </section>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <span>Resultados de Cobertura {activeCampaign}</span>
            <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
              {searchResults.totalEncontrado} zona(s)
            </span>
          </h2>
          {searchResults.tiempoMs > 0 && (
            <span className="text-xs text-slate-400">
              ({searchResults.tiempoMs} ms)
            </span>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            Tarjetas
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Tabla
          </button>
        </div>
      </div>

      {/* Empty State */}
      {searchResults.resultados.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {query || selectedRegion || selectedDepartamento
              ? `No se encontraron zonas en ${activeCampaign}`
              : `Ingresa una búsqueda o selecciona filtros para ${activeCampaign}`}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            {activeCampaign === 'CHILE'
              ? 'Prueba buscando por comuna (ej. Santiago, Puente Alto, Viña del Mar) o seleccionando una región en los filtros.'
              : 'Prueba buscando por ciudad (ej. Asunción, Ciudad del Este, San Lorenzo) o departamento (Central, Alto Paraná).'}
          </p>
        </div>
      )}

      {/* View Mode: Cards */}
      {viewMode === 'cards' && searchResults.resultados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.resultados.map(record => {
            const isContra = record.paqueteria.toLowerCase().includes('contra');
            const isBlue = record.paqueteria.toLowerCase().includes('blue');
            const isTakeAndGo = record.paqueteria.toLowerCase().includes('take');
            const isJcg = record.paqueteria.toLowerCase().includes('jcg');
            const isParaguay = record.campaignId === 'PARAGUAY' || activeCampaign === 'PARAGUAY';
            
            const mapsUrl = getMapsUrl(record.localidad, record.comuna, record.region);

            return (
              <article
                key={record.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Bar with Country Flag, Location and Maps Link */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-black">{isParaguay ? '🇵🇾' : '🇨🇱'}</span>
                        <h4 className="text-base font-extrabold text-slate-900 leading-snug truncate">
                          {record.localidad}
                        </h4>
                        {record.zipCode && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
                            CP {record.zipCode}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-0.5">
                        {isParaguay ? 'Ciudad' : 'Comuna'}: <span className="text-blue-700">{record.comuna}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {isParaguay ? 'Departamento' : 'Región'}: {record.region}
                      </p>
                    </div>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-2xs"
                      title="Ver ubicación precisa en Google Maps"
                    >
                      <MapPin className="w-3 h-3 text-red-500" />
                      <span>Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  {/* Delivery Box */}
                  <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        Fecha Estimada:
                      </span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {record.fechaEntregaEstimada || `${record.diasTransito} días`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span className="text-[11px] flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" />
                        Plazo de Tránsito:
                      </span>
                      <span className="font-bold text-slate-800">
                        {record.tiempoEntregaTexto || `${record.diasTransito} día(s) hábil(es)`}
                      </span>
                    </div>

                    {record.diasEntregaTexto && (
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                        <span className="text-[11px] font-bold text-slate-500">Días de Reparto:</span>
                        <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
                          {record.diasEntregaTexto}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Courier & Payment Badge */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Courier Asignado:</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-extrabold border ${
                        isContra 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                          : isBlue
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : isTakeAndGo
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : isJcg
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        <Truck className="w-3.5 h-3.5" />
                        {record.paqueteria}
                      </span>
                    </div>

                    <div className="p-2 bg-slate-100/70 rounded-lg text-xs flex items-center justify-between">
                      <span className="text-slate-500 font-semibold text-[11px]">Cobro en Entrega:</span>
                      <span className="font-bold text-slate-900">
                        {isParaguay ? 'Efectivo / Transferencia (₲)' : record.metodoPago}
                      </span>
                    </div>

                    {record.restricciones && (
                      <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium">
                        {record.restricciones}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setScriptModalRecord(record)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Ver guion telefónico para confirmar cobertura con el cliente"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Guion</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const mapsLink = getMapsUrl(record.localidad, record.comuna, record.region);
                        const countryLabel = isParaguay ? 'Paraguay' : 'Chile';
                        const text = `📍 ${record.localidad}, ${record.comuna}, ${record.region} (${countryLabel})\n📦 Paquetería: ${record.paqueteria}\n💳 Pago: ${record.metodoPago}\n📅 Entrega Estimada: ${record.fechaEntregaEstimada}\n🗺️ Google Maps: ${mapsLink}`;
                        handleCopy(text, record.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Copiar datos de cobertura"
                    >
                      {copiedId === record.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {onSelectForOrder && (
                      <button
                        onClick={() => onSelectForOrder(record)}
                        className={`text-xs font-bold text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all shadow-sm cursor-pointer ${
                          activeCampaign === 'CHILE'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        <span>Tomar Pedido</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* View Mode: Table */}
      {viewMode === 'table' && searchResults.resultados.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">País</th>
                  <th className="px-4 py-3">Localidad / Barrio</th>
                  <th className="px-4 py-3">{activeCampaign === 'PARAGUAY' ? 'Ciudad' : 'Comuna'}</th>
                  <th className="px-4 py-3">{activeCampaign === 'PARAGUAY' ? 'Departamento' : 'Región'}</th>
                  {activeCampaign === 'PARAGUAY' && <th className="px-4 py-3">ZIP Code</th>}
                  <th className="px-4 py-3">Courier / Paquetería</th>
                  <th className="px-4 py-3">Fecha Estimada</th>
                  <th className="px-4 py-3">Método de Pago</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {searchResults.resultados.map(r => {
                  const isParaguay = r.campaignId === 'PARAGUAY' || activeCampaign === 'PARAGUAY';
                  const mapsUrl = getMapsUrl(r.localidad, r.comuna, r.region);

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-black text-sm">
                        {isParaguay ? '🇵🇾' : '🇨🇱'}
                      </td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">
                        {r.localidad}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {r.comuna}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {r.region}
                      </td>
                      {activeCampaign === 'PARAGUAY' && (
                        <td className="px-4 py-3 font-mono font-bold text-amber-900">
                          {r.zipCode || '—'}
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {r.paqueteria}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-blue-900">
                        {r.fechaEntregaEstimada || `${r.diasTransito} días`}
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-800">
                        {isParaguay ? 'Efectivo / Transferencia' : r.metodoPago}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                            title="Abrir en Maps"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setScriptModalRecord(r)}
                            className="text-xs font-bold text-blue-600 hover:underline px-2 py-1"
                          >
                            Guion
                          </button>
                          {onSelectForOrder && (
                            <button
                              onClick={() => onSelectForOrder(r)}
                              className={`text-xs font-bold text-white px-2.5 py-1 rounded transition-colors ${
                                activeCampaign === 'CHILE' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                              }`}
                            >
                              Tomar Pedido
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Script Modal */}
      {scriptModalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">{scriptModalRecord.campaignId === 'PARAGUAY' ? '🇵🇾' : '🇨🇱'}</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Guion Telefónico de Despacho ({scriptModalRecord.campaignId === 'PARAGUAY' ? 'Paraguay' : 'Chile'})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Operador: {currentOperator.nombre} ({currentOperator.codigoOperador})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScriptModalRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {(() => {
              const isParaguay = scriptModalRecord.campaignId === 'PARAGUAY';
              const mapsUrl = getMapsUrl(scriptModalRecord.localidad, scriptModalRecord.comuna, scriptModalRecord.region);
              
              const scriptText = isParaguay
                ? `“Excelente estimado cliente, le confirmo que tenemos cobertura de despacho contra entrega a su domicilio en ${scriptModalRecord.localidad}, ${scriptModalRecord.comuna} (${scriptModalRecord.region}${scriptModalRecord.zipCode ? ' - CP ' + scriptModalRecord.zipCode : ''}). Su pedido será transportado por courier ${scriptModalRecord.paqueteria} con entrega programada para el ${scriptModalRecord.fechaEntregaEstimada}${scriptModalRecord.diasEntregaTexto ? ' (' + scriptModalRecord.diasEntregaTexto + ')' : ''}. Al momento de recibir en mano puede abonar en guaraníes tanto en Efectivo como por Transferencia bancaria (SIPAP). ¿Le confirmo el despacho?”`
                : `“Excelente estimado cliente, le confirmo que tenemos cobertura de entrega a su domicilio en ${scriptModalRecord.localidad}, comuna de ${scriptModalRecord.comuna}, ${scriptModalRecord.region}. El despacho será gestionado vía ${scriptModalRecord.paqueteria} con fecha estimada de entrega para el ${scriptModalRecord.fechaEntregaEstimada}. El método de pago autorizado al recibir es ${scriptModalRecord.metodoPago}. El envío es 100% gratuito. ¿Desea que programemos su despacho de inmediato?”`;

              return (
                <div className="mt-4 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-slate-800 leading-relaxed italic">
                    {scriptText}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="border border-slate-200 p-3 rounded-lg">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Localidad / Barrio</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block truncate">
                        {scriptModalRecord.localidad}
                      </span>
                    </div>

                    <div className="border border-slate-200 p-3 rounded-lg">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Courier</span>
                      <span className="font-bold text-slate-900 text-sm mt-1 block">
                        {scriptModalRecord.paqueteria}
                      </span>
                    </div>

                    <div className="border border-slate-200 p-3 rounded-lg">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Forma de Pago</span>
                      <span className="font-bold text-emerald-800 text-sm mt-1 block">
                        {isParaguay ? 'Efectivo / Transferencia (₲)' : scriptModalRecord.metodoPago}
                      </span>
                    </div>

                    <div className="border border-slate-200 p-3 rounded-lg bg-blue-50/60 border-blue-200">
                      <span className="text-[11px] font-bold text-blue-700 uppercase block">Fecha Estimada</span>
                      <span className="font-extrabold text-blue-950 mt-1 block">
                        {scriptModalRecord.fechaEntregaEstimada}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <span className="font-medium text-slate-700 text-xs">
                        Ubicación: {scriptModalRecord.localidad}, {scriptModalRecord.comuna}, {scriptModalRecord.region}
                      </span>
                    </div>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-1 text-xs"
                    >
                      <span>Abrir en Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      onClick={() => setScriptModalRecord(null)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cerrar
                    </button>
                    <button
                      onClick={() => {
                        const texto = `=== CONFIRMACIÓN DE ENTREGA (${isParaguay ? 'PARAGUAY' : 'CHILE'}) ===\nLocalidad/Barrio: ${scriptModalRecord.localidad}\nCiudad/Comuna: ${scriptModalRecord.comuna}\nDepartamento/Región: ${scriptModalRecord.region}\nCourier: ${scriptModalRecord.paqueteria}\nForma de Pago: ${isParaguay ? 'Efectivo y Transferencia (PYG ₲)' : scriptModalRecord.metodoPago}\nFecha Estimada: ${scriptModalRecord.fechaEntregaEstimada}\nGoogle Maps: ${mapsUrl}\nAsesor: ${currentOperator.nombre} (${currentOperator.codigoOperador})`;
                        handleCopy(texto, 'modal-script');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      {copiedId === 'modal-script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      Copiar Ficha al Portapapeles
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};
