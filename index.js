var fs = require('fs');
var express = require('express');
var directoryExists = require(__dirname + '/lib/directory_exists');
var getPayload = require(__dirname + '/lib/get_payload');
var resolveModulePath = require(__dirname + '/lib/resolve_module_path');
var mustache = require('mustache');
var template = fs.readFileSync(__dirname + '/lib/template.html').toString();
mustache.parse(template);

module.exports = function(photoPath, options) {
  var app = express.Router();

  options = options || {};

  var paths = {
    photos: photoPath,
    previews: null,
    thumbs: null
  };

  if (!directoryExists(photoPath)) throw new Error('Must provide valid path for photos');

  if (directoryExists(photoPath + '/previews')) {
    paths.previews = photoPath + '/previews';
  }

  if (directoryExists(photoPath + '/thumbs')) {
    paths.thumbs = photoPath + '/thumbs';
  }

  app.use('/lg', express.static(resolveModulePath('lightgallery') + '/dist'));
  app.use('/photos', express.static(paths.previews || photoPath));
  if (paths.thumbs) app.use('/thumbs', express.static(paths.thumbs));
  if (paths.previews) app.use('/downloads', express.static(photoPath));

  app.get('/', function(req, res) {
    getPayload(paths, options, function(payload) {
      res.send(mustache.render(template, {
        title: options.title || 'Photo Gallery',
        data: JSON.stringify(payload)
      }));
    });
  });

  return app;
};
