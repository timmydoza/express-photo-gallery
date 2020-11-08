var https = require('https');
var xmlParse = require('xml2js').parseString;
var path = require('path');
var isImage = require(__dirname + '/is-image');
var objectAssign = require('object-assign');
const util = require('util');
var url = require('url');
const {Storage} = require('@google-cloud/storage');


module.exports = function(bucketUrl, userOptions, callback) {

    // Creates a client
    var storage = new Storage({
        projectId: 'empyrean-aurora-292013',
        keyFilename: 'keyfile.json'
    })

    var urlObj = url.parse(bucketUrl);
    var BUCKET_NAME = urlObj.pathname;
    var baseUrl = urlObj.protocol + '//' + urlObj.hostname;
    var bucket = storage.bucket(BUCKET_NAME);

    //Get File objects for the files currently in the bucket.
    bucket.getFiles(function (err, files) {
        if (!err) {
            //console.log(util.inspect(files[0], false, null, true /* enable colors */))

            var photoObj = {};


            //récupération des liens de fichiers
            files.forEach(function (file) {
                var filePathFromObject = file['metadata']['name'];



                var filePath = path.parse(filePathFromObject);
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
                        photoObject.src = baseUrl + BUCKET_NAME + '/previews/' + file;
                        photoObject.downloadUrl = photoObject.src;
                        //photoObject.downloadUrl = toString(file['metadata']['mediaLink']);

                    } else {
                        photoObject.src = baseUrl + BUCKET_NAME + '/' + file;
                    }

                    if (photoObj.thumbs) photoObject.thumb = baseUrl + BUCKET_NAME + '/thumbs/' + file;

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

            //console.log(photoObjects);
        }
    });
};



