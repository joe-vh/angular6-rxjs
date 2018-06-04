import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const cryptos = [
      { id: 1, name: 'Bitcoin' },
      { id: 2, name: 'Ethereum' },
      { id: 3, name: 'Ripple' },
      { id: 4, name: 'Bitcoin Cash' },
      { id: 5, name: 'EOS' },
      { id: 6, name: 'Litecoin' },
      { id: 7, name: 'Cardano' },
      { id: 8, name: 'Stellar' },
      { id: 9, name: 'IOTA' },
      { id: 10, name: 'TRON' }
    ];
    return {cryptos};
  }
}
