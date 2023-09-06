const mongoose = require('mongoose')
const connectData = () => {
    let data = mongoose.connect('mongodb://127.0.0.1:27017/cources')
    .then(() => {
        console.log('Database connected!')
    }).catch((err) => {
        console.log(err)
    })

    return data
}

module.exports = { connectData }