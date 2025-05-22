import { Component, OnInit } from '@angular/core';
import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  nif = '';
  nifValido = false;
  motoristaSelecionado: Motorista | null = null;
  motoristas: Motorista[] = [];
  motoristasFiltrados: Motorista[] = [];

  constructor(private motoristaService: MotoristaService, private router: Router) {
    this.motoristaService.getMotoristas().subscribe(motoristas => {
      this.motoristas = motoristas;
      this.motoristasFiltrados = motoristas;
    });
  }

  irParaPedidoTaxi() {
    this.router.navigate(['/taxi-pedido']);
  }

  validarNif() {
    this.nifValido = this.validarNifRia10(this.nif);
    this.motoristasFiltrados = this.motoristas.filter(m => m.nif.toString().includes(this.nif));
  }

  validarNifRia10(nif: string): boolean {
    if (!/^[0-9]{9}$/.test(nif)) return false;
    let total = 0;
    for (let i = 0; i < 8; i++) total += parseInt(nif[i]) * (9 - i);
    let resto = total % 11;
    let digito = resto < 2 ? 0 : 11 - resto;
    return digito === parseInt(nif[8]);
  }

  entrarPorNif() {
    this.motoristaSelecionado = this.motoristas.find(m => m.nif.toString() === this.nif) || null;
    if (this.motoristaSelecionado) {
      this.router.navigate(['/dashboard/motorista-dashboard'], { queryParams: { nif: this.motoristaSelecionado.nif } });
    }

  }

  entrarPorSelecao(motorista: Motorista) {
    this.router.navigate(['/dashboard/motorista-dashboard'], { queryParams: { nif: motorista.nif } });
  }

  irParaGestor() {
    this.router.navigate(['/gestor-dashboard']);
  }
}