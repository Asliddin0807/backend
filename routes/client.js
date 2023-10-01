const { regisUser, 
login, 
getUser, 
forgotPassword, 
changePassword, 
verifyCode, uploadImg, getAllMentors, getAllCourses, comments, 
getCourse, getCourseComment, addFavourite, getFavourites, getMentorCourses, getUserPromocodes, getMentorProfile,
following, unFollowing, getFollowingUsers, getCategories, getAllCategories, getFeatureCourses, saleCourse, getMyPromocodes, getMyCourses } = require('../controllers/clientCtrl')
const router = require('express').Router()
const authMiddleWare = require('../middleware/authMiddleWare')
const { isPromocode } = require('../middleware/promocode')
const multer = require('../middleware/multer')
const passport = require('passport')

router.post('/regis', regisUser)
router.post('/login', login)
router.get('/user', authMiddleWare, getUser)
router.post('/forgot_password', forgotPassword)
router.post('/verify_code', verifyCode)
router.put('/change_password', changePassword)
router.post('/comment', authMiddleWare, comments)
router.put('/upload_image', multer.array('image', 10), authMiddleWare, uploadImg)
router.get('/get_mentors', getAllMentors)
router.get('/get_courses', getAllCourses)
router.get('/getCourse', getCourse)
router.get('/get_comments', getCourseComment)
router.post('/addFavourite/:course_id', authMiddleWare, addFavourite)
router.get('/myFavourites', authMiddleWare, getFavourites)
router.get('/course/:mentorId', getMentorCourses)
router.get('/promocode', authMiddleWare, getUserPromocodes)
router.post('/follow/:mentor_name', authMiddleWare, following)
router.post('/unfollow/:mentor_name', authMiddleWare, unFollowing)
router.get('/get_mentor_profile/:mentor_name', getMentorProfile)
router.get('/get_followers/:mentor_name', getFollowingUsers)
router.get('/get_all_categories', getAllCategories)
router.get('/get_category/:category', getCategories)
router.get('/get_feature_courses', getFeatureCourses),
router.post('/sale', authMiddleWare, saleCourse)
router.get('/myPromocode', authMiddleWare, getMyPromocodes)
router.get('/my_courses', authMiddleWare, getMyCourses)


//getMentorProfile
router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))


router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: "/login"
}), (req, res) => {
    res.redirect('http://localhost:5173')
})
 


module.exports = router