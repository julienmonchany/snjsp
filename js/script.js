$(document).ready(function(){
	$(".filelist button").click(function(){
		// Putting the file in the playlist
		$('.playing').append(
			$('<li>').append($(this))
		);

		// adding the file to the player
		/*$("#player").append(
			$('<source>').attr('src',$(this).attr('value')).append()
		);*/
		$("#player").attr('src',$(this).attr('value'));
	});

	// playing file
	$(".playlist button").click(function(){
		$("#player").attr('src',$(this).attr('value'));
	});

 	$(".playback").click(function(e) {
       e.preventDefault();
     });

}); 