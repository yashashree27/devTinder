const express = require("express");
const { authUser } = require("../middlewares/auth");
const { ConnectionRequestModel } = require("../models/connectionRequest");
const { User } = require("../models/user");
const userRouter = express.Router();

//Get all pending connection req for loggedin user
userRouter.get('/user/receive/pendingRequest', authUser, async(req, res) => {
    try {

        const loggedinUser = req.user;        

        const feed = await ConnectionRequestModel.find({
            status: "Interested",
            toUserId:loggedinUser._id
        }).populate("fromUserId", ['firstName', 'lastName', 'photoUrl', 'age', 'skills', 'gender']);

        //OR
        // .populate("fromUserId", 'firstName lastName photoUrl age skills gender')
        

        res.json({
            message: "Here is your feed",
            data: feed
        })

    }catch(err){
        res.status(500).send('Error in getting feed'+ err.message)
    }
});


//get connection who have accepted request
// if i'm elon and i will get accepted req of elon where elon is sender or receiver

userRouter.get('/user/connections', authUser, async(req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
        $or: [
            {toUserId: loggedInUser._id, status: 'Accepted'},
            {fromUserId: loggedInUser._id, status: 'Accepted'}
        ],
    }).populate('fromUserId', 'firstName lastName age skills gender about photoUrl')
      .populate('toUserId', 'firstName lastName age skills gender about photoUrl');


    const data = connectionRequest.map((row) => {
       if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
        return  row.toUserId;
       }
       else {
         return  row.fromUserId;
       }
     });

    res.json({
        data: data
    })

  }catch(err){
    res.status(400).send({message: err.message})
  }
})


// feed api

// 1) should not see their own profile
// 2) should not see profile of users to whom they have sent request and received req
//3) ignored people

userRouter.get('/feed', authUser, async(req, res) => {
try {
const loggedInUser = req.user;

const page = parseInt(req.query.page) || 1;
let limit = parseInt(req.query.limit) || 10;
limit = limit > 50 ? 50 : limit;

const skip = (page -1) * limit ;

//find all connection request
const connectionRequest = await ConnectionRequestModel.find({
  $or: [
    {fromUserId:loggedInUser._id}, {toUserId: loggedInUser._id}]
}).select('fromUserId toUserId');


const hidefromFeed = new Set();

connectionRequest.forEach((req) =>{
  hidefromFeed.add(req.fromUserId.toString());
  hidefromFeed.add(req.toUserId.toString());
});


const users = await User.find({
  $and: [
    { _id: {$ne: loggedInUser._id}},
    {_id: {$nin: Array.from(hidefromFeed)}}
  ],
})
.select('firstName lastName emailId photoUrl skills about gender age')
.skip(skip)
.limit(limit);

res.json({data: users});
}catch(err){
  res.status(400).json({messag:  err.message})
}

});











module.exports = userRouter;