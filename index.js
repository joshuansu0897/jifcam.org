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
var session = require('express-session')
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

const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || "JIFCAM_SESSION_SECRET";

const app = express();

app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: SESSION_SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}));

app.use(expressFormData.parse(options)); // parse multipart/from-data request data
app.use(expressFormData.format());
app.use(bodyParser.json({ limit: '50mb' })); // parse json request data
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false })); // parse url encoded request data
app.use(cookieParser());


initPassport();

app.use(function (req, res, next) {
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

app.use(function (err, req, res, next) {
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
  // VideoDownloader.download();
  // let randomMin = Math.floor(Math.random() * (5 - 1) ) + 1;
  var j = schedule.scheduleJob(`*/3 * * * *`, function () {
    console.log("excecuted cron job ");
    VideoDownloader.download();
  });
});

// const httpsServer = https.createServer({key, cert}, app).listen(443)
const httpsServer = https.createServer();
