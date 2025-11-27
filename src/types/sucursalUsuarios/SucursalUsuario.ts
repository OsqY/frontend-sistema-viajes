export interface SucursalUsuario {
  sucursalId: number;
  sucursalNombre: string;
  usuarioId: string;
  usuarioEmail: string;
  distancia: number;
}

export interface CreateSucursalUsuarioDTO {
  sucursalId: number;
  usuarioId: string;
  distancia: number;
}

export interface UpdateSucursalUsuarioDTO {
  sucursalId?: number;
  usuarioId?: string;
  distancia?: number;
}

export interface FilterSucursalUsuarioDTO {
  sucursalId: number;
  usuarioId?: string;
  minDistancia?: number;
  maxDistancia?: number;
  pageNumber: number;
  pageSize: number;
}
