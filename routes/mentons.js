const { regisMentor, login, getMentor, 
getMentorCourses, changePassword, 
forgotPassword, uploadImg, verifyCode, getStudets } = require('../controllers/mentors')
const isMentor = require('../middleware/isMentor')
const router = require('express').Router()
const multer = require('../middleware/multer')


router.post('/regis', regisMentor)
router.post('/login', login)
router.get('/getMentor', isMentor, getMentor)
router.get('/mentor_courses', isMentor, getMentorCourses)
router.post('/forgot_password', forgotPassword)
router.post('/verify_code', verifyCode)
router.put('/change_password', changePassword)
router.put('/upload', multer.array('image', 2), isMentor, uploadImg)
router.get('/getStudents', isMentor, getStudets)

module.exports = router