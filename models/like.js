var mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const UserModel = require('./users');
const VideoModel = require('./videos');
var firebase = require("firebase-admin");

function LikeModel() {
  this.name = "likes";
  this.schema = mongoose.Schema({
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users'
    },
    video: {
      type: mongoose.Schema.ObjectId,
      ref: 'videos'
    },
    like:  { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  });

  this.schema.pre(["save", "updateOne", "update"], function(next) {
    this.updated = Date.now();
    next();
  });

  this.validator = Joi.object().keys({
    user: Joi.string().required(),
    video: Joi.string().required(),
    like: Joi.bool().required()
  });

  this.modelDB;
  try {
    this.modelDB = mongoose.model(this.name);
  } catch (err) {
    this.modelDB = mongoose.model(this.name, this.schema);
  }
}

LikeModel.prototype.like = function(userId, videoId, like) {

 let _this = this
  let promise = new Promise(async (resolve, reject) => {
    if (mongoose.Types.ObjectId.isValid(userId) && mongoose.Types.ObjectId.isValid(videoId)) {
      try {
        const videoModel = new VideoModel();
        const userModel = new UserModel();
        const videoResult = await videoModel.modelDB.findOne({_id: videoId});
        const userResult = await userModel.modelDB.findOne({_id: userId});
        if(!videoResult || !userResult){
          reject({
            message: "object ids do not correspond to real objects"
          })
          return false
        }
        const tokens = (userResult.notificationPushToken || []).filter(item=> item && item !== '');

        const payload = {
          notification: {
            title: `${userResult.username} liked your video`,
            body: `Upload new video to get more likes`
          },
        };
        console.log(tokens, payload)
        const data = await _this.modelDB.findOne({
          video: mongoose.Types.ObjectId(videoId),
          user: mongoose.Types.ObjectId(userId),
        })
        if(!data) {
          const result = await _this.modelDB.create({
            video: mongoose.Types.ObjectId(videoId),
            user: mongoose.Types.ObjectId(userId),
            like
          })
          firebase.messaging().sendToDevice(tokens, payload)
          resolve(result)
          return true;
        }
        firebase.messaging().sendToDevice(tokens, payload)
        const result = await _this.modelDB.updateOne({ _id: data._id }, {
          like
        })
        resolve(result)
        return true
      } catch (error) {
        reject(error);
        return false
      }

    } else {
      reject({
        message: "Please insert valid object id"
      })

      return false
    }
  });

  return promise;
}

module.exports = LikeModel;
