const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
    'firstName' : {
        type: String,
        required: true,
        minLength: 4,
    },
    'lastName' : {
        type: String
    },
    'emailId' : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    'password' : {
        type: String
    },
    'age' : {
        type: Number,
        min: 18,
    },
    'about' : {
        type: String,
        default:'This is default bio of user',
    },
    'gender': {
        type : String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error
            }
        }
    },
    'skills': {
        type : [String]
    }
},
 {
    timestamps: true
});

const User = mongoose.model( 'user', userSchema);

module.exports = { User };