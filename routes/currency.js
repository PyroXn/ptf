const express = require('express');
const router = express.Router();
const Currency = require('../models/Currency');
const currencyUtil = require('../util/currencyUtil');

/* GET ALL CURRENCY */
router.get('/', function(req, res, next) {
    Currency.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    }).sort('SortOrder');
});

/* GET FORCE UPDATE CURRENCY */
router.get('/force_update', function(req, res, next) {
    currencyUtil.currencyImport(req, res, next);
    res.json(true);
});

router.get('/search/:criteria', function(req, res) {
    Currency.find({FullName: { $regex : new RegExp(req.params.criteria, "i") }}, function(err, foundItems) {
        if (err) {
            console.log("problem!")
        } else {
            res.json(foundItems);
        }
    }).limit(5).sort('SortOrder');
});

/* GET SINGLE CURRENCY BY ID */
router.get('/:id', function(req, res, next) {
    Currency.findById(req.params.id, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;