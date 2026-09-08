import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mantenimiento {
  id?: number;
  equipoId: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  estado: string;
  observaciones: string;
  tecnicoId?: number;
  equipo?: any;
  tecnico?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MantenimientosService {

  private apiUrl = 'https://localhost:7088/api/Mantenimientos';

  constructor(private http: HttpClient) {}

  obtenerMantenimientos(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(this.apiUrl);
  }

  obtenerMantenimiento(id: number): Observable<Mantenimiento> {
    return this.http.get<Mantenimiento>(
      `${this.apiUrl}/${id}`
    );
  }

  crearMantenimiento(
    mantenimiento: Mantenimiento
  ): Observable<Mantenimiento> {
    return this.http.post<Mantenimiento>(
      this.apiUrl,
      mantenimiento
    );
  }

  actualizarMantenimiento(
    id: number,
    mantenimiento: Mantenimiento
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      mantenimiento
    );
  }

  eliminarMantenimiento(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  obtenerMisMantenimientos(): Observable<Mantenimiento[]> {
    return this.http.get<Mantenimiento[]>(
      `${this.apiUrl}/mis-mantenimientos`
    );
  }

  obtenerMisMantenimientosTecnico(): Observable<Mantenimiento[]> {
  return this.http.get<Mantenimiento[]>(
    `${this.apiUrl}/mis-mantenimientos-tecnico`
  );
}
}