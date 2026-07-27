const mongoose = require('mongoose');
const { Schema } = mongoose;


const paymentSchema = new Schema({

    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    currency: {
        type: String,
        required: true
    },
    amount:{
        type:Number,
        required:true
    },
    paymentId: {
        type:String
    },
    notes: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        membership: {
            type: String,
        },
        emailId: {
            type:String
        }
    },
    receipt: {
        type: String
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true })



module.exports = mongoose.model('Payment', paymentSchema )