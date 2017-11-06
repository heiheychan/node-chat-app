const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// Middlewares
app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Admin',
    message: 'Greeting!',
    createAt: new Date().getTime()
  })

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    message: 'Someone has joined the conversation',
    createAt: new Date().getTime()
  })

  socket.on('createMessage', (message) => {
    console.log('New Mssg coming through', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createAt: new Date().getTime()
    })
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
