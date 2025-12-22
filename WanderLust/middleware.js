module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // ✅ YAHAN STORE HOGA ORIGINAL URL
    req.session.redirectUrl = req.originalUrl;
    
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;

    // ✅ CLEAN UP AFTER USING IT
    delete req.session.redirectUrl;
  }
  next();
};
