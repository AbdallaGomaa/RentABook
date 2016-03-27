$(document).ready(function(){
    //$("#mybookbutton").click(function(){
    
        $("#printbooks").empty();
        $.ajax({
            url: '/mybooks',
            //success function is whats returned by the server
            // parse through json returned and print out the field in html
            success: function success(index){
                $("#printbooks").empty();
                var result = JSON.parse(index);
                $.each(result.book, function(x, field){
                    $("#printbooks").append("<div class=\"col-md-2\">"+
				"<div style=\"background-image: url(../img/TBB.jpg);\" class=\"thumbnail\">"+
				  "<img src=\"uploads/"+ field.photolink+"\" width=\"100\" height=\"100\">"+
				  "<div class=\"caption\">"+
					"<h4>"+field.title+"</h4>"+
					"<p>"+field.author+"</p>"+
                    "<p>"+field.genre+"</p>"+
					"<p><a href=\"BookInfo.html\" class=\"btn btn-primary\" role=\"button\">Rent</a> <a href=\"/BookInfo?book="+field.id+"\" class=\"btn btn-default\" role=\"button\">View</a></p>"+
				  "</div>"+
				"</div>");
                    //$("#printbooks").append("Title: "+field.title +"<br>" + "Author: "+ field.author +"<br>" +"Price: "+ field.price +"<br>" + "Photo: <img src=\"uploads/"+ field.photolink+"\" \"><br><br>");
                    //$("#printbooks").append("<li class= list-group-item>"+"Title: "+field.title +"<br>" + "Author: "+ field.author +"<br>" +"Price: "+ field.price +"<br>" + "Link: "+ field.photolink "</li>"); 
                    $("#bookcount").empty();
                    //href="/BookInfo?book="+field"
                    $("#bookcount").append(result.book.length);
                });
            }
        });

    //});
}); 