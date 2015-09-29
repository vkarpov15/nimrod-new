'use strict';

let common = require('./common');

class Collection {
  constructor(flow, collection) {
    this.flow = flow;
    this.collection = collection;
  }

  find(query) {
    return common.$sync(this.collection.find(query).toArray(), this.flow);
  }

  insertOne(doc) {
    return common.$sync(this.collection.insert(doc), this.flow);
  }

  removeOne(query) {
    return common.$sync(this.collection.removeOne(doc), this.flow);
  }
}

module.exports = Collection;
