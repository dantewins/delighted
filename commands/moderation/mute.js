const Discord = require('discord.js');

module.exports = {
    name: 'mute',
    category: "moderation",
    aliases: ['m'],
    description: 'Mutes the mentioned user.',
    run : async (client, message, args, db) => {
        if (!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send("You do not have permission to mute members.");
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have \`MANAGE_ROLES\` permission.");

        let reason = args.slice(1).join(" ");
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const findRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted');

        if (!args[0]) return message.channel.send('You need to state a user to mute. \`-mute @user reason\`');
        if (!mentionedMember) return message.channel.send("The member mentioned is not in this server.");
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot mute me with my own command.');
        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot mute yourself.');
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("You cannot mute this user because this user has a same or higher role than you.");
        if (mentionedMember.hasPermission("ADMINISTRATOR")) return message.channel.send("I cannot mute that user because this user has \`ADMINISTRATOR\` permissions.");
        if (!reason) return message.channel.send("Please state a reason. \`-mute @user reason\`");
        if (reason == "_ _") return message.channel.send("Please state a reason. \`-mute @user reason\`");

        if (!findRole) {
            try {
                message.channel.send('Muted role is not found, attempting to create a mute role.').then(message => {
                    message.delete({
                        timeout: 2000
                    })
                });

                let muteRole =  await message.guild.roles.create ({
                    data : {
                        name : 'Muted',
                        permissions: []
                    }
                });

                message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                    await channel.createOverwrite (muteRole, {
                        SEND_MESSAGES : false,
                        ADD_REACTIONS: false
                    })
                });
                message.channel.send('Muted role has successfully been created.').then(message => {
                    message.delete({
                        timeout: 2000
                    })
                });
            } catch (error) {
                console.log(error);
            }
        };

        const muteEmbed = new Discord.MessageEmbed()
            .setTitle(`You were muted in ${message.guild.name}`)
            .addField(`Reason: `,`${reason}`)
            .addField(`Action performed by: `,`${message.author.tag}`)
            .setColor("#f76d63")
            .setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());

        const embed = new Discord.MessageEmbed()
            .setTitle(`${mentionedMember.user.tag} was muted in ${message.guild.name}`)
            .addField(`Reason: `, `${reason}`)
            .addField(`Action performed by: `,`${message.author.tag}`)
            .setColor("#45d66b")
            .setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());

        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
        if (mentionedMember.roles.cache.has(role.id)) return message.channel.send(`${mentionedMember.displayName} is already muted.`);
        await mentionedMember.roles.add(role);
        await mentionedMember.send(muteEmbed);
        message.channel.send(embed);
    }
}