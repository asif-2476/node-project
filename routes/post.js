const express = require('express')
const route = express.Router();
const PostController = require('../controllers/PostController');
const auth = require('../middleware/auth');
const {body,validationResult} = require('express-validator');
const fileupload = require('../middleware/fileupload')

route.post('/createPost',auth,fileupload,PostController.createPost);
route.get('/list',auth,PostController.list);
route.put('/update/:id',auth,fileupload,PostController.update);
route.delete('/delete/:id',auth,PostController.delete);
// route.post('/login',body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('please enter a valid mail'),
// body('password').notEmpty().withMessage('Password is required'),UserController.login);
// route.get('/details/:id', auth, UserController.details);

module.exports = route;