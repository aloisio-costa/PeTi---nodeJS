const User = require('../models/user');
const userType =  ["Request Service", "Pet Sit"];

module.exports.renderRegister = (req, res) => {
    res.render('users/register', {userType});
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, userType } = req.body;
        const user = new User({ email, username, userType });
        const registedUser = await User.register(user, password);
        req.login(registedUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to PeTi\'s!');
            res.redirect('/serviceRequests');
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = req.session.returnTo || '/serviceRequests';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/serviceRequests');
}