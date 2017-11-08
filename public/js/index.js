var socket = io();

socket.on('roomList', function (roomList) {
  var dl = $('<datalist id="rooms"></datalist>');
  roomList.forEach(function(room){
    dl.append('<option value="' + room + '">')
  });

  $('input[name="room"]').after(dl);
});
