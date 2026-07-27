const express = require('express');
const { authUser } = require('../middlewares/auth');
const paymentRouter = express.Router();
const razorPayInstance = require('../utils/razorPay');
const Payment = require('../models/payment');
const { membershipAmount } = require('../utils/constant');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const { User } = require('../models/user');


paymentRouter.post('/payment/createOrder', authUser, async (req, res) => {
    try {

        const membershipType = req.body.membershipType;
        const { firstName, lastName, emailId } = req.user;

        // 1) Create an order with secret key
        const order = await razorPayInstance.orders.create({
            "amount": membershipAmount[membershipType] * 100,
            "currency": "INR",
            "receipt": "receipt#1",
            "notes": {
                "firstName": firstName,
                "lastName": lastName,
                "emailId": emailId,
                "membership": membershipType
            }
        })


        // 2) Create a Payment document with the order details
        const payment = new Payment({
            userId: req.user._id,
            orderId: order.id,
            receipt: order.receipt,
            paymentId: order.paymentId,
            amount: order.amount,
            status: order.status,
            notes: order.notes,
            currency: order.currency
        })

        //3) save order deatils in database
        const savedPayment = await payment.save();
        res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: err.message
        });
    }

});

//https://razorpay.com/docs/webhooks/validate-test/
// synatx
// const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils')

// validateWebhookSignature(JSON.stringify(webhookBody), webhookSignature, webhookSecret)
// #webhook_body should be raw webhook request body
paymentRouter.post('/payment/webhook', async (req, res) => {
    try {

        console.log("webhook called");
        

        const webhookSignature = req.headers[X - Razorpay - Signature] // OR  const webhookSignature = req.get[X-Razorpay-Signature]
        console.log("webhookSignature", webhookSignature);
        

        const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)
        if (!isWebhookValid) {
            return res.status(400).json({ mgs: "Webhook is Invalid" })
        }

        const paymentDetails = req.body.payload.payment.entity;

        const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
        payment.status = paymentDetails.status;
        await payment.save();

        const user = await User.findOne({ _id: payment.userId });
        user.isPremium = true;
        user.membershipType = payment.notes.membershipType;
        await user.save();

        res.status(200).json({msg:"Webhook received successfuly"})

    } catch (err) {

    }
})

module.exports = paymentRouter;


