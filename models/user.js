const mongoose = require('mongoose');

const user =  mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        posts:
        [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Post'
        }
    ]
    }
);

module.exports = mongoose.model('User',user)