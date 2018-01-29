const mongoose = require("mongoose");

const MarketSchema = new mongoose.Schema({
    name: String,
    pairs: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Market', MarketSchema);