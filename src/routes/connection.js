const express = require('express');
const { authUser } = require('../middlewares/auth');
const connectionRouter = express.Router();
const { ConnectionRequestModel } = require('../models/connectionRequest');
const { User } = require('../models/user');
const sendEmail = require('../utils/sendEmail')

connectionRouter.post("/sendConnectionRequest/:status/:toUserId", authUser, async (req, res) => {

    try {

        const fromUserId = req.user._id;
        const toUserId = req.params?.toUserId;
        const status = req.params?.status

        const allowedStatus = ["Interested", "Ignored"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send("Status is not valid")
        }

        const existingUser = await User.findById(toUserId);
        if (!existingUser) {
            return res.status(400).send('User does not exist');
        }

        const connectionRequestExist = await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ],

        })

        if (connectionRequestExist) {
            return res.status(400).send("Connection Request already exist")
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId: fromUserId,
            toUserId: toUserId,
            status: status
        })

        await connectionRequest.save();
        const resEmail = await sendEmail.run(
            "New Connection Request",
            `${req.user.firstName} has sent you a connection request on DevTinder.`
        );

        res.json({
            message: `${req.user.firstName} is ${status}  ${existingUser.firstName}`,
            data: connectionRequest
        })

    } catch (err) {
        res.status(500).send("Error in sending connection request" + err.message);
    }
})

module.exports = connectionRouter;