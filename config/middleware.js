const jwt = require('jsonwebtoken');
require('dotenv').config();

function authentication(req, res, next) {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (error, user) => {
        if (error) {
          console.log("Token expired");
        }
        req.user = user;
      });
    } else {
      next();
      console.log("jwt error")
    }
  }
  next();
}

function isAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    const error = new Error('Unauthorized');
    res.status(401).send({
      error: "Unauthorized"
    });
    next(error);
  }
}

module.exports = {
  authentication,
  isAuthenticated
};