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
        const PostedJobPostsCount = getJobPostsList.length

        res.status(200).json({PostedJobPostsCount, getJobPostsList })
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
        const deletePostedJobPost = await jobRecruitmentModel.findOneAndDelete({
            _id: jobId,
            employer_id: employer_id
        });

                if (!deletePostedJobPost) {
                    return res.status(404).json({ message: "Job post not found" });
                }

        const deleteAppliedJobPost = await jobAppliedPostsModel.deleteMany({
            _id: jobId,
            employer_id: employer_id
        });

        if (!deleteAppliedJobPost) {
            return res.status(404).json({ message: "No one applied for this job" });
        }

        res.status(200).json({ message: "Job post successfully deleted." });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

//get job applied status by employer
const getAllJobAppliedPostsPostedByEmployer = async (req, res) => {
    const employer_id = req.user._id
    try {

        const appliedJobPostsList = await jobAppliedPostsModel.find({
            hasApplied: true,
                employer_id :employer_id
        })  
        console.log(appliedJobPostsList)

        const jobAppliedPostsList = appliedJobPostsList.map(job => ({
            hasApplied: true,
            jobStatus:job.jobStatus,
            jobId: job.jobId,
            employer_id: job.employer_id,
            companyName: job.companyName,
            role: job.role,
            employee_id : job.employee_id,
            employee_email : job.employee_email,
            employee_firstName: job.employee_firstName,
            employee_lastName: job.employee_lastName,
            employee_location:job.employee_location,
            employee_position:job.employee_position,
            employee_profileImage:job.employee_profileImage,
            employee_jobAppliedDate: job.employee_jobAppliedDate
        }));
        const appliedJobPostsCount = jobAppliedPostsList.length

        res.status(200).json({ appliedJobPostsCount, jobAppliedPostsList });
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const approveJobApplication = async (req, res) => {
    const { employeeId, jobId } = req.params;
    const employerId = req.user._id;

    try {
        const jobApplication = await jobAppliedPostsModel.findOneAndUpdate(
            { jobId:jobId, employee_id: employeeId, employer_id: employerId },
            { jobStatus: 'Approved' },
            { new: true }
        );

        if (!jobApplication) {
            return res.status(404).json({ error: 'Applied Job Post not found' });
        }

        res.status(200).json({ message: 'Application approved', jobApplication });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const rejectJobApplication = async (req, res) => {
    const { jobId, employeeId } = req.params;
    const employerId = req.user._id;

    try {
        const jobApplication = await jobAppliedPostsModel.findOneAndUpdate(
            { jobId:jobId, employee_id: employeeId, employer_id: employerId },
            { jobStatus: 'Rejected' },
            { new: true }
        );

        if (!jobApplication) {
            return res.status(404).json({ error: 'Applied Job Post not found' });
        }

        res.status(200).json({ message: 'Application rejected', jobApplication });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteJobApplication = async (req, res) => {
    const { jobId, employeeId } = req.params;
    const employerId = req.user._id;

    try {
        const jobApplication = await jobAppliedPostsModel.findOneAndDelete({
            jobId:jobId,
            employee_id: employeeId,
            employer_id: employerId
        });

        if (!jobApplication) {
            return res.status(404).json({ error: 'Applied Job Post not found' });
        }

        res.status(200).json({ message: 'Application deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};




module.exports = {
    jobPostsValidation,
    createJobRecruitmentPosts,
    updateJobRecruitmentPosts,
    getAllJobPostsPostedByEmployer,
    deleteJobPosts,
    getAllJobAppliedPostsPostedByEmployer,
    approveJobApplication,
    rejectJobApplication,
    deleteJobApplication
}