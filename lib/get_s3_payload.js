var https = require('https');
var xmlParse = require('xml2js').parseString;
var path = require('path');
var isImage = require(__dirname + '/is-image');
var objectAssign = require('object-assign');


module.exports = function(bucket, userOptions, callback) {

  var req = https.request('https://' + bucket + '.s3.amazonaws.com/', function(response) {
    var xml = '';

    response.on('data', function(data) {
      xml += data;
    });

    response.on('end', function() {

      xmlParse(xml, function(err, result) {
        var photoObj = {};

        result.ListBucketResult.Contents.forEach(function(item) {
          var filePath = path.parse(item.Key[0]);
          var dir = filePath.dir || 'root';
          var name = filePath.base;

          if (!photoObj[dir]) {
            photoObj[dir] = [name];
          } else {
            photoObj[dir].push(name);
          }

        });

        var photoObjects = [];

        photoObj.root.forEach(function(file) {
          var photoObject = {};

          if (isImage(file)) {

            if (photoObj.previews) {
              photoObject.src = 'https://' + bucket + '.s3.amazonaws.com/previews/' + file;
              photoObject.downloadUrl = 'https://' + bucket + '.s3.amazonaws.com/' + file;
            } else {
              photoObject.src = 'https://' + bucket + '.s3.amazonaws.com/' + file;
            }

            if (photoObj.thumbs) photoObject.thumb = 'https://' + bucket + '.s3.amazonaws.com/thumbs/' + file;

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
            thumbnail: !!photoObj.thumbs
          };

          var payload = objectAssign(optionalSettings, userOptions, mandatorySettings);

          callback(payload);

      });
    });

  })

  req.on('error', function(err){
    throw err;  //add message
  })

  req.end();

};
