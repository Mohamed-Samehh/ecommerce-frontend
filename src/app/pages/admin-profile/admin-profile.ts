import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-admin-profile',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly isEditMode = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    dob: ['', [Validators.required]]
  });

  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) return '?';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  });

  readonly fullName = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  });

  get firstNameCtrl() {
    return this.profileForm.get('firstName')!;
  }

  get lastNameCtrl() {
    return this.profileForm.get('lastName')!;
  }

  get dobCtrl() {
    return this.profileForm.get('dob')!;
  }

  ngOnInit(): void {
    if (this.currentUser()) {
      this.populateForm();
      return;
    }

    this.isLoading.set(true);
    this.authService.getMe().subscribe({
      next: () => {
        this.populateForm();
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  enterEditMode(): void {
    this.populateForm();
    this.isEditMode.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  cancelEdit(): void {
    this.isEditMode.set(false);
    this.populateForm();
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const { firstName, lastName, dob } = this.profileForm.value;
    this.authService.updateMe({ firstName: firstName!, lastName: lastName!, dob: dob! }).subscribe({
      next: () => {
        this.successMessage.set('Profile updated successfully!');
        this.isSaving.set(false);
        this.isEditMode.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to update profile. Please try again.');
        this.isSaving.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private populateForm(): void {
    const user = this.currentUser();
    if (!user) {
      return;
    }

    this.profileForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob ? user.dob.split('T')[0] : ''
    });
  }
}
