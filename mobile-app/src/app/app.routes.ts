/*import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: 'empleados',
    loadComponent: () => import('./pages/admin/empleados/empleados.page').then( m => m.EmpleadosPage)
  },
  {
    path: 'equipos',
    loadComponent: () => import('./pages/admin/equipos/equipos.page').then( m => m.EquiposPage)
  },
  {
    path: 'mantenimientos',
    loadComponent: () => import('./pages/admin/mantenimientos/mantenimientos.page').then( m => m.MantenimientosPage)
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/admin/clientes/clientes.page').then( m => m.ClientesPage)
  },

  {
  path: 'admin/empleados',
  loadComponent: () =>
    import('./pages/admin/empleados/empleados.page').then(
      (m) => m.EmpleadosPage
    ),
},
{
  path: 'admin/equipos',
  loadComponent: () =>
    import('./pages/admin/equipos/equipos.page').then(
      (m) => m.EquiposPage
    ),
},
{
  path: 'admin/mantenimientos',
  loadComponent: () =>
    import('./pages/admin/mantenimientos/mantenimientos.page').then(
      (m) => m.MantenimientosPage
    ),
},
{
  path: 'admin/clientes',
  loadComponent: () =>
    import('./pages/admin/clientes/clientes.page').then(
      (m) => m.ClientesPage
    ),
},

{
  path: 'tecnico',
  loadComponent: () =>
    import('./pages/tecnico/tecnico.page')
      .then((m) => m.TecnicoPage),
},
  {
    path: 'cliente',
    loadComponent: () => import('./pages/cliente/cliente.page').then( m => m.ClientePage)
  },
  {
    path: 'cliente',
    loadComponent: () => import('./pages/cliente/cliente.page').then( m => m.ClientePage)
  },

  {
  path: 'cliente',
  loadComponent: () =>
    import('./pages/cliente/cliente.page').then(
      (m) => m.ClientePage
    ),
},
];*/


import { Routes } from '@angular/router';

import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

  // ==========================================
  // PÁGINA PÚBLICA
  // ==========================================

  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(
        (m) => m.HomePage
      ),
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(
        (m) => m.LoginPage
      ),
  },

  // ==========================================
  // ADMINISTRADOR
  // ==========================================

  {
    path: 'admin',
    canActivate: [authGuard],
    data: {
      roles: ['Administrador']
    },
    loadComponent: () =>
      import('./pages/admin/admin.page').then(
        (m) => m.AdminPage
      ),
  },

  {
    path: 'admin/empleados',
    canActivate: [authGuard],
    data: {
      roles: ['Administrador']
    },
    loadComponent: () =>
      import('./pages/admin/empleados/empleados.page').then(
        (m) => m.EmpleadosPage
      ),
  },

  {
    path: 'admin/equipos',
    canActivate: [authGuard],
    data: {
      roles: ['Administrador']
    },
    loadComponent: () =>
      import('./pages/admin/equipos/equipos.page').then(
        (m) => m.EquiposPage
      ),
  },

  {
    path: 'admin/mantenimientos',
    canActivate: [authGuard],
    data: {
      roles: ['Administrador']
    },
    loadComponent: () =>
      import('./pages/admin/mantenimientos/mantenimientos.page').then(
        (m) => m.MantenimientosPage
      ),
  },

  {
    path: 'admin/clientes',
    canActivate: [authGuard],
    data: {
      roles: ['Administrador']
    },
    loadComponent: () =>
      import('./pages/admin/clientes/clientes.page').then(
        (m) => m.ClientesPage
      ),
  },

  // ==========================================
  // TÉCNICO
  // ==========================================

  {
    path: 'tecnico',
    canActivate: [authGuard],
    data: {
      roles: ['Tecnico']
    },
    loadComponent: () =>
      import('./pages/tecnico/tecnico.page').then(
        (m) => m.TecnicoPage
      ),
  },

  // ==========================================
  // CLIENTE
  // ==========================================

  {
    path: 'cliente',
    canActivate: [authGuard],
    data: {
      roles: ['Cliente']
    },
    loadComponent: () =>
      import('./pages/cliente/cliente.page').then(
        (m) => m.ClientePage
      ),
  },

];