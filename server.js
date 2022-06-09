const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const passport = require('passport');
require('dotenv').config();

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const cors = require("cors");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'wceufghweuihfweicehwsekij'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));

const db = require("./config/db/postgres")

// Test DB
db.authenticate()
  .then(() => console.log("Database Connected..."))
  .catch(err => console.log("Error:" + err))

const middleware = require('./config/middleware');
const auth = require('./api/auth');
const user = require('./api/user');
const auditTrail = require('./api/auditTrail');
const farm = require('./api/farm');

let corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  limit: "50mb",
  extended: true
}));
app.use(middleware.authentication);


app.use('/api/v1/auth', auth);
app.use('/api/v1/user', middleware.isAuthenticated, user);
app.use('/api/v1/audit-trail', middleware.isAuthenticated, auditTrail);
app.use('/api/v1/farm', middleware.isAuthenticated, farm);

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  console.log("req = ", req)
  console.log("res = ", res)
  console.log(err);
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log(err);
  res.status(err.status || 500);
  res.json('error');
});

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});