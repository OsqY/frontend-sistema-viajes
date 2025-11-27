export interface Viaje {
  id: number;
  tarifaTotal: number;
  distanciaTotal: number;
  transportistaId: number;
  transportistaNombre: string;
  sucursalId: number;
  sucursalNombre: string;
  fecha: Date;
}

export interface CreateViajeDTO {
  transportistaId: number;
  sucursalId: number;
}

export interface UpdateViajeDTO {
  id?: number;
  transportistaId?: number;
}

export interface FilterViajeDTO {
  id?: number;
  pageNumber: number;
  pageSize: number;
  transportistaId?: number;
  sucursalId?: number;
  minTarifaTotal?: number;
  maxTarifaTotal?: number;
  minFecha?: string;
  maxFecha?: string;
  minDistanciaTotal?: number;
  maxDistanciaTotal?: number;
}

export interface FilterReportDTO {
  transportistaId?: number;
  sucursalId?: number;
  minFecha?: string;
  maxFecha?: string;
  minTarifaTotal?: number;
  maxTarifaTotal?: number;
}

export interface ViajeReportDTO {
  distanciaTotal: number;
  fecha: string;
  tarifaTotal: number;
  transportistaId: number;
  transportistaNombre: string;
  sucursalId: number;
  sucursalNombre: string;
}
