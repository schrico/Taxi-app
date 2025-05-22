import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { Pedido } from '../pedido';
import { ActivatedRoute } from '@angular/router';
import { Turno } from '../turno';
import { TurnoService } from '../turno.service';

@Component({
  selector: 'app-motorista-pedido',
  templateUrl: './motorista-pedido.component.html',
  styleUrl: './motorista-pedido.component.css',
  standalone: false,
})
export class MotoristaPedidoComponent implements OnInit {
  pedidos: (Pedido & {distancia?: number})[] = [];
  motoristaId =  '';
  taxiId = '';
  turnoAtivo: Turno | null = null;

  constructor(private pedidoService: PedidoService, private route: ActivatedRoute, private turnoService: TurnoService) {
    this.route.queryParams.subscribe(params => {
      if (params['motoristaId']) {
        this.motoristaId = params['motoristaId'];
      }
    });
  }

  ngOnInit(): void {
    console.log('ID do Motorista:', this.motoristaId);
    this.verificarTurnoAtivo();
  }

  getPedidos(): void {
    const motoristaId = localStorage.getItem('motoristaId') || this.motoristaId;

    if(!this.turnoAtivo){
      this.pedidos = [];
      return;
    }

    const taxiId = this.turnoAtivo.taxiId._id;
    this.turnoService.getTaxiById(taxiId).subscribe({
      next: (taxi) => {
        const nivelConforto = taxi.nivelConforto;

      this.pedidoService.obterPosicaoAtual().then(posicao => {
        this.pedidoService.getPedidosPorDistancia(posicao, motoristaId)
          .subscribe({
            next: async pedidos => {
              this.pedidos = pedidos
              
            },
            error: err => {
              console.error('Error fetching pedidos:', err);
            }
          })
      });
    },
    error: err => {
      console.error('Erro a buscar taxi:', err);
    }
  });
  }

  aceitarPedido(pedido: Pedido): void {
    if (!this.motoristaId) {
      console.error('ID do motorista não encontrado');
      return;
    }

    this.pedidoService.aceitarPedido(pedido._id, this.motoristaId)
      .subscribe({
        next: () => {
          this.pedidos = this.pedidos.filter(p => p._id !== pedido._id);
        },
        error: err => {
          console.error('Erro ao aceitar pedido:', err);
        }
      });
  }

  rejeitarPedido(pedido: Pedido): void {
    this.pedidoService.rejeitarPedido(pedido._id)
      .subscribe({
        next: () => {
          // Remove o pedido da lista
          this.pedidos = this.pedidos.filter(p => p._id !== pedido._id);
        },
        error: err => {
          console.error('Erro ao rejeitar pedido:', err);
        }
      });
  }

  verificarTurnoAtivo(): void {
    const motoristaId = localStorage.getItem('motoristaId') || this.motoristaId;
  
    if (motoristaId) {
      this.turnoService.getTurnosByMotorista(motoristaId).subscribe({
        next: (turnos) => {
          const agora = new Date();
          this.turnoAtivo = turnos.find(turno => {
            const inicio = new Date(turno.inicio);
            const fim = new Date(turno.fim);
            return inicio <= agora && fim >= agora;
          }) || null;

          if(this.turnoAtivo){
            this.getPedidos();
          }else{
            this.pedidos = [];
          }
        },
        error: (err) => {
          console.error('Erro ao obter turnos do motorista:', err);
        }
      });
    }
  }

  async calcularDistancia(pedido: Pedido & {distancia?: number}){
    try {
      pedido.distancia = await this.pedidoService.calcularDistanciaParaPedido(pedido);
    } catch (error) {
      console.error('Erro ao calcular distância:', error);
      pedido.distancia = 0;
    }
  }
}
