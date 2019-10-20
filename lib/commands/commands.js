/* jshint node: true  */
'use strict';

var _ = require('underscore');
var Table = require('cli-table');

var options = require('../options');

var Commands = {
  removeUnusedDefinitions: {
    description: 'Remove unused definitions from Open API Spec',
    load: function() {
      return require('./remove-unused-defs');
    }
  }
};

module.exports.printCommandHelp = function() {
  console.error();
  console.error('Valid commands:');

  var tab = new Table(options.TableFormat);
  _.each(_.sortBy(_.pairs(Commands)), function(p) {
    tab.push([p[0].toString(), p[1].description]);
  });
  console.error(tab.toString());
};

module.exports.getCommand = function(n) {
  var command = _.findKey(Commands, function(val, key) {
      return key.toLowerCase() === n.toLowerCase();
  });
  return Commands[command]
};
