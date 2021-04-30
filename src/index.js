const express = require("express");
const session = require("express-session");
const app = express();
const ejs = require("ejs");
const database = require("./database");
const services = require("./services");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const fastFolderSize = require("fast-folder-size");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: "a4c364b453584a8390dc2a49434f7d43",
      clientSecret: "beea81b5029f48579c2cd371df462ab6",
      callbackURL: "http://localhost/auth/spotify/callback",
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      database.saveNewUser(profile, function (err, user) {
        return done(err, user);
      });
    }
  )
);

database.init();

global.__basedir = path.resolve(__dirname + "/../");

app.use("/", express.static(__basedir + "/public"));
app.use("/data", express.static(__basedir + "/data"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/../views"));

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());

app.listen(80, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("Server online");
  }
});

app.get("/", function (req, res) {
  res.render("index.ejs", { user: req.user });
});
app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-read-email", "user-read-private"],
    showDialog: true,
  })
);

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/auth/spotify" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/upload", function (req, res) {
  res.render("upload.ejs");
});

app.post("/upload", multipartMiddleware, function (req, res) {
  services.song
    .saveToFile(req)
    .then((done) => {
      if (done) {
        database
          .saveNew(
            req.body.uid,
            req.body.title,
            req.body.artist,
            req.body.album
          )
          .then(() => {
            res.redirect("/upload");
          })
          .catch((err) => {
            console.log(err);
            res.send(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.get("/stream/:uid", (req, res) => {
  const uid = req.params.uid;
  if (uid == null) {
    res.sendStatus(404);
  } else {
    const file = path.join(__basedir + "/data/" + uid + "/song.mp3");
    const stat = fs.statSync(file);
    const total = stat.size;
    if (req.headers.range) {
    }
    fs.exists(file, (exists) => {
      if (exists) {
        const range = req.headers.range;
        const parts = range.replace(/bytes=/, "").split("-");
        const partialStart = parts[0];
        const partialEnd = parts[1];

        const start = parseInt(partialStart, 10);
        const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
        const chunksize = end - start + 1;
        const rstream = fs.createReadStream(file, { start: start, end: end });

        res.writeHead(206, {
          "Content-Range": "bytes " + start + "-" + end + "/" + total,
          "Accept-Ranges": "bytes",
          "Content-Length": chunksize,
          "Content-Type": "audio/mpeg",
        });
        rstream.pipe(res);
      } else {
        res.send("Error - 404");
        res.end();
        // res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'audio/mpeg' });
        // fs.createReadStream(path).pipe(res);
      }
    });
  }
});

app.get("/search/:searchString", function (req, res) {
  const searchString = req.params.searchString;
  database
    .searchDb(searchString)
    .then((docs) => {
      res.send(docs);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

app.get("/get-details/:uid", function (req, res) {
  const uid = req.params.uid;
  database
    .getSongDetails(uid)
    .then((song) => {
      res.send(song);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });
});

app.get("/library", function (req, res) {
  res.render("library.ejs");
});

app.get("/library-details", function (req, res) {
  var response = {
    size: 0,
    songs: [],
  };
  fastFolderSize(__basedir + "/data/", (err, bytes) => {
    if (err) {
      res.sendStatus(500);
      console.log(err);
    }
    response.size = Math.round(bytes / (1024 * 1024)).toString();
    database
      .getAllSongs()
      .then((songs) => {
        response.songs = songs;
        res.send(response);
      })
      .catch((err) => {
        res.sendStatus(500);
      });
  });
});
