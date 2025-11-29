import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginInfo, ManageInfo, RegisterInfo, UsuarioDropdown } from '../../types/auth/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  checkCookie(): Observable<boolean> {
    return this.http
      .get<ManageInfo>(`${this.apiUrl}/manage/info`, {
        withCredentials: true,
      })
      .pipe(
        map((manageInfo) => !!manageInfo),
        catchError(() => of(false)),
      );
  }

  login(loginForm: LoginInfo): Observable<boolean> {
    return this.http
      .post<any>(`${this.apiUrl}/login?useCookies=true&useSessionCookies=true`, loginForm, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((response) => response.status === 200),
        catchError(() => of(false)),
      );
  }

  register(registerForm: RegisterInfo): Observable<boolean> {
    return this.http
      .post<any>(`${this.apiUrl}/register`, registerForm, {
        observe: 'response',
      })
      .pipe(
        map((response) => response.status === 200),
        catchError(() => of(false)),
      );
  }

  loadUsuarios(): Observable<UsuarioDropdown[]> {
    return this.http.get<UsuarioDropdown[]>(`${this.apiUrl}/api/Auth/usuarios`, {
      withCredentials: true,
    });
  }
}
