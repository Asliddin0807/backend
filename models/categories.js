const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    directionsId: {
        type: Number,
        default: 1227192
    },
    directions: [{
        title: {
            type: String,
            required: true,
            uniqui: true
        }
    }]
})

module.exports = mongoose.model('Categories', categorySchema)