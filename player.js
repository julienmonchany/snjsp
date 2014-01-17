var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    mongojs = require('mongojs'),
    db = mongojs('snjsp', ['library']),
    fs = require('fs'),
    path = require('path'),
    id3 = require('id3js'),
    
    //Change this value to match ur settings
    musicdir = "/home/pi/music";

var walk = function(dir, done) {
  //var results = [];
  var results = 0;
  fs.readdir(dir, function(err, list) {
    if (err) console.log(err);
    var pending = list.length;
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
            results++;
            id3({ file: file, type: id3.OPEN_LOCAL }, function(err, tags) {
                if(err) console.log(err);
                console.log("[add] "+tags.artist+ " - "+tags.album+ "- ["+ tags.v1.track+"] "+tags.title);
                db.library.save({
                    year: tags.year,
                    artist: tags.artist,
                    album: tags.album,
                    track_no: tags.v1.track,
                    track: tags.title,
                    file:file
                });
                if (!--pending) done(null, results);
            });
            

        }
      });
    });
  });
};

// Express config
io.set('log level',1);
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.use("/public",express.static(__dirname + "/public"));
app.use("/home",express.static("/home"));
//app.use(express.cookieParser());
app.use(express.bodyParser());

app.get('/', function(req, res) {
    // loading library from db
    db.library.find().toArray(function(err, docs) {
       if(err) console.log(err);
       console.log("Retrieving full library");
       res.render('index',{library: docs});
    });
});

app.get('/scan-db', function(req, res) {
    // scanning library
    walk(musicdir, function(err, results) {
        if(err) console.log(err);
        console.log('scanning...'+results+' elements retrieved');
        res.render('scan',{inserts: results});
    });
});

// Socket Events
io.sockets.on('connection', function (socket) {
    socket.on('new_user', function(){
        console.log("A new Challenger appears!");
        db.library.count(function(err, docs){
            if(err) console.log(err);
            console.log(docs +" in the library");
            socket.emit('nb_docs',docs);
        });

    });
    
    socket.on('search', function (search_req) {
        console.log('Searching for ' + search_req);
        // Searching in the db a match for artist or album or track
        // limited to the 100st fields in order to avoid perf issues
        db.library.find(
                { $or: [
                            {artist: {$regex:search_req, $options:'i'}},
                            {album: {$regex:search_req, $options:'i'}},
                            {track: {$regex:search_req, $options:'i'}}
                        ]
                }).limit(100).toArray(function(err, docs) {
            if(err) console.log(err);
            console.log(docs.length+" elements filtered");
            socket.emit('results', docs);
        });
    });	
});

app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Not Found !');
});

server.listen(8080);
