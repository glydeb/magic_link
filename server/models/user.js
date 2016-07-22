var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var BadgesSchema = require('./badges').schema;

// Mongoose Schema
var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  verification: { type: String, required: true },
  textnotifications: { type: Boolean, required: true },
  is_admin: { type: Boolean, required: true },
  email: { type: String, required: true },
  dgdnumber: { type: Number, required: true },
  timesflagged: { type: Number, required: true },
  active: { type: Boolean, default: true, required: true },
  image: {type: String, default:
    'https://s3.amazonaws.com/bighearted/images/multiple-users-silhouette.png'},
  firstname: String,
  lastname: String,
  phone: String,
  timezone: String,
  family_members: {type: String, default: 'Click edit to add members to your family'},
  about_us: {type: String, default: 'Click edit to write a bio about your family'},
  our_projects: {type: String, default: 'Click edit to showcase your recent projects'},
  badges: BadgesSchema,
  rewarded: {type: Boolean, default: false}

});

// Called before adding a new user to the DB. Encrypts password.
UserSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

// Used by login methods to compare login form password to DB password
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }

    callback(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
