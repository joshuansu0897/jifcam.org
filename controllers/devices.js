var DeviceModel = require("../models/device");
var Router = require("express").Router;
const ResponseHelper = require("../helpers/response");

function DeviceController() {
  this.model = new DeviceModel();
}

DeviceController.prototype.getDeviceData = function (result) {
  return {
    deviceId: result.deviceId
  };
};

/**
 * @api {post} api/devices/register
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
DeviceController.prototype.register = function (req, res, next) {
  const Res = new ResponseHelper.Response(res);
  var deviceId = req.session ? req.session.deviceId : '';
  if (deviceId === null || deviceId === undefined || deviceId === '') {
    deviceId = req.body.deviceId;
  }
  if (deviceId === null || deviceId === undefined || deviceId === '') {
    Res.setData({
      message: "missing deviceId."
    });
    Res.status = 400;
    return
  }

  this.model
    .register(deviceId)
    .then(doc => {
      Res.setData({
        ...doc._doc
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

DeviceController.prototype.router = function () {
  let router = Router();

  /** Save deviceId */
  router.post("/register", this.register.bind(this));

  return router;
};

module.exports = DeviceController;