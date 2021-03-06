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

exports.currencyLive = function(transactions) {
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
    return rp(options)
        .then(function (liveInfo) {
            transactions.forEach(transaction => {
                let fsymInfo = liveInfo.RAW[transaction.currency.Symbol];
                tsyms.forEach(tsym => {
                    if (transaction.action === 'BUY') {
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
                    } else {
                        let gain = transaction.quantity * transaction.book_price * transaction.historical_price[tsym];
                        transaction[tsym] = {
                            market_price: fsymInfo[tsym].PRICE,
                            change24: round(fsymInfo[tsym].CHANGEPCT24HOUR),
                            volume24: round(fsymInfo[tsym].VOLUME24HOURTO),
                            gain: round(gain),
                        };
                    }
                    //fixme maybe slow
                });
            });
            return transactions;
        })
        .catch(function (err) {
            // API call failed...
            console.log(err);
        });
};

exports.priceLive = function(currencies) {
    let tsyms = ['USD', 'EUR', 'BTC'];
    let options = {
        // https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH,DASH&tsyms=BTC,USD,EUR
        uri: 'https://min-api.cryptocompare.com/data/pricemulti',
        qs: {
            fsyms: currencies,     // From Symbol
            tsyms: tsyms.join(),   // To Symbols, include multiple symbols
            e: 'CCCAGG',           // Name of exchange. Default: CCCAGG
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    return rp(options)
        .then(matrixPrice => matrixPrice)
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


exports.historicalData = function(currency, scale = 'W') {
    let tsyms = ['USD', 'EUR', 'BTC', 'ETH'];
    let requests = [];

    let url;
    let qs = {
        fsym: currency,               // From Symbol
    };
    switch (scale) {
        case 'H':
            url = 'https://min-api.cryptocompare.com/data/histominute';
            qs.limit = 60;
            break;
        case 'D':
            url = 'https://min-api.cryptocompare.com/data/histominute';
            qs.aggregate = 10;
            qs.limit = 144;
            break;
        case 'W':
            url = 'https://min-api.cryptocompare.com/data/histohour';
            break;
        case 'M':
            url = 'https://min-api.cryptocompare.com/data/histoday';
            break;
        case 'Y':
            url = 'https://min-api.cryptocompare.com/data/histoday';
            qs.aggregate = 3;
            qs.limit = 122;
            break;
        case 'A':
            url = 'https://min-api.cryptocompare.com/data/histoday';
            qs.aggregate = 10;
            qs.limit = 108;
            break;
    }

    // H
    // https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=60

    // D
    // https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&aggregate=10&limit=144

    // W
    // https://min-api.cryptocompare.com/data/histohour?fsym=BTC&tsym=ETH

    // M
    // https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD

    // Y
    // https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&aggregate=3&limit=122

    // A
    // https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&aggregate=10&limit=108

    tsyms.forEach(tsym => {
        qs.tsym = tsym;
        let options = {
            uri: url,
            qs: qs,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true,
            transform: function (body) {
                body.Data.tsym = tsym;
                return body.Data;
            }
        };
        requests.push(rp(options));
    });

    return this.parseHistoricalData(requests, currency);

    // let historicalData = {
    //     currency: currency,
    //     time: 1445040000.0,
    //     USD: {
    //         "close": 270.51,
    //     },
    //     EUR: {
    //         "close": 270.51,
    //     },
    //     BTC: {
    //         "close": 270.51,
    //     }
    // };
};

exports.parseHistoricalData = function (requests, currency) {
    let historicalDataByCurrency = [];

    return Promise.all(requests).then(function (values) {
        values.forEach(value => {
            value.forEach(histoData => {
                const index = historicalDataByCurrency.map(value => value.time).indexOf(histoData.time);
                if (index > -1) {
                    historicalDataByCurrency[index][value.tsym] = {
                        price: histoData.close
                    };
                } else {
                    let historicalData = {};
                    historicalData.time = histoData.time;
                    historicalData.currency = currency;
                    historicalData[value.tsym] = {
                        price: histoData.close
                    };
                    historicalDataByCurrency.push(historicalData);
                }
            });
        });
        return historicalDataByCurrency;
    });
};
