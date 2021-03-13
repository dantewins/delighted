const Discord = require('discord.js');

module.exports = {
    name: 'kick',
    category: "moderation",
    aliases: ['k'],
    description: 'Kicks the mentioned user.',
    run : async (client, message, args, db) => {
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You do not have permission to kick members.");
        if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.channel.send("I do not have \`KICK_MEMBERS\` permission.");

        let reason = args.slice(1).join(" ");
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.channel.send('You need to state a user to kick. \`-kick @user reason\`');
        if (!mentionedMember) return message.channel.send("The member mentioned is not in this server.");
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot kick me with my own command.');
        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot kick yourself.');
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("You cannot kick this user because this user has a same or higher role than you.");
        if (!mentionedMember.kickable) return message.channel.send("I cannot kick that user because this user has a >= role than me.");
        if (!reason) return message.channel.send("Please state a reason. \`-kick @user reason\`");
        if (reason == "_ _") return message.channel.send("Please state a reason. \`-kick @user reason\`");

        const kickEmbed = new Discord.MessageEmbed()
            .setTitle(`You were kicked from ${message.guild.name}`)
            .addField(`Reason: `, `${reason}`)
            .addField(`Action performed by: `, `${message.author.tag}`)
            .setColor("#f76d63")
            .setTimestamp()
            .setFooter(client.user.tag, client.user.displayAvatarURL());

        try {
            await mentionedMember.send(kickEmbed);
        } catch (err) {
            console.log(`I was unable to message the member.`);
        }

        try {
            await mentionedMember.kick(reason);
            message.channel.send("Successfully kicked " + mentionedMember.user.tag + ".")
        } catch (err) {
            console.log(err);
            message.channel.send("I was unable to kick the member mentioned.");
        }
    }
}