/* jshint node: true  */
'use strict';

var options = require('./options');

function CleanupOpenAPISpec() {
}

module.exports = CleanupOpenAPISpec;

CleanupOpenAPISpec.getPromiseSDK = function(){
  return require('./promisesdk')
};

CleanupOpenAPISpec.removeUnusedDefs = function(opts, cb) {
  var cmd = require('./commands/remove-unused-defs');
  runCommand(cmd, opts, cb);
};

function runCommand(cmd, opts, cb) {
  options.validate(opts, cmd.descriptor, function(err) {
    if (err) {
      cb(err);
      return;
    }
    cmd.run(opts, cb);
  });
}
