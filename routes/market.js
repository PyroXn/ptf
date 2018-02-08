const express = require('express');
const router = express.Router();
const Market = require('../models/Market');
const currencyUtil = require('../util/currencyUtil');

/* GET FORCE UPDATE CURRENCY */
router.get('/force_update', function(req, res, next) {
    currencyUtil.marketImport(req, res, next);
    res.json(true);
});

router.get('/search', function(req, res) {
    let key = 'pairs.'+ req.query.currency;
    Market.find({name: { $regex : new RegExp(req.query.name, "i")}, [key]: { $exists : true }}, `name ${[key]}`, function(err, foundItems) {
        if (err) {
            console.log(err);
            console.log("problem!")
        } else {
            res.json(foundItems);
        }
    }).limit(5).sort('_id');
});

router.get('/pairs', function(req, res) {
    let key = 'pairs.'+ req.query.currency;
    Market.find({_id: req.query.marketId, [key]: { $exists : true }}, `name ${[key]}`, function(err, foundItems) {
        if (err) {
            console.log(err);
            console.log("problem!")
        } else {
            res.json(foundItems);
        }
    });
});

module.exports = router;