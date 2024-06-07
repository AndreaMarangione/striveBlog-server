const express = require('express');
const OAuth = express.Router();
const passport = require('passport');

OAuth.get('/auth/googleLogin', passport.authenticate('google', { scope: ['profile', 'email'] }));

OAuth.get('/auth/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    function (req, res) {
        console.log(req.user.token);
        res.redirect(`${process.env.CLIENT_URL}?T=${req.user.token}`);
    });

module.exports = OAuth;
