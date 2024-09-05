const { jobRecruitmentModel } = require("../models/recruitmentSchema")
const { userDetailsModel } = require("../models/usersSchema")

//employee
//get recruitment posts - employee
const getJobRecruitmentPosts = async (req, res) => {
    try {
        const getJobPostsData = await jobRecruitmentModel.find()
        res.status(200).json({ getJobPostsData })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//update job applied status by employee
const updateJobAppliedStatus = async (req, res) => {
    const jobId = req.params.id
    const employeeDetails = req.user

    try {

        if (!jobId) {
            return res.status(404).json({ error: 'Job Post ID is not provided' });
        }

        const updatedJobPosts = await jobRecruitmentModel.findOneAndUpdate(
            { _id: jobId, },
            {
                $set: {
                    "jobAppliedStatus.status": "Applied",
                    "jobAppliedStatus.employeeDetails": {
                        employee_id: employeeDetails._id,
                        email: employeeDetails.email,
                        mobileNumber: employeeDetails.mobileNumber,
                        firstName: employeeDetails.firstName,
                        lastName: employeeDetails.lastName,
                        jobAppliedDate: new Date() 
                    }
                }
            },
            { new: true }
        );

        if (!updatedJobPosts) {
            return res.status(404).json({ error: "Job post not found" });
        }


        res.status(200).json({
            message: 'Applied for this Job',
            jobId: updatedJobPosts._id, 
            employer_id:updatedJobPosts.employer_id,
            companyName:updatedJobPosts.companyName,
            role:updatedJobPosts.role,
            technologies:updatedJobPosts.technologies,
            jobAppliedStatus: {
                status: updatedJobPosts.jobAppliedStatus.status,
                employeeDetails: updatedJobPosts.jobAppliedStatus.employeeDetails
            }
        });

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//get job applied status by employer
const getJobAppliedPosts = async (req, res) => {
    const employer_id = req.user._id
    try {

        const appliedJobPosts = await jobRecruitmentModel.find({
            "jobAppliedStatus.status": "Applied",
                employer_id :employer_id
        })

        if (appliedJobPosts.length === 0) {
            return res.status(404).json({ error: "No applied job posts found" });
        }

        const jobAppliedPostsList = appliedJobPosts.map(job => ({
            jobId: job._id,
            employer_id: job.employer_id,
            companyName: job.companyName,
            role: job.role,
            jobAppliedStatus: {
                status: job.jobAppliedStatus.status,
                employeeDetails: job.jobAppliedStatus.employeeDetails
            }
        }));

        res.status(200).json({
            jobAppliedPostsList
        });

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}


//employer
//post recruitment posts
const createJobRecruitmentPosts = async (req, res) => {
    const { companyName, role, technologies, experience, location, graduation, languages, noticePeriod } = req.body
    const employer_id = req.user._id

    try {
        const createPostFields = { employer_id, companyName, role, technologies, experience, location, graduation, languages, noticePeriod }

        const newJobPostData = new jobRecruitmentModel(createPostFields)
        await newJobPostData.save()

        res.status(201).json({ message: "Posted Successfully", newJobPostData })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//get recruitment posts - employer
const getJobPosts = async (req, res) => {
    const employer_id = req.user._id
    try {

        const getJobPostsList = await jobRecruitmentModel.find({ employer_id })
        res.status(200).json({ getJobPostsList })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//update job recruitment posts by employer
const updateJobRecruitmentPosts = async (req, res) => {
    const jobId = req.params.id
    const { companyName, role, technologies, experience, location, graduation, languages, noticePeriod } = req.body
    try {

        if (!jobId) {
            return res.status(404).json({ error: 'Job Post ID is not provided' });
        }

        const updateRecruitmentPosts = { companyName, role, technologies, experience, location, graduation, languages, noticePeriod }
        const updatedRecruitmentPosts = await jobRecruitmentModel.findOneAndUpdate(
            { _id: jobId },
            { $set: updateRecruitmentPosts },
            { new: true }
        );

        if (!updatedRecruitmentPosts) {
            return res.status(404).json({ error: "Job post not found" });
        }

        res.status(200).json({ message: "Updated Job Post Successfully", updatedRecruitmentPosts });

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//delete
const deleteJobPosts = async (req, res) => {
    const employer_id = req.user._id;
    const jobId = req.params.id;

    try {
        // Find and delete the job post that matches both employer_id and jobId
        const result = await jobRecruitmentModel.findOneAndDelete({
            _id: jobId,
            employer_id: employer_id
        });

        // Check if a document was found and deleted
        if (!result) {
            return res.status(404).json({ message: "Job post not found" });
        }

        res.status(200).json({ message: "Job post successfully deleted." });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}



module.exports = {
    getJobRecruitmentPosts,
    createJobRecruitmentPosts,
    updateJobAppliedStatus,
    updateJobRecruitmentPosts,
    getJobPosts,
    deleteJobPosts,
    getJobAppliedPosts
}