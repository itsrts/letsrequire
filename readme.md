Hot require your dependencies, load all your dependencies using this library and you are not required to restart your server for every change you make in the code.

You can run your application with simple "node filename.js" and it will hot-load your dependencies.
The best part, you are not required to do a lot of change in your existing application.

How To : Just require the library as "load" and replace all your "require(...)" line of code with "load(...)"

Example :

<code>

    var http = require('http');

    var load = require('letsrequire');

    // load the dependencies
    let reply = load("/reply.js");
    // the above line was earlier written as : let reply = require("./reply.js");

    http.createServer(function (req, res) {
        // use the dependency as you were using it earlier
        res.write(reply.reply());
        res.end();
    }).listen(8080);
</code>
