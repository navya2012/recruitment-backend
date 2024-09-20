const { userDetailsModel, profileImageModel } = require("../models/usersSchema");
const { cloudinary } = require("../utilities/cloudinary");
const { generateOtp, sendOtpEmail, sendResendOtp } = require("../utilities/otp");
const createToken = require("../utilities/token")
const { check, validationResult } = require('express-validator');


// Validation rules for sign-up
const signupValidation = [
    check('email').optional().trim()
        .customSanitizer(value => value.toLowerCase())
        .isEmail().withMessage('Invalid email address'),
    check('mobileNumber').optional().isNumeric()
        .isLength({ min: 10, max: 10 })
        .withMessage('InValid Number!!,number must contain only 10 digits'),
    check('password').optional()
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
];


//user sign up
const userSignupDetails = async (req, res) => {
    const { role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName } = req.body

    try {
        // Validation check
        const error = validationResult(req).formatWith(({ msg }) => {
            return { msg };
        });
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        //otp
        const otp = await generateOtp()

        // store data into db+
        const signUpDetails = await userDetailsModel.signup(role, email, password, mobileNumber, companyName, companyType, address, firstName, lastName, otp)

        // Send OTP via email
        await sendOtpEmail(email, otp);

        //token
        const token = createToken({ _id: signUpDetails._id, role: signUpDetails.role, email: signUpDetails.email });

        res.status(200).json({
            message: 'Signup successful, OTP sent to email.',
            signUpDetails: {
                _id: signUpDetails._id,
                role: signUpDetails.role,
                email: signUpDetails.email
            },
            token
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//profile image upload
const userProfileImageUpload = async (req, res) => {
    const { _id } = req.userDetails
    const filePath = req.file.path
    try {
        const user = await userDetailsModel.findOne({ _id });
        if (!user) {
            return res.status(400).json({ error: "user not found!" });
        }

        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(filePath);
        const profileImageUrl = result.secure_url;

        const profileImageRecord = await profileImageModel.findOneAndUpdate(
            { _id: user._id },
            {
                _id: user._id,
                role: user.role,
                email: user.email,
                profileImage: profileImageUrl
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: 'Profile image uploaded successfully',
            profileImageRecord
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//verify otp
const verifyOtp = async (req, res) => {
    const { otp } = req.body
    const { email } = req.userDetails

    try {
        const user = await userDetailsModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Email not found!" });
        }

        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = null;
            await user.save();
            res.status(200).json({ message: "OTP verified successfully!" });
        } else {
            res.status(400).json({ error: "Invalid OTP!" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

//resend otp
const resendOtp = async (req, res) => {
    const { email } = req.userDetails;

    try {
        const user = await userDetailsModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Email not found!" });
        }

        const resentOtp = await generateOtp();

        user.otp = resentOtp
        user.isVerified = false;
        await user.save();

        await sendResendOtp(email, resentOtp);

        res.status(200).json({ message: "OTP has been resent to your email." });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//user login
const userLoginDetails = async (req, res) => {
    const { email, password } = req.body;
    try {
        // store data into db+
        const loginDetails = await userDetailsModel.login(email, password);

        // Check if user is verified
        if (!loginDetails.isVerified) {
            return res.status(400).json({ error: "Email not verified. Please verify your email before logging in." });
        }

        //token
        const token = createToken({ _id: loginDetails._id, role: loginDetails.role, email: loginDetails.email });

        res.status(200).json({
            message: "Successfully Logged In",
            loginDetails,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = {
    userSignupDetails,
    userLoginDetails,
    signupValidation,
    verifyOtp,
    generateOtp,
    resendOtp,
    userProfileImageUpload
}