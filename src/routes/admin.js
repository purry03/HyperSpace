var express = require("express");
var router = express.Router();
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
var services = require("../services");
var fastFolderSize = require("fast-folder-size");

router.get("/", function (req, res, next) {
  res.render("admin.ejs");
});

router.get("/upload", function (req, res, next) {
  res.render("upload.ejs");
});

router.post("/upload", multipartMiddleware, function (req, res) {
  if (req.body.youtubeLink.toString().length > 0) {
    services.song
      .saveToFileFromYoutube(req)
      .then((done) => {
        if (done) {
          services.song
            .saveNew(
              req.body.uid,
              req.body.title,
              req.body.artist,
              req.body.album
            )
            .then(() => {
              res.redirect("/admin/upload");
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
  } else {
    services.song
      .saveToFile(req)
      .then((done) => {
        if (done) {
          services.song
            .saveNew(
              req.body.uid,
              req.body.title,
              req.body.artist,
              req.body.album
            )
            .then(() => {
              res.redirect("/admin/upload");
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
  }
});

router.get("/info", function (req, res) {
  var response = {
    size: 0,
    songs: [],
  };
  fastFolderSize(__basedir + "/data/", (err, bytes) => {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    }
    response.size = Math.round(bytes / (1024 * 1024)).toString();
    services.song
      .getAllSongs()
      .then((songs) => {
        response.songs = songs;
        res.send(response);
      })
      .catch((err) => {
        res.sendStatus(500);
      });
  });
});

module.exports = router;
