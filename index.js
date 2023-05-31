const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('hr_data', (data) => {
        console.log('Received HR data:', data);
        if (data.conf > 80) {
            // Prepare the data for CSV format
            const csvData = `${data.hr},${data.conf},${data.datetime}\n`;
            // Append the data to the file
            fs.appendFile('hr_data.csv', csvData, (err) => {
                if (err) throw err;
                console.log('The "hr_data" was appended to file!');
            });
        }
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

server.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
