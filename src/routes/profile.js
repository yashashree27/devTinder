const express = require("express");
const { authUser } = require('../middlewares/auth');
const { validateEditProfileData, validatePassword } = require('../utils/validator');
const bcrypt = require('bcrypt')


const profileRouter = express.Router();


profileRouter.get('/profile/view', authUser, async (req, res)=> {

  try{
  const user = req.user;
   res.send(user)

  }catch (err){
   res.status(500).send("Error"+ err.message)
  }
})

profileRouter.patch('/profile/edit', authUser, async (req, res) => {
  try {

    if(!validateEditProfileData(req)){
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((k) => (loggedInUser[k] = req.body[k]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch(err){
    res.status(500).send(err.message)
  }
});

profileRouter.patch('/profile/updatePassword', authUser, async(req, res) => {

  try {
      const loggedInUser = req.user;

  const {newPassword, existingPassword} = req.body;

  const isPasswordCorrect = await bcrypt.compare(existingPassword, loggedInUser.password)
  
  if(!isPasswordCorrect){
    throw new Error('Password is not correct')
  }

  validatePassword(newPassword);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  loggedInUser.password = hashedPassword;

  await loggedInUser.save();

  res.send('Password updated successfully');
  }

  catch (err){
    res.status(500).send(err.message)
  }

});


module.exports = profileRouter;