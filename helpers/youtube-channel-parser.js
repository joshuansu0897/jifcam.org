var util = require("util"),
    https = require("https");
const jsdom = require("jsdom");
const async = require("async");
const { JSDOM } = jsdom;

function ChannelParser(url){
    var html = ""; 
    var promise = new Promise((resolve, reject)=>{
        var options = {
            host: "www.youtube.com",
            port: 80,
            path: url.replace("https://www.youtube.com", "")
        };

        try{
            var req = https.get(url, function(res) {
                res.setEncoding("utf8");
                //console.log(options);
                res.on("data", function (chunk) {
                    //console.log('chunk', chunk);
                    html += chunk;
                });
            
                res.on("end", function () {
                    try{
                        //console.log(html);
                        var urls = [];
                        var document = new JSDOM(html).window.document;
                        var avatar = "";
                        try{
                            avatar = document.querySelector("#appbar-content .appbar-nav-avatar").src;
                        }catch(err){

                        }
                        var listOfLinks = document.querySelector("#browse-items-primary script");
                        if(listOfLinks){
                            var videoLinks = JSON.parse(listOfLinks.innerHTML)
                            async.eachSeries(videoLinks.itemListElement[0].item.itemListElement,(item, callback)=>{
                                urls.push(item.url);
                                callback();
                            }, function(err){
                                if(err){
                                    reject(err);
                                }else{
                                    resolve({ avatar: avatar, videos: urls});
                                }
                            })
                        }else{
                            resolve({ avatar: avatar, videos: []});
                        }
                        //console.log(avatar, videoLinks.itemListElement[0].item.itemListElement);
                    }catch(err){
                        reject(err);
                    }
                    //console.log();
                });
            }).on("error", (err)=>{
                console.log(url);
                console.log(err);
            })


        
            req.end();
        }catch(err){
            console.log(err);
        }

    })

    return promise;
}


exports.ChannelParser = ChannelParser;