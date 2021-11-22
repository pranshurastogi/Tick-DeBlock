const express = require('express');
const router = express.Router();
const Event=require('../models/events');
const mongoose=require('mongoose')

// Handle incoming GET requests to /orders
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Events  fetched'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Events  created'
    });
});

router.get('/:eventId', (req, res, next) => {
    res.status(200).json({
        message: 'Event details',
        eventId: req.params.eventId
    });
});

router.patch('/:eventId', (req, res, next) => {
    res.status(200).json({
        message: 'Event updated',
        eventId: req.params.eventId
    });
});


router.delete('/:eventId', (req, res, next) => {
    res.status(200).json({
        message: 'Event deleted',
        eventId: req.params.eventId
    });
});

module.exports = router;