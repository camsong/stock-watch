import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import Stock from './models/stock';

const app = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Stock watch server');
})

// get list of my stocks
app.get('/stocks.json', (req, res) => {
  console.log('list...');
  Stock.fetchAll().then((result) => {
    res.json(result);
  }, (err) => {
    res.json({
      code: 1,
      error_message: err
    });
  });
});

// add a stock, post ?symbol=BABA
app.post('/stocks.json', (req, res) => {
  const { expectPrice, note } = req.body;
  const symbol = req.body.symbol.toUpperCase();

  // add the symbol to lists;
  if (Stock.findBySymbol(symbol)) {
    res.json({
      code: 2,
      error_message: 'Stock already existed with symbol ' + symbol
    });
    return;
  }

  let stock = Stock.create({symbol: symbol, expectPrice: expectPrice, note: note});
  // retun the realtime data of that stock
  stock.fetchRealtime().then((result) => {
    res.json(result);
  }, (err) => {
    res.json({
      code: 1,
      error_message: err
    });
  });
});

// show detail of a stock
app.get('/stock/:symbol.json', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  // add the symbol to lists;
  console.log('show...', symbol);
  let stock = Stock.findBySymbol(symbol);
  if (stock) {
    stock.fetchKChart().then((result) => {
      res.json(result);
    }, (err) => {
      res.json({
        code: 1,
        error_message: err
      });
    });
  } else {
    res.json({
      code: 2,
      error_message: 'Stock with symbol ' + symbol + ' does not exist'
    });
  }
});

// update of a stock
app.put('/stock/:symbol.json', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const { expectPrice, note } = req.body;
  // add the symbol to lists;
  console.log('update...', symbol);

  let stock = Stock.findBySymbol(symbol);

  if (stock) {
    stock.update({
      expectPrice: expectPrice,
      note: note
    });
    stock.fetchRealtime().then((result) => {
      res.json(result);
    }, (err) => {
      res.json({
        code: 1,
        error_message: err
      });
    });
  } else {
    res.json({
      code: 2,
      error_message: 'Stock with symbol ' + symbol + ' does not exist'
    });
  }
});

// show detail of a stock
app.delete('/stock/:symbol.json', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  // add the symbol to lists;
  console.log('delete...', symbol);

  let stock = Stock.findBySymbol(symbol);
  if (stock) {
    stock.del();
    res.json({
      code: 0,
      message: 'success'
    });
  } else {
    res.json({
      code: 1,
      error_message: 'Stock with symbol ' + symbol + ' does not exist'
    });
  }
});

app.listen(8000, () => {
  console.log('Server start at port 8000');
});