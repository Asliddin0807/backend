const mongoose = require('mongoose')

const promokods = new mongoose.Schema({
    promokods: [{
        promokod: {
            type: String,
        },
        user: String,
        price: String,
        date: String
    }]
    
})

module.exports = mongoose.model('Promokod', promokods)