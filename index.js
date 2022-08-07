const { createHook, AsyncResource } = require('async_hooks');
const weakMap = new WeakMap();
let gcCallbackContext = {};

let hooks;

function trackGC(obj, gcCallback) {
  if (!hooks) {
    hooks = createHook({
      destroy(id) {
        if (gcCallbackContext[id]) {
          gcCallbackContext[id]();
          delete gcCallbackContext[id];
        }
      }
    }).enable();
  }
  const gcTracker = new AsyncResource('none');
  gcCallbackContext[gcTracker.asyncId()] = gcCallback;
  weakMap.set(obj, gcTracker);
}

function stopTrackGC() {
  if (hooks) {
    hooks.disable();
    gcCallbackContext = {};
    hooks = null;
  }
}

module.exports = {
    trackGC,
    stopTrackGC,
};