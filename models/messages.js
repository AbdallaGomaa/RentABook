var mongoose = require('mongoose');
 
module.exports = mongoose.model('Message',{
    from: String,
    to: String,
    theMessage: String,
});