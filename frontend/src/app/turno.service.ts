import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from './turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  private baseUrl = 'http://localhost:3000/api'; // URL base do backend

  constructor(private http: HttpClient) {}

  // Criar um turno
  createTurno(turno: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/turnos`, turno);
  }

  // Listar táxis disponíveis
  getAvailableTaxis(inicio: string, fim: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/turnos/disponiveis?inicio=${inicio}&fim=${fim}`);
  }

  // Listar turnos de um motorista
  getTurnosByMotorista(motoristaId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/turnos/motorista/${motoristaId}`);
  }

  getTurnoAtivo(motoristaId: string): Observable<Turno | null> {
    return this.http.get<Turno | null>(`${this.baseUrl}/turnos/ativos/${motoristaId}`);
  }

  getTaxiById(taxiId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/taxis/${taxiId}`);
  }
}