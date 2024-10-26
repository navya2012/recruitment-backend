const { jobRecruitmentModel, jobAppliedPostsModel } = require("../models/recruitmentSchema")
const { check, validationResult } = require('express-validator');


//validation errors
const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const jobPostsValidation = [
    check('companyName').optional().trim().customSanitizer(value => value.toUpperCase()),
    check('role').optional().trim().customSanitizer(value => capitalizeFirstLetter(value)),
    check('technologies').optional()
    .customSanitizer(value => {
        if (Array.isArray(value)) {
            return value.map(tech => capitalizeFirstLetter(tech));
        }
        if (typeof value === 'string') {
            return [capitalizeFirstLetter(value)]; 
        }
        return [];
    }),
    check('experience').optional().trim().customSanitizer(value => capitalizeFirstLetter(value)),
    check('location').optional().trim().customSanitizer(value => capitalizeFirstLetter(value)),
    check('graduation').optional().trim().customSanitizer(value => capitalizeFirstLetter(value)),
    check('languages').optional()
    .customSanitizer(value => {
        if (Array.isArray(value)) {
            return value.map(lang => capitalizeFirstLetter(lang));
        }
        if (typeof value === 'string') {
            return [capitalizeFirstLetter(value)]; 
        }
        return []; 
    }),
    check('noticePeriod').optional().trim().customSanitizer(value => capitalizeFirstLetter(value)),
]

//get job applied status by employer
const getAllJobAppliedPostsPostedByEmployer = async (req, res) => {
    const employer_id = req.user._id
    try {

        const appliedJobPostsList = await jobAppliedPostsModel.find({
            hasApplied: true,
                employer_id :employer_id
        })  

        const jobAppliedPostsList = appliedJobPostsList.map(job => ({
            jobId: job.jobId,
            employer_id: job.employer_id,
            companyName: job.companyName,
            role: job.role,
            hasApplied: true,
            employee_id : job.employee_id,
            employee_email : job.employee_email,
            employee_mobileNumber: job.employee_mobileNumber,
            employee_firstName: job.employee_firstName,
            employee_lastName: job.employee_lastName,
            employee_current_company:job.employee_current_company,
            employee_location:job.employee_location,
            employee_position:job.employee_position,
            employee_profileImage:job.employee_profileImage,
            employee_jobAppliedDate: job.employee_jobAppliedDate
        }));

        res.status(200).json({ jobAppliedPostsList });
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//post recruitment posts
const createJobRecruitmentPosts = async (req, res) => {
    const { companyName, role, technologies, experience, location, graduation, languages, noticePeriod } = req.body
    const employer_id = req.user._id

    try {
          // Validation check
          const error = validationResult(req).formatWith(({ msg }) => {
            return { msg };
        });
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        const createPostFields = { employer_id, companyName, role, technologies, experience, location, graduation, languages, noticePeriod }

        const newJobPostData = new jobRecruitmentModel(createPostFields)
        await newJobPostData.save()

        res.status(200).json({ message: "Posted Successfully", newJobPostData })
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//get recruitment posts - employer
const getAllJobPostsPostedByEmployer = async (req, res) => {
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
            return res.status(404).json({ error: 'Job Post is not provided' });
        }

        const updateRecruitmentPosts = { companyName, role, technologies, experience, location, graduation, languages, noticePeriod }
        const updatedRecruitmentPosts = await jobRecruitmentModel.findOneAndUpdate(
            { _id: jobId },
            { $set: updateRecruitmentPosts },
            { new: true }
        );

        res.status(200).json({ message: "Updated Job Post Successfully",updatedRecruitmentPosts });
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
    jobPostsValidation,
    createJobRecruitmentPosts,
    updateJobRecruitmentPosts,
    getAllJobPostsPostedByEmployer,
    deleteJobPosts,
    getAllJobAppliedPostsPostedByEmployer,
}