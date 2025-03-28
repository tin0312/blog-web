const isAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({message: "Unauthorized: User not logged in"})
  }
  next();
};

export default isAuthenticated;
