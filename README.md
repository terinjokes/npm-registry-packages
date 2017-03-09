# npm-registry-packages

[![Greenkeeper badge](https://badges.greenkeeper.io/terinjokes/npm-registry-packages.svg)](https://greenkeeper.io/)

> Fetch the packages names on an npm registry.

## Installation

Install this package from npm:

`npm install --save npm-registry-packages`

## Usage

```javascript
var getPkgs = require('npm-registry-packages');

getPkgs('http://registry.npmjs.internal/', function(err, pkgs) {
  if (err) {
    console.error(err.message);
    return;
  }

  console.log(pkgs);
});
```

The URL provided must point at the `_rewrite` design document, either via CouchDB’s vhost configuration or via the full path.
Examples include:

* http://registry.npmjs.internal/
* http://192.168.2.1/registry/_design/app/_rewrite

The callback function receives an error and an array of package names.
