var http = require('http');
var load = require('./index.js');

let reply = load("/reply.js");

http.createServer(function (req, res) {
  res.write(reply.reply());
  res.end();
}).listen(8080);