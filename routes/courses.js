const { addCourse, uploadImg, uploadVideos } = require('../controllers/coursesCtrl')

const router = require('express').Router()
const { isAdmin } = require('../middleware/isAdmin')
const multer = require('../middleware/multer')
const video = require('../middleware/video')
// const multer = require('multer')
// const storage = multer.memoryStorage()
// const upload = multer({ storage })

router.post('/addCourses', isAdmin, addCourse)
router.post('/upload', multer.array('media', 2), isAdmin, uploadImg)
router.post('/upload_video', video.single('media'), isAdmin, uploadVideos)

module.exports = router