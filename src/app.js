const express = require('express');

const app = express();

app.use("/test",(req, res) => {
    res.send('Test from express server test');     // request handler
});

app.get("/user", (req, res) => {
    res.send({firstName:"Yash", lastName:"Marghade"});
});

app.post("/user", (req, res) => {
    res.send("saved to database")
})

app.listen(4000, ()=> {
    console.log('Server listening on port 4000...');
    
});