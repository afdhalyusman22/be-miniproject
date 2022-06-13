const jwt = require('jsonwebtoken');
require('dotenv').config();

const AuditTrail = require('../models/AuditTrail');

function authentication(req, res, next) {
  const authHeader = req.get('authorization');
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, async (error, user) => {
        if (error) {
          console.log("Token expired");
        }
        req.user = user;

        //insert audit-trail
        await AuditTrail.create({
          username: req.user.username,
          endpoint: `${req.method} ${req.originalUrl}`,
        });
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