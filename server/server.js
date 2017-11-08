const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./util/message');
const {isRealString} = require('./util/validation');
const {Users} = require('./util/users');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

// Middlewares
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("Name and room name are required");
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin','Greeting!'));
    // need check
    socket.to(params.room).broadcast.emit('newMessage', generateMessage('Admin',`${params.name} has joined the conversation`));
    
    callback();
  })

  socket.on('createMessage', (message, callback) => {
    console.log('New Mssg coming through', message);
    io.emit('newMessage', generateMessage(message.from,message.text));
    callback('This is from the server.');
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin',coords.latitude,coords.longitude));
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room`));
    }
    console.log('User was disconnected');
  });
})

server.listen(port, () => {
  console.log(`Server starts at port ${port}`);
})
