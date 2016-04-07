$(document).ready(function(){
    //$("#mybookbutton").click(function(){
        var search =$(location).attr('search').split('=')[1];
        
        $("#ads").empty();
        $.ajax({
            url: '/books?user='+search,
            //success function is whats returned by the server
            // parse through json returned and print out the field in html
            success: function success(index){
            $("#ads").empty();
            var result = JSON.parse(index);
            $.each(result.book, function(x, field){
                $("#ads").append("<div class=\"col-md-2\">"+
            "<div style=\"background-image: url(../img/TBB.jpg);width:150px; height:300px;\" class=\"thumbnail\">"+
            "<div style=\"width:100px; height:120px;margin:0 auto;\">"+
              "<img src=\""+ field.photolink+"\" width=\"100px\" height=\"110px\"></div>"+
              "<div class=\"caption\">"+
                "<h4>"+field.title+"</h4>"+
                "<p>"+field.author+"</p>"+
                "<p>"+field.genre+"</p>"+
                "<p><a href=\"/BookInfo?book="+field._id+"\" class=\"btn btn-default\" role=\"button\">View</a></p>"+
              "</div>"+
            "</div>");
                //$("#printbooks").append("Title: "+field.title +"<br>" + "Author: "+ field.author +"<br>" +"Price: "+ field.price +"<br>" + "Photo: <img src=\"uploads/"+ field.photolink+"\" \"><br><br>");
                //$("#printbooks").append("<li class= list-group-item>"+"Title: "+field.title +"<br>" + "Author: "+ field.author +"<br>" +"Price: "+ field.price +"<br>" + "Link: "+ field.photolink "</li>"); 
            });
                $("#ads").append(" &nbsp;");
            }
        });

    //});
}); 