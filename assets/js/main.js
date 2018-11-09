// window.onscroll = function() {scrollFunction()};
// var navbar = document.getElementById("navbar");
// function scrollFunction() {
//     if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
//         navbar.style.display = "block";
//         navbar.style.backgroundColor = " #ffffff";
//         navbar.style.position = "fixed";
//         navbar.style.color = "black";
//         navbar.style.transition = "all 0.6s ease";
//         navbar.style.width = "100%";
//         navbar.style.boxShadow = "0 2px 15px rgba(0,0,0,0.43)";
//         $('a#read-article').css("color", "black");
//         $('.navbarand').css("color" , "black" + "important");
//         $('#navbar').addClass('animated fadeIn');
//     } else {
//         document.getElementById("navbar").style.backgroundColor = "transparent";
//          document.getElementById("navbar").style.boxShadow = "none";
//           $('a#read-article').css("color", "white");
//            $('#navbar').removeClass('animated fadeIn');
//            $('#navbar').css("position" , "relative");
//            // $(".welcome_text").css("padding-top" , "8%");
//     }
// }

// // When the user clicks on the button, scroll to the top of the document
// function topFunction() {
//     document.body.scrollTop = 0; // For Chrome, Safari and Opera 
//     document.documentElement.scrollTop = 0; // For IE and Firefox
// }

// // end if


// var myVar;

// function myFunction() {
//     myVar = setTimeout(showPage, 3000);
// }

// function showPage() {
//   document.getElementById("loader").style.display = "none";
//   document.getElementById("myDiv").style.display = "block";
// }
var app = {
  imageHandler:function() {
        $("#upload").on('change', function() {
            //alert("alert");
            readUrl();
        });
        function readUrl (){
            var file = $("#upload")[0].files[0];
            //console.log(file);
            //reader interprets the file selected
            var reader = new FileReader();
                //console.log(reader.result);
            reader.onloadend = function (){
                //console.log(reader.result);
                $("#picture_preview").attr("src", reader.result);
                //$("#picture_preview")[0].src = "" + reader.results;
                //console.log($("#picture_preview"));
                //console.log(reader.result);
            }
            if(file){
                reader.readAsDataURL(file);
            }
        }
    },//end of imageHandler
    openpackages:function(){
        var $opended = Array.from($('.opned'));
        var icon;
        $opended.forEach(function(open){
            $(open).on('click', function(e){
                // e.css('transform','rotate(180deg)');
                icon = e.target.children[1];
                $(icon).toggleClass('icon-change');
                console.log(e);
            });
        });
        // $('.opned')(function(){
        //     $('.')

        // });
        console.log($opended);
    },
    openSidebar:function(){
        var clicker = $('.burgers i')
        var iconPlace = $('.burger')
        $(clicker).click(function(){
            $(iconPlace).toggleClass('disk')
            $('aside.nav-side').toggleClass('disk')
            $('.burgers i:nth-of-type(1)').toggleClass('opa2')
            $('.burgers i:nth-of-type(2)').toggleClass('disk')
           
        })
    }
    
};//end app

