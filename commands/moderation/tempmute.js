const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'tempmute',
    category: "moderation",
    aliases: ['tm'],
    description: 'Temporarily mutes the mentioned user.',
    run : async (client, message, args, db) => {
        if (!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send("You do not have permission to mute members.");
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have \`MANAGE_ROLES\` permission.");

        let reason = args.slice(2).join(" ");
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const findRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === 'muted');
        const time = args[1];

        if (!args[0]) return message.channel.send('You need to state a user to temporarily mute. \`-tempmute @user time reason\`');
        if (!mentionedMember) return message.channel.send("The member mentioned is not in this server.");
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot temporarily mute me with my own command.');
        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot temporarily mute yourself.');
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("You cannot temporarily mute this member because this user has a higher role than you.");
        if (mentionedMember.hasPermission("ADMINISTRATOR")) return message.channel.send("I cannot mute that user because this user has \`ADMINISTRATOR\` permissions.");
        if (!time) return message.channel.send('Please state a time. \`-tempmute @user time reason\`');
        if (!reason) return message.channel.send("Please state a reason. \`-tempmute @user time reason\`");
        if (reason == "_ _") return message.channel.send("Please state a reason. \`-tempmute @user time reason\`");
        if (!isNaN(time)) return message.channel.send('Please state a valid amount of time.')

        if (!findRole) {
            try {
                message.channel.send('Muted role is not found, attempting to create a mute role.')

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
                    });
                });
                message.channel.send('Muted role has successfully been created.');
            } catch (error) {
                console.log(error);
            }
        }

        const tempmuteEmbed = new Discord.MessageEmbed()
            .setTitle(`You were temporarily muted in ${message.guild.name}`)
            .addField(`Reason: `,`${reason}`)
            .addField(`Action performed by: `,`${message.author.tag}`)
            .setColor("#f76d63")
            .setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());

        const unmuteEmbed = new Discord.MessageEmbed()
            .setTitle(`You were unmuted muted in ${message.guild.name}`)
            .addField(`Reason: `,`Time on tempmute ended.`)
            .addField(`Action performed by: `,`${message.author.tag}`)
            .setColor("#f76d63")
            .setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());

        const embed = new Discord.MessageEmbed()
            .setTitle(`${mentionedMember.user.tag} was temporarily muted in ${message.guild.name}`)
            .addField(`Reason: `, `${reason}`)
            .addField(`Action performed by: `,`${message.author.tag}`)
            .setColor("#45d66b")
            .setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());

        let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
        if (mentionedMember.roles.cache.has(role.id)) return message.channel.send(`${mentionedMember.displayName} is already muted.`);
        await mentionedMember.roles.add(role);
        await mentionedMember.send(tempmuteEmbed);
        message.channel.send(embed);
        
        setTimeout(async () => {
            await mentionedMember.roles.remove(role);
            mentionedMember.send(unmuteEmbed);
        }, ms(time));
    }
}