const express = require('express');

const app = express();

app.use("/test",(req, res) => {
    res.send('Test from express server');     // request handler
});

app.use('/home', (req, res) => {
    res.send('This is home tab')
});

app.listen(3000, ()=> {
    console.log('Server listening on port 3000...');
    
});