SNJSP
=====

Simple NodeJS Player aim to be lightweight and was originally designed to work on a Raspberry Pi.

Features
------
+ Recursively scan provided music folder
+ Read and stores music files data (path + ID3 tags)
+ Synchronous search
+ Responsive design

NodeJS Configuration
------
See **package.json** for dependencies

MongoDB Configuration
------
Create an index on field "file" in order to avoid duplicates on db scan:
```
db.library.ensureindex({file:1}, {unique: true});
```

SNJSP Configuration
------
1. Edit **player.json** and change variable **musicdir** in order to match your music library folder.

Ressources
------
+ Music player: [jPlayer](http://www.jplayer.org/) 

