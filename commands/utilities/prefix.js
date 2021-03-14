const Mongodb = require('../../models/guildsSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'prefix',
    category: "utilities",
    description: 'Can find and display the prefix for the server mentioned or change the prefix of that server.',
    run: async (client, message, args) => {
        let nPrefix = args[0];

        Mongodb.findOne({ guildId : message.guild.id }), async (err, data) => {
            if (err) throw err;
            if (data) {
                Mongodb.findOneAndDelete({ guildId : message.guild.id });
                data = new Mongodb({
                    guildId : message.guild.id,
                    prefix : nPrefix
                });
                data.save();
                message.channel.send(`The prefix for this server has been updated to **${nPrefix}**`)
            } else {
                data = new Mongodb ({
                    guildId: message.guild.id,
                    prefix : nPrefix
                });
                data.save();
                message.channel.send(`The prefix for this server has been updated to **${nPrefix}**`)
            }
        }
    }
}