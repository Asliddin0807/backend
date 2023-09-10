const mongoose = require('mongoose')
const clientSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    googleId: {
        type: String,
    },

    deviceId: {
        type: String,
    },

    device_name: {
        type: String
    },

    myFavorites: {
        type: Array
    },

    image: {
        type: String,
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    

    tarif: {
        type: String,
        default: 'free'
    },

    promocod: {
        type: Array
    },

    resetPassword: {
        type: String
    },

    codeExpires: {
        type: Date
    }
})

module.exports = mongoose.model('Client', clientSchema)