require('@babel/register')({
    ignore: [/(node_modules)/],
    presets: ['@babel/preset-env', '@babel/preset-react'],
    cache: false
  })
require('babel-polyfill');
var Router = require('express').Router;
var fs = require("fs");
var React = require('react');
var path = require('path');
var ReactDOMServer = require('react-dom/server');
var WebRouter = require('react-router-dom').StaticRouter;
var App = require("../client/App");


exports.serverRender = function(){
    let router = Router();

    return router.get("/", function(req, res, next){
        var html = ReactDOMServer.renderToString(
            React.createElement(WebRouter, { location: req.url }, React.createElement(App.default))
        );

        const indexFile = path.resolve('./public/index.html');
        console.log(indexFile);
        fs.readFile(indexFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Something went wrong:', err);
                return res.status(500).send('Oops, better luck next time!');
            }

            return res.send(
            data.replace('<div id="root"></div>', `<div id="root">${html}</div>`)
            );
        });
        
    })
}