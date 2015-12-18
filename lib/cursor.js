'use strict';

const common = require('./common');

// Workaround because proxies and symbols don't play nice together
const SYMBOL = '$isNimrodCursor';
const WRAPPED_METHODS = ['next', 'hasNext'];

function Cursor(cursor, flow) {
  this.cursor = cursor;
  this.flow = flow;
}

WRAPPED_METHODS.forEach(function(method) {
  Cursor.prototype[method] = function() {
    return common.$sync(this.cursor[method].apply(this.cursor, arguments),
      this.flow);
  };
});

module.exports = (cursor, flow) => {
  const _cursor = new Cursor(cursor, flow);

  Object.defineProperty(_cursor, 'length', {
    enumerable: true,
    configurable: true,
    get: () => common.$sync(cursor.count(), flow)
  });

  Object.defineProperty(_cursor, SYMBOL, {
    enumerable: true,
    configurable: false,
    writable: false,
    value: true
  });

  return _cursor;
};

module.exports.SYMBOL = SYMBOL;
