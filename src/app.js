const express = require('express');

const app = express();

const { adminAuth, authUser } = require('./middlewares/auth')

app.use('/admin', adminAuth);

app.get('/admin/getAllUsers', (req, res) => {
    res.send("All data sent");
});

app.delete('/admin/deleteUsers', (req, res) => {
    res.send("Deleted data");
});

app.get('/user', authUser, (req, res) => {
    res.send('user data sent');
});

app.post('/user/login', (req, res)=> {
    res.send('login successful');
})

app.listen(4000, ()=> {
    console.log('Server listening on port 4000...');
});