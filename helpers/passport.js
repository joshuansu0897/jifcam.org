var passport = require("passport");
var Strategy = require("passport-local");
var passportJWT = require("passport-jwt");
var UserModel = require("../models/users");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const JWT_SECRET_KEY = process.env.AUTH_SECRET_KEY || "jifcam-node";

exports.initPassport = function() {
  passport.use(
    new Strategy(function(username, password, done) {
      // database dummy - find user and verify password

      console.log("initPassport Strategy", username, password);
      let dbModel = new UserModel();
      dbModel
        .checkCredantial(username, password)
        .then(user => {
          done(null, user);
        })
        .catch(err => {
          done(null, false);
        });
    })
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET_KEY
      },
      function(jwtPayload, callback) {
        //find the user in db if needed
        let dbModel = new UserModel();
        dbModel
          .one(jwtPayload._id)
          .then(user => {
            callback(null, user);
          })
          .catch(err => {
            callback(err, null);
          });
      }
    )
  );

  return passport;
};
