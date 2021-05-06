const Vibrant = require("node-vibrant");
var mongoose = require("mongoose");
var cachegoose = require("recachegoose");
const modelLoader = require("../models");
const fs = require("fs");
const path = require("path");
var mv = require("mv");

cachegoose(mongoose, {
  engine: "redis",
  port: 6379,
  host: "localhost",
});

module.exports.saveNew = (uid, title, artist, album) => {
  return new Promise((resolve, reject) => {
    const toSave = models.Song({
      uid,
      title,
      artist,
      album,
    });

    toSave
      .save()
      .then(() => {
        resolve(true);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.searchDb = (searchString) => {
  return new Promise((resolve, reject) => {
    const reg = new RegExp(searchString, "i");
    models.Song.find()
      .or([{ title: reg }, { artist: reg }, { album: reg }])
      .cache(120)
      .exec(function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
  });
};

module.exports.getSongDetails = (uid) => {
  return new Promise((resolve, reject) => {
    modelLoader.models.Song.findOne({ uid: uid })
      .cache(3600)
      .then((song) => {
        try {
          Vibrant.from(__basedir + "/data/" + uid + "/cover.png").getPalette(
            (err, palette) => {
              if (err) {
                console.log(err);
                resolve({ song, accent: null });
              } else {
                resolve({ song: song, accent: palette.Vibrant._rgb });
              }
            }
          );
        } catch (except) {
          resolve({ song, accent: null });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.getAllSongs = () => {
  return new Promise((resolve, reject) => {
    models.Song.find({})
      .then((songs) => {
        resolve(songs);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.saveToFile = (req) => {
  return new Promise((resolve, reject) => {
    const { uid, title, artist, album, duration } = req.body;
    const { song, cover } = req.files;
    const songDest = path.join(__basedir + "/data/" + uid + "/song.mp3");
    const coverDest = path.join(__basedir + "/data/" + uid + "/cover.png");
    fs.mkdirSync(path.join(__basedir + "/data/" + uid));
    mv(song.path, songDest, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
    mv(cover.path, coverDest, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

module.exports.saveToFileFromYoutube = (req) => {
  return new Promise((resolve, reject) => {
    const { uid, title, artist, album, duration } = req.body;
    const { song, cover } = req.files;
    const songDest = path.join(__basedir + "/data/" + uid + "/song.mp3");
    const coverDest = path.join(__basedir + "/data/" + uid + "/cover.png");
    fs.mkdirSync(path.join(__basedir + "/data/" + uid));
    mv(song.path, songDest, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
    mv(cover.path, coverDest, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
