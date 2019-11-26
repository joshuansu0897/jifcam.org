var VideoModel = require("../models/videos");
var ThumbnailGenerator = require("video-thumbnail-generator").default;
const fs = require("fs");
const ytdl = require("ytdl-core");
const { getInfo } = require("ytdl-getinfo");
const path = require("path");
var getDimensions = require("get-video-dimensions");
const gm = require("gm");
var async = require("async");
var S3Helper = require("./s3-helper");
var config = require("../config").config;

function YoutubeVideos() {
    //if(isLoading){
    this.isLoading = false;
    this.model = new VideoModel();
    //}
}

YoutubeVideos.prototype.download = function() {
    var _this = this;
    console.log(this.isLoading);
    if (!this.isLoading) {
        this.model.modelDB.findOne({ status: 0 }, function(err, doc) {
            //console.log(doc.youtubeURL);
            if (doc) _this.processDownload(doc);
        });
    }
};

YoutubeVideos.prototype.processDownload = function(doc) {
    var _this = this;
    //console.log(ThumbnailGenerator);
    if (doc.youtubeURL) {
        this.isLoading = true;
        const url = doc.youtubeURL;
        let output = path.resolve(__dirname, "../public/videos");
        output += "/" + doc._id + ".mp4";
        console.log(
            " ---------------------- output ---------------------------- ",
            output
        );

        this.model
            .update(doc._id, { status: 1 })
            .then(async () => {
                console.log(
                    " ---------------------- update ---------------------------- "
                );

                try {
                    const videoInfo = await getInfo(url);
                    console.log(videoInfo);
                    var video = ytdl(url, {
                        quality: "highestvideo",
                        filter: (format) => format.container === 'mp4'
                    }).on(
                        "progress",
                        async (length, downloaded, totallength) => {
                            if (downloaded === totallength) {
                                const tg = new ThumbnailGenerator({
                                    sourcePath: output,
                                    thumbnailPath: path.resolve(
                                        __dirname,
                                        "../public/images/video-thumbnails"
                                    )
                                });
                                const thumbsArray = [];
                                await tg
                                    .generateOneByPercent(10, {
                                        size: "100%",
                                        filename: `${doc._id}_1`
                                    })
                                    .then(th => {
                                        thumbsArray.push(
                                            "/static/images/video-thumbnails/" +
                                                th
                                        );
                                    });
                                await tg
                                    .generateOneByPercent(50, {
                                        size: "100%",
                                        filename: `${doc._id}_2`
                                    })
                                    .then(th => {
                                        thumbsArray.push(
                                            "/static/images/video-thumbnails/" +
                                                th
                                        );
                                    });
                                await tg
                                    .generateOneByPercent(90, {
                                        size: "100%",
                                        filename: `${doc._id}_3`
                                    })
                                    .then(th => {
                                        thumbsArray.push(
                                            "/static/images/video-thumbnails/" +
                                                th
                                        );
                                    });
                                const upload_date = videoInfo.items[0].upload_date;
                                const year = upload_date.substr(0, 4);
                                const month = upload_date.substr(4, 2);
                                const day = upload_date.substr(6, 2);
                                this.model
                                    .update(doc._id, {
                                        title: videoInfo.items[0].fulltitle,
                                        uploadDate: `${year}-${month}-${day}`,
                                        path:
                                            "/static/videos/" +
                                            doc._id +
                                            ".mp4",
                                        thumbnails: thumbsArray,
                                        status: 2
                                    })
                                    .then(result => {
                                        //console.log(res);
                                    });
                                this.uploadToAWSS3(output, doc._id);
                                this.isLoading = false;
                            }
                        }
                    );
                    video.on("error", err => {
                        console.log(err);
                        this.isLoading = false;
                    });

                    video.pipe(fs.createWriteStream(output));
                } catch (err) {
                    console.log(err);
                    this.isLoading = false;
                }
            })
            .catch(err => {
                console.log(err);
                this.isLoading = false;
            });
    }
    this.isLoading = false;
};

YoutubeVideos.prototype.uploadToAWSS3 = function(path, videoId) {
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
            );
            this.model
                .update(videoId, { path: url })
                .then(res => {
                    fs.unlink(path, err => {
                        if (err) {
                            console.log("Error... amazon S3 server", err);
                        } else {
                            console.log(" video moved to amazon S3 server ");
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log("s3 error...", err);
        });
};

module.exports = YoutubeVideos;
