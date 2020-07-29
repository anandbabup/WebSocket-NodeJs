// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
//const csv = require('csv-parser');

const fs = require('fs');
const csv = require('csvtojson')
const csvFilePath = 'SON_TGSAR_source.csv'

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
        //get csv file from server
        csv()
            .fromFile(csvFilePath)
            .then((jsonObj) => {
                setClients.forEach((oneClient) => {
                    oneClient.send(JSON.stringify(jsonObj));
                });
                //console.log(jsonObj);
                /**
                 * [
                 * 	{a:"1", b:"2", c:"3"},
                 * 	{a:"4", b:"5". c:"6"}
                 * ]
                 */
            })

    });

    // When a connection closes, remove it from the clients set and log the number of connections
    socketConnection.on('close', () => {
        setClients.delete(socketConnection);
        console.log('Client disconnected, total connections is: ', setClients.size);
    });


});

// serve up static files
app.use(express.static(path.resolve(__dirname, '../client')));


// //Read csv file about 3MB
// fs.createReadStream('SON_TGSAR.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     console.log(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//   });



// csv()
//     .fromFile(csvFilePath)
//     .then((jsonObj) => {
//         console.log(jsonObj);
//         /**
//          * [
//          * 	{a:"1", b:"2", c:"3"},
//          * 	{a:"4", b:"5". c:"6"}
//          * ]
//          */
//     })

// Async / await usage

//const jsonArray = await csv().fromFile(csvFilePath);

server.listen(3000, () => { console.log('listening on port 3000'); });