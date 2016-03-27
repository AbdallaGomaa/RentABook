$(document).ready(function(){
    var navbar="<nav class=\"navbar navbar-default navbar-fixed-top\">"
			+"<div class=\"container-fluid\">"
				+"<div class=\"navbar-header\">"
				  +"<a class=\"navbar-brand\" onclick=\"location.href='/';\">Books</a>"
				+"</div>"
				
				+"<div class=\"dropdown\" id=\"dropdownM\" style=\"float:left\">"
				  +"<button type=\"button\" id=\"Genre\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">"
					+"Search by Genre <span class=\"caret\"></span>"
				  +"</button>"
				  +"<ul class=\"dropdown-menu\">"
					+"<li><a href=\"#\">Action</a></li>"
					+"<li><a href=\"#\">Comedy</a></li>"
					+"<li><a href=\"#\">Fantasy</a></li>"
					+"<li><a href=\"#\">Fiction</a></li>"
					+"<li><a href=\"#\">Mystery</a></li>"
					+"<li><a href=\"#\">Romance</a></li>"
					+"<li><a href=\"#\">Science Fiction</a></li>"
					+"<li><a href=\"#\">Thriller</a></li>"
				  +"</ul>"
				+"</div>"
				
				+"<form class=\"navbar-form\" role=\"search\" style=\"float:left\">"
				  +"<div class=\"form-group\">"
					+"<input type=\"text\" class=\"form-control\" size=\"50\" placeholder=\"Enter Book Title or Author's Name\">"
				  +"</div>"
				  
				  +"<button type=\"button\" class=\"btn btn-default\" onclick=\"location.href='resultspage.html';\">"
					+"<span class=\"glyphicon glyphicon-search\"></span>Search"
				  +"</button>"
				+"</form>"
                +"<div style=\"float:right\">";
    //if(state=='loggedOut')
        navbar+= "<button id=\"logIn\" type=\"button\" class=\"btn btn-default navbar-btn\" onclick=\"location.href='/login';\">Log In</button>"
					    +"<button type=\"button\" class=\"btn btn-default navbar-btn\" onclick=\"location.href='/signup';\">Sign up</button>";
    //else if(state=='loggedIn')
        navbar+= "<button type=\"button\" class=\"btn btn-default navbar-btn\" onclick=\"location.href='/profile';\">Profile</button>"
				+"<button type=\"button\" class=\"btn btn-default navbar-btn\" onclick=\"location.href='/signout';\">Log Out</button>"
				+"<button type=\"button\" class=\"btn btn-default navbar-btn\">"
				+"<span class=\"glyphicon glyphicon-shopping-cart\"></span>Cart"
				+"</button>"
		navbar+="</div>"
			+"</div>"
		+"</nav>"
        
        $("body").prepend(navbar);
    
});
