# express-photo-gallery
[![Build Status](https://travis-ci.org/timmydoza/express-photo-gallery.svg?branch=master)](https://travis-ci.org/timmydoza/express-photo-gallery)

EPG (express-photo-gallery) is a node module that creates an Express.js middleware function for hosting stylish and responsive photo galleries using [jQuery lightgallery](http://sachinchoolur.github.io/lightGallery/).

[See a sample gallery here](http://timmydoza.com/express-photo-gallery).

## Usage:

#### Install:
`npm install express-photo-gallery`

#### Implement:
```
var express = require('express');
var app = express();

var Gallery = require('express-photo-gallery');

var options = {
  title: 'My Awesome Photo Gallery'
};

app.use('/photos', Gallery('path_to_photos', options));

app.listen(3000);
```

That's it!  [See it in action here](http://timmydoza.com/express-photo-gallery).

EPG will automatically look through the provided directory for a `thumbs` subdirectory and `previews` subdirectory, which should both contain files with the same filenames as those in the base folder.  For example:

```
path_to_photos
├── file1.jpg
├── file2.jpg
├── file3.jpg
├── previews
│   ├── file1.jpg
│   ├── file2.jpg
│   └── file3.jpg
└── thumbs    
    ├── file1.jpg
    ├── file2.jpg
    └── file3.jpg
```
If your photo directory does not have `thumbs` or `previews`, EPG will host the images in the base directory, without displaying thumbnails.  

If you would like to generate `thumbs` and `previews` automatically, use `epg-prep`:

## epg-prep

`epg-prep` is a mutithreaded command-line helper utility which automatically generates image previews and thumbnails from a directory of jpg images.  The previews and thumbnails are stored in `previews` and `thumbs` subdirectories, respectively.

Note: `epg-prep` must be installed globally.

`npm install -g epg-prep`

`epg-prep path_to_photos`

Using `epg-prep` to generate `thumbs` and `previews` subdirectories is especially useful if you have a directory of large photos from a digital camera.

#### GraphicsMagick or ImageMagick

`epg-prep` depends on [ImageMagick](http://www.imagemagick.org/script/index.php) or [GraphicsMagick](http://www.graphicsmagick.org/), so make sure they are installed on your system and properly set up in your PATH.

Ubuntu:
```
apt-get install imagemagick
apt-get install graphicsmagick
```

Mac OS X (using Homebrew):
```
brew install imagemagick
brew install graphicsmagick
```


Confirm that ImageMagick is properly set up by executing `convert -help` in a terminal.

### Todo:

- Add support for more file types
- Add ability to add prefix to files in `previews` and `thumbs`
- Tests for erg-prep
- Add feature to randomize photo order on each load
