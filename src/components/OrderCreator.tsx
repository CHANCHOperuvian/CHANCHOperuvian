import React, { useState, useMemo, useEffect } from 'react';
import { ProductInfo, OperatorProfile, ZoneDeliveryRecord, CampaignId } from '../types/coverage';
import { CHILE_PRODUCTS, CHILE_REGIONS, COMUNAS_BY_REGION, LOCALIDADES_BY_COMUNA } from '../data/chileanCoverageData';
import { PARAGUAY_PRODUCTS, PARAGUAY_DEPARTAMENTOS, CIUDADES_BY_DEPARTAMENTO, BARRIOS_BY_CIUDAD } from '../data/paraguayCoverageData';
import { SearchEngine } from '../utils/searchEngine';
import { calcularFechaEntrega, calcularFechaEntregaParaguay } from '../utils/transitCalculator';
import { 
  ShoppingCart, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  FileCheck2, 
  User, 
  Phone, 
  ExternalLink,
  Globe,
  Navigation,
  Package
} from 'lucide-react';

interface OrderCreatorProps {
  engine: SearchEngine;
  currentOperator: OperatorProfile;
  activeCampaign: CampaignId;
  onCampaignChange: (campaign: CampaignId) => void;
}

export const OrderCreator: React.FC<OrderCreatorProps> = ({
  engine,
  currentOperator,
  activeCampaign,
  onCampaignChange
}) => {
  // Campaign products
  const products = useMemo(() => {
    return activeCampaign === 'CHILE' ? CHILE_PRODUCTS : PARAGUAY_PRODUCTS;
  }, [activeCampaign]);

  const [selectedProduct, setSelectedProduct] = useState<ProductInfo>(products[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState(activeCampaign === 'CHILE' ? '+56 9 ' : '+595 9');
  const [customerAddress, setCustomerAddress] = useState('');

  // Chile address states
  const [selectedRegion, setSelectedRegion] = useState('Región Metropolitana de Santiago');
  const [selectedComuna, setSelectedComuna] = useState('Santiago Centro');
  const [selectedLocalidad, setSelectedLocalidad] = useState('Santiago Centro Cívico');

  // Paraguay address states
  const [selectedDepartamento, setSelectedDepartamento] = useState('ASUNCIÓN');
  const [selectedCiudad, setSelectedCiudad] = useState('LA ENCARNACIÓN');
  const [selectedBarrio, setSelectedBarrio] = useState('SAJONIA');
  const [selectedZipCode, setSelectedZipCode] = useState('1001');

  const [deliveryNotes, setDeliveryNotes] = useState('Timbre 201, tener vuelto');
  const [createdOrderTicket, setCreatedOrderTicket] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showLiveMap, setShowLiveMap] = useState(true);

  // When activeCampaign changes, reset product, phone, and defaults
  useEffect(() => {
    const newProds = activeCampaign === 'CHILE' ? CHILE_PRODUCTS : PARAGUAY_PRODUCTS;
    setSelectedProduct(newProds[0]);
    setCustomerPhone(activeCampaign === 'CHILE' ? '+56 9 ' : '+595 9');
    setCreatedOrderTicket(null);
  }, [activeCampaign]);

  // Chile: Available communes and localities
  const availableChileComunas = useMemo(() => {
    return COMUNAS_BY_REGION[selectedRegion] || [];
  }, [selectedRegion]);

  const availableChileLocalidades = useMemo(() => {
    return LOCALIDADES_BY_COMUNA[selectedComuna] || [`${selectedComuna} Centro`];
  }, [selectedComuna]);

  // Paraguay: Available cities and barrios
  const availableParaguayCiudades = useMemo(() => {
    return CIUDADES_BY_DEPARTAMENTO[selectedDepartamento] || [];
  }, [selectedDepartamento]);

  const availableParaguayBarrios = useMemo(() => {
    return BARRIOS_BY_CIUDAD[selectedCiudad] || [`${selectedCiudad} Centro`];
  }, [selectedCiudad]);

  // Live coverage check
  const coverageCheck = useMemo<ZoneDeliveryRecord | null>(() => {
    if (activeCampaign === 'CHILE') {
      const search = engine.search(selectedLocalidad || selectedComuna, { 
        campaignId: 'CHILE',
        maxResults: 1,
        region: selectedRegion,
        comuna: selectedComuna,
        localidad: selectedLocalidad || undefined
      });
      if (search.resultados.length > 0) return search.resultados[0];
      const fallback = engine.search(selectedComuna, { campaignId: 'CHILE', maxResults: 1 });
      if (fallback.resultados.length > 0) return fallback.resultados[0];
    } else {
      const search = engine.search(selectedBarrio || selectedCiudad, {
        campaignId: 'PARAGUAY',
        maxResults: 1,
        departamento: selectedDepartamento,
        ciudad: selectedCiudad,
        barrio: selectedBarrio || undefined
      });
      if (search.resultados.length > 0) return search.resultados[0];
      const fallback = engine.search(selectedCiudad, { campaignId: 'PARAGUAY', maxResults: 1 });
      if (fallback.resultados.length > 0) return fallback.resultados[0];
    }
    return null;
  }, [engine, activeCampaign, selectedRegion, selectedComuna, selectedLocalidad, selectedDepartamento, selectedCiudad, selectedBarrio]);

  // Delivery date calculation
  const transitCalc = useMemo(() => {
    const dias = coverageCheck?.diasTransito ?? 2;
    if (activeCampaign === 'PARAGUAY' || coverageCheck?.diasEntregaTexto) {
      return calcularFechaEntregaParaguay(dias, coverageCheck?.diasEntregaTexto);
    }
    return calcularFechaEntrega(dias);
  }, [coverageCheck, activeCampaign]);

  // Price calculations based on promotions
  const priceInfo = useMemo(() => {
    const promo = selectedProduct.promociones.find(p => p.cantidad === quantity);
    const unitPrice = selectedProduct.precio || selectedProduct.precioCLP || 38990;
    const isParaguay = activeCampaign === 'PARAGUAY';

    if (promo) {
      return {
        total: promo.precioTotal,
        totalTexto: promo.precioTotalTexto || (isParaguay ? `${promo.precioTotal.toLocaleString('es-PY')} ₲` : `$${promo.precioTotal.toLocaleString('es-CL')} CLP`),
        ahorro: promo.ahorro
      };
    }
    const calcTotal = unitPrice * quantity;
    return {
      total: calcTotal,
      totalTexto: isParaguay ? `${calcTotal.toLocaleString('es-PY')} ₲ (PYG)` : `$${calcTotal.toLocaleString('es-CL')} CLP`,
      ahorro: 'Precio regular'
    };
  }, [selectedProduct, quantity, activeCampaign]);

  const mapsQuery = useMemo(() => {
    if (activeCampaign === 'CHILE') {
      return [customerAddress, selectedLocalidad, selectedComuna, selectedRegion, 'Chile'].filter(Boolean).join(', ');
    } else {
      return [customerAddress, selectedBarrio, selectedCiudad, selectedDepartamento, 'Paraguay'].filter(Boolean).join(', ');
    }
  }, [activeCampaign, customerAddress, selectedLocalidad, selectedComuna, selectedRegion, selectedBarrio, selectedCiudad, selectedDepartamento]);

  const mapsUrl = useMemo(() => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  }, [mapsQuery]);

  const mapsEmbedUrl = useMemo(() => {
    return `https://maps.google.com/maps?q=${encodeURIComponent(mapsQuery)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }, [mapsQuery]);

  const handleGenerateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerAddress) {
      alert('Por favor ingresa el nombre del cliente y la dirección de entrega.');
      return;
    }

    const orderId = `${activeCampaign === 'PARAGUAY' ? 'PY' : 'CL'}-ORD-${Date.now().toString().slice(-6)}`;
    const fechaHora = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
    const isParaguay = activeCampaign === 'PARAGUAY';

    const ticket = isParaguay ? `
========================================
     ORDEN DE DESPACHO COD (PARAGUAY)
========================================
Código Orden: ${orderId}
Fecha Registro: ${fechaHora}
Campaña: PARAGUAY (PY)
Asesor Asignado: ${currentOperator.nombre} (${currentOperator.codigoOperador})
Team Leader: ${currentOperator.teamleader || 'DIRECCIÓN'}

---------------- DATOS DEL CLIENTE ----------------
Nombre y Apellido: ${customerName.toUpperCase()}
Teléfono Móvil: ${customerPhone}
Dirección: ${customerAddress}
Barrio / Sector: ${selectedBarrio || selectedCiudad}
Ciudad / Distrito: ${selectedCiudad}
Departamento: ${selectedDepartamento}
Código Postal (ZIP): ${selectedZipCode || '—'}
Referencia / Notas: ${deliveryNotes || 'Sin observaciones'}

---------------- LOGÍSTICA Y COURIER ----------------
Courier Oficial: ${coverageCheck?.paqueteria || 'Take and go'}
Días de Reparto: ${coverageCheck?.diasEntregaTexto || 'Lunes a Viernes'}
Tiempo Estimado: ${coverageCheck?.tiempoEntregaTexto || `${coverageCheck?.diasTransito || 3} días`}
Fecha Estimada de Entrega: ${transitCalc.fechaTextoLargo}
Modalidad: Pago Contra Entrega (Efectivo / Transferencia SIPAP)

---------------- DETALLE DEL PEDIDO ----------------
Producto: ${selectedProduct.nombre}
Cantidad: ${quantity} unidad(es)
Promoción: ${priceInfo.ahorro}
Costo de Envío: GRATIS (0 ₲)
TOTAL A COBRAR EN PUERTA: ${priceInfo.totalTexto}

---------------- GEORREFERENCIA ----------------
Ubicación Google Maps: ${mapsUrl}
========================================
`.trim() : `
========================================
     ORDEN DE DESPACHO COD (CHILE)
========================================
Código Orden: ${orderId}
Fecha Registro: ${fechaHora}
Campaña: CHILE (CL)
Asesor Asignado: ${currentOperator.nombre} (${currentOperator.codigoOperador})
Team Leader: ${currentOperator.teamleader || 'DIRECCIÓN'}

---------------- DATOS DEL CLIENTE ----------------
Nombre y Apellido: ${customerName.toUpperCase()}
Teléfono Móvil: ${customerPhone}
Dirección: ${customerAddress}
Localidad / Sector: ${selectedLocalidad || selectedComuna}
Comuna: ${selectedComuna}
Región: ${selectedRegion}
Referencia / Notas: ${deliveryNotes || 'Sin observaciones'}

---------------- LOGÍSTICA Y COURIER ----------------
Paquetería Validada: ${coverageCheck?.paqueteria || 'Contraentrega'}
Método de Pago: ${coverageCheck?.metodoPago || 'Efectivo y Transferencia'}
Fecha Estimada de Entrega: ${transitCalc.fechaTextoLargo} (${transitCalc.diasTransito} día(s) hábil(es))
Estado Cobertura: ${coverageCheck?.coberturaEstado || 'Factible con Cobertura'}

---------------- DETALLE DEL PEDIDO ----------------
Producto: ${selectedProduct.nombre}
Cantidad: ${quantity} unidad(es)
Promoción: ${priceInfo.ahorro}
Costo de Envío: GRATIS ($0 CLP)
TOTAL A COBRAR EN PUERTA: ${priceInfo.totalTexto}

---------------- GEORREFERENCIA ----------------
Ubicación Google Maps: ${mapsUrl}
========================================
`.trim();

    setCreatedOrderTicket(ticket);
    setCopied(false);
  };

  const handleCopyTicket = () => {
    if (createdOrderTicket) {
      navigator.clipboard.writeText(createdOrderTicket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Campaign Switcher */}
      <section className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{activeCampaign === 'CHILE' ? '🇨🇱' : '🇵🇾'}</span>
            <h2 className="text-lg sm:text-xl font-extrabold text-white">
              Toma de Pedidos Contra Entrega (COD)
            </h2>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
              activeCampaign === 'CHILE' ? 'bg-blue-900 text-blue-200 border border-blue-600' : 'bg-red-900 text-red-200 border border-red-600'
            }`}>
              {activeCampaign}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Valida en vivo la cobertura del sector, calcula la fecha de entrega y georreferencia en Google Maps.
          </p>
        </div>

        {/* Quick Campaign Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => onCampaignChange('CHILE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCampaign === 'CHILE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇨🇱 Chile
          </button>
          <button
            type="button"
            onClick={() => onCampaignChange('PARAGUAY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeCampaign === 'PARAGUAY' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            🇵🇾 Paraguay
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Order Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleGenerateOrder} className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
            {/* Product selection */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-blue-600" />
                1. Selección de Producto y Promoción ({activeCampaign}):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {products.map(prod => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      setSelectedProduct(prod);
                      setQuantity(1);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedProduct.id === prod.id
                        ? activeCampaign === 'CHILE'
                          ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                          : 'border-red-600 bg-red-50/60 ring-2 ring-red-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="font-bold text-slate-900 block text-xs truncate">
                      {prod.nombre}
                    </span>
                    <span className="text-[11px] text-slate-500 block truncate">
                      {prod.categoria}
                    </span>
                    <span className="text-xs font-black text-blue-800 block mt-1">
                      {prod.precioTexto}
                    </span>
                  </button>
                ))}
              </div>

              {/* Promo Packs */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">
                  Promoción a facturar en entrega:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {selectedProduct.promociones.map(promo => (
                    <button
                      key={promo.cantidad}
                      type="button"
                      onClick={() => setQuantity(promo.cantidad)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        quantity === promo.cantidad
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span className="block font-black text-xs">
                        {promo.cantidad} {promo.cantidad === 1 ? 'Unidad' : 'Unidades'}
                      </span>
                      <span className="block text-[11px] font-bold text-emerald-400 mt-0.5">
                        {promo.precioTotalTexto || `${promo.precioTotal} ${selectedProduct.simboloMoneda}`}
                      </span>
                      <span className="block text-[10px] opacity-80 mt-0.5 truncate">
                        {promo.ahorro}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                2. Datos de Envío del Cliente ({activeCampaign}):
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo del Cliente:
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Ej.: Juan Manuel Pérez Gómez"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Teléfono Móvil (WhatsApp):
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder={activeCampaign === 'CHILE' ? '+56 9 1234 5678' : '+595 981 123456'}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dirección Exacta (Calle y Número de Casa / Dpto / Edificio):
                </label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={e => setCustomerAddress(e.target.value)}
                  placeholder="Ej.: Av. Las Palmeras 1234, Dpto 4B / Casa con portón blanco"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Geographic selectors according to Campaign */}
              {activeCampaign === 'CHILE' ? (
                /* Chile: Región, Comuna, Localidad */
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Región (Chile):
                    </label>
                    <select
                      value={selectedRegion}
                      onChange={e => {
                        const newR = e.target.value;
                        setSelectedRegion(newR);
                        const coms = COMUNAS_BY_REGION[newR] || [];
                        const firstCom = coms[0] || '';
                        setSelectedComuna(firstCom);
                        const locs = LOCALIDADES_BY_COMUNA[firstCom] || [];
                        setSelectedLocalidad(locs[0] || `${firstCom} Centro`);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      {CHILE_REGIONS.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Comuna:
                    </label>
                    <select
                      value={selectedComuna}
                      onChange={e => {
                        const newCom = e.target.value;
                        setSelectedComuna(newCom);
                        const locs = LOCALIDADES_BY_COMUNA[newCom] || [];
                        setSelectedLocalidad(locs[0] || `${newCom} Centro`);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
                    >
                      {availableChileComunas.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Localidad / Sector:
                    </label>
                    <select
                      value={selectedLocalidad}
                      onChange={e => setSelectedLocalidad(e.target.value)}
                      className="w-full bg-blue-50 border border-blue-300 rounded-lg px-2.5 py-2 text-xs text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
                    >
                      {availableChileLocalidades.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                /* Paraguay: Departamento, Ciudad, Barrio, ZIP */
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Departamento (Paraguay):
                    </label>
                    <select
                      value={selectedDepartamento}
                      onChange={e => {
                        const newDep = e.target.value;
                        setSelectedDepartamento(newDep);
                        const cius = CIUDADES_BY_DEPARTAMENTO[newDep] || [];
                        const firstCiu = cius[0] || '';
                        setSelectedCiudad(firstCiu);
                        const bs = BARRIOS_BY_CIUDAD[firstCiu] || [];
                        setSelectedBarrio(bs[0] || `${firstCiu} Centro`);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                    >
                      {PARAGUAY_DEPARTAMENTOS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ciudad / Distrito:
                    </label>
                    <select
                      value={selectedCiudad}
                      onChange={e => {
                        const newCiu = e.target.value;
                        setSelectedCiudad(newCiu);
                        const bs = BARRIOS_BY_CIUDAD[newCiu] || [];
                        setSelectedBarrio(bs[0] || `${newCiu} Centro`);
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold cursor-pointer"
                    >
                      {availableParaguayCiudades.map(ciu => (
                        <option key={ciu} value={ciu}>{ciu}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Barrio / Localidad:
                    </label>
                    <select
                      value={selectedBarrio}
                      onChange={e => setSelectedBarrio(e.target.value)}
                      className="w-full bg-red-50 border border-red-300 rounded-lg px-2.5 py-2 text-xs text-red-950 focus:outline-none focus:ring-2 focus:ring-red-500 font-bold cursor-pointer"
                    >
                      {availableParaguayBarrios.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ZIP / Código Postal:
                    </label>
                    <input
                      type="text"
                      value={selectedZipCode}
                      onChange={e => setSelectedZipCode(e.target.value)}
                      placeholder="1001"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono font-bold"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notas de Entrega para el Repartidor / Courier:
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  placeholder="Ej.: Llamar antes de llegar, timbre 201, pagar con efectivo justo..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Total a cobrar: <strong className="text-slate-900 text-sm">{priceInfo.totalTexto}</strong>
              </div>

              <button
                type="submit"
                className={`text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer ${
                  activeCampaign === 'CHILE'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Generar Orden COD ({activeCampaign})</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Live Coverage Check & Geolocation Preview */}
        <div className="space-y-6">
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              Validación Logística en Vivo:
            </h3>

            {coverageCheck ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Factible con Cobertura Oficial</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    {coverageCheck.sectorZona || `${coverageCheck.localidad}, ${coverageCheck.comuna}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Courier</span>
                    <span className="font-extrabold text-slate-900 block mt-0.5 truncate">
                      {coverageCheck.paqueteria}
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Pago Aceptado</span>
                    <span className="font-extrabold text-slate-900 block mt-0.5 truncate">
                      {activeCampaign === 'PARAGUAY' ? 'Efectivo / Transferencia' : coverageCheck.metodoPago}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg">
                  <span className="text-[10px] text-blue-700 font-bold uppercase block">Fecha Estimada de Entrega</span>
                  <span className="font-extrabold text-blue-950 block mt-0.5">
                    {transitCalc.fechaTextoLargo}
                  </span>
                  {coverageCheck.diasEntregaTexto && (
                    <span className="text-[10px] text-blue-800 block mt-0.5">
                      Reparto: {coverageCheck.diasEntregaTexto}
                    </span>
                  )}
                </div>

                {/* Map Preview */}
                {customerAddress && showLiveMap && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 mt-2">
                    <div className="bg-slate-100 p-2 text-[11px] font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        Georreferencia Maps ({activeCampaign})
                      </span>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-bold hover:underline inline-flex items-center gap-0.5"
                      >
                        Abrir <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <iframe
                      title="Georreferencia Maps"
                      src={mapsEmbedUrl}
                      width="100%"
                      height="160"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="space-y-1.5 text-slate-600 pt-1">
                  <div className="flex justify-between">
                    <span>Costo de Envío:</span>
                    <strong className="text-emerald-600">Gratis (Envío 100% bonificado)</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-100">
                    <span>Total a Cobrar:</span>
                    <strong className="text-slate-900 font-mono text-sm">
                      {priceInfo.totalTexto}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                Selecciona una ubicación para comprobar la cobertura.
              </div>
            )}

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              Operador: <strong>{currentOperator.nombre}</strong> ({currentOperator.codigoOperador})
            </div>
          </section>

          {/* Generated Ticket Box */}
          {createdOrderTicket && (
            <section className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Ticket de Despacho Generado
                </span>
                <button
                  type="button"
                  onClick={handleCopyTicket}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar Ficha'}</span>
                </button>
              </div>

              <pre className="font-mono text-[11px] leading-tight text-slate-300 bg-slate-950 p-3 rounded-lg overflow-x-auto max-h-[350px]">
                {createdOrderTicket}
              </pre>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
