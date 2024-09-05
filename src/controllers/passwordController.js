const { userDetailsModel } = require("../models/usersSchema");
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');
const { generateOtp } = require("../utilities/otp");


// password validation
const changePasswordValidation = [
    check('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('New password must contain a lowercase letter')
];

const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {

        const user = await userDetailsModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Email not found!" });
        }

        //otp
        const otp = await generateOtp()
        user.otp = otp
        user.isVerified = false
        await user.save();

        await send(email, otp);

        res.status(200).json({ message: "OTP sent to email for password reset." });

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//update password
const updatePassword = async (req, res) => {
    const { newPassword } = req.body
    const { email } = req.userDetails

     try {
        //validation check
        const errors = validationResult(req).formatWith(({ msg }) => {
            return { msg };
        });
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const user = await userDetailsModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Email not found!" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ error: "Email not verified. Please verify your email before resetting the password." });
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

}

//reset password
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const { email } = req.userDetails
    try {
        //validation check
        const errors = validationResult(req).formatWith(({ msg }) => {
            return { msg };
        });
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }

        const user = await userDetailsModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Email not found!" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ error: "Email not verified. Please verify your email before resetting the password." });
        }

        // Compare old passwords
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({ error: "Old password is incorrect!" });
        }

        //new password
        const salt = await bcrypt.genSalt(10)
        const hashNewPassword = await bcrypt.hash(newPassword, salt)
        user.password = hashNewPassword

        if (oldPassword === newPassword) {
            return res.status(400).json({ error: "New password cannot be the same as the old password!" });
        }

        await user.save();

        res.status(200).json({ message: "Password reset successfully!" });

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

}


module.exports = {
    forgotPassword,
    changePasswordValidation,
    changePassword,
    updatePassword
}