var mongoose = require("mongoose");
var UserModel = require("./models/users");
var VideoModel = require("./models/videos");

mongoose.connect("mongodb://localhost:27017/" + "jifcam_development", {
  useNewUrlParser: true
});

var users = new UserModel();
var videos = new VideoModel();

users.modelDB.deleteMany({}, function(err, res) {
  console.log("Users model is cleard");
});

videos.modelDB.deleteMany({}, function(err, res) {
  console.log("Video model is cleard");
});
