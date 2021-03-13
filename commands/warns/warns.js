const Mongodb = require('../../models/modSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'warnings',
    category: "moderation",
    description: 'Finds and displays the warnings of the mentioned user.',
    run : async(client, message, args, db) => {
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if(!mentionedMember) return message.channel.send("The member mentioned is not in this server.");

        Mongodb.find({ guildId : message.guild.id, userId : mentionedMember.user.id}, async(err, data) => {
            if(err) throw err;
            if (data) {
                message.channel.send(new Discord.MessageEmbed()
                    .setTitle(`${mentionedMember.user.tag}'s punishments.`)
                    .addFields(
                        data.map((warn)=> {
                            // if(warn.length < 1) return { name: 'Punishments', value: 'This user has no punishments'};
                            if (warn) return { name: `Case #${warn.case} - ${warn.punishType}`, value: warn.reason};
                        })
                    )
                    .setColor("GREEN")
                )
            } else {
                message.channel.send(`${mentionedMember} has no punishments.`);
            }
        });
    }
}