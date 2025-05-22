import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { MessageService } from '../message.service';
import * as L from 'leaflet';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-motorista-add',
  standalone: false,
  templateUrl: './motorista-add.component.html',
  styleUrls: ['./motorista-add.component.css']
})
export class MotoristaAddComponent {
  motoristaForm: FormGroup;
  errorMessage: string = '';
  anoAtual: number = new Date().getFullYear();
  showMap = false;
  map: any;
  marker: any;
  loadingLocation = false;

  constructor(
    private fb: FormBuilder,
    private motoristaService: MotoristaService,
    private router: Router,
    private messageService: MessageService,
    private http: HttpClient
  ) {
    this.motoristaForm = this.fb.group({
      nome: ['', [Validators.required]],
      anoNascimento: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(new Date().getFullYear() - 18)
      ]],
      nif: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{9}$')
      ]],
      genero: ['', Validators.required],
      nmrCartaConducao: ['', [Validators.required]],
      morada: this.fb.group({
        rua: ['', Validators.required],
        nmrPorta: ['', Validators.required],
        codigoPostal: ['', [
          Validators.required,
          Validators.pattern('\\d{4}-\\d{3}')
        ]]
      })
    });
  }

  openMap() {
    this.showMap = true;
    setTimeout(() => {
      if (this.map) {
        this.map.remove();
      }
      
      this.map = L.map('moradaMap', {
        center: [38.7223, -9.1393],
        zoom: 13,
        zoomControl: true,
        maxZoom: 19
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);

      this.map.on('click', (e: any) => {
        this.setMoradaMarker(e.latlng.lat, e.latlng.lng);
      });

      setTimeout(() => this.map.invalidateSize(), 100);
    });
  }

  closeMap() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.showMap = false;
  }

  setMoradaMarker(lat: number, lng: number) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.loadingLocation = true;
    this.reverseGeocode(lat, lng);
  }

  reverseGeocode(lat: number, lon: number) {
    this.loadingLocation = true;
    this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
      .subscribe({
        next: (data) => {
          const address = data.address || {};
          this.motoristaForm.patchValue({
            morada: {
              rua: address.road || '',
              nmrPorta: address.house_number || '',
              codigoPostal: address.postcode || ''
            }
          });
          this.loadingLocation = false;
          this.closeMap();
        },
        error: () => {
          this.errorMessage = "Não foi possível obter a morada a partir das coordenadas.";
          this.loadingLocation = false;
        }
      });
  }

  onSubmit(): void {
    if (this.motoristaForm.valid) {
      this.motoristaService.addMotorista(this.motoristaForm.value).subscribe({
        next: () => {
          this.messageService.add('Motorista adicionado com sucesso!');
          this.router.navigate(['/motoristas']);
        },
        error: (error) => {
          this.errorMessage = error.error.message || 'Erro ao adicionar motorista.';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/motoristas']);
  }
}
