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

// loads all the files in the array
const loadDependencies = function (files) {
  const dependencies = [];
  for (var i = 0, len = files.length; i < len; i++) {
    // var file = appRoot + "/" + files[i];
    var file = files[i];
    dependencies[file] = require(file);
    // listening for the changes in the file and reassign
    EventBus.addEventListener(file, function change(event, newModule) {
      dependencies[event.type] = newModule;
    });
  }
  return dependencies;
}

module.exports = {
  loadDependencies
}

