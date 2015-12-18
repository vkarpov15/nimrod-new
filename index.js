'use strict';

const DB = require('./lib/db');
const common = require('./lib/common');
const debug = require('debug')('nimrod:driver');
const mongodb = require('mongodb');

const DEFAULT_URI = 'mongodb://localhost:27017/test';

module.exports = function(uri, flow) {
  debug(`connecting to ${uri || DEFAULT_URI}`);
  let _db = common.$sync(mongodb.MongoClient.connect(uri || DEFAULT_URI),
    flow);
  debug(`connected`);
  let db = new DB(flow, _db);

  let p = Proxy.create({
    get: function(proxy, key) {
      if (db[key]) {
        return db[key];
      }
      return db.collection(key);
    }
  });

  return {
    db: p,
    setFlow: function(flow) {
      db.flow = flow;
    }
  };
};

module.exports.cursorSymbol = require('./lib/cursor').SYMBOL;
console.log(module.exports.cursorSymbol);
