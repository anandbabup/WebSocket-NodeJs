// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
 
const app = express();
const server = http.createServer(app);
const wsServer = new WebSocket.Server({ server });
 
// a set to hold all of our connected clients
const setClients = new Set();
 
wsServer.on('connection', (socketConnection) => {
 // When a connection opens, add it to the clients set and log the number of connections
 setClients.add(socketConnection);
 console.log('New client connected, total connections is: ', setClients.size);
 
 // When the client sends a message to the server, relay that message to all clients
 socketConnection.on('message', (message) => {
   setClients.forEach((oneClient) => {
     oneClient.send(message);
   });
 });
 
 // When a connection closes, remove it from the clients set and log the number of connections
 socketConnection.on('close', () => {
   setClients.delete(socketConnection);
   console.log('Client disconnected, total connections is: ', setClients.size);
 });
});
 
// serve up static files
app.use(express.static(path.resolve(__dirname, '../client')));
 
server.listen(3000, () => { console.log('listening on port 3000'); });