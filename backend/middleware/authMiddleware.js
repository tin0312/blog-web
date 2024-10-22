function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
}

export default isAuthenticated;
