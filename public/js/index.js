 var socket = io();

socket.on('connect', function () {
  console.log('Conncted to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server')
});

socket.on('newMessage', function (mssg) {
  console.log('New message', mssg);
  var li = $('<li></li>');
  li.text(`${mssg.from}: ${mssg.text}`);

  $('#messages').append(li);
});

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage',{
    from: 'User',
    text: $('input[name=message]').val()
  }, function(){

  })
})
