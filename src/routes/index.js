var express = require("express");
var router = express.Router();

var services = require("../services");

const path = require("path");
const fs = require("fs");

router.get("/", (req, res) => {
  res.render("index.ejs");
});

router.get("/stream/:uid", (req, res) => {
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
        res.sendStatus(404);
        res.end();
      }
    });
  }
});

router.get("/search/:searchString", function (req, res) {
  const searchString = req.params.searchString;
  services.song
    .searchDb(searchString)
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

router.get("/get-details/:uid", function (req, res) {
  const uid = req.params.uid;
  services.song
    .getSongDetails(uid)
    .then((song) => {
      res.send(song);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });
});

module.exports = router;
