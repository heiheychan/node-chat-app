const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./util/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// Middlewares
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin','Greeting!'));

  socket.broadcast.emit('newMessage', generateMessage('Admin','Someone has joined the conversation'));

  socket.on('createMessage', (message, callback) => {
    console.log('New Mssg coming through', message);
    io.emit('newMessage', generateMessage(message.from,message.text));
    callback('This is from the server.');
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createAt: new Date().getTime()
    // });
  })

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
})

server.listen(port, () => {
  console.log(`Server starts at port ${port}`);
})
