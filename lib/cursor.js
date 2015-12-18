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

  const props = {
    length: () => {
      return common.$sync(cursor.count(), flow);
    }
  };

  let res = Proxy.create({
    get: function(proxy, key) {
      if (key === SYMBOL) {
        return true;
      }
      if (props[key]) {
        return props[key]();
      }
      return _cursor[key];
    }
  });

  return res;
};

module.exports.SYMBOL = SYMBOL;
