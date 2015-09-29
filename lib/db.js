'use strict';

var Collection = require('./collection');

class DB {
  constructor(flow, db) {
    this.flow = flow;
    this.db = db;
  }

  collection(name) {
    return new Collection(this.flow, this.db.collection('name'));
  }
}

module.exports = DB;
