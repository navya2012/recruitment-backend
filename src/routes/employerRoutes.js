
const express = require("express")

const router = express.Router()

const { signupValidation } = require("../controllers/userController")
const updateUserDetails = require("../controllers/updateUserController")
const { authUserDetails } = require("../middleware/authUserMiddleware")
const { createJobRecruitmentPosts, updateJobRecruitmentPosts, getAllJobPostsPostedByEmployer, deleteJobPosts, getAllJobAppliedPostsPostedByEmployer } = require("../controllers/employerJobPostsController")

//update details
router.patch('/update-details', authUserDetails('employer'), signupValidation, updateUserDetails)

// job posts
router.post('/create-recruitment-posts', authUserDetails('employer'), createJobRecruitmentPosts);
router.patch('/update-recruitment-posts/:id', authUserDetails('employer'), updateJobRecruitmentPosts)
router.get('/get-recruitment-posts', authUserDetails('employer'), getAllJobPostsPostedByEmployer)
router.delete('/delete-recruitment-posts/:id', authUserDetails('employer'), deleteJobPosts)
router.get('/get-job-applied-posts', authUserDetails('employer'), getAllJobAppliedPostsPostedByEmployer)


module.exports = router