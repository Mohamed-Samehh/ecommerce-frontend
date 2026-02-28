import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest
} from '../../interfaces/admin-user';
import { AdminUserService } from '../../services/admin-user/admin-user';
import {
  notFutureDateValidator,
  passwordStrengthPattern
} from '../../utils/form-validators';

@Component({
  selector: 'app-admin-users',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminUsers implements OnInit {
  private readonly adminUserService = inject(AdminUserService);
  private readonly fb = inject(FormBuilder);

  readonly users = signal<AdminUser[]>([]);
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly searchTerm = signal('');
  readonly roleFilter = signal('');
  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);
  readonly totalUsers = signal(0);
  readonly editingUserId = signal<string | null>(null);
  readonly showModal = signal(false);

  readonly isEditMode = computed(() => this.editingUserId() !== null);
  readonly visiblePages = computed(() => {
    const pages = this.totalPages();
    const current = this.currentPage();
    const start = Math.max(1, current - 2);
    const end = Math.min(pages, start + 4);

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  readonly userForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    dob: ['', [Validators.required, notFutureDateValidator]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(passwordStrengthPattern)]],
    isAdmin: [false]
  });

  get firstNameCtrl() { return this.userForm.controls.firstName; }
  get lastNameCtrl() { return this.userForm.controls.lastName; }
  get emailCtrl() { return this.userForm.controls.email; }
  get dobCtrl() { return this.userForm.controls.dob; }
  get passwordCtrl() { return this.userForm.controls.password; }

  get maxDob(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page = this.currentPage()): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const safePage = Math.max(1, page);
    this.currentPage.set(safePage);

    this.adminUserService.getUsers(
      safePage,
      this.pageSize(),
      this.searchTerm(),
      this.roleFilter()
    ).subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.totalUsers.set(res.pagination.total);
        this.totalPages.set(Math.max(1, res.pagination.pages));
        this.currentPage.set(res.pagination.page);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to load users.');
        this.isLoading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.searchTerm.set(input?.value ?? '');
  }

  onSearchSubmit(event?: Event): void {
    event?.preventDefault();
    this.loadUsers(1);
  }

  onRoleFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    this.roleFilter.set(select?.value ?? '');
    this.loadUsers(1);
  }

  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    const parsed = Number(select?.value ?? 10);
    this.pageSize.set(Number.isNaN(parsed) ? 10 : parsed);
    this.loadUsers(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) {
      return;
    }
    this.loadUsers(page);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  openAddModal(): void {
    this.startCreate();
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.startCreate();
  }

  startCreate(): void {
    this.editingUserId.set(null);
    this.setPasswordValidators(true);
    this.userForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      password: '',
      isAdmin: false
    });
    this.clearEmailTakenError();
  }

  startEdit(user: AdminUser): void {
    this.editingUserId.set(user._id);
    this.showModal.set(true);
    this.setPasswordValidators(false);
    this.userForm.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob ? user.dob.slice(0, 10) : '',
      password: '',
      isAdmin: user.roles.includes('admin')
    });
    this.clearEmailTakenError();
  }

  saveUser(): void {
    this.clearEmailTakenError();

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const raw = this.userForm.getRawValue();
    const basePayload = {
      firstName: raw.firstName.trim(),
      lastName: raw.lastName.trim(),
      email: raw.email.trim().toLowerCase(),
      dob: raw.dob,
      isAdmin: raw.isAdmin
    };

    if (this.isEditMode()) {
      const userId = this.editingUserId();
      if (!userId) {
        this.isSaving.set(false);
        return;
      }

      const updatePayload: UpdateAdminUserRequest = { ...basePayload };
      const password = raw.password.trim();
      if (password) {
        updatePayload.password = password;
      }

      this.adminUserService.updateUser(userId, updatePayload).subscribe({
        next: () => {
          this.successMessage.set('User updated successfully.');
          this.isSaving.set(false);
          this.showModal.set(false);
          this.startCreate();
          this.loadUsers(this.currentPage());
        },
        error: (err) => {
          this.errorMessage.set(err?.error?.message || err?.error?.errors || 'Failed to update user.');
          this.isSaving.set(false);
        }
      });

      return;
    }

    const createPayload: CreateAdminUserRequest = {
      ...basePayload,
      password: raw.password.trim()
    };

    this.adminUserService.createUser(createPayload).subscribe({
      next: () => {
        this.successMessage.set('User created successfully.');
        this.isSaving.set(false);
        this.showModal.set(false);
        this.startCreate();
        this.loadUsers(1);
      },
      error: (err) => {
        const errorText = err?.error?.message || err?.error?.errors;
        const isEmailTaken =
          typeof errorText === 'string' &&
          errorText.toLowerCase().includes('email') &&
          (errorText.toLowerCase().includes('taken') || errorText.toLowerCase().includes('exist'));

        if (isEmailTaken) {
          this.userForm.controls.email.setErrors({ ...this.userForm.controls.email.errors, emailTaken: true });
          this.userForm.controls.email.markAsTouched();
        }

        this.errorMessage.set(errorText || 'Failed to create user.');
        this.isSaving.set(false);
      }
    });
  }

  deleteUser(user: AdminUser): void {
    if (!confirm(`Delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.adminUserService.deleteUser(user._id).subscribe({
      next: () => {
        this.successMessage.set('User deleted successfully.');
        const targetPage = this.users().length === 1 && this.currentPage() > 1
          ? this.currentPage() - 1
          : this.currentPage();
        this.loadUsers(targetPage);
      },
      error: (err) => {
        this.errorMessage.set(err?.error?.message || 'Failed to delete user.');
      }
    });
  }

  clearForm(): void {
    this.closeModal();
  }

  private setPasswordValidators(isRequired: boolean): void {
    const validators = isRequired
      ? [Validators.required, Validators.minLength(8), Validators.pattern(passwordStrengthPattern)]
      : [Validators.minLength(8), Validators.pattern(passwordStrengthPattern)];

    this.userForm.controls.password.setValidators(validators);
    this.userForm.controls.password.updateValueAndValidity();
  }

  private clearEmailTakenError(): void {
    const emailControl = this.userForm.controls.email;
    if (!emailControl.hasError('emailTaken')) {
      return;
    }

    const otherErrors = { ...(emailControl.errors ?? {}) };
    delete otherErrors['emailTaken'];
    emailControl.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
  }
}
