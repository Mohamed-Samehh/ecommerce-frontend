import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth/auth';
import Swal from 'sweetalert2';

export const adminGuard: CanActivateFn = async () => {
  // During SSR there is no DOM APIs for alerts — let the browser re-run the guard.
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);
  const iconColor =
    getComputedStyle(document.documentElement).getPropertyValue('--highlighted-text-color').trim() || '#732A10';

  if (!authService.isLoggedIn()) {
    await Swal.fire({
      icon: 'warning',
      iconColor,
      title: 'Login required',
      text: 'Please log in to access admin pages.',
      confirmButtonText: 'Go to login'
    });

    return router.createUrlTree(['/login']);
  }

  if (authService.isAdmin()) {
    return true;
  }

  try {
    await firstValueFrom(authService.getMe());

    if (authService.isAdmin()) {
      return true;
    }

    await Swal.fire({
      icon: 'error',
      iconColor,
      title: 'Access denied',
      text: 'You do not have admin permissions.',
      confirmButtonText: 'Go to home'
    });

    return router.createUrlTree(['/']);
  } catch {
    await Swal.fire({
      icon: 'error',
      iconColor,
      title: 'Session issue',
      text: 'Please log in again.',
      confirmButtonText: 'Go to login'
    });

    return router.createUrlTree(['/login']);
  }
};
