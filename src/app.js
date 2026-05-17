const express = require('express');
const connectDB = require('./config/database');
const app = express();
const { User } = require('./models/user');


app.use(express.json());

app.post('/signup', async (req, res)=> {
  // Creating new instace of the User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send('user created successfully');
  }
  catch (err){
    res.status(500).send('Error occured while adding user'+ err.message)
  }
});

// Get singl user
app.get('/user', async (req, res)=> {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({emailId: userEmail});
    if(!user){
      res.status(404).send('user not found');
    }
    else{
      res.send(user);
    }
  } catch (err){
    res.status(500).send('Something went wrong');
  }

});


app.get('/feed', async (req, res)=> {
  try{
    const user = await User.find({});
    res.send(user);
  }catch(err){
    res.status(500).send('Something went wrong');
  }
});


app.get('/feed/:id', async (req, res) => {
  const userbyId = req.params.id;
  try {
    //const user = await User.findById({_id:userbyId}).  below is shorthand of this line
    const user = await User.findById(userbyId)
    res.send(user);

  } catch (err){
    res.status(404).send('sOEMTHING WENT WRONG')
  }
});


app.delete('/user', async (req, res) => {
  const user = req.body.userId;
  try{
    await User.findByIdAndDelete(user)
    res.send('User deleted successfully');

  }catch(err){
    res.status(500).send('something went wrong')
  }
});


app.patch('/user/:userId', async (req, res) => {
  const Id = req.params?.userId;
  const data = req.body
  try {

    const ALLOWED_UPDATES = [
      'userId',
      'age',
      'photoUrl',
      'about',
      'gender',
      'skills'
    ];

    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    if (!isUpdateAllowed) {
      throw new Error('Upadte not allowed');
    }
    const updatedUser = await User.findByIdAndUpdate(Id, data, { returnDocument: "after", runValidators: true });
    res.send('updated user successfully', updatedUser)
  } catch(err){
    res.status(500).send(err.message)
  }
});


app.patch('/user/email', async (req, res) => {
  const userbyEmail = req.body.emailId;
  const data = req.body;
  try{
    const updatedUser = await User.findOneAndUpdate({emailId:userbyEmail}, data, {returnDocument: "after"});
    console.log("updatedUser", updatedUser);
    res.send('updated user by email', updatedUser)
  } catch (err){
    res.status(500).send('something went wrong')
  }
})

connectDB().then(()=> {
  console.log('Connection to database established succesfully');
  app.listen(4000,()=> {
    console.log('Server listening on port 4000...');
  })
})
  .catch((err)=> {
    console.error('Could not connect to Database');
  });
