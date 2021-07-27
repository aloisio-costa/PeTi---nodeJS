const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

//from passport nugget: check if login was successfull
const passportAuthenticate = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'})

router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login', passportAuthenticate, users.login);

router.get('/logout', users.logout);

module.exports = router