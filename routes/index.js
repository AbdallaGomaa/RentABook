var express = require('express');
var router = express.Router();
var Book = require('../models/books');
var User = require('../models/users');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		if(req.isAuthenticated())
            res.render('index', {state: 'loggedIn' });
        else
            res.render('index', {state: 'loggedOut' });
	});
    
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
        if(req.isAuthenticated())
            res.render('login', {state: 'loggedIn'});
        else
            res.render('login', {state: 'loggedOut'});
	});
    

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/profile',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		if(req.isAuthenticated())
            res.render('signup',{state: 'loggedIn'});
        else
            res.render('signup',{state: 'loggedOut'});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/profile', isAuthenticated, function(req, res){
		console.log(req.user);
        if(req.isAuthenticated())
            res.render('profile', { user: req.user, state: 'loggedIn' });
        else
            res.render('profile', { user: req.user, state: 'loggedOut' });
	});
    
    router.get('/facebook', passport.authenticate('facebook', { 
        scope : ['email', 'user_birthday']
    }));
    
    router.get('/facebook/callback',passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));
        router.post('/addbook', function(req,res){
    //add book
    addBook = function(){      
        var newbook = new Book();

                        // set the user's local credentials
                        newbook.title = req.param('booktitle');
                        newbook.author = req.param('bookauthor');
                        newbook.price = req.param('bookprice');
                        newbook.photolink = req.param('bookpic');
                        newbook.user = req.user;
                            newbook.save(function(err) {
                            if (err){
                                console.log('Error in Saving book: '+err);  
                                throw err;  
                            }
                            console.log('Book Registration succesful');    
                            });
            }
            // Delay the execution of findOrCreateUser and execute the method
            process.nextTick(addBook);
        
        res.redirect('/');
        
    });
    
    router.get('/mybooks', function(req, res){
        var books = [];
        //db.getCollection('books').find({})
        
        //var i= Books; '
        Book.find({}, function(err, users){
            if(err)
                throw err;
        
            for (i in users){
                if(req.user==users[i].user){
                    //console.log(users[i].title);
                
                    //console.log(JSON.stringify(returnedJSON, null, 2));
                    var bookObj = {"title": users[i].title, 
                                    "author": users[i].author, 
                                    "price":users[i].price,
                                    "photolink":users[i].photolink
                                    };
                    
                    //returnedJSON.push(bookObj);
                    books.push(bookObj);
                    
                }
            }
             var returnOBJ = {"code":200, 
                                "book":books};
            console.log(JSON.stringify(returnOBJ, null, 2));
            res.write(JSON.stringify(returnOBJ, null, 2));
            res.end();
       
        });
    });

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}
