'use strict';

exports.$sync = function(promise, flow) {
  let cb = flow.add();
  promise.then(function(res) { cb(null, res) }, function(err) { cb(err); });
  return flow.wait();
};
