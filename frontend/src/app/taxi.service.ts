import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Taxi } from './taxi';
import { MessageService } from './message.service';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaxiService {
    private taxisUrl = 'http://localhost:3000/api/taxis';

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };  

    constructor(private http: HttpClient,
                private messageService: MessageService) {}

    //Get taxis from the server
    getTaxis(): Observable<Taxi[]> {
        return this.http.get<Taxi[]>(this.taxisUrl)
            .pipe(
                tap(_ => this.log('fetched taxis')),
                catchError(this.handleError<Taxi[]>('getTaxis', []))
            );
    }   

    getTaxi(id: string): Observable<Taxi> {
        const url = `${this.taxisUrl}/${id}`;
        return this.http.get<Taxi>(url).pipe(
            tap(_ => this.log(`fetched taxi id=${id}`)),
            catchError(this.handleError<Taxi>(`getTaxi id=${id}`))
        );
    }

    addTaxi(taxi: Taxi): Observable<Taxi> {
        return this.http.post<Taxi>(this.taxisUrl, taxi, this.httpOptions)
            .pipe(
                tap((newTaxi: Taxi) => {
                    this.log(`added taxi w/ id=${newTaxi._id}`);
                }),
                catchError(this.handleError<Taxi>('addTaxi'))
            );
    }
    
    updateTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.put<Taxi>(`${this.taxisUrl}/${taxi._id}`, taxi, this.httpOptions)
        .pipe(
            tap(_ => this.log(`updated taxi id=${taxi._id}`))
        );
    }

    deleteTaxi(id: string): Observable<any> {
        return this.http.delete(`${this.taxisUrl}/${id}`)
            .pipe(
                tap(_ => this.log(`deleted taxi id=${id}`))
            );
    }


    private log(message: string) {
        this.messageService.add(`TaxiService: ${message}`);
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
