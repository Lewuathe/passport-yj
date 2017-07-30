passport-yj - OAuth2.0 npm package for Yahoo! JAPAN YConnect
===========

[![Build Status](https://travis-ci.org/Lewuathe/passport-yj.png?branch=master)](https://travis-ci.org/Lewuathe/passport-yj) [![npm](https://img.shields.io/npm/dt/express.svg)](https://www.npmjs.com/package/passport-yj)


[![NPM](https://nodei.co/npm/passport-yj.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/passport-yj/)


## Introduction

[Passport](http://passportjs.org/) strategy for authenticating with [YConnect](http://developer.yahoo.co.jp/yconnect/) using the OAuth 2.0 API

This module can be used with passport in Node.js.
You can integrate into below applications or frameworks.
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

    $ npm install passport-yj

## Usage

### Configuration Strategy

This YConnect passport module requires your application' id.
You can get this id from [YConnect admin](http://developer.yahoo.co.jp/start/)

### Authorization Endpoint

    var passport = require('passport');

	passport.use(new YJStrategy({
	    clientID     : <YAHOO_JAPAN_APP_ID>,
		clientSecret : <YAHOO_JAPAN_APP_SECRET>,
		callbackURL  : <CALL_BACK_URL>,
	}, function(accessToken, refreshtoken, profile, done){
	    // With this accessToken you can access user profile data.
		// In the case that accessToken is expired, you should
		// regain it with refreshToken. So you have to keep these token
		// safely. done will get user profile data such as openid in YConnect
	});


### Token Endpoint

With this module, you don't have to do anything to get accessToken.
As you see above, you have already obtain accessToken and refreshToken.
So this process is not required with this module.

### License

MIT License. Please see the LICENSE file for details.
