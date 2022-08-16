const mongoose = require('mongoose');
const express = require('express');
const app = express();

mongoose.connect('mongodb+srv://asif2476:asif2476@cluster0.moatn.mongodb.net/?retryWrites=true&w=majority').then(result =>{
    app.listen(3000);
    console.log('working')
}).catch(error=>
    {
        console.log(error);
    });

    module.exports