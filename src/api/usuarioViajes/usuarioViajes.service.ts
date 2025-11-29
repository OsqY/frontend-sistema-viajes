import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { environment } from '../../environments/environment';
import {
  CreateUsuarioViajeDTO,
  FilterUsuarioViajeDTO,
  UsuarioViaje,
} from '../../types/usuarioViajes/UsuarioViaje';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioViajesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/usuarioViaje`;

  getAll(filter: FilterUsuarioViajeDTO): Observable<UsuarioViaje[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize)
      .set('viajeId', filter.viajeId.toString());

    if (filter.usuarioId) params = params.set('usuarioId', filter.usuarioId);

    if (filter.fecha) params = params.set('fecha', filter.fecha.toString());

    if (filter.minDistancia) params = params.set('minDistancia', filter.minDistancia.toString());

    if (filter.maxDistancia) params = params.set('maxDistancia', filter.maxDistancia.toString());

    return this.http.get<UsuarioViaje[]>(this.apiUrl, { params, withCredentials: true });
  }

  getById(id: number): Observable<UsuarioViaje> {
    return this.http.get<UsuarioViaje>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(usuarioViaje: CreateUsuarioViajeDTO): Observable<void> {
    return this.http.post<void>(this.apiUrl, usuarioViaje, { withCredentials: true });
  }

  update(usuarioViaje: UsuarioViaje): Observable<UsuarioViaje> {
    return this.http.put<UsuarioViaje>(
      `${this.apiUrl}/${usuarioViaje.viajeId}/${usuarioViaje.usuarioId}`,
      usuarioViaje,
      { withCredentials: true },
    );
  }

  delete(viajeId: number, usuarioId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${viajeId}/${usuarioId}`, {
      withCredentials: true,
    });
  }
}
