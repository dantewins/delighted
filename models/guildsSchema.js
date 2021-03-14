const mongoose = require('mongoose');

let Schema = new mongoose.Schema ({
    guildId : String,
    prefix : String
})

module.exports = mongoose.model('guilds', Schema);