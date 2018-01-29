const express = require('express');
const router = express.Router();
const Market = require('../models/Market');
const currencyUtil = require('../util/currencyUtil');

/* GET FORCE UPDATE CURRENCY */
router.get('/force_update', function(req, res, next) {
    currencyUtil.marketImport(req, res, next);
    res.json(true);
});

module.exports = router;