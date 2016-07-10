# express-photo-gallery

EPG is a node module that creates an Express.js middleware function for hosting stylish and responsive photo galleries using [jQuery lightgallery](http://sachinchoolur.github.io/lightGallery/).

`npm install express-photo-gallery`

To get started, make an Express.js HTTP server:

```
var express = require('express');
var app = express();

var Gallery = require('express-photo-gallery');

app.use('/photos', Gallery('path_to_photos'));

app.listen(3000);
```

That's it!
