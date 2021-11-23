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

router.post("/", (req, res, next) => {
    const event = new Event({
      _id: new mongoose.Types.ObjectId(),
      EventName: req.body.EventName,
      Timings:req.body.Timings,
      Venue:req.body.Venue,
      Description:req.body.Description,
      Price: req.body.Price,
      Address:req.body.Address,
      totalSupply:req.body.totalSupply
    });
    event
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Event successfully created",
        createdProduct: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
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