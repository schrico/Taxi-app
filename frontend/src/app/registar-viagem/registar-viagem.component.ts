import { Component, OnInit } from '@angular/core';
import { PedidoService } from '../pedido.service';
import { TurnoService } from '../turno.service';
import { ViagemService } from '../viagem.service';
import { Pedido } from '../pedido';
import { Turno } from '../turno';
import { Viagem } from '../viagem';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.component.html',
  styleUrls: ['./registar-viagem.component.css'],
  standalone: false,
})
export class RegistarViagemComponent implements OnInit {
  motoristaId = '';
  turnoAtivo: Turno | null = null;
  pedidosAceitos: Pedido[] = [];
  pedidoSelecionado: Pedido | null = null;
  viagemAtiva: Viagem | null = null;
  coordenadasAtuais: { lat: number, lng: number } = { lat: 0, lng: 0 };
  carregando: boolean = false;
  erro: string = '';
  mensagem: string = '';
  
  // Para viagem ativa
  duracaoViagem: string = '';
  intervalId: any;

  constructor(
    private pedidoService: PedidoService,
    private turnoService: TurnoService,
    private viagemService: ViagemService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.motoristaId = localStorage.getItem('motoristaId') || '';
    console.log('ID do Motorista:', this.motoristaId);

    this.route.queryParams.subscribe(params => {
      if (params['motoristaId']) {
        this.motoristaId = params['motoristaId'];
        localStorage.setItem('motoristaId', this.motoristaId);
        console.log('ID do Motorista da URL:', this.motoristaId);
      }
    });


    
    this.verificarTurnoAtivo();
    this.verificarViagemAtiva();
    this.carregarPedidosAceitos();
    this.obterPosicaoAtual();

  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
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
            this.carregarPedidosAceitos();
          }else{
            this.pedidosAceitos = [];
          }
        },
        error: (err) => {
          console.error('Erro ao obter turnos do motorista:', err);
        }
      });
    }
  }

  verificarViagemAtiva(): void {
    const motoristaId = localStorage.getItem('motoristaId') || this.motoristaId;
    if (!this.motoristaId) return;
  
    this.viagemService.getViagensAtivasByMotorista(this.motoristaId).subscribe({
      next: (viagens) => {
        if (viagens && viagens.length > 0) {
          this.viagemAtiva = viagens[0];
          this.iniciarContadorDuracao();
        } else {
          this.viagemAtiva = null;
          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
        }
      },
      error: (err) => {
        this.erro = 'Erro ao verificar viagem ativa: ' + err.message;
      }
    });
  }

  carregarPedidosAceitos(): void {
    const motoristaId = localStorage.getItem('motoristaId') || this.motoristaId;
    if (!this.motoristaId) return;
  
    this.pedidoService.getPedidosPorMotorista(this.motoristaId).subscribe({
      next: (pedidos) => {
        this.pedidosAceitos = pedidos.filter(pedido => pedido.estado === 'Aceite-Cliente');
      },
      error: (err) => {
        this.erro = 'Erro ao carregar pedidos: ' + err.message;
      }
    });
  }

  obterPosicaoAtual(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicao) => {
          this.coordenadasAtuais = {
            lat: posicao.coords.latitude,
            lng: posicao.coords.longitude
          };
        },
        (erro) => {
          this.erro = 'Erro ao obter posição atual: ' + erro.message;
        }
      );
    } else {
      this.erro = 'Geolocalização não está disponível neste navegador.';
    }
  }

  selecionarPedido(pedido: Pedido): void {
    this.pedidoSelecionado = pedido;
  }

  iniciarViagem(): void {
    const motoristaId = localStorage.getItem('motoristaId') || this.motoristaId;
    if (!this.motoristaId || !this.turnoAtivo || !this.pedidoSelecionado) {
      this.erro = 'Dados insuficientes para iniciar a viagem.';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.obterPosicaoAtual();

    this.viagemService.iniciarViagem(
      this.pedidoSelecionado,
      this.motoristaId,
      String(this.turnoAtivo!._id),
    ).subscribe({
      next: (viagem) => {
        this.viagemAtiva = viagem;
        this.pedidoSelecionado = null;
        this.carregarPedidosAceitos();
        this.iniciarContadorDuracao();
        this.mensagem = 'Viagem iniciada com sucesso!';
        this.carregando = false;
      },
      error: (err) => {
        this.erro = 'Erro ao iniciar viagem: ' + err.message;
        this.carregando = false;
      }
    });
  }

  finalizarViagem(): void {
    const motoristaId = localStorage.getItem('motoristaId') || this.motoristaId;
    if (!this.viagemAtiva) {
      this.erro = 'Não há viagem ativa para finalizar.';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.obterPosicaoAtual();

    this.viagemService.finalizarViagem(
      this.viagemAtiva._id!
    ).subscribe({
      next: (viagem) => {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.mensagem = `Viagem finalizada! Distância: ${viagem.quilometros?.toFixed(2)}km, Preço: €${viagem.precoTotal?.toFixed(2)}`;
        this.viagemAtiva = null;
        this.carregando = false;

        setTimeout(() => this.verificarViagemAtiva(), 500);
      },
      error: (err) => {
        this.erro = 'Erro ao finalizar viagem: ' + err.message;
        this.carregando = false;
      }
    });


  }

  iniciarContadorDuracao(): void {
    if (!this.viagemAtiva || !this.viagemAtiva.inicio) return;

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    const atualizarDuracao = () => {
      if (!this.viagemAtiva || !this.viagemAtiva.inicio) return;
      
      const inicio = new Date(this.viagemAtiva.inicio.data);
      const agora = new Date();
      const diff = agora.getTime() - inicio.getTime();
      
      const minutos = Math.floor((diff / 1000) / 60);
      const segundos = Math.floor((diff / 1000) % 60);
      
      this.duracaoViagem = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
    };

    atualizarDuracao();
    this.intervalId = setInterval(atualizarDuracao, 1000);
  }
}