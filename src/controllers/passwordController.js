const { userDetailsModel } = require("../models/usersSchema");
const { generateOtp, transporter } = require("./userController");
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator');


const forgotPassword = async (req, res) => {
    const { email } = req.userDetails
    try {

        const user = await userDetailsModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ error: "Email not found!" });
        }

        //otp
        const otp = await generateOtp()
        user.otp = otp
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `Your OTP for password reset is: ${otp}`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to email for password reset." });

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// password validation
const resetPasswordValidation = [
    check('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('New password must contain a lowercase letter')
];

//reset password
const resetPassword = async (req, res) => {
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
    resetPassword,
    resetPasswordValidation
}