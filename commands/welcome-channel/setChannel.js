const Mongodb = require('../../models/welcgbyechSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'setchannel',
    category: 'utilities',
    aliases: [''],
    description: 'Allows the user to set a specific channel as the welcome channel.',
    run : async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permission to set the welcome channel.');
        
        const channel = message.mentions.channels.first();
        if (!channel) return message.channel.send("Please mention a channel!");

        if (!args[1]) return message.channel.send(`Please give a valid option **welcome** or **goodbye**.`);

        if (args[1].toLowerCase() === "welcome") {
            Mongodb.findOne({ guildId: message.guild.id, status: "Welcome" }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    data.channelId = channel.id;
                    data.save();
                } else {
                    new Mongodb({
                        guildId: message.guild.id,
                        channelId: channel.id,
                        status: "Welcome"
                    }).save();
                }
                message.channel.send(`The welcome channel has been set to ${channel}!`);
            });
        }
        
        if (args[1].toLowerCase() === "goodbye") {
            Mongodb.findOne({ guildId: message.guild.id, status: "Goodbye" }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    data.channelId = channel.id;
                    data.save();
                } else {
                    new Mongodb({
                        guildId: message.guild.id,
                        channelId: channel.id,
                        status: "Goodbye"
                    }).save();
                }
                message.channel.send(`The goodbye channel has been set to ${channel}!`);
            });
        }

        if (args[1].toLowerCase() !== "welcome" && args[1].toLowerCase() !== "goodbye") return message.channel.send(`Please give a valid option **welcome** or **goodbye**.`);
    }
}
