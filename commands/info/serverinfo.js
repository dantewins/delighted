const Discord = require('discord.js');

module.exports = {
    name: 'serverinfo',
    category: 'info',
    aliases: [''],
    description: 'Shows the user all about the server that they said the command in.',
    run : async (client, message, args) => {
        const infoEmbed = new Discord.MessageEmbed()
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .setColor("RANDOM")
            .addField('General Info', [
                `Server ID: ${message.guild.id}`,
                `Owner: ${message.guild.owner}`
            ])
            
    }
}