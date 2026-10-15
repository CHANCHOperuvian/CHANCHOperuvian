export type CampaignId = 'CHILE' | 'PARAGUAY';

export type PaqueteriaChile = 'Contraentrega' | 'Blue Express';
export type PaqueteriaParaguay = 'Take and go' | 'Take and go Interior' | 'JCG';
export type Paqueteria = PaqueteriaChile | PaqueteriaParaguay | string;

export type MetodoPagoPermitido = 'Efectivo y Transferencia' | 'Solo Efectivo';

export interface ProductInfo {
  id: string;
  nombre: string;
  precioCLP?: number;
  precioPYG?: number;
  precio: number;
  precioTexto: string;
  moneda: 'CLP' | 'PYG';
  simboloMoneda: '$' | '₲';
  categoria: string;
  promociones: {
    cantidad: number;
    precioTotalCLP?: number;
    precioTotal: number;
    precioTotalTexto: string;
    ahorro: string;
  }[];
  campanaDefault: CampaignId | string;
}

export interface ZoneDeliveryRecord {
  id: string;
  campaignId?: CampaignId;
  pais?: string;
  region: string; // Para Chile: Región; Para Paraguay: Departamento
  comuna: string; // Para Chile: Comuna; Para Paraguay: Ciudad / Distrito
  localidad: string; // Para Chile: Localidad / Sector; Para Paraguay: Barrio / Sector
  departamento?: string;
  ciudad?: string;
  barrio?: string;
  zipCode?: string;
  provincia?: string;
  sectorZona: string;
  coberturaEstado: 'Factible con Cobertura' | 'Sin Cobertura';
  paqueteria: Paqueteria;
  metodoPago: MetodoPagoPermitido;
  diasTransito: number; // Días hábiles de tránsito
  tiempoEntregaTexto?: string; // ej: '3 DIAS', '2 DÍAS', '24/72Hs.'
  diasEntregaTexto?: string; // ej: 'LUNES A VIERNES', 'Martes y Jueves'
  fechaEntregaEstimada?: string; // Calculada dinámicamente
  costoEnvioCLP?: number;
  costoEnvioPYG?: number;
  envioGratis: boolean;
  productosDisponibles: string[];
  restricciones?: string;
  observaciones?: string;
  ultimaActualizacion: string;
  [key: string]: any;
}

export interface SearchResult {
  totalEncontrado: number;
  resultadosDevueltos: number;
  limitado: boolean;
  tiempoMs: number;
  resultados: ZoneDeliveryRecord[];
  query: string;
}

export interface RosterOperator {
  id: string;
  numero: number;
  teamleader: string;
  nombreAsesor: string;
  codigoPerop: string;
  campana: string;
  turno: string;
  descanso?: string;
  pinPersonal?: string;
  registrado?: boolean;
}

export interface OperatorProfile {
  id: string;
  nombre: string;
  codigoOperador: string;
  pais?: string;
  campanasAsignadas: string[];
  teamleader?: string;
  turno?: string;
  efectividad?: string;
}

export interface AppsScriptConfig {
  sourceSpreadsheetId: string;
  sourceSheetName: string;
  headerRow: number;
  indexSpreadsheetId: string;
  indexSheetName: string;
  requireAllowlist: boolean;
  maxResults: number;
  minQueryLength: number;
  lockTimeoutMs: number;
  authMode: 'public_universal' | 'codigo_perop';
  operatorPin: string;
  enableAtomicRebuild: boolean;
}

export type ActiveTab = 'validator' | 'order-creator' | 'batch' | 'roster' | 'script-generator' | 'deployment-guide' | 'dataset';
