import Yahoo from './worker/Yahoo';
import Xueqiu from './worker/Xueqiu';

import Constants from './utils/Constants';

const xueqiu = new Xueqiu();
const yahoo = new Yahoo();

const workers = {
  xueqiu: new Xueqiu(),
  yahoo: new Yahoo()
};

const currentWorker = 'xueqiu';

const Fetcher = {
  getRealtime(symbolArr) {
    if ((symbolArr || []).length < 1) {
      throw Error('please provide at least 1 stock symbol.');
    }
    workers[currentWorker].getRealtime(symbolArr).then((response) => {
      console.log('realtime->', response);
    });
  },

  getKchart(symbol, period, begin, end) {
    // TODO check arguments
    if (Constants.KchartPeriod.indexOf(period) < 0) {
      console.error('peroid is wrong, must be one of: ' + Constants.KchartPeriod.join(', '));
      return;
    }
    workers[currentWorker].getKchart(symbol, period, begin, end).then((response) => {
      console.log('kchart->', response);
    });
  }
};

export default Fetcher;
