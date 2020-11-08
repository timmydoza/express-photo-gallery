var fs = require('fs');
var Router = require('router');
var static = require('serve-static');
var directoryExists = require('directory-exists').sync;
var getPayload = require(__dirname + '/lib/get_payload');
var getS3Payload = require(__dirname + '/lib/get_s3_payload');

var getGCSPayload = require(__dirname + '/lib/get_gcs_payload');

var resolveModulePath = require(__dirname + '/lib/resolve_module_path');
var mustache = require('mustache');
var template = fs.readFileSync(__dirname + '/lib/template.html').toString();
var url = require('url');
mustache.parse(template);

module.exports = function(photoPath, options) {
  var app = Router();

  options = options || {};

  var paths = {
    photos: photoPath,
    previews: null,
    thumbs: null,
  };

  //get an element in urlObj wich specify aws or gcs
  var urlObj = url.parse(photoPath);
  var s3 = (urlObj.protocol === 's3:');
  var gcs = (urlObj.protocol === 'https:' && urlObj.hostname == 'storage.googleapis.com');
  console.log(urlObj.hostname);


  if (gcs){
    console.log('urlObj protocol is "' + urlObj.protocol + '" and hostname is "' + urlObj.hostname + '"');
  }

  if (!gcs) {

    if (!directoryExists(photoPath)) throw new Error('Must provide valid path for photos');

    if (directoryExists(photoPath + '/previews')) {
      paths.previews = photoPath + '/previews';
    }

    if (directoryExists(photoPath + '/thumbs')) {
      paths.thumbs = photoPath + '/thumbs';
    }

    app.use('/photos', static(paths.previews || photoPath));
    if (paths.thumbs) app.use('/thumbs', static(paths.thumbs));
    if (paths.previews) app.use('/downloads', static(photoPath));

  }

  app.use(static(resolveModulePath('lightgallery') + '/dist'));
  app.use('/js', static(resolveModulePath('lg-zoom') + '/dist'));
  app.use('/js', static(resolveModulePath('lg-thumbnail') + '/dist'));
  app.use('/js', static(resolveModulePath('lg-fullscreen') + '/dist'));

  app.get('/', function(req, res) {

    if (gcs) {

      getGCSPayload(photoPath, options, function(payload) {
        res.send(mustache.render(template, {
          title: options.title || 'Photo Gallery',
          data: JSON.stringify(payload)
        }))
      });

    } else{

      getPayload(paths, options, function(payload) {
        res.send(mustache.render(template, {
          title: options.title || 'Photo Gallery',
          data: JSON.stringify(payload)
        }));
      });

    }

  });

  return app;
};
