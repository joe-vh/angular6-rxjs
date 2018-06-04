import { Component, OnInit } from '@angular/core';

import { Crypto } from '../models/crypto';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-cryptos',
  templateUrl: './cryptos.component.html',
  styleUrls: ['./cryptos.component.css']
})
export class CryptosComponent implements OnInit {
  cryptos: Crypto[];

  constructor(private cryptoService: CryptoService) { }

  ngOnInit() {
    this.getCryptos();
  }

  getCryptos(): void {
    this.cryptoService.getCryptos()
    .subscribe(cryptos => this.cryptos = cryptos);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.cryptoService.addCrypto({ name } as Crypto)
      .subscribe(crypto => {
        this.cryptos.push(crypto);
      });
  }

  delete(crypto: Crypto): void {
    this.cryptos = this.cryptos.filter(h => h !== crypto);
    this.cryptoService.deleteCrypto(crypto).subscribe();
  }

}
