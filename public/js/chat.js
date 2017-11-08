var socket = io();

function scrollToBottom () {
  // var newMessage = $('#messages li:last-child').innerHeight();
  var scrolltop = $('#messages').prop('scrollHeight') - $('#messages').prop('clientHeight');
    $('#messages').scrollTop(scrolltop);
  }

  socket.on('connect', function () {
    var params = $.deparam(window.location.search);
    
    socket.emit('join', params, function(err) {
      if (err) {
        alert(err);
        window.location.href = "/";
      } else {
        console.log("Joined successfully");
      }
    });
  });

  socket.on('updateHighlight', function() {
    socket.emit('getUsername', "", function(username){
      $('.chat__sidebar ol li:contains("' + username + '")').css('color', 'red');
    });
  })

  socket.on('disconnect', function () {
    console.log('Disconnected from server')
  });

  socket.on('updateUserList', function(users) {
    var ol = $('<ol></ol>');

    users.forEach(function(user){
      ol.append($('<li></li>').text(user));
    })

    $('#users').html(ol);
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
