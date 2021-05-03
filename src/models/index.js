const song = require("./song.js");

module.exports.init = async (db) => {
  const Song = await song.init(db);
  models = { Song };
  module.exports.models = models;
};
