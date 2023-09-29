const Mentors = require('../models/mentors')
const Courses = require('../models/courses')
const Categories = require('../models/categories')

const asyncHandler = require('express-async-handler')
const useragent = require('express-useragent')
const { v4: uuidv4 } = require('uuid');
const { createToken, refreshToken } = require('../config/createToken')
const serviceEmail = require('../utils/nodemailer')
const { upload } = require('../utils/cloudinary')
const fs = require('fs')

//registration 
const regisMentor = asyncHandler(async(req, res) => {
    const { username, email, password, directions } = req.body
    const find = await Mentors.findOne({
        username: username,
        email: email
    })
    if(find){
        res.status(403).json({ message: 'User is already exists!' })
    }else{
        let deviceId = uuidv4()
        let device_name = req.headers['user-agent']
        let find_direction = await Categories.findOne({ directionsId: 1227192 })
        const finds = find_direction.directions.find(text => text.title === directions)
        if(finds){
            console.log(finds);
            const create = new Mentors({
                username: username,
                email: email,
                password: password,
                deviceId: deviceId,
                device_name: device_name,
                directions: finds.title
            })
            await create.save()
            res.status(200).json({ message: 'Success', data: {
                username: create.username,
                email: create.email,
                password: create.password,
                deviceId: deviceId,
                device_name: device_name,
                directions: finds.title,
                token: createToken(create.id)
            }})
        } 
    }
})

const getStudets = asyncHandler(async(req, res) => {
    const { id } = req.mentor
    const find = await Mentors.findById({ _id: id })
    if(find){
        res.status(200).json({ message: 'Success', data: find.studets })
    }else{
        res.status(404).json({ message: 'Failed' })
    }
})

//login 
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    
    const find = await Mentors.findOne({
        email: email
    })
    if(find){
        const findPassword = await Mentors.findOne({
            password: password
        })
        if(findPassword){
            let deviceId = uuidv4()
            let device = req.headers['user-agent']
            const findskiy = await Mentors.findByIdAndUpdate(
                {
                    _id: find._id
                },
                {
                    deviceId: deviceId,
                    device_name: device
                }, 
                {
                    new: true
                })
            res.status(200).json({ message: 'Success!', data: {
                username: find.username,
                email: find.email,
                deviceId: find.deviceId,
                device_name: find.device_name,
                token: refreshToken(find.id)
            }})
        }else{
            res.status(404).json({ message: 'Email or Password invalid!' })
        }
    }else{
        res.status(404).json({ message: 'Email or Password invalid!' })

    }
   
})

//get Mentor
const getMentor = asyncHandler(async(req, res) => {
    const { id } = req.mentor
    const find = await Mentors.findById({ _id: id })
    if(!find){
        res.status(404).json({ message: 'User is nout find!' })
    }else{
        res.status(200).json({ message: 'Success!', data: find })
    }
})


//forgot password
var code = ''
var mas = new Array()
const forgotPassword = asyncHandler(async(req, res) => {
    const email = req.body.email
    const find = await Mentors.findOne({ email: email })
    mas.push(find.id)
    if(!find){
        res.status(403).json({ message: 'Email topilmadi' })
    }else{
        for(let i = 0; i < 4; i++){
            let generate = Math.floor(Math.random() * 4)
            code += generate
        }
        find.resetPassword = code
        find.codeExpires = Date.now() + 30 * 60 * 1000  //10 minut
        await find.save()

        let obj = {
            from: 'Acaademiya',
            to: find.email,
            subject: 'Forgot password code!🤐',
            text: code
        }
        serviceEmail(obj)
        code = ''
        obj = {}
        res.status(200).json({ message: 'Success' })
    }
})

//verify code
const verifyCode = asyncHandler(async(req, res) => {
    const { code } = req.body
    const findCode = await Mentors.findOne({
        resetPassword: code,
        codeExpires: { $gt: Date.now() } 
    })

    if(!findCode){
        res.status(404).json({ message: 'Code expired, pleace try again!' })
    }else{
        findCode.resetPassword = undefined
        await findCode.save()
        
        res.status(200).json({ message: 'Code true!' })
    }
})

//change password
const changePassword = asyncHandler(async(req, res) => {
    const { password } = req.body
    const updatePassword = await Mentors.findByIdAndUpdate(
    {
        _id: mas[0]
    },
    {
        password: password
    },
    {
        new: true
    })
    mas.length = 0
    res.status(200).json({ message: 'Password success changed!' })
})


//upload image
const uploadImg = asyncHandler(async(req, res) => {
    const { id } = req.mentor
        const uploader = (path) => upload(path, "image")
        const urls = []
        const files = req.files
        for(const file of files){
            const { path } = file
            const newPath = await uploader(path)
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        let app = urls.forEach(async(obj) => {
            const findProd = await Mentors.findByIdAndUpdate({
                _id: id
            },
            {
                image: obj.url
            }, 
            { new: true }
            )
        });
        
        res.status(200).json({ message: "Success!" })
   
    
})

const getMentorCourses = asyncHandler(async(req, res) => {
    const { id } = req.mentor
    const find = await Mentors.findById({ _id: id })
    if(find){
        res.status(200).json({ message: 'Success1!', data: find.lessons })
    }else{
        res.status(404).json({ message: "You don't have courses" })
    }
})


module.exports = { 
    regisMentor,
    login,
    getMentor,
    forgotPassword,
    verifyCode,
    changePassword,
    uploadImg,
    getMentorCourses,
    getStudets
}