const express = require('express');
const router = express.Router();
const User = require('../models/User');

/* GET SINGLE USER BY EMAIL */
router.get('/:email', function(req, res, next) {
    User
        .findOne({email: req.params.email})
        .exec(function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
});

/* SAVE USER */
router.post('/', function(req, res, next) {
    User.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;