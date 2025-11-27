export interface UsuarioViaje {
  id: number;
  usuarioId: string;
  usuarioEmail: string;
  viajeId: number;
  tarifa: number;
  fecha: string;
  distancia: number;
}

export interface CreateUsuarioViajeDTO {
  usuarioId: string;
  viajeId: number;
  tarifa: number;
  distancia: number;
  fecha: string;
}

export interface UpdateUsuarioViajeDTO {
  usuarioId?: number;
  viajeId?: number;
}

export interface FilterUsuarioViajeDTO {
  usuarioId?: string;
  viajeId: number;
  fecha?: string;
  minTarifa?: number;
  maxTarifa?: number;
  minDistancia?: number;
  maxDistancia?: number;
  pageNumber: number;
  pageSize: number;
}
