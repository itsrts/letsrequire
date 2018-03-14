# letsrequire [![Build Status]

> Overrides [`require()`](https://nodejs.org/api/globals.html#globals_require_resolve) and adds hot-reload functionality

Just add `require('letsrequire')` and run your application with simple "node filename.js" and it will hot-load your dependencies.
So, you are not required to do any change in your existing application.


## Install

```
npm install letsrequire
```


## Usage

```js
require('letsrequire');
```


## API

Nothing as such, just add the 'require' statement and you are good to go.
As the library overrides the native implementation of require, you do not need to make any other change in your project/code.


## Errors - but nothing breaks..!! :)

There can be few errors as we are hot reloading the dependencies on file changes.
The errors are console logged and we wait for the next file change to reload the file.
But the system still works fine with the earlier version of the file.
So NOTHING breaks..!! :)

##How does it work

It uses the native require module to serve the core purpose. Watches for file changes on the application working directory that are required by this library and not all the files.
Cleans the require cache when it detects that a re-require is required. Replaces all of your instances with the new module. Straight simple logic...

##Note..!!
Does not hot-reload node-modules, as you are expected to restart your process.
This should only be the scenario where you have altered your dependencies

##Example :

A dependency file to return a simple string
```js
    let anythingdynamic = function() {
        return "this string can be changed in runtime, and server will serve the updated one";
    }

    module.exports = {
        anythingdynamic
    }
```

A simple server, to response the string from the above file

```js
    require('letsrequire');// <-- this is the new thing

    var http = require('http');

    // loading the dependencies just like before
    let reply = require("./reply.js");

    http.createServer(function (req, res) {
        // use the dependency as before
        res.write(reply.anythingdynamic());
        res.end();
    }).listen(8080);
```

## Related

- [invalidate-module](https://www.npmjs.com/package/invalidate-module) - Removes a module and all of its dependents from the require cache
- [require-reload](https://www.npmjs.com/package/require-reload) - require-reload facilitates hot-reloading files in node.js. Each call will re-fetch the file/module and require it.
- [hotter-require](https://www.npmjs.com/package/hotter-require) - Modifies require to enable hot-reloading of code modules.


## License

Apache-2.0 © [Rajdeep Deb](http://rajdeepdeb.me)


