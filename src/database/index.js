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

  const userSchema = new mongoose.Schema({
    uid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
  });

  const User = db.model("User", userSchema);
  const Song = db.model("Song", songSchema);
  models = { Song, User };
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

module.exports.saveNewUser = (profile, cb) => {
  models.User.findOne(
    {
      uid: profile.id,
    },
    function (err, user) {
      if (err) {
        cb(err, null);
      }
      if (!user) {
        user = new models.User({
          uid: profile.id,
          name: profile.displayName,
        });
        user.save(function (err) {
          if (err) console.log(err);
          cb(err, user);
        });
      } else {
        //found user. Return
        cb(err, user);
      }
    }
  );
};

module.exports.findUserById = (id, cb) => {
  models.User.findOne({ uid: id }, function (err, user) {
    cb(err, user);
  });
};
