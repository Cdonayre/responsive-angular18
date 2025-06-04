import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthUserService } from './auth-user.service';

export const authUserGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthUserService);
    const router = inject(Router);
  
    if(authService.isLoggedIn()){
      return true;
    }
    router.navigate(['login']);
    return false;
};
