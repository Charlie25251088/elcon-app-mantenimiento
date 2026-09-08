import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router
} from '@angular/router';

export const authGuard: CanActivateFn = (route) => {

  const router = inject(Router);

  const token = localStorage.getItem('token');
  const rolesGuardados = localStorage.getItem('roles');

  // No existe sesión
  if (!token || !rolesGuardados) {
    return router.createUrlTree(['/login']);
  }

  let roles: string[] = [];

  try {
    roles = JSON.parse(rolesGuardados);
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');

    return router.createUrlTree(['/login']);
  }

  // Roles permitidos para esta ruta
  const rolesPermitidos =
    route.data?.['roles'] as string[] | undefined;

  // Si la ruta no especifica roles,
  // basta con tener una sesión válida.
  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  // Verificar si el usuario tiene alguno
  // de los roles permitidos
  const tienePermiso = roles.some(
    rol => rolesPermitidos.includes(rol)
  );

  if (tienePermiso) {
    return true;
  }

  // Si no tiene permiso, enviarlo a su página correspondiente
  if (roles.includes('Administrador')) {
    return router.createUrlTree(['/admin']);
  }

  if (roles.includes('Tecnico')) {
    return router.createUrlTree(['/tecnico']);
  }

  if (roles.includes('Cliente')) {
    return router.createUrlTree(['/cliente']);
  }

  // Si no tiene un rol válido
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('roles');

  return router.createUrlTree(['/login']);
};