const fs = require("fs");
const path = require("path");
const randomToken = require("random-token");
const multer = require("multer");

module.exports.saveToFile = (req, file, cb) => {
  console.log(req);
  var dir = path.join(__basedir + "/data/" + req.body.uid);
  fs.exists(dir, (exist) => {
    if (!exist) {
      return fs.mkdir(dir, (error) => cb(error, dir));
    }
    return cb(null, dir);
  });
};
