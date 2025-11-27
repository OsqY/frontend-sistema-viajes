import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject } from '@angular/core/primitives/di';
import { environment } from '../../environments/environment';
import {
  CreateViajeDTO,
  FilterReportDTO,
  FilterViajeDTO,
  UpdateViajeDTO,
  Viaje,
  ViajeReportDTO,
} from '../../types/viajes/Viaje';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViajesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/viaje`;

  getAll(filter: FilterViajeDTO): Observable<Viaje[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize);

    if (filter.transportistaId) params = params.set('transportistaId', filter.transportistaId);

    if (filter.sucursalId) params = params.set('sucursalId', filter.sucursalId);

    if (filter.minDistanciaTotal)
      params = params.set('minDistanciaTotal', filter.minDistanciaTotal);

    if (filter.maxDistanciaTotal)
      params = params.set('maxDistanciaTotal', filter.maxDistanciaTotal);

    if (filter.minTarifaTotal) params = params.set('minTarifaTotal', filter.minTarifaTotal);

    if (filter.maxTarifaTotal) params = params.set('maxTarifaTotal', filter.maxTarifaTotal);

    if (filter.minFecha) params = params.set('minFecha', filter.minFecha);

    if (filter.maxFecha) params = params.set('maxFecha', filter.maxFecha);

    return this.http.get<Viaje[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Viaje> {
    return this.http.get<Viaje>(`${this.apiUrl}/${id}`);
  }

  create(viaje: CreateViajeDTO): Observable<Viaje> {
    return this.http.post<Viaje>(this.apiUrl, viaje);
  }

  update(viaje: UpdateViajeDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${viaje.id}`, viaje);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getReport(filter: FilterReportDTO): Observable<ViajeReportDTO[]> {
    let params = new HttpParams();

    if (filter.transportistaId) params = params.set('transportistaId', filter.transportistaId);
    if (filter.sucursalId) params = params.set('sucursalId', filter.sucursalId);
    if (filter.minFecha) params = params.set('minFecha', filter.minFecha);
    if (filter.maxFecha) params = params.set('maxFecha', filter.maxFecha);
    if (filter.minTarifaTotal) params = params.set('minTarifaTotal', filter.minTarifaTotal);
    if (filter.maxTarifaTotal) params = params.set('maxTarifaTotal', filter.maxTarifaTotal);

    return this.http.get<ViajeReportDTO[]>(`${this.apiUrl}/report`, { params });
  }
}
