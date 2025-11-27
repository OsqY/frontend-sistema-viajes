import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Sucursales } from './sucursales/sucursales';
import { Viajes } from './viajes/viajes';
import { Layout } from './layout/layout';
import { UsuarioViajes } from './usuario-viajes/usuario-viajes';
import { UsuarioSucursales } from './usuario-sucursales/usuario-sucursales';
import { Transportistas } from './transportistas/transportistas';
import { ReporteTransportistas } from './reporte-transportistas/reporte-transportistas';
import { authGuard } from '../guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'sucursales',
        title: 'Sucursales',
        children: [
          { path: '', component: Sucursales },
          {
            path: ':sucursalId/usuarios',
            component: UsuarioSucursales,
            title: 'Colaboradores de Sucursal',
          },
        ],
      },
      {
        path: 'transportistas',
        component: Transportistas,
        title: 'Gestión de Transportistas',
      },
      {
        path: 'reportes',
        component: ReporteTransportistas,
        title: 'Reporte de Viajes',
      },
      {
        path: 'viajes',
        title: 'Gestión de Viajes',
        children: [
          { path: '', component: Viajes },
          { path: ':viajeId/usuarios', component: UsuarioViajes, title: 'Pasajeros del Viaje' },
        ],
      },
      {
        path: '',
        redirectTo: 'viajes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
