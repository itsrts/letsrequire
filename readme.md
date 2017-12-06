Hot require your dependencies

A very simple logic of replacing objects with array of dependencies.

Let's follow the steps:
 - require the package "letsrequire"
 - create constant variables having path of the local "js" you want to require
 - initiate "loaddependencies" by passing all your constant variable in an array
 - you get an array of all of your dependencies
 - use the constans created as reference of your "js" files to access everything

Example :
<code>
    // get the app Root Directory
    const appRoot = process.cwd();

    var http = require('http');

    // replace the following line with "var lets = require('./index.js');"
    var lets = require('./index.js');

    // create constants for all the local dependencies
    let REPLY = appRoot + "/reply.js";

    // load the dependencies by passing as an array
    let d = lets.loadDependencies([REPLY]);

    http.createServer(function (req, res) {
        // use the dependencies from the array
        res.write(d[REPLY].reply());
        res.end();
    }).listen(8080);
</code>