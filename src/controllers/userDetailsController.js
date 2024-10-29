const { jobAppliedPostsModel } = require("../models/recruitmentSchema");
const { userDetailsModel, profileImageModel } = require("../models/usersSchema");
const { workingExperienceModel } = require("../models/workingExperienceSchema");

const getEmployeeFullDetails = async (req, res) => {
    const { id } = req.params;

    try {
        // Initialize an object to hold all details
        const fullDetails = {};

        // Fetch user details
        const userDetails = await userDetailsModel.findById(id);
        if (userDetails) {
            fullDetails.userDetails = userDetails; // Add found user details
        } else {
            fullDetails.userDetails = "User details not found.";
        }

        // Fetch profile image
        const profileImage = await profileImageModel.findOne({ user_id: id });
        if (profileImage) {
            fullDetails.profileImage = profileImage.url; // Add found profile image
        } else {
            fullDetails.profileImage = "Profile image not found.";
        }

        // Fetch working experience
        const workingExperience = await workingExperienceModel.findOne({ employee_id: id });
        if (workingExperience) {
            fullDetails.workingExperience = workingExperience; // Add found working experience
        } else {
            fullDetails.workingExperience = "Working experience not found.";
        }

        // Fetch applied jobs
        const appliedJobs = await jobAppliedPostsModel.find({ employee_id: id });
        const appliedJobsCount = appliedJobs.length;

        // Add applied jobs and count to the full details
        fullDetails.appliedJobs = appliedJobs;
        fullDetails.appliedJobsCount = appliedJobsCount;

        // Send response with the full details
        res.status(200).json({ message: "Employee full details fetched successfully", fullDetails });
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching employee details." });
    }
};

module.exports = {
    getEmployeeFullDetails
};
