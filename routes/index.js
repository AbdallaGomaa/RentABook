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
var S3FS = require('s3fs');
var multiparty = require('connect-multiparty');
var multipartyMiddleware = multiparty();
var s3fsImpl = new S3FS('rentabookk', {
    accessKeyId: 'AKIAIGCDRNF4OS4JWIKQ',
    secretAccessKey: '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'
});
 
s3fsImpl.create();

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

    
    router.use(multipartyMiddleware);
	/* GET home page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
        var allbooks = [];
        /*Book.find({}, function(err, books){
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
            }*/
           // var recommendedBooks=[];
        
        Book.find().sort({'viewCount': -1}).limit(6).exec(function(err,allbooks) {
            //});
                if(req.isAuthenticated()){
                     var probArray=[];
                    
                    var temp = Math.floor(10*(req.user.viewCount.Action/req.user.viewCount.totalCount));
                    for(var i=0; i<temp; i++)
                        probArray.push("Action");

                    temp = Math.floor(10*(req.user.viewCount.Comedy/req.user.viewCount.totalCount));
                    for(var i=0; i<temp; i++)
                        probArray.push("Comedy");

                    temp = Math.floor(10*(req.user.viewCount.Fantasy/req.user.viewCount.totalCount));
                    for(var i=0; i<temp; i++)
                        probArray.push("Fantasy");

                    temp = Math.floor(10*(req.user.viewCount.Fiction/req.user.viewCount.totalCount));
                    for(var i=0; i<temp; i++)
                        probArray.push("Fiction");

                    temp = Math.floor(10*(req.user.viewCount.Mystery/req.user.viewCount.totalCount));
                    for(var i=0; i<temp; i++)
                        probArray.push("Mystery");

                    temp = Math.floor(10*(req.user.viewCount.Romance/req.user.viewCount.totalCount));
                    for(var i=0; i<temp; i++)
                        probArray.push("Romance");

                    temp = Math.floor(10*(req.user.viewCount.ScienceFiction/req.user.viewCount.totalCount));
                    for(var i=0; i<temp; i++)
                        probArray.push("Science Fiction");

                    temp = Math.floor(10*(req.user.viewCount.Thriller/req.user.viewCount.totalCount));
                    for(var i=0; i<temp; i++)
                        probArray.push("Thriller");
                    
                    
                    var prob=Math.floor(Math.random() * probArray.length);
                    
                    var suggestedBook = [];
            
                    Book.find({'genre':probArray[prob]}).sort({'viewCount': -1}).limit(1).exec(function(err,maxBook) {
                        if(maxBook[0]){
                            suggestedBook.push(maxBook[0]);
                            maxBook[0].flag=1;
                            maxBook[0].save(function(err) {
                              if (err) throw err;
                            });
                        }
                        
                        prob=Math.floor(Math.random() * probArray.length);
                        Book.find({'genre':probArray[prob], 'flag':0}).sort({'viewCount': -1}).limit(1).exec(function(err,maxBook1) {
                             if(maxBook1[0]){
                                suggestedBook.push(maxBook1[0]);
                            
                                maxBook1[0].flag=1;
                                maxBook1[0].save(function(err) {
                                  if (err) throw err;
                                });
                             }
                            
                            prob=Math.floor(Math.random() * probArray.length);
                            Book.find({'genre':probArray[prob], 'flag':0}).sort({'viewCount': -1}).limit(1).exec(function(err,maxBook2) {
                                 if(maxBook2[0]){
                                    suggestedBook.push(maxBook2[0]);
                                
                                    maxBook2[0].flag=1;
                                    maxBook2[0].save(function(err) {
                                      if (err) throw err;
                                    });
                                 }
                                
                                prob=Math.floor(Math.random() * probArray.length);
                                Book.find({'genre':probArray[prob], 'flag':0}).sort({'viewCount': -1}).limit(1).exec(function(err,maxBook3) {
                                     if(maxBook3[0]){
                                        suggestedBook.push(maxBook3[0]);
                                    
                                        maxBook3[0].flag=1;
                                        maxBook3[0].save(function(err) {
                                          if (err) throw err;
                                        });
                                     }
                                    
                                    prob=Math.floor(Math.random() * probArray.length);
                                    Book.find({'genre':probArray[prob], 'flag':0}).sort({'viewCount': -1}).limit(1).exec(function(err,maxBook4) {
                                        if(maxBook4[0]){
                                            suggestedBook.push(maxBook4[0]);
                                        
                                            maxBook4[0].flag=1;
                                            maxBook4[0].save(function(err) {
                                              if (err) throw err;
                                            });
                                        }
                                        
                                        prob=Math.floor(Math.random() * probArray.length);
                                        Book.find({'genre':probArray[prob], 'flag':0}).sort({'viewCount': -1}).limit(1).exec(function(err,maxBook5) {
                                            if(maxBook5[0])
                                                suggestedBook.push(maxBook5[0]);
                                            
                                            if(maxBook[0]){
                                                maxBook[0].flag=0;
                                                maxBook[0].save(function(err) {
                                                  if (err) throw err;
                                                });
                                            }
                                            if(maxBook1[0]){
                                                maxBook1[0].flag=0;
                                                maxBook1[0].save(function(err) {
                                                  if (err) throw err;
                                                });
                                            }
                                            if(maxBook2[0]){
                                                maxBook2[0].flag=0;
                                                maxBook2[0].save(function(err) {
                                                  if (err) throw err;
                                                });
                                            }
                                            if(maxBook3[0]){
                                                maxBook3[0].flag=0;
                                                maxBook3[0].save(function(err) {
                                                  if (err) throw err;
                                                });
                                            }
                                            if(maxBook4[0]){
                                                maxBook4[0].flag=0;
                                                maxBook4[0].save(function(err) {
                                                  if (err) throw err;
                                                });
                                            }
                    
                                            res.render('index', {state: 'loggedIn', books: allbooks, suggested: suggestedBook});
                                            });
                                        });
                                    });
                                });
                            });
                        });
                }else
                    res.render('index', {state: 'loggedOut', books: allbooks, suggested: allbooks });
            //});
        });
	});	
/***********************************************************************************************************************************************/   
    router.get('/admin', function(req, res) {
		if(req.isAuthenticated())
            res.render('admin', {state: 'loggedIn' });
        else
            res.render('admin', {state: 'loggedOut' });
	});
/***********************************************************************************************************************************************/  
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
/***********************************************************************************************************************************************/    
    router.post('/changeInfo',function(req, res, username){ 
        var useroradmin=req.param('user');
        
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
            else{
                console.log(req.body);
                console.log('user not found');
            }
         });
        if(useroradmin==1)
        res.redirect('/profile');
        else
        res.redirect('/');
            
    });
/***********************************************************************************************************************************************/
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
/***********************************************************************************************************************************************/    
	router.get('/login', function(req, res) {
    	// Display the Login page with any flash message, if any
        var fail=0;
        if(req.param('fail')=="true")
            fail=1;
        if(req.isAuthenticated())
            res.render('login', {state: 'loggedIn',fail:fail});
        else
            res.render('login', {state: 'loggedOut',fail:fail});
	});
    

	/* Handle Login POST */
/***********************************************************************************************************************************************/
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/profile',
		failureRedirect: '/login?fail=true',
		failureFlash :true
	}));

	/* GET Registration Page */
/***********************************************************************************************************************************************/
	router.get('/signup', function(req, res){
        var fail=0;
        if(req.param('fail')=="true")
            fail=1;
		if(req.isAuthenticated())
            res.render('signup',{state: 'loggedIn',fail:fail});
        else
            res.render('signup',{state: 'loggedOut',fail:fail});
	});

	/* Handle Registration POST */
/***********************************************************************************************************************************************/
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup?fail=true',
		failureFlash : true  
	}));
/***********************************************************************************************************************************************/
	router.get('/profile', isAuthenticated, function(req, res){
		console.log(req.user);
        if(req.isAuthenticated())
            res.render('profile', { user: req.user, state: 'loggedIn' });
        else
            res.render('profile', { user: req.user, state: 'loggedOut' });
	});
 /**********************************************************************************************************************************************/   
    router.get('/user', isAuthenticated, function(req, res){
        if(req.param('username')==req.user.username){
            if(req.isAuthenticated())
                    res.render('profile',{user: req.user, state:'loggedIn'});  
                else
                    res.render('profile',{user: req.user, state:'loggedOut'});  
        }else{
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
        }
       
	});
/***********************************************************************************************************************************************/    
    router.get('/facebook', passport.authenticate('facebook', { 
        scope : ['email']
    }));
/***********************************************************************************************************************************************/    
    router.get('/facebook/callback',passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
    }));
/***********************************************************************************************************************************************/    
    router.post('/addbook', function(req,res){
        var file = req.files.mypic;

        var stream = fs.createReadStream(file.path);
        
        var type = file.type;
       
        //get the extension of the file
        var extension=mime.extension(type);

        //check to see if we support the file type
        if (IMAGE_TYPES.indexOf(type) == -1) {
          res.send(415, 'Supported image formats: jpeg, jpg, jpe, png.');
        }

        //create a new name for the image
        targetName = uid(22) + '.' + extension;
        return s3fsImpl.writeFile(targetName, stream).then(function(){
            fs.unlink(file.path, function(err){
                if(err)
                    console.errror(err);
            })
            addBook = function(){
  
                var newbook = new Book();
                    // set the user's local credentials
                    newbook.title = req.param('booktitle');
                    newbook.author = req.param('bookauthor');
                    newbook.price = req.param('bookcost');
                    newbook.genre = req.param('genre');
                    newbook.language = req.param('language');
                    newbook.publisher = req.param('publisher');
                    newbook.description = req.param('description');
                    newbook.photolink = "https://s3.amazonaws.com/rentabookk/"+targetName;
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
    });
/***********************************************************************************************************************************************/    
   
    router.get('/books', function(req, res){
        var books = [];
        
        var user;
        if(req.param("user")==undefined){
            user=req.user.username;
        }else{
            user=req.param("user");
        }
        
        Book.find({'user': user}, function(err, books){
            var returnOBJ = {"code":200, 
                                "book":books};
            res.write(JSON.stringify(returnOBJ, null, 2));
            res.end();
        });
    });
/***********************************************************************************************************************************************/    
    router.get('/BookInfo', function(req, res){
        
                
        Book.findOne({'_id': req.param('book')}, function(err, book){
            if(err)
                throw err;
            if(book){
                if(req.isAuthenticated()){
                    User.findOne({'username':req.user.username}, function(err, user){
                           switch(book.genre) { 
                               case "Action":
                                   user.viewCount.Action++;
                                   break;
                                case "Comedy":
                                   user.viewCount.Comedy++;
                                   break;
                                case "Fantasy":
                                   user.viewCount.Fantasy++;
                                   break;
                                case "Fiction":
                                   user.viewCount.Fiction++;
                                   break;
                                case "Mystery":
                                   user.viewCount.Mystery++;
                                   break;
                                case "Romance":
                                   user.viewCount.Romance++;
                                   break;
                                case "Science Fiction":
                                   user.viewCount.ScienceFiction++;
                                   break;
                                case "Thriller":
                                   user.viewCount.Thriller++;
                                   break;
                           }
                        user.viewCount.totalCount++;
                        user.save(function(err) {
                          if (err) throw err;
                        });
                    });
                }
                Book.find({'genre':book.genre}).sort({'viewCount': -1}).limit(3).exec(function(err,recommendedBooks) {
                    
                    
                    book.viewCount++;
                    book.save(function(err) {
                      if (err) throw err;
                    });
                    console.log(recommendedBooks);
                   if(req.isAuthenticated())
                        res.render('BookInfo',{book: book, user:req.user, recommendedBooks: recommendedBooks, state:'loggedIn'});  
                   else
                        res.render('BookInfo',{book: book, recommendedBooks: recommendedBooks, state:'loggedOut'});  
                });
            }
        });
    });
 /**********************************************************************************************************************************************/   
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
    
 /**********************************************************************************************************************************************/   
    router.get('/search', function(req, res){
        var searchRes = [];
        var cat = [];
        var genre = false;
        var genreN = " ";
        
        if(req.param('genre')==undefined){
             Book.find({"title": { "$regex": req.param('name'), "$options": "i" } } ).skip(parseInt(req.param('page'))-1).limit(1).exec(function(err, books){
                 
                 
                 if(req.param('cat')=='all' || req.param('cat')==undefined){
                     searchRes=books;
                     for (i in books){
                         if(cat.indexOf(books[i].genre)==-1)
                                cat.push(books[i].genre);
                     }
                 }else{
                    for (i in books){
                        if(cat.indexOf(books[i].genre)==-1)
                                cat.push(books[i].genre);
                        if(books[i].genre == req.param('cat'))
                                searchRes.push(books[i]);
                     }
                 }
                 Book.count({"title": { "$regex": req.param('name'), "$options": "i" }}, function(err, pages){
                 
                 
                     if(req.isAuthenticated())
                        res.render('resultspage',{books: searchRes, state:'loggedIn', search: req.param('name'), cat: cat, catv: req.param('cat'), genre: genre, genreN: genreN, page:req.param('page'), pages:pages});
                    else
                        res.render('resultspage',{books: searchRes, state:'loggedOut', search: req.param('name'), cat: cat, catv: req.param('cat'), genre: genre, genreN: genreN, page:req.param('page'), pages:pages});  
                 });
             });
        }
        else{
            Book.find({"genre":req.param('genre')}).skip(parseInt(req.param('page'))-1).limit(1).exec(function(err, books){
                cat.push(req.param('genre'));
                genre = true;
                genreN = req.param('genre');
                
                Book.count({"genre":req.param('genre')}, function(err, pages){
                    
                    if(req.isAuthenticated())
                        res.render('resultspage',{books: books, state:'loggedIn', search: req.param('name'), cat: cat, catv: req.param('cat'), genre: genre, genreN: genreN, page:req.param('page'), pages:pages});
                    else
                        res.render('resultspage',{books: books, state:'loggedOut', search: req.param('name'), cat: cat, catv: req.param('cat'), genre: genre, genreN: genreN, page:req.param('page'), pages:pages});
                }); 
            });
        }
    });
    
    
	/* Handle Logout */
/***********************************************************************************************************************************************/
	router.get('/signout', function(req, res) {
		req.logout();
        console.log('out');
		res.redirect('/');
	});
    
    /* Send a Message */
/***********************************************************************************************************************************************/
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
                           console.log('Error sending message: ');
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
        
        res.redirect('/profile');
        
    });
/***********************************************************************************************************************************************/
    
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
/***********************************************************************************************************************************************/
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
                    //console.log(msgs[i]._id + msgs[i].from + msgs[i].to + msgs[i].theMessage);
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
            //console.log(JSON.stringify(returnOBJ, null, 2));
            res.write(JSON.stringify(returnOBJ, null, 2));
            res.end();
       
        });
    });
/***********************************************************************************************************************************************/
    router.post('/changePass2',function(req, res){ 
        User.findOne({'username': req.user.username}, function(err, user){
            if(err)
                throw err;
            if(user){
                if(bCrypt.compareSync(req.body.oldpassword, user.password)){
                    user.password = createHash(req.body.newpass);
                    user.save(function(err) {
                        if (err) throw err;
                    });
                    console.log('password changed');
                }
                else
                    console.log('password incorrect');   
            }
            else
                console.log('user not found');
         });
        res.redirect('/profile');
    });
/***********************************************************************************************************************************************/
    router.post('/changeBookInfo',function(req, res){ 
        Book.findOne({'_id': req.body.bookid}, function(err,book){
            var variable = req.body.infoChange;
            if(err)
                throw err;
            if(book){
                if(variable=='title')
                    book.title = req.body.change;
                else if(variable=='genre')
                    book.genre = req.body.change;
                else if(variable=='language')
                    book.language = req.body.change;
                else if(variable=='author')
                    book.author = req.body.change;
                else if(variable=='publisher')
                    book.publisher = req.body.change;
                else if(variable=='price')
                    book.price = req.body.change;
                else if(variable=='description')
                    book.description = req.body.change;
                book.save(function(err) {
                  if (err) throw err;
                });
                }

            else
                console.log('book not found');
         });
        var bookreturn='/bookInfo?book='+req.body.bookid;
        res.redirect(bookreturn);
    });
/***********************************************************************************************************************************************/    
    router.get('/deleteBook',function(req, res){ 
        
        Book.findOne({'_id': req.param('bookid')}, function(err,book){
            if(book){
                book.remove(function(err) {
                  if (err) throw err;
                  });
             
                  console.log('Book Deleted');
           }
            else{
                console.log('Book not found');
            }

        });
        res.redirect('/profile');
    });
    
	return router;
}
