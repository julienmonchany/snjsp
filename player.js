var express = require('express');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('snjsp', ['library']);

var fs = require('fs');
var path = require('path');

var musicdir = "/home/jumon/music";

var walk = function(dir, done) {
  //var results = [];
  var results = 0;
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
            //results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
            //results.push(file);
            results++;
            db.library.save({file:file});
            //console.log(file + " inserted");
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
app.use(express.bodyParser());

app.get('/', function(req, res) {
    // loading library from db
    db.library.find({}).toArray(function(err, docs) {
       if(err) throw err;
       console.log("Retrieving full library");
       res.render('index',{library: docs});
    });
    
});

app.get('/scan-db', function(req, res) {
    // dropping existing library (to fix)
    db.library.remove();
    // scanning library
    walk(musicdir, function(err, results) {
        if (err) throw err;
        console.log('scanning...'+results+' elements retrieved');
        res.render('scan',{inserts: results});
    });
});

/* On ajoute un élément à la todolist */
app.post('/search', function(req, res) {
    if (req.body.lib_search != '') {
            console.log("Searching "+req.body.lib_search);
            db.library.find({file: {$regex:req.body.lib_search, $options:'i'} }).toArray(function(err, docs) {
            if(err) throw err;
            console.log(docs.length+" elements filtered");
            res.render('index',{library: docs});
        }); 
    }else{
        console.log("Empty Search...redirecting");
        res.redirect('/');
    }
    
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Not Found !');  
});

app.listen(8080);
