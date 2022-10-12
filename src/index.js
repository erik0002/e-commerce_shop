const express = require('express');
const app = express();
const cors = require('cors');
const db = require('./db/models');

const authRoutes = require('./routes/auth');
const articlesRoutes = require('./routes/articles');
const usersRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);

app.use('/api/users', usersRoutes);

app.use('/api/articles', articlesRoutes);


app.use(cors());



function logErrors(err, req, res, next) {
    console.error(err.message, err.stack);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something went wrong!'});
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);


const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function() {
    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
});

module.exports = app;

