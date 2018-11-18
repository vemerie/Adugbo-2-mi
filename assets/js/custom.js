
//video and map show section

$(document).ready(function(){
    $('#showVideo').click(function(){
        $('#video').fadeIn();
        $('#mapid').hide();
    });


    $('#showMap').click(function(){
        $('#video').hide();
		$('#mapid').fadeIn();
	});

	$('#icon-show-map-video').click(function(){
        $('#id').hide();
	});

});


	$(document).ready(function(){
    // close button for dashboard
    $('#close-icon').click(function() {
		$('#side-dashboard').fadeOut();
		$('#arrow').fadeIn();
      });

	  $('#arrow').click(function() {
		$('#side-dashboard').fadeIn();
		$('#arrow').css("display","none");
      });



      // dark theme
 
      $('#dark-theme').click(function(){
        $('body').css("background-color","black");
       
    });
});


