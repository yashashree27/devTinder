const express = require('express');
const { authUser } = require('../middlewares/auth');
const connectionRouter = express.Router();


connectionRouter.post("/sendConnectionRequest", authUser, async (req, res)=> {
    const user = req.user;

    console.log("sending req");
    res.send(user.firstName + "sent the connection req");
});

module.exports = connectionRouter;