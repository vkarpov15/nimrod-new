'use strict';

const common = require('./common');

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

  return Proxy.create({
    get: function(proxy, key) {
      if (props[key]) {
        return props[key]();
      }
      return _cursor[key];
    }
  });
};
