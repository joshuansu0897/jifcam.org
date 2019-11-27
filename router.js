var express = require("express");
var Router = express.Router;

var UserController = require("./controllers/users");
var VideoController = require("./controllers/videos");
var ImageController = require("./controllers/images");
var DeviceController = require("./controllers/devices");
var path = require("path");
const front = require("./controllers/front-react");
const router = Router();

router.get("/", (req, res) => {
  res.json({
    status: 200,
    message: "JIFCAM API",
    data: null,
    errors: []
  });
});

exports.mountRoutes = function(app) {
  const Users = new UserController();
  const Videos = new VideoController();
  const Image = new ImageController();
  const device = new DeviceController();
  const pathDocs = path.resolve(__dirname, "./apidoc");
  const pathPublic = path.resolve(__dirname, "./public");

  //console.log(pathDocs);
  app.use("/", front.serverRender());
  app.use("/admin", front.serverRender());
  app.use("/admin/*", front.serverRender());
  app.use("/api/users", Users.router());
  app.use("/api/devices", device.router());
  app.use("/api/videos", Videos.router());
  app.use("/api/images", Image.router());
  app.use("/api/docs", express.static(path.join(pathDocs)));
  app.use("/static", express.static(path.join(pathPublic)));
};
