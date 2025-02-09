const joi = require('joi')

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        descrtiption: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().required().min(0),
        image: joi.string().allow("",null)
    }).required()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating:joi.number().min(1).max(5).required(),
        comment: joi.string().required(),
    }).required()
})
