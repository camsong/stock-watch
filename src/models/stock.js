import Fetcher from '../fetcher';
import Vow, { Promise } from 'vow';

class Stock {
  constructor(obj) {
    this.symbol = obj.symbol;
    this.expectPrice = obj.expectPrice;
    this.note = obj.note;
  }

  static getAll() {
    return data;
  }

  static fetchAll() {
    const symbolArr = data.map(stock => stock.symbol);
    return new Promise((resolve, reject) => {
      // if symbol is empty, return an empty array;
      if (symbolArr.length === 0) resolve([]);

      Fetcher.getRealtime(...symbolArr).then((result) => {
        result = data.map(stock => {
          return {
            symbol: stock.symbol,
            expectPrice: stock.expectPrice,
            note: stock.note,
            realtime: result[stock.symbol]
          }
        });
        resolve(result);
      }, (err) => {
        reject(err);
      });
    });
  }

  // fetch this stock's realtime
  fetchRealtime() {
    return new Promise((resolve, reject) => {
      Fetcher.getRealtime(this.symbol).then((result) => {
        resolve({
          symbol: this.symbol,
          expectPrice: this.expectPrice,
          note: this.note,
          realtime: result[this.symbol]
        });
      }, (err) => {
        reject(err);
      });
    });
  }

  // fetch this stock's KChart
  fetchKChart(period = 'day', begin = new Date(2014, 1, 1).getTime(), end = Date.now()) {
    return new Promise((resolve, reject) => {
      Fetcher.getKChart(this.symbol, period, begin, end).then((result) => {
        resolve({
          symbol: this.symbol,
          expectPrice: this.expectPrice,
          note: this.note,
          kchart: result.list
        });
      }, (err) => {
        reject(err);
      });
    });
  }

  static findBySymbol(symbol) {
    for(let stock of data) {
      if(stock.symbol === symbol) return stock;
    }
  }

  static fuzzySearch() {
  }

  static create(obj) {
    let stock = new Stock(obj);
    data.push(stock);
    return stock;
  }

  update(obj) {
    this.expectPrice = obj.expectPrice;
    this.note = obj.note; 
    return this;
  }

  del() {
    data.forEach((stock, i) => {
      if (stock.symbol === this.symbol) {
        // remove that element
        data.splice(i, 1);
      }
    });
  }
}

let data = [
  new Stock({symbol: 'BABA', expectPrice: 223.12, note: 'Like this'}),
  new Stock({symbol: 'WUBA', expectPrice: 80, note: 'I\'m rich'}),
  new Stock({symbol: 'YY', expectPrice: 123.12, note: 'You can u up'})
];

export default Stock;