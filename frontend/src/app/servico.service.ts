import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import {Observable, of} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Servico } from './servico';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private servicoUrl = "http://localhost:3000/api/servicos";

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getServicos(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.servicoUrl)
      .pipe(
        tap(_ => this.log('fetched serviços')),
        catchError(this.handleError<Servico[]>('getServicos', []))
      );
  }

  getServico(id: string): Observable<Servico> {
    const url = `${this.servicoUrl}/${id}`;
    return this.http.get<Servico>(url).pipe(
      tap(_ => this.log(`fetched servico id=${id}`)),
      catchError(this.handleError<Servico>(`getServico id=${id}`))
    );
  }

  addServico(servico: Servico): Observable<Servico> {
    return this.http.post<Servico>(this.servicoUrl, servico, this.httpOptions)
      .pipe(
        tap((newServico: Servico) => {
          this.log(`added servico w/ id=${newServico._id}`);
        }),
        catchError(this.handleError<Servico>('addServico'))
      );
  }

  private log(message: string) {
    this.messageService.add(`ServicoService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
