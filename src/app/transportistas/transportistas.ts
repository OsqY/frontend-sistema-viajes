import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransportistaService } from '../../api/transportistas/transportistas.service';
import { FilterTransportistaDTO, Transportista } from '../../types/transportistas/Transportista';

@Component({
  selector: 'app-transportistas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transportistas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Transportistas {
  private transportistaService = inject(TransportistaService);
  private fb = inject(FormBuilder);

  transportistas = signal<Transportista[]>([]);
  isEditing = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  filter = signal<FilterTransportistaDTO>({
    pageNumber: 1,
    pageSize: 10,
    nombreFilter: '',
    apellidosFilter: '',
  });

  form = this.fb.nonNullable.group({
    id: [0],
    nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
    descripcion: ['', [Validators.required]],
  });

  constructor() {
    this.loadTransportistas();
  }

  loadTransportistas() {
    this.isLoading.set(true);
    this.transportistaService.getAll(this.filter()).subscribe({
      next: (data) => {
        this.transportistas.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const formValue = this.form.getRawValue();

    const { id, ...dto } = formValue;

    if (this.isEditing()) {
      this.transportistaService.update({ ...dto, id }).subscribe({
        next: () => {
          this.resetForm();
          this.loadTransportistas();
        },
        error: () => this.isLoading.set(false),
      });
    } else {
      this.transportistaService.create(dto).subscribe({
        next: () => {
          this.resetForm();
          this.loadTransportistas();
        },
        error: () => this.isLoading.set(false),
      });
    }
  }

  onEdit(transportista: Transportista) {
    this.isEditing.set(true);
    this.form.patchValue(transportista);
  }

  onDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar este transportista?')) return;

    this.isLoading.set(true);
    this.transportistaService.delete(id).subscribe({
      next: () => this.loadTransportistas(),
      error: () => this.isLoading.set(false),
    });
  }

  resetForm() {
    this.isEditing.set(false);
    this.form.reset({ id: 0, nombres: '', apellidos: '', descripcion: '' });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filter.update((f) => ({ ...f, nombreFilter: input.value }));
    this.loadTransportistas();
  }
}
