const appRoot = process.cwd();
var http = require('http');
var lets = require('./index.js');

let REPLY = appRoot + "/reply.js";
let d = lets.loadDependencies([REPLY]);

console.log(d);

http.createServer(function (req, res) {
  res.write(d[REPLY].reply());
  res.end();
}).listen(8080);