const Mongodb = require('../../models/welcomeChannelSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'setchannel',
    category: 'utilities',
    aliases: [''],
    description: 'Allows the user to set a specific channel as the welcome channel.',
    run : async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permission to set the welcome channel.');
        
        const channel = message.mentions.channels.first();
        if (!channel) return message.reply("please mention a channel!");

        Mongodb.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                data.Channel = channel.id;
                data.save();
            } else {
                new Mongodb({
                    guildId: message.guild.id,
                    channelId: channel.id,
                }).save();
            }
            message.reply(`${channel} has been set as the welcome channel!`);
        });
    }
}
