export interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

export interface CreateSucursalDTO {
  nombre: string;
  direccion: string;
}

export interface UpdateSucursalDTO extends CreateSucursalDTO {
  id: number;
}

export interface FilterSucursalDTO {
  nombreFilter?: string;
  direccionFilter?: string;
  pageNumber: number;
  pageSize: number;
}
