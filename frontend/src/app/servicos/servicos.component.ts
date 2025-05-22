import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicoService } from '../servico.service';
import { Servico } from '../servico';

@Component({
  selector: 'app-servicos',
  standalone: false,
  templateUrl: './servicos.component.html',
  styleUrl: './servicos.component.css'
})
export class ServicosComponent implements OnInit {
  servicos: Servico[] = [];

  constructor(
    private servicoService: ServicoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getServicos();
  }

  getServicos(): void {
    this.servicoService.getServicos()
      .subscribe(servicos => this.servicos = servicos);
  }

  navigateToAddServico(): void {
    this.router.navigate(['servicos/add']);
  }
}
