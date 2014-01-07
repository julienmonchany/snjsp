$(document).ready(function() {
	// MENUS ANIMATION
	// $('#menu-button').toggle(function() {
	// 	$('#menu').animate({
	// 		marginTop: '+=10',
	// 		height: '100%',
	// 		opacity: 1
	// 	}, 300, function() {
	// 		// Animation complete.
	// 	});
	// }, function() {
	// 	$('#menu').animate({
	// 		marginTop: '-=10',
	// 		opacity: 0,
	// 		height: '0px'
	// 	}, 300, function() {
	// 		// Animation complete.
	// 	});
	// });

	// add the selected song to the playlist
	$(".library button").click(function(){
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
			enableRemoveControls: false,
			addTime: 0
		},
			swfPath: "/js",
			supplied: "mp3, flac",
			smoothPlayBar: true,
			keyEnabled: true
	});

});