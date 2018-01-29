const mongoose = require("mongoose");

const CurrencySchema = new mongoose.Schema({
    Name: String,
    Symbol: String,
    CoinName: String,
    FullName: String,
    Algorithm: String,
    ProofType: String,
    SortOrder: Number,
    ImageUrl: String,
});

module.exports = mongoose.model('Currency', CurrencySchema);