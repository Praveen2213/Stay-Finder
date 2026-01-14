//request validation middleware
const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(1),
        image: Joi.object({
                url: Joi.string().allow("", null)
                    }).optional()
    }).required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

const userSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const userLoginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

module.exports = {
    reviewSchema,
    listingSchema,
    userSignupSchema,
    userLoginSchema
};