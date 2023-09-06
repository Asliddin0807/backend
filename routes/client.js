const { regisUser, 
login, 
getUser, 
forgotPassword, 
changePassword, 
verifyCode, uploadImg, getAllMentors, getAllCourses, comments, 
getCourse, getCourseComment, addFavourite, getFavourites, getMentorCourses, getUserPromocodes, sale } = require('../controllers/clientCtrl')
const router = require('express').Router()
const authMiddleWare = require('../middleware/authMiddleWare')
const multer = require('../middleware/multer')
const passport = require('passport')

router.post('/regis', regisUser)
router.post('/login', login)
router.get('/user', authMiddleWare, getUser)
router.post('/forgot_password', forgotPassword)
router.post('/verify_code', verifyCode)
router.put('/change_password', changePassword)
router.post('/comment/:course_id', authMiddleWare, comments)
router.put('/upload_image', multer.array('image', 10), authMiddleWare, uploadImg)
router.get('/get_mentors', getAllMentors)
router.get('/get_courses', getAllCourses)
router.get('/getCourse/:course_name', getCourse)
router.get('/get_comments/:course_id', getCourseComment)
router.post('/addFavourite/:course_id', authMiddleWare, addFavourite)
router.get('/myFavourites', authMiddleWare, getFavourites)
router.get('/course/:mentorId', getMentorCourses)
router.get('/promocode', authMiddleWare, getUserPromocodes)

router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))


router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: "/login"
}), (req, res) => {
    res.redirect('http://localhost:5173')
})
 

router.post('/sale/:courseId', authMiddleWare, sale)

module.exports = router