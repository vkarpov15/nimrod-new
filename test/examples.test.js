'use strict';

const _ = require('lodash');
const assert = require('assert');
const asyncblock = require('asyncblock');
const nimrod = require('../');

const URI = 'mongodb://localhost:27017/nimrod';

describe('SyncDriver', function() {
  it('can connect and run queries', function(done) {
    asyncblock((flow) => {
      flow.errorCallback = done;

      const context = nimrod(URI, flow);
      const db = context.db;

      db.dropDatabase();
      db.test.deleteMany({});

      db.test.insertOne({ x: 1 });
      var x = db.test.find();
      assert.equal(x.length, 1);
      assert.equal(db.test.findOne().x, 1);
      done();
    });
  });

  it('listCollections()', (done) => (asyncblock((flow) => {
    flow.errorCallback = done;
    const context = nimrod(URI, flow);
    const db = context.db;

    db.dropDatabase();
    db.test.insertOne({ x: 1 });
    const collections = db.listCollections();
    assert.deepEqual(_.pluck(collections, 'name').sort(), [
      'system.indexes',
      'test'
    ]);
    done();
  })));

  it('find() cursor', done => (asyncblock((flow) => {
    flow.errorCallback = done;
    const context = nimrod(URI, flow);
    const db = context.db;

    db.dropDatabase();
    db.test.insertOne({ x: 1 });
    const cursor = db.test.find();
    assert.ok(cursor[nimrod.cursorSymbol]);
    assert.deepEqual(_.omit(cursor.next(), '_id'), { x: 1 });
    done();
  })));
});
