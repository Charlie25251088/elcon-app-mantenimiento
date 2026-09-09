import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Empleado {
  id?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono: string;
  email: string;
  applicationUserId?: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private apiUrl = 'https://localhost:7088/api/Empleados';

  constructor(private http: HttpClient) {}

  obtenerEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
  }

  obtenerEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.apiUrl}/${id}`);
  }

  crearEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado);
  }

  actualizarEmpleado(id: number, empleado: Empleado): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, empleado);
  }

  eliminarEmpleado(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obtenerTecnicos(): Observable<Empleado[]> {
  return this.http.get<Empleado[]>(
    `${this.apiUrl}/tecnicos`
  );
  }

  /*obtenerClientes(): Observable<Empleado[]> {
  return this.http.get<Empleado[]>(
    'https://localhost:7088/api/Auth/clientes'
  );
  }*/

  obtenerClientes(): Observable<Empleado[]> {
  return this.http.get<Empleado[]>(
    'https://localhost:7088/api/Clientes'
  );
}

  crearCliente(cliente: Empleado & { password: string }): Observable<any> {
  return this.http.post(
    'https://localhost:7088/api/Clientes',
    cliente
  );
}

actualizarCliente(
  id: number,
  cliente: Empleado
): Observable<void> {
  return this.http.put<void>(
    `https://localhost:7088/api/Clientes/${id}`,
    cliente
  );
}

eliminarCliente(id: number): Observable<void> {
  return this.http.delete<void>(
    `https://localhost:7088/api/Clientes/${id}`
  );
}
}