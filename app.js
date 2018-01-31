var request = require('request');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

const currencyUtil = require('./util/currencyUtil');
var currency = require('./routes/currency');
var transaction = require('./routes/transaction');
var portfolio = require('./routes/portfolio');
var market = require('./routes/market');
var app = express();

var mongoose = require('mongoose');
//docker run --name mongo -p 27017:27017 -d mongo mongod
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/mongo', { promiseLibrary: require('bluebird') })
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'build')));

app.use('/api/transaction', transaction);
app.use('/api/currency', currency);
app.use('/api/portfolio', portfolio);
app.use('/api/market', market);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var schedule = require('node-schedule');

var j = schedule.scheduleJob('0 0 * * *', function() {
    currencyUtil.currencyImport();
    currencyUtil.marketImport();
});

app.listen(3000);
module.exports = app;