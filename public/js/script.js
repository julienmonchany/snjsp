$(document).ready(function() {

    // add the selected song to the playlist
    $(document.body).on('click', '#library .song', function() {
        myPlaylist.add({
            // To fix
            title: $(this).text(),
            mp3: $(this).attr('value')
        }, false);
    });




    var myPlaylist = new jPlayerPlaylist({
        jPlayer: "#jquery_jplayer_1",
        cssSelectorAncestor: "#jp_container_1"
    },
    [],
            {
                playlistOptions: {
                    enableRemoveControls: true,
                    addTime: 0
                },
//			swfPath: "/js",
                supplied: "mp3, flac, m4a, webma, oga",
                smoothPlayBar: true,
                keyEnabled: true
    });

});