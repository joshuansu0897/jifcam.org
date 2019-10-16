var VideoModel = require("../models/videos");
var ThumbnailGenerator = require('video-thumbnail-generator').default;
const fs = require('fs');
const ytdl = require('ytdl-core');
const ytdlInfo = require('ytdl-getinfo');
const path = require('path');
var getDimensions = require('get-video-dimensions');
const gm = require('gm');
var async = require("async");
var S3Helper = require('./s3-helper');
var config = require("../config").config;

function YoutubeVideos(){
    //if(isLoading){
    this.isLoading = false;
    this.model = new VideoModel();
    //}
}

YoutubeVideos.prototype.download = function(){
    var _this = this;
    console.log(this.isLoading);
    if(!this.isLoading){
        this.model.modelDB.findOne({status: 0}, function(err, doc){
            //console.log(doc);
            if(doc) _this.processDownload(doc);
        }) 
    }
}

YoutubeVideos.prototype.processDownload = function(doc){
    var _this = this;
    //console.log(ThumbnailGenerator);
    if(doc.youtubeURL){
        this.isLoading = true;
        const url = doc.youtubeURL;
        let output = path.resolve(__dirname, "../public/videos");
        output += "/" + doc._id + '.mp4';
        console.log(" ---------------------- output ---------------------------- ", output);
        
        this.model.update(doc._id, { status: 1}).then(()=>{
            console.log(" ---------------------- update ---------------------------- ");
            
            try{
                var video = ytdl(url);

                ytdlInfo.getInfo(url).then((info)=>{
                    var videoinfo = info.items[0];
                    var d = videoinfo.upload_date;
                    var uploadDate = new Date(d.substr(0,4)+"-"+d.substr(4,2)+"-"+d.substr(6,2)+"");
                    _this.model.update(doc._id, { title: videoinfo.title, description: videoinfo.description, uploadDate: uploadDate }).then(()=>{

                    }).catch((err)=>{
                        console.log(err);
                    })
                }).catch((err)=>{
                    console.log(err);
                })

                video.pipe(fs.createWriteStream(output));

                video.on("error", (err)=>{
                    console.log(err);                    
                    this.isLoading = false;
                })
                
                video.on('end', () => {
                    
                    this.model.update(doc._id, {path: "/static/videos/" + doc._id + '.mp4', status: 2}).then((result)=>{
                        //console.log(res);

                    })
                    _this.uploadToAWSS3(output, doc._id);
                    getDimensions(path.resolve(__dirname, "../public/videos/" + doc._id + '.mp4')).then(function (dimensions) {
                        console.log(" dimensions.width", dimensions.width);
                        console.log(" dimensions.height ", dimensions.height);

                        var height = dimensions.height;
                        var width = dimensions.width;
                        var tg = new ThumbnailGenerator({
                            sourcePath: output,
                            thumbnailPath: path.resolve(__dirname, "../public/images/video-thumbnails"),
                        });
        
                        tg.generate({count: 3, filename: "" + doc._id, size: width + 'x' + height}).then((result)=>{
                            //console.log("tg.generate", result);
                            async.map(result, (item, cb)=>{
                                 //console.log(item);
                                cb(null, "/static/images/video-thumbnails/" + item);
                            }, (err, res)=>{
                                //console.log("async.map res", res);
                                _this.model.update(doc._id, {thumbnails: res})

                                async.eachSeries(result, (img, cb)=>{
                                    var _path = path.resolve(__dirname, "../public/images/video-thumbnails")
                                    _path += "/" + img;
                                    var newWidth = Math.round(height / 16 * 9);
                                    gm(_path).options({imageMagick: true}).gravity('Center').crop(newWidth, height)
                                    .write(_path, (err) => {
                                        //console.log(err);
                                    });
                                    cb();
                                }, function(err){

                                })
                            });

                            // _this.uploadToAWSS3(output, doc._id)
                            
                        }).catch((err)=>{
                            console.log(err);
                            _this.uploadToAWSS3(output, doc._id)
                        })
                        })
                    
                    
                    this.isLoading = false;

                });
            } catch (err) {
                console.log(err)
                this.isLoading = false;
            }
        }).catch((err)=>{             
            this.isLoading = false;
        })
    }
}

YoutubeVideos.prototype.uploadToAWSS3 = function(path, videoId){
 
    var S3 = new S3Helper({ 
        AWS_ACCESS_KEY: config.AWS_ACCESS_KEY, 
        AWS_SECRET_ACCESS_KEY: config.AWS_SECRET_ACCESS_KEY 
    }, config.AWS_S3_BUCKET_NAME);
    
    console.log('uploadToAWSS3 method********************************, s3', S3);
    S3.upload(path).then((url)=>{
        console.log('succcess.....uploadToAWSS3 method********** *******', url);
        this.model.update(videoId, { path: url }).then((res)=>{
            fs.unlink(path, (err)=>{
                if(err){
                     console.log('Error... amazon S3 server',err) 
                }else{
                    console.log(" video moved to amazon S3 server ");
                }
            })
        }).catch((err)=>{
            console.log(err);
        })
    }).catch((err)=>{
        console.log("s3 error...",err);
    })
}

module.exports = YoutubeVideos;
