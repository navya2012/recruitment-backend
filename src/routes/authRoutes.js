
const express = require("express")

const router = express.Router()

const { signupValidation, userSignupDetails, verifyOtp, userLoginDetails, resendOtp, userProfileImageUpload, getUserProfileImage } = require("../controllers/userController")
const { authUser } = require("../middleware/authUserMiddleware")
const { forgotPassword, changePasswordValidation, changePassword, updatePassword } = require("../controllers/passwordController")
const { uploadFiles } = require("../utilities/multer")


//routes
router.post('/signup', signupValidation, userSignupDetails)
router.post('/login', userLoginDetails)

router.post('/verify-otp', authUser, verifyOtp)
router.post('/resend-otp', authUser, resendOtp)
 
router.post('/profile-pic-upload', authUser, uploadFiles.single('profileImage'), userProfileImageUpload )
router.get('/users-profile-images', getUserProfileImage)

router.post('/forgot-password', forgotPassword)
router.post('/update-password',authUser,changePasswordValidation, updatePassword)
router.post('/change-password', authUser, changePasswordValidation, changePassword)


module.exports = router