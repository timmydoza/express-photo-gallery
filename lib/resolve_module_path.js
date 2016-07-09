module.exports = function(packageName) {
  var path = require.resolve(packageName);
  return path.split(packageName)[0] + packageName;
}
