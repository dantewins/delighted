const Discord = require('discord.js');

module.exports = {
    name: 'ban',
    category: "moderation",
    aliases: ['b'],
    description: 'Bans the mentioned user.',
    run : async (client, message, args) => {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You do not have permission to ban members.");
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("I do not have \`BAN_MEMBERS\` permission.");

        let reason = args.slice(1).join(" ");
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.channel.send('You need to state a user to ban. \`-ban @user reason\`');
        if (!mentionedMember) return message.channel.send("The member mentioned is not in this server.");
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot ban me with my own command.');
        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot ban yourself.');
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("You cannot ban this user because this user has a same or higher role than you.");
        if (!mentionedMember.bannable) return message.channel.send("I cannot ban that user because this user has a >= role than me.");
        if (!reason) reason = "No reason given.";
        if (reason == "_ _") reason = "No reason given";

        const banEmbed = new Discord.MessageEmbed()
            .setTitle(`You were banned from ${message.guild.name}`)
            .addField(`Reason: `, `${reason}`)
            .addField(`Action performed by: `, `${message.author.tag}`)
            .setColor("#f76d63")
            .setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());

        await mentionedMember.send(banEmbed).catch(err => console.log(err));
        await mentionedMember.ban({
            days: 7,
            reason: reason
        }).then(() => message.channel.send("Successfully banned " + mentionedMember.user.tag + ".")).catch(err => console.log(err));
    }
}