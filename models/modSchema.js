const mongoose = require('mongoose');

let Schema = new mongoose.Schema ({
    case : Number,
    guildId : String,
    userId : String,
    punishType : String,
    moderator : String,
    reason : String
})

module.exports = mongoose.model('Moderation', Schema);