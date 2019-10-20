/* jshint node: true  */
'use strict';


var DefaultDescriptor = {
  help: {
    name: 'Help',
    shortOption: 'h',
    toggle: true
  },
  verbose: {
    name: 'Verbose',
    shortOption: 'V',
    toggle: true
  }
};

module.exports.defaultDescriptor = function(opts) {
  var o = {};
  var n;
  for (n in DefaultDescriptor) {
    o[n] = DefaultDescriptor[n];
  }
  for (n in opts) {
    o[n] = opts[n];
  }
  return o;
};

var DefaultOptions = {
};

module.exports.defaultOptions = function(opts) {
  for (var n in DefaultOptions) {
    if (!opts[n]) {
      opts[n] = DefaultOptions[n];
    }
  }
  
};
