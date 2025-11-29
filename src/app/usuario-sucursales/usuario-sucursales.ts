import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SucursalUsuariosService } from '../../api/sucursalUsuarios/sucursalUsuarios.services';
import {
  SucursalUsuario,
  CreateSucursalUsuarioDTO,
} from '../../types/sucursalUsuarios/SucursalUsuario';
import { AuthService } from '../../api/auth/auth.service';
import { UsuarioDropdown } from '../../types/auth/Auth';

@Component({
  selector: 'app-usuario-sucursales',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './usuario-sucursales.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsuarioSucursales {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private sucursalUsuarioService = inject(SucursalUsuariosService);
  private authService = inject(AuthService);

  sucursalId = signal<number>(0);
  colaboradores = signal<SucursalUsuario[]>([]);
  usuarios = signal<UsuarioDropdown[]>([]);
  isLoading = signal<boolean>(false);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      usuarioId: ['', Validators.required],
      distancia: [1, [Validators.required, Validators.min(1), Validators.max(50)]],
    });
    this.loadUsuarios();

    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('sucursalId'));
      if (id) {
        this.sucursalId.set(id);
        this.loadColaboradores(id);
      }
    });
  }

  loadUsuarios() {
    this.isLoading.set(true);
    this.authService.loadUsuarios().subscribe({
      next: (data) => {
        this.isLoading.set(false);
        this.usuarios.set(data);
      },
      error: () => this.isLoading.set(false),
    });
  }

  loadColaboradores(sucursalId: number) {
    this.isLoading.set(true);
    this.sucursalUsuarioService
      .getAll({
        sucursalId,
        pageNumber: 1,
        pageSize: 100,
      })
      .subscribe({
        next: (data) => {
          this.colaboradores.set(data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    const formValue = this.form.value;

    const dto: CreateSucursalUsuarioDTO = {
      sucursalId: this.sucursalId(),
      usuarioId: formValue.usuarioId,
      distancia: formValue.distancia,
    };

    this.sucursalUsuarioService.create(dto).subscribe({
      next: () => {
        this.form.reset({ distancia: 1 });
        this.loadColaboradores(this.sucursalId());
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
    });
  }

  onDelete(usuarioId: string) {
    if (!confirm('¿Desvincular colaborador de la sucursal?')) return;

    this.isLoading.set(true);
    this.sucursalUsuarioService.delete(this.sucursalId(), usuarioId).subscribe({
      next: () => this.loadColaboradores(this.sucursalId()),
      error: () => this.isLoading.set(false),
    });
  }
}
