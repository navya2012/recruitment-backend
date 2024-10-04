
const { jobRecruitmentModel, jobAppliedPostsModel } = require("../models/recruitmentSchema")
const { profileImageModel } = require("../models/usersSchema")


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
            return res.status(200).json({ message: 'You have already applied to this job.' });
        }

        const profileImageData = await profileImageModel.findOne({
            $and: [
                { user_id: req.user._id },
                { email: req.user.email },
                { role: req.user.role }
            ]
        });
        console.log(profileImageData,'user', employeeDetails)

        if (!profileImageData) {
            return res.status(404).json({ error: 'Profile image not found' });
        }
        console.log({
            jobId: jobPost._id,
            employer_id: jobPost.employer_id,
            companyName: jobPost.companyName,
            role: jobPost.role,
            technologies: jobPost.technologies,
            experience: jobPost.experience,
            location: jobPost.location,
            hasApplied: true,
            employee_id: employeeDetails._id,
            employee_profileImage: profileImageData?.profileImage,
            employee_email: employeeDetails.email,
            employee_mobileNumber: employeeDetails.mobileNumber,
            employee_firstName: employeeDetails.firstName,
            employee_lastName: employeeDetails.lastName,
            employee_current_company: employeeDetails.currentCompany,
            employee_position: employeeDetails.position,
            employee_location: employeeDetails.location,
            employee_jobAppliedDate: new Date()
        });
        
        
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
            employee_profileImage: profileImageData?.profileImage,
            employee_email : employeeDetails.email,
            employee_mobileNumber: employeeDetails.mobileNumber,
            employee_firstName: employeeDetails.firstName,
            employee_lastName: employeeDetails.lastName,
            employee_current_company:employeeDetails.currentCompany,
            employee_position:employeeDetails.position,
            employee_location:employeeDetails.location,
            employee_jobAppliedDate: new Date()
        });
console.log(jobApplication)
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
            employee_profile:job.profileImage,
            employee_email : job.email,
            jobAppliedDate: job.jobAppliedDate
        }));
console.log(jobAppliedPostsList)
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