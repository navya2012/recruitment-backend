const { userDetailsModel } = require("../models/usersSchema");
const { validationResult } = require('express-validator');


//update
const updateUserDetails = async (req, res) => {
    const { role, _id} = req.user; 
    //console.log("update details", role, _id)
    try {
        // Validation check (if needed)
        const error = validationResult(req).formatWith(({ msg }) => {
            return { msg };
        });
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        let updatedUser;
        if (role === "employee") {
            // Example update fields for employee
            const { firstName, lastName, mobileNumber,position, currentCompany, location } = req.body;
            const updateFields = { firstName, lastName, mobileNumber,position, currentCompany, location };

            updatedUser = await userDetailsModel.findByIdAndUpdate(
                { _id: _id },
                { $set: updateFields },
                { new: true }
            )

            if (!updatedUser) {
                return res.status(404).json({ error: "Employee User not found" });
            }
        } else if (role === "employer") {
            // Example update fields for employer
            const { companyName, mobileNumber, companyType, address, employeesCount, headQuarters } = req.body;
            const updateFields = { companyName, mobileNumber, companyType, address, employeesCount, headQuarters };

            // Update employer details
            updatedUser = await userDetailsModel.findByIdAndUpdate(
                { _id: _id },
                { $set: updateFields },
                { new: true }
            )

            if (!updatedUser) {
                return res.status(404).json({ error: "Employer User not found" });
            }
        } else {
            throw new Error('Invalid role');
        }

        res.status(200).json({ message:"Updated  Successfully", updatedUser });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = updateUserDetails