var vows   = require('vows')
  , assert = require('assert')
  , util   = require('util')
  , url    = require('url');
var YJStrategy = require('../lib/passport-yj/strategy')
  , Config = require('../config');

// constant
var PROFILE_PAGE = 'https://userinfo.yahooapis.jp/yconnect/v1/attribute?schema=openid';

// dummy data
var CLIENT_ID     = Config.client_id;
var CLIENT_SECRET = Config.client_secret;
var REDIRECT_URI  = Config.redirect_uri;

// test cases
vows.describe('YJStrategy').addBatch({
  'strategy': {
    topic: function() {
      return new YJStrategy({
          clientID    : CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          redirectURL : REDIRECT_URI
      },
      function() {});
    },

    'should be named yj': function (strategy) {
      assert.equal(strategy.name, 'yj');
    },
  },

  'strategy when redirecting for authorization': {
    topic: function () {
      var strategy = new YJStrategy({
          clientID    : CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          redirectURL : REDIRECT_URI
      }, function() {});
      return strategy;
    },

    'and display not set': {
      topic: function (strategy) {
        var mockRequest = {},
            url;

        // Stub strategy.redirect()
        var self = this;
        strategy.redirect = function (location) {
          self.callback(null, location)
        };
        strategy.authenticate(mockRequest);
      },

      'does not set authorization param': function(err, location) {
        var params = url.parse(location, true).query;
        assert.isUndefined(params.display);
      }
    },

    'and display set to touch': {
      topic: function (strategy) {
        var mockRequest = {},
            url;

        // Stub strategy.redirect()
        var self = this;
        strategy.redirect = function (location) {
          self.callback(null, location)
        };
        strategy.authenticate(mockRequest, { display: 'touch' });
      },

      'sets authorization param to touch': function(err, location) {
        var params = url.parse(location, true).query;
        assert.equal(params.display, 'touch');
      }
    }
  },

  'strategy when loading user profile': {
    topic: function() {
      var strategy = new YJStrategy({
          clientID    : CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          redirectURL : REDIRECT_URI
      },
      function() {});

      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        if (url == PROFILE_PAGE) {
          var body = '{"name":"\u5c71\u53e3\u6d0b\u5e73","given_name":"\u6d0b\u5e73","given_name#ja-Kana-JP":"\u30e8\u30a6\u30d8\u30a4","given_name#ja-Hani-JP":"\u6d0b\u5e73","family_name":"\u5c71\u53e3","family_name#ja-Kana-JP":"\u30e4\u30de\u30b0\u30c1","family_name#ja-Hani-JP":"\u5c71\u53e3","locale":"ja-JP","gender":"male"}';
          callback(null, body, undefined);
        } else {
          callback(new Error('Incorrect user profile URL: ' + url));
        }
      }
      return strategy;
    },

    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }

        process.nextTick(function () {
          strategy.userProfile('access_token', done);
        });
      },

      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'yj');
        assert.equal(profile.displayName, "\u5c71\u53e3\u6d0b\u5e73");
        var name = profile.name;
        assert.equal(name.givenName, "\u6d0b\u5e73");
        assert.equal(name['given_name#ja-Kana-JP'], "\u30e8\u30a6\u30d8\u30a4");
        assert.equal(name['given_name#ja-Hani-JP'], "\u6d0b\u5e73");
        assert.equal(name.familyName, "\u5c71\u53e3");
        assert.equal(name["family_name#ja-Kana-JP"], "\u30e4\u30de\u30b0\u30c1");
        assert.equal(name["family_name#ja-Hani-JP"], "\u5c71\u53e3");
        assert.equal(profile.locale, "ja-JP");
        assert.equal(profile.gender, "male");
      },
      'should set raw property' : function(err, profile) {
        assert.isDefined(profile);
        assert.ok('_raw' in profile);
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isDefined(profile);
        assert.ok('_json' in profile);
        assert.isObject(profile._json);
      },
    },
  },

  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new YJStrategy({
          clientID    : CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          redirectURL : REDIRECT_URI
      },
      function() {});

      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      return strategy;
    },

    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }

        process.nextTick(function () {
          strategy.userProfile('access_token', done);
        });
      },

      'should error' : function(err, req) {
        assert.isNotNull(err);
      },
      'should wrap error in InternalOAuthError' : function(err, req) {
        assert.equal(err.constructor.name, 'InternalOAuthError');
      },
      'should not load profile' : function(err, profile) {
        assert.isUndefined(profile);
      },
    },
  },
}).export(module);
