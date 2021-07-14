var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var favicon = require("serve-favicon");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var adminRouter = require("./routes/admin");

var database = require("./database");
var models = require("./models");

var app = express();
global.__basedir = path.resolve(__dirname + "/../");

// view engine setup
app.set("views", path.join(__basedir, "views"));
app.set("view engine", "ejs");

app.use(
  logger("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/static", express.static(__basedir + "/public"));
app.use("/data", express.static(__basedir + "/data"));
app.use("/", indexRouter);
app.use("/admin", adminRouter);

app.use(favicon(__basedir + "/public/img/favicon.ico"));

startServer();

module.exports = app;

async function startServer() {
  const db = await database.connect();
  await models.init(db);

  app.listen(process.env.PORT || 80, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Server Online");
    }
  });

  // error handler
  app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error", { error: err });
  });
}
