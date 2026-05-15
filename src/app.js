const express = require('express');

const app = express();




app.get('/user', ( req, res) => {

    throw new Error('abcdef');
    res.status(500).send('something not good1');

});


app.use('/', (err, req, res, next)=> {
    if (err){
    // Log your error
    res.status(500).send('something not good');
    }
})



app.listen(4000, ()=> {
    console.log('Server listening on port 4000...');
});