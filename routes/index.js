var express = require('express');
var router = express.Router();
var Book = require('../models/books');
var User = require('../models/users');
var Message = require('../models/messages');
var bCrypt = require('bcrypt-nodejs');
var path = require('path'); 
var fs = require('fs');
var mongoose = require("mongoose");
var multer  = require('multer');
var Grid = require('gridfs-stream');
var uid = require('uid2');
var mime = require('mime');
var mongodb = mongoose.Schema;
 

var TARGET_PATH = 'views/uploads';
var IMAGE_TYPES = ['image/jpeg', 'image/png'];  

var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

Grid.mongo = mongoose.mongo;
 
var upload = multer({ dest: 'views/uploads/temp' })


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
        var allbooks = [];
        Book.find({}, function(err, books){
            if(err)
                throw err;
        
            for (i in books){
                var bookObj = {"id": books[i]._id,
                                "title": books[i].title, 
                                "author": books[i].author, 
                                "price":books[i].price,
                                "genre":books[i].genre,
                                "language":books[i].language,
                                "publisher":books[i].publisher,
                                "photolink":books[i].photolink
                                };
                allbooks.push(bookObj);
            }
            if(req.isAuthenticated())
                res.render('index', {state: 'loggedIn', books: allbooks });
            else
                res.render('index', {state: 'loggedOut', books: allbooks });
        });
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
    
    router.get('/user', isAuthenticated, function(req, res){
        User.findOne({'username': req.param('username')}, function(err, user){
            if(err)
                throw err;
            if(user){
                if(req.isAuthenticated())
                    res.render('profile-2',{user: user, state:'loggedIn'});  
                else
                    res.render('profile-2',{user: user, state:'loggedOut'});  
                }
            else
                console.log('user not found');
         });
       
	});
    
    router.get('/facebook', passport.authenticate('facebook', { 
        scope : ['email']
    }));
    
    router.get('/facebook/callback',passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));
    
    router.post('/addbook', upload.single('mypic'), function(req,res){
    //router.post('/addbook', function(req,res){
    //add book
       if(req.file!=undefined){
            var is;
            var os;
            var targetPath;
            var targetName;
            var tempPath = req.file.path;
            //get the mime type of the file
            var type = req.file.mimetype;
            //get the extension of the file
            var extension=mime.extension(type);

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
       }
    else {
        var targetname="";
    }
    addBook = function(){
         
        
        
        
        var newbook = new Book();
        
        
                        // set the user's local credentials
                        newbook.title = req.param('booktitle');
                        newbook.author = req.param('bookauthor');
                        newbook.price = req.param('bookcost');
                        newbook.genre = req.param('genre');
                        newbook.language = req.param('language');
                        newbook.publisher = req.param('publisher');
                        newbook.photolink = targetName;
                        console.log(req.user.username);
                        newbook.user = req.user.username;
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
                if(req.user.username==users[i].user){
                
                    var bookObj = {"id": users[i]._id,
                                    "title": users[i].title, 
                                    "author": users[i].author, 
                                    "price":users[i].price,
                                    "genre":users[i].genre,
                                    "language":users[i].language,
                                    "publisher":users[i].publisher,
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
    
    router.get('/BookInfo', function(req, res){
        Book.findOne({'_id': req.param('book')}, function(err, book){
            if(err)
                throw err;
            if(book){
               if(req.isAuthenticated())
                    res.render('BookInfo',{book: book, state:'loggedIn'});  
               else
                    res.render('BookInfo',{book: book, state:'loggedOut'});  
            }
        });
    });
    

    router.post('/addreview', function(req,res) {
        User.findOne({'username': req.param('username')}, function(err, user){
            if(err)
                throw err;
            if(user){
                user.averageRating=((user.averageRating*user.reviews.length)+Number(req.body.star))/(user.reviews.length+1);
                var ratingObj={ratingUser: req.user.username,
                               rating: req.body.star,
                               review: req.param('review')};
                user.reviews.push(ratingObj);
                user.save(function(err) {
                  if (err) throw err;
                });
            }
            else
                console.log('user not found');
         });
        res.redirect('/user?username='+req.param('username'));
    });
    
    router.get('/search', function(req, res){
        var searchRes = [];
        var cat = [];
        var genre = false;
        var genreN = " ";
        Book.find({}, function(err, books){
            if(err)
                throw err;
            console.log(req.param('name'));
        
            if(req.param('genre')==undefined){
                for (i in books){
                    if(req.param('name').toLowerCase()==books[i].title.toLowerCase() || req.param('name').toLowerCase()==books[i].author.toLowerCase()){

                        var bookObj = {"id": books[i]._id,
                                        "title": books[i].title, 
                                        "author": books[i].author, 
                                        "price":books[i].price,
                                        "genre":books[i].genre,
                                        "language":books[i].language,
                                        "publisher":books[i].publisher,
                                        "photolink":books[i].photolink
                                        };

                        if(cat.indexOf(bookObj.genre)==-1)
                            cat.push(bookObj.genre);
                        if(req.param('cat')=='all' || req.param('cat')==undefined)
                            searchRes.push(bookObj);
                        else if(bookObj.genre == req.param('cat'))
                            searchRes.push(bookObj);

                    }
                }
            }
            else{
                genre = true;
                genreN = req.param('genre');
                for (i in books){
                    if(req.param('genre')==books[i].genre){

                        var bookObj = {"id": books[i]._id,
                                        "title": books[i].title, 
                                        "author": books[i].author, 
                                        "price":books[i].price,
                                        "genre":books[i].genre,
                                        "language":books[i].language,
                                        "publisher":books[i].publisher,
                                        "photolink":books[i].photolink
                                        };
                        if(cat.indexOf(bookObj.genre)==-1)
                            cat.push(bookObj.genre);
                        searchRes.push(bookObj);

                    }
                }                    
            }
            if(req.isAuthenticated())
                res.render('resultspage',{books: searchRes, state:'loggedIn', search: req.param('name'), cat: cat, catv: req.param('cat'), genre: genre, genreN: genreN});
            else
                res.render('resultspage',{books: searchRes, state:'loggedOut', search: req.param('name'), cat: cat, catv: req.param('cat'), genre: genre, genreN: genreN});
       });
    });
    
    
	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
    
    /* Send a Message */
    router.post('/sendMessage', function(req,res){
    //send message
        sendMess = function(){
            var msg = new Message();
            msg.from = req.user.username;
            msg.to = req.param('to');
            msg.theMessage = req.param('message');
            
            var toExists = false;
            
            User.find({}, function(err, users){
                for(i in users){
                    //console.log(users[i].local.username + "msg.to: " + msg.to);
                    if(users[i].username == msg.to){
                        toExists = true;
                        //console.log("Went here");
                        break;
                    }
                }
                if(toExists){
                    msg.save(function(err){
                       if(err){
                           console.log('Error sending message: ' + err);
                           throw err;
                       }
                        console.log("Message sent");
                    });
                }
                else{
                    console.log("TO USER DOESN'T EXIST");
                }
            });
            
        };
        // Delay the execution of findOrCreateUser and execute the method
        process.nextTick(sendMess);
        
        res.redirect('/');
        
    });
    
    /* Delete Message */
    router.post('/delMessage', function(req,res){
    //send message
        Message.findOne({'_id': req.param('id')}, function(err, msg){
            if(err)
                throw err;
            if(msg){
                  msg.remove(function(err) {
                  if (err) throw err;
                  });
                  console.log('msg Deleted')
            }
            else
                console.log('msg not found');
        });
        
        res.redirect('/profile');
        
    });
    
    /* Get the messages */
    router.get('/myMessages', function(req, res){
        var messages = [];
        //db.getCollection('books').find({})
        
        //var i= Books; '
        Message.find({}, function(err, msgs){
            if(err)
                throw err;
        
            for (i in msgs){
                if(req.user.username==msgs[i].to){
                    //console.log(users[i].title);
                
                    //console.log(JSON.stringify(returnedJSON, null, 2));
                    console.log(msgs[i]._id + msgs[i].from + msgs[i].to + msgs[i].theMessage);
                    var msgObject = {
                                    "_id": msgs[i]._id,
                                    "from": msgs[i].from, 
                                    "theMessage":msgs[i].theMessage
                                    };
                    
                    //returnedJSON.push(bookObj);
                    messages.push(msgObject);
                    
                }
            }
             var returnOBJ = {"code":200, 
                                "messages":messages};
            console.log(JSON.stringify(returnOBJ, null, 2));
            res.write(JSON.stringify(returnOBJ, null, 2));
            res.end();
       
        });
    });
	return router;
}
