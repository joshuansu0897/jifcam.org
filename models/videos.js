var mongoose = require("mongoose");
var async = require("async");
const Joi = require("@hapi/joi");
const fs = require("fs");
const path = require("path");
var config = require("../config").config;
var S3Helper = require("../helpers/s3-helper");
var firebase = require("firebase-admin");
const ObjectId = mongoose.Schema.Types.ObjectId;

function VideoModel() {
  this.name = "videos";
  this.schema = mongoose.Schema({
    user: ObjectId,
    youtubeURL: String,
    status: { type: Number, default: 0 },
    path: String,
    thumbnails: [String],
    title: String,
    description: String,
    uploadDate: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  });

  this.schema.pre(["save", "updateOne", "update"], function(next) {
    this.updated = Date.now();
    next();
  });

  this.validator = Joi.object().keys({
    user: Joi.any(),
    youtubeURL: Joi.string().optional(),
    status: Joi.number().required(),
    path: Joi.string(),
    thumbnails: Joi.array().items(Joi.string()),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    uploadDate: Joi.any().optional(),
    videoUploaded: Joi.boolean().optional(),
    keyword: Joi.string().optional()
  });

  this.modelDB;
  try {
    this.modelDB = mongoose.model(this.name);
  } catch (err) {
    this.modelDB = mongoose.model(this.name, this.schema);
  }
}

VideoModel.prototype.createDummy = function(user) {
  let promise = new Promise((resolve, reject) => {
    return this.modelDB.create(
      {
        user: user,
        youtubeURL: "youtube.com/test",
        path: "/static/images/avatars/default.png",
        thumbnails: "/static/images/avatars/default.png",
        title: "sample",
        description: "dummy data",
      },
      function(err, res) {
        if (err) {
          reject(err);
        }

        resolve(res)
      }
    );
  })

  return promise
}

VideoModel.prototype.createFromYoutube = function(user, urls) {
  var data = [];
  console.log("user, urls", user, urls);
  /**/
  let listCallbacks = [
    callback => {
      async.eachSeries(
        urls,
        (url, cb) => {
          if (data.length < 6)
            data.push({
              user: user,
              youtubeURL: url,
              status: 0,
              thumbnails: []
            });
          cb();
        },
        function() {
          callback(null, data);
        }
      );
    },
    (list, callback) => {
      console.log("---- list --- ", list);
      this.modelDB.create(list, callback);
    }
  ];
  var promise = new Promise((resolve, reject) => {
    async.waterfall(listCallbacks, function(err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  return promise;
};

VideoModel.prototype.list = function(user, limit = -1) {
  const ObjectId = mongoose.Types.ObjectId
  let promise = new Promise((resolve, reject) => {
    var callback = function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
    var q;

    if (user && ObjectId.isValid(user)) {
      q = this.modelDB.find({ user: new ObjectId(user), status: 2 });
    } else {
      q = this.modelDB.find({ status: 2 });
    }

    console.log(limit);

    if (limit > 0) {
      q.limit(limit);
    }

    q.sort({
      uploadDate: -1
    })

    q.exec(callback);
  });

  return promise;
};

VideoModel.prototype.masterList = function(limit, skip) {
  console.log("masterlist")
  const ObjectId = mongoose.Types.ObjectId
  let promise = new Promise((resolve, reject) => {
    var callback = function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    };
    var q;
    q = this.modelDB.find({status: 2});

    console.log(limit, skip);

    if (skip > 0) {
      q.skip(skip);
    }

    if (limit > 0) {
      q.limit(limit);
    }

    q.sort({
      uploadDate: -1
    })

    q.exec(callback);
  });

  return promise;
};

VideoModel.prototype.update = function(id, data) {
  var _this = this;
  let promise = new Promise((resolve, reject) => {
    _this.modelDB.updateOne({ _id: id }, data, function(err, doc) {
      if (err) {
        reject(err);
      } else {
        resolve(doc);
      }
    });
  });

  return promise;
};

VideoModel.prototype.countVideos = function(userId) {
  var _this = this;
  let promise = new Promise((resolve, reject) => {
    _this.modelDB
      .where({})
      .countDocuments({ user: userId }, function(err, count) {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      });
  });

  return promise;
};

VideoModel.prototype.removeAllForUser = function(userId) {
  var _this = this;

  var promise = new Promise((resolve, reject) => {
    this.modelDB.find({ user: userId }, (err, documents) => {
      async.eachSeries(
        documents,
        (item, _cb) => {
          _this
            .remove(item._id)
            .then(res => {
              _cb();
            })
            .catch(() => {
              _cb();
            });
        },
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });

  return promise;
};

VideoModel.prototype.remove = function(id) {
  var _this = this;

  var list = [
    cb => {
      this.modelDB.findById(id, cb);
    },
    (doc, cb) => {
      // remove thumbnails
      if (doc.thumbnails.length) {
        async.eachSeries(
          doc.thumbnails,
          (item, _call) => {
            var _path = item.replace("/static", "../public");
            var link = path.resolve(__dirname, _path);
            console.log("remove function.........",link + _path );
            fs.unlink(link, () => {
              _call();
            });
          },
          function(err) {
            cb(null, doc);
          }
        );
      } else {
        cb(null, doc);
      }
    },
    (doc, cb) => {
       // // remove
      // var _path = doc.path.replace("/static", "../public");
      console.log(" is undefined  ", doc);
      if (typeof doc.path === "undefined") {
        console.log(" is undefined  ", doc.path);
        cb(null, doc);
      } else if (doc.path.indexOf("https://") !== -1) {
        var S3 = new S3Helper(
          {
            AWS_ACCESS_KEY: config.AWS_ACCESS_KEY,
            AWS_SECRET_ACCESS_KEY: config.AWS_SECRET_ACCESS_KEY
          },
          config.AWS_S3_BUCKET_NAME
        );

        var splited = doc.path.split("/");
        console.log(
          "splited[splited.length - 1] ",
          splited[splited.length - 1]
        );
        S3.remove(splited[splited.length - 1])
          .then(res => {
            cb(null, doc);
          })
          .catch(err => {
            cb(null, doc);
          });
      } else {
        var _path = doc.path.replace("/static", "../public");
        console.log('hereeeeeeee is the path',_path);
        console.log('hereeeeeeee is the document......',doc);
        fs.unlink(_path, () => {
          cb(null, doc);
        });
      }
    },
    (doc, cb) => {
      this.modelDB.deleteOne({ _id: doc._id }, cb);
    }
  ];

  var promise = new Promise((resolve, reject) => {
    async.waterfall(list, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  return promise;
};

VideoModel.prototype.create = function(data) {
  var _this = this;
  let listCallbacks = [
    function(callback) {
      Joi.validate(data, _this.validator, callback);
    },
    function(data, callback) {
      _this.modelDB.create(data, callback);
    }
  ];
  let promise = new Promise((resolve, reject) => {
    async.waterfall(listCallbacks,async function(error, result) {
      if (error) {
        if (error.code === 11000) {
          reject(new Error("UniqueDublication"));
        } else {
          reject(error);
        }
      } else {
        const UserModel = require('./users');
        const userModel = new UserModel();
        const id = result.user;

        const userResult = await userModel.modelDB.findById(id).populate('followers.user');
        const tokens = userResult.followers.map(item=>{
          return item.user.notificationPushToken || []
        }).reduce((acc, item)=>{
          return [
            ...acc,
            ...item,
          ]
        }, []).filter(item=> item && item !== '')
        
        firebase.messaging().sendToDevice(tokens,  {
          notification: {
            title: `${userResult.username} added a new video`,
            body: `check it out`
          }
        })
        resolve(result);
      }
    });
  });

  return promise;
};

module.exports = VideoModel;
