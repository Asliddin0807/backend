//database
const Client = require('../models/clients')
const Categories = require('../models/categories')
const Mentors = require('../models/mentors')
const Courses = require('../models/courses')
const Promokod = require('../models/promokod')

//packages
const asyncHandler = require('express-async-handler')
const useragent = require('express-useragent')
const { v4: uuidv4 } = require('uuid');
const { createToken, refreshToken } = require('../config/createToken')
const serviceEmail = require('../utils/nodemailer')
const { upload } = require('../utils/cloudinary')
const fs = require('fs')



//registration 
const regisUser = asyncHandler(async(req, res) => {
    const { username, email, password } = req.body
    const promocod = await Promokod.findOne({})
    const find = await Client.findOne({
        username: username,
        email: email
    })
    if(find){
        res.status(403).json({ message: 'User is already exists!' })
    }else{
        const date = new Date()
        // functions
        function generateRandomCharacter() {
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var randomIndex = Math.floor(Math.random() * characters.length);
            return characters.charAt(randomIndex);
        }
        
        function generatePromoCode(length) {
            var promoCode = '';
            for (var i = 0; i < length; i++) {
                promoCode += generateRandomCharacter();
            }
            return promoCode;
        }
        var promoCode = generatePromoCode(8);
        let month = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktbr', 'Noyabr', 'Dekabr', ]      
        const findPromo = await Promokod.findOne({})
        if(findPromo){
            const addPromo = await Promokod.updateOne({
                $push: {
                    promokods: [{
                        promokod: promoCode,
                        user: email,
                        price: 100000,
                        date: `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
                    }]
                }
            })
        }else{
            const createNewCode = await Promokod.create({
                promokods: [{
                    promokod: promoCode,
                    user: email,
                    price: 100000,
                    date: `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
                }]
            })
        }
        let deviceId = uuidv4()
        let device_name = req.headers['user-agent']
        const create = new Client({
            username: username,
            email: email,
            password: password,
            deviceId: deviceId,
            device_name: device_name,
        })
        let prom = {
            promoCode: promoCode,
            price: 100,
            date: `${date.getDate()} ${month[date.getMonth()]} ${date.getFullYear()}`
        }
        create.promocod.push(prom)
        await create.save()
        res.status(200).json({ message: 'Success', data: {
            username: create.username,
            email: create.email,
            password: create.password,
            deviceId: deviceId,
            device_name: device_name,
            promocod: create.promocod,
            token: createToken(create.id)
        }})

        for(let prop in prom){
            delete prom[prop]
        }
    }
})

//login 
const login = asyncHandler(async(req, res) => {
    const { email, password } = req.body
    
    const find = await Client.findOne({
        email: email
    })
    if(find){
        const findPassword = await Client.findOne({
            password: password
        })
        if(findPassword){
            let deviceId = uuidv4()
            let device = req.headers['user-agent']
            const findskiy = await Client.findByIdAndUpdate(
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

//get User
const getUser = asyncHandler(async(req, res) => {
    const { id } = req.user
    const find = await Client.findById({ _id: id })
    if(!find){
        res.status(404).json({ message: 'User is nout find!' })
    }else{
        res.status(200).json({ message: 'Success!', data: { find }})
    }
})


//forgot password
var code = ''
var mas = new Array()
const forgotPassword = asyncHandler(async(req, res) => {
    const email = req.body.email
    const find = await Client.findOne({ email: email })
    if(!find){
        res.status(403).json({ message: 'Email is not defined!' })
    }else{
        mas.push(find)
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
    const findCode = await Client.findOne({
        resetPassword: code,
        // codeExpires: { $gt: Date.now() } 
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
    let app = mas.find(text => text._id)
    
    const updatePassword = await Client.findByIdAndUpdate(
    {
        _id: app._id
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
    const { id } = req.user
    try{
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
            const findProd = await Client.findByIdAndUpdate({
                _id: id
            },
            {
                image: obj.url
            }, 
            { new: true }
            )
        });

        res.status(200).json({ message: "Success!" })
    }catch(err){
        res.status(400).json({ message: 'Failed!' })
    }
    
})

//get mentors 
const getMentors = asyncHandler(async(req, res) => {
    const { mentor_name } = req.body
    const findMentors = await Mentors.findOne({ username: mentor_name })
    if(findMentors){
        res.status(200).json({ message: 'Success!', data: findMentors })
    }else{
        res.status(404).json({ message: 'This mentor nout find!' })
    }
})

//get categories
const getCategories = asyncHandler(async(req, res) => {
    const { category } = req.params
    const find = await Categories.findOne({ directionsId: 1227192 })
    const findOne = find.directions.find(text => text.title === category)
    if(findOne){
        const findFromCateg = await Courses.findOne()
        findFromCateg.courses.find(text => text.course_category == findOne)
        res.status(200).json({ message: 'Success!', data: findFromCateg })
    }else{
        res.status(404).json({ message: 'Failed!' })
    }
})


//get mentor profile
const getMentorProfile = asyncHandler(async(req, res) => {
    const { mentor_name } = req.params
    const find = await Mentors.findOne({ username: mentor_name })
    if(find){
        res.status(200).json({ message: 'Success!', data: {
            username: find.username,
            email: find.email,
            image: find.image,
            directions: find.directions,
            students: find.studets,
            lessons: find.lessons,
        }})
    }else{
        res.status(404).json({ message: 'Failed!' })
    }
})

const getAllMentors = asyncHandler(async(req, res) => {
    const find = await Mentors.find()
    if(find){
        res.status(200).json({ message: 'Success', data: find })
    }else{
        res.status(404).json({ message: 'Failed!' })
    }
})

//get all courses 
const getAllCourses = asyncHandler(async(req, res) => {
    const find = await Courses.find()
    let mas = find.flatMap(text => text.courses.map(item => { return item }))
    if(find){
        res.status(200).json({ data: mas})
    }else{
        res.status(404).json({ message: 'Failed!' })
    }
})


const getAllCategories = asyncHandler(async(req, res) => {
    const find = await Categories.find()
    if(find){
        res.status(200).json({ message: 'Success', data: find })
    }else{
        res.status(404).json({ message: "Failed!" })
    }
})


//comments
const comments = asyncHandler(async(req, res) => {
    const { id } = req.user
    const { course_id, mentor } = req.query
    const { comment } = req.body
    const find = await Client.findById({ _id: id })
    if(find){
        const description = await Courses.findOne({
            mentorId: mentor
        })
        let app = description.courses.find(text => text._id == course_id)
        if(app){
            let date = new Date()
            let month = [ '0', 'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Sentabr', 'Oktbr', 'Noyabr', 'Dekabr',  ]
            let applic = month[date.getMonth()]
            let calendar = `${date.getDate()} ${applic} ${date.getFullYear()} ` + 'yil'
            let clock = `${date.getHours()}:${date.getMinutes()}`
            let obj = {
                comment: comment,
                postedby: find.username,
                date: calendar,
                clock: clock
            }
            app.rating.unshift(obj)
            obj =  {}
            await description.save()
            res.status(200).json({ message: 'success', data: app })
        }else{
            res.status(404).json({ message: 'This mentor is not defined!' })
        }
    }else{
        res.status(404).json({ message: 'Pleace sign in!' })
    }
})

let getCourseComment = asyncHandler(async(req, res) => {
    const { course_id, mentor } = req.query
    const find = await Courses.find()
    const description = await Courses.findOne({
        mentorId: mentor
    })
    let app = description.courses.find(text => text._id == course_id)
    if(app){ 
        res.status(200).json({ message: 'Success', data: app.rating })
    }else{
        res.status(404).json({ message: 'Not found!' })
    }
})
 
//get course 
const getCourse = asyncHandler(async(req, res) => {
    const { course_name } = req.query
    const find = await Courses.findOne({
        courses: {
            $elemMatch: {
                course_name: course_name
            }
        }
    })
    const app = find.courses.find(text => text.course_name == course_name)
    if(app){
        res.status(200).json({ message: 'Success', data: app, mentor: find.mentorId })
    }else{
        res.status(404).json({ message: 'Failure!' })
    }
})

//add my favourites 
const addFavourite = asyncHandler(async(req, res) => {
    const { id } = req.user
    const { course_id } = req.params
    const find = await Client.findById({ _id: id })
    if(find){
        const findCourse = await Courses.findOne({})
        const applic = findCourse.courses.find(text => text._id == course_id)
        if(applic){
            const already = find.myFavorites.find(text => text._id == course_id)
            if(already){
                res.status(403).json({ message: 'Course alredy added!' })
            }else{
                let users = find.myFavorites.push(applic)
                await find.save()
                res.status(200).json({ message: 'Success', data: users })
            }
            
        }else{
            res.status(404).json({ message: 'Failed' })
        }
    }else{
        res.status(404).json({ message: "User is not defined!"  })
    }
})


//get user favourites 
const getFavourites = asyncHandler(async(req, res) => {
    const { id } = req.user
    const findUser = await Client.findById({ _id: id})
    if(findUser){
        res.status(200).json({ message: 'Success!', data: findUser.myFavorites})
    }else{
        res.status(404).json({ message: "Please sign in or sign up!" })
    }
})


const getMentorCourses = asyncHandler(async(req, res) => {
    const { mentorId } = req.params
    const find = await Courses.findOne({ mentorId: mentorId })
    if(find){
        let app;
        for(let i = 0; i < find.courses.length; i++){
            app = find.courses[i]
        }
        res.status(200).json({ message: 'Success!', data: app, mentor: find.mentorId })
    }else{
        res.status(404).json({ message: 'Failed!' })
    }
    
})

const getUserPromocodes = asyncHandler(async(req, res) => {
    const { id } = req.user
    const find = await Client.findById({ _id: id })
    if(find){
        const code = find.promocod
        res.status(200).json({ message: 'Success!', data: code })
    }else{
        res.status(404).json({ message: 'Pleace log in or sign up!' })
    }
})

const sale = asyncHandler(async(req, res) => {
    const { id } = req.user
    const { course_id } = req.params
    const { promocode } = req.body
    const findUser = await Client.findById({ _id: id })
    if(find){
        const findCourse = findUser.myFavorites.find(text => text._id == course_id)
        if(findCourse){
            const prom = await Promokod.findOne()
            const app = prom.promokods.find(text => text.promokod == promocode && text.user == findUser.username)
            if(app){
                findUser.myFavorites.filter(text => text.course_price - app.price)
                await findUser.save()
                res.status(200).json({ message: "Success!" })
            }else{
                res.status(404).json({ message: 'Promocode is not defined!' })
            }
        }
    }else{
        res.status(404).json({ message: 'Pleace sign in or sign up!' })
    }
})

//follow in mentor 
const following = asyncHandler(async(req, res) => {
    const { id } = req.user
    const { mentor_name } = req.params
    const find = await Client.findById({ _id: id })
    if(find){
        const mentor = await Mentors.findOne({ username: mentor_name })
        if(mentor){
            let obj = {
                email: find.email,
                username: find.username
            }
            const follow = mentor.studets.push(obj)
            await mentor.save()
            res.status(200).json({ message: 'Success' })
        }else{
            res.status(404).json({ message: 'Mentor is not defined!' })
        }
    }
})


//unfollowing
const unFollowing = asyncHandler(async(req, res) => {
    const { id } = req.user
    const { mentor_name } = req.params
    const findUser = await Client.findById({ _id: id })
    if(findUser){
        const findMentor = await Mentors.findOne({ username: mentor_name })
        if(findMentor){
            const unFollow = findMentor.studets.findIndex(text => text.email === findUser.email && text.username === findUser.username)
            if(unFollow !== -1){
                findMentor.studets.splice(unFollow, 1)
                await findMentor.save()
                res.status(200).json({ message: 'Success' })
            }
        }else{
            res.status(404).json({ message: 'Mentor is not defined!' })
        }
    }
})

// get following users 
const getFollowingUsers = asyncHandler(async(req, res) => {
    const { mentor_name } = req.params
    const find = await Mentors.findOne({ username: mentor_name })
    if(find){
        res.status(200).json({ message: 'Success!', data: find.studets })
    }else{
        res.status(404).json({ message: 'Failed' })
    }
})

//getAllCategories

module.exports = { 
    regisUser,
    login,
    getUser,
    forgotPassword,
    verifyCode,
    changePassword,
    uploadImg,
    getMentors,
    getCategories,
    getAllMentors,
    getAllCourses,
    getMentorProfile,
    getAllCategories,
    comments,
    getCourse,
    getCourseComment,
    addFavourite,
    getFavourites,
    getMentorCourses,
    getUserPromocodes,
    following,
    unFollowing,
    getFollowingUsers
}