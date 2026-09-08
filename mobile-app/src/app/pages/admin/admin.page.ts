import { Component } from '@angular/core';
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

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
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
export class AdminPage {

  constructor(private router: Router) {}

  irEmpleados() {
    this.router.navigate(['/admin/empleados']);
  }

  irEquipos() {
    this.router.navigate(['/admin/equipos']);
  }

  irMantenimientos() {
    this.router.navigate(['/admin/mantenimientos']);
  }

  irClientes() {
    this.router.navigate(['/admin/clientes']);
  }

}