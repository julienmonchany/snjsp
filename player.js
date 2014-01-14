var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('snjsp', ['library']);

var fs = require('fs');
var path = require('path');

var musicdir = "/home/jumon/music";

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
            db.library.save({file:file});
            console.log(file + " inserted");
            if (!--pending) done(null, results);
        }
      });
    });
  });
};

// Express config
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use("/public",express.static(__dirname + "/public"));
app.use("/home",express.static("/home"));
app.use(express.cookieParser());

app.get('/', function(req, res) {
    // read content of the music directory
    walk(musicdir, function(err, results) {
        if (err) throw err;
        res.render('index',{library: results});
    });
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Not Found !');  
});

app.listen(8080);
