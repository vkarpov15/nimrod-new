'use strict';

let asyncblock = require('asyncblock');
let debug = require('debug')('nimrod:bin');
let driver = require('../index');
let repl = require('repl');
let vm = require('vm');

asyncblock(function(flow) {
  flow.errorCallback = function(error) {
    console.error(`Fatal: ${error.toString()}`);
    process.exit(1);
  };

  let interfaces = driver(flow).$connect();
  global.db = interfaces.db;

  let replServer = repl.start({
    prompt: 'nimrod> ',
    ignoreUndefined: true,
    eval: function(cmd, context, filename, callback) {
      asyncblock(function(flow) {
        flow.errorCallback = function(error) {
          console.error(error.toString());
        };

        debug(`got cmd ${cmd}`);
        interfaces.db.flow = flow;
        let context = vm.createContext({ db: interfaces.proxy });
        let result = vm.runInContext(cmd, context);
        debug(`got result ${result}`);
        return callback(null, result);
      });
    }
  });

  replServer.on('exit', function() {
    process.exit(0);
  });
});
