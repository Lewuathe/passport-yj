var vow = require('vows');
var assert = require('assert');
var util = require('util');
var passport_yj = require('../lib/passport-yj');

vow.describe('passport-yj').addBatch({
  'module': {
    'should report a version': function () {
      assert.isString(passport_yj.version);
    }
  }
}).export(module);
