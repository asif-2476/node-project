const post = require('../models/posts');
const user = require('../models/user');
const {validationResult}= require('express-validator')
const path = require('path');
const fs = require('fs');

exports.createPost = (req,res,next)=>
{
    const error = validationResult(req);
     if(!error.isEmpty())
     {
        res.status(403).json(error.array());
     }
     if(!req.file)
     {
        res.status(403).json({'message':'image required'});
     }
//console.log(req.userData);
    const Post = new post({name:req.body.name,image:req.file.path,creater: req.userData.userId});
    Post.save().then(result=>
        {
            if(result)
            {
                return user.findById(req.userData.userId);
                //res.status(200).json({message:'Post created'});
            }
        }).then(q=>
            {
                console.log(Post);
                q.posts.push(Post);
              return   q.save();
            }).then(w=>
                {
                    res.status(200).json({message:'Post created'});
                }).catch(err=>
            {
                res.status(500).json({message:err.message});
            })
}


exports.list = async(req,res,next)=>
{
    try{
        const take = req.query.perPage;
        const skip = (req.query.perPage*req.query.page)-req.body.perPage;
        const total = await post.find().countDocuments();
        const posts = await post.find().skip(skip).limit(take).populate('creater');
        if(posts)
        {
            res.status(200).json({Posts:posts,total:total,message:'Posts found'});
        }
        else
        {
            res.status(404).json({Posts:posts,message:'Posts not found'});
        }
    }
    catch(err)
    {
            res.status(500).json({message:err.message});
    }
   


}

exports.update = async(req,res,next)=>
{
    try
    {
    const Post = await post.findById(req.params.id);
    console.log(Post);
    if(Post)
    {
    Post.name = req.body.name;
    Post.creater = req.userData.userId;
    if(req.file)
    {
        image = req.file.path.replace("\\" ,"/");
     if(image == Post.image)
     {
        image = Post.image;
     }
     else
     {
        filePath = path.join(__dirname, '..', Post.image);
        fs.unlink(filePath, err => console.log(err));
     }
     Post.image = image;
    }
    
    await Post.save();
    res.status(200).json({message:'Post updated successfully'});
    }
    else
    {
        res.status(404).json({message:'Post not found'})
    }
   }
   catch(err)
   {
    res.status(500).json(err.message);
   }
}

exports.delete =async (req,res,next)=>
{
    try
    {
    const Post = await post.findById(req.params.id);
    if(Post)
    {
        await post.findByIdAndRemove(req.params.id);
        filePath = path.join(__dirname, '..', Post.image);
        fs.unlink(filePath, err => console.log(err));
        const User = await user.findById(req.userData.userId);
        User.posts.pull(Post._id);
        res.status(200).json({message:'Post Deleted'})

    }
    else
    {
        res.status(404).json({message:'Post not found'})
    }
    }
    catch(err)
    {
        res.status(500).json({message:err.message});
    }
}