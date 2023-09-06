const router = require('express').Router()
const { addCategories } = require('../controllers/categories')


router.post('/title', addCategories)


module.exports = router