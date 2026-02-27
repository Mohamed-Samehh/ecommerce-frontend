import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { NavBar } from '../../components/nav-bar/nav-bar';

export const passwordMatchValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
};

type RegisterStep = 'details' | 'otp';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, NavBar],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly step = signal<RegisterStep>('details');
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  private readonly _email = signal('');
  readonly email = this._email.asReadonly();

  readonly registerForm = this.fb.group(
    {
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator }
  );

  readonly otpForm = this.fb.group({
    otp: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]{6}$/)]]
  });

  get firstNameCtrl() { return this.registerForm.get('firstName')!; }
  get lastNameCtrl() { return this.registerForm.get('lastName')!; }
  get emailCtrl() { return this.registerForm.get('email')!; }
  get dobCtrl() { return this.registerForm.get('dob')!; }
  get passwordCtrl() { return this.registerForm.get('password')!; }
  get confirmPasswordCtrl() { return this.registerForm.get('confirmPassword')!; }
  get otpCtrl() { return this.otpForm.get('otp')!; }

  get passwordMismatch(): boolean {
    return (
      this.registerForm.hasError('passwordMismatch') &&
      this.confirmPasswordCtrl.touched
    );
  }

  get maxDob(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  submitDetails(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { firstName, lastName, email, dob, password } = this.registerForm.value;

    this.authService
      .register({ firstName: firstName!, lastName: lastName!, email: email!, dob: dob!, password: password! })
      .subscribe({
        next: () => {
          this._email.set(email!);
          this.step.set('otp');
          this.isLoading.set(false);
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || 'Registration failed. Please try again.');
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

    this.authService.verifyRegisterOtp({ email: this.email(), otp: otp! }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        const serverError = err?.error?.message || err?.error?.errors;
        const isDuplicate = typeof serverError === 'string' && serverError.toLowerCase().includes('email');
        this.errorMessage.set(isDuplicate ? 'This email is already registered. Please use another email.' : (serverError || 'Invalid OTP. Please try again.'));
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.step.set('details');
    this.otpForm.reset();
    this.errorMessage.set(null);
  }
}
