const express = require("express");
const path = require("path");
const logger = require("morgan");
// const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const { router } = require("./src/globalRouting");

// const { handleError, ErrorHandler } = require("./src/errorHandler/MbError");

const app = express();
console.log("created an express app");

// const stickers = require('./api/stickers');

app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
  res.send("Welcome to Market-Boats. It's running!");
});

app.use("/api", router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

module.exports = {
  express,
  path,
  logger,
  bodyParser,
  app
};
