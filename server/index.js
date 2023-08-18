const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    ws.on('message', msg => {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
                const msgObj = JSON.parse(msg);
                msgObj.isOwnMessage = false;

                client.send(JSON.stringify(msgObj));
            } else {
                client.send(msg);
            }
        });
    });
});

server.listen(3000, () => {
    console.log('WebSocket server is listening on port 3000');
});