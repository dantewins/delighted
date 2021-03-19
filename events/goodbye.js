const Discord = require('discord.js');
const Canvas = require('discord-canvas');
const Mongodb = require('../models/welc-gbye-chSchema');

module.exports = client => {
    client.on('guildMemberRemove', async (member, message) => {
        Mongodb.findOne({ guildId: member.guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) return;
            const user = member.user;
            const image = new Canvas.Goodbye()
                .setUsername(user.username)
                .setDiscriminator(user.discriminator)
                .setMemberCount(member.guild.memberCount)
                .setGuildName(member.guild.name)
                .setAvatar(user.displayAvatarURL({ format: 'png' }))
                .setColor("border", "#8015EA")
                .setColor("username-box", "#8015EA")
                .setColor("discriminator-box", "#8015EA")
                .setColor("message-box", "#8015EA")
                .setColor("title", "#8015EA")
                .setColor("avatar", "#8015EA")
                .setBackground(
                    "https://wallpapercave.com/wp/c1WgVun.jpg"
                )
                .toAttachment();
    
            const attachment = new Discord.MessageAttachment(
                (await image).toBuffer(), 
                "goodbye-image.png");
    
            const channel = member.guild.channels.cache.get(data.channelId);
            channel.send(attachment);
        });
    });
}