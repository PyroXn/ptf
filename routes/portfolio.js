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
        .lean()
        .exec(function (err, transactions) {
            if (err) return next(err);
            let holdings = Object.values(transactions.reduce((result, transaction) => {
                if (!result[transaction.currency]) {
                    result[transaction.currency] = {
                        currency: transaction.currency,
                        quantity_buy: transaction.action === 'BUY' ? transaction.quantity : 0,
                        quantity_sell: transaction.action === 'BUY' ? 0 : transaction.quantity,
                        USD: {
                            avg_buy: transaction.action === 'BUY' ? transaction.book_price * transaction.historical_price.USD : 0,
                            avg_sell: transaction.action === 'BUY' ? 0 : transaction.book_price * transaction.historical_price.USD
                        },
                        EUR: {
                            avg_buy: transaction.action === 'BUY' ? transaction.book_price * transaction.historical_price.EUR : 0,
                            avg_sell: transaction.action === 'BUY' ? 0 : transaction.book_price * transaction.historical_price.EUR
                        },
                        BTC: {
                            avg_buy: transaction.action === 'BUY' ? transaction.book_price * transaction.historical_price.BTC : 0,
                            avg_sell: transaction.action === 'BUY' ? 0 : transaction.book_price * transaction.historical_price.BTC
                        }
                    }
                } else {
                    if (transaction.action === 'BUY') {
                        result[transaction.currency].USD.avg_buy = (result[transaction.currency].USD.avg_buy * result[transaction.currency].quantity_buy + transaction.book_price * transaction.historical_price.USD * transaction.quantity) / (result[transaction.currency].quantity_buy + transaction.quantity);
                        result[transaction.currency].EUR.avg_buy = (result[transaction.currency].EUR.avg_buy * result[transaction.currency].quantity_buy + transaction.book_price * transaction.historical_price.EUR * transaction.quantity) / (result[transaction.currency].quantity_buy + transaction.quantity);
                        result[transaction.currency].BTC.avg_buy = (result[transaction.currency].BTC.avg_buy * result[transaction.currency].quantity_buy + transaction.book_price * transaction.historical_price.BTC * transaction.quantity) / (result[transaction.currency].quantity_buy + transaction.quantity);

                        result[transaction.currency].quantity_buy += transaction.quantity;

                    } else {
                        result[transaction.currency].USD.avg_sell = (result[transaction.currency].USD.avg_sell * result[transaction.currency].quantity_sell + transaction.book_price * transaction.historical_price.USD * transaction.quantity) / (result[transaction.currency].quantity_sell + transaction.quantity);
                        result[transaction.currency].EUR.avg_sell = (result[transaction.currency].EUR.avg_sell * result[transaction.currency].quantity_sell + transaction.book_price * transaction.historical_price.EUR * transaction.quantity) / (result[transaction.currency].quantity_sell + transaction.quantity);
                        result[transaction.currency].BTC.avg_sell = (result[transaction.currency].BTC.avg_sell * result[transaction.currency].quantity_sell + transaction.book_price * transaction.historical_price.BTC * transaction.quantity) / (result[transaction.currency].quantity_sell + transaction.quantity);

                        result[transaction.currency].quantity_sell += transaction.quantity;
                    }

                }
                return result;
            }, {}));

            let priceMatrix = currencyUtil.priceLive(Array.from(new Set(transactions.map(transaction => transaction.currency.Symbol))).join());
            priceMatrix.then(function(priceMatrix) {
                holdings.map(holding => {
                    holding.quantity = holding.quantity_buy - holding.quantity_sell;
                    holding.USD = {
                        value: holding.quantity * priceMatrix[holding.currency.Symbol].USD,
                        cost: holding.USD.avg_buy * holding.quantity_buy - holding.USD.avg_sell * holding.quantity_sell,
                        profit: holding.quantity * priceMatrix[holding.currency.Symbol].USD - (holding.USD.avg_buy * holding.quantity_buy - holding.USD.avg_sell * holding.quantity_sell),
                        profit_pct: (holding.quantity * priceMatrix[holding.currency.Symbol].USD - (holding.USD.avg_buy * holding.quantity_buy - holding.USD.avg_sell * holding.quantity_sell)) / ((holding.USD.avg_buy * holding.quantity_buy - holding.USD.avg_sell * holding.quantity_sell) / 100),
                    };
                    holding.EUR = {
                        value: holding.quantity * priceMatrix[holding.currency.Symbol].EUR,
                        cost: holding.EUR.avg_buy * holding.quantity_buy - holding.EUR.avg_sell * holding.quantity_sell,
                        profit: holding.quantity * priceMatrix[holding.currency.Symbol].EUR - (holding.EUR.avg_buy * holding.quantity_buy - holding.EUR.avg_sell * holding.quantity_sell),
                        profit_pct: (holding.quantity * priceMatrix[holding.currency.Symbol].EUR - (holding.EUR.avg_buy * holding.quantity_buy - holding.EUR.avg_sell * holding.quantity_sell)) / ((holding.EUR.avg_buy * holding.quantity_buy - holding.EUR.avg_sell * holding.quantity_sell) / 100),
                    };
                    holding.BTC = {
                        value: holding.quantity * priceMatrix[holding.currency.Symbol].BTC,
                        cost: holding.BTC.avg_buy * holding.quantity_buy - holding.BTC.avg_sell * holding.quantity_sell,
                        profit: holding.quantity * priceMatrix[holding.currency.Symbol].BTC - (holding.BTC.avg_buy * holding.quantity_buy - holding.BTC.avg_sell * holding.quantity_sell),
                        profit_pct: (holding.quantity * priceMatrix[holding.currency.Symbol].BTC - (holding.BTC.avg_buy * holding.quantity_buy - holding.BTC.avg_sell * holding.quantity_sell)) / ((holding.BTC.avg_buy * holding.quantity_buy - holding.BTC.avg_sell * holding.quantity_sell) / 100),
                    };
                });
                res.json(holdings);
            });
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