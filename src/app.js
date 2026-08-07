const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
const app = express();
const http = require('http');


require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`
});
require("./utils/cronJob");

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
const paymentRouter = require('./routes/payment');
const initializeSocket = require('./utils/socket');
const chatRouter = require('./routes/chat');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', connectionRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', paymentRouter);
app.use('/', chatRouter)



const server = http.createServer(app);
initializeSocket(server);

connectDB()
.then(()=> {
  console.log('Connection to database established succesfully');
  server.listen(process.env.PORT,()=> {
    console.log('Server listening on port 4000...');
  })
})
  .catch((err)=> {
    console.error('Could not connect to Database');
  });
