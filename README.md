Stock Watch
===========

A simple tool for fetching realtime and historical k-chart data of global stock markets including China.

[![Build Status](https://travis-ci.org/camsong/stock-watch.svg)](https://travis-ci.org/camsong/stock-watch)


### Installation

```
npm install stock-watch
```

If you would like to use in command line, install with `-g` option then you will got global `sw` command.

### Using in Command line

```shell
# fetch data by stock symbol
sw BABA
```

### Using as a node module
```js
import Fetcher from 'stock-watch';

// get realtime data
Fetcher.getRealtime('BABA').then((result) => {
  // handle with result
}, (err) => {
  console.log('Oops, got an error', err)
});

// get historical k-chart data
Fetcher.getKChart('baba', 'day', new Date(2014, 11, 1).getTime(), Date.now()).then((result) => {
  // handle with result
}, (err) => {
  done(err);
});

```

### Testing

All test tasks can be run via `npm run [task name]`.

```shell
# run test watch
npm run test

# run test in watch mode
npm run test:watch

# run test with coverage report
npm run test:cov
```


### License

MIT