const express = require('express');
const router = express.Router();
const petSitter = require('../controllers/petSitter');
const catchAsync = require('../utils/CatchAsync');
const { validateLover, isLoggedIn, isLoverAuthor} = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.get('/', catchAsync(petSitter.index));

router.get('/new', isLoggedIn, petSitter.renderNewForm);

router.post('/', isLoggedIn, upload.array('image'), validateLover, catchAsync(petSitter.createPetSitter));

router.get('/:id', catchAsync(petSitter.showPetSitter));

router.get('/:id/edit', isLoggedIn, isLoverAuthor, catchAsync(petSitter.renderEditForm));

router.put('/:id', isLoggedIn, isLoverAuthor, upload.array('image'), validateLover, catchAsync(petSitter.updatePetSitter));

router.delete('/:id', isLoggedIn, isLoverAuthor, catchAsync(petSitter.deletePetSitter));

module.exports = router;