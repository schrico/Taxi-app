import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PedidoService } from '../pedido.service';


@Component({
  selector: 'app-taxi-acompanhamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido-acompanhamento.component.html',
  styleUrls: ['./pedido-acompanhamento.component.css']
})
export class TaxiAcompanhamentoComponent implements OnInit, OnDestroy {
  pedidoId: string = '';
  mensagem: string = '';
  erro: string = '';
  pedido: any = null;
  private intervaloVerificacao: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private pedidoService: PedidoService
  ) {
    // Get pedidoId from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.pedidoId = navigation.extras.state['pedidoId'];
    }
  }

  ngOnInit() {
    if (!this.pedidoId) {
      this.router.navigate(['/pedido']);
      return;
    }
    this.verificarEstadoPedido();

    this.intervaloVerificacao = setInterval(() => {
      this.verificarEstadoPedido();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.intervaloVerificacao) {
      clearInterval(this.intervaloVerificacao);
    }
  }

  verificarEstadoPedido() {
    console.log('Verificando pedido:', this.pedidoId); // Debug
    this.pedidoService.getPedido(this.pedidoId).subscribe({
      next: (pedido) => {
        console.log('Pedido recebido:', pedido); // Debug
        this.pedido = pedido;
        if (pedido.estado === 'Aceite-Motorista') {
          this.mensagem = 'Motorista aceitou o pedido! Deseja confirmar a sua viagem?';
        }else if (pedido.estado === 'Aceite-Cliente') {
          this.mensagem = 'Motorista confirmado! Aguarde a chegada.';

          if(this.intervaloVerificacao){
            clearInterval(this.intervaloVerificacao);
          }
        }
      },
      error: (err) => {
        console.error('Erro ao obter pedido:', err); // Debug
        this.erro = err.error?.message || 'Erro ao verificar estado do pedido.';
      }
    });
  }

  aceitarMotorista(){
    this.pedidoService.confirmarMotorista(this.pedidoId).subscribe({
      next: () => {
        this.mensagem = 'Motorista confirmado! Aguarde a chegada.';
        this.verificarEstadoPedido();
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.erro = 'Erro ao confirmar motorista.';
      }
    });
  }

  rejeitarMotorista() {
    this.pedidoService.rejeitarMotorista(this.pedidoId).subscribe({
      next: () => {
        this.mensagem = 'Motorista rejeitado. Aguardando novo motorista...';
        this.verificarEstadoPedido();
      },
      error: (err) => {
        this.erro = 'Erro ao rejeitar motorista.';
      }
    });
  }

  cancelarPedido() {
    this.http.delete(`http://localhost:3000/api/pedidos/${this.pedidoId}`).subscribe({
      next: () => {
        this.mensagem = 'Pedido cancelado com sucesso!';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.erro = err.error?.message || 'Erro ao cancelar pedido.';
      }
    });
  }
}