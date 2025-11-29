import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioViajesService } from '../../api/usuarioViajes/usuarioViajes.service';
import { UsuarioViaje, CreateUsuarioViajeDTO } from '../../types/usuarioViajes/UsuarioViaje';
import { AuthService } from '../../api/auth/auth.service';
import { UsuarioDropdown } from '../../types/auth/Auth';

@Component({
  selector: 'app-usuario-viajes',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './usuario-viajes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioViajes {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private usuarioViajesService = inject(UsuarioViajesService);
  private authService = inject(AuthService);

  viajeId = signal<number>(0);
  usuarios = signal<UsuarioViaje[]>([]);
  usuariosDropdown = signal<UsuarioDropdown[]>([]);
  isLoading = signal<boolean>(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      usuarioId: ['', Validators.required],
      distancia: [1, [Validators.required, Validators.min(1), Validators.max(100)]],
      tarifa: [0, [Validators.required, Validators.min(0)]],
      fecha: [new Date().toISOString().split('T')[0], Validators.required],
    });

    this.loadUsuariosParaDropdown();

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('viajeId'));
      if (id) {
        this.viajeId.set(id);
        this.loadUsuarios(id);
      }
    });
  }

  loadUsuariosParaDropdown() {
    this.authService.loadUsuarios().subscribe({
      next: (data) => this.usuariosDropdown.set(data),
      error: (err) => console.error(err),
    });
  }

  loadUsuarios(viajeId: number) {
    this.isLoading.set(true);
    this.usuarioViajesService
      .getAll({
        viajeId,
        pageNumber: 1,
        pageSize: 100,
      })
      .subscribe({
        next: (data) => {
          this.usuarios.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const formValue = this.form.value;

    const dto: CreateUsuarioViajeDTO = {
      viajeId: this.viajeId(),
      usuarioId: formValue.usuarioId,
      distancia: formValue.distancia,
      tarifa: formValue.tarifa,
      fecha: formValue.fecha,
    };

    this.usuarioViajesService.create(dto).subscribe({
      next: () => {
        this.form.reset({
          usuarioId: '', // Limpiar el select
          fecha: new Date().toISOString().split('T')[0],
          distancia: 1,
          tarifa: 0,
        });
        this.loadUsuarios(this.viajeId());
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete(usuarioId: string) {
    if (!confirm('¿Quitar pasajero del viaje?')) return;

    this.isLoading.set(true);
    this.usuarioViajesService.delete(this.viajeId(), usuarioId).subscribe({
      next: () => this.loadUsuarios(this.viajeId()),
      error: () => this.isLoading.set(false),
    });
  }
}
