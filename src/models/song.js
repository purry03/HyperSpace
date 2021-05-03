const mongoose = require("mongoose");
const textSearch = require("mongoose-partial-full-search");

module.exports.init = (db) => {
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

  const Song = db.model("Song", songSchema);
  return Song;
};
