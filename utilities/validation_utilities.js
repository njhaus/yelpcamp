import Joi from "joi";
import sanitizeHtml from 'sanitize-html';

import Review from "../models/reviews.js";
import User from "../models/user.js";

// Joi validataion
export class AppError extends Error {
    constructor(message, status) {
        super();
        this.message = message,
        this.status = status
    }
}

// sanitize-html extension for strings
const extension = Joi.extend((joi) => {
    return {
        type: 'string',
        base: Joi.string(),
        messages: {
            'string.cleanHtml': '{{#label}} may not contain html.'
        },
        rules: {
            cleanHtml: {
                validate(value, helpers) {
                    const clean = sanitizeHtml(value, {
                        allowedTags: [],
                        allowedAttributes: {},
                        allowedIframeHostnames: []
                    })
                    if (clean !== value) return helpers.error('string.cleanHtml');
                    return value;
                }
            }
        }
    }
})

// Joi validation schema
export const campgroundValidation = extension.object({
  title: extension.string().min(3).max(50).required().cleanHtml(),
  city: extension.string().cleanHtml().min(1).max(30),
  state: extension.string().cleanHtml().min(1).max(30),
    geocode: extension.object({
        type: extension.string().cleanHtml(),
        coordinates: Joi.array()
  }),
  description: extension.string().cleanHtml().min(10).max(2000).required(),
  price: Joi.number().min(0).max(1000).required(),
});

export const reviewValidation = extension.object({
    review: extension.object({
        rating: Joi.number().min(1).max(5).required(),
        text: extension.string().cleanHtml().max(2000).min(10).required(),
    })
})

export const userValidation = extension.object({
  username: extension.string().cleanHtml().min(4).max(20).required(),
  email: extension.string().cleanHtml().email(),
    password: extension.string().cleanHtml().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$")),
    trusted: extension.string()
});



export const validateCampground = (req, res, next) => {
    console.log(req.body);
    const result = campgroundValidation.validate(req.body, {allowUnknown: true});
    if (result.error) {
        const errMsg = result.error.details.map(item => item.message).join(', ');
        req.flash('error', errMsg);
        res.redirect(req.originalUrl);
    }
    else {
        next();
    }
}

export const validateReview = (req, res, next) => {
    const { error, value } = reviewValidation.validate(req.body);
    const id = req.params.id;
    if (error) {
        let errMsg = error.details.map(item => item.message).join(', ');
        if(errMsg.match('rating')) errMsg = 'Please provide a rating.';
        req.flash("error", errMsg);
        res.redirect(`/campgrounds/${id}`);
    }
    else {
        next();
    }
}

export const validateUser = (req, res, next) => {
    const result = userValidation.validate(req.body);
    if (result.error) {
      console.log(result.error);
      let errMsg = result.error.details
        .map((item) => item.message)
          .join(", ");
        if (errMsg.match('"password" with value')) errMsg = 'Your password must contain at least 1 capital letter, 1 lowercase letter, and 1 number or special character.';
        req.flash('error', errMsg)
        res.redirect('/login/register');
    } else {
      next();
    }
}

// Login check with passport -- triggered by any /auth route
export const verifyAuth = (req, res, next) => {
  const path = req.originalUrl;
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "You must be logged in to complete this action.");
    res.redirect(`/login?path=${path}`);
  }
}; 

// check that user is logged in and review is theirs before edit/delete
export const authorizeReview = async (req, res, next) => {
  const campgroundId = req.params.id;
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId);
  const getUser = await User.findById(req.user._id);
  if (getUser.username === review.user) {
    next();
  } else {
    req.flash("Operation on review could not be completed.");
    res.redirect(`/campgrounds/${campgroundId}`);
  }
};
