var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);


var fs = require('fs');

function makeApp(path, params) {
  var app = require('express')();
  var expressPhotoGallery = require(__dirname + '/../index.js')(params);
  app.use(path, expressPhotoGallery);
  return app;
}

function logResult(name, data) {
  fs.writeFileSync(__dirname + '/expected_results/' + name + '.result', data);
};

var noThumbsGallery = makeApp('/', __dirname + '/test_images/no_thumbs_gallery');
var noThumbsExpectedResult = fs.readFileSync(__dirname + '/expected_results/no_thumbs.result').toString();

describe('the default gallery with no thumbnails', function() {
  it('should return valid response', function(done) {
    chai.request(noThumbsGallery)
      .get('/')
      .end(function(err, res) {
        //logResult('no_thumbs', res.text);
        expect(err).to.be.null;
        expect(res.status).to.eql(200);
        expect(res.headers['content-type']).to.eql('text/html; charset=utf-8');
        expect(res.text).to.eql(noThumbsExpectedResult);
        done();
      });
  });

  it('should return js and css files');
});
