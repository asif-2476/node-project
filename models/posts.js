const mongoose = require('mongoose');

const post =  mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        image:{
            type: String,
            required: true
        },
        creater:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        }
    }
);

module.exports = mongoose.model('Post',post)