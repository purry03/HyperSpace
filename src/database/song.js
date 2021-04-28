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

  const Song = db.model("Song", songSchema);
  models = { song };
};
