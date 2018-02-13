const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
    name: String,
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);