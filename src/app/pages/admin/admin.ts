import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Admin implements OnInit {
  private readonly authService = inject(AuthService);

  readonly currentUser = this.authService.currentUser;

  readonly userInitials = computed(() => {
    const user = this.currentUser();
    if (!user) {
      return '?';
    }
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  });

  readonly fullName = computed(() => {
    const user = this.currentUser();
    if (!user) {
      return 'Admin User';
    }
    return `${user.firstName} ${user.lastName}`;
  });

  ngOnInit(): void {
    if (!this.currentUser()) {
      this.authService.getMe().subscribe();
    }
  }

  logout(): void {
    this.authService.logout();
  }
}