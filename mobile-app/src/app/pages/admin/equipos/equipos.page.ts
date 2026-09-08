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
  IonToggle
} from '@ionic/angular';

import {
  EquiposService,
  Equipo
} from '../../../services/equipos';

@Component({
  selector: 'app-equipos',
  templateUrl: './equipos.page.html',
  styleUrls: ['./equipos.page.scss'],
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
    IonToggle
  ]
})
export class EquiposPage {

  equipos: Equipo[] = [];

  cargando = false;
  mostrarFormulario = false;
  guardando = false;

  editando = false;
  equipoEditandoId?: number;

  mensajeError = '';

  nuevoEquipo: Equipo = {
    nombre: '',
    codigo: '',
    descripcion: '',
    activo: true,
    clienteId: undefined
  };

  constructor(
    private equiposService: EquiposService
  ) {}

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.equiposService.obtenerEquipos().subscribe({
      next: (data: Equipo[]) => {
        console.log('Equipos recibidos:', data);
        this.equipos = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener equipos:', error);
        this.equipos = [];
        this.cargando = false;
        this.mensajeError = 'No se pudieron cargar los equipos.';
      }
    });
  }

  abrirFormulario(): void {
    this.editando = false;
    this.equipoEditandoId = undefined;

    this.nuevoEquipo = {
      nombre: '',
      codigo: '',
      descripcion: '',
      activo: true,
      clienteId: undefined
    };

    this.mensajeError = '';
    this.mostrarFormulario = true;
  }

  editarEquipo(equipo: Equipo): void {
    this.editando = true;
    this.equipoEditandoId = equipo.id;

    this.nuevoEquipo = {
      id: equipo.id,
      nombre: equipo.nombre,
      codigo: equipo.codigo,
      descripcion: equipo.descripcion || '',
      activo: equipo.activo,
      clienteId: equipo.clienteId
    };

    this.mensajeError = '';
    this.mostrarFormulario = true;
  }

  cancelarFormulario(): void {
    this.mostrarFormulario = false;
    this.mensajeError = '';
  }

  guardarEquipo(): void {
    this.mensajeError = '';

    if (
      !this.nuevoEquipo.nombre ||
      !this.nuevoEquipo.codigo
    ) {
      this.mensajeError =
        'Complete el nombre y código del equipo.';
      return;
    }

    this.guardando = true;

    if (this.editando && this.equipoEditandoId) {

      this.equiposService
        .actualizarEquipo(
          this.equipoEditandoId,
          this.nuevoEquipo
        )
        .subscribe({
          next: () => {
            console.log('Equipo actualizado');

            this.guardando = false;
            this.mostrarFormulario = false;

            this.cargarEquipos();
          },

          error: (error) => {
            console.error(
              'Error al actualizar equipo:',
              error
            );

            this.guardando = false;

            if (error.error?.mensaje) {
              this.mensajeError =
                error.error.mensaje;
            } else {
              this.mensajeError =
                'No se pudo actualizar el equipo.';
            }
          }
        });

    } else {

      this.equiposService
        .crearEquipo(this.nuevoEquipo)
        .subscribe({
          next: (equipo: Equipo) => {
            console.log('Equipo creado:', equipo);

            this.guardando = false;
            this.mostrarFormulario = false;

            this.cargarEquipos();
          },

          error: (error) => {
            console.error(
              'Error al crear equipo:',
              error
            );

            this.guardando = false;

            if (error.error?.mensaje) {
              this.mensajeError =
                error.error.mensaje;
            } else {
              this.mensajeError =
                'No se pudo crear el equipo.';
            }
          }
        });
    }
  }

  eliminarEquipo(id: number): void {

    if (!confirm(
      '¿Está seguro de eliminar este equipo?'
    )) {
      return;
    }

    this.equiposService
      .eliminarEquipo(id)
      .subscribe({
        next: () => {
          console.log('Equipo eliminado');
          this.cargarEquipos();
        },

        error: (error) => {
          console.error(
            'Error al eliminar equipo:',
            error
          );

          this.mensajeError =
            'No se pudo eliminar el equipo.';
        }
      });
  }
}