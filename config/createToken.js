const jwt = require('jsonwebtoken')
require('dotenv').config()


const createToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN, { expiresIn: '2d' })
}

const refreshToken = (id) => {
    return jwt.sign({id}, process.env.TOKEN, { expiresIn: '1d' })
}

module.exports = { createToken, refreshToken }