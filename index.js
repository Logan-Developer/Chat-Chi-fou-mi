// loading modules
const express = require('express');
const app = express();
const http = require('http');
const server = app.listen(8080, function() {
    console.log("Server is running on port 8080, waiting for connections...");
});

const chifoumi = require('./chifoumi');

// Listening to the connection event for incoming sockets
const { Server } = require("socket.io");
const io = new Server(server);

// Configuring express to use the "public" folder
app.use(express.static('public'));
// set up to 
app.get('/', function(req, res) {  
    res.sendFile(__dirname + '/public/chat.html');
});

// unblocking origin source
//io.set('origins', '*:*');

/***************************************************************
 *           Clients and connections management
 ***************************************************************/

var clients = {};       // { id -> socket, ... }

/**
 *  Delete data of specified client
 *  @param  string  id  Client id to delete
 */
function remove(id) {
    delete clients[id];
}


// When a client connects, we note it in the console
io.on('connection', function (socket) {
    
    // debug message
    console.log("A client is connected");
    var currentID = null;
    
    /**
     *  Must be the first action after connection
     *  @param  id  string pseudo entered by the client
     */
    socket.on("login", function(id) {
        // If the pseudo is already used, we refuse the connection and display an error message
        if (clients[id]) {
            socket.emit("error-connection", "This pseudo is already used");
            return;
        }
        // else we gets its ID
        currentID = id;
        // initialisation
        clients[currentID] = socket;
        // log
        console.log("New user : " + currentID);
        // send welcome message to the client
        socket.emit("welcome", { clients: Object.keys(clients), scores: chifoumi.getScores() });
        // send to other clients that a new client is connected
        socket.broadcast.emit("message", { from: null, to: null, text: currentID + " joined the conversation", date: Date.now() });
        // send to the client the list of connected clients
        socket.broadcast.emit("list", { clients: Object.keys(clients), scores: chifoumi.getScores() });
    });
    
    
    /**
     *  Get a message from a client and send it to the other clients
     *  @param  msg     Object  Message to send 
     */
    socket.on("message", function(msg) {
        console.log("Message received");

        // if the message is a private message, we send it to the recipient only
        if (msg.to != null) {
            if (clients[msg.to] !== undefined) {
                console.log(" --> private message");
                clients[msg.to].emit("message", { from: currentID, to: msg.to, text: msg.text, date: Date.now() });
                if (currentID != msg.to) {
                    socket.emit("message", { from: currentID, to: msg.to, text: msg.text, date: Date.now() });
                }
            }
            else {
                socket.emit("message", { from: null, to: currentID, text: "User " + msg.to + " unknown", date: Date.now() });
            }
        }
        // else, send it to all clients
        else {
            console.log(" --> broadcast");
            io.sockets.emit("message", { from: currentID, to: null, text: msg.text, date: Date.now() });
        }
    });
    
        
    /** 
     *  Disconnection management
     */
    
    // closing
    socket.on("logout", function() { 
        // if client was logged (should be always the case)
        if (currentID) {
            console.log("Disconnecting " + currentID);
            // Send disconnection info
            socket.broadcast.emit("message", 
                { from: null, to: null, text: currentID + " left the conversation", date: Date.now() });
            // delete entry in clients list
            remove(currentID);
            // unregister client
            currentID = null;
             // send new list of connected clients
            socket.broadcast.emit("list", Object.keys(clients));
        }
    });
    
    // Disconect from socket
    socket.on("disconnect", function(reason) { 
        // if client was logged (should be always the case)
        if (currentID) {
            // send disconnection info
            socket.broadcast.emit("message", 
                { from: null, to: null, text: currentID + " has closed the application.", date: Date.now() } );
            // delete entry
            remove(currentID);
            // unregister client
            currentID = null;
            // send new list of connected clients
            socket.broadcast.emit("list", Object.keys(clients));
        }
        console.log("Client disconnected");
    });
    
    
    // Chifoumi management
    socket.on("chifoumi-message", function(msg) {
        console.log("Chifoumi message received");

        chifoumi.playChifoumi(currentID, msg.to, msg.choice, clients);
    });
});