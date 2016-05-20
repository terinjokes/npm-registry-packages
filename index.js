'use strict';
var url = require('url');
var hyperquest = require('hyperquest');
var bl = require('bl');
var nub = require('nub');

function parse(data) {
  var parsed = {
    val: null,
    err: null
  };

  try {
    parsed.val = JSON.parse(data);
  } catch (err) {
    parsed.err = err;
  }

  return parsed;
}

function getPkgs(registry, cb) {
  var req = hyperquest({
    uri: url.resolve(registry + '/', '-/_view/allVersions?reduce=false')
  });

  req.pipe(bl(function (err, data) {
    if (err) {
      cb(err);
      return;
    }

    if (req.response.statusCode !== 200) {
      cb(new Error('received non-200 status code'));
      return;
    }

    var parsed = parse(String(data));

    if (parsed.err !== null) {
      cb(parsed.err);
      return;
    }

    if (!Array.isArray(parsed.val.rows)) {
      cb(null, []);
      return;
    }

    cb(null, nub(parsed.val.rows.map(function (row) {
      return row.id;
    })));
  }));
}

module.exports = getPkgs;
