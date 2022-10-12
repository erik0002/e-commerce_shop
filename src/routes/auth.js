const express = require('express');
const passport = require('passport');
const AuthService = require('../services/auth');
const ForbiddenError = require('../services/notifications/errors/forbidden');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

router.put('/password-reset', wrapAsync(async (req, res) => {
    const payload = await AuthService.passwordReset(req.body.token, req.body.password, req,);
    res.status(200).send(payload);
}));

router.put('/password-update', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
    const payload = await AuthService.passwordUpdate(req.body.currentPassword, req.body.newPassword, req);
    res.status(200).send(payload);
}));

router.post('/send-email-address-verification-email', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
    if (!req.currentUser) {
        throw new ForbiddenError();
    }

    await AuthService.sendEmailAddressVerificationEmail(req.currentUser.email);
    const payload = true;
    res.status(200).send(payload);
}));

router.post('/send-password-reset-email', wrapAsync(async (req, res) => {
    await AuthService.sendPasswordResetEmail(req.body.email, 'register', req.headers.referer);
    const payload = true;
    res.status(200).send(payload);
}));

router.post('/signin/local', wrapAsync(async (req, res) => {
    const payload = await AuthService.signin(req.body.email, req.body.password, req.body.isOnline, req,);
    res.status(200).send(payload);
}));

router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const payload = await AuthService.signup(req.body.email, req.body.password, req.body.phoneNumber, req, req.headers.referer)
        res.status(200).send(payload);
    } catch (e) {
        console.error(e);
    }
}));

router.post('/logout', wrapAsync( async(req, res) => {
    const payload = await AuthService.logoutUser(req.body.email);
    res.status(200).send(payload);
}));

router.get('/logout', function(req, res){
    res.redirect('');
});

router.post('/password-reset', wrapAsync(async (req, res) => {
    const payload = await AuthService.password_reset(req.body.email, req.body.password, req, req.headers.referer)
    res.status(200).send(payload);
}));

router.put('/profile', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
    if (!req.currentUser || !req.currentUser.id) {
        throw new ForbiddenError();
    }

    await AuthService.updateProfile(req.body.profile, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
}));

router.put('/verify-email', wrapAsync(async (req, res) => {
    const payload = await AuthService.verifyEmail(req.body.token, req, req.headers.referer)
    res.status(200).send(payload);
}));


module.exports = router;
