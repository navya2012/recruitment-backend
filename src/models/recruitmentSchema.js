
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
    { timestampss: true }
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
    email: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    employeeCurrentCompany:{
        type:String
    },
    employeePosition:{
        type:String
    },
    employeeLocation:{
        type:String
    },
    profileImage:{
        type:String,
    },
    jobAppliedDate: {
        type: Date
    }
},

    { timestampss: true }
)

const jobRecruitmentModel = new mongoose.model("jobRecruitment", recruitmentSchema)

const jobAppliedPostsModel = new mongoose.model("jobAppliedPosts", jobAppliedSchema)

module.exports = {
    jobRecruitmentModel,
    jobAppliedPostsModel
}