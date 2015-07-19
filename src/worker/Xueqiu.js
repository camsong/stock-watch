import RequestOrigin from 'request';
import Constants, {Exchange} from '../utils/Constants';
import Vow from 'vow';

const URL_REALTIME = 'http://xueqiu.com/v4/stock/quote.json';
const URL_KCHART = 'http://xueqiu.com/stock/forchartk/stocklist.json';

const Request = RequestOrigin.defaults({
  jar: true, // enable cookie
  proxy: 'http://127.0.0.1:8888',
  headers: {
    Referer: 'http://xueqiu.com/',
    Accept: '*/*',
    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2457.0 Safari/537.36',
  }
});

class Xueqiu {
  constructor(props) {
    // props object including disabled
    this.props = props;
    this.hasError = false;
    this.loginPromise = new Vow.Promise((resolve, reject) => {
      Request({
        url: 'http://xueqiu.com',
      }, (error, response, body) => {
        if (!error && response.statusCode == 200) {
          this.hasError = false;
          resolve(body);
        } else {
          this.hasError = true;
          reject(error);
        }
      });
    });
  }

  static convertSymbol(symbol) {
    symbol = symbol.toUpperCase();
    // if it's from hongkong, remove prefix, use the number only
    if (/^HK\d+$/gi.test(symbol)) {
      return /^HK(\d+)$/gi.exec(symbol)[1];
    }
    return symbol;
  }

  formatRealtimeData(jsonData) {
    let result = [];
    for(let symbol in jsonData) {
      const d = jsonData[symbol];
      result.push({
        symbol: d.symbol, //BABA
        exchange: d.exchange, //NYSE
        name: d.name, //阿里巴巴
        current: d.current, //88
        time: d.time,
        change: d.change,
        open: d.open,
        high: d.high,
        low: d.low,
        volume: d.volume,
        previousClose: d.last_close,
        high52week: d.high52week,
        low52week: d.low52week
      });
    }
    return result;
  }

  getRealtime(symbolArr) {
    const symbolStr = symbolArr.map(this.constructor.convertSymbol).join(',');
    return new Vow.Promise((resolve, reject) => {
      this.loginPromise.then(() => {
        Request({
          url: `${URL_REALTIME}?code=${symbolStr}&_=${Date.now()}`,
        }, (error, response, body) => {
          if (error) {
            reject(error); return false;
          }
          try {
            body = JSON.parse(body);
            resolve(this.formatRealtimeData(body));
          } catch (e) {
            reject(e);
          }
        });
      }, (error) => {
        reject(error);
      });
    });
  }

  /*
   * mode: day, month, week
   * begin: start day timestamp
   * end: end day timestamp
   */
  getKchart(symbol, period, begin, end) {
    //http://xueqiu.com/stock/forchartk/stocklist.json?symbol=BABA&period=1month&type=normal&begin=1311130858058&end=1437274858058&_=1437274858058
    return new Vow.Promise((resolve, reject) => {
      this.loginPromise.then(() => {
        Request({
          url: `${URL_KCHART}?symbol=${symbol}&period=1${period}&type=normal&begin=${begin}&end=${end}&_=${Date.now()}`
        }, (error, response, body) => {
          if (error) {
            reject(error); return false;
          }
          try {
            body = JSON.parse(body);
            if (body.success === 'true') {
              resolve(body.chartlist);
            } else {
              reject(body);
            }
          } catch (e) {
            reject(e);
          }
        });
      }, (error) => {
        reject(error);
      });
    });
  }
};

export default Xueqiu;
