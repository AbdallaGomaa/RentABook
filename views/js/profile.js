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
              "<img src=\""+ field.photolink+"\" width=\"100px\" height=\"110px\"></div>"+
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

    //$("#myMessages").click(function(){
        //$("#printMessages").empty();
     
}); 

var a = function (){$.ajax({
            url: '/myMessages',
            //success function is whats returned by the server
            // parse through json returned and print out the field in html
            success: function success(index){
                //$("#printMessages").empty();
                $("#pMsg").empty();
                //console.log("Reloading");
                var result = JSON.parse(index);
                //alert("Returned successfully");
                 //$.each(result.messages, function(x, field){
                 $.each(result.messages.reverse(), function(x, field){
                     var timestamp = field._id.toString().substring(0,8);
                     var date = new Date( parseInt( timestamp, 16 ) * 1000 );
                     var useDate = date.toDateString() + " " + date.toLocaleTimeString();
                    $("#pMsg").append("<div class=\"panel-heading\">" +
                          "<h4 class=\"panel-title\">" +
                            "<a data-toggle=\"collapse\" href=\"#" + field._id + "\">FROM: " + field.from + "           DATE: " + useDate + "</a>" +
                          "</h4>" +
                        "</div>" + 
                        "<div id=\"" + field._id + "\" class=\"panel-collapse collapse\">" +
                          "<div class=\"panel-body\"><font color = \"black\">" + field.theMessage + "</font></div>" +
                          "<div class=\"panel-footer\">" +
                              "<form class=\"form-horizontal\" role=\"form\" action=\"/sendMessage\" method=\"POST\">" +
                                      "<div class=\"form-group\">" +
                                       // "<label class=\"control-label col-sm-2\" for=\"to\">To</label>" +
                                        //"<div class=\"col-sm-10\">" +
                                          "<input type=\"hidden\" class=\"form-control\" id=\"to\" value = \"" + field.from + "\"  name=\"to\" placeholder=\"Enter username you would like to send to\">" +
                                        //"</div>" +
                                      "</div>" +
                                      "<div class=\"form-group\">" +
                                       // "<label class=\"control-label col-sm-2\" for=\"message\">Message</label>" +
                                        "<div class=\"col-sm-10\">" + 
                                          "<textarea type=\"text\" rows = \"5\" class=\"form-control\" id=\"message\" name=\"message\">" +
                                        "&#13;&#10;&#13;&#10; --Old Message--------- &#13;&#10;" + field.theMessage +
                                        "</textarea>" +
                                        "</div>" +
                                      "</div>" +
                                      //"<div class=\"form-group\">" + 
                                       //"<div class=\"col-sm-offset-2 col-sm-10\">" + 
                                            "<button type=\"submit\" class=\"btn btn-primary\">Reply</button>" +
                                       // "</div>" +
                                      //"</div>" +
                            "</form>" +
                              //"<button type=\"button\" class=\"btn btn-primary\" id = \"" + field.from + "\">Reply</button>" +
                                      "<form class=\"form-horizontal\" role=\"form\" action=\"/delMessage\" method=\"POST\">" +
                                      "<div class=\"form-group\">" +
                                       // "<label class=\"control-label col-sm-2\" for=\"to\">To</label>" +
                                        "<div class=\"col-sm-10\">" +
                                          "<input type=\"hidden\" class=\"form-control\" id=\"to\" value = \"" + field._id + "\"  name=\"id\" placeholder=\"Enter username you would like to send to\">" +
                                        "</div>" +
                                      "</div>" +
                                      //"<div class=\"form-group\">" + 
                                       //"<div class=\"col-sm-offset-2 col-sm-10\">" + 
                                            "<button type=\"submit\" class=\"btn btn-danger\">Delete</button>" +
                                        //"</div>" +
                                      //"</div>" +
                            "</form>" +
                             // "<button type=\"button\" class=\"btn btn-danger\" id = \"" + field._id + "\">Delete</button>" +
                               //       "</div>" +
                        "</div>");
                });
                $("#numMessages").empty();
                $("#numMessages").append(result.messages.length);
                /*$.each(result.messages, function(x, field){
                    $("#printMessages").append("From: "+field.from +"<br>" +"Message: "+ field.theMessage + "<br><br>");
                    //$("#printbooks").append("<li class= list-group-item>"+"Title: "+field.title +"<br>" + "Author: "+ field.author +"<br>" +"Price: "+ field.price +"<br>" + "Link: "+ field.photolink "</li>"); 
                    //$("#bookcount").empty();
                    //$("#bookcount").append(result.book.length);
                });*/
            }
        });
                   };
var interval = 1000 * 60 * 0.01; // where X is your every X minutes

setInterval(a, interval);
    //});