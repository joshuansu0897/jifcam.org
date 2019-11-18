var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
var uniqid = require("uniqid");
var async = require("async");
const Joi = require("@hapi/joi");
const VideoModel = require("./videos");
const path = require("path");
const fs = require("fs");
//var Promise = require('es6-promise');
//var DefaultModel = './default-model';

const SALT_FACTOR = 12;
const ObjectId = mongoose.Schema.Types.ObjectId;

function UserModel() {
  this.name = "users";
  this.schema = mongoose.Schema({
    id: ObjectId,
    fullname: String,
    username: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    avatar: String,
    youtubeChannel: { type: String, default: "" },
    role: { type: Number, default: 1 }, // 0 - Administrator
    verified: { type: Boolean, default: false },
    validationCode: { type: String, unique: true },
    notificationMail: { type: Boolean, default: false },
    notificationMessage: { type: Boolean, default: false },
    notificationPush: { type: Boolean, default: false },
    notificationPushToken: [{ type: String, default: "" }],
    videoUploaded: { type: Boolean, default: false },
    mailSended: { type: Boolean, default: false },
    lastMail: { type: Date, default: Date.now },
    language: { type: String, default: "English" },
    keyword: { type: String, default: "makeup" },
    deviceIds: [String],
    following: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "users"
        }
      }
    ],
    followers: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "users"
        }
      }
    ],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  });

  this.schema.pre(["save", "updateOne", "update"], function(next) {
    // handling adding and updating data to db
    const user = this;
    //console.log(this, this.isModified, salt);
    this.updated = Date.now();
    if (!user.password) next();
    if (this.isModified && !user.isModified("password")) {
      next();
    } else {
      if (user.password.indexOf("$" + SALT_FACTOR + "$") > 0) {
        next();
      }
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
      // ganarate hash for password and save hash in db instead of password
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  });

  this.schema.methods.comparePassword = function(candidatePassword, next) {
    // add to user model function comparing passwords
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      if (err) {
        return next(err);
      }
      next(null, isMatch);
    });
  };

  this.validator = Joi.object().keys({
    email: Joi.string(),
    fullname: Joi.string()
      .min(3)
      .max(60),
    username: Joi.string()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .min(6)
      .max(30),
    role: Joi.number(),
    avatar: Joi.string().empty(""),
    verified: Joi.boolean(),
    lenguage: Joi.string().optional(),
    videoUploaded: Joi.boolean().optional(),
    keyword: Joi.string().optional(),
    validationCode: Joi.string().optional(),
    youtubeChannel: Joi.string().optional()
  });

  this.signUpValidator = Joi.object().keys({
    email: Joi.string(),
    password: Joi.string()
      .min(6)
      .max(30)
  });

  this.modelDB;
  try {
    this.modelDB = mongoose.model(this.name);
  } catch (err) {
    this.modelDB = mongoose.model(this.name, this.schema);
  }
}

/**
 * checkCredantial Method
 */
UserModel.prototype.checkCredantial = function(email, password) {
  let promise = new Promise((resolve, reject) => {
    this.modelDB
      .findOne({ $or: [{ email: email }, { username: email }] })
      .then(user => {
        // console.log("checkCredantial res", user);
        user.comparePassword(password, (err, isMatch) => {
          if (err) {
            reject(err);
            return false;
          }
          if (isMatch) {
            resolve(user);
          } else {
            reject(new Error("Password not match"));
          }
        });
      })
      .catch(err => {
        console.log("checkCredantial err", err);
        reject(err);
      });
  });

  return promise;
};

/**
 * checkSuperAdmin Method
 */
UserModel.prototype.checkSuperAdmin = function(config) {
  let _this = this;
  let promise = new Promise((resolve, reject) => {
    async.waterfall(
      [
        callback => {
          this.modelDB.findOne(
            {
              $or: [
                { username: config.SUPERADMIN_USERNAME },
                { email: config.SUPERADMIN_EMAIL }
              ]
            },
            function(err, doc) {
              if (err) {
                callback(null, null);
              } else {
                callback(null, doc);
              }
            }
          );
        },
        (doc, callback) => {
          if (doc) {
            callback(null, doc);
          } else {
            this.modelDB.create(
              {
                email: config.SUPERADMIN_EMAIL,
                fullname: "Super Admin",
                username: config.SUPERADMIN_USERNAME,
                password: config.SUPERADMIN_PASSWORD,
                role: 0,
                avatar: "/static/images/avatars/default.png",
                verified: true
              },
              function(err, res) {
                if (err) {
                  callback(err, null);
                } else {
                  callback(null, null);
                }
              }
            );
          }
        },
        (doc, callback) => {
          if (doc) {
            callback(null, doc);
          } else {
            console.log(doc, callback);
            this.modelDB.findOne({ username: "SuperAdmin" }, callback);
          }
        }
      ],
      function(error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });

  return promise;
};

/**
 * update Method
 */
UserModel.prototype.update = function(userId, data) {
  var promise = new Promise((resolve, reject) => {
    async.waterfall(
      [
        cb => {
          if (mongoose.Types.ObjectId.isValid(userId)) {
            cb(null, userId);
          } else {
            cb(new Error("incorrect ID"), null);
          }
        },
        (id, cb) => {
          this.modelDB.updateOne({ _id: id }, data, (err, doc) => {
            if (err) {
              reject(err);
            }

            this.modelDB.findById(id, cb);
          });
        }
      ],
      function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });

  return promise;
};

/**
 * updateAvatar Method
 */
UserModel.prototype.updateAvatar = function(id, avatar) {
  var _this = this;
  let promise = new Promise((resolve, reject) => {
    _this.modelDB.updateOne({ _id: id }, { avatar: avatar }, function(
      err,
      doc
    ) {
      if (err) {
        reject(err);
      } else {
        resolve(doc);
      }
    });
  });

  return promise;
};

/**
 * countingVerified Method
 */
UserModel.prototype.countingVerified = function() {
  let verified = 0;
  let notVerified = 0;
  let listCallbacks = [
    callback => {
      this.modelDB.countDocuments({ verified: true }, callback);
    },
    (count, callback) => {
      verified = count;
      this.modelDB.countDocuments({ verified: false }, callback);
    },
    (count, callback) => {
      callback(null, { verified: verified, notVerified: count });
    }
  ];
  var promise = new Promise((resolve, reject) => {
    async.waterfall(listCallbacks, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  return promise;
};

/**
 * create Method
 */
UserModel.prototype.create = function(data) {
  var _this = this;
  let listCallbacks = [
    function(callback) {
      Joi.validate(data, _this.validator, callback);
    },
    function(data, callback) {
      _this.modelDB.find(
        {
          username: {
            $regex: "^(" + data.username + ")+[0-9]{0,3}$",
            $options: "i"
          }
        },
        function(err, docs) {
          console.log(err, docs);
          if (err) {
            callback(null, data);
          } else {
            if (docs.length) {
              var number = docs[docs.length - 1].username.replace(
                data.username,
                ""
              );
              if (number) {
                number = parseInt(number) + 1;
              } else {
                number = 1;
              }
              data.username += number;
              console.log(data.username);
              callback(null, data);
            } else {
              callback(null, data);
            }
          }
        }
      );
    },
    function(data, callback) {
      //data.username = List
      data.validationCode = uniqid.time().substr(-4);
      _this.modelDB.create(data, callback);
    }
  ];
  let promise = new Promise((resolve, reject) => {
    async.waterfall(listCallbacks, function(error, result) {
      if (error) {
        if (error.code === 11000) {
          reject(new Error("UniqueDublication"));
        } else {
          reject(error);
        }
      } else {
        resolve(result);
      }
    });
  });

  return promise;
};

/**
 * signup Method
 */
UserModel.prototype.signup = function(email, password, deviceId) {
  console.log("here i am in signup");
  var _this = this;
  let listCallbacks = [
    function(callback) {
      Joi.validate(
        {
          email: email,
          password: password
        },
        _this.signUpValidator,
        callback
      );
    },
    function(data, callback) {
      _this.modelDB.findOne(
        {
          email: data.email
        },
        function(err, res) {
          console.log("RUNNING FUNCTION");
          console.log("RES", res);
          if (err) {
            // do something to validate
            // callback(null, res);
            console.log("ERROR THROWN HERE");
          } else {
            if (res && res.length) {
              console.log("EMAIL EXISTS");
              callback(null, res);
            } else {
              console.log("EMAIL EXISTS 2");
              callback(null, false);
            }
          }
        }
      );
    },
    function(data, callback) {
      if (!data) {
        _this.modelDB.create(
          {
            email: email,
            password: password,
            deviceIds: [deviceId],
            validationCode: uniqid.time().substr(-4)
          },
          callback
        );
      }
    }
  ];
  let promise = new Promise((resolve, reject) => {
    async.waterfall(listCallbacks, function(error, result) {
      if (error) {
        console.log("ERROR IN FUNCTION", error);
        if (error.code === 11000) {
          reject("UniqueDuplication");
        } else {
          reject("InvalidPassword");
        }
      } else {
        resolve(result);
      }
    });
  });

  return promise;
};

/**
 * oneByCode Method
 */
UserModel.prototype.oneByCode = function(code) {
  let promise = new Promise((resolve, reject) => {
    this.modelDB.findOne({ validationCode: code }, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  return promise;
};

/**
 * oneByUsername Method
 */
UserModel.prototype.oneByUsername = function(username) {
  let promise = new Promise((resolve, reject) => {
    console.log("username", username);
    this.modelDB.findOne({ username: username }, function(err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

  return promise;
};

/**
 * oneVerified Method
 */
UserModel.prototype.oneVerified = function(code, username) {
  let promise = new Promise((resolve, reject) => {
    this.modelDB.findOne(
      {
        validationCode: code,
        username: { $regex: new RegExp("^" + username.toLowerCase(), "i") }
      },
      function(err, res) {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      }
    );
  });

  return promise;
};

/**
 * verify Method
 */
UserModel.prototype.verify = function(id, data) {
  const _this = this;
  let promise = new Promise((resolve, reject) => {
    this.modelDB.updateOne(
      { _id: id, validationCode: data.code },
      { verified: true },
      function(err, doc) {
        if (err) {
          reject(err);
        } else {
          _this.modelDB.findById(id, function(err, result) {
            resolve(result);
          });
        }
      }
    );
  });

  return promise;
};

/**
 * list Method
 */
UserModel.prototype.list = function(offset, limit) {
  let queryCount = this.modelDB.where({}).countDocuments();
  let queryFind = this.modelDB
    .find({})
    .limit(limit)
    .skip(offset);
  let data = {
    offset: offset,
    limit: limit,
    users: [],
    countAll: 0
  };

  var promise = new Promise((resolve, reject) => {
    async.waterfall(
      [
        callback => {
          queryCount.exec(callback);
        },
        (count, callback) => {
          data.countAll = count;
          queryFind.exec(callback);
        },
        (docs, callback) => {
          /*async.map(docs, (item, next)=>{
                    delete item.password;
                    console.log(item, next);
                    //item.avatar = item.avatar
                    next(false, item);
                },(err, result)=>{
                    console.log(" result ");
                    if(err) callback(err, null);
                    data.users = result;
                    callback(null, data);
                  })*/
          data.users = docs;
          callback(null, data);
        }
      ],
      function(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });

  return promise;
};

/**
 * removeMany Method
 */
UserModel.prototype.removeMany = function(ids) {
  let videos = new VideoModel();

  let promise = new Promise((resolve, reject) => {
    async.eachSeries(
      ids,
      (id, _cb) => {
        async.waterfall(
          [
            callback => {
              videos
                .removeAllForUser(id)
                .then(res => {
                  callback(null);
                })
                .catch(err => {
                  callback(err);
                });
            },
            callback => {
              this.modelDB.findById(id, (err, doc) => {
                var _path = doc.avatar.replace("/static", "../public");

                fs.unlink(_path, () => {
                  callback(null);
                });
              });
            },
            callback => {
              this.modelDB.deleteOne({ _id: id }, callback);
            }
          ],
          function(err, result) {
            if (err) {
              _cb(err);
            } else {
              _cb();
            }
          }
        );
      },
      function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );

    /*this.modelDB.deleteMany({_id: { $in: ids }}, function(err, doc){
            if(err){
                reject(err)
            }else{
                resolve(doc);
            }
        })*/
  });

  return promise;
};

/**
 * one Method
 */
UserModel.prototype.one = function(id) {
  let promise = new Promise((resolve, reject) => {
    if (mongoose.Types.ObjectId.isValid(id)) {
      this.modelDB.findOne({ _id: id }, function(err, doc) {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    } else {
      this.modelDB.findOne({ username: id }, function(err, doc) {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    }
  });

  return promise;
};

/**
 * send notification Method
 */
UserModel.prototype.notify = function(user, { title, body }) {
  /**
   * ? TODO :
   *
   * - [ ] Notify by E-mail
   * - [ ] Notify by Messages
   * - [x] Notify by Push Notification
   */
  const firebaseToken = user.notificationPushToken;

  try {
    const payload = {
      notification: {
        title: title,
        body: body
      }
    };

    const options = {
      priority: "high",
      timeToLive: 60 * 60 * 24 // 1 day
    };

    firebase.messaging().sendToDevice(firebaseToken, payload, options);
  } catch (error) {
    console.log(firebaseToken);
    console.log(error);
  }
};

/**
 * follow method
 */
UserModel.prototype.follow = function(user, targetId) {
  let _this = this;
  let promise = new Promise((resolve, reject) => {
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      if (user._id === targetId) {
        reject({
          message: "You can't follow yourself"
        });
      }

      _this.modelDB.findOne({ _id: targetId }, function(err, target) {
        if (err) {
          reject(err);

          return false;
        }

        if (
          target.followers.filter(follower => {
            return follower.user.toString() === user._id.toString();
          }).length > 0
        ) {
          reject({
            message: `You've already follow ${target.username}`
          });

          return false;
        }

        target.followers.unshift({
          user: user._id
        });

        target.save({ validateBeforeSave: false });

        if (target.notificationPushToken) {
          _this.notify(target, {
            title: `${user.username} Following you`,
            body: "Hi there, you've new follower! check it out."
          });
        } else {
          console.log(
            `This user [@${target.username}] doesn't have a notification push token`
          );
        }

        _this.modelDB.findOne({ _id: user._id }, function(err, current) {
          if (err) {
            reject(err);

            return false;
          }

          current.following.unshift({
            user: targetId
          });

          current.save({ validateBeforeSave: false });

          resolve({
            message: `Success following ${target.username}`
          });

          return true;
        });
      });
    } else {
      reject({
        message: "Please insert valid object id"
      });

      return false;
    }
  });

  return promise;
};

/**
 * unfollow method
 */
UserModel.prototype.unfollow = function(user, targetId) {
  let _this = this;
  let promise = new Promise((resolve, reject) => {
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      if (user._id === targetId) {
        reject({
          message: "You can't unfollow yourself"
        });
      }

      _this.modelDB.findOne({ _id: targetId }, function(err, target) {
        if (err) {
          reject(err);

          return false;
        }
        if (
          target.followers.filter(followers => {
            return followers.user.toString() === user._id.toString();
          }).length === 0
        ) {
          reject({
            message: `You are not following ${target.username}`
          });

          return false;
        }

        // target.following.unshift({
        //   user: user._id
        // })

        _this.modelDB.findOneAndUpdate(
          { _id: targetId },
          {
            $pull: {
              followers: { user: user._id }
            }
          }
        );
        // target.save({ validateBeforeSave: false })

        // if (target.notificationPushToken) {
        //   _this.notify(target, {
        //     title: `You unfollow ${user.username}.`,
        //     body: 'You are successfully unfollow ${user.username}.',
        //   })
        // } else {
        //   console.log(`This user [@${target.username}] doesn't have a notification push token`)
        // }

        _this.modelDB.findOne({ _id: user._id }, function(err, current) {
          if (err) {
            reject(err);

            return false;
          }

          // current.followers.unshift({
          //   user: targetId
          // })

          // current.save({ validateBeforeSave: false })

          _this.modelDB.update(
            {
              _id: user._id
            },
            {
              $pull: {
                following: { user: targetId }
              }
            }
          );

          resolve({
            message: `Success following ${target.username}`
          });

          return true;
        });
      });
    } else {
      reject({
        message: "Please insert valid object id"
      });

      return false;
    }
  });

  return promise;
};

/**
 * videos list of following user's
 */
UserModel.prototype.videoList = function(user, targetId) {
  videoModel = new VideoModel();
  let _this = this;
  let promise = new Promise((resolve, reject) => {
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      _this.modelDB.findOne({ _id: targetId }, function(err, target) {
        if (err) {
          reject(err);
          return false;
        }
        if (
          target.followers.filter(follower => {
            return follower.user.toString() === user._id.toString();
          }).length > 0
        ) {
          // TODO:
          let limit = 25;
          videoModel
            .list(target, limit)
            .then(function(list) {
              resolve({ videos_list: list });
              return true;
            })
            .catch(error => {
              reject({ message: error });
              return false;
            });
        } else {
          reject({
            message: `You are not following the target user ${target.username}`
          });

          return false;
        }
      });
    }
  });
  return promise;
};


/**
 * list of followings
 */
UserModel.prototype.followersList = function(userId) {
  videoModel = new VideoModel();
  let _this = this;
  let promise = new Promise((resolve, reject) => {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      _this.modelDB.findOne({ _id: userId })
      .populate({
        path: 'following.user',
        select: 'email avatar username youtubeChannel language keyword fullname',
      }).exec(function(err, userInfo) {
          if (err) {
          reject(err);
          return false;
        } else {
          resolve({ followings: userInfo.following });
          return true;
        }
      });
    }
  });
  return promise;
};

module.exports = UserModel;
