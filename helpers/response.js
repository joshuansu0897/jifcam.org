var SUCCESS = 200;
var CREATED = 201;
var NOT_MODIFIED = 304;
var BAD_REQUEST = 400;
var UNAUTH = 401;
var FORBIDDEN = 403;
var NOT_FOUND = 404;
var CONFLICT = 409;
var SERVER_ERROR = 500;
exports.SUCCESS = SUCCESS;
exports.CREATED = CREATED;
exports.NOT_MODIFIED = NOT_MODIFIED;
exports.BAD_REQUEST = BAD_REQUEST;
exports.UNAUTH = UNAUTH;
exports.FORBIDDEN = FORBIDDEN;
exports.NOT_FOUND = NOT_FOUND;
exports.CONFLICT = CONFLICT;
exports.SERVER_ERROR = SERVER_ERROR;

var Response = function(response) {
  this.response = response;
  this.status = 200;
  this.data = null;
  this.notice = [];
  this.warnings = [];
  this.errors = [];
};

Response.prototype.addWarning = function(message) {
  this.warnings.push(message);
};

Response.prototype.addNotice = function(message) {
  this.notice.push(message);
};

Response.prototype.addError = function(code, message) {
  this.status = code;
  this.errors.push(message);
};

Response.prototype.errorParse = function(error) {
  if (error.isJoi) {
    let message = "IncorectRequest";
    if (error.details.length > 0) {
      message = error.details[0].message;
      this.setData(error.details);
    }
    this.addError(BAD_REQUEST, message);
  } else if (error.name === "ValidationError") {
    this.addError(BAD_REQUEST, error.message);
  } else {
    this.addError(SERVER_ERROR, "ServerError");
  }
};

Response.prototype.setData = function(data) {
  this.data = data;
};

Response.prototype.send = function() {
  this.response.status(this.status);
  this.response.setHeader("Content-type", "application/json");
  const body = {
    status: this.status,
    errors: this.errors,
    data: this.data,
    notice: this.notice,
    warnings: this.warnings
  };

  this.response.json(body);
};

exports.Response = Response;
