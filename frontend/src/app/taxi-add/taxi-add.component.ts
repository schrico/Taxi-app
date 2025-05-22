import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaxiService } from '../taxi.service';
import { enumConforto } from '../enum-conforto';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-taxi-add',
  standalone: false,
  templateUrl: './taxi-add.component.html',
  styleUrls: ['./taxi-add.component.css']
})

export class TaxiAddComponent implements OnInit {
  taxiForm: FormGroup;
  marcas = ['Toyota', 'Mercedes', 'BMW', 'Audi', 'Volkswagen'];
  modelos = {
    'Toyota': ['Corolla', 'Camry', 'Prius'],
    'Mercedes': ['E-Class', 'S-Class', 'C-Class'],
    'BMW': ['3 Series', '5 Series', '7 Series'],
    'Audi': ['A4', 'A6', 'A8'],
    'Volkswagen': ['Passat', 'Arteon', 'Phaeton']
  };
  modelosDisponiveis: string[] = [];
  confortoOptions = Object.values(enumConforto);
  errorMessage: string = '';
  anoAtual: number = new Date().getFullYear();
  matriculaExists: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taxiService: TaxiService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.taxiForm = this.fb.group({
      matricula: ['', [Validators.required]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anoCompra: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(this.anoAtual)
      ]],
      conforto: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.taxiForm.get('marca')?.valueChanges.subscribe(marca => {
      this.modelosDisponiveis = this.modelos[marca as keyof typeof this.modelos] || [];
      this.taxiForm.get('modelo')?.setValue('');
    });

    // Verifica se a matrícula já existe quando o usuário digita
    this.taxiForm.get('matricula')?.valueChanges.subscribe(matricula => {
      if (matricula) {
        this.checkMatriculaExists(matricula);
      }
    });
  }

  checkMatriculaExists(matricula: string): void {
    this.taxiService.getTaxis().subscribe(taxis => {
      const matriculaExists = taxis.some(taxi => 
        taxi.matricula.toLowerCase() === matricula.toLowerCase()
      );
      
      if (matriculaExists) {
        this.matriculaExists = true;
        this.errorMessage = 'Esta matrícula já está registada no sistema.';
      } else {
        this.matriculaExists = false;
        this.errorMessage = '';
      }
    });
  }

  onSubmit(): void {
    if (this.taxiForm.valid && !this.matriculaExists) {
      this.taxiService.addTaxi(this.taxiForm.value).subscribe({
        next: () => {
          this.messageService.add('Táxi adicionado com sucesso!');
          this.router.navigate(['/taxis']);
        },
        error: (error) => {
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Erro ao adicionar táxi. Por favor, tente novamente.';
          }
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/taxis']);
  }
}
