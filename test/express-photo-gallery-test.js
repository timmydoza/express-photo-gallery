var chai = require('chai');
var expect = chai.expect;
var chaiHttp = require('chai-http');
var async = require('async');
var resolveModulePath = require(__dirname + '/../lib/resolve_module_path')
chai.use(chaiHttp);

var fs = require('fs');

function makeApp(path, params, opts) {
  var app = require('express')();
  var expressPhotoGallery = require(__dirname + '/../index.js')(params, opts);
  app.use(path, expressPhotoGallery);
  return app;
}

function logResult(name, data) {
  fs.writeFileSync(__dirname + '/expected_results/' + name + '.result', data);
};

var noThumbsGallery = makeApp('/', __dirname + '/test_images/no_thumbs_gallery');
var noThumbsExpectedResult = fs.readFileSync(__dirname + '/expected_results/no_thumbs.result').toString();

var fullGallery = makeApp('/full', __dirname + '/test_images/full_gallery', {title: 'Test Title'});
var fullExpectedResult = fs.readFileSync(__dirname + '/expected_results/full.result').toString();

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

  it('should return a 404 for /thumbs', function(done) {
    chai.request(noThumbsGallery)
      .get('/thumbs')
      .end(function(err, res) {
        //logResult('no_thumbs', res.text);
        expect(err.message).to.eql('Not Found');
        expect(res.status).to.eql(404);
        expect(res.headers['content-type']).to.eql('text/html; charset=utf-8');
        expect(res.text.match('Cannot GET /thumbs')).to.not.be.null;
        done();
      });
  });

  it('should return a 404 for /previews', function(done) {
    chai.request(noThumbsGallery)
      .get('/previews')
      .end(function(err, res) {
        //logResult('no_thumbs', res.text);
        expect(err.message).to.eql('Not Found');
        expect(res.status).to.eql(404);
        expect(res.headers['content-type']).to.eql('text/html; charset=utf-8');
        expect(res.text.match('Cannot GET /previews')).to.not.be.null;
        done();
      });
  });

  it('shoud serve photos', function(done) {
    var photos = fs.readdirSync('test/test_images/no_thumbs_gallery');
    async.forEach(photos, function(photo, cb) {
      chai.request(noThumbsGallery)
        .get('/photos/' + photo)
        .end(function(err, res) {
          //logResult('no_thumbs', res.text);
          expect(err).to.be.null;
          expect(res.status).to.eql(200);
          expect(res.headers['content-type']).to.eql('image/jpeg');
          cb();
        });
    }, done);
  });

  it('should serve static assets', function(done) {
    chai.request(noThumbsGallery)
      .get('/js/lightgallery.js')
      .end(function(err, res) {
        //logResult('no_thumbs', res.text);
        res.on('data', function(data) {
          expect(err).to.be.null;
          expect(res.status).to.eql(200);
          expect(res.headers['content-type']).to.eql('application/javascript');
          expect(data.toString()).to.eql(fs.readFileSync(resolveModulePath('lightgallery') + '/dist/js/lightgallery.js').toString());
          done();
        });
      });
  });
});

describe('the default gallery with thumbnails and previews', function() {
  it('should return valid response', function(done) {
    chai.request(fullGallery)
      .get('/full/')
      .end(function(err, res) {
        //logResult('full', res.text);
        expect(err).to.be.null;
        expect(res.status).to.eql(200);
        expect(res.headers['content-type']).to.eql('text/html; charset=utf-8');
        expect(res.text).to.eql(fullExpectedResult);
        done();
      });
  });

  it('should redirect if no trailing slash', function(done) {
    chai.request(fullGallery)
      .get('/full')
      .end(function(err, res) {
        expect(err).to.be.null;
        expect(res.status).to.eql(200);
        expect(res.headers['content-type']).to.eql('text/html; charset=utf-8');
        expect(res).to.redirect;
        expect(res.text).to.eql(fullExpectedResult);
        expect(res.req.path).to.eql('/full/')
        done();
      });
  });

  it('shoud serve previews', function(done) {
    var photos = fs.readdirSync('test/test_images/full_gallery/previews');
    async.forEach(photos, function(photo, cb) {
      if (photo.split('.')[1] === 'jpg') {
        chai.request(fullGallery)
          .get('/full/photos/' + photo)
          .end(function(err, res) {
            //logResult('no_thumbs', res.text);
            expect(err).to.be.null;
            expect(res.status).to.eql(200);
            expect(res.headers['content-type']).to.eql('image/jpeg');
            expect(res.body.toString()).to.eql('preview\n');
            cb();
          });
        } else {
          cb();
        }
    }, done);
  });

  it('shoud serve thumbnails', function(done) {
    var photos = fs.readdirSync('test/test_images/full_gallery/thumbs');
    async.forEach(photos, function(photo, cb) {
      if (photo.split('.')[1] === 'jpg') {
        chai.request(fullGallery)
          .get('/full/thumbs/' + photo)
          .end(function(err, res) {
            //logResult('no_thumbs', res.text);
            expect(err).to.be.null;
            expect(res.status).to.eql(200);
            expect(res.headers['content-type']).to.eql('image/jpeg');
            expect(res.body.toString()).to.eql('thumb\n');
            cb();
          });
        } else {
          cb();
        }
    }, done);
  });

  it('shoud serve downloads', function(done) {
    var photos = fs.readdirSync('test/test_images/full_gallery');
    async.forEach(photos, function(photo, cb) {
      if (photo.split('.')[1] === 'jpg') {
        chai.request(fullGallery)
          .get('/full/downloads/' + photo)
          .end(function(err, res) {
            //logResult('no_thumbs', res.text);
            expect(err).to.be.null;
            expect(res.status).to.eql(200);
            expect(res.headers['content-type']).to.eql('image/jpeg');
            expect(res.body.toString()).to.eql('download\n');
            cb();
          });
        } else {
          cb();
        }
    }, done);
  });

  it('should serve static assets', function(done) {
    chai.request(fullGallery)
      .get('/full/js/lightgallery.js')
      .end(function(err, res) {
        //logResult('no_thumbs', res.text);
        res.on('data', function(data) {
          expect(err).to.be.null;
          expect(res.status).to.eql(200);
          expect(res.headers['content-type']).to.eql('application/javascript');
          expect(data.toString()).to.eql(fs.readFileSync(resolveModulePath('lightgallery') + '/dist/js/lightgallery.js').toString());
          done();
        });
      });
  });
});
