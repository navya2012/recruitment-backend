const { jobAppliedPostsModel } = require("../models/recruitmentSchema");
const { userDetailsModel } = require("../models/usersSchema");
const { workingExperienceModel } = require("../models/workingExperienceSchema");


const getEmployeeFullDetails = async (req, res) => {
    const { _id, email } = req.user
console.log(req.user)
    try {
        // Fetch user details
        const userDetails = await userDetailsModel.findOne({_id, email});
        if (!userDetails) {
            return res.status(404).json({ error: "User details not found." });
        }

        // Fetch working experience for this user
        const workingExperience = await workingExperienceModel.findOne({ employee_id: _id, employee_email:email });
        if (!workingExperience) {
            return res.status(404).json({ error: "Working experience not found." });
        }

        // Fetch count of applied jobs for this user
        const appliedJobs = await jobAppliedPostsModel.find({ employee_id: _id, employee_email:email  });
        const appliedJobsCount = appliedJobs.length

        // Combine all the details into a single response object
        const fullDetails = {
            userDetails,
            workingExperience,
            appliedJobs, appliedJobsCount
        };

        res.status(200).json({ message: "Employee full details fetched successfully", fullDetails });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getEmployeeFullDetails
};




