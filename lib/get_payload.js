var fs = require('fs');
var _ = require('lodash');
var join = require('path').join;
var resolve = require('path').resolve;

module.exports = function(paths, userOptions, callback) {
  fs.readdir(resolve(paths.photos), function(err, files) {

    if (err) throw err;

    var photoObjects = [];

    files.forEach(function(file) {
      var ext = file.split('.');
      var photoObject = {};

      //If file is a JPEG
      //TODO: add more file types
      if (ext.length > 1 && ext[ext.length - 1] === 'jpg') {

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

    var payload = _.assign(optionalSettings, userOptions, mandatorySettings);

    callback(payload);
  });
};
