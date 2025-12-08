export interface ManageInfo {
  email: string;
  isEmailConfirmed: boolean;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface RegisterInfo {
  email: string;
  password: string;
}

export interface UsuarioDropdown {
  id: string;
  email: string;
  distancia: number;
}
