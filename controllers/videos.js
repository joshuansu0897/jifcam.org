<<<<<<< HEAD
var ResponseHelper = require("../helpers/response");
var passport = require("passport");
var Router = require("express").Router;
var async = require("async");
var VideoModel = require("../models/videos");
var LikeModel = require("../models/like");

function VideoController() {
  this.model = new VideoModel();
}

/**
 * @api {get}  /api/videos
 * @apiName Import
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription import Videos
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {Number} offset offset start Videos list
 * @apiParam {Number} limit limit of Video in list
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.list = function(req, res, next) {
  console.log(" request List ");

  var Res = new ResponseHelper.Response(res);
  let limit = 25;

  if (typeof req.query.limit != "undefined") limit = parseInt(req.query.limit);

  this.model
    .list(req.query.user, limit)
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

/**
 * @api {get}  /api/videos/master/list
 * @apiName Import
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription get master list of videos
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.masterList = function(req, res, next) {
  console.log(" request List ");

  var Res = new ResponseHelper.Response(res);
  let limit = 10;
  let skip = 0;
  console.log(req.params);
  // if (typeof req.query.limit != "undefined") limit = parseInt(req.query.limit);
  if (typeof req.params.skip != "undefined") skip = parseInt(req.params.skip);
  console.log(limit, skip);
  this.model
    .masterList(limit, skip)
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

/**
 * @api {post}  /api/videos/dummy
 * @apiName CreateDummy
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription Create Dummy Video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userId object id
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.createDummy = function(req, res, next) {
  console.log("create dummy");
  var Res = new ResponseHelper.Response(res);
  this.model
    .createDummy(req.body.userId)
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

/**
 * @api {post}  /api/videos/create
 * @apiName CreateVideo
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription Create a Video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userId object id
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.create = function(req, res, next) {
  console.log("create video");
  var Res = new ResponseHelper.Response(res);
  this.model
    .create(req.body)
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

/**
 * @api {post}  /api/videos/update
 * @apiName UpdateVideo
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription Update a Video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userId object id
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.update = function(req, res, next) {
  console.log("update video");
  var Res = new ResponseHelper.Response(res);
  this.model
    .update(req.body.id, req.body)
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


/**
 * @api {post}  /api/videos/like/:videoId/:userId/:like
 * @apiName likeVideo
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription like a Video pass last argument true or false
 *
 * @apiParam {String} videoId object id
 * @apiParam {String} userId object id
 * @apiParam {Boolean} like true or false for likeing the video
 * 
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiSuccess {Number} status > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.like = async function(req, res, next) {
  console.log("like video");
  var Res = new ResponseHelper.Response(res);
  const likeModel = new LikeModel();
  try {
    const result = await likeModel.like(req.params.userId, req.params.videoId, req.params.like === 'true')
    console.log(result);
    Res.setData(result);
    Res.send();
  } catch (err) {
    console.log(err.message);
    Res.errorParse(err);
    Res.send();
  }
};

/**
 * @api {get}  /api/videos/remove
 * @apiName RemoveVideo
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription like a Video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userId object id
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.remove = function(req, res, next) {
  console.log("remove video");
  var Res = new ResponseHelper.Response(res);
  this.model
    .remove(req.body.id)
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

VideoController.prototype.router = function() {
  let router = Router();

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    this.list.bind(this)
  );

  router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    this.create.bind(this)
  );

  router.post(
    "/update",
    passport.authenticate("jwt", { session: false }),
    this.update.bind(this)
  );

  router.get(
    "/master/list",
    passport.authenticate("jwt", { session: false }),
    this.masterList.bind(this)
  );
  
  router.get(
    "/master/list/:skip",
    passport.authenticate("jwt", { session: false }),
    this.masterList.bind(this)
  );

  router.get(
    "/like/:videoId/:userId/:like",
    passport.authenticate("jwt", { session: false }),
    this.like.bind(this)
  );

  router.post(
    "/remove",
    passport.authenticate("jwt", { session: false }),
    this.remove.bind(this)
  );

  router.post(
    "/dummy",
    passport.authenticate("jwt", { session: false }),
    this.createDummy.bind(this)
  );

  return router;
};

module.exports = VideoController;
=======
var ResponseHelper = require("../helpers/response");
var passport = require("passport");
var Router = require("express").Router;
var async = require("async");
var VideoModel = require("../models/videos");
var LikeModel = require("../models/like");

function VideoController() {
  this.model = new VideoModel();
}

/**
 * @api {get}  /api/videos
 * @apiName Import
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription import Videos
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {Number} offset offset start Videos list
 * @apiParam {Number} limit limit of Video in list
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.list = function(req, res, next) {
  console.log(" request List ");

  var Res = new ResponseHelper.Response(res);
  let limit = 25;

  if (typeof req.query.limit != "undefined") limit = parseInt(req.query.limit);

  this.model
    .list(req.query.user, limit)
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

/**
 * @api {get}  /api/videos/master/list
 * @apiName Import
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription get master list of videos
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.masterList = function(req, res, next) {
  console.log(" request List ");

  var Res = new ResponseHelper.Response(res);
  let limit = 25;
  let skip = 0;
  console.log(req.params);
  if (typeof req.query.limit != "undefined") limit = parseInt(req.query.limit);
  if (typeof req.params.skip != "undefined") skip = parseInt(req.params.skip);
  console.log(limit, skip);
  this.model
    .masterList(limit, skip)
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

/**
 * @api {post}  /api/videos/dummy
 * @apiName CreateDummy
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription Create Dummy Video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userId object id
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.createDummy = function(req, res, next) {
  console.log("create dummy");
  var Res = new ResponseHelper.Response(res);
  this.model
    .createDummy(req.body.userId)
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

/**
 * @api {post}  /api/videos/create
 * @apiName CreateVideo
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription Create a Video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userId object id
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.create = function(req, res, next) {
  console.log("create video");
  var Res = new ResponseHelper.Response(res);
  this.model
    .create(req.body)
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

/**
 * @api {post}  /api/videos/update
 * @apiName UpdateVideo
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription Update a Video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userId object id
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.update = function(req, res, next) {
  console.log("update video");
  var Res = new ResponseHelper.Response(res);
  this.model
    .update(req.body.id, req.body)
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

/**
 * @api {post}  /api/videos/like/:videoId/:userId/:like
 * @apiName likeVideo
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription like a Video pass last argument true or false
 *
 * @apiParam {String} videoId object id
 * @apiParam {String} userId object id
 * @apiParam {Boolean} like true or false for likeing the video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiSuccess {Number} status > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.like = async function(req, res, next) {
  console.log("like video");
  var Res = new ResponseHelper.Response(res);
  const likeModel = new LikeModel();
  try {
    const result = await likeModel.like(
      req.params.userId,
      req.params.videoId,
      req.params.like === "true"
    );
    console.log(result);
    Res.setData(result);
    Res.send();
  } catch (err) {
    console.log(err.message);
    Res.errorParse(err);
    Res.send();
  }
};

/**
 * @api {get}  /api/videos/remove
 * @apiName RemoveVideo
 * @apiGroup Video
 * @apiVersion 0.0.1
 * @apiDescription like a Video
 *
 * @apiHeader {String} authorization Authorization value ('Bearer <token>').
 *
 * @apiParam {String} userId object id
 *
 * @apiSuccess {Number} status > soon
 * @apiSuccess {String[]} thumbnails > soon
 * @apiSuccess {String} user > soon
 * @apiSuccess {String} youtubeURL > soon
 * @apiSuccess {String} path > soon
 * @apiSuccess {String} title > soon
 * @apiSuccess {String} description > soon
 * @apiSuccess {Date} uploadDate > soon
 * @apiSuccess {Date} created > soon
 * @apiSuccess {Date} updated > soon
 * @apiSuccess {String[]} warnings > soon
 * @apiSuccess {String[]} notice > soon
 *
 * @apiError (Error 4xx) IncorectCredetials Video with sended email not found
 * @apiError (Error 4xx) FieledAuthetication Fieled Creating
 * @apiError (Error 5xx) ServerError Unexpected server error
 *
 */
VideoController.prototype.remove = function(req, res, next) {
  console.log("remove video");
  var Res = new ResponseHelper.Response(res);
  this.model
    .remove(req.body.id)
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

VideoController.prototype.router = function() {
  let router = Router();

  router.get(
    "/",
    passport.authenticate("jwt", { session: false }),
    this.list.bind(this)
  );

  router.post(
    "/create",
    passport.authenticate("jwt", { session: false }),
    this.create.bind(this)
  );

  router.post(
    "/update",
    passport.authenticate("jwt", { session: false }),
    this.update.bind(this)
  );

  router.get(
    "/master/list",
    passport.authenticate("jwt", { session: false }),
    this.masterList.bind(this)
  );

  router.get(
    "/master/list/:skip",
    passport.authenticate("jwt", { session: false }),
    this.masterList.bind(this)
  );

  router.get(
    "/like/:videoId/:userId/:like",
    passport.authenticate("jwt", { session: false }),
    this.like.bind(this)
  );

  router.post(
    "/remove",
    passport.authenticate("jwt", { session: false }),
    this.remove.bind(this)
  );

  router.post(
    "/dummy",
    passport.authenticate("jwt", { session: false }),
    this.createDummy.bind(this)
  );

  return router;
};

module.exports = VideoController;
>>>>>>> edlugora
