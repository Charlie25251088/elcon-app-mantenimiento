import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipo {
  id?: number;
  nombre: string;
  codigo: string;
  descripcion?: string;
  activo: boolean;
  clienteId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  private apiUrl = 'https://localhost:7088/api/Equipos';

  constructor(private http: HttpClient) {}

  obtenerEquipos(): Observable<Equipo[]> {
    return this.http.get<Equipo[]>(this.apiUrl);
  }

  obtenerEquipo(id: number): Observable<Equipo> {
    return this.http.get<Equipo>(
      `${this.apiUrl}/${id}`
    );
  }

  crearEquipo(equipo: Equipo): Observable<Equipo> {
    return this.http.post<Equipo>(
      this.apiUrl,
      equipo
    );
  }

  actualizarEquipo(
    id: number,
    equipo: Equipo
  ): Observable<void> {

    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      equipo
    );
  }

  eliminarEquipo(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}