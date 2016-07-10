var chai = require('chai');
var expect = chai.expect;

var getPayload = require(__dirname + '/../lib/get_payload');

describe('The getPayload function', function() {
  it('return a payload with no thumbs', function(done) {
    var paths = {
      photos: __dirname + '/test_images/no_thumbs_gallery',
      previews: null,
      thumbs: null
    };

    var result = {
      download: true,
      thumbnail: false,
      dynamic: true,
      dynamicEl:
        [ { src: 'photos/file1.jpg' },
          { src: 'photos/file2.jpg' },
          { src: 'photos/file3.jpg' } ],
      closable: false,
      escKey: false
    };

    getPayload(paths, {}, function(payload) {
      expect(payload).to.eql(result);
      done();
    });
  });

  it('return a payload with correct options', function(done) {
    var paths = {
      photos: __dirname + '/test_images/no_thumbs_gallery',
      previews: null,
      thumbs: null
    };

    var options = {
      closable: true, //should be overwritten
      dynamic: false, //should be overwritten
      download: false,
    };

    var result = {
      download: false,
      thumbnail: false,
      dynamic: true,
      dynamicEl:
        [ { src: 'photos/file1.jpg' },
          { src: 'photos/file2.jpg' },
          { src: 'photos/file3.jpg' } ],
      closable: false,
      escKey: false
    };

    getPayload(paths, options, function(payload) {
      expect(payload).to.eql(result);
      done();
    });
  });

  it('return a payload with thumbs', function(done) {
    var paths = {
      photos: __dirname + '/test_images/full_gallery',
      previews: __dirname + '/test_images/full_gallery/previews',
      thumbs: __dirname + '/test_images/full_gallery/thumbs'
    };

    var result = {
      download: true,
      thumbnail: true,
      dynamic: true,
      dynamicEl:
       [ { src: 'photos/file1.jpg',
           thumb: 'thumbs/file1.jpg',
           downloadUrl: 'downloads/file1.jpg' },
         { src: 'photos/file2.jpg',
           thumb: 'thumbs/file2.jpg',
           downloadUrl: 'downloads/file2.jpg' },
         { src: 'photos/file3.jpg',
           thumb: 'thumbs/file3.jpg',
           downloadUrl: 'downloads/file3.jpg' } ],
      closable: false,
      escKey: false
    };

    getPayload(paths, {}, function(payload) {
      expect(payload).to.eql(result);
      done();
    });
  });
});
