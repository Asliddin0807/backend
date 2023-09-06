const jwt = require('jsonwebtoken')
require('dotenv').config()
const Client = require('../models/clients')

const isMentor = async(req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        if(token){
            const decode = jwt.verify(token, procses.env.TOKEN)
            const mentor = await Client.findById(decode?.id)
            if(mentor.role === 'mentor'){
                req.mentor = mentor
                next()
            }else{
                res.status(404).json({ message: 'You are not a mentor!' })
            }
        }else{
            res.status(404).json({ message: 'This is no token!' })
        }
    }catch(err){
        res.status(500).json({ message: err })
    }
}


module.exports = isMentor