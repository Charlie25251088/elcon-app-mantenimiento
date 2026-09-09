import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular';

import {
  EmpleadosService
} from '../../services/empleados';

import {
  EquiposService
} from '../../services/equipos';

import {
  MantenimientosService,
  Mantenimiento
} from '../../services/mantenimientos';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class AdminPage implements OnInit {

  totalEmpleados = 0;
  totalClientes = 0;
  totalEquipos = 0;
  totalMantenimientos = 0;

  mantenimientosProgramados = 0;
  mantenimientosEnProceso = 0;
  mantenimientosCompletados = 0;

  cargando = true;
  mensajeError = '';

  constructor(
    private router: Router,
    private empleadosService: EmpleadosService,
    private equiposService: EquiposService,
    private mantenimientosService: MantenimientosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.empleadosService.obtenerEmpleados().subscribe({
      next: (empleados) => {
        this.totalEmpleados = empleados.length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
      }
    });

    this.empleadosService.obtenerClientes().subscribe({
      next: (clientes) => {
        this.totalClientes = clientes.length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
      }
    });

    this.equiposService.obtenerEquipos().subscribe({
      next: (equipos) => {
        this.totalEquipos = equipos.length;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al cargar equipos:', error);
      }
    });

    this.mantenimientosService.obtenerMantenimientos().subscribe({
      next: (mantenimientos: Mantenimiento[]) => {

        this.totalMantenimientos =
          mantenimientos.length;

        this.mantenimientosProgramados =
          mantenimientos.filter(
            m => m.estado?.toLowerCase() === 'programado'
          ).length;

        this.mantenimientosEnProceso =
          mantenimientos.filter(
            m => m.estado?.toLowerCase() === 'en proceso'
          ).length;

        this.mantenimientosCompletados =
          mantenimientos.filter(
            m => m.estado?.toLowerCase() === 'completado'
          ).length;

        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(
          'Error al cargar mantenimientos:',
          error
        );

        this.cargando = false;
        this.mensajeError =
          'No se pudieron cargar los datos del dashboard.';

        this.cdr.detectChanges();
      }
    });
  }

  irEmpleados(): void {
    this.router.navigate(['/admin/empleados']);
  }

  irEquipos(): void {
    this.router.navigate(['/admin/equipos']);
  }

  irMantenimientos(): void {
    this.router.navigate(['/admin/mantenimientos']);
  }

  irClientes(): void {
    this.router.navigate(['/admin/clientes']);
  }

  cerrarSesion(): void {

    const elementoActivo =
      document.activeElement;

    if (
      elementoActivo instanceof HTMLElement
    ) {
      elementoActivo.blur();
    }

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');

    this.router.navigate(['/login']);
  }
}