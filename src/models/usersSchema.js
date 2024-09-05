
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userDetailsSchema = mongoose.Schema({
    role:{
        type:String,
        enum:['employer','employee'],
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: Number,
        required: true,
        minlength: 10
    },

    //employer
    companyName: {
        type: String,
    },   
    companyType: {
        type: String,
    },  
    address: {
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        country: {
            type: String,
        },
        zipCode: {
            type: Number,
        }
    },
    employeesCount:{
        type:Number
    },
    headQuarters:{
        type: String
    },

    //employee
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    position:{
        type :String,
    },
    currentCompany:{
        type:String,
    },
    location:{
        type:String,
    },
    //
    otp:{
        type:String
    },
    isVerified:{
        type:Boolean,
        default:false
    }
},
{ timestamp: true }  
)

const profileImageSchema = mongoose.Schema({
    _id:{
        type:String
    },
    role:{
        type:String,
    },
    email: {
        type: String,
        unique:true
    },
    profileImage:{
        type:String,
        required:true
    }
},
{ timestamp: true }
)


// users static signup function
userDetailsSchema.statics.signup = async (role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp) => {

    // checking user exists or not
    const exists = await userDetailsModel.findOne({ email, role })
    if (exists) {
        throw Error(`Email already exists for this ${role} role!`)
    }

    //password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const userSignup = await userDetailsModel.create({role, email, mobileNumber, role, companyName, companyType, address, firstName, lastName, password: hash, otp, isVerified:false})
    
    return userSignup
}

// users static login function
userDetailsSchema.statics.login = async  (email, password) => {
    // Check if user exists
    const userLogin = await userDetailsModel.findOne({ email });
    if (!userLogin) {
        throw Error("Incorrect Email!");
    }

    // Compare password
    const match = await bcrypt.compare(password, userLogin.password);
    if (!match) {
        throw Error("Incorrect password!");
    }
    return userLogin;
};


const userDetailsModel = new mongoose.model("UserDetails", userDetailsSchema)

const profileImageModel = new mongoose.model("images", profileImageSchema)

module.exports = {
    userDetailsModel,
    profileImageModel
}
