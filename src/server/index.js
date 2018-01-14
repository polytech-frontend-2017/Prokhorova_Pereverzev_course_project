const app = new require('http').createServer();
const io = (module.exports.io = new require('socket.io')(app));

const PORT = process.env.PORT || 3231;
const SocketManager = new require('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, () => {
  console.log('Connect to port:' + PORT);
});
