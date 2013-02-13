var request = require('request');
var fs = require('fs');
var im = require('imagemagick');

var resize = function(w, h, u, gravity, callback) {

  var desired_width = w;
  var desired_height = h;
  var image_path = u;
  var image_extension = image_path.match(/\.\S{3,4}$/)[0];
  var image_filename = random_string() + image_extension;
  var image_filepath = './images/'+image_filename;
  var image_info;

  // Download image
  var write_stream = fs.createWriteStream(image_filepath);
  request(image_path).pipe(write_stream);

  write_stream.on('close', function() {
    // Get the dimensions and other info
    image_info = im.identify(image_filepath, function(err, features){
      if (err) throw err;

      // If the user didn't specify a height or width, use existing height or width
      if (desired_height == false)
        desired_height = features.height;
      if (desired_width == false)
        desired_width = features.width;

      var cropping = {
        srcPath: image_filepath,
        dstPath: image_filepath,
        width: desired_width,
        height: desired_height
      }

      if (gravity) {
        cropping.gravity = gravity;
      }

      im.crop(cropping, function(err, stdout, stderr){
        if (err) throw err;

        callback(image_filepath);
      });

    });
  });
}

// No longer used
var delete_image = function(image_filepath) {
  fs.unlink(image_filepath, function (err) {
    if (err) throw err;
  });
}

// Also no longer used
var get_extension = function(filename) {
  return filename.match(/\.\S{3,4}$/)[0];
}

var random_string = function() {
  var n = 10;
  var random = "";
  while (n > 0) {
    var ascii = Math.floor(Math.random()*58)+65;
    if (ascii >= 91 && ascii <= 96) continue;
    random += String.fromCharCode(ascii)
    n -= 1;
  }
  return random;
}

exports.random_string = random_string;
exports.delete_image = delete_image;
exports.resize = resize;
exports.get_extension = get_extension;