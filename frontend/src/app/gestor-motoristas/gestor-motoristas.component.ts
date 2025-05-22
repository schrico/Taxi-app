import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MotoristaService } from '../motorista.service';
import { Motorista } from '../motorista';

@Component({
  selector: 'app-gestor-motoristas',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor-motoristas.component.html',
  styleUrl: './gestor-motoristas.component.css'
})
export class GestorMotoristasComponent implements OnInit {
  motoristas: Motorista[] = [];
  showEditForm = false;
  motoristaSelecionado: Motorista = {} as Motorista;
  popupMessage: string = '';

  constructor(private motoristaService: MotoristaService) {}

  ngOnInit() {
    this.carregarMotoristas();
  }

  carregarMotoristas(): void {
    this.motoristaService.getMotoristas()
      .subscribe(motoristas => {
        this.motoristas = motoristas;
      });
  }

  editarMotorista(motorista: Motorista) {
    this.motoristaSelecionado = { ...motorista };
    this.showEditForm = true;
  }

  salvarEdicao() {
    if (this.motoristaSelecionado && this.motoristaSelecionado._id) {
      this.motoristaService.updateMotorista(this.motoristaSelecionado)
        .subscribe({
          next: () => {
            this.carregarMotoristas();
            this.cancelarEdicao();
          },
          error: (error) => {
            if (error?.error?.message) {
              this.showPopup('Não é possível editar este motorista: ' + error.error.message);
            } else {
              this.showPopup('Erro ao editar motorista.');
            }
            console.error('Erro ao atualizar motorista:', error);
          }
        });
    }
  }

  removerMotorista(id: string) {
    if (confirm('Tem certeza que deseja remover este motorista?')) {
      this.motoristaService.deleteMotorista(id)
        .subscribe({
          next: () => {
            this.carregarMotoristas();
          },
          error: (error) => {
            if (error?.error?.message) {
              this.showPopup('Não é possível remover este motorista porque ele já tem turnos associados.');
            } else {
              this.showPopup('Erro ao remover motorista.');
            }
            console.error('Erro ao remover motorista:', error);
          }
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
    this.motoristaSelecionado = {} as Motorista;
  }
}