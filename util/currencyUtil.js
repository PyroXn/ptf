const rp = require('request-promise');
const Currency = require('../models/Currency');
const Market = require('../models/Market');

exports.currencyImport = function(req, res, next) {
    let options = {
        uri: 'https://www.cryptocompare.com/api/data/coinlist',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };

    rp(options)
        .then(function (coinList) {
            let data = coinList.Data;
            Object.keys(data).forEach(key => {
                let query = {Symbol: data[key].Symbol};
                let options = {
                    upsert: true,
                    setDefaultsOnInsert: true
                };

                Currency.findOneAndUpdate(query, data[key], options, function (error) {
                    if (error) return next(error);
                    console.log('Update currency DONE');
                });
            });

        })
        .catch(function (err) {
            // API call failed...
            console.log(err);
        });
};

exports.marketImport = function(req, res, next) {
    let options = {
        uri: 'https://min-api.cryptocompare.com/data/all/exchanges',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    rp(options)
        .then(function (exchanges) {
            Object.keys(exchanges).forEach(key => {
                let query = {name: key};
                let options = {
                    upsert: true,
                    setDefaultsOnInsert: true
                };
                delete exchanges[key]['$$$'];
                let market = {
                    name: key,
                    pairs: exchanges[key]
                };
                Market.findOneAndUpdate(query, market, options, function (error) {
                    if (error) return next(error);
                    console.log('Update market DONE');
                });
            });
        })
        .catch(function (err) {
            // API call failed...
            console.log(err);
        });
};

const round = function(num, decimal = 2) {
    return parseFloat(num.toFixed(decimal))
};

exports.currencyLive = function(transactions, res) {
    let tsyms = ['USD', 'EUR', 'BTC'];
    let options = {
        // https://min-api.cryptocompare.com/data/pricemultifull?fsym=LTC&tsyms=USD,EUR,BTC&e=CCCAGG
        uri: 'https://min-api.cryptocompare.com/data/pricemultifull',
        qs: {
            fsyms: transactions.map(transaction => transaction.currency.Symbol).join(),     // From Symbol
            tsyms: tsyms.join(),                                                                   // To Symbols, include multiple symbols
            e: 'CCCAGG',                                                                    // Name of exchange. Default: CCCAGG
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    rp(options)
        .then(function (liveInfo) {
            transactions.forEach(transaction => {
                console.log(transaction);
                let fsymInfo = liveInfo.RAW[transaction.currency.Symbol];
                tsyms.forEach(tsym => {
                    let value = transaction.quantity * fsymInfo[tsym].PRICE;
                    let cost = transaction.quantity * transaction.book_price * transaction.historical_price[tsym];
                    let profit = value - cost;
                    let profit_pct = profit / cost * 100;
                    transaction[tsym] = {
                        market_price: fsymInfo[tsym].PRICE,
                        change24: round(fsymInfo[tsym].CHANGEPCT24HOUR),
                        volume24: round(fsymInfo[tsym].VOLUME24HOURTO),
                        value: round(value),
                        cost: round(cost),
                        profit: round(profit),
                        profit_pct: round(profit_pct),
                    };
                    //fixme maybe slow
                });
            });
            res.json(transactions);
        })
        .catch(function (err) {
            // API call failed...
            console.log(err);
        });
};

exports.historicalPrice = function(transaction) {
    let tsyms = ['USD', 'EUR', 'BTC'];
    let options = {
        // https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=BTC,USD,EUR&ts=1452680400
        uri: 'https://min-api.cryptocompare.com/data/pricehistorical',
        qs: {
            fsym: transaction.trading_pair,     // From Symbol
            tsyms: tsyms.join(),                   // To Symbols, include multiple symbols
            markets: transaction.market,           // Name of exchange. Default: CCCAGG
            ts: Date.parse(transaction.date)/1000,
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    return rp(options)
        .then(function (historical) {
            transaction.historical_price = historical[Object.keys(historical)[0]];
            return transaction;
        })
        .catch(function (err) {
            // API call failed...
            console.log(err);
        });

};

