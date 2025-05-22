import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Motorista } from './motorista';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {
  private motoristasUrl = 'http://localhost:3000/api/motorista';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getMotoristas(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.motoristasUrl)
      .pipe(
        tap(_ => this.log('fetched motoristas')),
        catchError(this.handleError<Motorista[]>('getMotoristas', []))
      );
  }

  getMotorista(id: string): Observable<Motorista> {
    const url = `${this.motoristasUrl}/${id}`;
    return this.http.get<Motorista>(url).pipe(
      tap(_ => this.log(`fetched motorista id=${id}`)),
      catchError(this.handleError<Motorista>(`getMotorista id=${id}`))
    );
  }

  addMotorista(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(this.motoristasUrl, motorista, this.httpOptions)
      .pipe(
        tap((newMotorista: Motorista) => {
          this.log(`added motorista w/ id=${newMotorista._id}`);
        }),
        catchError(this.handleError<Motorista>('addMotorista'))
      );
  }

  updateMotorista(motorista: Motorista): Observable<any> {
    const url = `${this.motoristasUrl}/${motorista._id}`;
    return this.http.put(url, motorista, this.httpOptions).pipe(
      tap(_ => this.log(`updated motorista id=${motorista._id}`))
    );
  }

  deleteMotorista(id: string): Observable<Motorista> {
    const url = `${this.motoristasUrl}/${id}`;
    return this.http.delete<Motorista>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted motorista id=${id}`))
    );
  }

  private log(message: string) {
    this.messageService.add(`MotoristaService: ${message}`);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
