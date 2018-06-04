import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Crypto } from '../models/crypto';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-crypto-search',
  templateUrl: './crypto-search.component.html',
  styleUrls: [ './crypto-search.component.css' ]
})
export class CryptoSearchComponent implements OnInit {
  cryptos$: Observable<Crypto[]>;
  private searchTerms = new Subject<string>();

  constructor(private cryptoService: CryptoService) {}

  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.cryptos$ = this.searchTerms.pipe(
      debounceTime(300),

      distinctUntilChanged(),

      switchMap((term: string) => this.cryptoService.searchCryptos(term)),
    );
  }
}
