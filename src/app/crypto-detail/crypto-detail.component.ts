import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Crypto }         from '../models/crypto';
import { CryptoService }  from '../services/crypto.service';

@Component({
  selector: 'app-crypto-detail',
  templateUrl: './crypto-detail.component.html',
  styleUrls: [ './crypto-detail.component.css' ]
})
export class CryptoDetailComponent implements OnInit {
  @Input() crypto: Crypto;

  constructor(
    private route: ActivatedRoute,
    private cryptoService: CryptoService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getCrypto();
  }

  getCrypto(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.cryptoService.getCrypto(id)
      .subscribe(crypto => this.crypto = crypto);
  }

  goBack(): void {
    this.location.back();
  }

 save(): void {
    this.cryptoService.updateCrypto(this.crypto)
      .subscribe(() => this.goBack());
  }
}
