'use strict';
// vim: set expandtab:
var request = require('request').defaults({ json: true });
var url = require('url');
var nub = require('nub');

function getPkgs(registry, cb) {
  request(url.resolve(registry + '/', '-/_view/allVersions?reduce=false'), function(err, res, body) {
    if (err) {
      return cb(err);
    }

    if (res.statusCode !== 200) {
      err = new Error('received non-200 status code');
      return cb(err);
    }

    cb(null, nub(body.rows.map(function(row) {
      return row.id;
    })));
  });
}

module.exports = getPkgs;
