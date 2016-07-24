var passport = require('passport');
var Auth0Strategy = require('passport-auth0'),
    passport = require('passport');

var strategy = new Auth0Strategy({
   domain:       process.env.AUTH0_DOMAIN,
   clientID:     process.env.AUTH0_CLIENT_ID,
   clientSecret: process.env.AUTH0_CLIENT_SECRET,
   callbackURL:  '/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

// Store this user's unique id in the session for later reference
// Only runs during authentication
// Stores info on req.session.passport.user
passport.serializeUser(function (user, done) {
  console.log('serialized: ', user);
  done(null, user.id);
});

// Runs on every request after user is authenticated
// Look up the user's id in the session and use it to find them in the DB for each request
// result is stored on req.user
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      done(err);
    }

    console.log('-----------------------------------------------\ndeserialized: ', user.id);
    done(null, user);
  });
});

// Does actual work of logging in
// Called by middleware stack
passport.use('local', new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'username'
}, function (req, username, password, done) {
    // mongoose stuff
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        throw err;
      }

      if (!user) {
        // user not found
        console.log('userStrategy.js :: no user found');
        return done(null, false, { message: 'Incorrect username or password.' });
      } else {
        // found active user! Now check their given password against the one stored in the DB
        user.comparePassword(password, function (err, isMatch) {
          if (err) {
            throw err;
          }

          if (isMatch) {
            // all good, populate user object on the session through serializeUser
            console.log('userStrategy.js :: all good');
            return (done(null, user));
          } else {
            // no good.
            console.log('userStrategy.js :: password incorrect');
            done(null, false, { message: 'Incorrect credentials.' });
          }
        });
      } // end else
    }); // end findOne
  } // end callback
));

module.exports = passport;
