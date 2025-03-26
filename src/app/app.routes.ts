import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: '',redirectTo: 'login',pathMatch: 'full'},
    {path:'login',
        title:'Login',
        loadComponent:()=>import('./page/login/login.component')
    },
    {path:'dashboard', 
        loadComponent: () => import('./page/dashboard/dashboard.component'),
        children: [
            {path:'establecimeintos',
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
        ]
    }
];
