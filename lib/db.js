'use strict';

const Collection = require('./collection');
const common = require('./common');

class DB {
  constructor(flow, db) {
    this.flow = flow;
    this.db = db;
  }

  collection(name) {
    return new Collection(this.flow, this.db.collection(name));
  }

  listCollections() {
    const cursor = this.db.listCollections();
    const promise = cursor.toArray.apply(cursor, arguments);
    return common.$sync(promise, this.flow);
  }

  dropDatabase() {
    return common.$sync(this.db.dropDatabase(), this.flow);
  }
}

module.exports = DB;
