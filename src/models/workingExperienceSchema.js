
const mongoose = require('mongoose')

const workingExperienceSchema = mongoose.Schema({
    technologies: {
        type: [String],
        enum: ['HTML','CSS','JAVASCRIPT','REACT','ANGULAR','VUE'],
        required: true,
        default:'VUE'
    },
    experience: {
        type: String,
        enum: ['Fresher','1 year','2-3 years','3-4 years','4-5 years'],
        required: true,
        default:'4-5 years'
    },
    location: {
        type: String,
        enum: ['Hyderabad','Bangalore','Vijayawada','Chennai'],
        required: true,
        default:'Chennai'
    },
    graduation: {
        type: String,
        enum: ['B.TECH','M.TECH','MS','BSC','OTHERS'],
        required: true,
        default:'BSC',
    },
    languages: {
        type: [String],
        enum: ['Telugu','Hindi','English','Tamil'],
        required: true,
        default:'Tamil'
    },
    noticePeriod: {
        type: String,
        enum: ['15 days','1 Month','2 Months','Immediately'],
        required: true,
         default:'Immediately'
    },
    employee_id:{
        type: String,
        required: true
    }
},
 { timestamp: true }
)

const workingExperienceModel = new mongoose.model("workingExperience", workingExperienceSchema)

module.exports = {
    workingExperienceModel
}