const Client = require('../models/clients')
const Categories = require('../models/categories')
const Courses = require('../models/courses')
const Mentors = require('../models/mentors')

//add package 
const asyncHandler = require('express-async-handler')
const { upload } = require('../utils/cloudinary')
const { uploadVideo } = require('../utils/videoCloud')
const fs = require('fs')
const cloudinary = require('cloudinary').v2 

//add course
const addCourse = asyncHandler(async(req, res) => {
    const {
        mentor_name, 
        lesson_number, 
        course_name, 
        course_description, 
        course_price,
        course_category 
    } = req.body
    const { id } = req.admin
    const findMentor = await Mentors.findOne({ username: mentor_name })
    const findCateg = await Categories.findOne({ directionsId: 1227192 })
    const finds = findCateg.directions.find(text => text.title === course_category)
    if(!finds){
        res.status(404).json({ message: 'This category is not defined!' })
    }
    if(findMentor){
        const find = await Client.findOne({ _id: id })
        if(find){       
            const course = await Courses.findOne({ mentorId: mentor_name })
            if(!course){
                var addCourse = await Courses.create({
                    mentorId: mentor_name,
                    courses: [{
                        lesson_number: lesson_number,
                        course_name: course_name,
                        course_description: course_description,
                        course_price: course_price, 
                        course_category: finds.title,
                    }]
                })
            res.status(200).json({ message: 'Success1!'})
            }else{
                const create = await Courses.findOneAndUpdate(
                    {
                        mentorId: mentor_name
                    },
                    {
                        $push: {
                            courses: [{
                                lesson_number: lesson_number,
                                course_name: course_name,
                                course_description: course_description,
                                course_price: course_price, 
                                course_category: finds.title,
                            }]
                        }
                    },
                    {
                        new: true
                    }
                )
                res.status(200).json({ message: 'Success2!'})
            }
        }else{
            res.status(404).json('You are not a admin!')
        }
    }else{
        res.status(404).json({ message: 'Mentor is not defined!' })
    }
    
})

const uploadImg = asyncHandler(async(req, res) => {
    const { id } = req.admin
    const { mentor_name, lesson_number } = req.body
    const findAdmin = await Client.findById({ _id: id })
    if(findAdmin){
        const find = await Courses.findOne({ mentorId: mentor_name })
        if(find){
            const uploader = (path) => upload(path, 'media')
            const files = req.files
            const urls = []
            for(let file of files){
                const { path } = file
                const newPath = await uploader(path)
                urls.push(newPath)
                fs.unlinkSync(path)
            }
            var url;
            urls.forEach(obj => {
                url = obj.url
            })
            const uploadingImage = find.courses.find(obj => obj.lesson_number == lesson_number)
            if(uploadingImage){
                const update = find.courses.find(obj => obj.course_image = url)    
                await find.save()
                urls.length = 0
                res.status(200).json({ message: update })
            }else{
                res.status(404).json({ message: 'Lesson number is not defined!' })
            }
        }

    }else{
        res.status(404).json({ message: 'Are you not admin!' })
    }
})

const uploadVideos = asyncHandler(async(req, res) => {
    const { id } = req.admin
    const { mentor_name, lesson_number } = req.body
    const findAdmin = await Client.findById({ _id: id })
    if(findAdmin){
        const findMentor = await Courses.findOne({ mentorId: mentor_name })
        if(findMentor){
            let videoUrl = '';
           cloudinary.uploader.upload(req.file.path, {
                resource_type: 'video'
           })
           .then(async(result) => {
               const findLesson = findMentor.courses.find(obj => obj.lesson_number == lesson_number)
               if(!findLesson){
                   res.status(404).json({ message: 'Lesson not defined!' }) 
               }else{
                   //save to base
                   const sendToBase = findMentor.courses.find(obj => obj.course_video = result.secure_url)
                   await findMentor.save()
                   res.status(200).json({ message: 'Success!', base: sendToBase })
               }
            }).catch((er) => {
                res.status(500).json({ message: er})
            })
     }else{
         res.status(404).json({ message: 'Mentor is not defined!' })
     }
    }else{
        res.status(404).json({ message: 'Are you not Admin!' })
    }
})

module.exports = {
    addCourse,
    uploadImg,
    uploadVideos
}