const Discord = require('discord.js');
const client = require('../index');
const Mongodb = require('../models/welcomeChannelSchema');
const canvas = require('discord-canvas');

client.on('guildMemberAdd', async(member) => {
    Mongodb.findOne({ guildId: member.guild.id }), async(err, data) => {
        if (err) throw err;
        if (!data) return;
        const user = member.user;
        const image = await new Canvas.Welcome()
            .setUsername(user.username)
            .setDiscriminator(user.discriminator)
            .setMemberCount(member.guild.memberCount)
            .setGuildName(member.guild.name)
            .setAvatar(message.author.displayAvatarURL({ format: "png" }))
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
            "welcome-image.png");

            const channel = member.guild.channels.cache.get(data.channelId);
            channel.send(attachment);
    }
});