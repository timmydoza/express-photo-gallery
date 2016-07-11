var fs = require('fs');
var Router = require('router');
var static = require('serve-static');
var directoryExists = require('directory-exists').sync;
var getPayload = require(__dirname + '/lib/get_payload');
var resolveModulePath = require(__dirname + '/lib/resolve_module_path');
var mustache = require('mustache');
var template = fs.readFileSync(__dirname + '/lib/template.html').toString();
mustache.parse(template);

module.exports = function(photoPath, options) {
  var app = Router();

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

  app.use(static(resolveModulePath('lightgallery') + '/dist'));
  app.use('/photos', static(paths.previews || photoPath));
  if (paths.thumbs) app.use('/thumbs', static(paths.thumbs));
  if (paths.previews) app.use('/downloads', static(photoPath));

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
