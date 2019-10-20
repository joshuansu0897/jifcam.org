const sgMail = require('@sendgrid/mail');
var config = require("../config").config;


function MailHelper(apiKey){
    sgMail.setApiKey(apiKey);
}

MailHelper.prototype.send = function(to, subject, message, from){
    var promise = new Promise((resolve, reject)=>{
        const msg = {
            to: to,
            from: from || 'jifcom@gmail.com',
            subject: subject,
            text: message.text
        };
    
        sgMail.send(msg).then((res)=>{
            resolve(res);
        }).catch((err)=>{
            reject(err);
        })
    })

    return  promise;
}

module.exports = MailHelper;