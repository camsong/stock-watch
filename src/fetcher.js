import Yahoo from './worker/yahoo';
import Xueqiu from './worker/xueqiu';
import Constants from './utils/Constants';

const xueqiu = new Xueqiu();
const yahoo = new Yahoo();

const workers = {
  xueqiu: new Xueqiu(),
  yahoo: new Yahoo()
};

const Fetcher = {
  currentWorker: 'xueqiu',

  // symbolArr can be an array of symbols or a single symbol string.
  getRealtime(symbol1, symbol2) {
    let symbolArr = [].slice.call(arguments);
    if ((symbolArr || []).length < 1) {
      throw Error('please provide at least 1 stock symbol.');
    }
    return workers[Fetcher.currentWorker].getRealtime(symbolArr);
  },

  getKChart(symbol, period, begin, end) {
    // TODO check arguments
    if (Constants.KchartPeriod.indexOf(period) < 0) {
      console.error('peroid is wrong, must be one of: ' + Constants.KchartPeriod.join(', '));
      return;
    }
    return workers[Fetcher.currentWorker].getKChart(symbol, period, begin, end)
  }
};

export default Fetcher;
