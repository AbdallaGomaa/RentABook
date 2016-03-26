
var Books = require('../models/books');

function(req, res) {
    
    addBook = function(){
        
            var newbook = new User();

                        // set the user's local credentials
                        newbook.title = req.param('booktitle');
                        newbook.author = req.param('bookauthor');
                        newbook.price = req.param('bookprice');
                        newbook.photolink = req.param('bookpic');

                        // save the user
                        newbook.save(function(err) {
                            if (err){
                                console.log('Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('User Registration succesful');    
                            return done(null, newbook);
                        });
                            
                    }
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);


    }