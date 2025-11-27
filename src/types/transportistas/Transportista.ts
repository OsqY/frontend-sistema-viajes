export interface Transportista {
  id: number;
  nombres: string;
  apellidos: string;
  descripcion: string;
}

export interface CreateTransportistaDTO {
  nombres: string;
  apellidos: string;
  descripcion: string;
}

export interface UpdateTransportistaDTO extends CreateTransportistaDTO {
  id: number;
}

export interface FilterTransportistaDTO {
  pageNumber: number;
  pageSize: number;
  nombreFilter?: string;
  apellidosFilter?: string;
}
