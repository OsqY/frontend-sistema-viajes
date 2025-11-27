import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { LoginInfo } from '../../types/auth/Auth';
import { email, form, required } from '@angular/forms/signals';
import { Field } from '@angular/forms/signals';
import { AuthService } from '../../api/auth/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  imports: [Field, FormsModule],
  standalone: true,
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginError = signal<boolean>(false);

  loginModel = signal<LoginInfo>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    (required(fieldPath.email, { message: 'El correo electrónico es requerido' }),
      email(fieldPath.email, { message: 'El correo electrónico no es válido' }),
      required(fieldPath.password, { message: 'La contraseña es requerida' }));
  });

  login() {
    if (this.loginForm().invalid()) return;

    this.authService.login(this.loginForm().value()).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/viajes']);
        } else {
          this.loginError.set(true);
        }
      },
      error: () => {
        this.loginError.set(true);
      },
    });
  }
}
