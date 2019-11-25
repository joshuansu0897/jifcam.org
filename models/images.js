var mongoose = require("mongoose");
var async = require("async");
const Joi = require("@hapi/joi");
const fs = require("fs");
const path = require("path");
var config = require("../config").config;
var S3Helper = require("../helpers/s3-helper");
var firebase = require("firebase-admin");
const ObjectId = mongoose.Schema.Types.ObjectId;
var ImageHelper = require("../helpers/images");

function ImageModel() {
  this.name = "images";
  this.schema = mongoose.Schema({
    filename: String,
    encode: String,
    uploadDate: { type: Date, default: Date.now },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  });

  this.schema.pre(["save", "updateOne", "update"], function (next) {
    this.updated = Date.now();
    next();
  });

  this.validator = Joi.object().keys({
    filename: Joi.string().required(),
    encode: Joi.string().required(),
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

ImageModel.prototype.upload = function (data) {
  var _this = this;
  var Img = new ImageHelper();
  let listCallbacks = [
    function (callback) {
      Joi.validate(data, _this.validator, callback);
    },
    function (data, callback) {
      _this.uploadToAWSS3(Img.uploadImage(data))
      _this.modelDB.create(data, callback)
    }
  ];
  let promise = new Promise((resolve, reject) => {
    async.waterfall(listCallbacks, async function (error, result) {
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

ImageModel.prototype.uploadToAWSS3 = function (path) {
  var accessKey = config.AWS_ACCESS_KEY.replace(/(\r\n|\n|\r)/gm, "")
  var secretKey = config.AWS_SECRET_ACCESS_KEY.replace(/(\r\n|\n|\r)/gm, "")
  var bucketName = config.AWS_S3_BUCKET_NAME.replace(/(\r\n|\n|\r)/gm, "")
  console.log(accessKey)
  console.log(secretKey)
  var S3 = new S3Helper(
    {
      AWS_ACCESS_KEY: accessKey,
      AWS_SECRET_ACCESS_KEY: secretKey
    },
    bucketName
  );

  console.log("uploadToAWSS3 method********************************, s3", S3);
  S3.upload(path)
    .then(url => {
      console.log(
        "succcess.....uploadToAWSS3 method********** *******",
        url
      )
    })
    .catch(err => {
      console.log("s3 error...", err);
    });

  fs.unlinkSync(path)
};

module.exports = ImageModel;
