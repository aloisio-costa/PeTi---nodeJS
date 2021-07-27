const Joi = require('joi');
//Authentication from server side.
module.exports.serviceRequestSchema =  Joi.object({
    serviceRequest: Joi.object({
        location: Joi.string().required(),
        petname: Joi.string(),
        pettype: Joi.string().required(),
        description: Joi.string(),
        service: Joi.string().required()
    }).required(),
    //para poder dar delete a imagens
    deleteImages: Joi.array()
});

module.exports.petSitterSchema =  Joi.object({
    petSitter: Joi.object({
        title: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required(),
        description: Joi.string().required()
    }).required(),
    //para poder dar delete a imagens
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})


