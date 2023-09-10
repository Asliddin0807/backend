const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    mentorId: {
        type: String
    },
    
    courses: [{
        lesson_number: {
            type: Number
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
    
        course_video: {
            type: String
        },
    
        course_category: {
            type: String
        },
    
        rating: [{
            star: {
                type: Number,
                default: 0,
            },
    
            comment: {
                type: String
            },
    
            postedby: {
                type: String
            },

            date: String,
            clock: String
        }],
    
    }]

})


module.exports = mongoose.model('Courses', courseSchema)