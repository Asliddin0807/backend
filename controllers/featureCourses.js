const asyncHandler = require('express-async-handler')
const Feature = require('../models/featureCours')
const Courses = require('../models/courses')
const Categories = require('../models/categories')
const Mentors = require('../models/mentors')
const Client = require('../models/clients')

//packages
const { upload } = require('../utils/cloudinary')
const fs = require('fs')
const cloudinary = require('cloudinary').v2 

//create Feature course
const createFeature = asyncHandler(async(req, res) => {
    const {
        mentor_name, 
        course_name, 
        course_description, 
        course_price,
        course_category,
        duration 
    } = req.body
    const { id } = req.admin
    const findMentor = await Mentors.findOne({ username: mentor_name })
    const findCateg = await Categories.findOne({ directionsId: 1227192 })
    const finds = findCateg.directions.find(text => text.title == course_category)
    //upload image ---------------------------------
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
    //---------------------------------------------
    if(!finds){
        res.status(404).json({ message: 'This category is not defined!' })
    }
    if(findMentor){
        const find = await Client.findOne({ _id: id })
        if(finds){       
            const course = await Feature.findOne({ mentorId: mentor_name })
            let obj = {
                course_name: course_name,
                course_description: course_description,
                course_price: course_price, 
                course_category: finds.title,
                duration: duration,
                course_image: url
            }

            let addLesson = findMentor.featureCourses.push(obj)
            await findMentor.save()
            obj = {}
            if(!course){
                var addCourse = await Feature.create({
                    mentorId: mentor_name,
                    courses: [{
                        course_name: course_name,
                        course_description: course_description,
                        course_price: course_price, 
                        course_category: finds.title,
                        duration: duration,
                        course_image: url
                    }]
                })
            res.status(200).json({ message: 'Success!'})
            }else{
                const create = await Feature.findOneAndUpdate(
                    {
                        mentorId: mentor_name
                    },
                    {
                        $push: {
                            courses: [{
                                course_name: course_name,
                                course_description: course_description,
                                course_price: course_price, 
                                course_category: finds.title,
                                duration: duration
                            }]
                        }
                    },
                    {
                        new: true
                    }
                )
                res.status(200).json({ message: 'Success!'})
            }
        }else{
            res.status(404).json('You are not a admin!')
        }
    }else{
        res.status(404).json({ message: 'Mentor is not defined!' })
    }
})

// delete feature by id
const deleteFaeture = asyncHandler(async(req, res) => {
    const { id } = req.admin
    const { mentor_name, feature_id } = req.query
    const find = await Client.findById({ _id: id })
    if(find){
        const deleteById = await Feature.updateOne(
            {
                'mentorId': mentor_name,
            },
            {
                $pull: {
                    'courses': {
                        '_id': feature_id
                    }
                }
            }
        )

        res.status(200).json({ message: 'Success deleted!' })
    }else{
        res.status(404).json({ message: 'Are you not admin!'})
    }
})

// uploading image
const uploadImg = asyncHandler(async(req, res) => {
    const { id } = req.admin
    const { mentor_name, course_id } = req.body
    const findAdmin = await Client.findById({ _id: id })
    if(findAdmin){
        const find = await Feature.findOne({ mentorId: mentor_name })
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
            const uploadingImages = await Feature.findOneAndUpdate({
                mentorId: mentor_name
            })
            const uploadingImage = find.courses.find(obj => obj._id == course_id)
            if(uploadingImage){
                const update = uploadingImage.course_image = url
                const mentors = await Mentors.findOne({
                    username: mentor_name
                })
                mentors.featureCourses.push(uploadingImage)
                await find.save()
                await mentors.save()
                urls.length = 0
                res.status(200).json({ message: 'Success!' })
            }else{
                res.status(404).json({ message: 'Lesson number is not defined!' })
            }
        }

    }else{
        res.status(404).json({ message: 'Are you not admin!' })
    }
})

module.exports = {
    createFeature,
    deleteFaeture,
    uploadImg
}