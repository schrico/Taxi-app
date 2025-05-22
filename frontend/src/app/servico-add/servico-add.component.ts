import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicoService } from '../servico.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-servico-add',
  standalone: false,
  templateUrl: './servico-add.component.html',
  styleUrl: './servico-add.component.css'
})
export class ServicoAddComponent {
  servicoForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private servicoService: ServicoService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.servicoForm = this.fb.group({
      ppmBasico: ['', [
        Validators.required,
        Validators.min(0)]],
      ppmLuxuoso: ['', [
        Validators.required,
        Validators.min(0)]],
      acrescimoNoturno: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]]
    });
  }

  onSubmit(): void {
    if (this.servicoForm.valid) {
      this.servicoService.addServico(this.servicoForm.value).subscribe({
        next: () => {
          this.messageService.add('Serviço adicionado com sucesso!');
          this.router.navigate(['/servicos']);
        },
        error: (error) => {
          this.errorMessage = error.message || 'Erro ao adicionar servico.';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/servicos']);
  }
}
