
const express = require("express")

const router = express.Router()

const { signupValidation } = require("../controllers/userController")
const { workingExperienceController, getWorkingExperience } = require("../controllers/workingExperienceController")
const {  updateJobAppliedStatus,  getAllJobRecruitmentPosts, getAllJobAppliedPostsByEmployees, getJobPostsAppliedByEmployee } = require("../controllers/employeeJobPostsController")
const updateUserDetails = require("../controllers/updateUserController")
const { authUserDetails } = require("../middleware/authUserMiddleware")


//update details
router.patch('/update-details', authUserDetails('employee'), signupValidation, updateUserDetails)

//working experience
router.post('/working-experience', authUserDetails('employee'), workingExperienceController);
router.get('/get-working-experience', authUserDetails('employee'), getWorkingExperience)

// job posts
router.get('/get-all-recruitment-posts', getAllJobRecruitmentPosts);
router.post('/update-job-applied-status/:id', authUserDetails('employee'), updateJobAppliedStatus)
router.get('/get-applied-jobs', authUserDetails('employee'), getJobPostsAppliedByEmployee)
router.get('/get-all-applied-job-posts', getAllJobAppliedPostsByEmployees);

module.exports = router 