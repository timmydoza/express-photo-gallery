# express-photo-gallery

EPG (express-photo-gallery) is a node module that creates an Express.js middleware function for hosting stylish and responsive photo galleries using [jQuery lightgallery](http://sachinchoolur.github.io/lightGallery/).

`npm install express-photo-gallery`

## Usage: 

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

That's it! [See it in action here!](http://timmydoza.com/epg)

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

Note: `epg-prep` must be installed globally.

`npm install -g epg-prep`

`epg-prep path_to_photos`

Using `epg-prep` to generate `thumbs` and `previews` subdirectories is especially useful if you have a directory of large photos from a digital camera.
