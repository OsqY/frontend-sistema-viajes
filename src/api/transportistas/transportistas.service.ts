import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateTransportistaDTO,
  FilterTransportistaDTO,
  Transportista,
  UpdateTransportistaDTO,
} from '../../types/transportistas/Transportista';

@Injectable({
  providedIn: 'root',
})
export class TransportistaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/transportista`;

  getAll(filter: FilterTransportistaDTO): Observable<Transportista[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber)
      .set('pageSize', filter.pageSize);

    if (filter.nombreFilter) params = params.set('nombreFilter', filter.nombreFilter);
    if (filter.apellidosFilter) params = params.set('apellidosFilter', filter.apellidosFilter);

    return this.http.get<Transportista[]>(this.apiUrl, { params, withCredentials: true });
  }

  getById(id: number): Observable<Transportista> {
    return this.http.get<Transportista>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  create(transportista: CreateTransportistaDTO): Observable<Transportista> {
    return this.http.post<Transportista>(this.apiUrl, transportista, { withCredentials: true });
  }

  update(transportista: UpdateTransportistaDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${transportista.id}`, transportista, {
      withCredentials: true,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }
}
