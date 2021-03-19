const Mongodb = require('../../models/welc-gbye-chSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'checkchannel',
    category: 'utilities',
    aliases: [''],
    description: 'Gives user information on the which channel is assigned to the welcome channel position.',
    run : async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permission to set the welcome channel.');

        Mongodb.findOne({ guildId: message.guild.id }, async (err, data) => {
            if (!data) return message.channel.send("This guild has no welcome channel set.");

            const channel = client.channels.cache.get(data.channelId);

            message.channel.send(`${data.status} channel -> ${channel}`);
        });
    }
}