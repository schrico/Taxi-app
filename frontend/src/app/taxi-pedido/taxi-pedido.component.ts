import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taxi-pedido',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './taxi-pedido.component.html',
  styleUrl: './taxi-pedido.component.css'
})
export class TaxiPedidoComponent {
  pedidoForm: FormGroup;
  mensagem: string = '';
  erro: string = '';
  loadingLocation = false;
  showMapDestino = false;
  map: any;
  marker: any;
  loadingDestinoLocation = false;

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router: Router
  ) {
    this.pedidoForm = this.fb.group({
      cliente: this.fb.group({
        nome: ['', Validators.required],
        nif: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
        genero: ['', [Validators.required]],
      }),
      origem: this.fb.group({
        rua: ['', Validators.required],
        nmrPorta: ['', Validators.required],
        codigoPostal: ['', [Validators.required, Validators.pattern('\\d{4}-\\d{3}')]],
        localidade: [''],
        latitude: [''],
        longitude: ['']
      }),
      destino: this.fb.group({
        rua: ['', Validators.required],
        nmrPorta: ['', Validators.required],
        codigoPostal: ['', [Validators.required, Validators.pattern('\\d{4}-\\d{3}')]],
        localidade: [''],
        latitude: [''],
        longitude: ['']
      }),
      conforto: ['', Validators.required],
      nmrPessoas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.pedidoForm.valid) {
      this.http.post<any>('http://localhost:3000/api/pedido', this.pedidoForm.value).subscribe({
        next: (response) => {
          if (response.pedido && response.pedido._id) {
            this.router.navigate(['/acompanhamento'], {
              state: { pedidoId: response.pedido._id } // Pass the pedidoId
            });
          } else {
            console.error('Pedido ID is missing in the response.');
            this.erro = 'Erro: Pedido ID não encontrado.';
          }
        },
        error: (err) => {
          this.erro = err.error?.message || 'Erro ao pedir táxi.';
          this.mensagem = '';
        }
      });
    }
  }

  getCurrentLocation() {
    this.loadingLocation = true;
    if (!navigator.geolocation) {
      this.erro = "Geolocalização não suportada pelo browser.";
      this.loadingLocation = false;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.reverseGeocode(lat, lon);
      },
      err => {
        this.erro = "Não foi possível obter a localização.";
        this.loadingLocation = false;
      }
    );
  }

  //coordenadas para morada
  reverseGeocode(lat: number, lon: number) {
    this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
      .subscribe({
        next: (data) => {
          const address = data.address || {};
          this.pedidoForm.patchValue({
            origem: {
              rua: address.road || '',
              nmrPorta: address.house_number || '',
              codigoPostal: address.postcode || '',
              localidade: address.city || address.town || address.village || '',
              latitude: lat,
              longitude: lon
            }
          });
          this.mensagem = "Morada preenchida automaticamente.";
          this.erro = '';
          this.loadingLocation = false;
        },
        error: () => {
          this.erro = "Não foi possível obter a morada a partir das coordenadas.";
          this.loadingLocation = false;
        }
      });
  }

  openMapDestino() {
    this.showMapDestino = true;
    setTimeout(() => {
      if (this.map) {
        this.map.remove();
      }
      
      const map = L.map('mapDestino', {
        center: [38.7223, -9.1393],
        zoom: 13,
        zoomControl: true,
        maxZoom: 19
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      this.map = map;

      this.map.on('click', (e: any) => {
        this.setDestinoMarker(e.latlng.lat, e.latlng.lng);
      });

      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    });
  }

  closeMapDestino() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.showMapDestino = false;
  }

  setDestinoMarker(lat: number, lng: number) {
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }
    this.marker = L.marker([lat, lng]).addTo(this.map);
    this.loadingDestinoLocation = true;
    this.reverseGeocodeDestino(lat, lng);
  }

  reverseGeocodeDestino(lat: number, lon: number) {
    this.http.get<any>(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
      .subscribe({
        next: (data) => {
          const address = data.address || {};
          this.pedidoForm.patchValue({
            destino: {
              rua: address.road || '',
              nmrPorta: address.house_number || '',
              codigoPostal: address.postcode || '',
              localidade: address.city || address.town || address.village || '',
              latitude: lat,
              longitude: lon
            }
          });
          this.mensagem = "Destino preenchido automaticamente a partir do mapa.";
          this.erro = '';
          this.loadingDestinoLocation = false;
          this.closeMapDestino();
        },
        error: () => {
          this.erro = "Não foi possível obter a morada do destino.";
          this.loadingDestinoLocation = false;
        }
      });
  }
}
