
const express = require("express")

const router = express.Router()

const { signupValidation, userSignupDetails, verifyOtp, userLoginDetails, resendOtp } = require("../controllers/userController")
const { authUser } = require("../middleware/authUserMiddleware")
const { forgotPassword, changePasswordValidation, changePassword, updatePassword } = require("../controllers/passwordController")
const { uploadFiles } = require("../utilities/multer")


//routes
router.post('/signup', uploadFiles.single('profileImage'), signupValidation, userSignupDetails)
router.post('/verify-otp', authUser, verifyOtp)
router.post('/resend-otp', authUser, resendOtp)
router.post('/login', userLoginDetails) 
router.post('/forgot-password',authUser, forgotPassword)
router.post('/update-password',authUser, updatePassword)
router.post('/change-password', authUser, changePasswordValidation, changePassword)


module.exports = router