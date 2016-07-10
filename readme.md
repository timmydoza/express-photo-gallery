# express-photo-gallery

EPG (express-photo-galler) is a node module that creates an Express.js middleware function for hosting stylish and responsive photo galleries using [jQuery lightgallery](http://sachinchoolur.github.io/lightGallery/).

`npm install express-photo-gallery`

To get started, make an Express.js HTTP server.  Require EPG and provide it with a path to a directory of JPG images

```
var express = require('express');
var app = express();

var Gallery = require('express-photo-gallery');

app.use('/photos', Gallery('path_to_photos'));

app.listen(3000);
```

That's it! [See it in action here!](http://timmydoza.com/epg)

EPG will automatically look through the provided directory for a `thumbs` subdirectory and `previews` subdirectory, which should both contain files with the same filenames as those in the base folder.  For example:

```
path_to_photos/
| file1.jpg
| file2.jpg
| file3.jpg
---

```
