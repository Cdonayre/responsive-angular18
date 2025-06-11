import { Routes } from '@angular/router';
import DashboardComponent from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import EstablecimientosComponent from '../../page/establecimientos/establecimientos.component';
import RisComponent from '../../page/ris/ris.component';
import DistritosComponent from '../../page/distritos/distritos.component';
import CategoriasComponent from '../../page/categorias/categorias.component';
import UsuarioComponent from '../../page/usuario/usuario.component';


export const ADMIN_ROUTES: Routes = [
  {
    path: 'main',
    component: AdminLayoutComponent,
    data: { breadcrumb: { skip: true } },
    children: [
      // {
      //   path: 'init',
      //   component: DashboardComponent,
      //   data: { breadcrumb: 'dashboard',
      //     label:'Dashboard',
      //     icon:'dashboard',
      //     visibleToUserTypes: ['admin_dashboard_user'] 
      //   }, 
      // },
      {
        path: 'init',
        component: EstablecimientosComponent,
        data: { breadcrumb: 'Establecimientos',
          label:'Establecimientos',
          icon:'store',
          visibleToUserTypes: ['admin_dashboard_user']
         },
      },
      {
        path:'RIS',
        component: RisComponent,
        data: { breadcrumb: 'RIS',
          label:'RIS',
          icon:'local_hospital',
          visibleToUserTypes: ['admin_dashboard_user']
         },
      },
      {
        path:'Distitos',
        component: DistritosComponent,
        data: { breadcrumb: 'Distritos',
          label:'Distritos',
          icon:'location_on',
          visibleToUserTypes: ['admin_dashboard_user']
         },
      },
      {
        path:'Categorías',
        component: CategoriasComponent,
        data: { breadcrumb: 'Categorías',
          label:'Categorías',
          icon:'category',
          visibleToUserTypes: ['admin_dashboard_user']
         },
      },
      {
        path:'Usuarios',
        component: UsuarioComponent,
        data: { breadcrumb: 'Usuario',
          label:'Usuarios',
          icon:'user',
          visibleToUserTypes: ['regular_api_user']
         },
      }

    ],
  },
  { path: '', redirectTo: 'main/init', pathMatch: 'full' },
];
