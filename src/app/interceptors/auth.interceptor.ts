import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token();

  if (!token) {
    return next(req);
  }

  const authenticatedReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authenticatedReq);
};
