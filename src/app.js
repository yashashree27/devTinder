const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const app = express();
require('dotenv').config()

const { User } = require('./models/user');
const cookieParser = require('cookie-parser');

app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true 
  }
));
app.use(express.json());
app.use(cookieParser());


const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const connectionRouter = require('./routes/connection');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRouter);
app.use('/', requestRouter);
app.use('/', userRouter);


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

connectDB()
.then(()=> {
  console.log('Connection to database established succesfully');
  app.listen(process.env.PORT,()=> {
    console.log('Server listening on port 4000...');
  })
})
  .catch((err)=> {
    console.error('Could not connect to Database');
  });
