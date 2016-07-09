var express = require('express');
var join = require('path').join;
var resolve = require('path').resolve;
var _ = require('lodash');
var directoryExists = require('directory_exists');
var getPayload = require('get_payload');
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
    getPayload(photoPath, options, function(payload) {
      res.send(mustache.render(template, {title: 'OK', data: JSON.stringify(payload)}));
    });
  });
  
  return app;
};
