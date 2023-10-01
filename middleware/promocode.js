const Promokod = require('../models/promokod')
const asyncHandler = require('express-async-handler')

const isPromocode = asyncHandler(async(req, res, next) => {
    const { promo } = req.body
    const find = await Promokod.findOne({
        'promokods.promokod': promo
    })

    if(find){
        req.promo = find
        next()
    }else{
        res.status(400).json({ message: 'Promocode is not defined!' })
    }
})

module.exports = { isPromocode }