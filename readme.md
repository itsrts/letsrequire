Hot require your dependencies, load all your dependencies using this library and you are not required to restart your server for every change you make in the code.

You can run your application with simple "node filename.js" and it will hot-load your dependencies.
The best part, you are not required to do a lot of change in your existing application.

How To : Just require the library as "load" and replace all your "require(...)" line of code with "load(...)"

<b>Note : </b> load(...) accepts the path of the module from your project's root directory. 

Example :

A dependency file to return a simple string, let's name it  : reply.js
<code>

    let anythingdynamic = function() {
        return "this string can be changed in runtime, and server will serve the updated one";
    }

    module.exports = {
        anythingdynamic
    }
</code>

Some simple server, to response the string from the above file, let's name it  : server.js
<code>

    var http = require('http');

    var load = require('letsrequire');

    // load the dependencies
    let reply = load("/reply.js");
    // the above line was earlier written as : let reply = require("./reply.js");

    http.createServer(function (req, res) {
        // use the dependency as you were using it earlier
        res.write(reply.anythingdynamic());
        res.end();
    }).listen(8080);
</code>

<b>How does it work</b>
It uses the native require module to serve the core purpose. Watches for file changes only on the modules that are required by this library and not all the files.
Cleans the require cache when it detects that a re-require is required. Replaces all of your instances with the new module. Straight simple logic...