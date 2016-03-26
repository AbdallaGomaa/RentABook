$(document).ready(function(){
    $("#mybookbutton").click(function(){
    
        $("#printbooks").empty();
        $.ajax({
            url: '/mybooks',
            //success function is whats returned by the server
            // parse through json returned and print out the field in html
            success: function success(index){
                $("#printbooks").empty();
                var result = JSON.parse(index);
                $.each(result.book, function(x, field){
                    $("#printbooks").append("Title: "+field.title +"<br>" + "Author: "+ field.author +"<br>" +"Price: "+ field.price +"<br>" + "Link: "+ field.photolink+"<br><br>");
                    //$("#printbooks").append("<li class= list-group-item>"+"Title: "+field.title +"<br>" + "Author: "+ field.author +"<br>" +"Price: "+ field.price +"<br>" + "Link: "+ field.photolink "</li>"); 
                    $("#bookcount").empty();
                    $("#bookcount").append(result.book.length);
                });
            }
        });

    });
}); 