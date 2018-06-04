import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { AppRoutingModule }     from './app-routing.module';

import { AppComponent }         from './app.component';
import { DashboardComponent }   from './dashboard/dashboard.component';
import { CryptoDetailComponent }  from './crypto-detail/crypto-detail.component';
import { CryptosComponent }      from './cryptos/cryptos.component';
import { CryptoSearchComponent }  from './crypto-search/crypto-search.component';
import { MessagesComponent }    from './messages/messages.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    CryptosComponent,
    CryptoDetailComponent,
    MessagesComponent,
    CryptoSearchComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
