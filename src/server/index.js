const app = require('http').createServer();
const io = (module.exports.io = require('socket.io')(app));

const PORT = process.env.PORT || 3231;
const SocketManager = new require('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, () => {
  console.log('Connect to port:' + PORT);
});
