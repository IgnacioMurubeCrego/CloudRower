import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError(err => {
      // Only redirect to login for expired/invalid sessions on authenticated routes.
      // Auth routes (/api/auth/*) must handle their own errors (e.g. wrong password,
      // duplicate email) without triggering a logout redirect.
      const isAuthRoute = req.url.includes('/api/auth/');
      if ((err.status === 401 || err.status === 403) && !isAuthRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.navigate(['/auth/login']);
      }
      return throwError(() => err);
    })
  );
};
