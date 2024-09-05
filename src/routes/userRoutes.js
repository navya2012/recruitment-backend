
const express = require("express")

const router = express.Router()

const { signupValidation } = require("../controllers/userController")
const { workingExperienceController, getWorkingExperience } = require("../controllers/workingExperienceController")
const { createJobRecruitmentPosts, updateJobRecruitmentPosts, getJobRecruitmentPosts, updateJobAppliedStatus, getJobPosts, deleteJobPosts, getJobAppliedPosts } = require("../controllers/jobRecruitmentController")
const updateUserDetails = require("../controllers/updateUserController")
const { authUserDetails} = require("../middleware/authUserMiddleware")
      

//update details
router.patch('/employee/update-details', authUserDetails('employee'), signupValidation, updateUserDetails )
router.patch('/employer/update-details', authUserDetails('employer'), signupValidation, updateUserDetails )

//working experience
router.post('/employee/working-experience', authUserDetails('employee'), workingExperienceController);
router.get('/employee/working-experience', authUserDetails('employee'), getWorkingExperience)

// job posts
//employer
router.post('/employer/create-recruitment-posts', authUserDetails('employer'), createJobRecruitmentPosts);
router.patch('/employer/update-recruitment-posts/:id', authUserDetails('employer'), updateJobRecruitmentPosts )
router.get('/employer/get-recruitment-posts', authUserDetails('employer'), getJobPosts )
router.delete('/employer/delete-recruitment-posts/:id', authUserDetails('employer'), deleteJobPosts )
router.get('/employer/applied-job-posts', authUserDetails('employer'), getJobAppliedPosts)

//employee
router.get('/employee/get-recruitment-posts', getJobRecruitmentPosts);
router.post('/employee/update-job-applied-status/:id', authUserDetails('employee'), updateJobAppliedStatus )



module.exports = router