import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonToggle,
  IonButtons,
  IonBackButton,
} from '@ionic/angular';

import {
  EmpleadosService,
  Empleado
} from '../../../services/empleados';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonButton,
    IonItem,
    IonLabel,
    IonInput,
    IonToggle,
    CommonModule,
    FormsModule,
    RouterLink,
    IonButtons,
    IonBackButton
  ]
})
export class ClientesPage implements OnInit {

  clientes: Empleado[] = [];

  cargando = false;
  guardando = false;
  mensajeError = '';

  modoFormulario = false;
  modoEdicion = false;

  clienteSeleccionado?: Empleado;

  nuevoCliente = {
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    email: '',
    password: '',
    activo: true
  };

  constructor(
    private empleadosService: EmpleadosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.mensajeError = '';

    this.empleadosService
      .obtenerClientes()
      .subscribe({
        next: (data: Empleado[]) => {
          console.log('Clientes:', data);

          this.clientes = data;
          this.cargando = false;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(
            'Error al obtener clientes:',
            error
          );

          this.clientes = [];
          this.cargando = false;

          this.mensajeError =
            error.error?.mensaje ??
            'No se pudieron cargar los clientes.';

          this.cdr.detectChanges();
        }
      });
  }

  nuevo(): void {
    this.modoFormulario = true;
    this.modoEdicion = false;
    this.mensajeError = '';

    this.nuevoCliente = {
      nombre: '',
      apellido: '',
      cedula: '',
      telefono: '',
      email: '',
      password: '',
      activo: true
    };
  }

  editar(cliente: Empleado): void {
    this.modoFormulario = true;
    this.modoEdicion = true;
    this.mensajeError = '';

    this.clienteSeleccionado = cliente;

    this.nuevoCliente = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      cedula: cliente.cedula,
      telefono: cliente.telefono,
      email: cliente.email,
      password: '',
      activo: cliente.activo
    };

     setTimeout(() => {
    const formulario = document.querySelector('.form-card');

    if (formulario) {
      formulario.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 100);
  }

  cancelar(): void {
    this.modoFormulario = false;
    this.modoEdicion = false;
    this.clienteSeleccionado = undefined;
    this.mensajeError = '';
  }

  guardar(): void {

    if (
      !this.nuevoCliente.nombre.trim() ||
      !this.nuevoCliente.apellido.trim() ||
      !this.nuevoCliente.email.trim()
    ) {
      this.mensajeError =
        'Nombre, apellido y correo son obligatorios.';
      return;
    }

    if (
      !this.modoEdicion &&
      !this.nuevoCliente.password.trim()
    ) {
      this.mensajeError =
        'La contraseña es obligatoria para crear el cliente.';
      return;
    }

    this.guardando = true;
    this.mensajeError = '';

    if (this.modoEdicion) {

      if (!this.clienteSeleccionado?.id) {
        this.guardando = false;
        return;
      }

      const clienteActualizado: Empleado = {
        id: this.clienteSeleccionado.id,
        nombre: this.nuevoCliente.nombre,
        apellido: this.nuevoCliente.apellido,
        cedula: this.nuevoCliente.cedula,
        telefono: this.nuevoCliente.telefono,
        email: this.nuevoCliente.email,
        activo: this.nuevoCliente.activo,
        applicationUserId:
          this.clienteSeleccionado.applicationUserId
      };

      this.empleadosService
        .actualizarCliente(
          this.clienteSeleccionado.id,
          clienteActualizado
        )
        .subscribe({
          next: () => {
            this.guardando = false;
            this.cancelar();
            this.cargarClientes();
          },

          error: (error) => {
            console.error(
              'Error al actualizar cliente:',
              error
            );

            this.guardando = false;

            this.mensajeError =
              error.error?.mensaje ??
              'No se pudo actualizar el cliente.';

            this.cdr.detectChanges();
          }
        });

    } else {

      const clienteNuevo = {
        nombre: this.nuevoCliente.nombre,
        apellido: this.nuevoCliente.apellido,
        cedula: this.nuevoCliente.cedula,
        telefono: this.nuevoCliente.telefono,
        email: this.nuevoCliente.email,
        password: this.nuevoCliente.password,
        activo: this.nuevoCliente.activo
      };

      this.empleadosService
        .crearCliente(clienteNuevo)
        .subscribe({
          next: () => {
            this.guardando = false;
            this.cancelar();
            this.cargarClientes();
          },

          error: (error) => {
            console.error(
              'Error al crear cliente:',
              error
            );

            this.guardando = false;

            this.mensajeError =
              error.error?.mensaje ??
              'No se pudo crear el cliente.';

            this.cdr.detectChanges();
          }
        });
    }
  }

  eliminar(cliente: Empleado): void {

    if (!cliente.id) {
      return;
    }

    const confirmar = confirm(
      `¿Está seguro de eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`
    );

    if (!confirmar) {
      return;
    }

    this.empleadosService
      .eliminarCliente(cliente.id)
      .subscribe({
        next: () => {
          this.cargarClientes();
        },

        error: (error) => {
          console.error(
            'Error al eliminar cliente:',
            error
          );

          this.mensajeError =
            error.error?.mensaje ??
            'No se pudo eliminar el cliente.';

          this.cdr.detectChanges();
        }
      });
  }
}