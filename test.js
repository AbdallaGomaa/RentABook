var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('./bin/www');
var should = chai.should();
var express = require('express');
var router = express.Router();
var server = require('./bin/www');
var Book = require('./models/books');
var User = require('./models/users');
var mongoose = require("mongoose");
var bCrypt = require('bcrypt-nodejs');

chai.use(chaiHttp);

describe('Tests', function() {
   before(function(done) {
    var user = new User({
      firstName: 'A',
      lastName: 'Z',
      username: 'abcdef',
      password: bCrypt.hashSync('123456', bCrypt.genSaltSync(10)),
      email: 'abc@abc.com'   
    });
    user.save(function(err, user) {
      if (err) console.log('error' + err.message);
      else console.log('User added');
      done();
    });
   });
    
    it('Load Homepage', function (done) {
      chai.request('http://localhost:3000')
        .get('/')
        .end(function(err, res){
          res.should.have.status(200);
          done();
        });
    });
    
   it('Login', function(done){
       chai.request('http://localhost:3000')
       .post('/login')
       .send({'username':'abcdef', 'password':'123456'})
       .end(function(err, res){   
           if(!err)
               console.log('Logged In :)')
           done();
        });
    });
    
    it('Unavailable page', function (done) {
      chai.request('http://localhost:3000')
        .get('/jjlkjfdlkkaf')
        .end(function(err, res){
          res.should.have.status(404);
          done();
        });
    });
    
    it('Checking User existence',function(done){
        User.findOne({username: 'abcdef' }, function(err, user) {
            user.email.should.eql('abc@abc.com');
            done();
        });   
    });
    
    it('Checking User existence 2',function(done){
        User.findOne({username: 'dskfjdlkafd' }, function(err, user) {
            if(user)
                return err;
            else
                done();
        });   
    });
    
    it('Logout', function(done){
       chai.request('http://localhost:3000')
       .get('/signout')
       .end(function(err, res){   
           if(err)
               throw err;
           else
               console.log('Logged Out :)')
           done();
        });
    });
    
  after(function(done) {
        User.findOne({'username': 'abcdef'}, function(err, user){
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
      done();
 });
});