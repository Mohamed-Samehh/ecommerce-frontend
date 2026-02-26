import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  User,
  RegisterRequest,
  LoginRequest,
  OtpRequest,
  OtpSentResponse,
  AuthResponse
} from '../../interfaces/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private static readonly TOKEN_KEY = 'auth_token';

  private readonly _token = signal<string | null>(
    this.isBrowser ? localStorage.getItem(AuthService.TOKEN_KEY) : null
  );
  private readonly _currentUser = signal<User | null>(null);

  readonly token = this._token.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.roles.includes('admin') ?? false);

  register(data: RegisterRequest) {
    return this.http.post<OtpSentResponse>(`${this.baseUrl}/register`, data);
  }

  verifyRegisterOtp(data: OtpRequest) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register/verify-otp`, data)
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  login(data: LoginRequest) {
    return this.http.post<OtpSentResponse>(`${this.baseUrl}/login`, data);
  }

  verifyLoginOtp(data: OtpRequest) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login/verify-otp`, data)
      .pipe(tap((res) => this.handleAuthSuccess(res)));
  }

  getMe() {
    return this.http
      .get<User>(`${this.baseUrl}/me`)
      .pipe(tap((user) => this._currentUser.set(user)));
  }

  logout() {
    if (this.isBrowser) localStorage.removeItem(AuthService.TOKEN_KEY);
    this._token.set(null);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private handleAuthSuccess(res: AuthResponse): void {
    if (this.isBrowser) localStorage.setItem(AuthService.TOKEN_KEY, res.accessToken);
    this._token.set(res.accessToken);

    if (res.user) {
      this._currentUser.set(res.user); // Register returns the user
    } else {
      this.getMe().subscribe(); // Login only returns token. We will need to fetch the user
    }
  }
}
