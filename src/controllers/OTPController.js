
const { generateOtp, sendResendOtp } = require("../utilities/otp");
const { userDetailsModel } = require("../models/usersSchema");

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


module.exports = {
    verifyOtp,
    resendOtp
}