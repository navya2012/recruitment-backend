const { workingExperienceModel } = require("../models/workingExperienceSchema");

//get working experience
const getWorkingExperience = async (req,res) => {
    try{
        const usersExperienceData = await workingExperienceModel.find(); 
        const count = usersExperienceData.length 
        res.status(200).json({ count,usersExperienceData });
    }
    catch(err){
        res.status(400).json({ error: err.message });
    }
}

const getWorkingExperienceById = async (req,res) => {
    const employee_id = req.user._id;
    try{
        const experienceData = await workingExperienceModel.find({employee_id}); 
        res.status(200).json({ experienceData });
    }
    catch(err){
        res.status(400).json({ error: err.message });
    }
}

// Create new working experience
const createWorkingExperience = async (req, res) => {
    const { technologies, experience, location, graduation, languages, noticePeriod } = req.body;
    const employee_id = req.user._id;
    const employee_email = req.user.email;

    try {
        let workingExperienceData = await workingExperienceModel.findOne({ employee_id ,employee_email});
        console.log(workingExperienceData)

        if (workingExperienceData) {
            return res.status(404).json({ error: "Working experience is already added" });
        }

        const experienceFields = { employee_id, employee_email, technologies, experience, location, graduation, languages, noticePeriod } 

        const addWorkingExperience = new workingExperienceModel(experienceFields);

        await addWorkingExperience.save();
        res.status(200).json({ message: "Working experience created successfully", addWorkingExperience });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update existing working experience
const updateWorkingExperience = async (req, res) => {
    const { technologies, experience, location, graduation, languages, noticePeriod } = req.body;
    const employee_id = req.user._id; 
    const employee_email = req.user.email;

    try {
        let workingExperienceData = await workingExperienceModel.findOne({ employee_id ,employee_email});
        console.log(workingExperienceData)

        if (!workingExperienceData) {
            return res.status(404).json({ error: "Working experience not found. Please create first." });
        }

        const updateExperienceFields = { technologies, experience, location, graduation, languages, noticePeriod } 

        // Find and update the existing entry
        const updatedWorkingExperience = await workingExperienceModel.findOneAndUpdate(
            {_id:workingExperienceData._id},
            { $set: updateExperienceFields },
            { new: true}
        );

        res.status(200).json({ message: "Working experience updated successfully", updatedWorkingExperience });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};



module.exports = {
    createWorkingExperience,
    updateWorkingExperience,
    getWorkingExperience,
    getWorkingExperienceById
};
