const express = require('express');
const router = express.Router();
const currencyUtil = require('../util/currencyUtil');

/* GET HISTORICAL BY CURRENCY */
router.get('/:currency/:scale', function(req, res) {
    let histo = currencyUtil.historicalData(req.params.currency, req.params.scale);
    histo.then(function(val) {
        res.json(val);
    });
});

module.exports = router;