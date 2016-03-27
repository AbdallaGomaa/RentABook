var mongoose = require('mongoose');

module.exports = mongoose.model('Book',{
    title: String,
    author: String,
    price: String,
    photolink: String,
    user: String,
    genre: String,
    language: String,
    publisher: String,
});