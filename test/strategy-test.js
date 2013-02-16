var vows = require('vows');
var assert = require('assert');
var util = require('util');
<<<<<<< Updated upstream
var url = require('url');
var YJStrategy = require('passport-yj/strategy');
=======
var YJStrategy = require('passport-yj/strategy');
console.log(YJStrategy);
>>>>>>> Stashed changes


vows.describe('YJStrategy').addBatch({
  
  'strategy': {
    topic: function() {
      return new YJStrategy({
          clientID : "kaisasak",
          redirectURL : "http://lewuathe.com",
          scope : "open_id"
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
          clientID : "kaisasak",
          redirectURL : "http://lewuathe.com",
          scope : "open_id"
      });

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

    'and display set to mobile': {
      topic: function (strategy) {
        var mockRequest = {},
            url;

        // Stub strategy.redirect()
        var self = this;
        strategy.redirect = function (location) {
          self.callback(null, location)
        };
        strategy.authenticate(mockRequest, { display: 'mobile' });
      },

      'sets authorization param to mobile': function(err, location) {
        var params = url.parse(location, true).query;
        assert.equal(params.display, 'mobile');
      }
    }
  },

  'strategy when loading user profile': {
    topic: function() {
      var strategy = new YJStrategy({
          clientID : "kaisasak",
          redirectURL : "http://lewuathe.com",
          scope : "open_id"
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        if (url == 'https://graph.facebook.com/me') {
          var body = '{"id":"500308595","name":"Jared Hanson","first_name":"Jared","last_name":"Hanson","link":"http:\\/\\/www.facebook.com\\/jaredhanson","username":"jaredhanson","gender":"male","email":"jaredhanson\\u0040example.com"}';
          callback(null, body, undefined);
        } else {
          callback(new Error('Incorrect user profile URL'));
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
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'yj');
        assert.equal(profile.id, '500308595');
        assert.equal(profile.username, 'jaredhanson');
        assert.equal(profile.displayName, 'Jared Hanson');
        assert.equal(profile.name.familyName, 'Hanson');
        assert.equal(profile.name.givenName, 'Jared');
        assert.equal(profile.gender, 'male');
        assert.equal(profile.profileUrl, 'http://www.facebook.com/jaredhanson');
        assert.lengthOf(profile.emails, 1);
        assert.equal(profile.emails[0].value, 'jaredhanson@example.com');
        assert.isUndefined(profile.photos);
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile with profileURL option': {
    topic: function() {
      var strategy = new YJStrategy({
          clientID : "kaisasak",
          redirectURL : "http://lewuathe.com",
          scope : "open_id"
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        if (url == 'https://graph.facebook.com/me?fields=id,username') {
          var body = '{"id":"500308595","name":"Jared Hanson","first_name":"Jared","last_name":"Hanson","link":"http:\\/\\/www.facebook.com\\/jaredhanson","username":"jaredhanson","gender":"male","email":"jaredhanson\\u0040example.com"}';
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
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'facebook');
        assert.equal(profile.id, '500308595');
        assert.equal(profile.username, 'jaredhanson');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
<<<<<<< Updated upstream
  'strategy when loading user profile with mapped profile fields': {
=======
    /*
  'strategy when loading user profile': {
>>>>>>> Stashed changes
    topic: function() {
      var strategy = new YJStrategy({
          clientID : "kaisasak",
          redirectURL : "http://lewuathe.com",
          scope : "open_id"

      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        if (url == 'https://graph.facebook.com/me?fields=id,username,name,last_name,first_name,middle_name,gender,link,email,picture') {
          var body = '{"id":"500308595","name":"Jared Hanson","first_name":"Jared","last_name":"Hanson","link":"http:\\/\\/www.facebook.com\\/jaredhanson","username":"jaredhanson","gender":"male","email":"jaredhanson\\u0040example.com"}';
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
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'facebook');
        assert.equal(profile.id, '500308595');
        assert.equal(profile.username, 'jaredhanson');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile with id and photos': {
    topic: function() {
      var strategy = new YJStrategy({
<<<<<<< Updated upstream
          clientID : "kaisasak",
=======
          clientID : "hoge",
          clientSecret : "fuga",
>>>>>>> Stashed changes
          redirectURL : "http://lewuathe.com",
          scope : "open_id"
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        if (url == 'https://graph.facebook.com/me?fields=id,picture') {
          var body = '{"id":"500308595","picture":"http:\/\/profile.ak.fbcdn.net\/hprofile-ak-prn1\/example.jpg"}';
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
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'facebook');
        assert.equal(profile.photos[0].value, 'http://profile.ak.fbcdn.net/hprofile-ak-prn1/example.jpg');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile with id and photos using October 2012 Breaking Changes': {
    topic: function() {
      var strategy = new YJStrategy({
<<<<<<< Updated upstream
          clientID : "kaisasak",
          redirectURL : "http://lewuathe.com",
          scope : "open_id"
=======
        consumerKey: 'ABC123',
        consumerSecret: 'secret',
        skipExtendedUserProfile: true
>>>>>>> Stashed changes
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        if (url == 'https://graph.facebook.com/me?fields=id,picture') {
          var body = '{"id":"500308595","picture":{"data":{"url":"http:\/\/profile.ak.fbcdn.net\/hprofile-ak-prn1\/example.jpg","is_silhouette":false}}}';
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
          strategy.userProfile('access-token', done);
        });
      },
      
      'should not error' : function(err, req) {
        assert.isNull(err);
      },
      'should load profile' : function(err, profile) {
        assert.equal(profile.provider, 'facebook');
        assert.equal(profile.photos[0].value, 'http://profile.ak.fbcdn.net/hprofile-ak-prn1/example.jpg');
      },
      'should set raw property' : function(err, profile) {
        assert.isString(profile._raw);
      },
      'should set json property' : function(err, profile) {
        assert.isObject(profile._json);
      },
    },
  },
  
  'strategy when loading user profile and encountering an error': {
    topic: function() {
      var strategy = new YJStrategy({
<<<<<<< Updated upstream
          clientID : "kaisasak",
          redirectURL : "http://lewuathe.com",
          scope : "open_id"
      },
      function() {});
      
      // mock
      strategy._oauth2.getProtectedResource = function(url, accessToken, callback) {
        callback(new Error('something-went-wrong'));
      }
      
=======
          consumerKey: 'ABC123',
          consumerSecret: 'secret'
        },
        function() {}
      );
>>>>>>> Stashed changes
      return strategy;
    },
    
    'when told to load user profile': {
      topic: function(strategy) {
        var self = this;
        function done(err, profile) {
          self.callback(err, profile);
        }
        
        process.nextTick(function () {
          strategy.userProfile('access-token', done);
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
  */
  
}).export(module);
