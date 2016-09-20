var chai = require('chai');
var expect = chai.expect;

var getS3Payload = require(__dirname + '/../lib/get_s3_payload');

describe('The getS3Payload function', function() {
  it('return a payload with no thumbs', function(done) {

    var result = {
      download: true,
      thumbnail: false,
      dynamic: true,
      dynamicEl:
        [ { src: 'https://epg-test-no-thumbs.s3.amazonaws.com/file1.jpg' },
          { src: 'https://epg-test-no-thumbs.s3.amazonaws.com/file2.jpg' },
          { src: 'https://epg-test-no-thumbs.s3.amazonaws.com/file3.jpg' } ],
      closable: false,
      escKey: false
    };

    getS3Payload('epg-test-no-thumbs', {}, function(payload) {
      expect(payload).to.eql(result);
      done();
    });
  });

  it('return a payload with correct options', function(done) {

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
        [ { src: 'https://epg-test-no-thumbs.s3.amazonaws.com/file1.jpg' },
          { src: 'https://epg-test-no-thumbs.s3.amazonaws.com/file2.jpg' },
          { src: 'https://epg-test-no-thumbs.s3.amazonaws.com/file3.jpg' } ],
      closable: false,
      escKey: false
    };

    getS3Payload('epg-test-no-thumbs', options, function(payload) {
      expect(payload).to.eql(result);
      done();
    });
  });

  it('return a payload with thumbs', function(done) {

    var result = {
      download: true,
      thumbnail: true,
      dynamic: true,
      dynamicEl:
       [ { src: 'https://epg-test-thumbs.s3.amazonaws.com/previews/file1.jpg',
           thumb: 'https://epg-test-thumbs.s3.amazonaws.com/thumbs/file1.jpg',
           downloadUrl: 'https://epg-test-thumbs.s3.amazonaws.com/file1.jpg' },
         { src: 'https://epg-test-thumbs.s3.amazonaws.com/previews/file2.jpg',
             thumb: 'https://epg-test-thumbs.s3.amazonaws.com/thumbs/file2.jpg',
             downloadUrl: 'https://epg-test-thumbs.s3.amazonaws.com/file2.jpg' },
         { src: 'https://epg-test-thumbs.s3.amazonaws.com/previews/file3.jpg',
             thumb: 'https://epg-test-thumbs.s3.amazonaws.com/thumbs/file3.jpg',
             downloadUrl: 'https://epg-test-thumbs.s3.amazonaws.com/file3.jpg' } ],
      closable: false,
      escKey: false
    };

    getS3Payload('epg-test-thumbs', {}, function(payload) {
      expect(payload).to.eql(result);
      done();
    });
  });
});
