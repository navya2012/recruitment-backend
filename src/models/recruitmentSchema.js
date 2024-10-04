
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
        type: [String],
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
        type: [String],
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
},
    { timestamps: true }
)

const jobAppliedSchema = mongoose.Schema({
    jobId: {
        type: String
    },
    employer_id: {
        type: String
    },
    companyName:{
        type:String
    },
    role:{
        type:String
    },
    technologies:{
        type:[String]
    },
    experience:{
        type:String
    },
    location:{
        type:String
    },
    hasApplied: {
        type: Boolean,
        required: true,
        default: false 
    },
    employee_id: {
        type: String
    },
    employee_email: {
        type: String
    },
    employee_mobileNumber: {
        type: String
    },
    employee_firstName: {
        type: String
    },
    employee_lastName: {
        type: String
    },
    employee_current_company:{
        type:String
    },
    employee_position:{
        type:String
    },
    employee_location:{
        type:String
    },
    employee_profileImage:{
        type:String,
    },
    employee_jobAppliedDate: {
        type: Date
    }
},

    { timestamps: true }
)

const jobRecruitmentModel = new mongoose.model("jobRecruitment", recruitmentSchema)

const jobAppliedPostsModel = new mongoose.model("jobAppliedPosts", jobAppliedSchema)

module.exports = {
    jobRecruitmentModel,
    jobAppliedPostsModel
}