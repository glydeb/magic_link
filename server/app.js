var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

var passport = require('./strategies/userStrategy');
var session = require('express-session');

// Route includes
var index = require('./routes/index');
var user = require('./routes/user');
var register = require('./routes/register');
var landing = require('./routes/landing');
var verification = require('./routes/verification');
var post = require('./routes/post');
var badges = require('./routes/badges');
var aws = require('./routes/s3');



// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Catch direct requests and make sure the user can view this page
// app.use('/views/user.html', user);

// Serve back static files
app.use(express.static(path.join(__dirname, './public')));

// Passport Session Configuration //
app.use(session({
  secret: 'secret',
  key: 'user',
  resave: 'true',
  saveUninitialized: false,
  cookie: { maxage: 60000, secure: false }
}));

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());
/* FROM passport Auth0 strategy github
app.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/");
  }
);

app.get('/login',
  passport.authenticate('auth0', {}), function (req, res) {
  res.redirect("/");
});

*/

// Routes
app.use('/s3', aws);
app.use('/verification', verification);
app.use('/register', register);
app.use('/user', user);
app.use('/landing', landing);
app.use('/post', post);
app.use('/badges', badges);
app.use('/*', index);


// Mongo Connection //
var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bighearted';
var mongoDB = mongoose.connect(mongoURI).connection;

mongoDB.on('error', function (err) {
  if (err) {
    console.log('MONGO ERROR: ', err);
  }

  res.sendStatus(500);
});

mongoDB.once('open', function () {
  console.log('Connected to Mongo, meow!');
});

// App Set //
app.set('port', (process.env.PORT || 5000));

// Listen //
app.listen(app.get('port'), function () {
  console.log('Listening on port: ' + app.get('port'));
});
