const { jobAppliedPostsModel } = require("../models/recruitmentSchema");
const { userDetailsModel, profileImageModel } = require("../models/usersSchema");
const { workingExperienceModel } = require("../models/workingExperienceSchema");


const getEmployeeFullDetails = async (req, res) => {
    const { id } = req.params;

    try {
        //  user details
        const userDetails = await userDetailsModel.findOne({_id: id});
        if (!userDetails) {
            return res.status(404).json({ error: "User details not found." });
        }

        //profile image
        const profileImage = await profileImageModel.findOne({user_id:id});
        if (!profileImage) {
            return res.status(404).json({ error: "profile Image not found." });
        }

        //  working experience 
        const workingExperience = await workingExperienceModel.findOne({ employee_id:id});
        if (!workingExperience) {
            return res.status(404).json({ error: "Working experience not found." });
        }

        //  applied jobs
        const appliedJobs = await jobAppliedPostsModel.find({ employee_id:id});
        const appliedJobsCount = appliedJobs.length

        const fullDetails = {
            userDetails,
            profileImage,
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




