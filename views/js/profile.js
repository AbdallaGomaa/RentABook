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
            "<div style=\"background-image: url(../img/TBB.jpg);width:150px; height:300px;\" class=\"thumbnail\">"+
            "<div style=\"width:100px; height:120px;margin:0 auto;\">"+
              "<img src=\"uploads/"+ field.photolink+"\" width=\"100px\" height=\"110px\"></div>"+
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

    $("#myMessages").click(function(){
        $("#printMessages").empty();
        $.ajax({
            url: '/myMessages',
            //success function is whats returned by the server
            // parse through json returned and print out the field in html
            success: function success(index){
                $("#printMessages").empty();
                var result = JSON.parse(index);
                //alert("Returned successfully");
                 $.each(result.messages, function(x, field){
                    $("#pMsg").append("<div class=\"panel-heading\">" +
                          "<h4 class=\"panel-title\">" +
                            "<a data-toggle=\"collapse\" href=\"#" + field._id + "\">" + field.from + "</a>" +
                          "</h4>" +
                        "</div>" + 
                        "<div id=\"" + field._id + "\" class=\"panel-collapse collapse\">" +
                          "<div class=\"panel-body\"><font color = \"black\">" + field.theMessage + "</font></div>" +
                          "<div class=\"panel-footer\">" +
                              "<button type=\"button\" class=\"btn btn-primary\" id = \"" + field.from + "\">Reply</button>" +
                              "<button type=\"button\" class=\"btn btn-danger\" id = \"" + field._id + "\">Delete</button>" +
                                      "</div>" +
                        "</div>");
                });
                /*$.each(result.messages, function(x, field){
                    $("#printMessages").append("From: "+field.from +"<br>" +"Message: "+ field.theMessage + "<br><br>");
                    //$("#printbooks").append("<li class= list-group-item>"+"Title: "+field.title +"<br>" + "Author: "+ field.author +"<br>" +"Price: "+ field.price +"<br>" + "Link: "+ field.photolink "</li>"); 
                    //$("#bookcount").empty();
                    //$("#bookcount").append(result.book.length);
                });*/
            }
        });

    });
}); 