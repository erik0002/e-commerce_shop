const express = require('express');
const passport = require('passport');
const UsersService = require('../services/users');
const UsersDBApi = require('../db/api/users');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await UsersService.create(req.body.data, req.currentUser, true, req.headers.referer);
    const payload = true;
    res.status(200).send(payload);
});

router.post('/create', async (req, res) => {
    await UsersService.create(req.body.data, true, req.headers.referer);
    const payload = true;
    res.status(200).send(payload);
});

router.put('/:id', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
    await UsersService.updateFormData(req.body.data, req.body.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
}));

router.put('/verify/:id', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
    await UsersService.update(req.body.data, req.body.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
}));


router.delete('/:id', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
    await UsersService.remove(req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
}));

router.get('/', wrapAsync(async (req, res) => {
    const payload = await UsersDBApi.findAll(
        req.query,
    );
    res.status(200).send(payload);
}));

router.get('/autocomplete', async (req, res) => {
    const payload = await UsersDBApi.findAll(
        req.query.query,
        req.query.limit,
    );

    res.status(200).send(payload);
});

router.get('/:id', wrapAsync(async (req, res) => {
    const payload = await UsersDBApi.findBy(
        { id: req.params.id },
    );

    res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
