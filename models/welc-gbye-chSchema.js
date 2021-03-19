const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    guildId : String,
    channelId: String,
    status: String
})

module.exports = mongoose.model('welcome-goodbye-channel', Schema);