import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { NavBar } from '../../components/nav-bar/nav-bar';

type LoginStep = 'credentials' | 'otp';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, NavBar],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly step = signal<LoginStep>('credentials');
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly _email = signal('');
  readonly email = this._email.asReadonly();

  readonly credentialsForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  readonly otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6}$/)]]
  });

  get emailCtrl() {
    return this.credentialsForm.get('email')!;
  }

  get passwordCtrl() {
    return this.credentialsForm.get('password')!;
  }

  get otpCtrl() {
    return this.otpForm.get('otp')!;
  }

  submitCredentials(): void {
    if (this.credentialsForm.invalid) {
      this.credentialsForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { email, password } = this.credentialsForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this._email.set(email!);
        this.step.set('otp');
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Login failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  submitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);
    const { otp } = this.otpForm.value;

    this.authService.verifyLoginOtp({ email: this.email(), otp: otp! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Invalid OTP. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.step.set('credentials');
    this.otpForm.reset();
    this.errorMessage.set(null);
  }
}
