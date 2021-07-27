const express = require('express');
const router = express.Router();
const serviceRequests = require('../controllers/serviceRequests');
const catchAsync = require('../utils/CatchAsync');
const { validateRequest, isLoggedIn, isRequestAuthor } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.get('/', catchAsync(serviceRequests.index));

router.get('/new', isLoggedIn, serviceRequests.renderNewForm);

router.post('/', isLoggedIn, upload.array('image'), validateRequest, catchAsync(serviceRequests.createServiceRequest));

router.get('/:id', catchAsync(serviceRequests.showServiceRequest));

router.get('/:id/edit', isLoggedIn, isRequestAuthor, catchAsync(serviceRequests.renderEditForm));

router.put('/:id', isLoggedIn, isRequestAuthor,  upload.array('image'), validateRequest, catchAsync(serviceRequests.updateServiceRequest));

router.put('/:id/apply', isLoggedIn,  upload.array('image'), catchAsync(serviceRequests.serviceRequestApplication));

router.delete('/:id', isLoggedIn, isRequestAuthor, catchAsync(serviceRequests.deleteServiceRequest));

module.exports = router;