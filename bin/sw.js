#!/usr/bin/env node

'use strict';

require('babel/register');
var Fetcher = require('../src/fetcher.js');
var userArgs = process.argv.splice(2);
Fetcher.getKchart('baba', 'wek', new Date(2014, 11, 1).getTime(), new Date().getTime());
Fetcher.getRealtime(userArgs);
