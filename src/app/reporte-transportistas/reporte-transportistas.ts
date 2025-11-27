import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ViajesService } from '../../api/viajes/viajes.service';
import { ViajeReportDTO, FilterReportDTO } from '../../types/viajes/Viaje';
import { SucursalService } from '../../api/sucursales/sucursales.service';
import { TransportistaService } from '../../api/transportistas/transportistas.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sucursal } from '../../types/sucursales/Sucursal';
import { Transportista } from '../../types/transportistas/Transportista';

@Component({
  selector: 'app-reporte-transportistas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reporte-transportistas.html',
  styleUrl: './reporte-transportistas.css',
})
export class ReporteTransportistas {
  private fb = inject(FormBuilder);
  private viajesService = inject(ViajesService);
  private sucursalesService = inject(SucursalService);
  private transportistasService = inject(TransportistaService);

  reportData: ViajeReportDTO[] = [];
  filterForm: FormGroup;

  sucursales$: Observable<Sucursal[]>;
  transportistas$: Observable<Transportista[]>;

  totalViajes = 0;
  totalDistancia = 0;
  totalTarifa = 0;

  constructor() {
    this.filterForm = this.fb.group({
      fechaInicio: [''],
      fechaFin: [''],
      sucursalId: [''],
      transportistaId: [''],
    });

    this.sucursales$ = this.sucursalesService
      .getAll({ pageNumber: 1, pageSize: 100 })
      .pipe(map((res) => res));
    this.transportistas$ = this.transportistasService
      .getAll({ pageNumber: 1, pageSize: 100 })
      .pipe(map((res) => res));
  }

  generarReporte() {
    const formVal = this.filterForm.value;

    const filter: FilterReportDTO = {
      minFecha: formVal.fechaInicio || undefined,
      maxFecha: formVal.fechaFin || undefined,
      sucursalId: formVal.sucursalId ? Number(formVal.sucursalId) : undefined,
      transportistaId: formVal.transportistaId ? Number(formVal.transportistaId) : undefined,
    };

    this.viajesService.getReport(filter).subscribe({
      next: (data) => {
        this.reportData = data;
        this.calcularTotales();
      },
      error: (err) => console.error('Error cargando reporte', err),
    });
  }

  calcularTotales() {
    this.totalViajes = this.reportData.length;
    this.totalDistancia = this.reportData.reduce((acc, curr) => acc + curr.distanciaTotal, 0);
    this.totalTarifa = this.reportData.reduce((acc, curr) => acc + curr.tarifaTotal, 0);
  }

  limpiarFiltros() {
    this.filterForm.reset();
    this.reportData = [];
    this.totalViajes = 0;
    this.totalDistancia = 0;
    this.totalTarifa = 0;
  }
}
