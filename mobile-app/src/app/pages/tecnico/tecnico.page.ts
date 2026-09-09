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
  mantenimientosFiltrados: Mantenimiento[] = [];

  cargando = false;
  guardando = false;

  mantenimientoSeleccionado?: Mantenimiento;

  mensajeError = '';

  filtroEstado = 'Todos';

  totalMantenimientos = 0;
  mantenimientosProgramados = 0;
  mantenimientosEnProceso = 0;
  mantenimientosCompletados = 0;

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

        next: (data: Mantenimiento[]) => {

          console.log(
            'Mantenimientos del técnico:',
            data
          );

          this.mantenimientos = data;

          this.calcularResumen();
          this.aplicarFiltro();

          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error al obtener mantenimientos:',
            error
          );

          this.mantenimientos = [];
          this.mantenimientosFiltrados = [];

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

  calcularResumen(): void {

    this.totalMantenimientos =
      this.mantenimientos.length;

    this.mantenimientosProgramados =
      this.mantenimientos.filter(
        m =>
          this.normalizarEstado(m.estado)
          === 'programado'
      ).length;

    this.mantenimientosEnProceso =
      this.mantenimientos.filter(
        m =>
          this.normalizarEstado(m.estado)
          === 'en proceso'
      ).length;

    this.mantenimientosCompletados =
      this.mantenimientos.filter(
        m =>
          this.normalizarEstado(m.estado)
          === 'completado'
      ).length;
  }

  aplicarFiltro(): void {

    if (this.filtroEstado === 'Todos') {

      this.mantenimientosFiltrados =
        [...this.mantenimientos];

      return;
    }

    this.mantenimientosFiltrados =
      this.mantenimientos.filter(
        m =>
          this.normalizarEstado(m.estado)
          === this.normalizarEstado(
            this.filtroEstado
          )
      );
  }

  cambiarFiltro(): void {
    this.aplicarFiltro();
  }

  normalizarEstado(estado: string | undefined): string {

    return (estado || '')
      .trim()
      .toLowerCase();
  }

  seleccionarMantenimiento(
    mantenimiento: Mantenimiento
  ): void {

    this.mantenimientoSeleccionado = {
      ...mantenimiento
    };

    setTimeout(() => {

      const formulario =
        document.querySelector('.form-card');

      if (formulario) {

        formulario.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

      }

    }, 100);
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