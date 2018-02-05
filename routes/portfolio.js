const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const currencyUtil = require('../util/currencyUtil');

/* GET ALL PORTFOLIOS */
router.get('/', function(req, res, next) {
    Portfolio.find(function (err, products) {
        if (err) return next(err);
        res.json(products);
    });
});

router.get('/:id/detail', function(req, res, next) {
    Transaction
        .find({portfolio: req.params.id})
        .populate('currency')
        .exec(function (err, transactions) {
            if (err) return next(err);


            let holdings = Object.values(transactions.reduce((result, {
                currency,
                action,
                book_price,
                quantity,
                historical_price
            }) => {
                // Create new group
                if (!result[currency]) {
                    result[currency] = {
                        currency,
                        book_price: book_price,
                        quantity: action === 'BUY' ? quantity : -quantity,
                        historical_price: historical_price,
                    }
                } else {
                    if (action === 'BUY') {
                        //fixme weighted average
                        result[currency].book_price = (result[currency].book_price*result[currency].quantity+book_price*quantity)/(result[currency].quantity+quantity);
                        result[currency].quantity += quantity;
                    } else {
                        result[currency].book_price = (result[currency].book_price*result[currency].quantity+book_price*-quantity)/(result[currency].quantity-quantity);
                        result[currency].quantity -= quantity;
                    }
                }
                return result;
            }, {}));
            currencyUtil.currencyLive(holdings, res);
        });
});

/* GET SINGLE PORTFOLIO BY ID */
router.get('/:id', function(req, res, next) {
    Portfolio
        .findById(req.params.id)
        .exec(function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
});

/* SAVE PORTFOLIO */
router.post('/', function(req, res, next) {
    Portfolio.create(req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* UPDATE PORTFOLIO */
router.put('/:id', function(req, res, next) {
    Portfolio.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

/* DELETE PORTFOLIO */
router.delete('/:id', function(req, res, next) {
    Portfolio.findByIdAndRemove(req.params.id, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
});

module.exports = router;