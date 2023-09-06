const { regisMentor, login, getMentor, 
getMentorCourses, changePassword, 
forgotPassword, uploadImg, verifyCode } = require('../controllers/mentors')
const isMentor = require('../middleware/isMentor')
const router = require('express').Router()

router.post('/regis', regisMentor)
router.post('/login', login)
router.get('/getMentor', isMentor, getMentor)
router.get('/mentor_courses', isMentor, getMentorCourses)
router.post('/forgot_password', forgotPassword)
router.post('/verify_code', verifyCode)
router.put('/change_password', changePassword)
router.put('/upload', isMentor, uploadImg)

module.exports = router