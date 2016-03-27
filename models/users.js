var mongoose = require('mongoose');
 
module.exports = mongoose.model('User',{
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    email: String,
    facebookToken: String,
    facebookId: String,
    reviews: Array,
    averageRating: {type: Number, default:0}
});