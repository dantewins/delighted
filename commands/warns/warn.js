const Mongodb = require('../../models/modSchema');
const Discord = require('discord.js');

module.exports = {
    name: 'warn',
    category: "moderation",
    aliases: ['w'],
    description: 'Warns the mentioned user.',
    run: async (client, message, args, db) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('You do not have permission to warn members.');

        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.slice(1).join(" ");

        if (!args[0]) return message.channel.send('You need to state a user to warn. \`-warn @user reason\`');
        if (!mentionedMember) return message.channel.send("The member mentioned is not in this server.");
        if (mentionedMember.user.id == client.user.id) return message.channel.send('You cannot warn me with my own command.');
        if (mentionedMember.user.id == message.author.id) return message.channel.send('You cannot warn yourself.');
        if (mentionedMember.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("You cannot warn this user because this user has a same or higher role than you.");
        if (!reason) return message.channel.send("Please state a reason. \`-warn @user reason\`");
        if (reason == "_ _") return message.channel.send("Please state a reason. \`-warn @user reason\`");
        if (reason.length > 1024) return message.channel.send("Please shorten your reason to 1024 characters.");

        let caseNo = 1;
        const lastWarn = await Mongodb.findOne({ guildId: message.guild.id }).sort('-case');
        if (lastWarn) caseNo = lastWarn.case+1;

        const warn = new Mongodb({
            case: caseNo,
            guildId: message.guild.id,
            userId: mentionedMember.id,
            punishType: 'Warn',
            moderator: message.author.id,
            reason: reason
        });

        warn.save((err, data) => {
            if (err) return console.log(err);

            const warnEmbed = new Discord.MessageEmbed()
                .setTitle(`You were warned in ${message.guild.name}`)
                .addField(`Reason: `, `${reason}`)
                .addField(`Action performed by: `, `${message.author.tag}`)
                .setColor("#f76d63")
                .setTimestamp()
                .setFooter(client.user.tag, client.user.displayAvatarURL());
            mentionedMember.send(warnEmbed);

            const embed = new Discord.MessageEmbed()
                .setTitle(`${mentionedMember.user.tag} was successfully warned in ${message.guild.name}`)
                .addField(`Reason: `, `${reason}`)
                .addField(`Action performed by: `, `${message.author.tag}`)
                .setColor("#45d66b")
                .setTimestamp()
                .setFooter(client.user.tag, client.user.displayAvatarURL());
            message.channel.send(embed);
        });
    }
}