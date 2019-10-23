var fs = require("fs");
var async = require("async");
var path = require("path");
var AWS = require("aws-sdk");

function S3Helper(accessConfig, bucketName) {
  this.bucketName = process.env.AWS_S3_BUCKET_NAME || bucketName;
  this.accessKeyId = process.env.AWS_ACCESS_KEY || accessConfig.AWS_ACCESS_KEY;
  this.secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY || accessConfig.AWS_SECRET_ACCESS_KEY;
  this.S3 = new AWS.S3({
    accessKeyId: this.accessKeyId,
    secretAccessKey: this.secretAccessKey
  });
}

S3Helper.prototype.upload = function(filename) {
  var promise = new Promise((resolve, reject) => {
    var uploadParams = {
      Bucket: this.bucketName,
      Key: "",
      Body: "",
      ACL: "public-read"
    };
    var fileStream = fs.createReadStream(filename);
    uploadParams.Body = fileStream;
    uploadParams.Key = path.basename(filename);

    this.S3.upload(uploadParams, function(err, data) {
      if (err) {
        //console.log("Error", err);
        reject(err);
      }
      if (data) {
        //console.log("Upload Success", data.Location);
        resolve(data.Location);
      }
    });
  });

  return promise;
};

S3Helper.prototype.remove = function(filename) {
  var promise = new Promise((resolve, reject) => {
    var params = {
      Bucket: this.bucketName,
      Key: filename
    };
    console.log("****************** params of s3, *************", params);
    this.S3.deleteObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
        reject(data);
      } else {
        console.log(data); // successful response
        resolve(data);
      }
    });
  });

  return promise;
};

module.exports = S3Helper;
