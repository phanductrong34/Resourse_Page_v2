const app = require('express')();
const http = require('http').Server(app);
const { instrument } = require('./../Admin UI/node_modules/@socket.io/admin-ui')
if (instrument) console.log(true);
const io = require('socket.io')(http, {
  cors: {
    origin: ["https://admin.socket.io", "http://localhost:8080"],
    credentials: false
  }
});
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // console.log(__dirname);
});

io.on('connection', (socket) => {
  console.log('a user connected ' + socket.id);

  socket.broadcast.emit('chat message', 'hi');

  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
instrument(io, {
  auth: false
});
http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
