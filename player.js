//var express = require('express');
//var app = express();
//// Chargement de socket.io
//var io = require('socket.io').listen(app);

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    mongojs = require('mongojs'),
    db = mongojs('snjsp', ['library']),
    fs = require('fs'),
    path = require('path'),
    musicdir = "/home/jumon/music";

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

io.sockets.on('connection', function (socket) {
    // Quand le serveur reçoit un signal de type "message" du client    
    socket.on('search', function (search_req) {
        console.log('Searching for ' + search_req);
        db.library.find({file: {$regex:search_req, $options:'i'} }).toArray(function(err, docs) {
            if(err) throw err;
            console.log(docs.length+" elements filtered");
            socket.emit('results',docs);
        });
    });	
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Not Found !');
});

server.listen(8080);
