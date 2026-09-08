//import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  Component,
  ChangeDetectorRef
} from '@angular/core';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTextarea
} from '@ionic/angular';

import {
  MantenimientosService,
  Mantenimiento
} from '../../services/mantenimientos';

@Component({
  selector: 'app-tecnico',
  templateUrl: './tecnico.page.html',
  styleUrls: ['./tecnico.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonTextarea
  ]
})
export class TecnicoPage {

  mantenimientos: Mantenimiento[] = [];

  cargando = false;
  guardando = false;

  mantenimientoSeleccionado?: Mantenimiento;

  mensajeError = '';

  /*constructor(
    private mantenimientosService: MantenimientosService,
    private router: Router
  ) {}*/

    constructor(
  private mantenimientosService: MantenimientosService,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.cargarMantenimientos();
  }

  cargarMantenimientos(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.mantenimientosService
      .obtenerMisMantenimientosTecnico()
      .subscribe({

        /*next: (data: Mantenimiento[]) => {

          console.log(
            'Mantenimientos del técnico:',
            data
          );

          this.mantenimientos = data;
          this.cargando = false;
        },*/

        next: (data: Mantenimiento[]) => {

  console.log(
    'Mantenimientos del técnico:',
    data
  );

  this.mantenimientos = data;
  this.cargando = false;

  this.cdr.detectChanges();
},

        error: (error) => {

          console.error(
            'Error al obtener mantenimientos:',
            error
          );

          this.mantenimientos = [];
          this.cargando = false;

          if (error.error?.mensaje) {
            this.mensajeError =
              error.error.mensaje;
          } else {
            this.mensajeError =
              'No se pudieron cargar los mantenimientos.';
          }
        }
      });
  }

  seleccionarMantenimiento(
    mantenimiento: Mantenimiento
  ): void {

    this.mantenimientoSeleccionado = {
      ...mantenimiento
    };
  }

  cancelarEdicion(): void {

    this.mantenimientoSeleccionado =
      undefined;

    this.mensajeError = '';
  }

  guardarCambios(): void {

    if (!this.mantenimientoSeleccionado?.id) {
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    const mantenimientoActualizado: Mantenimiento = {
      id: this.mantenimientoSeleccionado.id,
      equipoId:
        this.mantenimientoSeleccionado.equipoId,
      fecha:
        this.mantenimientoSeleccionado.fecha,
      tipo:
        this.mantenimientoSeleccionado.tipo,
      descripcion:
        this.mantenimientoSeleccionado.descripcion,
      estado:
        this.mantenimientoSeleccionado.estado,
      observaciones:
        this.mantenimientoSeleccionado.observaciones,
      tecnicoId:
        this.mantenimientoSeleccionado.tecnicoId
    };

    this.mantenimientosService
      .actualizarMantenimiento(
        this.mantenimientoSeleccionado.id,
        mantenimientoActualizado
      )
      .subscribe({

        next: () => {

          console.log(
            'Mantenimiento actualizado'
          );

          this.guardando = false;
          this.mantenimientoSeleccionado =
            undefined;

          this.cargarMantenimientos();
        },

        error: (error) => {

          console.error(
            'Error al actualizar mantenimiento:',
            error
          );

          this.guardando = false;

          if (error.error?.mensaje) {
            this.mensajeError =
              error.error.mensaje;
          } else {
            this.mensajeError =
              'No se pudo actualizar el mantenimiento.';
          }
        }
      });
  }

  cerrarSesion(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');

    this.router.navigate(['/login']);
  }

    /*cerrarSesion(): void {

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
}*/

}