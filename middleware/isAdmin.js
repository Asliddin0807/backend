const jwt = require('jsonwebtoken')
require('dotenv').config()
const asyncHandler = require('express-async-handler')
const Client = require('../models/clients')


const isAdmin = asyncHandler(async(req, res, next) => {
    try{
        let token = req.headers.authorization.split(" ")[1]
        if(token){
            const decode = jwt.verify(token, process.env.TOKEN)
            const admin = await Client.findById({ _id: decode?.id })
            if(admin.isAdmin){
                req.admin = admin
                next()
            }else{
                res.status(200).json({ message: 'Failed!' })
            }
        }
    }catch(err){
        res.status(404).json({ message: 'this is not token!' })
    }
})

module.exports = { 
    isAdmin
}