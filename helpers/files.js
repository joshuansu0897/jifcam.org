var fs = require('fs');
var async = require('async');
var path = require('path');
var csv = require('csv-parse');
var mv = require('mv');


const publicFolder = "./public";

function FileHelper(_path){

    this.filepath = _path;
}

FileHelper.prototype.prepareDir = function(Path, callback){
        let list = Path.split("/");
        let _path = this.filepath;
        let addPath = "";
        console.log("prepareDir");
        async.eachSeries(list, (item, cb)=>{
            if(item){
                //console.log(addPath);
                let realpath = path.resolve(_path + addPath + '/' + item);
                //console.log(realpath);
                fs.access(realpath, fs.constants.R_OK, (err)=>{
                    if(err){
                        fs.mkdir(realpath, {}, (err)=>{
                            console.log(err)
                            if(err){
                                addPath += '/' + item;
                                cb(err)
                            }else{
                                addPath += '/' + item;
                                cb();
                            }
                        })
                    }else{
                        addPath += '/' + item;
                        cb();
                    }
                })
            }else cb();
        }, (err)=>{
           if(err){
               callback(err)
           }else{
               callback(null);
           }
        })
    }

FileHelper.prototype.upload = function(req, name, Path, filename) {
    
    let  promise = new Promise((resolve, reject)=>{
        if (req.files) {
            if (req.files[name]) {
                const file = req.files[name];
                let _path = this.filepath;
                let _filename = file.name;
                let newPath = "";
                if(path){
                    _path += Path;
                }

                console.log(" ------------- upload -------------------- ", _path);
                async.waterfall([
                    (cb)=>{
                        console.log("file.path", file.path);
                        fs.access(file.path, fs.constants.R_OK , cb);
                    },
                    (cb)=>{
                        fs.access(_path, fs.constants.R_OK , cb);
                    },
                    (cb)=>{
                        console.log(" ** renaming ** ", filename);
                        if(filename) _filename = _filename + "." + file.originalFilename.split(".")[1];
                        newPath =  path.resolve(_path + _filename);
                        
                        if(newPath){ 
                            console.log(newPath);
                            console.log("file.path, newPath",file.path, newPath);
                            mv(file.path, newPath, cb);
                        }else{
                            cb(new Error("incorret file path"));
                        }
                    },
                    (cb)=>{
                        cb(null, {filePath: _path.replace(this.filepath, "/static") + _filename, name: _filename, realpath: newPath})
                    }
                ], function(err, result){
                    if(err){
                        console.log(err);
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
            } else {
                reject(new Error("file not found"))
            }
        } else {
            reject(new Error("it is not any file in request"));
        }
    });

    return promise;
}

module.exports = FileHelper;