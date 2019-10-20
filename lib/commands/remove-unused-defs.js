/* jshint node: true  */
'use strict';

var fs        = require('fs');
const YAML = require('yaml');

var defaults = require('../defaults');

var descriptor = defaults.defaultDescriptor({
    input: {
        name: 'Input',
        shortOption: 'i',
        required: true,
        prompt: true
      },
      output: {
        name: 'Output',
        shortOption: 'o',
        required: true,
        prompt: true
      },
});
module.exports.descriptor = descriptor;

module.exports.run = function(opts, cb) {
  var uri;

  // Read Open API Spec input file

  var origSpecStr = fs.readFileSync(opts.input).toString();
  console.log("Read:");
  console.log("------");
//   console.log(origSpecStr);
  console.log("------");
  
  var origSpec = YAML.parse(origSpecStr);

  console.log("Converted to:");
  console.log("------");
//   console.log(JSON.stringify(origSpec));
  console.log("------");

  var listOfUsedDefs = [];
  var curPathAndVerb;
  
  // Iterate over all paths and their verbs
  for (var curPath in origSpec.paths) {
      console.log("curPath = " + curPath);
      for (var curVerb in origSpec.paths[curPath]) {
        console.log("curVerb = " + curVerb);
        curPathAndVerb = origSpec.paths[curPath][curVerb];
        // console.log("The object for curPath and curVerb: " + JSON.stringify(curPathAndVerb));
        // Iterate over parameters
        for (var k = 0; k < curPathAndVerb.parameters.length; k++) {
            addDefinitionIfObjectReferencesIt(curPathAndVerb.parameters[k], listOfUsedDefs);
        }
        // Iterate over responses
        for (var curResponse in curPathAndVerb.responses) {
            addDefinitionIfObjectReferencesIt(curPathAndVerb.responses[curResponse], listOfUsedDefs);
        }

      }
  }

  // We have the initial list of definitions used. Now we need to iterate over these, and check if any of these includes
  // other references. If so, add them to the list of used defs
  
  var i = 0;
  var numbOfDefsFound = listOfUsedDefs.length;
  var curDefinition;
  var curPropertyObj;
  var regexp = /\#\/definitions\/(\w+)/g
  while(i < numbOfDefsFound) {
    curDefName = listOfUsedDefs[i];
    curDefinition = origSpec.definitions[curDefName];
    console.log("Inspecting: " + curDefName);
    var allMatches = [...JSON.stringify(curDefinition).matchAll(regexp)];
    console.log("allMatches.length = " + allMatches.length);
    for (var k = 0; k < allMatches.length; k++) {
        console.log("allMatches["+k+"] = "+ JSON.stringify(allMatches[k]));
        var defName = allMatches[k][1];  // Get the captured name
        // console.log("Matched: " + defName);
        if (!listOfUsedDefs.includes(defName)) {
            listOfUsedDefs.push(defName);
            console.log("Found " + defName);
            numbOfDefsFound++;
        }
    }
    i++;
  }

  // We now have the list of all the used definitions
  // Generate a new spec that only includes this definitions
  console.log("Used definitions:" + JSON.stringify(listOfUsedDefs));
  var newDefinitions = origSpec.definitions;
  // Iterate over all original properties, removing those not in the list of used defs
  for (var curDefName in newDefinitions) {
      if (!listOfUsedDefs.includes(curDefName)) {
          delete newDefinitions[curDefName];
      }

  }

  origSpec.definitions = newDefinitions;
  
  /// FROM HERE - Write to output
  fs.writeFileSync(opts.output,YAML.stringify(origSpec));

};

// Utility function - Check if an object (parameter or response) references a definition
// If so, add it to the list of definitions found

function addDefinitionIfObjectReferencesIt(o, listOfFoundDefs) {
    // console.log("Inspecting: " + JSON.stringify(o));
    if (o.schema && o.schema.$ref) {
        var defPath = o.schema.$ref;
        var defName = defPath.slice(defPath.lastIndexOf('/') + 1);
        if (!listOfFoundDefs.includes(defName)) {
            console.log("Found: " + defName);
            listOfFoundDefs.push(defName);
        }
    }
}
