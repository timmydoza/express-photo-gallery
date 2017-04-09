var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;
var isImage = require(__dirname + '/is-image');
var objectAssign = require('object-assign');


module.exports = function(paths, userOptions, callback) {
  fs.readdir(resolve(paths.photos), function(err, files) {

    if (err) throw err;

    var photoObjects = [];

    files.forEach(function(file) {
      var photoObject = {};

      if (isImage(file)) {

        photoObject.src = join('photos', file);
        if (paths.thumbs) photoObject.thumb = join('thumbs', file);
        if (paths.previews) photoObject.downloadUrl = join('downloads', file);

        photoObjects.push(photoObject);
      }
    });

    var mandatorySettings = {
      dynamic: true,
      dynamicEl: photoObjects,
      closable: false,
      escKey: false,
    };

    var optionalSettings = {
      download: true,
      thumbnail: !!paths.thumbs
    };

    var payload = objectAssign(optionalSettings, userOptions, mandatorySettings);

    callback(payload);
  });
};
