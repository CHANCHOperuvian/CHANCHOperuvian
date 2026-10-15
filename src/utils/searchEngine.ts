import { ZoneDeliveryRecord, SearchResult } from '../types/coverage';
import { calcularFechaEntrega, calcularFechaEntregaParaguay } from './transitCalculator';

export function normalizar(valor: any): string {
  return String(valor == null ? '' : valor)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface IndexedRecord {
  record: ZoneDeliveryRecord;
  searchText: string;
}

export class SearchEngine {
  private indexedRecords: IndexedRecord[] = [];

  constructor(records: ZoneDeliveryRecord[] = []) {
    this.rebuildIndex(records);
  }

  public rebuildIndex(records: ZoneDeliveryRecord[]): void {
    this.indexedRecords = records.map(record => {
      // Recalcular fecha de entrega actualizada según días de tránsito y país
      if (!record.fechaEntregaEstimada) {
        if (record.campaignId === 'PARAGUAY' || record.diasEntregaTexto) {
          const calc = calcularFechaEntregaParaguay(record.diasTransito, record.diasEntregaTexto);
          record.fechaEntregaEstimada = calc.fechaTextoLargo;
        } else {
          const calc = calcularFechaEntrega(record.diasTransito);
          record.fechaEntregaEstimada = calc.fechaTextoLargo;
        }
      }

      const searchParts = [
        record.id,
        record.campaignId || '',
        record.pais || '',
        record.region,
        record.comuna,
        record.localidad || '',
        record.departamento || '',
        record.ciudad || '',
        record.barrio || '',
        record.zipCode || '',
        record.provincia || '',
        record.sectorZona || '',
        record.coberturaEstado,
        record.paqueteria,
        record.metodoPago,
        `${record.diasTransito} dias`,
        record.tiempoEntregaTexto || '',
        record.diasEntregaTexto || '',
        record.fechaEntregaEstimada || '',
        record.restricciones || '',
        record.observaciones || '',
        ...(record.productosDisponibles || [])
      ];

      return {
        record,
        searchText: normalizar(searchParts.join(' '))
      };
    });
  }

  public get totalRecords(): number {
    return this.indexedRecords.length;
  }

  public search(
    rawQuery: string,
    options: {
      maxResults?: number;
      minQueryLength?: number;
      campaignId?: string;
      region?: string;
      comuna?: string;
      localidad?: string;
      departamento?: string;
      ciudad?: string;
      barrio?: string;
      zipCode?: string;
      paqueteria?: string;
      metodoPago?: string;
      producto?: string;
    } = {}
  ): SearchResult {
    const startTime = performance.now();
    const minLength = options.minQueryLength ?? 2;
    const maxResults = options.maxResults ?? 100;
    const normalizedQuery = normalizar(rawQuery);

    if (
      normalizedQuery.length < minLength && 
      !options.campaignId &&
      !options.region && 
      !options.comuna && 
      !options.localidad && 
      !options.departamento &&
      !options.ciudad &&
      !options.barrio &&
      !options.zipCode &&
      !options.paqueteria && 
      !options.metodoPago && 
      !options.producto
    ) {
      return {
        totalEncontrado: 0,
        resultadosDevueltos: 0,
        limitado: false,
        tiempoMs: 0,
        resultados: [],
        query: rawQuery
      };
    }

    const queryTokens = normalizedQuery.split(' ').filter(t => t.length > 0);
    const matches: ZoneDeliveryRecord[] = [];

    for (let i = 0; i < this.indexedRecords.length; i++) {
      const item = this.indexedRecords[i];
      const r = item.record;

      if (options.campaignId && r.campaignId && r.campaignId !== options.campaignId) continue;
      if (options.region && r.region !== options.region) continue;
      if (options.comuna && r.comuna !== options.comuna) continue;
      if (options.localidad && r.localidad !== options.localidad) continue;
      if (options.departamento && r.departamento && r.departamento !== options.departamento) continue;
      if (options.ciudad && r.ciudad && r.ciudad !== options.ciudad) continue;
      if (options.barrio && r.barrio && r.barrio !== options.barrio) continue;
      if (options.zipCode && r.zipCode && r.zipCode !== options.zipCode) continue;
      if (options.paqueteria && r.paqueteria !== options.paqueteria) continue;
      if (options.metodoPago && r.metodoPago !== options.metodoPago) continue;
      if (options.producto && !r.productosDisponibles.some(p => p.toLowerCase().includes(options.producto!.toLowerCase()))) continue;

      if (queryTokens.length > 0) {
        let allTokensMatch = true;
        for (let j = 0; j < queryTokens.length; j++) {
          if (!item.searchText.includes(queryTokens[j])) {
            allTokensMatch = false;
            break;
          }
        }
        if (!allTokensMatch) continue;
      }

      matches.push(r);
    }

    const endTime = performance.now();
    const tiempoMs = Number((endTime - startTime).toFixed(2));
    const resultadosDevueltos = Math.min(matches.length, maxResults);

    return {
      totalEncontrado: matches.length,
      resultadosDevueltos,
      limitado: matches.length > maxResults,
      tiempoMs,
      resultados: matches.slice(0, resultadosDevueltos),
      query: rawQuery
    };
  }
}
