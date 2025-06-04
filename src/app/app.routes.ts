import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {path: '',redirectTo: 'login',pathMatch: 'full'},
    {path:'login',
        title:'Login',
        loadComponent:()=>import('./page/login/login.component')
        
    },
    {path:'dashboard', 
        loadComponent: () => import('./page/dashboard/dashboard.component'),
        canActivate: [authGuard],
        children: [
            {path:'establecimientos',
                title:'Establecimientos',
                loadComponent:()=>import('./page/establecimientos/establecimientos.component')
            },
            {path:'ris',
                title:'Ris',
                loadComponent:()=>import('./page/ris/ris.component')
            },
            {path:'categorias',
                title:'Categorías',
                loadComponent:()=>import('./page/categorias/categorias.component')
            },
            {path:'distritos',
                title:'Distritos',
                loadComponent:()=>import('./page/distritos/distritos.component')
            },
            {
                path:'usuario',
                title:'Usuarios',
                loadComponent:()=>import('./page/usuario/usuario.component')
            }
        ]
    }
];
