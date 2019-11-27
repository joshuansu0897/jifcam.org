var UserModel = require("../models/users");
var Router = require("express").Router;
var passport = require("passport");
var jwt = require("jsonwebtoken");
const ResponseHelper = require("../helpers/response");
var FileHelper = require("../helpers/files");
var parse = require("csv-parse");
var async = require("async");
var fs = require("fs");
var ChannelParser = require("../helpers/youtube-channel-parser").ChannelParser;
const download = require("image-downloader");
var uniqid = require("uniqid");
var VideoModel = require("../models/videos");
var Mail = require("../helpers/mail");

var config = require("../config").config;
//var FileHelper = require('../helpers/files');

const JWT_SECRET_KEY = process.env.AUTH_SECRET_KEY || "JIFCAM_SECRET";

function UserController() {
  this.model = new UserModel();
  this.videos = new VideoModel();
}

UserController.prototype.getUserData = function (result) {
  return {
    _id: result._id,
    youtubeChannel: result.youtubeChannel,
    role: result.role,
    verified: result.verified,
    notificationMail: result.notificationMail,
    notificationMessage: result.notificationMessage,
    notificationPush: result.notificationPush,
    notificationPushToken: result.notificationPushToken,
    videoUploaded: result.videoUploaded,
    suspend: result.suspend,
    videos: result.videos,
    mailSended: result.mailSended,
    language: result.language,
    keyword: result.keyword,
    fullname: result.fullname,
    email: result.email,
    username: result.username,
    validationCode: result.validationCode,
    lastMail: result.lastMail,
    following: result.following,
    followers: result.followers,
    created: result.created,
    updated: result.updated,
    __v: result.__v,
    avatar: result.avatar
  };
};

/**
 * @api {get} api/users/
 * @apiName Users
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription List all users
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {Number} limit Set limit of results (default 25)
 * @apiParam {Number} offset Set offset of current page (default 0)
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.getAll = function (req, res) {
  const Res = new ResponseHelper.Response(res);

  let limit = 25;
  let offset = 0;

  if (typeof req.query.limit != "undefined") {
    limit = parseInt(req.query.limit);
  }

  if (typeof req.query.offset != "undefined") {
    offset = parseInt(req.query.offset);
  }

  this.model
    .list(offset, limit)
    .then(result => {
      let list = [];
      async.eachSeries(
        result.users,
        (item, cb) => {
          _item = {
            video: 0,
            ...this.getUserData(item)
          };

          this.videos
            .countVideos(item._id)
            .then(count => {
              _item.video = count;
              list.push(_item);
              cb();
            })
            .catch(err => {
              item.set("video", 0);
              list.push(_item);
              cb();
            });
        },
        err => {
          result["users"] = list;
          Res.setData(result);

          Res.send();
        }
      );
    })
    .catch(err => {
      console.log(err.message);
      Res.errorParse(err);
      Res.send();
    });
};

/**
 * @api {get} api/users/:id
 * @apiName Users By Id
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Get user by ID
 *
 * @apiParam {String} username Username of the user
 * @apiParam {String} id Object id of the user
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.getOne = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  let id = req.params.username || req.params.id;

  this.model
    .one(id)
    .then(result => {
      this.videos
        .list(result._id)
        .then(docs => {
          result.videos = docs;

          Res.setData(this.getUserData(result));
          Res.send();
        })
        .catch(err => {
          console.log(err.message);
          Res.errorParse(err);
          Res.send();
        });
    })
    .catch(err => {
      console.log(err.message);
      Res.errorParse(err);
      Res.send();
    });
};

/**
 * @api {put} api/users/:id
 * @apiName Users Update By Id
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Update user by ID
 *
 * @apiParam {String} userId Default object id of the user
 * @apiParam {Object} body Object of the user that will be updated
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.update = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  var userId = req.params.id;
  var body = req.body;

  this.model
    .one(userId)
    .then(doc => {
      if (
        ((req.body.notificationMail && req.body.notificationMail === true) ||
          (req.body.notificationMessage &&
            req.body.notificationMessage === true)) &&
        !doc.verified
      ) {
        Res.setData({
          message:
            "Please verify your e-mail first to enable mail / sms notification"
        });
        Res.send();

        return;
      }
      this.model
        .update(userId, body)
        .then(result => {
          Res.setData({
            message: `User data already updated`,
            ...this.getUserData(result)
          });
          Res.send();
        })
        .catch(err => {
          console.log(err);
          Res.errorParse(err);
          Res.send();
        });
    })
    .catch(err => {
      console.log(err);
      Res.errorParse(err);
      Res.send();
    });
};

/**
 * @api {get} api/users/code/:code
 * @apiName Verify by code
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Get user data by code
 *
 * @apiParam {String} code Default verification code of the user
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.getOneByCode = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  let code = req.params.code;

  this.model
    .oneByCode(code)
    .then(result => {
      if (result) {
        this.videos
          .list(result._id, 5)
          .then(docs => {
            result.videos = docs.slice(0, 5);

            Res.setData(this.getUserData(result));
            Res.send();
          })
          .catch(err => {
            console.log(err.message);
            Res.errorParse(err);
            Res.send();
          });
      } else {
        Res.send();
      }
    })
    .catch(err => {
      console.log(err.message);
      Res.setData(null);
      Res.addError(Response.NOT_FOUND, "User with this is not found");
      Res.send();
    });
};

/**
 * @api {post} api/users/auth
 * @apiName Authentication
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Sign in with credential
 *
 * @apiParam {Object} user Object that content username & password of the user
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.authenticate = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log(err, user);
      Res.addError(ResponseHelper.BAD_REQUEST, "IncorectCredetials");
      return Res.send();
    }

    req.login(user, { session: false }, err => {
      if (err) {
        Res.addError(ResponseHelper.UNAUTH, "FieledAuthetication");
        return Res.send();
      }

      const u = this.getUserData(user)
      if (u.suspend == null || u.suspend == undefined) {
        u.suspend = false
      }

      if (u.suspend) {
        Res.setData({
          user: {
            message: `account suspended`,
          },
        });
        return Res.send();
      }

      delete user.password;
      const token = jwt.sign(user.toJSON(), JWT_SECRET_KEY);
      Res.setData({
        user: {
          message: `Hi, welcome back @${user.username}`,
          ...u
        },
        token: token
      });
      return Res.send();
    });
  })(req, res, next);
};

/**
 * @api {post} api/users/register
 * @apiName Register
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Create new account with email & password
 *
 * @apiParam {String} email Default e-mail identity of user
 * @apiParam {String} password Credential string as a password. Must be between 6-30 characters
 *
 * @apiError (Error 400) EmailAlreadyExists The provided email is already registered
 * @apiError (Error 400) FieldAutheticationError The provided password is not between 6-30 characters
 * @apiError (Error 500) ServerError Unexpected server error
 *
 */
UserController.prototype.register = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  var email = req.body.email;
  var password = req.body.password;
  var deviceId = req.session ? req.session.deviceId : '';

  if (deviceId === '') {
    deviceId = req.body.deviceId;
  }

  this.model
    .signup(email, password, deviceId)
    .then(doc => {
      const token = jwt.sign(doc.toJSON(), JWT_SECRET_KEY);
      Res.setData({
        ...this.getUserData(doc),
        token: token
      });
      Res.send();

    })
    .catch(err => {
      if (err === "UniqueDuplication") {
        Res.setData({
          message: "E-mail already registered"
        });
        Res.status = 400;
      }

      if (err === "InvalidPassword") {
        Res.setData({
          message: "Password must be between 6-30 characters"
        });
        Res.status = 400;
      } else {
        Res.status = 500;
      }

      Res.send();
    });
};

/**
 * @api {post} api/users/device
 * @apiName Register
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Save Device id
 *
 * @apiError (Error 400) EmailAlreadyExists The provided email is already registered
 * @apiError (Error 400) FieldAutheticationError The provided password is not between 6-30 characters
 * @apiError (Error 500) ServerError Unexpected server error
 *
 */
UserController.prototype.device = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  var deviceId = req.session ? req.session.deviceId : '';
  if (deviceId === '') {
    deviceId = req.body.deviceId;
  }
  if (deviceId === '') {
    Res.setData({
      message: "missing deviceId."
    });
    Res.status = 400;
    return
  }
  this.model
    .device(deviceId)
    .then(doc => {
      console.log(doc)
      Res.setData({
        ...doc
      });
      Res.send();
    })
    .catch(err => {
      if (err === "UniqueDuplication") {
        Res.setData({
          message: "DeviceId already registered"
        });
        Res.status = 400;
      }

      Res.send();
    });
};

/**
 * @api {post} api/users/register
 * @apiName Register Username
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Choose username by parameter
 *
 * @apiParam {String} userId Object id of the user
 * @apiParam {String} username The unique string to be set as the username
 *
 * @apiError (Error 400) IncorrectCredentials User with provided id not found
 * @apiError (Error 400) UsernameAlreadyExists The provided username already belongs to a user
 * @apiError (Error 500) ServerError Unexpected server error
 *
 */
UserController.prototype.choose = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  var userId = req.body.userId;
  var username = req.body.username;

  this.model
    .oneByUsername(username)
    .then(doc => {
      if (!doc) {
        this.model
          .update(userId, {
            username: username
          })
          .then(doc => {
            Res.setData({
              message: `${username} successfully created`,
              ...this.getUserData(doc)
            });
            Res.send();
          })
          .catch(err => {
            console.log(err);
            Res.setData({
              message: `The provided userId does not exist`
            });
            Res.status = 400;
            Res.send();
          });
      } else {
        Res.setData({
          message: `${username} already registered`
        });
        Res.status = 400;
        Res.send();
      }
    })
    .catch(err => {
      console.log(err);
      Res.errorParse(err);
      Res.status = 500;
      Res.send();
    });
};

/**
 * @api {post} api/users/register
 * @apiName Register Notification status
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Update push notification at user
 *
 * @apiParam {String} userId Object id of the user
 * @apiParam {String} token The unique string that can use as push credential
 *
 * @apiError (Error 400) IncorrectCredentials User with provided id not found
 * @apiError (Error 500) ServerError Unexpected server error
 *
 */
UserController.prototype.notify = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  var userId = req.body.userId;
  var token = req.body.token;

  this.model
    .one(userId)
    .then(res => {
      if (res) {
        this.model
          .update(userId, {
            notificationPush: true,
            notificationPushToken: token
          })
          .then(doc => {
            Res.setData({
              message: `Notification successfully enabled`,
              ...this.getUserData(doc)
            });
            Res.send();
          })
          .catch(err => {
            console.log(err);
            Res.errorParse(err);
            Res.status = 500;
            Res.send();
          });
      } else {
        Res.setData({
          message: `The provided userId does not exist`
        });
        Res.status = 400;
        Res.send();
      }
    })
    .catch(err => {
      console.log(err);
      Res.errorParse(err);
      Res.send();
    });
};

/**
 * @api {post} api/users/register/follow
 * @apiName Register Follow
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Follow someone by user object id
 *
 * @apiParam {String} userId A object id of the target user
 * @apiParam {String} followingId A object id of the current user
 *
 * @apiError (Error 400) IncorrectCredentials User with the provided id does not exist
 * @apiError (Error 400) IncorrectTarget Target with the provided id does not exist
 * @apiError (Error 500) ServerError Unexpected server error
 *
 */
UserController.prototype.follow = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  var userId = req.body.userId;
  var following = req.body.followingId;

  this.model
    .one(userId)
    .then(result => {
      if (result) {
        this.model
          .follow(result, following)
          .then(doc => {
            Res.setData(this.getUserData(result));
            Res.send();
          })
          .catch(err => {
            Res.setData(err);
            Res.status = 400;
            Res.send();
          });
      } else {
        Res.setData({
          message: `The provided userId does not exist`
        });
        Res.status = 400;
        Res.send();
      }
    })
    .catch(err => {
      console.log(err.message);
      Res.errorParse(err);
      Res.status = 500;
      Res.send();
    });
};

/**
 * @api {post} api/users/register/unfollow
 * @apiName Register unfollow action
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription unfollow someone by user object id
 *
 * @apiParam {String} userId A object id of the current user
 * @apiParam {String} unfollowId A object id of the user to unfollow
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.unfollow = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  var userId = req.body.userId;
  var unfollowing = req.body.unfollowId;

  this.model
    .one(userId)
    .then(result => {
      if (result) {
        this.model
          .unfollow(result, unfollowing)
          .then(doc => {
            Res.setData(this.getUserData(result));
            Res.send();
          })
          .catch(err => {
            Res.setData(err);
            Res.status = 400;
            Res.send();
          });
      } else {
        Res.setData({
          message: `The provided userId does not exist`
        });
        Res.status = 400;
        Res.send();
      }
    })
    .catch(err => {
      console.log(err.message);
      Res.errorParse(err);
      Res.status = 500;
      Res.send();
    });
};

/**
 * @api {post} api/users/verify/:id
 * @apiName Verify by Id
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription FVerification by object id
 *
 * @apiParam {String} id Object id of the user
 *
 * @apiParam {String} code The verify code of the user
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.verifyUser = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  var id = req.params.id;
  var code = req.body.code;

  //this.model.one
  this.model
    .verify(id, {
      code: code
    })
    .then(result => {
      Res.setData(this.getUserData(result));
      Res.send();
    })
    .catch(err => {
      console.log(err);
      Res.errorParse(err);
      Res.send();
    });
};

/**
 * @api {get} api/users/verify/identity/:username/:code
 * @apiName Verify by username & code
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Get verified user by username & code
 *
 * @apiParam {String} code The verify code of the user
 * @apiParam {String} username The username of the user
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.verified = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  var code = req.params.code;
  var username = req.params.username;

  this.model
    .oneVerified(code, username)
    .then(doc => {
      Res.setData(this.getUserData(doc));
      Res.send();
    })
    .catch(err => {
      console.log(err);
      Res.errorParse(err);
      Res.send();
    });
};

/**
 * @api {get} api/users/verify/count/
 * @apiName Verified Count
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Count all verified user
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.countingVerified = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  this.model
    .countingVerified()
    .then(result => {
      Res.setData(result);
      Res.send();
    })
    .catch(err => {
      console.log(err);
      Res.errorParse(err);
      Res.send();
    });
};

/**
 * @api {post} api/users/mail
 * @apiName Mailing
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Send mail to the user
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userIds Object id of the user
 * @apiParam {String} to The email of receiver
 * @apiParam {String} subject A subject of e-mail
 * @apiParam {String} sendgridKey A sendgrid API Key
 * @apiParam {String} messageTxt Plain text string of the message
 * @apiParam {String} messageHtml HTML String of the message
 * @apiParam {String} from The email of sender
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.sendMail = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  var userIds = req.body.userIds;
  var to = req.body.to;
  var subject = req.body.subject;
  var sendgridKey = req.body.sendgridKey;
  var messageTxt = decodeURI(req.body.messageTxt);
  var messageHtml = decodeURI(req.body.messageHtml);
  var from = req.body.from;
  var mail = new Mail(sendgridKey);
  var users = [];
  //console.log(messageHtml,messageTxt);

  async.eachSeries(
    userIds,
    (userID, cb) => {
      this.sendingMail(
        userID,
        {
          subject: subject,
          messages: { text: messageTxt, html: messageHtml },
          from: from
        },
        mail
      )
        .then(rez => {
          cb(null, rez);
        })
        .catch(err => {
          cb(err);
        });
    },
    function (err) {
      if (err) {
        console.log(err);
        Res.errorParse(err);
        Res.send();
      } else {
        Res.setData({ users: users, sended: true });
        Res.send();
      }
    }
  );
};

/**
 * @api {post} api/users/import
 * @apiName Importer
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Import all users by CSV file
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {File} document CSV document which has information about users
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.import = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  let files = new FileHelper("./public/imports");
  var first = true;
  var list = [];
  var Fieled = [];
  var fails = 0;
  var success = 0;
  var _this = this;
  files
    .upload(req, "document", "/data/")
    .then(fileData => {
      //console.log(fileData);
      fs.createReadStream(fileData.realpath)
        .pipe(parse({ delimiter: "," }))
        .on("data", function (row) {
          console.log(row);
          if (row[0]) {
            list.push(row);
          }
        })
        .on("close", function () {
          console.log("close");
        })
        .on("end", function () {
          //console.log("list",list);
          async.eachSeries(
            list,
            (item, callback) => {
              var index = 0;
              if (item[index] === "" || /^([0-9]+)$/.test(item[index])) index++;
              /* */
              let userdata = {};
              userdata.avatar = "";
              userdata.fullname = item[index + 2];
              userdata.email = item[index + 3];
              userdata.username = userdata.email.split("@")[0].toLowerCase();
              userdata.lenguage = item[index + 4];
              userdata.role = 1;
              userdata.verified = false;
              userdata.videoUploaded = false;
              userdata.keyword = item[index];
              userdata.password = uniqid.time();
              userdata.youtubeChannel = item[index + 1];
              ChannelParser(item[index + 1])
                .then(data => {
                  //console.log("ChannelParser", data);
                  let videos = data.videos;
                  let avatarlink = data.avatar;
                  /* */
                  if (avatarlink === "") {
                    userdata.avatar = "/static/images/avatar/default.png";
                  }
                  _this.model
                    .create(userdata)
                    .then(result => {
                      if (avatarlink !== "") {
                        let options = {
                          url: avatarlink,
                          dest:
                            "./public/images/avatars/" + result._id + ".jpg", // Save to /path/to/dest/photo
                          extractFilename: false
                        };
                        success++;
                        download
                          .image(options)
                          .then(({ filename, image }) => {
                            console.log("Saved to", filename); // Saved to /path/to/dest/photo
                            _this.model.updateAvatar(
                              result._id,
                              filename.replace("./public", "/static")
                            );
                          })
                          .catch(err => console.error(err));
                      }
                      _this.videos
                        .createFromYoutube(result._id, videos)
                        .then(result => {
                          console.log("sdfsdf", result);
                        })
                        .catch(err => {
                          console.log(err);
                        });
                      callback();
                    })
                    .catch(err => {
                      console.log(err);
                      fails++;
                      Fieled.push({
                        username: item[3],
                        email: item[4],
                        message: "Failed saving into data base: " + err.message
                      });
                      callback();
                    });
                })
                .catch(err => {
                  //console.log(err);
                  userdata.avatar = "/static/images/avatar/default.png";
                  _this.model
                    .create(userdata)
                    .then(result => {
                      callback();
                    })
                    .catch(err => {
                      fails++;
                      Fieled.push({
                        username: item[3],
                        email: item[4],
                        message: "Failed saving into data base: " + err.message
                      });
                      callback();
                    });
                });
            },
            function (err) {
              Res.setData({
                success: success,
                fails: fails,
                fieled: Fieled
              });
              Res.send();
              console.log("completed import");
            }
          );
          console.log("end --------------------");
        });
    })
    .catch(err => {
      console.log(err.message);
      Res.addNotice("Document is not Uploaded");

      Res.errorParse(err);
      Res.send();
    });
};

/**
 * @api {post} api/users/remove
 * @apiName Remove
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Remove user account from documents
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {Object} list List all user that will be removed
 *
 * @apiError (Error 4xx) IncorectCredetials User with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.remove = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  var listUsers = req.body.list;

  this.model
    .removeMany(listUsers)
    .then(data => {
      Res.setData(data);
      Res.send();
    })
    .catch(err => {
      console.log(err);
      Res.errorParse(err);
      Res.send();
    });
};

/**
 * Process to sending e-mail to the user
 */
UserController.prototype.sendingMail = function (userId, data, mail) {
  var promise = new Promise((resolve, reject) => {
    this.model
      .one(userId)
      .then(user => {
        let url =
          "https://jifcam.com/" + user.username + "/" + user.validationCode;
        mail
          .send(
            user.email,
            data.subject,
            {
              text: data.messages.text.replace("#LINK", url),
              html: data.messages.html.replace("#LINK", url)
            },
            data.from
          )
          .then(res => {
            this.model
              .update(userId, { mailSended: true, lastMail: Date.now() })
              .then(result => {
                resolve(userId);
              })
              .catch(err => {
                reject(err);
              });
          })
          .catch(err => {
            reject(err);
          });
      })
      .catch(err => {
        reject(err);
      });
  });

  return promise;
};

/**
 * @api {post} api/users/video-list
 * @apiName Video List
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription View following user's videos by their id
 *
 * @apiParam {String} userId A object id of the target user
 * @apiParam {String} followingId A object id of the current user
 *
 * @apiError (Error 400) IncorrectCredentials User with the provided id does not exist
 * @apiError (Error 400) IncorrectTarget Target with the provided id does not exist
 * @apiError (Error 500) ServerError Unexpected server error
 *
 */
UserController.prototype.videoList = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  var userId = req.body.userId;
  var following = req.body.followingId;

  this.model
    .one(userId)
    .then(result => {
      if (result) {
        if (result.suspend == null || result.suspend == undefined) {
          result.suspend = false
        }

        if (result.suspend) {
          return
        }

        this.model
          .videoList(result, following)
          .then(doc => {
            Res.setData(doc);
            Res.send();
          })
          .catch(err => {
            Res.setData(err);
            Res.status = 400;
            Res.send();
          });
      } else {
        Res.setData({
          message: `The provided userId does not exist`
        });
        Res.status = 400;
        Res.send();
      }
    })
    .catch(err => {
      console.log(err.message);
      Res.errorParse(err);
      Res.status = 500;
      Res.send();
    });
};

/**
 * @api {GET} api/users/following-list
 * @apiName Follwing List
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription View following users
 *
 * @apiParam {String} userId A object id of the target user
 *
 * @apiError (Error 400) IncorrectCredentials User with the provided id does not exist
 * @apiError (Error 400) IncorrectTarget Target with the provided id does not exist
 * @apiError (Error 500) ServerError Unexpected server error
 *
 */
UserController.prototype.getFollowings = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);

  var userId = req.user._id;

  this.model
    .one(userId)
    .then(result => {
      if (result) {
        this.model
          .followersList(result._id)
          .then(doc => {
            Res.setData(doc);
            Res.send();
          })
          .catch(err => {
            Res.setData(err);
            Res.status = 400;
            Res.send();
          });
      } else {
        Res.setData({
          message: `The provided userId does not exist`
        });
        Res.status = 400;
        Res.send();
      }
    })
    .catch(err => {
      console.log(err.message);
      Res.errorParse(err);
      Res.status = 500;
      Res.send();
    });
};


/**
 * @api {post} api/users/device
 * @apiName Device
 * @apiGroup User
 * @apiVersion 0.0.1
 * @apiDescription Send user device id
 *
 * @apiParam {String} deviceId A object id of the user's device
 *
 * @apiError (Error 4xx) NoDeviceId deviceId not found
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
UserController.prototype.getDevice = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  try {
    var deviceId = req.body.deviceId;
    if (deviceId) {
      req.session.deviceId = deviceId;
      Res.setData({
        message: `DeviceId saved`
      });
      Res.send();
    } else {
      Res.setData({
        message: `No deviceId found`
      });
      Res.status = 400;
      Res.send();
    }
  }
  catch (err) {
    Res.errorParse(err);
    Res.status = 500;
    Res.send();
  };
};

UserController.prototype.router = function () {
  let router = Router();

  /** Create new account with email & password */
  router.post("/register", this.register.bind(this));

  /** Save deviceId */
  router.post("/device", this.device.bind(this));

  /** Choose username by parameter */
  router.post("/register/identity", this.choose.bind(this));

  /** Enable notification to user */
  router.post("/register/notify", this.notify.bind(this));

  /** Follow someone by user */
  router.post("/register/follow", this.follow.bind(this));

  /** unFollow someone by user */
  router.post("/register/unfollow", this.unfollow.bind(this));

  /** Verification by object id */
  router.post(
    "/verify/:id",
    function (req, res, next) {
      next();
    },
    this.verifyUser.bind(this)
  );

  /** List all users */
  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    this.getAll.bind(this)
  );

  /** See videos of a following user */
  router.post(
    "/video-list",
    passport.authenticate("jwt", { session: false }),
    this.videoList.bind(this)
  );

  /** Get all following users list */
  router.get(
    "/following-list",
    passport.authenticate("jwt", { session: false }),
    this.getFollowings.bind(this)
  );

  /** get user by ID */
  router.get(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    this.getOne.bind(this)
  );

  /** Update user by ID */
  router.put(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    this.update.bind(this)
  );

  /** Get user by code */
  router.get(
    "/code/:code",
    function (req, res, next) {
      next();
    },
    this.getOneByCode.bind(this)
  );

  /** Sign in with credential */
  router.post(
    "/auth",
    function (req, res, next) {
      next();
    },
    this.authenticate.bind(this)
  );

  /** Get verified user by username & code */
  router.get(
    "/verify/identity/:username/:code",
    function (req, res, next) {
      next();
    },
    this.verified.bind(this)
  );

  /** Count all verified user */
  router.get(
    "/verify/count/",
    passport.authenticate("jwt", { session: false }),
    this.countingVerified.bind(this)
  );

  /** Send mail to the user */
  router.post(
    "/mail",
    passport.authenticate("jwt", { session: false }),
    this.sendMail.bind(this)
  );

  /** Import all users by CSV file*/
  router.post(
    "/import",
    passport.authenticate("jwt", { session: false }),
    this.import.bind(this)
  );

  /** Remove user account from documents */
  router.post(
    "/remove",
    passport.authenticate("jwt", { session: false }),
    this.remove.bind(this)
  );

  // save user's device to session
  router.post(
    "/device",
    this.getDevice.bind(this)
  );

  return router;
};

module.exports = UserController;