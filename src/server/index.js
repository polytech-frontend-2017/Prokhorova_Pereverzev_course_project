const { PORT, hostname } = require('./globalConsts');
const http = require('http');
const app = http.createServer();
const io = (module.exports.io = require('socket.io')(app));
const url = require('url');
const SocketManager = new require('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, hostname, () => {
  console.log(`Server running at http://${hostname}:${PORT}/`);
});

function Reqfunction(request, response) {
  var queryData = url.parse(request.url, true).query;
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  if (queryData.name) {
    // user told us their name in the GET request, ex: http://host:8000/?name=Tom
    var exec = require('child_process').exec;
    exec('casperjs test.js ' + queryData.name + '\n', function(
      err,
      stdout,
      stderr
    ) {
      response.end(stdout);
    });
  } else {
    response.end('Contact Admin - Not Working\n');
  }
}
