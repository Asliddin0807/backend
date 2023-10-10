const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    
    mentorId: {
        type: String
    },

    name: String,
    
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

        duration: {
            type: String,
            default: "00:00"
        },
        
        isComplate: {
            type: Boolean,
            default: false
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
    
    }],

    progress: {
        type: Number,
        default: 0
    },

})


module.exports = mongoose.model('Courses', courseSchema)