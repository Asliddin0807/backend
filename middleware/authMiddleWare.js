const jwt = require('jsonwebtoken')
require('dotenv').config()
const Client = require('../models/clients')


const authMiddleWare = async(req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(token){
            const decode = jwt.verify(token, process.env.TOKEN)
            const user = await Client.findById(decode?.id)
            req.user = user
            next()
        }else{
            res.status(404).json({ message: 'No registered!' })
        }
    }catch(err){
        res.status(404).json({ message: 'No Token?' })
    }
}

module.exports = authMiddleWare