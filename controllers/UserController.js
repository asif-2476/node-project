const user = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const transport = require('../config');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')

exports.create =  async (req,res,next)=>
{
    //console.log(req.body);
    // try{
    //     let result=await  user.findOne({email:req.body.email});
    //     if(result)
    //     {
    //         //return 1;
    //         return res.status(403).json({'message':"email already exist"});
    //         // const msg = new Error("dkjgbdkf");
    //         // throw msg;
    //     }
    //     const hpass = await bcrypt.hash(req.body.password,12);
    //     const data = {"email":req.body.email,"password":hpass,"name":req.body.name};
    //     const User =await new user(data);
    //     await User.save();
    //     // return res.status(200).json({
    //     //     message:'User Created'
    //     // })
    //     const mailOptions = {
    //         from: 'pink.pantherr2476@gmail.com',
    //         to: req.body.email,
    //         subject: 'Sending Email using Node.js',
    //         text: 'That was easy!',
    //         html: '<b>NodeJS Email Tutorial</b>'
    //       };
    //        await transport.sendMail(mailOptions);
    //      return  res.status(201).json({"message":"user created","User":User});


    // }catch(err){
    //     res.status(500).json({"message":err.message})

    // }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg});
      }
    user.findOne({email:req.body.email}).then(result=>{
        //console.log(result)
        if(result)
        {
            //return 1;
            //return res.status(403).json({'message':"email already exist"});
            const msg = new Error("Email already exist");
            msg.statusCode = 403;
            throw msg;
        }
        return bcrypt.hash(req.body.password,12);
    }).then(hpass=>
    {
        //console.log(hpass);
        if(hpass)
        {
        const data = {"email":req.body.email,"password":hpass,"name":req.body.name};
        const User = new user(data);
        return User.save();
        }
    }).then(result=>
        {
            //console.log(result);
            data = result;
            if(result)
            {
            const mailOptions = {
                from: 'pink.pantherr2476@gmail.com',
                to: 'mansooriasif2476@gmail.com',
                subject: 'Sending Email using Node.js',
                text: 'That was easy!',
                html: '<b>NodeJS Email Tutorial</b>'
              };
               return transport.sendMail(mailOptions);
            //res.status(201).json({"message":"user created","User":result});
            }
        }).then(mailc=>{
            console.log(mailc);
            res.status(201).json({"message":"user created","User":data});
        }).catch(err=>
            {
                const code = err.statusCode || 500;
                //console.log(err.message);
                res.status(code).json({"message":err.message})
            });
//console.log(password);
// const data = {"email":req.body.email,"password":req.body.password,"name":req.body.name};
// const User = new user(data);
// User.save().then(success=>
//     {
//         res.send('user created successfully');
//     }).catch(error=>
//         {
//             console.log(error);
//             res.status(400).send('User not added')
//         })
//     res.send('created');
//     next();
}

exports.login = (req,res,next)=>
{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg});
      }
  const check = user.findOne({'email':req.body.email}).then(result=>{
    if(result)
    {
        //console.log(result);
        data = result;
        return bcrypt.compare(req.body.password,result.password);
    }
    else
    {
      return res.status(403).json({"msg":"please enter correct email"});
    }
  }).then(check=>{
    console.log(check);
    if(check)
    {
        
      
       const token = jwt.sign({"email":data.email,"_id":data._id},'secret_key',{"expiresIn":"1h"})
       res.status(200).json({"message":"loginned Successfully","token":token,"user":data });
    }
    else{
        res.status(403).json({"message":"your email/password is not correct"});
    }

  }).catch(error=>
    {
        console.log(error);
        res.status(500).json({"message":"login failed"});
    });
}

exports.details = (req,res,next)=>
{
    user.findOne({'_id':req.params.id}).then(result=>
    {
        if(result)
        {
            res.status(200).json({"data":result});
        }
        else
        {
            res.status(402).json({"msg":"record not found"});
        }
    }).catch(err=>
        {
            res.status(500).json("something went wrong");
        })
}