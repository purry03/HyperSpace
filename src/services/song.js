const { captureRejectionSymbol } = require("events");
const fs = require("fs");
const path = require("path");
var mv = require("mv");

module.exports.saveToFile = (req) => {
  return new Promise((resolve, reject) => {
    const { uid, title, artist, album, duration } = req.body;
    const song = req.files.song;
    const dest = path.join(__basedir + "/data/" + uid + "/song.mp3");
    fs.mkdirSync(path.join(__basedir + "/data/" + uid));
    mv(song.path, dest, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
