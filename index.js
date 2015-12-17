'use strict';

const DB = require('./lib/db');
const common = require('./lib/common');
const debug = require('debug')('nimrod:driver');
const mongodb = require('mongodb');

const DEFAULT_URI = 'mongodb://localhost:27017/test';

class SyncDriver {
  constructor(flow) {
    this.flow = flow;
  }

  connect(uri) {
    debug(`connecting to ${uri || DEFAULT_URI}`);
    let _db = common.$sync(mongodb.MongoClient.connect(uri || DEFAULT_URI),
      this.flow);
    debug(`connected`);
    let db = new DB(this.flow, _db);

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
  }
}

module.exports = function(flow) {
  return new SyncDriver(flow);
}
