var Module = require('module');
var fs = require('fs');
const watch = require('node-watch');
const EventBus = require('./eventbus.min.js');
const appRoot = process.cwd();
// var _require = require;

// listening for file changes
watch(appRoot, { recursive: true }, function(evt, filename) {
  // skipping unwanted changes, which no one is listening
  if(!EventBus.hasEventListener(filename)) {
    // console.log("not reloading", filename);
    return;
  }
  // dispatching event for the file contents changed with the reloaded module
  let old_module = Module._cache[filename];
  try {
    delete Module._cache[filename];
    const newModule = Module._load(filename);
    console.log('succefully reloaded : ', filename);
    EventBus.dispatch(filename, this, newModule);
  } catch (error) {
    // restoring the old_module, as we got an exception with the new one
    Module._cache[filename] = old_module;
    console.log("\n\n***OOPs We got a problem reloading***", filename);
    console.log(error);
    console.log("\n***The above error should be helpful***");
  }
});

const stack = function() {
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack){ return stack; };
  var err = new Error;
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

let load = function(file) {
  if(!file) {
    return null;
  }
  // check if it's relative to the app root directory
  let dir = null;
  try {
    dir = require.resolve(appRoot + "/" + file);
  } catch (error) {
    dir = null;
  }
  if(dir) {
    file = dir;
  }
  // check if it's a relative path
  else if(file.startsWith(".")) {
    file = file.replace(".", "");
    let parent = stack()[2].getFileName();
    parent = parent.split("/");
    let count = parent.length;
    // get the count of . or ..
    let back = 1;
    if(file.startsWith("..")) {
      back = (temp.match(/..\//g) || []).length;
    }
    parent = "/" + parent.slice(1 , count - back).join("/");
    file = parent +file;
    file = file.replace(/\/\//g, "/");
    file = require.resolve(file);
  } else {
    return Module._load(file);
  }
  let d = Module._load(file);
  let p = {
    "d" : d,
    "file" : file
  };
  const obj = new Proxy(p, {
    get: function(target, name, receiver) {
        return target.d[name];
    }
  });
  // listening for the change event and reassign
  EventBus.addEventListener(file, function change(event, newModule) {
    obj.d = newModule;
  });
  return obj;
}

load = new Proxy(load, {
  get: function(target, name, receiver) {
      return Module.require(name);
  }
});

Module.prototype.require = load;