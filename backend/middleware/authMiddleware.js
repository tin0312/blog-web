function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`${process.env.FRONTEND_URL}/login`);
}

export default isAuthenticated;
