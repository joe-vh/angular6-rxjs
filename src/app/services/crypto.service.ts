import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Crypto } from '../models/crypto';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class CryptoService {

  private cryptosUrl = 'http://localhost:8080/api/cryptos';

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }


  getCryptos (): Observable<Crypto[]> {
    return this.http.get<Crypto[]>(this.cryptosUrl)
      .pipe(
        tap(cryptos => this.log(`fetched cryptos`)),
        catchError(this.handleError('getCryptos', []))
      );
  }


  getCrypto(id: number): Observable<Crypto> {
    const url = `${this.cryptosUrl}/${id}`;
    return this.http.get<Crypto>(url).pipe(
      tap(_ => this.log(`fetched crypto id=${id}`)),
      catchError(this.handleError<Crypto>(`getCrypto id=${id}`))
    );
  }


  searchCryptos(term: string): Observable<Crypto[]> {
    if (!term.trim()) {
      return of([]);
    }
    return this.http.get<Crypto[]>(`${this.cryptosUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found cryptos matching "${term}"`)),
      catchError(this.handleError<Crypto[]>('searchCryptos', []))
    );
  }


  // save methods

  addCrypto (crypto: Crypto): Observable<Crypto> {
    return this.http.post<Crypto>(this.cryptosUrl, crypto, httpOptions).pipe(
      tap((crypto: Crypto) => this.log(`added crypto w/ id=${crypto.id}`)),
      catchError(this.handleError<Crypto>('addCrypto'))
    );
  }


  deleteCrypto (crypto: Crypto | number): Observable<Crypto> {
    const id = typeof crypto === 'number' ? crypto : crypto.id;
    const url = `${this.cryptosUrl}/${id}`;

    return this.http.delete<Crypto>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted crypto id=${id}`)),
      catchError(this.handleError<Crypto>('deleteCrypto'))
    );
  }


  updateCrypto (crypto: Crypto): Observable<any> {
    return this.http.put(this.cryptosUrl, crypto, httpOptions).pipe(
      tap(_ => this.log(`updated crypto id=${crypto.id}`)),
      catchError(this.handleError<any>('updateCrypto'))
    );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }


  private log(message: string) {
    this.messageService.add('CryptoService: ' + message);
  }
}
