
const { trackGC, stopTrackGC } = require('../index');

function memory() {
  return ~~(process.memoryUsage().heapUsed / 1024 / 1024);
}

console.log(`before new Array: ${memory()} MB`);

let key = {
  a: new Array(1024 * 1024 * 10)
};

let key2 = {
  a: new Array(1024 * 1024 * 10)
};

console.log(`after new Array: ${memory()} MB`);

trackGC(key, () => {
  console.log("key gc");
});

trackGC(key2, () => {
  console.log("key2 gc");
});

global.gc();

key = null;

key2 = null;

global.gc();

console.log(`after gc: ${memory()} MB`);