function isAuthenticated(req, res, next) {
  console.log("Is user authenticated", req.isAuthenticated());
  console.log("User data retrieved", req.user);
  if (req.isAuthenticated()) {
    return next();
  }
}

export default isAuthenticated;
