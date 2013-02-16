var vow = require('vows');
var assert = require('assert');
var util = require('util');
var passport_yj = require('passport-yj');

vow.describe('passport-yj').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(passport_yj.version);
    },
  },
  
}).export(module);
