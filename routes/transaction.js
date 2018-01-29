const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const currencyUtil = require('../util/currencyUtil');
const mongoose = require("mongoose");

/* GET ALL TRANSACTIONS */
router.get('/', function(req, res, next) {
    Transaction
        .find()
        .populate('currency')
        .lean()
        .exec(function (err, transactions) {
            if (err) return next(err);
            currencyUtil.currencyLive(transactions, res);
        });
});

router.get('/:portfolioId/:currencyId', function(req, res, next) {
    console.log('la');
    Transaction
        .find({
            portfolio: mongoose.Types.ObjectId(req.params.portfolioId),
            currency: mongoose.Types.ObjectId(req.params.currencyId)})
        .populate('currency')
        .lean()
        .exec(function (err, transactions) {
            if (err) return next(err);
            currencyUtil.currencyLive(transactions, res);
        });
});


/* GET SINGLE TRANSACTION BY ID */
router.get('/:id', function(req, res, next) {
    Transaction
        .findById(req.params.id)
        .populate('currency')
        .exec(function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
});

/* SAVE TRANSACTION */
router.post('/', function(req, res, next) {
    Transaction.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE TRANSACTION */
router.put('/:id', function(req, res, next) {
    Transaction.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE TRANSACTION */
router.delete('/:id', function(req, res, next) {
    Transaction.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;