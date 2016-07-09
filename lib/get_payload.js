var fs = require('fs');

exports = function(photoPath, options, callback) {
  fs.readDir(resolve(photoPath), function(err, files) {
    if (err) throw err;
    var photoObjects = [];

    files.forEach(function(file) {
      var ext = file.split('.');
      var photoObject = {};

      //If file is a JPEG --add more file types
      if (ext.length > 1 && ext[ext.length - 1] === 'jpg') {

        photoObject.src = join('photos', file);
        if (thumbPath) photoObject.thumb = join('thumbs', file);
        if (previewPath) photoObject.downloadUrl = join('downloads', file);

        photoObjects.push(photoObject);
      }
    });

    var payload = _.assign({
        download: true,
        thumbnail: !!thumbPath
      },
      options,
      {
        dynamic: true,
        dynamicEl: photoObjects,
        closable: false,
        escKey: false,
      });

    callback(payload);
  });
}
