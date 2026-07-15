const express = require("express");
const bcrypt = require('bcrypt');
const { validateSignup } = require('../utils/validator');
const {User} = require('../models/user')
const authRouter = express.Router();


// app.use();
// authRouter.use(). both are same 

authRouter.post('/signup', async(req, res)=> {
  try {

  validateSignup(req)

  const { firstName, lastName, emailId, password } = req.body;

  const passwordHashed = await bcrypt.hash(req.body.password, 10);

  // Creating new instace of the User model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHashed
  });

    await user.save();
    res.send('user created successfully');
  }
  catch (err){
    res.status(500).send('Error occured while adding user'+ err.message)
  }
});


authRouter.post( '/login', async(req, res)=> {
  try {

  const {emailId, password} = req.body;
  const user = await User.findOne({emailId : emailId});

  if(!user){
    throw new Error("Invalid Credential")
  }

  const isPasswordCorrect = await user.validatePassword(password)

  if (isPasswordCorrect){

    // craete josn web token 
    const token = await user.getJWT();

    // storing token in cookie
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 ) // 1hr
    });
    res.send(user)
  } else {
    throw new Error("Invalid creds")}
  }
  catch (err){
    res.status(500).send("Error: "+ err.message);
  }
})

authRouter.post('/logout', async(req, res)=> {
  res.cookie("token", null, {
    expires: new Date(Date.now())
  }) 
  res.send("user logged out succesfully")
});




module.exports =  authRouter;