"use strict";

var Module = require('module');
var fs = require('fs');
const watch = require('node-watch');
const EventBus = require('./eventbus.min.js');
const appRoot = process.cwd();
const map = {};
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
    console.log("\n\n***OOPs We got a problem while hot loading***", filename);
    console.log(error);
    console.log("\n***The above error should be helpful***");
  }
});

let listen = function(map1) {
  const map = map1;
  
  EventBus.addEventListener(map.path, function change(event, newModule) {
    map.source = newModule;
    map.target = newModule;
    if(map.isnew) {
      if(Array.isArray(map.args)) {
        map.target = new newModule(...map.args);
      } else {
        map.target = new newModule(map.args);
      }
    }
  });
}

let addProxy = function(map1) {
  const map = map1;

  const pro = new Proxy(map.target, {
    construct: function (target, args) {
      let _map = {};
      _map.isnew = true;
      _map.source = map.source;
      _map.args = args;
      if(Array.isArray(args)) {
        _map.target = new _map.source(...args);
      } else {
        _map.target = new _map.source(args);
      }
      _map.path = map.path;
      listen(_map);
      return addProxy(_map);
    },
    apply: function (target, that, args) {
      if(that == undefined) {
        map.target(...args);
      } else if(Array.isArray(args)) {
        map.target.apply(that, ...args);
      } else {
        map.target.apply(that, args);
      }
    },
    get: function(target, name, receiver) {
        return map.target[name];
    },
    set: function (target, key, value) {
      if (key in map.target) { return true; }
      map.target[key] = value;
      return true;
    },
    deleteProperty: function (target, key) {
      if (key in map.target) { return false; }
      return map.target.removeItem(key);
    },
    enumerate: function (target, key) {
      return Object.keys(map.target);
    },
    ownKeys: function (target, key) {
      return Object.keys(map.target);
    },
    has: function (target, key) {
      return key in map.target || (map.target.hasItem && map.target.hasItem(key));
    },
    defineProperty: function (target, key, oDesc) {
      if (oDesc && 'value' in oDesc) { map.target.setItem(key, oDesc.value); }
      return map.target;
    },
    getOwnPropertyDescriptor: function (target, key) {
      return Object.getOwnPropertyDescriptor(map.target, key);
      var vValue = map.target[key];
      return vValue ? {
        value: vValue,
        writable: true,
        enumerable: true,
        configurable: true
      } : undefined;
    }
  });
  return pro;
}

let load = function(file) {
  let path = Module._resolveFilename(file, this, false, {});
  let d = Module._load(file, this, /* isMain */ false);
  let nodeModule = appRoot + "/node_modules";
  if(path.startsWith(nodeModule) || !path.startsWith(appRoot)) {
    return d;
  }
  // console.log(path);
  let map = {};
  map.isnew = false;
  map.source = d;
  map.target = d;
  map.path = path;
  const obj = addProxy(map);
  listen(map);
  return obj;
};

load = new Proxy(load, {
  get: function(target, name, receiver) {
      return Module.require(name);
  }
});

Module.prototype.require = load;