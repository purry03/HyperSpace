const mongoose = require("mongoose");

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
    duration: {
      type: String,
      required: true,
    },
  });

  songSchema.index({ title: "text", artist: "text", album: "text" });

  const Song = db.model("Song", songSchema);
  models = { Song };
};

module.exports.saveNew = (uid, title, artist, album, duration) => {
  return new Promise((resolve, reject) => {
    const toSave = models.Song({
      uid,
      title,
      artist,
      album,
      duration,
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
    models.Song.find({ $text: { $search: searchString } })
      .then((songs) => {
        resolve(songs);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
