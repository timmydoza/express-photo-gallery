var fs = require('fs');

exports = function(directory) {
  try {
    return fs.statSync(resolve(directory)).isDirectory();
  } catch (e) {
    return false;
  }
};
