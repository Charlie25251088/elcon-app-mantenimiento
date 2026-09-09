import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonText,
  IonSpinner
} from '@ionic/angular';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonText,
    IonSpinner
  ]
})
export class LoginPage {

  email = '';
  password = '';

  cargando = false;
  error = '';

  mostrarPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  iniciarSesion(): void {

    this.error = '';

    if (!this.email || !this.password) {
      this.error =
        'Ingrese el correo y la contraseña.';
      return;
    }

    this.cargando = true;

    this.authService
      .login(this.email, this.password)
      .subscribe({

        next: (respuesta) => {

          console.log(
            'Login exitoso:',
            respuesta
          );

          this.authService
            .guardarSesion(respuesta);

          this.cargando = false;

          const rol = respuesta.roles[0];

          if (rol === 'Administrador') {

            this.router.navigate(['/admin']);

          } else if (rol === 'Tecnico') {

            this.router.navigate(['/tecnico']);

          } else if (rol === 'Cliente') {

            this.router.navigate(['/cliente']);

          } else {

            this.router.navigate(['/home']);

          }

        },

        error: (error) => {

          console.error(
            'Error de login:',
            error
          );

          this.cargando = false;

          if (error.status === 401) {

            this.error =
              'Correo o contraseña incorrectos.';

          } else {

            this.error =
              'No se pudo conectar con el servidor.';

          }

        }

      });
  }

  cambiarVisibilidadPassword(): void {
    this.mostrarPassword =
      !this.mostrarPassword;
  }
}