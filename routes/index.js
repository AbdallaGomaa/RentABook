var express = require('express');
var router = express.Router();
var Book = require('../models/books');
var User = require('../models/users');
var bCrypt = require('bcrypt-nodejs');
var path = require('path'); 
var fs = require('fs');
var mongoose = require("mongoose");
var multer  = require('multer');
var Grid = require('gridfs-stream');
var uid = require('uid2');
 

var TARGET_PATH = 'views/uploads';
var IMAGE_TYPES = ['image/jpeg', 'image/png'];  

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

Grid.mongo = mongoose.mongo;
 
var upload = multer({ dest: '../views/uploads/' })

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
    
    router.get('/admin', function(req, res) {
		if(req.isAuthenticated())
            res.render('admin', {state: 'loggedIn' });
        else
            res.render('admin', {state: 'loggedOut' });
	});
    
    router.post('/changePass',function(req, res, username){ 
        User.findOne({'username': req.body.username}, function(err, user){
            if(err)
                throw err;
            if(user){
                user.password = createHash(req.body.password);
                  user.save(function(err) {
                    if (err) throw err;
                  });
                console.log('password changed');
            }
            else
                console.log('user not found');
         });
        res.redirect('/');
    });
    
    router.post('/changeInfo',function(req, res, username){ 
        User.findOne({'username': req.body.username}, function(err, user){
            var variable = req.body.infoChange;
            if(err)
                throw err;
            if(user){
                if(variable=='firstName')
                    user.firstName = req.body.change;
                else if(variable=='lastName')
                    user.lastName = req.body.change;
                else if(variable=='email')
                    user.email = req.body.change;
                user.save(function(err) {
                  if (err) throw err;
                });
                console.log(variable+' Changed');
            }
            else
                console.log('user not found');
         });
        res.redirect('/');
    });

    router.post('/deleteUser',function(req, res, username){ 
        User.findOne({'username': req.body.username}, function(err, user){
            var variable = req.body.infoChange;
            if(err)
                throw err;
            if(user){
                  user.remove(function(err) {
                  if (err) throw err;
                  });
                  console.log('User Deleted')
            }
            else
                console.log('user not found');
        });
        res.redirect('/');
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
        scope : ['email']
    }));
    
    router.get('/facebook/callback',passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));
    
    router.post('/addbook', upload.single('mypic'), function(req,res){
    //add book
       
        var is;
        var os;
        var targetPath;
        var targetName;
        var tempPath = req.file.path;
        //get the mime type of the file
        var type = req.file.mimetype;
        //get the extension of the file
        var extension="jpeg";
        console.log(extension);

        //check to see if we support the file type
        if (IMAGE_TYPES.indexOf(type) == -1) {
          res.send(415, 'Supported image formats: jpeg, jpg, jpe, png.');
        }

        //create a new name for the image
        targetName = uid(22) + '.' + extension;
        console.log("targetName: "+targetName);
        //determine the new path to save the image
        targetPath = path.join(TARGET_PATH, targetName);
        console.log("targetPath: "+targetPath);
        //create a read stream in order to read the file
        is = fs.createReadStream(tempPath);

        //create a write stream in order to write the a new file
        os = fs.createWriteStream(targetPath);

        is.pipe(os);


        //handle error
        is.on('error', function() {
          if (err) {
            res.send(500, 'Something went wrong');
          }
        });
        //if we are done moving the file
        is.on('end', function() {


          //delete file from temp folder
          fs.unlink(tempPath, function(err) {
            if (err) {
              res.send(500, 'Something went wrong');
            }

            //send something nice to user


          });
        });
    addBook = function(){
         
        
        
        
        var newbook = new Book();
        
        
                        // set the user's local credentials
                        newbook.title = req.param('booktitle');
                        newbook.author = req.param('bookauthor');
                        newbook.price = req.param('bookcost');
                        newbook.photolink = targetName;
                        newbook.user = req.user;
                            newbook.save(function(err) {
                            if (err){
                                console.log('Error in Saving book: '+err);  
                                throw err;  
                            }
                            console.log('Book Registration succesful');    
                            });
            }
            // Delay the execution of addbook and execute the method
            process.nextTick(addBook);
        
        res.redirect('/profile');
        
    });
    
    router.get('/mybooks', function(req, res){
        var books = [];
        
        Book.find({}, function(err, users){
            if(err)
                throw err;
        
            for (i in users){
                if(req.user==users[i].user){
                
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
