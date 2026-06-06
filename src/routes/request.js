const express = require('express');
const { authUser } = require('../middlewares/auth');
const { ConnectionRequestModel } = require('../models/connectionRequest');
const requestRouter = express.Router();


requestRouter.post('/request/review/:status/:requestId', authUser, async (req, res) => {
    try {
        const status = req.params?.status;
        const loggedInUser = req.user;

        const requestId = req.params.requestId;

        const allowedStatus = ["Accepted", "Rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: 'Status not allowed' });
        }

        const connectionRequestValid = await ConnectionRequestModel.findOne({
            _id: requestId,
            status: "Interested",
            toUserId: loggedInUser._id
        })

        if (!connectionRequestValid) {
            return res.status(400).json({ message: 'Connection request not found' })
        }

        connectionRequestValid.status = status;
        const data = await connectionRequestValid.save();
        res.json({ message: 'Connection Request ' + status, data })

    } catch (err) {
        res.status(500).send("Error while updating" + err.message)
    }

})

module.exports = requestRouter;
