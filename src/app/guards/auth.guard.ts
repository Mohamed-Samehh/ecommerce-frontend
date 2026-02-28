import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import Swal from 'sweetalert2';

export const authGuard: CanActivateFn = async () => {
  // During SSR there is no localStorage — let the browser re-run the guard.
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  await Swal.fire({
    icon: 'warning',
    iconColor: getComputedStyle(document.documentElement).getPropertyValue('--highlighted-text-color').trim() || '#732A10',
    title: 'Login required',
    text: 'Please log in to continue.',
    confirmButtonText: 'Go to login'
  });

  return router.createUrlTree(['/login']);
};
