
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser=require('body-parser')
const mongoose=require('mongoose')

const eventsRoutes = require('./api/routes/events');
const user = require('./Api/routes/user')


//log data
app.use(morgan('dev'));

// parsing post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Middleware
app.use('/events', eventsRoutes);
app.use(user)

// Erroe handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

// env var at email file , user controller genauthTok, auth,js