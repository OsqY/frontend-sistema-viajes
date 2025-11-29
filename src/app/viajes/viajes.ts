import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { form, Field, required, min, submit } from '@angular/forms/signals';
import { ViajesService } from '../../api/viajes/viajes.service';
import { SucursalService } from '../../api/sucursales/sucursales.service';
import { Viaje, FilterViajeDTO, CreateViajeDTO, UpdateViajeDTO } from '../../types/viajes/Viaje';
import { Sucursal } from '../../types/sucursales/Sucursal';
import { RouterLink } from '@angular/router';
import { Transportista } from '../../types/transportistas/Transportista';
import { TransportistaService } from '../../api/transportistas/transportistas.service';

interface ViajeFormData {
  id: number;
  transportistaId: number;
  sucursalId: number;
}

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, Field, RouterLink],
  templateUrl: './viajes.html',
  styleUrl: './viajes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Viajes {
  private viajeService = inject(ViajesService);
  private sucursalService = inject(SucursalService);
  private transportistaService = inject(TransportistaService);

  viajes = signal<Viaje[]>([]);
  sucursales = signal<Sucursal[]>([]);
  transportistas = signal<Transportista[]>([]);
  isEditing = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  filter = signal<FilterViajeDTO>({
    pageNumber: 1,
    pageSize: 10,
  });

  viajeModel = signal<ViajeFormData>({
    id: 0,
    transportistaId: 0,
    sucursalId: 0,
  });

  viajeForm = form(this.viajeModel, (f) => {
    required(f.transportistaId, { message: 'El transportista es requerido' });

    required(f.sucursalId, { message: 'Debe seleccionar una sucursal' });
  });

  constructor() {
    this.loadViajes();
    this.loadSucursalesForSelect();
    this.loadTransportistasForSelect();
  }

  loadTransportistasForSelect() {
    this.transportistaService.getAll({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (data) => this.transportistas.set(data),
      error: (err) => console.error('Error cargando transportistas', err),
    });
  }

  loadViajes() {
    this.isLoading.set(true);
    this.viajeService.getAll(this.filter()).subscribe({
      next: (data) => {
        this.viajes.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  loadSucursalesForSelect() {
    this.sucursalService.getAll({ pageNumber: 1, pageSize: 100 }).subscribe({
      next: (data) => this.sucursales.set(data),
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.viajeForm, async () => {
      this.isLoading.set(true);
      const formValue = this.viajeModel();

      if (this.isEditing()) {
        const updateDto: UpdateViajeDTO = {
          id: formValue.id,
          transportistaId: formValue.transportistaId,
        };

        this.viajeService.update(updateDto).subscribe({
          next: () => {
            this.resetForm();
            this.loadViajes();
          },
          error: () => this.isLoading.set(false),
        });
      } else {
        const createDto: CreateViajeDTO = {
          transportistaId: formValue.transportistaId,
          sucursalId: formValue.sucursalId,
        };

        this.viajeService.create(createDto).subscribe({
          next: () => {
            this.resetForm();
            this.loadViajes();
          },
          error: () => this.isLoading.set(false),
        });
      }
    });
  }

  onEdit(viaje: Viaje) {
    this.isEditing.set(true);
    this.viajeModel.set({
      id: viaje.id,
      transportistaId: viaje.transportistaId,
      sucursalId: viaje.sucursalId,
    });
  }

  onDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este viaje?')) return;
    this.isLoading.set(true);
    this.viajeService.delete(id).subscribe({
      next: () => this.loadViajes(),
      error: () => this.isLoading.set(false),
    });
  }

  resetForm() {
    this.isEditing.set(false);
    this.viajeModel.set({ id: 0, transportistaId: 0, sucursalId: 0 });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && !isNaN(Number(value))) {
      this.filter.update((f) => ({ ...f, transportistaId: Number(value) }));
    } else {
      this.filter.update((f) => {
        const { transportistaId, ...rest } = f;
        return rest as FilterViajeDTO;
      });
    }
    this.loadViajes();
  }
}
