import RequestOrigin from 'request';
import Constants, {Exchange} from '../utils/Constants';
import Vow from 'vow';

const realtimeUrl = 'http://download.finance.yahoo.com/d/quotes.csv';

const Request = RequestOrigin.defaults({
  jar: true, // enable cookie
  proxy: 'http://127.0.0.1:8888',
  headers: {
    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2457.0 Safari/537.36',
  }
});

class Yahoo {
  constructor (props) {
    this.props = props;
  }

  static convertSymbol(symbol) {
    symbol = symbol.toUpperCase();
    // shanghai, eg SH600036
    if (/^SH\d+$/gi.test(symbol)) {
      return /^SH(\d+)$/gi.exec(symbol)[1] + '.ss';
    }
    // shenzhen
    if (/^SZ\d+$/gi.test(symbol)) {
      return /^SZ(\d+)$/gi.exec(symbol)[1] + '.sz';
    }
    // hongkong
    if (/^HK\d+$/gi.test(symbol)) {
      return /^HK(\d+)$/gi.exec(symbol)[1] + '.hk';
    }
    return symbol;
  }

  static rollbackSymbol(symbol) {
    if (/^\d+\.ss$/gi.test(symbol)) {
      return 'SH' + /^(\d+)\.ss$/gi.exec(symbol)[1];
    }
    // shenzhen
    if (/^SZ\d+$/gi.test(symbol)) {
      return /^SZ(\d+)$/gi.exec(symbol)[1] + '.sz';
    }
    // hongkong
    if (/^HK\d+$/gi.test(symbol)) {
      return /^HK(\d+)$/gi.exec(symbol)[1] + '.hk';
    }
    return symbol;
  }

  _convertExchange(exchange) {
    switch(exchange) {
      case 'NYQ':
        return 'NYSE';
       case 'NMS':
        return 'NASDAQ';
      default:
        return exchange;
    }
  }

  formatRealtimeData(csvData) {
    const arr = csvData.split('\n').filter(line => line.length > 0);
    let result = {};
    arr.forEach(item => {
      const values = item.split(',').map(val => {
        // two types: string and number, if "BABA" as a string, 123 as a number
        if(val === 'N/A') return null;
        if (/^\".*\"$/g.test(val)) {
          // "BABA" => BABA
          return val.slice(1, val.length - 1);
        } else {
          return parseFloat(val);
        }
      });
      const symbol = this.constructor.rollbackSymbol(values[0]);
      // TODO parseFloat
      result[symbol] = {
        symbol: symbol,
        exchange: this._convertExchange(values[9]), // stock's exchange; NYQ->NYSE
        name: values[13],
        current: values[1],
        time: values[2] + values[3],
        change: values[4],
        open: values[5], // day's open
        high: values[6], // day's high
        low: values[7],  // day's low
        volume: values[8],
        previousClose: values[10],
        high52week: values[11],
        low52week: values[12],
      };
    });
    return result;
  }

  getRealtime(symbolArr) {
    const symbolStr = symbolArr.map(Yahoo.convertSymbol).join('+');
    return new Vow.Promise((resolve, reject) => {
      Request({
        url: `${realtimeUrl}?s=${symbolStr}&f=sl1d1t1c1ohgvxpkjn&e=.csv`
      }, (error, response, body) => {
        if (error) {
          reject(error); return false;
        }
        try {
          resolve(this.formatRealtimeData(body));
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  /*
   * mode: day, month, week
   * begin: start day timestamp
   * end: end day timestamp
   */
  getKChart(symbol, period, begin, end) {
    //TODO
  }
};

export default Yahoo;
