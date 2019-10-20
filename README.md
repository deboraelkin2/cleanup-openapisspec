# cleanup-openapispec

Simple tool for cleaning up Open API specifications.

Currently supports the following command:

* removeUnusedDefinitions: Removes any definitions not directly or indirectly referenced by parameters or responses in the resources section.

## Installation

`apigeetool` is a Node.js module and you can install it using npm:

`npm install -g apigeetool`

*NOTE*: The `-g` option places the apigeetool command in your PATH. On "\*nix"-based machines, `sudo` may be required with the `-g` option. If you do not use `-g`, then you need to add the apigeetool command to your PATH manually. 
