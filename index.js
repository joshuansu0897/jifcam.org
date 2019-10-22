<<<<<<< HEAD
var express = require("express");
var config = require("./config").config;
var schedule = require("node-schedule");
var https = require("https");

var mongoose = require("mongoose");
var router = require("./router");
var expressFormData = require("express-form-data");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var pasportHelp = require("./helpers/passport");
var path = require("path");
var os = require("os");
var fs = require("fs");
var UserModel = require("./models/users");
var initPassport = require("./helpers/passport").initPassport;
var mountRoutes = require("./router").mountRoutes;
var YoutubeVideos = require("./helpers/downloading-youtube-videos");

var firebase = require("firebase-admin");
var serviceAccount = require("./firebase.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://jifcam-58f73.firebaseio.com"
});

const PORT = config.SERVER_PORT || 9000;
const DB_URI = config.DB_URI || "mongodb://localhost:27017/";
var DB_NAME = config.MONGODB_DB || "jifcam";

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
//console.log(config.MONGODB_DB);

mongoose.connect(DB_URI + DB_NAME, { useNewUrlParser: true });

// var key = fs.readFileSync('/etc/letsencrypt/live/jifcam.org/privkey.pem');
// var cert = fs.readFileSync('/etc/letsencrypt/live/jifcam.org/fullchain.pem');

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

const app = express();
app.use(expressFormData.parse(options)); // parse multipart/from-data request data
app.use(expressFormData.format());
app.use(bodyParser.json()); // parse json request data
app.use(bodyParser.urlencoded({ extended: false })); // parse url encoded request data
app.use(cookieParser());

initPassport();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, PUT, GET, OPTIONS, DELETE, PATCH"
  );
  next();
});
// create super admin user

mountRoutes(app);

app.use(function(err, req, res, next) {
  if (err) {
    console.log(err);
    res.status(500);
    let response = {
      status: 500,
      data: null,
      errors: [err.message]
    };
    res.json(response);
  } else {
    next();
  }
});

var VideoDownloader = new YoutubeVideos();

app.listen(PORT, () => {
  console.log(" server start on PORT: ", PORT);

  // Create dummy admin
  var Users = new UserModel();
  Users.checkSuperAdmin(config);

  // Run cron to auto-download video
  VideoDownloader.download();
  var j = schedule.scheduleJob("*/1 * * * *", function() {
    console.log("excecuted cron job ");
    VideoDownloader.download();
  });
});

// const httpsServer = https.createServer({key, cert}, app).listen(443)
const httpsServer = https.createServer();
=======
var express = require("express");
var config = require("./config").config;
var schedule = require("node-schedule");
var https = require("https");

var mongoose = require("mongoose");
var router = require("./router");
var expressFormData = require("express-form-data");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var pasportHelp = require("./helpers/passport");
var path = require("path");
var os = require("os");
var fs = require("fs");
var UserModel = require("./models/users");
var initPassport = require("./helpers/passport").initPassport;
var mountRoutes = require("./router").mountRoutes;
var YoutubeVideos = require("./helpers/downloading-youtube-videos");

var firebase = require("firebase-admin");
var serviceAccount = require("./firebase.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://jifcam-58f73.firebaseio.com"
});

const PORT = config.SERVER_PORT || 9000;
const DB_URI =
  process.env.DB_URI || config.DB_URI || "mongodb://localhost:27017/";
var DB_NAME = config.MONGODB_DB || "jifcam";
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
//console.log(config.MONGODB_DB);

mongoose.connect(DB_URI + DB_NAME, { useNewUrlParser: true });

// var key = fs.readFileSync('/etc/letsencrypt/live/jifcam.org/privkey.pem');
// var cert = fs.readFileSync('/etc/letsencrypt/live/jifcam.org/fullchain.pem');

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

const app = express();
app.use(expressFormData.parse(options)); // parse multipart/from-data request data
app.use(expressFormData.format());
app.use(bodyParser.json()); // parse json request data
app.use(bodyParser.urlencoded({ extended: false })); // parse url encoded request data
app.use(cookieParser());

initPassport();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "POST, PUT, GET, OPTIONS, DELETE, PATCH"
  );
  next();
});
// create super admin user

mountRoutes(app);

app.use(function(err, req, res, next) {
  if (err) {
    console.log(err);
    res.status(500);
    let response = {
      status: 500,
      data: null,
      errors: [err.message]
    };
    res.json(response);
  } else {
    next();
  }
});

var VideoDownloader = new YoutubeVideos();

app.listen(PORT, () => {
  console.log(" server start on PORT: ", PORT);

  // Create dummy admin
  var Users = new UserModel();
  Users.checkSuperAdmin(config);

  // Run cron to auto-download video
  VideoDownloader.download();
  var j = schedule.scheduleJob("*/1 * * * *", function() {
    console.log("excecuted cron job ");
    VideoDownloader.download();
  });
});

// const httpsServer = https.createServer({key, cert}, app).listen(443)
const httpsServer = https.createServer();
>>>>>>> edlugora
