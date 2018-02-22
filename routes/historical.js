const express = require('express');
const router = express.Router();
const currencyUtil = require('../util/currencyUtil');

/* GET HISTORICAL BY CURRENCY */
router.get('/:currency', function(req, res) {
    let histo = currencyUtil.historicalData(req.params.currency);
    histo.then(function(val) {
        res.json(val);
    });
});

module.exports = router;