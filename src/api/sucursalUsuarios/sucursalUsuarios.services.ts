import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  FilterSucursalUsuarioDTO,
  SucursalUsuario,
  CreateSucursalUsuarioDTO,
} from '../../types/sucursalUsuarios/SucursalUsuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SucursalUsuariosService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/SucursalUsuario`;

  getAll(filter: FilterSucursalUsuarioDTO): Observable<SucursalUsuario[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize);

    params = params.set('sucursalId', filter.sucursalId.toString());

    if (filter.usuarioId) params = params.set('usuarioId', filter.usuarioId);
    if (filter.minDistancia) params = params.set('minDistancia', filter.minDistancia.toString());
    if (filter.maxDistancia) params = params.set('maxDistancia', filter.maxDistancia.toString());

    return this.http.get<SucursalUsuario[]>(this.apiUrl, { params, withCredentials: true });
  }

  getById(sucursalId: number, usuarioId: string): Observable<SucursalUsuario> {
    return this.http.get<SucursalUsuario>(`${this.apiUrl}/${sucursalId}/${usuarioId}`, {
      withCredentials: true,
    });
  }

  create(dto: CreateSucursalUsuarioDTO): Observable<void> {
    return this.http.post<void>(this.apiUrl, dto, { withCredentials: true });
  }

  update(dto: SucursalUsuario): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${dto.sucursalId}/${dto.usuarioId}`, dto, {
      withCredentials: true,
    });
  }

  delete(sucursalId: number, usuarioId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sucursalId}/${usuarioId}`, {
      withCredentials: true,
    });
  }
}
