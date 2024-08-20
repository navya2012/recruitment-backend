
const express = require("express")

const router = express.Router()


const { signupValidation, userSignupDetails, verifyOtp, userLoginDetails } = require("../controllers/userController")
const { authUser } = require("../middleware/authUserMiddleware")
const { forgotPassword, resetPassword, resetPasswordValidation } = require("../controllers/passwordController")


//routes
router.post('/signup', signupValidation, userSignupDetails)
router.post('/verify-otp', authUser, verifyOtp)
router.post('/login', userLoginDetails)
router.post('/forgot-password', authUser, forgotPassword)
router.post('/reset-password', authUser, resetPasswordValidation, resetPassword)


module.exports = router