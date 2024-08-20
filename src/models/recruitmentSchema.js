
const mongoose = require('mongoose')


const recruitmentSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    technologies: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    graduation: {
        type: String,
        required: true
    },
    languages: {
        type: String,
        required: true
    },
    noticePeriod: {
        type: String,
        required: true
    },
    employer_id: {
        type: String,
        required: true
    },
    jobAppliedStatus: {
        status: {
            type: String,
            enum: ['Applied', 'Denied'],
            required: true,
            default: "Denied"
        },
        employeeDetails: {
            employee_id:{
                type:String
            },
            email:{
                type:String
            },
            mobileNumber:{
                type:String
            },
            firstName:{
                type:String
            },
            lastName:{
                type:String
            },
            jobAppliedDate: {
                type: Date
    
            }
        },       
    }

},
    { timestamp: true }
)

const jobRecruitmentModel = new mongoose.model("jobRecruitment", recruitmentSchema)

module.exports = {
    jobRecruitmentModel
}