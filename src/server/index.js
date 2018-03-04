const { PORT, hostname } = require('./globalConsts');
const http = require('http');
const app = http.createServer();
const io = (module.exports.io = require('socket.io')(app));
const SocketManager = new require('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});
