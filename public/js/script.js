$(document).ready(function() {
    
	// add the selected song to the playlist
        $(document.body).on('click','#library button',function(){
		myPlaylist.add({
			title:$(this).attr('value'),
			//artist:"Le Artist",
			mp3: $(this).attr('value')
		}, false); // no autoplay when adding
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
			supplied: "mp3, flac",
			smoothPlayBar: true,
			keyEnabled: true
	});

});