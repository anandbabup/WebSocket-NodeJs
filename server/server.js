// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const fs = require("fs")

const filePath = 'SON_TGSAR.csv';

const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });


// a set to hold all of our connected clients
const setClients = new Set();
let oneClient = null;

wsServer.on('connection', (socketConnection) => {
    // When a connection opens, add it to the clients set and log the number of connections
    //setClients.add(socketConnection);
    oneClient = socketConnection;
    console.log('New client connected, total connections is: ', setClients.size);

    // When the client sends a message to the server, relay that message to all clients
    socketConnection.on('message', (message) => {

        var readerStream = fs.createReadStream(filePath);
        readerStream.setEncoding('utf-8');

        readerStream.on('data', function (chunk) {
            oneClient.send(chunk);
        });

        readerStream.on('end', function (err) {
            console.log("Successful");
        });
        readerStream.on('error', function (err) {
            //err.stack
            oneClient.send("Error occured");
        });
    });

    //readMe();

    // When a connection closes, remove it from the clients set and log the number of connections
    socketConnection.on('close', () => {
        setClients.delete(socketConnection);
        console.log('Client disconnected, total connections is: ', setClients.size);
    });
});


// const readMe = function () {
//     fs.open(filePath, 'r', function (err, fd) {
//         if (err) throw err;
//         function readNextChunk() {
//             fs.read(fd, buffer, 0, CHUNK_SIZE, null, function (err, nread) {
//                 if (err) throw err;

//                 if (nread === 0) {
//                     // done reading file, do any necessary finalization steps

//                     fs.close(fd, function (err) {
//                         if (err) throw err;
//                     });
//                     return;
//                 }

//                 var data;
//                 if (nread < CHUNK_SIZE) {
//                     data = buffer.slice(0, nread);
//                     console.log(data.toString());
//                 } else {
//                     data = buffer;
//                     console.log(data.toString());
//                 }

//                 // do something with `data`, then call `readNextChunk();`
//             });
//         }
//         readNextChunk();
//     });
// }



// serve up static files
app.use(express.static(path.resolve(__dirname, '../client')));

server.listen(3000, () => { console.log('listening on port 3000'); });