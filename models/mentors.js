const mongoose = require('mongoose')

const mentorsSchema = new mongoose.Schema({
    username: {
        type: String
    },

    email: {
        type: String,
    },

    password: {
        type: String
    },

    image: {
        type: String
    },
    
    deviceId: {
        type: String,
    },

    device_name: {
        type: String
    },

    isMentor: {
        type: Boolean,
        default: true
    },

    directions: {
        type: String
    },

    lessons: {
        type: Array
    },

    featureCourses: {
        type: Array
    },

    studets: {
        type: Array
    },

    resetPassword: {
        type: String
    },

    codeExpires: {
        type: Date
    },
})

module.exports = mongoose.model('Mentors', mentorsSchema)