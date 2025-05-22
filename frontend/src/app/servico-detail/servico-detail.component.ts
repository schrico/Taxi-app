import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Servico } from '../servico';
import { ServicoService } from '../servico.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servico-detail',
  standalone: false,
  templateUrl: './servico-detail.component.html',
  styleUrl: './servico-detail.component.css'
})
export class ServicoDetailComponent implements OnInit {
  servico: Servico | undefined;

  constructor(
    private servicoService: ServicoService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
  ) { }

  ngOnInit() {
    this.getServico();
  }

  getServico(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.servicoService.getServico(id)
        .subscribe(servico => this.servico = servico);
    }
  }

  goBack(): void {
    this.location.back();
  }

  calcularViagem(): void {
    if (this.servico) {
      this.router.navigate(['/servicos-viagem'], {
        queryParams: {
          servicoId: this.servico._id,
          ppmBasico: this.servico.ppmBasico,
          ppmLuxuoso: this.servico.ppmLuxuoso,
          acrescimoNoturno: this.servico.acrescimoNoturno
        }
      });
    }
  }
}
