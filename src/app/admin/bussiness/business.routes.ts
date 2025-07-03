import { Routes } from '@angular/router';
import DashboardComponent from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import EstablecimientosComponent from '../../page/establecimientos/establecimientos.component';
import RisComponent from '../../page/ris/ris.component';
import DistritosComponent from '../../page/distritos/distritos.component';
import CategoriasComponent from '../../page/categorias/categorias.component';
import UsuarioComponent from '../../page/usuario/usuario.component';
import RolesComponent from '../../page/roles/roles.component';
import { ListaUsuariosComponent } from '../../page/lista-usuarios/lista-usuarios.component';
import SistemasComponent from '../../page/sistemas/sistemas.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'main',
    component: AdminLayoutComponent,
    data: { breadcrumb: { skip: true } },
    children: [
      {
        path: 'init',
        component: DashboardComponent,
        // data: {
        //   breadcrumb: 'dashboard',
        //   label: 'Dashboard',
        //   icon: 'menu',
        //   visibleToUserTypes: ['admin_dashboard_user'],
        // },
      },
      {
        path: 'establecimientos',
        component: EstablecimientosComponent,
        data: {
          breadcrumb: 'Establecimientos',
          label: 'Establecimientos',
          icon: 'medication',
          visibleToUserTypes: ['admin_dashboard_user'],
        },
      },
      {
        path: 'ris',
        component: RisComponent,
        data: {
          breadcrumb: 'RIS',
          label: 'RIS',
          icon: 'domain',
          visibleToUserTypes: ['admin_dashboard_user'],
        },
      },
      {
        path: 'distitos',
        component: DistritosComponent,
        data: {
          breadcrumb: 'Distritos',
          label: 'Distritos',
          icon: 'explore',
          visibleToUserTypes: ['admin_dashboard_user'],
        },
      },
      {
        path: 'categorías',
        component: CategoriasComponent,
        data: {
          breadcrumb: 'ategorías',
          label: 'Categorías',
          icon: 'category',
          visibleToUserTypes: ['admin_dashboard_user'],
        },
      },
      {
        path: 'usuarios',
        component: UsuarioComponent,
        data: {
          breadcrumb: 'Usuario',
          label: 'Usuarios',
          icon: 'person',
          visibleToUserTypes: ['regular_api_user'],
        },
      },
      {
        path: 'roles',
        component: RolesComponent,
        data: {
          breadcrumb: 'Roles',
          label: 'Roles',
          icon: 'group_remove',
          visibleToUserTypes: ['regular_api_user'],
        },
      },
      {
        path: 'lista-usuarios',
        component: ListaUsuariosComponent,
        data: {
          breadcrumb: 'Lista-usuarios',
          label: 'Lista Usuarios',
          icon: 'groups',
          visibleToUserTypes: ['regular_api_user'],
        },
      },
      {
        path: 'sistemas',
        component: SistemasComponent,
        data: {
          breadcrumb: 'Sistemas',
          label: 'Sistemas',
          icon: 'settings',
          visibleToUserTypes: ['regular_api_user'],
        },
      },
    ],
  },
  { path: '', redirectTo: 'main/init', pathMatch: 'full' },
];
