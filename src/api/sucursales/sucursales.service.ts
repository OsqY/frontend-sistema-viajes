import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateSucursalDTO,
  FilterSucursalDTO,
  Sucursal,
  UpdateSucursalDTO,
} from '../../types/sucursales/Sucursal';

@Injectable({
  providedIn: 'root',
})
export class SucursalService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api`;

  getAll(filter: FilterSucursalDTO): Observable<Sucursal[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize);

    if (filter.nombreFilter) params = params.set('nombreFilter', filter.nombreFilter);

    if (filter.direccionFilter) params = params.set('direccionFilter', filter.direccionFilter);

    return this.http.get<Sucursal[]>(`${this.apiUrl}/sucursal`, { params });
  }

  getById(id: number): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.apiUrl}/sucursal/${id}`);
  }

  create(sucursal: CreateSucursalDTO): Observable<Sucursal> {
    return this.http.post<Sucursal>(`${this.apiUrl}/sucursal`, sucursal);
  }

  update(sucursal: UpdateSucursalDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/sucursal/${sucursal.id}`, sucursal);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/sucursal/${id}`);
  }
}
