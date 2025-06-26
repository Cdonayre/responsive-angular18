import { Routes } from '@angular/router';
import { authGuard, AuthLoginGuard } from './core/guard/auth.guard';

export const routes: Routes = [
    {path: '',redirectTo: 'login',pathMatch: 'full'},
    {
    path: 'login',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    canActivate: [AuthLoginGuard],
    },
    {
    path: 'dashboard',
    loadChildren: () =>
      import('./admin/bussiness/business.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [authGuard],
    data: { breadcrumb: 'Inicio' },
    },
  { path: '**', redirectTo: 'not-found' },
];
