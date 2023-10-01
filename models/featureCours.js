const mongoose = require('mongoose')
const featureCourse = new mongoose.Schema({
    mentorId: {
        type: String
    },
    
    courses: [{
        lesson_number: {
            type: Number,
            default: 0
        },

        course_name: {
            type: String,
            required: true
        },
    
        course_description: {
            type: String,
            required: true
        },
    
        course_price: {
            type: String,
            required: true
        },

        course_image: {
            type: String,
        },
    
        course_category: {
            type: String
        },

        duration: {
            type: String
        },
    }]
})

module.exports = mongoose.model('Feature', featureCourse)