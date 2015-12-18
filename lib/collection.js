'use strict';

const common = require('./common');
const cursor = require('./cursor');

const CURSOR_METHODS = [
  'find'
];

const CRUD_METHODS = [
  'aggregate',
  'bulkWrite',
  'count',
  'distinct',
  'deleteOne',
  'deleteMany',
  'findOne',
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

CURSOR_METHODS.forEach(method => {
  Collection.prototype[method] = function() {
    const _cursor = this.collection[method].apply(this.collection, arguments);
    return cursor(_cursor, this.flow);
  };
});

CRUD_METHODS.forEach(method => {
  Collection.prototype[method] = function() {
    const promise = this.collection[method].apply(this.collection, arguments);
    return common.$sync(promise, this.flow);
  };
});

module.exports = Collection;
