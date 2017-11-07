 var socket = io();

socket.on('connect', function () {
  console.log('Conncted to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server')
});

socket.on('newMessage', function (mssg) {
  console.log('New message', mssg);
  var li = $('<li>');
  li.text(`${mssg.from}: ${mssg.text}`);

  $('#messages').append(li);
});

socket.on('newLocationMessage', function (mssg) {
  console.log('New location message', mssg);
  var li = $('<li>')
  var a = $('<a target="_blank">My Current Location</a>');

  li.text(`${mssg.from}: `);
  a.attr('href', mssg.url);

  li.append(a);
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

var locationButton = $('#send-location');
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function(pos) {
    socket.emit('createLocationMessage', {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });
  }, function(err) {
    alert('Unable to fetch location.');
  })
})
