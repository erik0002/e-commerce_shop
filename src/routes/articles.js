const express = require('express');
const passport = require('passport');
const ArticlesService = require('../services/articles');
const ArticlesDBApi = require('../db/api/articles');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

router.post('/', passport.authenticate('jwt', {session: false}), async (req, res) => {
    await ArticlesService.create(req.body.data, req.currentUser, true, req.headers.referer);
    const payload = true;
    res.status(200).send(payload);
});

router.put('/:id', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
    await ArticlesService.update(req.body.data, req.body.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
}));

router.delete('/:id', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
    await ArticlesService.remove(req.params.id, req.currentUser);
    const payload = true;
    res.status(200).send(payload);
}));

router.get('/', wrapAsync(async (req, res) => {
    const payload = await ArticlesDBApi.findAll(
        req.query,
    );

    res.status(200).send(payload);
}));

router.get('/autocomplete', async (req, res) => {
    const payload = await ArticlesDBApi.findAllAutocomplete(
        req.query.query,
        req.query.limit,
    );

    res.status(200).send(payload);
});

router.get('/:id', wrapAsync(async (req, res) => {
    const payload = await ArticlesDBApi.findBy(
        { id: req.params.id },
    );

    res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);

module.exports = router;
