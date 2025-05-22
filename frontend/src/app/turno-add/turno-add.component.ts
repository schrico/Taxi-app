import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TurnoService } from '../turno.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-turno-add',
  templateUrl: './turno-add.component.html',
  standalone: false,
  styleUrls: ['./turno-add.component.css']
})
export class TurnoAddComponent {
  turnoForm: FormGroup;
  taxisDisponiveis: any[] = [];
  errorMessage: string = '';
  mostrarTaxis: boolean = false; // Controla a exibição da lista de táxis

  constructor(private fb: FormBuilder, private turnoService: TurnoService, private route: ActivatedRoute, private location: Location) {
    this.turnoForm = this.fb.group({
      motoristaId: ['', Validators.required],
      inicio: ['', [Validators.required, this.validarInicio]],
      fim: ['', [Validators.required, this.validarFim]],
      taxiId: ['', Validators.required] 
    });

    this.route.queryParams.subscribe(params => {
      if (params['motoristaId']) {
        this.turnoForm.patchValue({ motoristaId: params['motoristaId'] });
      }
    });
  }

  // Validação personalizada para o campo "Início"
  validarInicio(control: any) {
    const inicio = new Date(control.value);
    const agora = new Date();
    if (inicio <= agora) {
      return { inicioInvalido: true };
    }
    return null;
  }

  // Validação personalizada para o campo "Fim"
  validarFim(control: any) {
    const fim = new Date(control.value);
    const inicio = control.parent?.get('inicio')?.value;
    if (inicio && fim <= new Date(inicio)) {
      return { fimInvalido: true };
    }
    const duracao = (fim.getTime() - new Date(inicio).getTime()) / (1000 * 60 * 60);
    if (duracao > 8) {
      return { duracaoExcedida: true };
    }
    return null;
  }

  buscarTaxisDisponiveis(): void {
    if (this.turnoForm.get('inicio')?.valid && this.turnoForm.get('fim')?.valid) {
      const { inicio, fim } = this.turnoForm.value;
      this.turnoService.getAvailableTaxis(inicio, fim).subscribe({
        next: (taxis) => {
          this.taxisDisponiveis = taxis;
          this.mostrarTaxis = true; // Exibe a lista de táxis
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erro ao buscar táxis disponíveis.';
          this.mostrarTaxis = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.turnoForm.valid) {
      this.turnoService.createTurno(this.turnoForm.value).subscribe({
        next: () => this.location.back(),
        
        error: (err) => this.errorMessage = err.error?.message || 'Erro ao criar turno.'
      });
    }
  }

  cancel(): void {
    this.turnoForm.reset();
    this.mostrarTaxis = false;
    this.location.back();
  }
}