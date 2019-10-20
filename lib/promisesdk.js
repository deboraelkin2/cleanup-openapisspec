/* jshint node: true  */
'use strict';

var options = require('./options');
var q = require('q')

var DefaultDefaults = {};

function ApigeeTool(defaults) {
  this.defaults = (defaults ? defaults : DefaultDefaults);
}

module.exports = ApigeeTool;

ApigeeTool.defaults = function(newDefaults) {
  var tool= new ApigeeTool(newDefaults);
  return tool;
};

ApigeeTool.removeUnusedDefs = function(opts) {
  var cb = q.defer()
  var cmd = require('./commands/remove-unused-defs');
  runCommand(cmd, opts, cb);
  return cb.promise
};


function runCommand(cmd, opts, cb) {
  options.validate(opts, cmd.descriptor, function(err) {
    if (err) {
      cb.reject(err)
      return;
    }
    cmd.run(opts, function(runerr,response){
      if(runerr){cb.reject(runerr)}
      else { cb.resolve(response)}
    });
  });
}
