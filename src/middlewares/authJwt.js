const passport = require("passport");
const APIError = require("../utils/APIError.js");
const status = require("http-status");
exports.authJwt = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user) {
    if (user) return next(new APIError(err?.message, status.UNAUTHORIZED));
    req.user = user;
    next();
  })(req, res, next);
};
