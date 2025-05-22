import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-servico-viagem',
  standalone: false,
  templateUrl: './servico-viagem.component.html',
  styleUrls: ['./servico-viagem.component.css']
})
export class ServicoViagemComponent implements OnInit {
  calculoForm: FormGroup;
  resultado: number | null = null;
  calculoRealizado = false;

  // Dados do serviço
  servicoId: string = '';
  ppmBasico: number = 0;
  ppmLuxuoso: number = 0;
  acrescimoNoturno: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {
    this.calculoForm = this.fb.group({
      nivelConforto: ['basico', Validators.required],
      dataHoraInicio: ['', Validators.required],
      dataHoraFim: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obter parâmetros da URL
    this.route.queryParams.subscribe(params => {
      if (params['servicoId']) {
        this.servicoId = params['servicoId'];
        this.ppmBasico = parseFloat(params['ppmBasico']) || 0;
        this.ppmLuxuoso = parseFloat(params['ppmLuxuoso']) || 0;
        this.acrescimoNoturno = parseFloat(params['acrescimoNoturno']) || 0;
      }
    });
  }

  calcularCustoViagem(): void {
    if (this.calculoForm.invalid) {
      return;
    }

    const formValues = this.calculoForm.value;
    const horaInicio = new Date(formValues.dataHoraInicio);
    const horaFim = new Date(formValues.dataHoraFim);

    if (horaFim <= horaInicio) {
      alert('A hora de fim deve ser posterior à hora de início.');
      return;
    }

    const precoPorMinuto = formValues.nivelConforto === 'basico'
      ? this.ppmBasico
      : this.ppmLuxuoso;

    const custoTotal = this.calcularCusto(horaInicio, horaFim, precoPorMinuto, this.acrescimoNoturno);

    this.resultado = custoTotal;
    this.calculoRealizado = true;
  }

  calcularCusto(inicio: Date, fim: Date, ppm: number, acr: number): number {
    let minTot = 0;
    let minNot = 0;
    let tempoAtual = new Date(inicio);

    while (tempoAtual < fim) {
      const hora = tempoAtual.getHours();

      if (hora >= 21 || hora < 6) {
        minNot++;
      }

      minTot++;
      tempoAtual.setMinutes(tempoAtual.getMinutes() + 1);
    }

    return (minTot - minNot)*ppm + minNot*(ppm + (ppm*acr/100));
  }

  resetarCalculo(): void {
    this.calculoRealizado = false;
    this.resultado = null;
  }
}
