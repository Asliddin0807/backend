const jwt = require('jsonwebtoken')
require('dotenv').config()
const Mentors = require('../models/mentors')

const isMentor = async(req, res, next) => {
    
        const token = req.headers.authorization.split(' ')[1]
        if(token){
            const decode = jwt.verify(token, process.env.TOKEN)
            const mentor = await Mentors.findById(decode?.id)
            if(mentor.isMentor === true){
                req.mentor = mentor
                next()
            }else{
                res.status(404).json({ message: 'You are not a mentor!' })
            }
        }else{
            res.status(404).json({ message: 'This is no token!' })
        }
    
}


module.exports = isMentor