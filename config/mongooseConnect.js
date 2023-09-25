const mongoose = require('mongoose')
const connectData = () => {
    let data = mongoose.connect('mongodb+srv://Asl:123@cluster0.t9mtv9k.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Database connected!')
    }).catch((err) => {
        console.log(err)
    })

    return data
}
//mongodb+srv://Asliddin:asliddin123@cluster0.bmdjnqw.mongodb.net/?retryWrites=true&w=majority
module.exports = { connectData }