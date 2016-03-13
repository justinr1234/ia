var socket = io();

function getTimestamp() {
  var currentdate = new Date();
  return currentdate.getDate() + "/"
    + (currentdate.getMonth()+1)  + "/"
    + currentdate.getFullYear() + " @ "
    + currentdate.getHours() + ":"
    + currentdate.getMinutes() + ":"
    + currentdate.getSeconds();
}

$('form').submit(function() {
  socket.emit('produce', $('#expression').val());
  $('#expression').val('');
  return false;
});

socket.on('response-log', function(msg) {
  var feedItem = $('<div>').addClass('feed-item');
  feedItem.append($('<div>').addClass('date').text(getTimestamp()));
  feedItem.append($('<div>').addClass('text').text('Result (id: ' + msg.producer + '): ' + msg.expression + msg.result));
  $('#activity-feed').prepend(feedItem);
});
socket.on('invalid-log', function(msg) {
  var feedItem = $('<div>').addClass('feed-item-invalid');
  feedItem.append($('<div>').addClass('date').text(getTimestamp()));
  feedItem.append($('<div>').addClass('text').text('Invalid (id: ' + msg.producer + '): ' + msg.expression));
  $('#activity-feed').prepend(feedItem);
});
socket.on('connect', function() {
  $('#status').removeClass('alert alert-danger').addClass('alert alert-success').text('Connected');
});
socket.on('disconnect', function() {
  $('#status').removeClass('alert alert-success').addClass('alert alert-danger').text('Disconnected');
});
