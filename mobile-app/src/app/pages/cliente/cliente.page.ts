import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/angular';

import {
  MantenimientosService,
  Mantenimiento
} from '../../services/mantenimientos';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.page.html',
  styleUrls: ['./cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonCard,
    IonCardContent
  ]
})
export class ClientePage {

  mantenimientos: Mantenimiento[] = [];

  cargando = false;
  mensajeError = '';

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
      .obtenerMisMantenimientos()
      .subscribe({

        next: (data: Mantenimiento[]) => {

          console.log(
            'Mantenimientos del cliente:',
            data
          );

          this.mantenimientos = data;
          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al obtener mantenimientos del cliente:',
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

          this.cdr.detectChanges();
        }
      });
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