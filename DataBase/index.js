var mongoose = require('mongoose');
var PASS = 'react_app';
const PORT = 1337;
mongoose.connect('mongodb+srv://admin:'+PASS+'@cluster0-97ove.mongodb.net/test',
	{
		userMongoClient: true
	});
/*	
const projectSchema = mongoose.Schema({
	_id: mongoose.Types.ObjectId,
	name: String,
	pass: String
});*/



// POST
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');
function PostCode(codestring) {
  var post_data = querystring.stringify({
      'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
      'output_format': 'json',
      'output_info': 'compiled_code',
        'warning_level' : 'QUIET',
        'js_code' : codestring
  });
  var post_options = {
      host: 'closure-compiler.appspot.com',
      port: '80',
      path: '/compile',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
      });
  });
  post_req.write(post_data);
  post_req.end();

}
fs.readFile(/*Любой файл в виде ссылки*/, 'utf-8', function (err, data) {
  if (err) {
    console.log("FATAL An error occurred trying to read in the file: " + err);
    process.exit(-2);
  }
  if(data) {
    PostCode(data);
  }
  else {
    console.log("No data to post");
    process.exit(-1);
  }
});



// Create an HTTP server
const srv = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('okay');
});
srv.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // echo back
});

// now that server is running
srv.listen(PORT,  () => {

  // make a request
  const options = {
    port: PORT,
    hostname: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('got upgraded!');
    socket.end();
    process.exit(0);
  });
});

module.export ={ 
	//mongoose.model('Person', projectSchema),
	PORT,
};