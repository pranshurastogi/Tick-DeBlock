const express = require('express');
const router = express.Router();
const Ticket=require('../models/tickets');
const mongoose=require('mongoose')


router.post('/', (req, res, next) => {
    res.status(201).json({
        message: 'Tickets Booked'
    });
});

router.get('/:eventId', (req, res, next) => {
    res.status(200).json({
        message: 'Tickets details',
        eventId: req.params.eventId
    });
});



router.delete('/:eventId', (req, res, next) => {
    res.status(200).json({
        message: 'Ticket deleted',
        eventId: req.params.eventId
    });
});

module.exports = router;