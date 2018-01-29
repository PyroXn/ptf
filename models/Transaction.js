const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    currency: { type: mongoose.Schema.Types.ObjectId, ref: 'Currency' },
    action: String,
    market: String,
    trading_pair: String,
    book_price: Number,
    quantity: Number,
    date: { type: Date },
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' },
});

module.exports = mongoose.model('Transaction', TransactionSchema);