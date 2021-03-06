const responseFactory = require("./util/ResponseFactory");
const config = require('./config/config');
const mongoose = require('mongoose');
const paintingHandler = require("./util/PaintingHandler");
const recaptcha = require('express-recaptcha');
const HTTPServer = require("./util/HTTPServer.js");
const WebsocketServer = require("./util/WebsocketServer.js");

var app = {};

app.config = config;

// Get image handler
app.paintingHandler = paintingHandler(app);
console.log("Loading image from the database...")
app.paintingHandler.loadImageFromDatabase().then((image) => {
    console.log("Successfully loaded image from database.");
}).catch(err => {
    console.error("An error occurred while loading the image from the database.\nError: " + err);
})

app.responseFactory = responseFactory;

// Set up reCaptcha
recaptcha.init(config.recaptcha.siteKey, config.recaptcha.secretKey);
app.recaptcha = recaptcha;

app.httpServer = new HTTPServer(app);
app.server = require('http').createServer(app.httpServer.server);
app.websocketServer = new WebsocketServer(app, app.server);

mongoose.connect(config.database);

app.server.listen(config.port, config.onlyListenLocal ? "127.0.0.1" : null);
