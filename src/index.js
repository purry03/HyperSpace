const express = require("express");
const app = express();
const ejs = require("ejs");
const database = require("./database");
const services = require("./services");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();

database.init();

global.__basedir = path.resolve(__dirname + "/../");

app.use(express.static(__dirname + "/../public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/../views"));

app.listen(80, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server online");
  }
});

app.get("/", function (req, res) {
  res.render("index.ejs");
});

app.get("/upload", function (req, res) {
  res.render("upload.ejs");
});

app.post("/upload", multipartMiddleware, function (req, res) {
  services.song
    .saveToFile(req)
    .then((done) => {
      if (done) {
        database
          .saveNew(
            req.body.uid,
            req.body.title,
            req.body.artist,
            req.body.album,
            req.body.duration
          )
          .then(() => {
            res.redirect("/upload");
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.get("/stream/:uid", (req, res) => {
  const uid = req.params.uid;
  if (uid == null) {
    res.sendStatus(404);
  } else {
    const file = path.join(__basedir + "/data/" + uid + "/song.mp3");
    const stat = fs.statSync(file);
    const total = stat.size;
    if (req.headers.range) {
    }
    fs.exists(file, (exists) => {
      if (exists) {
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, "").split("-");
        const partialStart = parts[0];
        const partialEnd = parts[1];

        const start = parseInt(partialStart, 10);
        const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
        const chunksize = end - start + 1;
        const rstream = fs.createReadStream(file, { start: start, end: end });

        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "audio/mpeg",
        });
        rstream.pipe(res);
      } else {
        res.send("Error - 404");
        res.end();
        // res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        // fs.createReadStream(path).pipe(res);
      }
    });
  }
});

app.get("/search/:searchString", function (req, res) {
  const searchString = req.params.searchString;
  database
    .searchDb(searchString)
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});
