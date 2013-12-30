var express = require('express');
var app = express();

var id3 = require('id3js');

var fs = require('fs');
var path = require('path');

var musicdir = "/home/pi/music";

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) console.log(err);
    var pending = list.length;
    //console.log("list length "+pending);
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          /*id3({ file: "/home/pi/music/Avicii/12 Edom.mp3", type: id3.OPEN_LOCAL }, function(err, tags) {
                //console.log("adding "+ file);
                if (err) throw err;
                results = results.concat(tags);
                done(null, results);
                //console.log(tags);
          }); */
          console.log(results);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};




// Express config
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use("/styles",express.static(__dirname + "/styles"));
app.use("/js",express.static(__dirname + "/js"));
app.use("/home",express.static("/home"));

app.get('/', function(req, res) {
	// read content of the music directory
	walk(musicdir, function(err, results) {
		if (err) throw err;
    console.log(results);
		res.render('index',{playlist: results});
	});
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Not Found !');  
});

app.listen(8080);