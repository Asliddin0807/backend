const Categories = require('../models/categories')
const asyncHandler = require('express-async-handler')


const addCategories = asyncHandler(async(req, res) => {
    const { title } = req.body
    const find = await Categories.findOne({
        directionsId: 1227192
    })
    if(!find){
        const addCateg = new Categories({ 
            directionsId: 1227192,
            directions: [{
                title: title
            }]
        })
        
        await addCateg.save()
        res.status(200).json({ message: 'Created' })
    }else{
        const direction = await Categories.findOneAndUpdate(
            {
                directionsId: 1227192
            },
            {
                $push: {
                    directions: [{
                        title: title
                    }]
                }
            },
            {
                new: true
            }
        )
        res.status(200).json({ message: 'Created' })
        
    }
}) 


module.exports = {
    addCategories
}