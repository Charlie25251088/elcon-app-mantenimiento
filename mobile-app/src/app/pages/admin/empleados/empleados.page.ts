//import { Component, OnInit } from '@angular/core';
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
  IonToggle
} from '@ionic/angular';

import {
  EmpleadosService,
  Empleado
} from '../../../services/empleados';

@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: ['./empleados.page.scss'],
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
    IonToggle
  ]
})
//export class EmpleadosPage implements OnInit {
export class EmpleadosPage {

  empleados: Empleado[] = [];

  cargando = false;
  mostrarFormulario = false;
  guardando = false;

  editando = false;
  empleadoEditandoId?: number;

  mensajeError = '';

  nuevoEmpleado: Empleado = {
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    applicationUserId: '',
    activo: true
  };

  


  constructor(
    private empleadosService: EmpleadosService
  ) {}

  /*ngOnInit(): void {
    this.cargarEmpleados();
  }*/

  ionViewWillEnter(): void {
  this.cargarEmpleados();
  }

  cargarEmpleados(): void {

    this.cargando = true;
    this.mensajeError = '';

    this.empleadosService.obtenerEmpleados().subscribe({

      next: (data: Empleado[]) => {

        console.log('Empleados recibidos:', data);

        this.empleados = data;
        this.cargando = false;

      },

      error: (error) => {

        console.error('Error al obtener empleados:', error);

        this.empleados = [];
        this.cargando = false;

        this.mensajeError =
          'No se pudieron cargar los empleados.';

      }

    });
  }

  abrirFormulario(): void {

    this.editando = false;
    this.empleadoEditandoId = undefined;

    this.mensajeError = '';

    this.nuevoEmpleado = {
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      applicationUserId: '',
      activo: true
    };

    this.mostrarFormulario = true;
  }

  editarEmpleado(empleado: Empleado): void {

  this.editando = true;
  this.empleadoEditandoId = empleado.id;

  this.nuevoEmpleado = {
    id: empleado.id,
    nombre: empleado.nombre,
    apellido: empleado.apellido,
    cedula: empleado.cedula,
    telefono: empleado.telefono,
    email: empleado.email,
    applicationUserId: empleado.applicationUserId || '',
    activo: empleado.activo
  };

  this.mensajeError = '';
  this.mostrarFormulario = true;
}

  cancelarFormulario(): void {

    this.mostrarFormulario = false;
    this.mensajeError = '';

  }

  

      guardarEmpleado(): void {

  this.mensajeError = '';

  if (
    !this.nuevoEmpleado.nombre ||
    !this.nuevoEmpleado.apellido ||
    !this.nuevoEmpleado.cedula ||
    !this.nuevoEmpleado.telefono ||
    !this.nuevoEmpleado.email
  ) {

    this.mensajeError =
      'Complete todos los campos obligatorios.';

    return;
  }

  this.guardando = true;

  if (this.editando && this.empleadoEditandoId) {

    this.empleadosService
      .actualizarEmpleado(
        this.empleadoEditandoId,
        this.nuevoEmpleado
      )
      .subscribe({

        next: () => {

          console.log('Empleado actualizado');

          this.guardando = false;
          this.mostrarFormulario = false;

          this.cargarEmpleados();

        },

        error: (error) => {

          console.error(
            'Error al actualizar empleado:',
            error
          );

          this.guardando = false;

          if (error.error?.mensaje) {

            this.mensajeError =
              error.error.mensaje;

          } else {

            this.mensajeError =
              'No se pudo actualizar el empleado.';
          }

        }

      });

  } else {

    this.empleadosService
      .crearEmpleado(this.nuevoEmpleado)
      .subscribe({

        next: (empleado: Empleado) => {

          console.log(
            'Empleado creado:',
            empleado
          );

          this.guardando = false;
          this.mostrarFormulario = false;

          this.cargarEmpleados();

        },

        error: (error) => {

          console.error(
            'Error al crear empleado:',
            error
          );

          this.guardando = false;

          if (error.error?.mensaje) {

            this.mensajeError =
              error.error.mensaje;

          } else {

            this.mensajeError =
              'No se pudo crear el empleado.';
          }

        }

      });
  }
}

  eliminarEmpleado(id: number): void {

    if (!confirm('¿Está seguro de eliminar este empleado?')) {
      return;
    }

    this.empleadosService
      .eliminarEmpleado(id)
      .subscribe({

        next: () => {

          this.cargarEmpleados();

        },

        error: (error) => {

          console.error(
            'Error al eliminar empleado:',
            error
          );

        }

      });
  }

}