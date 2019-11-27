var mongoose = require("mongoose");
var async = require("async");
const Joi = require("@hapi/joi");

function DeviceModel() {
  this.name = "devices";
  this.schema = mongoose.Schema({
    deviceId: String,
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  });

  this.schema.pre(["save", "updateOne", "update"], function (next) {
    this.updated = Date.now();
    next();
  });

  this.validator = Joi.object().keys({
    deviceId: Joi.string().required()
  });

  this.modelDB;
  try {
    this.modelDB = mongoose.model(this.name);
  } catch (err) {
    this.modelDB = mongoose.model(this.name, this.schema);
  }
}

/**
 * device Method
 */
DeviceModel.prototype.register = function (deviceId) {
  console.log("here i am save device");
  var _this = this;
  let data = {
    deviceId: deviceId
  }
  let listCallbacks = [
    function (callback) {
      Joi.validate(data, _this.validator, callback);
    },
    function (data, callback) {
      _this.modelDB.create(data, callback);
    }
  ];
  let promise = new Promise((resolve, reject) => {
    async.waterfall(listCallbacks, function (error, result) {
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

module.exports = DeviceModel;