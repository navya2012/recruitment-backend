
const express = require("express")

const router = express.Router()

const { signupValidation } = require("../controllers/userController")
const { getWorkingExperience, createWorkingExperience, updateWorkingExperience, getWorkingExperienceById } = require("../controllers/workingExperienceController")
const {  updateJobAppliedStatus,  getAllJobRecruitmentPosts, getAllJobAppliedPostsByEmployees, getJobPostsAppliedByEmployee } = require("../controllers/employeeJobPostsController")
const updateUserDetails = require("../controllers/updateUserController")
const { authUserDetails } = require("../middleware/authUserMiddleware")
const { getEmployeeFullDetails } = require("../controllers/userDetailsController")

//full details
router.get('/employee-full-details/:id', getEmployeeFullDetails)

//update details
router.patch('/update-details', authUserDetails('employee'), signupValidation, updateUserDetails)

//working experience
router.post('/add-working-experience', authUserDetails('employee'), createWorkingExperience);
router.patch('/update-working-experience', authUserDetails('employee'), updateWorkingExperience);
router.get('/get-working-experience', authUserDetails('employee') , getWorkingExperienceById)
router.get('/get-all-users-working-experience',  getWorkingExperience)

// job posts
router.get('/get-all-recruitment-posts', getAllJobRecruitmentPosts);
router.post('/update-job-applied-status/:id', authUserDetails('employee'), updateJobAppliedStatus)
router.get('/get-applied-jobs', authUserDetails('employee'), getJobPostsAppliedByEmployee)
router.get('/get-all-applied-job-posts', getAllJobAppliedPostsByEmployees);

module.exports = router 