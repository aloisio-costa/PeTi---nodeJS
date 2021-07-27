const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})
//Thumbnail - a request of a image with a specific size from cloudinary 
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = {toJSON: {virtuals: true}};

const ServiceRequestSchema = new Schema({

    petname: String,

    pettype: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    service: {
        type: String,
        required: true,
        emun: ['Dog Walking','Pet Daycare']
    },

    images: [ImageSchema],

    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    description: String,

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    applicants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'PetSitter'
        }
    ], 
}, opts);

//schema para dar delete a imagens
ServiceRequestSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('ServiceRequest', ServiceRequestSchema);
