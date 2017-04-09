var expect = require('chai').expect;
var isImage = require(__dirname + '/../lib/is-image');

describe('the isImage function', function() {
  it('should return true if the supplied filename is an image', function() {
    expect(isImage('test.jpg')).to.be.true;
    expect(isImage('test.gif')).to.be.true;
    expect(isImage('test.png')).to.be.true;
    expect(isImage('test.bmp')).to.be.true;
    expect(isImage('test.jpeg')).to.be.true;
    expect(isImage('test.test2.jpg')).to.be.true;
    expect(isImage('test.test2.bmp')).to.be.true;
    expect(isImage('test.test2.gif')).to.be.true;
    expect(isImage('test.test2.png')).to.be.true;
    expect(isImage('test.test2.jpeg')).to.be.true;
    expect(isImage('test.JPG')).to.be.true;
    expect(isImage('test.BMP')).to.be.true;
    expect(isImage('test.GIF')).to.be.true;
    expect(isImage('test.PNG')).to.be.true;
    expect(isImage('test.JPEG')).to.be.true;
  });

  it('should return false if the supplied filename is not an image', function() {
    expect(isImage('test.abc')).to.be.false;
    expect(isImage('test')).to.be.false;
  });
});
