const Mongodb = require('../../models/guildsSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'prefix',
    category: "utilities",
    description: 'Can find and display the prefix for the server mentioned or change the prefix of that server.',
    run: async (client, message, args) => {
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You do not have permission to change my prefix in this server.");
        let nPrefix = args[0];

        const prefix = await Mongodb.findOne({ guildId : message.guild.id });

        if (!nPrefix) {
            message.channel.send(`The prefix for this server is **${prefix.prefix}**.`);
        } else {
            if (prefix) {
                prefix.prefix = nPrefix;
                prefix.save();
                message.channel.send(`Successfully updated my prefix to **${nPrefix}**.`);
            } else {
                message.channel.send("There was an error in trying to update my prefix.");
            }
        }
    }
}