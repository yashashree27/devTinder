const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');


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
        trim: true,
        validator(value){
            if(!validator.isEmail(value)){
              throw new Error('Email is not valid');
            }
        }
    },
    'password' : {
        type: String,
        minLength: 5,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Password is not valid');
            }
        }
    },
    'age' : {
        type: Number,
        min: 18,
    },
    'about' : {
        type: String,
        default:'This is default bio of user',
    },
    'photoUrl' :{
        type: String,
        default: 'https://www.google.com/imgres?q=profile%20image%20icon&imgurl=https%3A%2F%2Fimages.rawpixel.com%2Fimage_800%2FcHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3Y5MzctYWV3LTEzOS5qcGc.jpg&imgrefurl=https%3A%2F%2Fwww.rawpixel.com%2Fsearch%2Fprofile%2520icon&docid=-QpGQOw4ca8j3M&tbnid=D_1wi0WRaoRRYM&vet=12ahUKEwjBuOi5lMCUAxWrzzgGHau4A1AQnPAOegQIWhAB..i&w=800&h=800&hcb=2&ved=2ahUKEwjBuOi5lMCUAxWrzzgGHau4A1AQnPAOegQIWhAB',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Photo url is not avlid')
            };
        }
    },
    'gender': {
        type : String,
        validate(value){
            if(!['male', 'female', 'others'].includes(value)){
                throw new Error("not valid gender value")
            }
        }
    },
    'skills': {
        type : [String],
        validate(value){
            if(value.length > 4){
                throw new Error("Skills cannnot eb more than 4")
            }
        }
    }
},
 {
    timestamps: true
});

const User = mongoose.model( 'user', userSchema);

module.exports = { User };