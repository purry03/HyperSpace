const express = require("express");
const app = express();
const ejs = require("ejs");
const database = require("./database");
const services = require("./services");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

global.__basedir = path.resolve(__dirname + "/../");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    services.song.saveToFile(req, file, cb);
  },
  filename: function (req, file, cb) {
    cb(null, "song.mp3");
  },
});

const upload = multer({ storage: storage });

app.use(express.static(__dirname + "/../public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");

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

app.post("/upload", upload.single("song"), function (req, res) {
  res.sendStatus(200);
});

app.get("/stream", (req, res) => {
  const file = __dirname + "/../public/song.mp3";
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
});
