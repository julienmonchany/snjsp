$(document).ready(function() {
	// $(".filelist button").click(function(){
	// 	// Putting the file in the playlist
	// 	$('.playing').append(
	// 		$('<li>').append($(this))
	// 	);
	// 	// adding the file to the player
	// 	$("#player").append(
	// 		$('<source>').attr('src',$(this).attr('value')).append()
	// 	);
	// 	$("#player").attr('src',$(this).attr('value'));
	// });
	// // playing file
	// $(".playlist button").click(function(){
	// 	$("#player").attr('src',$(this).attr('value'));
	// });
	// 	$(".playback").click(function(e) {
	//       e.preventDefault();
	//     });


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


      $("#jquery_jplayer_1").jPlayer({
        ready: function () {
          $(this).jPlayer("setMedia", {
            mp3: "http://www.jplayer.org/audio/mp3/TSP-01-Cro_magnon_man.mp3"
          });
        },
        solution: "html",
        supplied: "mp3, flac"
      });

});