const Mongodb = require('../../models/welcgbyechSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'checkchannel',
    category: 'utilities',
    aliases: [''],
    description: 'Gives user information on the which channel is assigned to the welcome channel position.',
    run : async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permission to set the welcome channel.');

        if (!args[0]) return message.channel.send(`Please give a valid option **welcome** or **goodbye**.`);

        if (args[0].toLowerCase() === "welcome") {
            Mongodb.findOne({ guildId: message.guild.id, status: "Welcome" }, async (err, data) => {
                if (!data) return message.channel.send("This guild has no welcome channel set.");
    
                const channel = client.channels.cache.get(data.channelId);
    
                message.channel.send(`${data.status} channel -> ${channel}`);
            });
        }

        if (args[0].toLowerCase() === "goodbye") {
            Mongodb.findOne({ guildId: message.guild.id, status: "Goodbye" }, async (err, data) => {
                if (!data) return message.channel.send("This guild has no goodbye channel set.");
    
                const channel = client.channels.cache.get(data.channelId);
    
                message.channel.send(`${data.status} channel -> ${channel}`);
            });
        }

        if (args[0].toLowerCase() !== "welcome" && args[0].toLowerCase() !== "goodbye") return message.channel.send(`Please give a valid option **welcome** or **goodbye**.`);
    }
}