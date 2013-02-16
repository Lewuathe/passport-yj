var vow = require('vows');
var assert = require('assert');
var util = require('util');
var twitter = require('passport-yj');

vow.describe('passport-yj').addBatch({
  
  'module': {
    'should report a version': function (x) {
      assert.isString(twitter.version);
    },
  },
  
}).export(module);
