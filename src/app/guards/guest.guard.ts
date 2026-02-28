import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import Swal from 'sweetalert2';

export const guestGuard: CanActivateFn = async () => {
  // During SSR there is no localStorage — let the browser re-run the guard.
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    await Swal.fire({
      icon: 'info',
      iconColor: getComputedStyle(document.documentElement).getPropertyValue('--highlighted-text-color').trim() || '#732A10',
      title: 'Already logged in',
      text: 'You are already signed in.',
      confirmButtonText: 'Go to home'
    });

    return router.createUrlTree(['/']);
  }

  return true;
};
