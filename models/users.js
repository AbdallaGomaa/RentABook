var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
   local:{
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    DOB: String,
   },
   facebook:{
    id: String,
    token: String,
    firstName: String,
    lastName: String,
    email: String,
    DOB: String,
   },
});