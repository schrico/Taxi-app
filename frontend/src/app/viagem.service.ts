import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Viagem } from './viagem';
import { Pedido } from './pedido';
@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  iniciarViagem(pedido: Pedido, motoristaId: string, turnoId: string): Observable<Viagem> {
    return this.http.post<Viagem>(`${this.baseUrl}/viagens/iniciar`, { 
      pedido, 
      motoristaId, 
      turnoId
    });
  }

  // Finalizar uma viagem
  finalizarViagem(viagemId: string): Observable<Viagem> {
    return this.http.post<Viagem>(`${this.baseUrl}/viagens/${viagemId}/finalizar`, {});
  }

  // Listar viagens do motorista
  getViagensByMotorista(motoristaId: string): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.baseUrl}/viagens/motorista/${motoristaId}`);
  }

  // Listar viagens ativas do motorista
  getViagensAtivasByMotorista(motoristaId: string): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.baseUrl}/viagens/motorista/${motoristaId}/ativas`);
  }

  // Obter viagens por turno
  getViagensByTurno(turnoId: string): Observable<Viagem[]> {
    return this.http.get<Viagem[]>(`${this.baseUrl}/viagens/turno/${turnoId}`);
  }

  // Obter detalhes de uma viagem específica
  getViagem(viagemId: string): Observable<Viagem> {
    return this.http.get<Viagem>(`${this.baseUrl}/viagens/${viagemId}`);
  }

  getViagemAtiva(motoristaId: string): Observable<Viagem> {
    return this.http.get<Viagem>(`${this.baseUrl}/viagens/motorista/${motoristaId}/ativas`);
  }
}