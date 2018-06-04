import { Component, OnInit } from '@angular/core';
import { Crypto } from '../models/crypto';
import { CryptoService } from '../services/crypto.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {
  cryptos: Crypto[] = [];

  constructor(private cryptoService: CryptoService) { }

  ngOnInit() {
    this.getCryptos();
  }

  getCryptos(): void {
    this.cryptoService.getCryptos()
      .subscribe(cryptos => this.cryptos = cryptos.slice(1, 5));
  }
}
