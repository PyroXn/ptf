const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
    name: String,
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);