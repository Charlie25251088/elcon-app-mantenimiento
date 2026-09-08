import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';

import {
  MantenimientosService,
  Mantenimiento
} from '../../../services/mantenimientos';

import {
  EquiposService,
  Equipo
} from '../../../services/equipos';

import {
  EmpleadosService,
  Empleado
} from '../../../services/empleados';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.page.html',
  styleUrls: ['./mantenimientos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption
  ]
})
export class MantenimientosPage {

  mantenimientos: Mantenimiento[] = [];
  equipos: Equipo[] = [];
  tecnicos: Empleado[] = [];

  cargando = false;
  cargandoEquipos = false;

  mostrarFormulario = false;
  guardando = false;

  editando = false;
  mantenimientoEditandoId?: number;

  mensajeError = '';

  nuevoMantenimiento: Mantenimiento = {
    equipoId: 0,
    fecha: '',
    tipo: 'Preventivo',
    descripcion: '',
    estado: 'Programado',
    observaciones: '',
    tecnicoId: undefined
  };

  constructor(
    private mantenimientosService: MantenimientosService,
    private equiposService: EquiposService,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.cargarMantenimientos();
    this.cargarEquipos();

    this.cargarTecnicos();
  }

  cargarMantenimientos(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.mantenimientosService
      .obtenerMantenimientos()
      .subscribe({

        next: (data: Mantenimiento[]) => {

          console.log(
            'Mantenimientos recibidos:',
            data
          );

          this.mantenimientos = data;
          this.cargando = false;
        },

        error: (error) => {

          console.error(
            'Error al obtener mantenimientos:',
            error
          );

          this.mantenimientos = [];
          this.cargando = false;

          this.mensajeError =
            'No se pudieron cargar los mantenimientos.';
        }
      });
  }

  cargarEquipos(): void {

    this.cargandoEquipos = true;

    this.equiposService
      .obtenerEquipos()
      .subscribe({

        next: (data: Equipo[]) => {

          console.log(
            'Equipos recibidos:',
            data
          );

          this.equipos = data;
          this.cargandoEquipos = false;
        },

        error: (error) => {

          console.error(
            'Error al obtener equipos:',
            error
          );

          this.equipos = [];
          this.cargandoEquipos = false;
        }
      });
  }

  cargarTecnicos(): void {

  this.empleadosService
    .obtenerTecnicos()
    .subscribe({

      next: (data: Empleado[]) => {

        console.log(
          'Técnicos recibidos:',
          data
        );

        this.tecnicos = data;
      },

      error: (error) => {

        console.error(
          'Error al obtener técnicos:',
          error
        );

        this.tecnicos = [];
      }
    });
}

  abrirFormulario(): void {

    this.editando = false;
    this.mantenimientoEditandoId = undefined;

    this.nuevoMantenimiento = {
      equipoId: 0,
      fecha: '',
      tipo: 'Preventivo',
      descripcion: '',
      estado: 'Programado',
      observaciones: '',
      tecnicoId: undefined
    };

    this.mensajeError = '';
    this.mostrarFormulario = true;
  }

  editarMantenimiento(
    mantenimiento: Mantenimiento
  ): void {

    this.editando = true;

    this.mantenimientoEditandoId =
      mantenimiento.id;

    this.nuevoMantenimiento = {
      id: mantenimiento.id,
      equipoId: mantenimiento.equipoId,
      fecha: mantenimiento.fecha,
      tipo: mantenimiento.tipo,
      descripcion: mantenimiento.descripcion,
      estado: mantenimiento.estado,
      observaciones:
        mantenimiento.observaciones || '',
      tecnicoId: mantenimiento.tecnicoId
    };

    this.mensajeError = '';
    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {

    this.mostrarFormulario = false;
    this.mensajeError = '';
  }

  guardarMantenimiento(): void {

    this.mensajeError = '';

    if (
      !this.nuevoMantenimiento.equipoId ||
      !this.nuevoMantenimiento.fecha ||
      !this.nuevoMantenimiento.descripcion
    ) {

      this.mensajeError =
        'Complete el equipo, fecha y descripción.';

      return;
    }

    this.guardando = true;

    if (
      this.editando &&
      this.mantenimientoEditandoId
    ) {

      this.mantenimientosService
        .actualizarMantenimiento(
          this.mantenimientoEditandoId,
          this.nuevoMantenimiento
        )
        .subscribe({

          next: () => {

            console.log(
              'Mantenimiento actualizado'
            );

            this.guardando = false;
            this.mostrarFormulario = false;

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

    } else {

      this.mantenimientosService
        .crearMantenimiento(
          this.nuevoMantenimiento
        )
        .subscribe({

          next: (
            mantenimiento: Mantenimiento
          ) => {

            console.log(
              'Mantenimiento creado:',
              mantenimiento
            );

            this.guardando = false;
            this.mostrarFormulario = false;

            this.cargarMantenimientos();
          },

          error: (error) => {

            console.error(
              'Error al crear mantenimiento:',
              error
            );

            this.guardando = false;

            if (error.error?.mensaje) {

              this.mensajeError =
                error.error.mensaje;

            } else {

              this.mensajeError =
                'No se pudo crear el mantenimiento.';
            }
          }
        });
    }
  }

  eliminarMantenimiento(id: number): void {

    if (
      !confirm(
        '¿Está seguro de eliminar este mantenimiento?'
      )
    ) {
      return;
    }

    this.mantenimientosService
      .eliminarMantenimiento(id)
      .subscribe({

        next: () => {

          console.log(
            'Mantenimiento eliminado'
          );

          this.cargarMantenimientos();
        },

        error: (error) => {

          console.error(
            'Error al eliminar mantenimiento:',
            error
          );

          this.mensajeError =
            'No se pudo eliminar el mantenimiento.';
        }
      });
  }
}