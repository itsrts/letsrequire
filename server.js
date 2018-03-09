var http = require('http');
require('./index.js');

let reply = require("./reply.js");

http.createServer(function (req, res) {
  res.write(reply.reply());
  res.end();
}).listen(8080);