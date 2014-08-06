var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('getData', function() {
    fs.readFile('data.json', {encoding: 'utf8'}, function(err, data) {
      if (err) throw new err;
      socket.emit('data', data);
    });
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});