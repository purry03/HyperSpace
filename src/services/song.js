const { captureRejectionSymbol } = require("events");
const fs = require("fs");
const path = require("path");
var mv = require("mv");

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
