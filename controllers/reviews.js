const PetSitter = require('../models/petSitter');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const petSitter = await PetSitter.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    petSitter.reviews.push(review);
    await review.save();
    await petSitter.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/petSitters/${petSitter._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await PetSitter.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review successfully deleted!')
    res.redirect(`/petSitters/${id}`);
}
