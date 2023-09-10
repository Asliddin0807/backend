const mongoose = require('mongoose')
const connectData = () => {
    let data = mongoose.connect('mongodb://127.0.0.1:27017/course')
    .then(() => {
        console.log('Database connected!')
    }).catch((err) => {
        console.log(err)
    })

    return data
}
//mongodb+srv://Asliddin:asliddin123@cluster0.bmdjnqw.mongodb.net/?retryWrites=true&w=majority
module.exports = { connectData }