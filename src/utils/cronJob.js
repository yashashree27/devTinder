const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const { ConnectionRequestModel } = require('../models/connectionRequest');
const sendEmail = require('./sendEmail');

console.log("Cron file loaded");

cron.schedule(' 0 8 * * *', async () => {

    try {
        const yesterday = subDays(new Date(), 0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequest = await ConnectionRequestModel.find({
            status: 'Interested',
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd
            }
        }).populate('fromUserId toUserId');

        const emailList = [...new Set(pendingRequest.map((req) => req.toUserId.emailId))];

        for (const email of emailList) {
            try {
                const res = await sendEmail.run(
                    "New Friend Request pending from " + email,
                    "Please login to DevTinderly and accept or reject the request"
                );

            } catch (err) {
                console.log(err);
            }
        }

    } catch (err) {
        console.log(err);
    }





})