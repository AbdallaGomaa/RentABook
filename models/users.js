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
    averageRating: {type: Number, default:0},
    viewCount:{
        Action:{type: Number, default:0},
        Comedy:{type: Number, default:0},
        Fantasy:{type: Number, default:0},
        Fiction:{type: Number, default:0},
        Mystery:{type: Number, default:0},
        Romance:{type: Number, default:0},
        ScienceFiction:{type: Number, default:0},
        Thriller:{type: Number, default:0},
        totalCount:{type: Number, default:0},
    }
});