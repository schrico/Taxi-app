import { Component, OnInit } from '@angular/core';
import { TaxiService } from '../taxi.service';
import { FormsModule } from '@angular/forms';
import { Taxi } from '../taxi';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestor-taxis',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor-taxis.component.html',
  styleUrl: './gestor-taxis.component.css'
})
export class GestorTaxisComponent implements OnInit {
  taxis: Taxi[] = [];
  standalone = false;
  showEditForm = false;
  taxiSelecionado: Taxi = {} as Taxi;
  popupMessage: string = '';

  marcas = ['Toyota', 'Mercedes', 'BMW', 'Audi', 'Volkswagen'];
  modelos: { [key: string]: string[] } = {
    'Toyota': ['Corolla', 'Camry', 'Prius'],
    'Mercedes': ['E-Class', 'S-Class', 'C-Class'],
    'BMW': ['3 Series', '5 Series', '7 Series'],
    'Audi': ['A4', 'A6', 'A8'],
    'Volkswagen': ['Passat', 'Arteon', 'Phaeton']
  };
  modelosDisponiveis: string[] = [];
  anoAtual: number = new Date().getFullYear();

  constructor(private taxiService: TaxiService) {}

  ngOnInit() {
    this.carregarTaxis();
  }

  carregarTaxis() {
    this.taxiService.getTaxis()
      .subscribe(taxis => {
        this.taxis = taxis; // Já vem ordenado do backend
      });
  }

  onMarcaChange() {
    this.modelosDisponiveis = this.modelos[this.taxiSelecionado.marca] || [];
    this.taxiSelecionado.modelo = '';
  }

  editarTaxi(taxi: Taxi) {
    this.taxiSelecionado = { ...taxi };
    this.showEditForm = true;
    this.onMarcaChange();
  }

  salvarEdicao() {
    if (this.taxiSelecionado && this.taxiSelecionado._id) {
      this.taxiService.updateTaxi(this.taxiSelecionado)
        .subscribe({
          next: () => {
            this.carregarTaxis();
            this.cancelarEdicao();
          },
          error: (error) => {
            this.showPopup(error.error?.message || 'Erro ao atualizar táxi');
          }
        });
    }
  }

  removerTaxi(id: string) {
    if (confirm('Tem certeza que deseja remover este táxi?')) {
      this.taxiService.deleteTaxi(id)
        .subscribe({
          next: () => this.carregarTaxis(),
          error: (error) => 
            this.showPopup(error.error?.message || 'Erro ao remover táxi')
        });
    }
  }

  showPopup(message: string) {
    this.popupMessage = message;
    setTimeout(() => {
      this.popupMessage = '';
    }, 3000);
  }

  cancelarEdicao() {
    this.showEditForm = false;
    this.taxiSelecionado = {} as Taxi;
  }
}