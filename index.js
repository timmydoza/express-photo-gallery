var express = require('express');
var readDir = require('fs').readdir;
var fs = require('fs');
var join = require('path').join;
var resolve = require('path').resolve;
var _ = require('lodash');
var mustache = require('mustache');
var template = fs.readFileSync(__dirname + '/assets/template.html').toString();
mustache.parse(template);

module.exports = function(photoPath, options) {
  var app = express.Router();

  var previewPath;
  var thumbPath;

  if (!directoryExists(photoPath)) throw new Error('Must provide valid path for photos');

  if (directoryExists(photoPath + '/previews')) {
    previewPath = photoPath + '/previews';
  }

  if (directoryExists(photoPath + '/thumbs')) {
    thumbPath = photoPath + '/thumbs';
  }

  app.use('/', express.static(__dirname + '/assets'));
  app.use('/photos', express.static(previewPath || photoPath));
  if (thumbPath) app.use('/thumbs', express.static(thumbPath));
  if (previewPath) app.use('/downloads', express.static(photoPath));

  app.get('/', function(req, res) {

    //Get files in directory
    readDir(resolve(photoPath), function(err, files) {
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
      res.send(mustache.render(template, {title: 'OK', data: JSON.stringify(payload)}));
    });
  });
  return app;
};

//Utils
var statSync = require('fs').statSync;

var directoryExists = function(directory) {
  try {
    return statSync(resolve(directory)).isDirectory();
  } catch (e) {
    return false;
  }
};
