const appRoot = process.cwd();
const watch = require('node-watch');
const reload = require('require-reload')(require);
const EventBus = require(appRoot + '/eventbus.min.js');

// listening for file changes
watch(appRoot, function(evt, filename) {
  // skipping unwanted changes, which no one is listening
  if(!EventBus.hasEventListener(filename)) {
    console.log("not reloading", filename);
    return;
  }
  // dispatching event for the file contents changed with the reloaded module
  const newModule = reload(filename);
  console.log('reloaded : ', filename);
  EventBus.dispatch(filename, this, newModule);
});

const load = function(file) {
  file = appRoot + file;
  let d = require(file);
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

module.exports = load;

