import { Component } from '@angular/core';
import { RelatorioService } from '../relatorio.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-gestor-relatorios',
  standalone: false,
  templateUrl: './gestor-relatorios.component.html',
  styleUrls: ['./gestor-relatorios.component.css'],
})


export class GestorRelatoriosComponent {
  inicio: string = new Date().toISOString().slice(0,10);
  fim: string = new Date().toISOString().slice(0,10);
  errorMessage: string | null = null;

  hoje: string = new Date().toISOString().slice(0,10);
  totalSelecionado: 'viagens' | 'horas' | 'km' = 'viagens';
  totais: any = null;
  detalhes: any[] = [];
  subtotaisMotoristas: any[] = [];
  subtotaisTaxis: any[] = [];
  tipoSubtotal: 'motorista' | 'taxi' = 'motorista';
  subtotalSelecionado: any = null;

  constructor(private relatorioService: RelatorioService) {}

  carregarTotais() {
    if (this.inicio > this.fim) {
      this.errorMessage = 'A data de início deve ser igual ou posterior à data de fim';
      this.subtotaisMotoristas = [];
      this.subtotaisTaxis = [];
      this.detalhes = [];
      this.totais = null;
    }
    else {
      this.errorMessage = null;
      this.subtotaisMotoristas = [];
      this.subtotaisTaxis = [];
      this.detalhes = [];
      this.relatorioService.getTotais(this.inicio, this.fim).subscribe(totais => this.totais = totais);
    }
  }


  verSubtotais(tipo: 'viagens' | 'horas' | 'km') {
  this.totalSelecionado = tipo;
  this.detalhes = [];
  this.subtotaisTaxis = [];
  this.subtotaisMotoristas = [];

  this.relatorioService.getSubtotais('taxi', this.inicio, this.fim)
    .subscribe(subsTaxis => this.subtotaisTaxis = subsTaxis);

  this.relatorioService.getSubtotais('motorista', this.inicio, this.fim)
    .subscribe(subsMotoristas => this.subtotaisMotoristas = subsMotoristas);
  }

  verDetalhes(subtotal: any) {
    this.subtotalSelecionado = subtotal;
    this.relatorioService.getDetalhes(subtotal.tipo, subtotal._id, this.inicio, this.fim)
      .subscribe(det => this.detalhes = det);
  }

  getHorasViagem(viagem: any): number {
    if (viagem.fim?.data && viagem.inicio?.data) {
      return (new Date(viagem.fim.data).getTime() - new Date(viagem.inicio.data).getTime()) / 3600000;
    }
    return 0;
  }

  formatHorasMinutos(decimal: number): string { 
    const horas = Math.floor(decimal);
    const minutos = Math.ceil((decimal - horas) * 60);
    return `${horas}h ${minutos}m`;
  }

  getDuracaoViagem(viagem: any): string {
    if (viagem.fim?.data && viagem.inicio?.data) {
      const ms = new Date(viagem.fim.data).getTime() - new Date(viagem.inicio.data).getTime();
      const horas = Math.floor(ms / 3600000);
      const minutos = Math.ceil((ms % 3600000) / 60000);
      return `${horas}h ${minutos}m`;
    }
    return '—';
  }

}