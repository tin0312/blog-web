function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    message: "Unauthorized, redirect to login",
    redirectTo: `${process.env.FRONTEND_URL}/login`,
  });
}

export default isAuthenticated;
