import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestor-dashboard',
  imports: [],
  templateUrl: './gestor-dashboard.component.html',
  styleUrl: './gestor-dashboard.component.css'
})
export class GestorDashboardComponent {
  constructor(private router: Router) {}

  verMotoristas() {
    this.router.navigate(['/gestor/motoristas']);
  }

  verTaxis() {
    this.router.navigate(['/gestor/taxis']);
  }

  verRelatorios() {
    this.router.navigate(['/gestor/relatorios']);
  }
}
