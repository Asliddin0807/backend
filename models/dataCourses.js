const mongoose = require('mongoose')
const dataSchema = new mongoose.Schema({
    mentorId: String,
    courses: [{
        course_name: String,
        video_url: String,
        duration: String
    }]
})

module.exports = mongoose.model('dataCourses', dataSchema)