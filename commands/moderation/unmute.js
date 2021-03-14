const Discord = require('discord.js');

module.exports = {
    name: 'unmute',
    category: "moderation",
    description: 'Unmutes the mentioned user.',
    run : async (client, message, args) => {
        if (!message.member.hasPermission("MUTE_MEMBERS")) return message.channel.send("You do not have permission to mute members.");
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I do not have \`MANAGE_ROLES\` permission.");

        let reason = args.slice(1).join(" ");
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.channel.send('You need to state a user to unmute. \`-unmute @user reason\`');
        if (!mentionedMember) return message.channel.send("The member mentioned is not in this server.");
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot unmute me with my own command.');
        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot unmute yourself.');
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("You cannot unmute this user because this user has a same or higher role than you.");
        if (mentionedMember.hasPermission("ADMINISTRATOR")) return message.channel.send("I cannot mute that user because this user has \`ADMINISTRATOR\` permissions.");
        if (!reason) return message.channel.send("Please state a reason. \`-unmute @user reason\`");
        if (reason == "_ _") return message.channel.send("Please state a reason. \`-unmute @user reason\`");

        const unmuteEmbed = new Discord.MessageEmbed()
            .setTitle(`You were unmuted in ${message.guild.name}`)
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
        if (!mentionedMember.roles.cache.has(role.id)) return message.channel.send(`${mentionedMember.displayName} is already unmuted.`);
        await mentionedMember.roles.remove(role);
        await mentionedMember.send(unmuteEmbed);
        message.channel.send(embed);
    }
}