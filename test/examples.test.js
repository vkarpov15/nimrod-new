'use strict';

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

      db.test.deleteMany({});

      db.test.insertOne({ x: 1 });
      var x = db.test.find();
      assert.equal(x.length, 1);
      done();
    });
  });
});
