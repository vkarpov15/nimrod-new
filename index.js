'use strict';

let common = require('./lib/common');
let DB = require('./lib/db');
let debug = require('debug')('nimrod:driver');
let mongodb = require('mongodb');

const DEFAULT_URI = 'mongodb://localhost:27017/test';

class SyncDriver {
  constructor(flow) {
    this.flow = flow;
  }

  $connect(uri) {
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
    debug(`returning proxy`);
    return { proxy: p, db: db };
  }
}

module.exports = function(flow) {
  return new SyncDriver(flow);
}

/*asyncblock(function(flow) {
  Promise.prototype.$sync = function() {
    let cb = flow.add();
    this.then(function(res) { cb(null, res) }, function(err) { cb(err); });
    return flow.wait();
  };
  console.log(0);
  var db =
    mongodb.MongoClient.connect('mongodb://localhost:27017/test').$sync();
  console.log(1);
  console.log(db.collection('test').find({}).toArray().$sync());
});*/
