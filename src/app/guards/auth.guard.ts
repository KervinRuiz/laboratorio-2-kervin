
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    if (
      typeof payload.exp !== 'number' ||
      payload.exp * 1000 <= Date.now()
    ) {
      return router.createUrlTree(['/login']);
    }

    return true;
  } catch {
    return router.createUrlTree(['/login']);
  }
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const payload = JSON.parse(
      atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );

    if (
      typeof payload.exp !== 'number' ||
      payload.exp * 1000 <= Date.now()
    ) {
      return router.createUrlTree(['/login']);
    }

    return payload.rol === 'SUPER-ADMIN-ROLE'
      ? true
      : router.createUrlTree(['/home']);
  } catch {
    return router.createUrlTree(['/login']);
  }
};
