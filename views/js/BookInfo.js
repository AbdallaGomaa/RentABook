$(document).ready(function(){
    $("#deleteButton").click(function(){
        $("#table").toggle();
        });
    $("#titleButton").click(function(){
       $("#titleTd").toggle();
        $("#titleTogg").toggle();
    });
    $("#authorButton").click(function(){
       $("#authorTd").toggle();
        $("#authorTogg").toggle();
    });
    $("#genreButton").click(function(){
       $("#genreTd").toggle();
        $("#genreTogg").toggle();
    });
    $("#langButton").click(function(){
       $("#langTd").toggle();
        $("#langTogg").toggle();
    });
    $("#pubButton").click(function(){
       $("#pubTd").toggle();
        $("#pubTogg").toggle();
    });
    $("#priceButton").click(function(){
       $("#priceTd").toggle();
        $("#priceTogg").toggle();
    });
    
    
    
});