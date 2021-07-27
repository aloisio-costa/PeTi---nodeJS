const PetSitter = require('../models/petSitter');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');
const { updateServiceRequest } = require('./serviceRequests');

//Index
module.exports.index = async (req, res) => {
    const petSitters = await PetSitter.find({});
    res.render('petSitters/index', { petSitters });
}

//Render new petSitter form
module.exports.renderNewForm = (req, res) => {
    res.render('petSitters/new');
}

//Create New PetSitter
module.exports.createPetSitter = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.petSitter.location,
        limit: 1
    }).send()
    const petSitter = new PetSitter(req.body.petSitter);
    petSitter.geometry = geoData.body.features[0].geometry;
    console.log(petSitter.geometry);
    petSitter.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    petSitter.author = req.user._id;
    await petSitter.save();
    req.flash('success', 'Your Profile is set');
    res.redirect(`/petSitters/${petSitter._id}`)
}

//show petSitter
module.exports.showPetSitter = async (req, res,) => {
    const petSitter = await PetSitter.findById(req.params.id).populate({
        path: ' reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!petSitter) {
        req.flash('error', 'Cannot find that Pet Lover!');
        res.redirect('/petSitters');
    }
    res.render('petSitters/show', { petSitter })
}

//Render edit petSitter form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const petSitter = await PetSitter.findById(id)
    if (!petSitter) {
        req.flash('error', 'Cannot find that Pet Lover!');
        res.redirect('/petSitters');
    }
    res.render('petSitters/edit', { petSitter })
}
//update petSitter 
module.exports.updatePetSitter = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const petSitter = await PetSitter.findByIdAndUpdate(id, { ...req.body.petSitter })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    petSitter.images.push(...imgs);
    await petSitter.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            //delete no cloudinary
            await cloudinary.uploader.destroy(filename);
        }
        //delete no mongo
        await petSitter.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Your Profile has been Updated!');
    res.redirect(`/petSitters/${petSitter._id}`)
}
//delete petSitter
module.exports.deletePetSitter = async (req, res) => {
    const { id } = req.params;
    await PetSitter.findByIdAndDelete(id);
    req.flash('success', 'Your profile has been deleted!');
    res.redirect('/petSitters');
}