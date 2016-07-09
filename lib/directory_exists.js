var fs = require('fs');
var resolve = require('path').resolve;

module.exports = function(directory) {
  try {
    return fs.statSync(resolve(directory)).isDirectory();
  } catch (e) {
    return false;
  }
};
