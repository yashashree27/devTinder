const validator = require('validator');

const validateSignup = (req) => {

    const {firstName, lastName, emailId, password} = req.body;

    if(!firstName || !lastName || !emailId || !password){
        throw new Error ("These are required fields and cannot be empty")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error (' Email is not valid');
    }
    else if (!validator.isStrongPassword(password)){
        throw new Error ('Password is not valid');
    }
}

module.exports = { validateSignup};