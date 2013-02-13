var http = require('http');
var url = require('url');
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var fs = require('fs');
var util = require('util');

var resizer = require('./scale');

var serve_container = function(response, filename) {

  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  response.end('<html><body style="margin: 0px;"><img style="-webkit-user-select: none" src="/?i='+filename+'" /></body></html>');
}

var serve_image = function(response, file_path) {

  var extension = file_path.split('.').pop();
  var filename = file_path.split('/').pop();

    fs.readFile(file_path, 'binary', function(err, data) {

      if (err)
        error_page(response, err);

      response.writeHead(200, {
        'Content-Type': 'image/'+extension.substring(1, extension.length),
        'Content-Disposition': 'filename='+filename
      });
      response.end(data, 'binary');
    });
}

var error_page = function(response, error) {

  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Sorry, there was an error: \n');
  response.end(JSON.stringify(error));
}

http.createServer(function(request, response) {

  var query = url.parse(request.url, true).query;

  if (query.i) {

    // Serve static local image
    serve_image(response, query.i);

  } else if ((query.h || query.w) && query.u) {

    // Check dimension params for being integers
    if (typeof query.w !== 'undefined' && !/^\d+$/.test(query.w)) {
      return error_page(response, 'w parameter must be an integer');
    }
    if (typeof query.h !== 'undefined' && !/^\d+$/.test(query.h)) {
      return error_page(response, 'h parameter must be an integer');
    }

    var width = (query.w) ? query.w : false;
    var height = (query.h) ? query.h : false;
    var gravity = (query.g) ? query.g : false;
    var download = (query.d) ? true : false;

    // Resize then display or download image
    resizer.resize(width, height, query.u, gravity, function(file_path) {
      if (download)
        serve_image(response, file_path);
      else
        serve_container(response, file_path);
    });

  } else {

    // Serve a 404
    error_page(response, 'Parameters probably missing. Requires width (w) or height (h) and a url (u).');
  }

}).listen(8888);