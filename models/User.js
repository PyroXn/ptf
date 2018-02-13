const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    pseudo: String,
    email: String,
});

module.exports = mongoose.model('User', UserSchema);