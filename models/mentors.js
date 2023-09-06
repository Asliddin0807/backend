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
        type: Array
    },
    
    deviceId: {
        type: String,
    },

    device_name: {
        type: String
    },

    role: {
        type: String,
        default: 'mentor'
    },

    directions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },

    lessons: {
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