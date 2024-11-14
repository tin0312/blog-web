const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(102).send("User not authenticated");
  }
  next();
};

export default isAuthenticated;
