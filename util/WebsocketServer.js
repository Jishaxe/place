const socketIO = require("socket.io");

function WebsocketServer(app, httpServer) {
    var server = socketIO(httpServer);
    console.log("Websocket server attached to HTTP server.");

    return {
        server: server,

        broadcast: function(name, payload) {
            this.server.sockets.emit(name, payload);
        }
    }
}

WebsocketServer.prototype = Object.create(WebsocketServer.prototype);

module.exports = WebsocketServer;