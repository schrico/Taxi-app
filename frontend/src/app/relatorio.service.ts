import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private apiUrl = 'http://localhost:3000/api/relatorios';

  constructor(private http: HttpClient) {}

  getTotais(inicio?: string, fim?: string): Observable<any> {
    let params = '';
    if (inicio) params += `inicio=${inicio}&`;
    if (fim) params += `fim=${fim}`;
    return this.http.get<any>(`${this.apiUrl}?${params}`);
  }

  getSubtotais(tipo: 'motorista' | 'taxi', inicio?: string, fim?: string): Observable<any[]> {
    let params = `tipo=${tipo}`;
    if (inicio) params += `&inicio=${inicio}`;
    if (fim) params += `&fim=${fim}`;
    return this.http.get<any[]>(`${this.apiUrl}/subtotais?${params}`);
  }

  getDetalhes(tipo: 'motorista' | 'taxi', id: string, inicio?: string, fim?: string): Observable<any[]> {
    let params = `tipo=${tipo}&id=${id}`;
    if (inicio) params += `&inicio=${inicio}`;
    if (fim) params += `&fim=${fim}`;
    return this.http.get<any[]>(`${this.apiUrl}/detalhes?${params}`);
  }
}