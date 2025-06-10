import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import AuthService from '../../auth/services/auth.service';
import { ROUTE_PATHS } from '../../global/constants/route.constants';
import { StorageEncryptService } from '../../services/storage/storage-encrypt.service';

export const authGuard: CanActivateFn = (  __route: ActivatedRouteSnapshot,
  __state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const localStorageServiceEncrypt = inject(StorageEncryptService);
  const router = inject(Router);
  const currentUser = authService.isAuthenticated();
  if (currentUser) {
    return true;
  }
  localStorageServiceEncrypt.clearData();
  return router.navigate([ROUTE_PATHS.LOGIN]);
};

export const AuthLoginGuard: CanActivateFn = (
  __route: ActivatedRouteSnapshot,
  __state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.isAuthenticated();
  if (currentUser) {
    return router.navigate([ROUTE_PATHS.DASHBOARD]);
  } else {
    return true;
  }
};