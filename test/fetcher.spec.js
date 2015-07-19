import Fetcher from '../src/fetcher';
import { expect } from 'chai';

describe('Fetcher', () => {
  describe('Xueqiu worker', () => {
    beforeEach(() => {
      Fetcher.currentWorker = 'xueqiu';
    });

    it('should return realtime data', (done) => {
      Fetcher.getRealtime('BABA').then((result) => {
        expect(result.BABA, 'should return an object').to.be.a('object');
        expect(result.BABA.symbol, 'symbol').to.eq('BABA');
        expect(result.BABA.exchange, 'exchange').to.eq('NYSE');
        done();
      }, (err) => {
        done(err);
      });
    });

    it('should return an array of realtime data', (done) => {
      Fetcher.getRealtime('baba', 'AAPL').then((result) => {
        expect(result.BABA, 'should return an object').to.be.a('object');
        expect(result.BABA.symbol, 'symbol').to.eq('BABA');
        expect(result.BABA.exchange, 'exchange').to.eq('NYSE');

        expect(result.AAPL, 'should return an object').to.be.a('object');
        expect(result.AAPL.symbol, 'symbol').to.eq('AAPL');
        expect(result.AAPL.exchange, 'exchange').to.eq('NASDAQ');
        done();
      }, (err) => {
        done(err);
      });
    });

    it('should return KChart data', (done) => {
      Fetcher.getKChart('baba', 'day', new Date(2014, 11, 1).getTime(), Date.now()).then((result) => {
        expect(result.list, 'list').to.be.a('array');
        expect(result.list[0].time, 'time').to.eq('Mon Dec 01 00:00:00 +0800 2014');
        expect(result.list[0].open, 'open price').to.eq(110.02);
        done();
      }, (err) => {
        done(err);
      });
    })

  });

  describe('Yahoo worker', () => {
    beforeEach(() => {
      Fetcher.currentWorker = 'yahoo';
    });

    it('should return realtime data', (done) => {
      Fetcher.getRealtime('BABA').then((result) => {
        expect(result.BABA, 'should return an object').to.be.a('object');
        expect(result.BABA.symbol, 'symbol').to.eq('BABA');
        expect(result.BABA.exchange, 'exchange').to.eq('NYSE');
        
        done();
      }, (err) => {
        done(err);
      });
    });

    it('should return an array of realtime data', (done) => {
      Fetcher.getRealtime('baba', 'AAPL').then((result) => {
        expect(result.BABA, 'should return an object').to.be.a('object');
        expect(result.BABA.symbol, 'symbol').to.eq('BABA');
        expect(result.BABA.exchange, 'exchange').to.eq('NYSE');

        expect(result.AAPL, 'should return an object').to.be.a('object');
        expect(result.AAPL.symbol, 'symbol').to.eq('AAPL2');
        expect(result.AAPL.exchange, 'exchange').to.eq('NASDAQ');
        done();        
      }, (err) => {
        done(err);
      });
    });

    // it('should return KChart data', (done) => {
    //   Fetcher.getKChart('baba', 'day', new Date(2014, 11, 1).getTime(), Date.now()).then((result) => {
    //     expect(result.list, 'list').to.be.a('array');
    //     expect(result.list[0].time, 'time').to.eq('Mon Dec 01 00:00:00 +0800 2014');
    //     expect(result.list[0].open, 'open price').to.eq(110.02);
    //     done();
    //   }, (err) => {
    //     done(err);
    //   });
    // })
  });
});