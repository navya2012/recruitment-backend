
const nodemailer = require("nodemailer");

//generate otp
const generateOtp = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

//otp to email
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `Your OTP for Email Verification is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

const sendResendOtp = async (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Resend OTP Request",
        html: `Your Resend OTP for verification is: ${otp}`
    };

    await transporter.sendMail(mailOptions);
}

const sendOtpForPasswordReset = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `Your OTP for password reset is: ${otp}`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  generateOtp,
  sendResendOtp,
  sendOtpEmail,
  sendOtpForPasswordReset
}