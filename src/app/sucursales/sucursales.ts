import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SucursalService } from '../../api/sucursales/sucursales.service';
import { Sucursal, FilterSucursalDTO } from '../../types/sucursales/Sucursal';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sucursales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sucursales.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sucursales {
  private sucursalService = inject(SucursalService);
  private fb = inject(FormBuilder);

  sucursales = signal<Sucursal[]>([]);
  isEditing = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  filter = signal<FilterSucursalDTO>({
    pageNumber: 1,
    pageSize: 10,
    nombreFilter: '',
    direccionFilter: '',
  });

  form = this.fb.nonNullable.group({
    id: [0],
    nombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(255)]],
  });

  constructor() {
    this.loadSucursales();
  }

  loadSucursales() {
    this.isLoading.set(true);
    this.sucursalService.getAll(this.filter()).subscribe({
      next: (data) => {
        this.sucursales.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const formValue = this.form.getRawValue();

    if (this.isEditing()) {
      this.sucursalService.update({ ...formValue, id: formValue.id }).subscribe({
        next: () => {
          this.resetForm();
          this.loadSucursales();
        },
        error: () => this.isLoading.set(false),
      });
    } else {
      const { id, ...createDto } = formValue;
      this.sucursalService.create(createDto).subscribe({
        next: () => {
          this.resetForm();
          this.loadSucursales();
        },
        error: () => this.isLoading.set(false),
      });
    }
  }

  onEdit(sucursal: Sucursal) {
    this.isEditing.set(true);
    this.form.patchValue(sucursal);
  }

  onDelete(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta sucursal?')) return;

    this.isLoading.set(true);
    this.sucursalService.delete(id).subscribe({
      next: () => this.loadSucursales(),
      error: () => this.isLoading.set(false),
    });
  }

  resetForm() {
    this.isEditing.set(false);
    this.form.reset({ id: 0, nombre: '', direccion: '' });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filter.update((f) => ({ ...f, nombreFilter: input.value }));
    this.loadSucursales();
  }
}
