var ResponseHelper = require("../helpers/response");
var passport = require("passport");
var Router = require("express").Router;
var ImageModel = require("../models/images");

function ImageController() {
  this.model = new ImageModel();
}

/**
 * @api {post}  api/images/update
 * @apiName UpdateImage
 * @apiGroup Image
 * @apiVersion 0.0.1
 * @apiDescription Update a Image
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiSuccess {String} filename > soon
 * @apiSuccess {String} encode > soon
 *
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
ImageController.prototype.upload = function (req, res, next) {
  var Res = new ResponseHelper.Response(res);
  this.model
    .upload(req.body)
    .then(result => {
      Res.setData(result);
      Res.send();
    })
    .catch(err => {
      console.log(err.message);
      Res.errorParse(err);
      Res.send();
    });
};

ImageController.prototype.router = function () {
  let router = Router();

  router.post(
    "/upload",
    passport.authenticate("jwt", { session: false }),
    this.upload.bind(this)
  );

  return router;
};


module.exports = ImageController;
