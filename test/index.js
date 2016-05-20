'use strict';
/* eslint-disable camelcase */
var includes = require('array-includes');
var mocha = require('mocha');
var nock = require('nock');
var assert = require('power-assert');
var getPkgs = require('../');

var describe = mocha.describe;
var it = mocha.it;

nock.enableNetConnect();

describe('getPkgs', function () {
  it('should parse registry response', function (done) {
    nock('https://registry.npmjs.cf')
      .get('/-/_view/allVersions')
      .query({reduce: 'false'})
      .reply(200, {
        total_rows: 5,
        offset: 0,
        rows: [
          {id: 'terinjokes', key: ['1.0.0', 'terinjokes']},
          {id: 'terinjokes', key: ['2.0.0', 'terinjokes']},
          {id: 'smart-private-npm', key: ['1.0.0', 'smart-private-npm']},
          {id: 'browserify', key: ['13.0.0', 'browserify']},
          {id: 'npm', key: ['4.0.0', 'npm']}
        ]
      });

    getPkgs('https://registry.npmjs.cf', function (err, pkgs) {
      assert(err === null);
      assert(pkgs.length === 4);
      assert.ok(includes(pkgs, 'terinjokes'));
      assert.ok(includes(pkgs, 'smart-private-npm'));
      assert.ok(includes(pkgs, 'browserify'));
      assert.ok(includes(pkgs, 'npm'));
      done();
    });
  });

  it('should give an empty array if no packages are published', function (done) {
    nock('https://registry.npmjs.cf')
      .get('/-/_view/allVersions')
      .query({reduce: 'false'})
      .reply(200, {
        total_rows: 5,
        offset: 0,
        rows: false
      });

    getPkgs('https://registry.npmjs.cf', function (err, pkgs) {
      assert(err === null);
      assert(pkgs.length === 0);
      done();
    });
  });

  it('should error for 404', function (done) {
    nock('https://registry.npmjs.cf')
      .get('/-/_view/allVersions')
      .query({reduce: 'false'})
      .reply(404);

    getPkgs('https://registry.npmjs.cf', function (err, pkgs) {
      assert(err instanceof Error);
      assert(pkgs === undefined);
      done();
    });
  });

  it('should error for invalid JSON', function (done) {
    nock('https://registry.npmjs.cf')
      .get('/-/_view/allVersions')
      .query({reduce: 'false'})
      .reply(200, '{"total_rows": 5');

    getPkgs('https://registry.npmjs.cf', function (err, pkgs) {
      assert(err instanceof Error);
      assert(pkgs === undefined);
      done();
    });
  });
});
