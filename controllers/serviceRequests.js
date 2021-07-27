const ServiceRequest = require('../models/serviceRequest');
const PetSitter = require('../models/petSitter');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const helper = require('../utils/Helpers');
const { cloudinary } = require('../cloudinary');
const services =  ["Dog Walking", "Pet Daycare"];

//Index
module.exports.index = async (req, res) => {
    const requests = await ServiceRequest.find({});
    res.render('serviceRequests/index', { requests });
}

//Render new serviceRequest form
module.exports.renderNewForm = (req, res) => {
    res.render('serviceRequests/new', {services});
}

//Create New ServiceRequest
module.exports.createServiceRequest = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.serviceRequest.location,
        limit: 1
    }).send()
    const request = new ServiceRequest(req.body.serviceRequest);
    request.geometry = geoData.body.features[0].geometry;
    console.log(request.geometry);
    request.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    request.author = req.user._id;
    await request.save();
    //console.log(request);
    req.flash('success', 'successfully made a new serviceRequest!');
    res.redirect(`/serviceRequests/${request._id}`)
}

//show serviceRequest
module.exports.showServiceRequest = async (req, res,) => {
    const request = await ServiceRequest.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
        }    
    }).populate({
        path: 'applicants',
        populate: {
            path: 'reviews',
        }    
    }).populate('author');
    console.log(request);
    //console.log(req.user);
    if (!request) {
        req.flash('error', 'Cannot find that serviceRequest!');
        res.redirect('/serviceRequests');
    }
    res.render('serviceRequests/show', { request,})
}

//Render edit serviceRequest form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const request = await ServiceRequest.findById(id)
    if (!request) {
        req.flash('error', 'Cannot find that serviceRequest!');
        res.redirect('/serviceRequests');
    }
    res.render('serviceRequests/edit', { request, services })
}
//update serviceRequest 
module.exports.updateServiceRequest = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const request = await ServiceRequest.findByIdAndUpdate(id, { ...req.body.serviceRequest })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    request.images.push(...imgs);
    await request.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            //delete no cloudinary
            await cloudinary.uploader.destroy(filename);
        }
        //delete no mongo
        await request.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated serviceRequest!');
    res.redirect(`/serviceRequests/${request._id}`)
}

module.exports.serviceRequestApplication = async (req, res) => {
    const applicant = await PetSitter.findOne({"author": req.user._id});
    const request = await ServiceRequest.findById(req.params.id).populate({
        path: 'applicants'
    });
    request.applicants.push(applicant);
    //console.log(req.user._id);
    await request.save();
    req.flash('success', 'Applied successfully')
    res.redirect(`/serviceRequests/${request._id}`)
}

//delete serviceRequest
module.exports.deleteServiceRequest = async (req, res) => {
    const { id } = req.params;
    await request.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted serviceRequest!');
    res.redirect('/serviceRequests');
}