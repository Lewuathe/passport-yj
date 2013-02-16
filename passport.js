var passport = require('passport')
var YJStrategy = require('./lib/passport-yj/strategy');

var $CLIENT_ID = "dj0zaiZpPUdPaTkzSnYxOFdxdyZkPVlXazliVFI0YjFrd016UW1jR285TUEtLSZzPWNvbnN1bWVyc2VjcmV0Jng9ZDE-";
var $CLIENT_SECRET = "0bb54df659ace15964420b07348aea44dae9bb74";
var $REDIRECT_URL = "http://lewuathe.com";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.initialize();
passport.session();

passport.use(new YJStrategy({
    clientID: $CLIENT_ID,
    clientSecret: $CLIENT_SECRET,
    callbackURL: $REDIRECT_URL,
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    console.log(done);
    return done(null, profile);
    /*
    User.findOrCreate(..., function (err, user) {
      done(err, user);
    });
    */
  }
));
