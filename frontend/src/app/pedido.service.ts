import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import { Pedido } from './pedido';
import { catchError, tap } from 'rxjs/operators';
import { MessageService } from './message.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private pedidosUrl = 'http://localhost:3000/api/pedidos';

  private readonly FACULDADE_CIENCIAS ={
    latitude: 38.756734,
    longitude: -9.155412
  }

  constructor(private http: HttpClient,
              private messageService: MessageService) {}

  calcularDistancia(origem: {latitude: number, longitude: number}, destino: {latitude: number, longitude: number}): number {
    const R = 6371;

    const lat1 = this.toRad(origem.latitude);
    const lon1 = this.toRad(origem.longitude);
    const lat2 = this.toRad(destino.latitude);
    const lon2 = this.toRad(destino.longitude);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distancia = R * c;

    return Number(distancia.toFixed(2));
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  

  obterPosicaoAtual(): Promise<{latitude: number, longitude: number}> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          },
          (error) => {
            console.warn('Não foi possível obter a localização:', error);
            resolve(this.FACULDADE_CIENCIAS);
          }
        );
      } else {
        console.warn('Geolocalização não suportada pelo navegador');
        resolve(this.FACULDADE_CIENCIAS);
      }
    });
  }

  

  async calcularDistanciaParaPedido(pedido: Pedido) {
    const posicaoAtual = await this.obterPosicaoAtual();
    if (!pedido.origem?.latitude || !pedido.origem?.longitude) {
      throw new Error('Coordenadas de origem do pedido não disponíveis');
    }
    const distancia = this.calcularDistancia(
      posicaoAtual,
      { latitude: pedido.origem.latitude, longitude: pedido.origem.longitude }
    );
    return distancia;
  }

  getPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.pedidosUrl)
      .pipe(
          tap(_ => this.log('fetched pedidos')),
          catchError(this.handleError<Pedido[]>('getPedidos', []))
      );
  }

  getPedidosPedentes(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>('http://localhost:3000/api/pedidos/pendentes');
  }

  getPedidosPorEstado(estado: string): Observable<Pedido[]> {
    const url = `http://localhost:3000/api/pedidos/estado/${estado}`;
    return this.http.get<Pedido[]>(url)
      .pipe(
        tap(_ => this.log(`fetched pedidos por estado: ${estado}`)),
        catchError(this.handleError<Pedido[]>(`getPedidosPorEstado estado=${estado}`, []))
      );
  }

  getPedidosPorDistancia(posicao: any, motoristaId?: string): Observable<Pedido[]> {
    let params = new HttpParams();
    
    if (posicao) {
      params = params.set('latitude', posicao.latitude.toString());
      params = params.set('longitude', posicao.longitude.toString());
    }

    if(motoristaId){
      params = params.set('motoristaId', motoristaId);
    }
    
    
    return this.http.get<Pedido[]>(`${this.pedidosUrl}/distancia`, { params })
      .pipe(
        tap(_ => this.log('obtidos pedidos por distância')),
        catchError(this.handleError<Pedido[]>('getPedidosPorDistancia', []))
      );
  }
  
  // Aceitar um pedido
  aceitarPedido(pedidoId: string, motoristaId: string): Observable<any> {
    return this.http.put<any>(`${this.pedidosUrl}/${pedidoId}/aceitar`, { motoristaId })
      .pipe(
        tap(_ => this.log(`pedido ${pedidoId} aceito por motorista ${motoristaId}`)),
        catchError(this.handleError<any>('aceitarPedido'))
      );
  }

  getPedidosPorMotorista(motoristaId: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.pedidosUrl}/motorista/${motoristaId}`);
  }
  
  // Rejeitar um pedido
  rejeitarPedido(pedidoId: string): Observable<any> {
    return this.http.put<any>(`${this.pedidosUrl}/${pedidoId}/rejeitar`, {})
      .pipe(
        tap(_ => this.log(`pedido ${pedidoId} rejeitado`)),
        catchError(this.handleError<any>('rejeitarPedido'))
      );
  }


  confirmarMotorista(pedidoId: string): Observable<any> {
    return this.http.put<any>(`${this.pedidosUrl}/${pedidoId}/confirmar`, {})
      .pipe(
        tap(_ => this.log(`cliente confirmou motorista para pedido ${pedidoId}`)),
        catchError(this.handleError<any>('confirmarMotorista'))
      );
  }

  rejeitarMotorista(pedidoId: string): Observable<any> {
    return this.http.put<any>(`${this.pedidosUrl}/${pedidoId}/rejeitar-motorista`, {})
      .pipe(
        tap(_ => this.log(`cliente rejeitou motorista para pedido ${pedidoId}`)),
        catchError(this.handleError<any>('rejeitarMotorista'))
      );
  }

  getPedido(id: string): Observable<Pedido> {
    const url = `${this.pedidosUrl}/${id}`;
    console.log('Buscando pedido:', url); // Debug
    return this.http.get<Pedido>(url)
      .pipe(
        tap(pedido => console.log('Pedido obtido:', pedido)), // Debug
        tap(_ => this.log(`obtido pedido ${id}`)),
        catchError(this.handleError<Pedido>(`getPedido id=${id}`))
      );
  }

  

  private log(message: string) {
    this.messageService.add(`PedidoService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
