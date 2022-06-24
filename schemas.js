const baseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) => ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapedHTML': '{{#label}} must not include HTML!',
  },
  rules: {
    escapedHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error('string.escapedHTML', { value });
        return clean;
      },
    },
  },
});

const Joi = baseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapedHTML(),
    location: Joi.string().required().escapedHTML(),
    price: Joi.number().required().min(0),
    description: Joi.string().required().escapedHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    body: Joi.string().required().escapedHTML(),
  }).required(),
});
