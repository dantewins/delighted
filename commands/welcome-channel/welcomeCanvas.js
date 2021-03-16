const Discord = require('discord.js');
const Canvas = require('discord-canvas');

module.exports = {
    name: 'welcomecanvas',
    category: '',
    aliases: [''],
    description: '',
    run: async (client, message, args) => {

        const image = await new Canvas.Goodbye()
            .setUsername("xixi52")
            .setDiscriminator("0001")
            .setMemberCount("140")
            .setGuildName("Server DEV")
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
            "goodbye-image.png");

        message.channel.send(attachment);
    }
}