const express = require('express');

const app = express();

app.use("/test",[(req, res, next) => {
    console.log('1st route handler');
    res.send('1st response');     // request handler
    next();
}, 
(req, res, next) => {
   console.log('2nd handler');
   //res.send('2nd response')
   next();
}],
(req, res, next)=> {
 console.log('3rd handler');
   //res.send('3rd response');
   next();
},
(req, res)=> {
    console.log('4th handler');
    res.send('4th response');
}
);

app.get("/user", (req, res) => {
    console.log(req.query);
    res.send({firstName:"Yash", lastName:"Marghade"});
});

app.get("/user/:userId", (req, res) => {
    console.log(req.params);
    res.send({firstName:"Yash", lastName:"Marghade"});
});

app.listen(4000, ()=> {
    console.log('Server listening on port 4000...');
    
});