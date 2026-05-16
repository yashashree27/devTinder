const express = require('express');
const connectDB = require('./config/database');
const app = express();
const { User } = require('./models/user');

app.post('/signup', async (req, res)=> {
  const user = new User({
    'firstName': 'Yash',
    'lastName': 'Marghade',
    'emailId': 'yash@gmail.com',
    'password': 'yash@123',
    'age': 26
  });

  try {
    await user.save();
    res.send('user created successfully');
  }
  catch (err){
    res.status(400).send('Error occured while adding user')
  }
});


connectDB().then(()=> {
    console.log('Connection to database established succesfully');   
    app.listen(4000,()=> {
      console.log('Server listening on port 4000...');  
    })
})
.catch((err)=> {
    console.error('Could not connect to Database');
});
