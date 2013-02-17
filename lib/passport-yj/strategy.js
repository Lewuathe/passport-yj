/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;

/**
 * `Strategy` constructor.
 *
 * The Yahoo JAPAN authentication strategy authenticates requests by delegating to
 * Yahoo JAPAN using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your Yahoo JAPAN application's App ID
 *   - `clientSecret`  your Yahoo JAPAN application's App Secret
 *   - `callbackURL`   URL to which Yahoo JAPAN will redirect the user after granting authorization
 *
 * Examples:
 *
 *     passport.use(new  YJStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret',
 *         callbackURL: 'https://www.example.net/auth/yj/callback',
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  console.log('-- constructor begin');

  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://auth.login.yahoo.co.jp/yconnect/v1/authorization';
  options.tokenURL = options.tokenURL || 'https://auth.login.yahoo.co.jp/yconnect/v1/token';
  options.scopeSeparator = options.scopeSeparator || ' ';

  OAuth2Strategy.call(this, options, verify);
  this.name = 'yj';
  this._profileURL = options.profileURL || 'https://userinfo.yahooapis.jp/yconnect/v1/attribute';
  this._profileFields = options.profileFields || null;

  console.log('-- constructor end');
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Return extra Yahoo JAPAN specific parameters to be included in the authorization
 * request.
 *
 * Options:
 *  - `display`  Display mode to render dialog, { `page`, `touch` }.
 *  - `prompt`   @todo
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
  var params = {};

  if (options.display) {
    params['display'] = options.display;
  }
  if (options.prompt) {
    params['prompt'] = options.prompt;
  }
  return params;
};

/**
 * Retrieve user profile from Yahoo JAPAN.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `yj`
 *   - `id`               the user's Yahoo JAPAN ID
 *   - `username`         the user's Yahoo JAPAN username
 *   - `displayName`      the user's full name
 *   - `name.familyName`  the user's last name
 *   - `name.givenName`   the user's first name
 *   - `name.middleName`  the user's middle name
 *   - `gender`           the user's gender: `male` or `female`
 *   - `profileUrl`       the URL of the profile for the user on Yahoo JAPAN
 *   - `emails`           the proxied or contact email address granted by the user
 *
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
  var url = this._profileURL + '?schema=openid';

  this._oauth2.getProtectedResource(url, accessToken, function (err, body, res) {

    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      var json = JSON.parse(body);
      console.log("----------------------------response json-----------------------");
      console.log(json);

      var profile = { provider: 'yj' };
      profile.user_id = json.user_id;
      profile.name    = json.name;
      profile.given_name = json.given_name;
      profile['given_name#ja-Kana-JP'] = json['given_name#ja-Kana-JP'];
      profile['given_name#ja-Hani-JP'] = json['given_name#ja-Hani-JP'];
      profile.family_name = json.family_name;
      profile['family_name#ja-Kana-JP'] = json['family_name#ja-Kana-JP'];
      profile['family_name#ja-Hani-JP'] = json['family_name#ja-Hani-JP'];
      profile.gender = json.gender;
      profile.birtyday = json.birtyday;
      profile.locale = json.locale;
      profile.email = json.email;
      profile.email_verified = json.email_verified;
      profile.address = {
        locality: json.address.locality,
        region:   json.address.region,
        postal_code: json.postal_code,
        country: json.address.country
      };

      profile._raw  = body;
      profile._json = json;

      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
