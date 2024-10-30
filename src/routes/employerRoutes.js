
const express = require("express")

const router = express.Router()

const { signupValidation } = require("../controllers/userController")
const updateUserDetails = require("../controllers/updateUserController")
const { authUserDetails } = require("../middleware/authUserMiddleware")
const { createJobRecruitmentPosts, updateJobRecruitmentPosts, getAllJobPostsPostedByEmployer, deleteJobPosts, getAllJobAppliedPostsPostedByEmployer, jobPostsValidation, approveJobApplication, rejectJobApplication, deleteJobApplication } = require("../controllers/employerJobPostsController")
const { getEmployerFullDetails } = require("../controllers/userFullDetailsController")

//full details
router.get('/employer-full-details/:id', getEmployerFullDetails)

//update details
router.patch('/update-details', authUserDetails('employer'), signupValidation, updateUserDetails)

// job posts
router.post('/create-recruitment-posts', authUserDetails('employer'), jobPostsValidation, createJobRecruitmentPosts);
router.patch('/update-recruitment-posts/:id', authUserDetails('employer'), updateJobRecruitmentPosts)
router.get('/get-recruitment-posts', authUserDetails('employer'), getAllJobPostsPostedByEmployer)
router.delete('/delete-recruitment-posts/:id', authUserDetails('employer'), deleteJobPosts)
router.get('/get-job-applied-posts', authUserDetails('employer'), getAllJobAppliedPostsPostedByEmployer)
router.patch('/approve-job-applied-posts/:employeeId/:jobId', authUserDetails('employer'), approveJobApplication)
router.patch('/reject-job-applied-posts/:employeeId/:jobId', authUserDetails('employer'), rejectJobApplication)
router.delete('/delete-job-applied-posts/:employeeId/:jobId', authUserDetails('employer'), deleteJobApplication)


module.exports = router