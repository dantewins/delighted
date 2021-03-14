const Discord = require('discord.js');

module.exports = {
    name: 'unban',
    category: "moderation",
    description: 'Unbans the mentioned user.',
    run: async (client, message, args) => {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send("You do not have permission to unban members.");
        if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send("I do not have \`BAN_MEMBERS\` permission.");

        let reason = args.slice(1).join(" ");
        let userID = args[0];
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!args[0]) return message.channel.send('You need to state a user to unban. \`-unban @user reason\`');
        if (isNaN(args[0])) return message.channel.send('The ID stated is not valid. \`-unban @user reason\`');
        if (!reason) return message.channel.send("Please state a reason. \`-unban @user reason\`");
        if (reason == "_ _") return message.channel.send("Please state a reason. \`-unban @user reason\`");

        message.guild.fetchBans().then(async bans => {
            if (bans.size == 0) return message.channel.send('This server does not have anyone banned.');
            let bUser = bans.find(b => b.user.id == userID);
            if (!bUser) return message.channel.send('The user ID stated is not banned yet.');
            await message.guild.members.unban(bUser.user, reason).catch(err => {
                console.log(err);
                return message.channel.send("Something went wrong while unbanning this user.");
            }).then(() => {
                message.channel.send(`Successfully unbanned ${args[0]}.`);
            })
        })
    }
}