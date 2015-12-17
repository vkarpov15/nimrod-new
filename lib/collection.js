'use strict';

const common = require('./common');

const CRUD_METHODS = [
  'aggregate',
  'bulkWrite',
  'count',
  'distinct',
  'deleteOne',
  'deleteMany',
  'insertOne',
  'insertMany',
  'replaceOne',
  'updateOne',
  'updateMany'
];

function Collection(flow, collection) {
  this.flow = flow;
  this.collection = collection;
}

Collection.prototype.find = function(query) {
  return common.$sync(this.collection.find(query).toArray(), this.flow);
};

CRUD_METHODS.forEach(function(method) {
  Collection.prototype[method] = function() {
    const promise = this.collection[method].apply(this.collection, arguments);
    return common.$sync(promise, this.flow);
  };
});

module.exports = Collection;
