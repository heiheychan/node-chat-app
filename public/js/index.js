var socket = io();

socket.on('connect', function () {
  console.log('Conncted to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server')
});

socket.on('newMessage', function (mssg) {
  var formattedTime = moment(mssg.createdAt).format('h:mm a');
  var li = $('<li>');
  li.text(`${mssg.from} ${formattedTime}: ${mssg.text}`);

  $('#messages').append(li);
});

socket.on('newLocationMessage', function (mssg) {
  var formattedTime = moment(mssg.createdAt).format('h:mm a');
  var li = $('<li>')
  var a = $('<a target="_blank">My Current Location</a>');

  li.text(`${mssg.from} ${formattedTime}: `);
  a.attr('href', mssg.url);

  li.append(a);
  $('#messages').append(li);
});

var messageTextBox = $('input[name=message]');

$('#message-form').on('submit', function(e) {
  e.preventDefault();

  socket.emit('createMessage',{
    from: 'User',
    text: messageTextBox.val()
  }, function(){
    messageTextBox.val('');
  })
})

var locationButton = $('#send-location');

locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(pos) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    });
  }, function(err) {
    alert('Unable to fetch location.');
  })
})
