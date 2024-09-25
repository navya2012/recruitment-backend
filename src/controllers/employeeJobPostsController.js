
const { jobRecruitmentModel, jobAppliedPostsModel } = require("../models/recruitmentSchema")


//get all recruitment posts - employee
const getAllJobRecruitmentPosts = async (req, res) => {
    try {
        const getAllJobPostsData = await jobRecruitmentModel.find()
        res.status(200).json({ getAllJobPostsData })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//update job applied status by employee
const updateJobAppliedStatus = async (req, res) => {
    const jobId = req.params.id;
    const employeeDetails = req.user

    try {

        const jobPost = await jobRecruitmentModel.findOne({_id: jobId});
        if (!jobPost) {
            return res.status(404).json({ error: 'job Post not found' });
        }

        const existingApplication = await jobAppliedPostsModel.findOne({ jobId, employee_id: req.user._id });
        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied to this job.' });
        }
        
        const jobApplication = await jobAppliedPostsModel.create({
            jobId: jobPost._id,
            employer_id: jobPost.employer_id,
            companyName:jobPost.companyName,
            role:jobPost.role,
            technologies:jobPost.technologies,
            experience: jobPost.experience,
            location:jobPost.location,
            hasApplied: true,
            employee_id : employeeDetails._id,
            email : employeeDetails.email,
            mobileNumber: employeeDetails.mobileNumber,
            firstName: employeeDetails.firstName,
            lastName: employeeDetails.lastName,
            jobAppliedDate: new Date()
        });

        res.status(200).json({
            message: 'Successfully applied for the job',
            jobApplication
        });

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//get all applied posts by all employees
const getAllJobAppliedPostsByEmployees = async (req, res) => {
    try {
        const getAllJobAppliedPostsData = await jobAppliedPostsModel.find()
        res.status(200).json({ getAllJobAppliedPostsData })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//get job applied status by employee
const getJobPostsAppliedByEmployee = async (req, res) => {
    const employee_id = req.user._id

    try {

        const appliedJobPosts = await jobAppliedPostsModel.find({
            hasApplied: true,
                employee_id :employee_id
        })  

        if (appliedJobPosts.length === 0) {
            return res.status(200).json({ message: "No applied job posts found" });
        }

        const jobAppliedPostsList = appliedJobPosts.map(job => ({
            jobId: job.jobId,
            employer_id: job.employer_id,
            companyName: job.companyName,
            role: job.role,
            technologies:job.technologies,
            experience:job.experience,
            location:job.location,
            hasApplied: true,
            employee_id : job.employee_id,
            email : job.email,
            jobAppliedDate: job.jobAppliedDate

        }));

        res.status(200).json({
            jobAppliedPostsList
        });

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

module.exports = {
    getAllJobRecruitmentPosts,
    updateJobAppliedStatus,
    getAllJobAppliedPostsByEmployees,
    getJobPostsAppliedByEmployee
}