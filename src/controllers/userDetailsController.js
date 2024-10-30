const { jobAppliedPostsModel, jobRecruitmentModel } = require("../models/recruitmentSchema");
const { userDetailsModel, profileImageModel } = require("../models/usersSchema");
const { workingExperienceModel } = require("../models/workingExperienceSchema");

const getEmployeeFullDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const fullDetails = {};

        // Fetch user details
        const userDetails = await userDetailsModel.findOne({_id:id});
        if (userDetails) {
            fullDetails.userDetails = userDetails; 
        } else {
            fullDetails.userDetails = "User details not found.";
        }

        // Fetch profile image
        const profileImage = await profileImageModel.findOne({ user_id: id });
        if (profileImage) {
            fullDetails.profileImage = profileImage; 
        } else {
            fullDetails.profileImage = "Profile image not found.";
        }

        // Fetch working experience
        const workingExperience = await workingExperienceModel.findOne({ employee_id: id });
        if (workingExperience) {
            fullDetails.workingExperience = workingExperience; 
        } else {
            fullDetails.workingExperience = "Working experience not found.";
        }

        // Fetch applied jobs
        const appliedJobsCount = appliedJobs.length;
        fullDetails.appliedJobsCount = appliedJobsCount;
        
        const appliedJobs = await jobAppliedPostsModel.find({ employee_id: id });
        if (appliedJobs) {
            fullDetails.appliedJobs = appliedJobs; 
        } else {
            fullDetails.appliedJobs = "No Applied Jobs.";
        }

        res.status(200).json({ message: "Employee full details fetched successfully", fullDetails });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getEmployerFullDetails = async (req, res) => {
    const { id } = req.params;

    try {
        const employerDetails = {};

        // Fetch user details
        const userDetails = await userDetailsModel.findOne({_id:id});
        if (userDetails) {
            employerDetails.userDetails = userDetails; 
        } else {
            employerDetails.userDetails = "User details not found.";
        }

        // Fetch profile image
        const profileImage = await profileImageModel.findOne({ user_id: id });
        if (profileImage) {
            employerDetails.profileImage = profileImage; 
        } else {
            employerDetails.profileImage = "Profile image not found.";
        }

        // Fetch posted job posts
        const postedJobPostsCount = postedJobPosts.length;
        employerDetails.postedJobPostsCount = postedJobPostsCount;

        const postedJobPosts = await jobRecruitmentModel.find({ employer_id: id });
        if (postedJobPosts) {
            employerDetails.postedJobPosts = postedJobPosts; 
        } else {
            employerDetails.postedJobPosts = "posted Job Posts not found.";
        }

        // Fetch applied jobs
        const appliedJobsCount = appliedJobs.length;
        employerDetails.appliedJobsCount = appliedJobsCount;

        const appliedJobs = await jobAppliedPostsModel.find({ employer_id: id });
        if (appliedJobs) {
            employerDetails.appliedJobs = appliedJobs; 
        } else {
            employerDetails.appliedJobs = "No Applied Jobs.";
        }

        res.status(200).json({ message: "Employee full details fetched successfully", employerDetails });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getEmployeeFullDetails,
    getEmployerFullDetails
};
