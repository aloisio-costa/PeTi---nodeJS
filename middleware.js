const { serviceRequestSchema, petSitterSchema } = require('./schemas.js');
const { reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const ServiceRequest = require('./models/serviceRequest');
const PetSitter = require('./models/petSitter');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must sign in to perform this operation');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateRequest = (req, res, next) => {
    const {error} = serviceRequestSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)

    }else {
        next();
    }
}

module.exports.validateLover = (req, res, next) => {
    const {error} = petSitterSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log("é aqui meeesmo");
        throw new ExpressError(msg, 400)

    }else {
        next();
    }
}

module.exports.isRequestAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const request = await ServiceRequest.findById(id);
    if(!request.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to that!')
        return res.redirect(`/serviceRequests/${id}`);
    }
    next();
}

module.exports.isLoverAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const petSitter = await PetSitter.findById(id);
    if(!petSitter.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to that!')
        return res.redirect(`/petSitters/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to that!')
        return res.redirect(`/serviceRequests/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }else {
        next();
    }
}