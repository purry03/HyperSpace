const mongoose = require("mongoose");
const textSearch = require("mongoose-partial-full-search");
const Vibrant = require("node-vibrant");

var models;

module.exports.init = () => {
  mongoose.set("useNewUrlParser", true);
  mongoose.set("useFindAndModify", false);
  mongoose.set("useCreateIndex", true);
  mongoose.set("useUnifiedTopology", true);

  const db = mongoose.createConnection(
    "mongodb+srv://admin:thisisaweakpassword@cluster0.sa4k9.mongodb.net/mainDB?retryWrites=true"
  );

  const songSchema = new mongoose.Schema({
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
      required: false,
    },
  });
  songSchema.plugin(textSearch);

  songSchema.index({ title: "text", artist: "text", album: "text" });

  const Song = db.model("Song", songSchema);
  models = { Song };
};

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
    models.Song.findOne({ uid: uid })
      .then((song) => {
        try {
          Vibrant.from(__basedir + "/data/" + uid + "/cover.png").getPalette(
            (err, palette) => {
              if (err) {
                console.log(err);
                resolve({ song, accent: null });
              } else {
                var response = { song: song, accent: palette.Vibrant._rgb };
                resolve(response);
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
