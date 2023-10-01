const router = require('express').Router()
const { createFeature, deleteFaeture, uploadImg } = require('../controllers/featureCourses')
const { isAdmin } = require('../middleware/isAdmin')
const multer = require('../middleware/multer')

router.post('/create_fature', isAdmin, multer.array('media', 10), createFeature)
router.post('/upload', isAdmin, multer.array('media', 10), uploadImg)
router.post('/delete', isAdmin, deleteFaeture)

module.exports = router