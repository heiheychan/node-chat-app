var socket = io();

function scrollToBottom () {
  var scrolltop = $('#messages').prop('scrollHeight') - $('#messages').prop('clientHeight');
  $('#messages').scrollTop(scrolltop);
}

socket.on('connect', function () {
  console.log('Conncted to server');
});

socket.on('disconnect', function () {
  console.log('Disconnected from server')
});

socket.on('newMessage', function (mssg) {
  var template = $("#message-template").html();
  var html = Mustache.render(template, {
    text: mssg.text,
    from: mssg.from,
    time: moment(mssg.createdAt).format('h:mm a')
  });

  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', function (mssg) {
  var template = $('#location-message-template').html();
  var html = Mustache.render(template, {
    url: mssg.url,
    from: mssg.from,
    time: moment(mssg.createdAt).format('h:mm a')
  })
 
  $('#messages').append(html);
  scrollToBottom();
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
